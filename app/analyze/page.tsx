"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

import AnalyzeHeader from "@/components/analysis/AnalyzeHeader";
import UrlInput from "@/components/analysis/UrlInput";
import VideoPreview from "@/components/analysis/VideoPreview";
import AnalysisOptions from "@/components/analysis/AnalysisOptions";
import AnalyzeButton from "@/components/analysis/AnalyzeButton";
import ProcessingStatus from "@/components/analysis/ProcessingStatus";
import AnalysisProgress from "@/components/analysis/AnalysisProgress";
import AnalysisSummary from "@/components/analysis/AnalysisSummary";
import CategoryGrid from "@/components/analysis/CategoryGrid";
import CommentsTable from "@/components/analysis/CommentsTable";
import ExportActions from "@/components/analysis/ExportActions";

type AnalysisStatus = "idle" | "fetching" | "analyzing" | "completed" | "error";

interface VideoData {
  id: string;
  title: string;
  description?: string | null;
  thumbnail: string;
  channelTitle: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  duration: string;
}

interface CategoryData {
  name: string;
  count: number;
  summary?: string | null;
  sampleComments?: string[];
}

interface CommentData {
  id: string;
  author?: string | null;
  text: string;
  sentiment?: string | null;
  category?: string | null;
  language?: string | null;
  likeCount?: number;
  publishedAt?: string | Date | null;
}

interface AnalysisData {
  id: string;
  summary?: string | null;
  totalComments?: number;
  categories?: CategoryData[];
  comments?: CommentData[];
  aiMetadata?: {
    statistics?: {
      positive?: number;
      neutral?: number;
      negative?: number;
    };
  } | null;
}

interface AnalysisReport extends AnalysisData {
  video: VideoData;
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState<VideoData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "sentiment",
    "categories",
    "spam",
    "feature",
    "bugs",
    "questions",
    "keywords",
  ]);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AnalysisStatus>("idle");

  function handleOptionToggle(id: string) {
    setSelectedOptions((current) =>
      current.includes(id)
        ? current.filter((option) => option !== id)
        : [...current, id]
    );
  }

  async function handleAnalyze() {
    if (!url.trim()) return;

    try {
      setLoading(true);
      setStatus("fetching");
      setError(null);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, options: selectedOptions }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      const report = data.report as AnalysisReport;

      setVideo(report.video);
      setAnalysis(report);

      setStatus("completed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed.";
      setError(message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
            <AnalyzeHeader />

            <UrlInput
              url={url}
              onUrlChange={setUrl}
              onVideoLoaded={setVideo}
            />

            {video && (
              <VideoPreview
                video={video}
              />
            )}

            <AnalysisOptions selected={selectedOptions} onToggle={handleOptionToggle} />

            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
                {error}
              </div>
            )}

            <AnalyzeButton
              loading={loading}
              onAnalyze={handleAnalyze}
              disabled={!url.trim() || selectedOptions.length === 0}
            />

            {loading && (
              <>
                <ProcessingStatus
                  status={status}
                />

                <AnalysisProgress
                  progress={status === "fetching" ? 35 : 70}
                  processedComments={analysis?.totalComments ?? 0}
                  categoriesCount={analysis?.categories?.length ?? 0}
                  elapsedSeconds={0}
                  remainingSeconds={status === "fetching" ? 30 : 15}
                />
              </>
            )}

            {analysis && (
              <>
                <AnalysisSummary
                  analysis={analysis}
                />

                <CategoryGrid
                  categories={analysis.categories ?? []}
                />

                <CommentsTable
                  comments={analysis.comments ?? []}
                />

                <ExportActions
                  analysisId={analysis.id}
                  summary={analysis.summary}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
