"use client";

import { Brain, Sparkles, TrendingUp, TrendingDown, Smile, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";

interface AnalysisSummaryProps {
  summary: string;
  positiveScore: number;
  commentCount: number;
  categoryCount: number;
  negativeRate: number;
}

export default function AnalysisSummary({ summary, positiveScore, commentCount, categoryCount, negativeRate }: AnalysisSummaryProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-400">
            <Brain className="h-4 w-4" />
            AI Generated Summary
          </div>
          <h2 className="text-3xl font-black text-white">Audience Insights</h2>
          <p className="mt-2 text-zinc-400">AI summarized thousands of comments into actionable insights.</p>
        </div>

        <div className="hidden lg:flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <Sparkles className="h-8 w-8 text-red-400" />
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Overall Audience Satisfaction</h3>
            <p className="mt-2 text-zinc-300">The community response is highly positive with strong engagement.</p>
          </div>

          <div className="text-right">
            <h2 className="text-5xl font-black text-green-400">{positiveScore}%</h2>
            <p className="text-sm text-zinc-400">Positive Score</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/60 p-6">
        <p className="leading-7 text-zinc-400">{summary || "AI summary will appear here once the analysis completes."}</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <CheckCircle2 className="mb-3 h-6 w-6 text-green-400" />
          <h3 className="text-3xl font-black text-white">{commentCount.toLocaleString()}</h3>
          <p className="mt-2 text-zinc-500">Comments Analyzed</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <TrendingUp className="mb-3 h-6 w-6 text-red-400" />
          <h3 className="text-3xl font-black text-white">{categoryCount}</h3>
          <p className="mt-2 text-zinc-500">AI Categories</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <TrendingDown className="mb-3 h-6 w-6 text-yellow-400" />
          <h3 className="text-3xl font-black text-white">{negativeRate}%</h3>
          <p className="mt-2 text-zinc-500">Negative Comments</p>
        </div>
      </div>
    </section>
  );
}
