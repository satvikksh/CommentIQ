import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const [analyses, totalComments, categoryCounts, sentimentCounts, notifications] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId: user.id },
      include: { video: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.comment.count({ where: { analysis: { userId: user.id } } }),
    prisma.category.groupBy({
      by: ["name"],
      where: { analysis: { userId: user.id } },
      _sum: { count: true },
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
  ]);

  const positive = sentimentCounts.find((item) => item.overallSentiment === "Positive")?._count.overallSentiment ?? 0;
  const totalAnalyses = await prisma.analysis.count({ where: { userId: user.id } });
  const categories = categoryCounts.map((item) => ({ name: item.name, value: item._sum.count ?? 0 }));

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        videosAnalyzed: totalAnalyses,
        comments: totalComments,
        aiCategories: categories.reduce((sum, item) => sum + item.value, 0),
        positiveRate: totalAnalyses ? Math.round((positive / totalAnalyses) * 100) : 0,
      },
      recentAnalyses: analyses,
      notifications,
      categoryDistribution: categories,
      sentiments: sentimentCounts.map((item) => ({ sentiment: item.overallSentiment, count: item._count.overallSentiment })),
    },
  });
}
