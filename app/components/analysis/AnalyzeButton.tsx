"use client";

import { Brain, Loader2, Sparkles, Clock3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyzeButtonProps {
  onAnalyze: () => Promise<void>;
  loading: boolean;
  disabled?: boolean;
}

export default function AnalyzeButton({ onAnalyze, loading, disabled }: AnalyzeButtonProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-400">
            <Sparkles className="h-4 w-4" />
            Ready to Analyze
          </div>

          <h2 className="text-3xl font-bold text-white">Start AI Comment Analysis</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            CommentIQ will fetch YouTube comments, organize them into meaningful categories, detect sentiment, discover feature requests, identify bug reports, and generate a complete AI summary.
          </p>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-red-400" />
              20–40 sec
            </div>

            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-red-400" />
              AI Processing
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-400" />
              Smart Categorization
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button onClick={onAnalyze} disabled={loading || disabled} size="lg" className="h-16 min-w-[260px] rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-8 text-lg font-semibold hover:from-red-700 hover:to-orange-600">
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Analyzing Comments...
              </>
            ) : (
              <>
                <Brain className="mr-3 h-5 w-5" />
                Analyze Comments
                <ArrowRight className="ml-3 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-zinc-500">
            Supports public YouTube videos with up to
            <br />
            <span className="font-semibold text-white">100,000+ comments</span>
          </p>
        </div>
      </div>
    </section>
  );
}
