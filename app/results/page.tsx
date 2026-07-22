"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

import AnalysisSummary from "@/app/components/analysis/AnalysisSummary";
import SentimentCommentSections from "@/app/components/analysis/SentimentCommentSections";
import Sidebar from "@/app/components/dashboard/Sidebar";
import TopNavbar from "@/app/components/dashboard/TopNavbar";
import { Button } from "@/app/components/ui/button";

interface ResultComment {
  id: string;
  author?: string | null;
  text: string;
  sentiment?: string | null;
  likeCount?: number | null;
  publishedAt?: string | Date | null;
}

interface ResultAnalysis {
  id: string;
  summary: string;
  totalComments?: number;
  categories: unknown[];
  comments: ResultComment[];
  aiMetadata?: {
    statistics?: {
      positive?: number;
      neutral?: number;
      negative?: number;
    };
  } | null;
}

interface HistoryDetailResponse {
  success: boolean;
  data?: ResultAnalysis;
  error?: string;
}

function isResultAnalysis(value: unknown): value is ResultAnalysis {
  if (!value || typeof value !== "object") {
    return false;
  }

  const analysis = value as Partial<ResultAnalysis>;

  return (
    typeof analysis.id === "string" &&
    typeof analysis.summary === "string" &&
    Array.isArray(analysis.categories) &&
    Array.isArray(analysis.comments)
  );
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<ResultAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const analysisId = params.get("analysisId");

    if (!analysisId) {
      return;
    }

    const controller = new AbortController();

    async function loadAnalysis() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/history/${analysisId}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as HistoryDetailResponse;

        if (!response.ok || !data.success || !isResultAnalysis(data.data)) {
          throw new Error(data.error ?? "Unable to load analysis results.");
        }

        setAnalysis(data.data);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load analysis results.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalysis();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {loading && (
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
              <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
            </div>
          )}

          {error && (
            <section className="mx-auto w-full max-w-3xl rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-100">
              {error}
            </section>
          )}

          {!loading && !error && analysis && (
            <div className="mx-auto max-w-7xl space-y-8">
              <AnalysisSummary analysis={analysis} />
              <SentimentCommentSections comments={analysis.comments} />
            </div>
          )}

          {!loading && !error && !analysis && (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
              <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                  <BarChart3 className="h-8 w-8 text-red-400" />
                </div>
                <h1 className="text-3xl font-black">Analysis Results</h1>
                <p className="mx-auto mt-3 max-w-xl text-zinc-400">
                  Completed reports are available from the analyze page after a run, and previous reports live in history.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href="/analyze">
                      New Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/history">Open History</Link>
                  </Button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
