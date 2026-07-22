import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";

import { analyzeComments } from "@/app/lib/ai/analyzeComments";
import { mergeResults } from "@/app/lib/ai/mergeResults";
import { mergedAnalysisSchema, type AIAnalysis } from "@/app/lib/ai/schema";
import {
  ANONYMOUS_ANALYSIS_LIMIT,
  ANONYMOUS_USAGE_COOKIE,
  incrementAnonymousUsage,
  readAnonymousUsage,
  serializeAnonymousUsage,
} from "@/app/lib/anonymousUsage";
import { getSessionUser } from "@/app/lib/auth/session";
import { isOpenRouterConfigError } from "@/app/lib/openrouter/client";
import { isOpenRouterRequestError } from "@/app/lib/openrouter/chat";
import { prisma } from "@/app/lib/prisma";
import { chunkArray } from "@/app/lib/utils/chunkArray";
import type { YouTubeComment } from "@/app/lib/youtube/getComments";
import { ensureVideoRecord, resolveVideoMetadata } from "@/app/services/youtube.service";

export const dynamic = "force-dynamic";

const analyzeRequestSchema = z.object({
  url: z.string().url(),
  maxResults: z.coerce.number().int().min(1).max(1000).default(1000),
  options: z.array(z.string()).optional(),
});

const completeReportSchema = z.object({
  id: z.string(),
  summary: z.string().trim().min(1),
  categories: z.array(z.unknown()),
  comments: z.array(z.unknown()),
}).passthrough();

function analysisFailure(details: string, status = 500) {
  console.error("[Analyze API] returning analysis failure", {
    status,
    details,
  });

  return NextResponse.json(
    {
      success: false,
      error: "AI analysis failed",
      details,
    },
    { status }
  );
}

function openRouterFailure(error: unknown) {
  if (isOpenRouterConfigError(error)) {
    const body = {
      success: false,
      status: error.status,
      error: error.message,
      endpoint: error.endpoint,
      details: error.details,
    };

    console.error("[Analyze API] returning OpenRouter configuration failure", body);

    return NextResponse.json(body, { status: error.status });
  }

  if (!isOpenRouterRequestError(error)) {
    return null;
  }

  const body = error.toResponseBody();

  console.error("[Analyze API] returning OpenRouter failure", body);

  return NextResponse.json(body, { status: error.status });
}

function validateCompleteReport(report: unknown) {
  const parsed = completeReportSchema.safeParse(report);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => issue.path.join(".") || issue.message)
      .join(", ");

    return {
      success: false as const,
      details: `Incomplete analysis object: ${missing}`,
    };
  }

  return {
    success: true as const,
    report: parsed.data,
  };
}

interface AnalysisCategoryResult {
  name: string;
  count?: number;
  summary?: string;
  sampleComments?: string[];
}

type Sentiment = "Positive" | "Neutral" | "Negative";

interface AnalyzedComment extends YouTubeComment {
  sentiment: Sentiment;
}

function normalizeSentiment(value: unknown): Sentiment {
  return value === "Positive" || value === "Negative" || value === "Neutral"
    ? value
    : "Neutral";
}

