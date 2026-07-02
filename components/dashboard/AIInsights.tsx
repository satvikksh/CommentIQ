"use client";

import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Trending Topic",
    color: "text-green-400",
    bg: "bg-green-500/10",
    description:
      "Most viewers appreciated the practical examples and requested more advanced tutorials.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Frequently Asked",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    description:
      "Many users asked for the complete project source code and deployment guide.",
  },
  {
    icon: Lightbulb,
    title: "Feature Request",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    description:
      "Users want downloadable PDFs, timestamps, and beginner-friendly explanations.",
  },
  {
    icon: AlertTriangle,
    title: "Common Complaint",
    color: "text-red-400",
    bg: "bg-red-500/10",
    description:
      "Some viewers reported the audio quality could be improved in future videos.",
  },
];

export default function AIInsights() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400">
            <Sparkles className="h-4 w-4" />
            AI Generated
          </div>

          <h2 className="text-2xl font-bold text-white">
            AI Insights
          </h2>

          <p className="mt-2 text-zinc-400">
            Automatically generated summary of audience feedback.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-red-500/10 p-4 lg:flex">
          <Brain className="h-8 w-8 text-red-400" />
        </div>
      </div>

      {/* Overall Summary */}
      <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="mb-3 text-lg font-semibold text-white">
          Overall Summary
        </h3>

        <p className="leading-7 text-zinc-300">
          Audience response is overwhelmingly positive. Most viewers found
          the tutorial easy to understand and requested additional advanced
          content. Engagement is high, with many constructive suggestions and
          only a small number of complaints.
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition-all duration-300 hover:border-red-500/30 hover:bg-zinc-900"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`rounded-xl p-3 ${item.bg}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </div>

              <p className="leading-7 text-zinc-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
        <h3 className="mb-2 font-semibold text-white">
          Recommendation
        </h3>

        <p className="leading-7 text-zinc-400">
          Create a follow-up video answering the most common questions and
          provide downloadable resources. This is likely to improve engagement,
          viewer satisfaction, and watch time.
        </p>
      </div>
    </section>
  );
}