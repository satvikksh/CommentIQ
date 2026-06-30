"use client";

import { useState } from "react";
import { Sparkles, PlayCircle, Star } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Hero() {
  const [url, setUrl] = useState("");

  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-36 pb-28 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[140px] animate-pulse" />

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-red-500/10 blur-[120px]" />

        <div className="absolute left-0 top-1/2 h-[250px] w-[250px] rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-20 px-6 lg:flex-row">
        {/* Left */}
        <div className="flex-1">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            <Sparkles className="h-4 w-4" />
            AI Powered Comment Intelligence
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Analyze
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              YouTube Comments{" "}
            </span>
            with AI
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Stop reading thousands of comments manually.
            Instantly discover viewer opinions, questions,
            complaints, feature requests, and trending topics
            using AI.
          </p>

          {/* URL Input */}
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:flex-row">
            <Input
              placeholder="Paste YouTube video URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-14 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
            />

            <Button
              size="lg"
              className="h-14 rounded-xl bg-red-600 px-8 text-white hover:bg-red-700"
            >
              Analyze Now
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              4.9/5 Rating
            </div>

            <div className="flex items-center gap-2">
             <FaYoutube className="h-4 w-4 text-red-500" />
              Built for Creators
            </div>

            <div className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-green-500" />
              No Installation Required
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6">
            <div>
              <h2 className="text-4xl font-bold">50K+</h2>
              <p className="mt-2 text-zinc-500">
                Comments Analyzed
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">98%</h2>
              <p className="mt-2 text-zinc-500">
                AI Accuracy
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold">&lt;5s</h2>
              <p className="mt-2 text-zinc-500">
                Analysis Time
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex-1">
          {/* Main Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  AI Summary
                </h3>
                <p className="text-sm text-zinc-500">
                  YouTube Video Analysis
                </p>
              </div>

              <div className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                Completed
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["❤️ Positive", "78%"],
                ["❓ Questions", "126"],
                ["💡 Suggestions", "48"],
                ["🐞 Complaints", "21"],
                ["📹 Requests", "74"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-4"
                >
                  <span>{label}</span>

                  <span className="font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Card 1 */}
          <div className="absolute -left-8 top-10 hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-lg lg:block">
            <p className="text-xs text-zinc-500">
              Sentiment
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-400">
              82%
            </h3>

            <p className="text-sm text-zinc-400">
              Positive
            </p>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute -bottom-6 right-0 hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-lg lg:block">
            <p className="text-xs text-zinc-500">
              Categories
            </p>

            <h3 className="mt-1 text-3xl font-bold">
              12
            </h3>

            <p className="text-sm text-zinc-400">
              AI Generated
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}