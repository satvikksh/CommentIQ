"use client";

import {
  Download,
  FileText,
  FileSpreadsheet,
  Braces,
  Copy,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ExportActionsProps {
  analysisId: string;
  summary?: string | null;
}

export default function ExportActions({ analysisId, summary }: ExportActionsProps) {
  async function copySummary() {
    if (summary) {
      await navigator.clipboard.writeText(summary);
    }
  }

  const exportOptions = [
    {
      title: "Export PDF",
      description: "Professional AI report with charts and insights.",
      icon: FileText,
      href: `/api/export/pdf?analysisId=${analysisId}`,
    },
    {
      title: "Export CSV",
      description: "Download categorized comments as CSV.",
      icon: FileSpreadsheet,
      href: `/api/export/csv?analysisId=${analysisId}`,
    },
    {
      title: "Export JSON",
      description: "Developer-friendly structured data.",
      icon: Braces,
      href: `/api/export/json?analysisId=${analysisId}`,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-400">
          <Sparkles className="h-4 w-4" />
          Report Center
        </div>

        <h2 className="text-3xl font-bold text-white">
          Export & Share
        </h2>

        <p className="mt-2 text-zinc-400">
          Save, export, or share your AI analysis in multiple formats.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {exportOptions.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.title}
              asChild
              variant="outline"
              className="h-auto flex-col items-start gap-4 rounded-2xl border-white/10 bg-zinc-900/60 p-6 text-left hover:border-red-500/40 hover:bg-zinc-900"
            >
              <a href={item.href}>
                <div className="rounded-xl bg-red-500/10 p-3">
                  <Icon className="h-6 w-6 text-red-400" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </a>
            </Button>
          );
        })}

        <Button
          variant="outline"
          onClick={copySummary}
          disabled={!summary}
          className="h-auto flex-col items-start gap-4 rounded-2xl border-white/10 bg-zinc-900/60 p-6 text-left hover:border-red-500/40 hover:bg-zinc-900"
        >
          <div className="rounded-xl bg-red-500/10 p-3">
            <Copy className="h-6 w-6 text-red-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Copy Summary
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Copy the AI-generated summary to clipboard.
            </p>
          </div>
        </Button>
      </div>

      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-white">
              Analysis Complete
            </h3>

            <p className="mt-2 text-zinc-300">
              Your AI report has been generated successfully and is ready to export.
            </p>
          </div>

          <Button asChild className="bg-red-600 hover:bg-red-700">
            <a href={`/api/export/pdf?analysisId=${analysisId}`}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
