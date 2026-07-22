"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Brain, Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface VideoData {
  id: string;
  title: string;
  description?: string | null;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
}

interface AnalysisReport {
  id?: string;
  summary: string;
  overallSentiment?: string | null;
  totalComments?: number;
  aiMetadata?: {
    statistics?: {
      positive?: number;
      neutral?: number;
      negative?: number;
    };
  };
  categories: Array<{ name: string; count: number; summary?: string | null }>;
  comments: unknown[];
  video: VideoData;
}

function isCompleteAnalysisReport(value: unknown): value is AnalysisReport {
  if (!value || typeof value !== "object") {
    return false;
  }

  const report = value as Partial<AnalysisReport>;

  return (
    typeof report.summary === "string" &&
    report.summary.trim().length > 0 &&
    Array.isArray(report.categories) &&
    Array.isArray(report.comments) &&
    Boolean(report.video)
  );
}

export default function Hero() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState<VideoData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [remainingFreeAnalyses, setRemainingFreeAnalyses] = useState<number | null>(null);

  async function previewVideo() {
    if (!url.trim()) return;

    try {
      setLoadingPreview(true);
      setError(null);
      setLimitReached(false);
      setAnalysis(null);

      const response = await fetch("/api/youtube/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), maxResults: 1000 }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.details ?? data.error ?? "Unable to load video.");
      }

      setVideo(data.data);
    } catch (previewError) {
      setVideo(null);
      setError(previewError instanceof Error ? previewError.message : "Unable to load video.");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function analyzeVideo() {
    if (!url.trim()) return;

    try {
      setLoadingAnalysis(true);
      setError(null);
      setLimitReached(false);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.code === "ANONYMOUS_LIMIT_REACHED") {
          setLimitReached(true);
        }
        throw new Error(data.details ?? data.error ?? "Unable to analyze video.");
      }

      if (!isCompleteAnalysisReport(data.report)) {
        throw new Error("No Analysis Available: the API returned an incomplete analysis object.");
      }

      setVideo(data.report.video);
      setAnalysis(data.report);
      setRemainingFreeAnalyses(data.remainingFreeAnalyses ?? null);
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : "Unable to analyze video.");
    } finally {
      setLoadingAnalysis(false);
    }
  }

  const stats = analysis?.aiMetadata?.statistics;

  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-28 pb-16 text-white">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            <Sparkles className="h-4 w-4" />
            AI Powered Comment Intelligence
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Analyze YouTube Comments with AI
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">
            Paste a public YouTube URL to fetch real video metadata and analyze returned comments with the configured OpenRouter model.
          </p>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:flex-row">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="h-14 border-0 bg-transparent text-white placeholder:text-zinc-500 focus-visible:ring-0"
            />

            <Button
              size="lg"
              onClick={previewVideo}
              disabled={loadingPreview || loadingAnalysis || !url.trim()}
              className="h-14 rounded-xl bg-zinc-800 px-6 text-white hover:bg-zinc-700"
            >
              {loadingPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Preview
            </Button>

            <Button
              size="lg"
              onClick={analyzeVideo}
              disabled={loadingPreview || loadingAnalysis || !url.trim()}
              className="h-14 rounded-xl bg-red-600 px-8 text-white hover:bg-red-700"
            >
              {loadingAnalysis ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Analyze
            </Button>
          </div>

          {remainingFreeAnalyses !== null && (
            <p className="mt-4 text-sm text-zinc-400">
              Free analyses remaining: {remainingFreeAnalyses}
            </p>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5" />
                <div>
                  <p>{error}</p>
                  {limitReached && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button asChild className="bg-red-600 hover:bg-red-700">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {video ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="overflow-hidden rounded-2xl">
                <Image src={video.thumbnail} alt={video.title} width={1280} height={720} className="aspect-video w-full object-cover" />
              </div>

              <h2 className="mt-5 text-2xl font-bold">{video.title}</h2>
              <p className="mt-2 text-zinc-400">{video.channelTitle}</p>
              {video.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-500">{video.description}</p>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Published</p>
                  <p className="mt-1 font-semibold">{new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Duration</p>
                  <p className="mt-1 font-semibold">{video.duration}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Views</p>
                  <p className="mt-1 font-semibold">{video.views.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Comments</p>
                  <p className="mt-1 font-semibold">{video.comments.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Likes</p>
                  <p className="mt-1 font-semibold">{video.likes.toLocaleString()}</p>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-zinc-500 backdrop-blur-xl">
              Real YouTube video details will appear here after preview.
            </section>
          )}

          {analysis && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-bold">AI Summary</h2>
              <p className="mt-4 leading-7 text-zinc-300">{analysis.summary}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Sentiment</p>
                  <p className="mt-1 font-semibold">{analysis.overallSentiment ?? "Unknown"}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Positive</p>
                  <p className="mt-1 font-semibold">{stats?.positive ?? 0}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Neutral</p>
                  <p className="mt-1 font-semibold">{stats?.neutral ?? 0}</p>
                </div>
                <div className="rounded-xl bg-zinc-900/70 p-4">
                  <p className="text-xs text-zinc-500">Negative</p>
                  <p className="mt-1 font-semibold">{stats?.negative ?? 0}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
