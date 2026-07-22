import { prisma } from "@/app/lib/prisma";

export async function getAuthenticatedUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getProfile(userId: string) {
  return getAuthenticatedUser(userId);
}

export async function updateProfile(userId: string, data: { name?: string; image?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function getOrCreateSettings(userId: string) {
  const existing = await prisma.settings.findUnique({ where: { userId } });

  if (existing) {
    return existing;
  }

  return prisma.settings.create({
    data: {
      userId,
      theme: "dark",
      notifications: true,
      emailNotifications: true,
      aiPreferences: {
        sentiment: true,
        categories: true,
        spam: true,
        keywords: true,
      },
      exportPreferences: {
        format: "json",
      },
    },
  });
}

export async function updateSettings(userId: string, data: Record<string, unknown>) {
  return prisma.settings.upsert({
    where: { userId },
    create: {
      userId,
      theme: "dark",
      notifications: true,
      emailNotifications: true,
      aiPreferences: {},
      exportPreferences: {},
    },
    update: data,
  });
}

export async function createNotification(userId: string, title: string, message: string, analysisId?: string) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      analysisId,
    },
  });
}

export async function createHistoryEntry(userId: string, analysisId: string, videoId: string, action = "created") {
  return prisma.history.create({
    data: {
      userId,
      analysisId,
      videoId,
      action,
    },
  });
}

export async function listAnalyses(userId: string, options: { search?: string; sort?: string; page?: number; limit?: number; bookmarked?: boolean } = {}) {
  const { search, sort = "desc", page = 1, limit = 10, bookmarked } = options;
  const where: Record<string, unknown> = { userId };

  if (bookmarked) {
    where.isBookmarked = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
    ];
  }

  const analyses = await prisma.analysis.findMany({
    where,
    include: {
      video: true,
      categories: true,
    },
    orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.analysis.count({ where });

  return {
    analyses,
    total,
    page,
    limit,
  };
}

export async function getAnalysisById(userId: string, analysisId: string) {
  return prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId,
    },
    include: {
      video: true,
      comments: true,
      categories: true,
    },
  });
}

export async function deleteAnalysis(userId: string, analysisId: string) {
  return prisma.analysis.deleteMany({
    where: {
      id: analysisId,
      userId,
    },
  });
}

export async function toggleBookmark(userId: string, analysisId: string) {
  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId },
  });

  if (!analysis) {
    throw new Error("Analysis not found");
  }

  return prisma.analysis.update({
    where: { id: analysisId },
    data: { isBookmarked: !analysis.isBookmarked },
  });
}

export async function getDashboardSummary(userId: string) {
  const [analyses, totalAnalyses, totalComments, sentimentCounts, recent, notifications] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { video: true },
    }),
    prisma.analysis.count({ where: { userId } }),
    prisma.comment.count({ where: { analysis: { userId } } }),
    prisma.analysis.groupBy({
      by: ["overallSentiment"],
      where: { userId },
      _count: { overallSentiment: true },
    }),
    prisma.analysis.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { video: true },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totals = {
    analyses: totalAnalyses,
    comments: totalComments,
    categories: await prisma.category.count({ where: { analysis: { userId } } }),
    positiveRate: sentimentCounts.find((item) => item.overallSentiment === "Positive")?._count.overallSentiment ?? 0,
  };

  return {
    stats: {
      videosAnalyzed: totals.analyses,
      comments: totalComments,
      aiCategories: totals.categories,
      positiveRate: totals.analyses ? Math.round((totals.positiveRate / totals.analyses) * 100) : 0,
    },
    recentAnalyses: analyses,
    notifications,
    charts: {
      weekly: recent.map((analysis) => ({
        label: new Date(analysis.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        comments: analysis.totalComments,
      })),
    },
  };
}
