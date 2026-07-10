import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function monthKey(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const [
    recentAnalyses,
    allAnalyses,
    totalComments,
    bookmarkedReports,
    categoryCounts,
    sentimentCounts,
    notifications,
    recentComments,
    recentActivity,
  ] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId: user.id },
      include: { video: true, categories: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.analysis.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        videoId: true,
        totalComments: true,
        overallSentiment: true,
        aiMetadata: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.comment.count({ where: { analysis: { userId: user.id } } }),
    prisma.analysis.count({ where: { userId: user.id, isBookmarked: true } }),
    prisma.category.groupBy({
      by: ["name"],
      where: { analysis: { userId: user.id } },
      _sum: { count: true },
      orderBy: { _sum: { count: "desc" } },
      take: 10,
    }),
    prisma.analysis.groupBy({
      by: ["overallSentiment"],
      where: { userId: user.id },
      _count: { overallSentiment: true },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.comment.findMany({
      where: { analysis: { userId: user.id } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: { analysis: { include: { video: true } } },
    }),
    prisma.history.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { analysis: { include: { video: true, categories: true } } },
    }),
  ]);

  const totalAnalyses = allAnalyses.length;
  const uniqueVideos = new Set(allAnalyses.map((analysis) => analysis.videoId)).size;
  const totalSentiments = sentimentCounts.reduce(
    (sum, item) => sum + item._count.overallSentiment,
    0
  );
  const sentimentPercentages = sentimentCounts.map((item) => ({
    sentiment: item.overallSentiment ?? "Unknown",
    count: item._count.overallSentiment,
    percentage: totalSentiments
      ? Math.round((item._count.overallSentiment / totalSentiments) * 100)
      : 0,
  }));

  const monthlyActivityMap = new Map<string, number>();
  allAnalyses.forEach((analysis) => {
    const key = monthKey(analysis.createdAt);
    monthlyActivityMap.set(key, (monthlyActivityMap.get(key) ?? 0) + analysis.totalComments);
  });

  const latestMetadata = allAnalyses.at(-1)?.aiMetadata as Record<string, unknown> | null;
  const topCategories = categoryCounts.map((item) => ({
    name: item.name,
    value: item._sum.count ?? 0,
  }));

  return NextResponse.json({
    success: true,
    data: {
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      stats: {
        totalAnalyses,
        videosAnalyzed: uniqueVideos,
        comments: totalComments,
        bookmarkedReports,
        aiCategories: topCategories.reduce((sum, item) => sum + item.value, 0),
        positiveRate:
          sentimentPercentages.find((item) => item.sentiment === "Positive")?.percentage ?? 0,
        negativeRate:
          sentimentPercentages.find((item) => item.sentiment === "Negative")?.percentage ?? 0,
        neutralRate:
          sentimentPercentages.find((item) => item.sentiment === "Neutral")?.percentage ?? 0,
      },
      recentAnalyses,
      notifications,
      categoryDistribution: topCategories,
      sentiments: sentimentPercentages,
      monthlyActivity: Array.from(monthlyActivityMap.entries()).map(([month, comments]) => ({
        month,
        comments,
      })),
      recentComments: recentComments
        .filter((comment) => comment.analysis)
        .map((comment) => ({
          id: comment.id,
          author: comment.author,
          text: comment.text,
          category: comment.category,
          sentiment: comment.sentiment,
          likeCount: comment.likeCount,
          publishedAt: comment.publishedAt,
          videoTitle: comment.analysis?.video.title ?? "Unknown video",
        })),
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        action: activity.action,
        createdAt: activity.createdAt,
        title: activity.analysis.title ?? activity.analysis.video.title,
        totalComments: activity.analysis.totalComments,
        categoriesCount: activity.analysis.categories.length,
      })),
      insights: {
        summary: typeof latestMetadata?.summary === "string" ? latestMetadata.summary : null,
        questions: asStringArray(latestMetadata?.questions),
        featureRequests: asStringArray(latestMetadata?.featureRequests),
        complaints: asStringArray(latestMetadata?.complaints),
        recommendations: asStringArray(latestMetadata?.recommendations),
        trendingTopics: asStringArray(latestMetadata?.trendingTopics),
        mentionedProblems: asStringArray(latestMetadata?.mentionedProblems),
        actionableInsights: asStringArray(latestMetadata?.actionableInsights),
      },
    },
  });
}
