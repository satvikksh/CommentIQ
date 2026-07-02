"use client";

import {
  Heart,
  Lightbulb,
  MessageCircleQuestion,
  Bug,
  Video,
  Laugh,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    title: "Appreciation",
    icon: Heart,
    comments: 512,
    percentage: 38,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    title: "Questions",
    icon: MessageCircleQuestion,
    comments: 243,
    percentage: 24,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Suggestions",
    icon: Lightbulb,
    comments: 178,
    percentage: 17,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Content Requests",
    icon: Video,
    comments: 124,
    percentage: 12,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Bug Reports",
    icon: Bug,
    comments: 58,
    percentage: 6,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    title: "Funny Comments",
    icon: Laugh,
    comments: 31,
    percentage: 3,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function TopCategories() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Top AI Categories
          </h2>

          <p className="mt-2 text-zinc-400">
            Similar comments grouped automatically by AI.
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300">
          View All

          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-5">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.title}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition-all duration-300 hover:border-red-500/30 hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-3 ${category.bg}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${category.color}`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {category.title}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {category.comments} comments
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold text-white">
                  {category.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                  style={{
                    width: `${category.percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="leading-7 text-zinc-300">
          AI successfully organized <strong>1,146 comments</strong> into{" "}
          <strong>6 meaningful categories</strong>, helping you understand
          audience feedback without reading every comment manually.
        </p>
      </div>
    </section>
  );
}