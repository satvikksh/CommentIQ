"use client";

import { Brain, Loader2, CheckCircle2, Database, Sparkles } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

interface ProcessingStatusProps {
  status: "idle" | "fetching" | "processing" | "analyzing" | "completed" | "error";
}

const steps = [
  {
    title: "Validating YouTube URL",
    description: "Checking if the provided video URL is valid.",
    key: "fetching",
    icon: Database,
  },
  {
    title: "Fetching Video Details",
    description: "Loading title, thumbnail and metadata.",
    key: "fetching",
    icon: Database,
  },
  {
    title: "Downloading Comments",
    description: "Collecting comments from YouTube Data API.",
    key: "processing",
    icon: FaYoutube,
  },
  {
    title: "AI Categorization",
    description: "Grouping similar comments together.",
    key: "processing",
    icon: Brain,
  },
  {
    title: "Generating Insights",
    description: "Preparing summary and recommendations.",
    key: "processing",
    icon: Sparkles,
  },
];

export default function ProcessingStatus({ status }: ProcessingStatusProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          {status === "processing" ? (
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-red-500" />
          )}
        </div>

        <h2 className="text-3xl font-bold text-white">AI Analysis in Progress</h2>
        <p className="mt-3 text-zinc-400">Please wait while CommentIQ processes your YouTube comments.</p>
      </div>

      <div className="space-y-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active =
            (status === "processing" || status === "analyzing") &&
            step.key === "processing";
          const completed = status === "completed";

          return (
            <div key={index} className="flex items-start gap-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${completed ? "bg-green-500/10" : active ? "bg-red-500/10" : "bg-zinc-800"}`}>
                {active ? (
                  <Loader2 className="h-6 w-6 animate-spin text-red-400" />
                ) : (
                  <Icon className={`h-6 w-6 ${completed ? "text-green-400" : "text-zinc-500"}`} />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{step.description}</p>
              </div>

              <span className={`rounded-full px-3 py-1 text-xs font-medium ${completed ? "bg-green-500/10 text-green-400" : active ? "bg-red-500/10 text-red-400" : "bg-zinc-800 text-zinc-400"}`}>
                {completed ? "completed" : active ? "processing" : "pending"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-center text-zinc-300">
          Estimated remaining time: <span className="ml-2 font-semibold text-white">18 seconds</span>
        </p>
      </div>
    </section>
  );
}
