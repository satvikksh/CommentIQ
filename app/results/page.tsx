"use client";

import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="flex flex-1 items-center justify-center p-6 lg:p-8">
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
        </main>
      </div>
    </div>
  );
}
