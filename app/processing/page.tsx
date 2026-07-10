"use client";

import Link from "next/link";
import { Activity, ArrowRight, Brain, Database, MessageSquare } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Fetch metadata", detail: "Load video title, thumbnail and statistics.", icon: Database },
  { title: "Collect comments", detail: "Read public comment threads from YouTube.", icon: MessageSquare },
  { title: "Generate insights", detail: "Analyze comments with the configured OpenRouter model.", icon: Brain },
];

export default function ProcessingPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="flex flex-1 items-center justify-center p-6 lg:p-8">
          <section className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <Activity className="h-7 w-7 animate-pulse text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Processing Pipeline</h1>
                <p className="mt-2 text-zinc-400">
                  Start an analysis to run this pipeline against live YouTube comments.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
                    <Icon className="mb-4 h-7 w-7 text-red-400" />
                    <h2 className="font-semibold">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{step.detail}</p>
                  </div>
                );
              })}
            </div>

            <Button asChild className="mt-8 bg-red-600 hover:bg-red-700">
              <Link href="/analyze">
                Analyze a Video
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
