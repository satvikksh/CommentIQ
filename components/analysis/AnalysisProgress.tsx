"use client";

import { Brain, Clock3, MessageSquare, Activity, CheckCircle2 } from "lucide-react";

interface AnalysisProgressProps {
  progress: number;
  processedComments: number;
  categoriesCount: number;
  elapsedSeconds: number;
  remainingSeconds: number;
}

export default function AnalysisProgress({
  progress,
  processedComments,
  categoriesCount,
  elapsedSeconds,
  remainingSeconds,
}: AnalysisProgressProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-400">
            <Activity className="h-4 w-4 animate-pulse" />
            Live Progress
          </div>

          <h2 className="text-3xl font-bold text-white">AI Analysis Progress</h2>
          <p className="mt-2 text-zinc-400">CommentIQ is processing comments and generating insights.</p>
        </div>

        <div className="text-right">
          <h3 className="text-5xl font-black text-red-500">{progress}%</h3>
          <p className="text-zinc-400">Completed</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-zinc-900/60 p-5">
          <MessageSquare className="mb-3 h-6 w-6 text-red-400" />
          <p className="text-sm text-zinc-500">Comments Processed</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{processedComments.toLocaleString()}</h3>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 p-5">
          <Brain className="mb-3 h-6 w-6 text-red-400" />
          <p className="text-sm text-zinc-500">Categories Found</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{categoriesCount}</h3>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 p-5">
          <Clock3 className="mb-3 h-6 w-6 text-red-400" />
          <p className="text-sm text-zinc-500">Elapsed Time</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{elapsedSeconds}s</h3>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 p-5">
          <CheckCircle2 className="mb-3 h-6 w-6 text-red-400" />
          <p className="text-sm text-zinc-500">Remaining</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{remainingSeconds}s</h3>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
        <p className="text-center text-zinc-300">
          🚀 AI has already processed over <span className="mx-2 font-bold text-white">{processedComments.toLocaleString()}</span> comments and is now generating the final summary.
        </p>
      </div>
    </section>
  );
}
