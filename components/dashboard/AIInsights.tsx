"use client";

import { Brain, AlertTriangle, Lightbulb, MessageCircleQuestion, Sparkles, TrendingUp } from "lucide-react";

interface AIInsightsProps {
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

export default function AIInsights({ insights }: AIInsightsProps) {
  const cards = [
    {
      icon: TrendingUp,
      title: "Trending Topic",
      color: "text-green-400",
      bg: "bg-green-500/10",
      value: insights.trendingTopics[0],
    },
    {
      icon: MessageCircleQuestion,
      title: "Frequently Asked",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      value: insights.questions[0],
    },
    {
      icon: Lightbulb,
      title: "Feature Request",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      value: insights.featureRequests[0],
    },
    {
      icon: AlertTriangle,
      title: "Common Complaint",
      color: "text-red-400",
      bg: "bg-red-500/10",
      value: insights.complaints[0] ?? insights.mentionedProblems[0],
    },
  ].filter((item) => item.value);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400">
            <Sparkles className="h-4 w-4" />
            AI Generated
          </div>
          <h2 className="text-2xl font-bold text-white">AI Insights</h2>
          <p className="mt-2 text-zinc-400">Latest insight from your newest stored analysis.</p>
        </div>

        <div className="hidden rounded-2xl bg-red-500/10 p-4 lg:flex">
          <Brain className="h-8 w-8 text-red-400" />
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="mb-3 text-lg font-semibold text-white">Overall Summary</h3>
        <p className="leading-7 text-zinc-300">
          {insights.summary ?? "No AI summary is available yet. Run an analysis to populate this section."}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center text-zinc-500">
          No detailed AI insight cards yet.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                <div className="mb-4 flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${item.bg}`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p className="leading-7 text-zinc-400">{item.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {insights.recommendations[0] && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <h3 className="mb-2 font-semibold text-white">Recommendation</h3>
          <p className="leading-7 text-zinc-400">{insights.recommendations[0]}</p>
        </div>
      )}
    </section>
  );
}
