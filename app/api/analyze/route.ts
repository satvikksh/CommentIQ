import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { analyzeComments } from "@/lib/ai/analyzeComments";
import { mergeResults } from "@/lib/ai/mergeResults";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { chunkArray } from "@/lib/utils/chunkArray";
import { ensureVideoRecord, resolveVideoMetadata } from "@/services/youtube.service";

export const dynamic = "force-dynamic";

const analyzeRequestSchema = z.object({
  url: z.string().url(),
  maxResults: z.coerce.number().int().min(1).max(1000).default(1000),
  options: z.array(z.string()).optional(),
});

interface AnalysisCategoryResult {
  name: string;
  count?: number;
  summary?: string;
  sampleComments?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const parsed = analyzeRequestSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request body." },
        { status: 400 }
      );
    }

    const { url, maxResults } = parsed.data;
    const { video, comments } = await resolveVideoMetadata(url);

    if (!comments.length) {
      return NextResponse.json({ success: false, error: "No comments found." }, { status: 404 });
    }

    const limitedComments = comments.slice(0, Number(maxResults));
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

        return NextResponse.json({ success: true, report: cachedAnalysis, cached: true });
      }
    }

    const videoRecord = await ensureVideoRecord(video);
    const chunks = chunkArray(limitedComments.map((comment) => comment.text), 80);
    const chunkResults = [] as Array<Record<string, unknown>>;

    for (const chunk of chunks) {
      const result = await analyzeComments(chunk);
      chunkResults.push(result);
    }

    const merged = mergeResults(chunkResults as Array<Record<string, unknown>>);

    const created = await prisma.$transaction(async (tx) => {
      const analysisRecord = await tx.analysis.create({
        data: {
          userId: user.id,
          videoId: videoRecord.id,
          title: video.title,
          summary: merged.summary,
          overallSentiment: merged.overallSentiment,
          totalComments: limitedComments.length,
          analyzedChunks: chunkResults.length,
          aiMetadata: merged,
          keywords: merged.keywords,
          featureRequests: merged.featureRequests,
          bugReports: merged.bugReports,
          questions: merged.questions,
          complaints: merged.complaints,
          spam: merged.spam,
          recommendations: merged.recommendations,
        },
      });

      if (merged.categories?.length) {
        await tx.category.createMany({
          data: merged.categories.map((category: AnalysisCategoryResult) => ({
            analysisId: analysisRecord.id,
            name: category.name,
            count: category.count ?? 0,
            summary: category.summary ?? null,
            sampleComments: category.sampleComments ?? [],
          })),
        });
      }

      if (limitedComments.length) {
        await tx.comment.createMany({
          data: limitedComments.map((comment) => ({
            videoId: videoRecord.id,
            analysisId: analysisRecord.id,
            author: comment.author ?? "Unknown",
            text: comment.text,
            likeCount: comment.likeCount ?? 0,
            publishedAt: comment.publishedAt ? new Date(comment.publishedAt) : null,
            sentiment: merged.overallSentiment ?? "Neutral",
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

    const analysis = await prisma.analysis.findUnique({
      where: { id: created.id },
      include: {
        video: true,
        categories: true,
        comments: true,
      },
    });

    return NextResponse.json({ success: true, report: analysis, cached: false });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error(message);

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
