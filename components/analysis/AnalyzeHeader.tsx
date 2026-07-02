"use client";

import { Brain, Sparkles, PlayCircle } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

export default function AnalyzeHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 p-8 text-white shadow-2xl">

      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}
        <div className="max-w-3xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            AI Powered Analysis
          </div>

          <h1 className="text-5xl font-black leading-tight">
            Analyze YouTube Comments
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-red-100">
            Paste any public YouTube video URL and let AI automatically
            fetch, organize, categorize and summarize thousands of
            comments into meaningful insights.
          </p>

        </div>

        {/* Right */}
        <div className="grid gap-5 sm:grid-cols-2">

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
            <FaYoutube className="mb-4 h-8 w-8" />

            <h2 className="text-3xl font-black">
              Unlimited
            </h2>

            <p className="mt-2 text-red-100">
              Videos
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xl">
            <Brain className="mb-4 h-8 w-8" />

            <h2 className="text-3xl font-black">
              AI
            </h2>

            <p className="mt-2 text-red-100">
              Categorization
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}