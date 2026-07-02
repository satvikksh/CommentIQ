"use client";

import {
  Download,
  FileText,
  FileSpreadsheet,
  Braces,
  Copy,
  Share2,
  Save,
  Printer,
  Mail,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const exportOptions = [
  {
    title: "Export PDF",
    description: "Professional AI report with charts and insights.",
    icon: FileText,
  },
  {
    title: "Export CSV",
    description: "Download categorized comments as CSV.",
    icon: FileSpreadsheet,
  },
  {
    title: "Export JSON",
    description: "Developer-friendly structured data.",
    icon: Braces,
  },
  {
    title: "Copy Summary",
    description: "Copy the AI-generated summary to clipboard.",
    icon: Copy,
  },
  {
    title: "Share Report",
    description: "Generate a secure shareable report link.",
    icon: Share2,
  },
  {
    title: "Save Analysis",
    description: "Store this analysis in your history.",
    icon: Save,
  },
  {
    title: "Print Report",
    description: "Print a clean report directly.",
    icon: Printer,
  },
  {
    title: "Email Report",
    description: "Send the report to your email.",
    icon: Mail,
  },
];

export default function ExportActions() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      {/* Header */}
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

      {/* Actions */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {exportOptions.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.title}
              variant="outline"
              className="h-auto flex-col items-start gap-4 rounded-2xl border-white/10 bg-zinc-900/60 p-6 text-left hover:border-red-500/40 hover:bg-zinc-900"
            >
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
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-white">
              Analysis Complete 🎉
            </h3>

            <p className="mt-2 text-zinc-300">
              Your AI report has been generated successfully and is ready to export or share.
            </p>
          </div>

          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </section>
  );
}