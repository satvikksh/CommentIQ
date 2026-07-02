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

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [video, setVideo] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysis, setAnalysis] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "fetching" | "analyzing" | "completed" | "error"
  >("idle");

  async function handleAnalyze() {
    if (!url.trim()) return;

    try {
      setLoading(true);
      setStatus("fetching");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setVideo(data.report.video);
      setAnalysis(data.report.analysis);

      setStatus("completed");
    } catch (error) {
      console.error(error);
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
              setUrl={setUrl}
            />

            {video && (
              <VideoPreview
                video={video}
              />
            )}

            <AnalysisOptions selected={[]} onToggle={function (id: string): void {
                          throw new Error("Function not implemented.");
                      } } />

            <AnalyzeButton
              loading={loading}
              onAnalyze={handleAnalyze}
            />

            {loading && (
              <>
                <ProcessingStatus
                  status={status}
                />

                <AnalysisProgress progress={0} processedComments={0} categoriesCount={0} elapsedSeconds={0} remainingSeconds={0} />
              </>
            )}

            {analysis && (
              <>
                <AnalysisSummary
                  analysis={analysis}
                />

                <CategoryGrid
                  categories={analysis.categories}
                />

                <CommentsTable
                  comments={analysis.comments ?? []}
                />

                <ExportActions />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}