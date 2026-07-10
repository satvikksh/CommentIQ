"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentAnalysis from "@/components/dashboard/RecentAnalysis";
import AnalysisChart from "@/components/dashboard/AnalysisChart";
import SentimentChart from "@/components/dashboard/SentimentChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import AIInsights from "@/components/dashboard/AIInsights";
import TopCategories from "@/components/dashboard/TopCategories";
import RecentComments from "@/components/dashboard/RecentComments";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

interface DashboardData {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  stats: {
    totalAnalyses: number;
    videosAnalyzed: number;
    comments: number;
    bookmarkedReports: number;
    aiCategories: number;
    positiveRate: number;
    negativeRate: number;
    neutralRate: number;
  };
  recentAnalyses: Array<{
    id: string;
    title?: string | null;
    summary?: string | null;
    totalComments: number;
    overallSentiment?: string | null;
    video: {
      title: string;
      channelTitle?: string | null;
    };
  }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  sentiments: Array<{ sentiment: string; count: number; percentage: number }>;
  monthlyActivity: Array<{ month: string; comments: number }>;
  recentComments: Array<{
    id: string;
    author?: string | null;
    text: string;
    category?: string | null;
    sentiment?: string | null;
    likeCount: number;
    publishedAt?: string | Date | null;
    videoTitle: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string | Date;
    title: string;
    totalComments: number;
    categoriesCount: number;
  }>;
  insights: {
    summary?: string | null;
    questions: string[];
    featureRequests: string[];
    complaints: string[];
    recommendations: string[];
    trendingTopics: string[];
    mentionedProblems: string[];
    actionableInsights: string[];
  };
}

interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  error?: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/dashboard");
        const payload = (await response.json()) as DashboardResponse;

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error ?? "Unable to load dashboard.");
        }

        setData(payload.data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="space-y-8 p-8">
          <DashboardHeader />

          {loading && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
              {error}
            </div>
          )}

          {data && (
            <>
              <WelcomeBanner user={data.user} stats={data.stats} />
              <StatsCards stats={data.stats} />
              <QuickActions />

              <div className="grid gap-8 xl:grid-cols-2">
                <AnalysisChart data={data.monthlyActivity} />
                <SentimentChart data={data.sentiments} />
              </div>

              <div className="grid gap-8 xl:grid-cols-2">
                <AIInsights insights={data.insights} />
                <TopCategories categories={data.categoryDistribution} />
              </div>

              <CategoryChart data={data.categoryDistribution} />
              <RecentComments comments={data.recentComments} />

              <div className="grid gap-8 xl:grid-cols-2">
                <RecentAnalysis items={data.recentAnalyses} />
                <ActivityFeed activities={data.recentActivity} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