function countCommentSentiments(comments: Array<{ sentiment?: string | null }>) {
  return comments.reduce(
    (counts, comment) => {
      const sentiment = normalizeSentiment(comment.sentiment);
      const key = sentiment.toLowerCase() as "positive" | "neutral" | "negative";

      counts[key] += 1;
      return counts;
    },
    {
      positive: 0,
      neutral: 0,
      negative: 0,
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    console.log("[Analyze API] request received");
    const user = await getSessionUser(req);
    const parsed = analyzeRequestSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request body." },
        { status: 400 }
      );
    }

    const { url, maxResults } = parsed.data;
    console.log("[Analyze API] request validated", {
      authenticated: Boolean(user),
      maxResults,
    });

    if (!user) {
      const usage = readAnonymousUsage(req);

      if (usage.count >= ANONYMOUS_ANALYSIS_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            error: "You have reached your free analysis limit.",
            code: "ANONYMOUS_LIMIT_REACHED",
          },
          { status: 403 }
        );
      }
    }

    console.log("[Analyze API] fetching YouTube video and comments");
    const { video, comments } = await resolveVideoMetadata(url);
    console.log("[Analyze API] YouTube fetch complete", {
      videoId: video.id,
      title: video.title,
      fetchedComments: comments.length,
    });

    if (!comments.length) {
      return NextResponse.json(
        { success: false, error: "No Analysis Available", details: "No comments found for this video." },
        { status: 404 }
      );
    }

    const limitedComments = comments.slice(0, Number(maxResults));
    console.log("[Analyze API] comments selected for analysis", {
      limitedComments: limitedComments.length,
    });

    if (user) {
      const existingAnalysis = await prisma.analysis.findFirst({
        where: {
          userId: user.id,
          video: {
            youtubeId: video.id,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (existingAnalysis) {
        const recent = Date.now() - new Date(existingAnalysis.createdAt).getTime();
        if (recent < 1000 * 60 * 60 * 24) {
          const cachedAnalysis = await prisma.analysis.findUnique({
            where: { id: existingAnalysis.id },
            include: {
              video: true,
              categories: true,
              comments: true,
            },
          });

          const cachedValidation = validateCompleteReport(cachedAnalysis);

          if (cachedValidation.success) {
            console.log("[Analyze API] returning valid cached analysis", {
              analysisId: existingAnalysis.id,
            });
            return NextResponse.json({ success: true, report: cachedValidation.report, cached: true });
          }

          console.error("[Analyze API] cached analysis is incomplete; creating fresh analysis", {
            analysisId: existingAnalysis.id,
            details: cachedValidation.details,
          });
        }
      }
    }

    const chunks = chunkArray(limitedComments, 80);
    const chunkResults: AIAnalysis[] = [];
    const commentSentiments = new Map<number, Sentiment>();
    console.log("[Analyze API] OpenRouter analysis starting", {
      chunks: chunks.length,
    });

    for (const [index, chunk] of chunks.entries()) {
      console.log("[Analyze API] analyzing chunk", {
        chunk: index + 1,
        totalChunks: chunks.length,
        comments: chunk.length,
      });
      const result = await analyzeComments(chunk.map((comment) => comment.text));
      chunkResults.push(result);

      const chunkStart = index * 80;

      for (const sentimentComment of result.sentimentComments) {
        const localIndex = sentimentComment.index - 1;
        const globalIndex = chunkStart + localIndex;

        if (localIndex >= 0 && localIndex < chunk.length && globalIndex < limitedComments.length) {
          commentSentiments.set(globalIndex, sentimentComment.sentiment);
        }
      }
    }

    console.log("[Analyze API] merging AI results", {
      chunks: chunkResults.length,
    });
    const merged = mergeResults(chunkResults);
    const mergedValidation = mergedAnalysisSchema.safeParse(merged);

    if (!mergedValidation.success) {
      console.error("[Analyze API] merged analysis validation failed", mergedValidation.error.issues);
      return analysisFailure(
        `Merged analysis is incomplete: ${mergedValidation.error.issues.map((issue) => issue.path.join(".") || issue.message).join(", ")}`
      );
    }

    const analyzedComments: AnalyzedComment[] = limitedComments.map((comment, index) => ({
      ...comment,
      sentiment: commentSentiments.get(index) ?? "Neutral",
    }));
    const displayedSentimentCounts = countCommentSentiments(analyzedComments);
    const analysisMetadata = {
      ...mergedValidation.data,
      statistics: displayedSentimentCounts,
      sentimentComments: analyzedComments.map((comment, index) => ({
        index: index + 1,
        sentiment: comment.sentiment,
      })),
    };

    console.log("[Analyze API] merged analysis validated", {
      categories: mergedValidation.data.categories.length,
      summaryCharacters: mergedValidation.data.summary.length,
      displayedSentimentCounts,
    });

    if (!user) {
      const updatedUsage = incrementAnonymousUsage(req);
      const anonymousReport = {
        id: `temporary-${randomUUID()}`,
        video,
        title: video.title,
        summary: mergedValidation.data.summary,
        overallSentiment: mergedValidation.data.overallSentiment,
        totalComments: analyzedComments.length,
        analyzedChunks: chunkResults.length,
        aiMetadata: analysisMetadata,
        keywords: mergedValidation.data.keywords,
        featureRequests: mergedValidation.data.featureRequests,
        bugReports: mergedValidation.data.bugReports,
        questions: mergedValidation.data.questions,
        complaints: mergedValidation.data.complaints,
        spam: mergedValidation.data.spam,
        recommendations: mergedValidation.data.recommendations,
        categories: mergedValidation.data.categories,
        comments: analyzedComments.map((comment) => ({
          id: comment.id,
          author: comment.author,
          text: comment.text,
          likeCount: comment.likeCount,
          publishedAt: comment.publishedAt,
          sentiment: comment.sentiment,
        })),
      };
      const anonymousValidation = validateCompleteReport(anonymousReport);

      if (!anonymousValidation.success) {
        console.error("[Analyze API] anonymous report validation failed", anonymousValidation.details);
        return analysisFailure(anonymousValidation.details);
      }

      console.log("[Analyze API] returning anonymous analysis", {
        comments: anonymousReport.comments.length,
        categories: anonymousReport.categories.length,
      });

      const response = NextResponse.json({
        success: true,
        cached: false,
        anonymous: true,
        remainingFreeAnalyses: Math.max(0, ANONYMOUS_ANALYSIS_LIMIT - updatedUsage.count),
        report: anonymousValidation.report,
      });

      response.cookies.set({
        name: ANONYMOUS_USAGE_COOKIE,
        value: serializeAnonymousUsage(updatedUsage),
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    }

    console.log("[Analyze API] saving analysis to database");
    const videoRecord = await ensureVideoRecord(video);

    const created = await prisma.$transaction(async (tx) => {
      const analysisRecord = await tx.analysis.create({
        data: {
          userId: user.id,
          videoId: videoRecord.id,
          title: video.title,
          summary: mergedValidation.data.summary,
          overallSentiment: mergedValidation.data.overallSentiment,
          totalComments: analyzedComments.length,
          analyzedChunks: chunkResults.length,
          aiMetadata: analysisMetadata,
          keywords: mergedValidation.data.keywords,
          featureRequests: mergedValidation.data.featureRequests,
          bugReports: mergedValidation.data.bugReports,
          questions: mergedValidation.data.questions,
          complaints: mergedValidation.data.complaints,
          spam: mergedValidation.data.spam,
          recommendations: mergedValidation.data.recommendations,
        },
      });

      if (mergedValidation.data.categories.length) {
        await tx.category.createMany({
          data: mergedValidation.data.categories.map((category: AnalysisCategoryResult) => ({
            analysisId: analysisRecord.id,
            name: category.name,
            count: category.count ?? 0,
            summary: category.summary,
            sampleComments: category.sampleComments,
          })),
        });
      }

      if (analyzedComments.length) {
        await tx.comment.createMany({
          data: analyzedComments.map((comment) => ({
            videoId: videoRecord.id,
            analysisId: analysisRecord.id,
            author: comment.author ?? "Unknown",
            text: comment.text,
            likeCount: comment.likeCount ?? 0,
            publishedAt: comment.publishedAt ? new Date(comment.publishedAt) : null,
            sentiment: comment.sentiment,
          })),
        });
      }

      await tx.history.create({
        data: {
          userId: user.id,
          analysisId: analysisRecord.id,
          videoId: videoRecord.id,
          action: "created",
        },
      });

      return analysisRecord;
    });
    console.log("[Analyze API] database save complete", {
      analysisId: created.id,
    });

    const analysis = await prisma.analysis.findUnique({
      where: { id: created.id },
      include: {
        video: true,
        categories: true,
        comments: true,
      },
    });

    const analysisValidation = validateCompleteReport(analysis);

    if (!analysisValidation.success) {
      console.error("[Analyze API] saved analysis validation failed", analysisValidation.details);
      return analysisFailure(analysisValidation.details);
    }

    console.log("[Analyze API] returning saved analysis", {
      analysisId: created.id,
    });

    return NextResponse.json({ success: true, report: analysisValidation.report, cached: false });
  } catch (error: unknown) {
    const openRouterResponse = openRouterFailure(error);

    if (openRouterResponse) {
      return openRouterResponse;
    }

    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Analyze API] failed", error);

    if (
      message.includes("OpenRouter") ||
      message.includes("AI returned") ||
      message.includes("AI analysis validation") ||
      message.includes("AI timeout") ||
      message.includes("fallback model")
    ) {
      const status = message.includes("timeout") ? 504 : 502;
      return analysisFailure(message, status);
    }

    return NextResponse.json(
      { success: false, error: "Analysis failed", details: message },
      { status: 500 }
    );
  }
}
