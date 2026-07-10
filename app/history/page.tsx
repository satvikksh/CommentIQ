"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Bookmark, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HistoryVideo {
  title: string;
  thumbnail?: string | null;
  channelTitle?: string | null;
}

interface HistoryAnalysis {
  id: string;
  title?: string | null;
  summary?: string | null;
  overallSentiment?: string | null;
  totalComments: number;
  isBookmarked: boolean;
  createdAt: string;
  video: HistoryVideo;
}

interface HistoryResponse {
  success: boolean;
  data: HistoryAnalysis[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryAnalysis[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [bookmarked, setBookmarked] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
      sort,
    });

    if (query.trim()) {
      params.set("search", query.trim());
    }

    if (bookmarked) {
      params.set("bookmarked", "true");
    }

    async function loadHistory() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/history?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as HistoryResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.error ?? "Unable to load history.");
        }

        setItems(data.data);
        setTotal(data.meta.total);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Unable to load history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [bookmarked, page, query, sort]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <TopNavbar />

        <main className="flex-1 space-y-6 p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black">Analysis History</h1>
              <p className="mt-2 text-zinc-400">
                Review previous YouTube comment analyses stored in your account.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search history..."
                  className="w-full border-white/10 bg-zinc-900 pl-11 sm:w-72"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setSort((current) => (current === "desc" ? "asc" : "desc"))}
              >
                {sort === "desc" ? "Newest" : "Oldest"}
              </Button>

              <Button
                variant={bookmarked ? "default" : "outline"}
                onClick={() => {
                  setBookmarked((current) => !current);
                  setPage(1);
                }}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmarks
              </Button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}

            {!loading && items.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
                No analyses found.
              </div>
            )}

            {!loading &&
              items.map((analysis) => (
                <article
                  key={analysis.id}
                  className="grid gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-[220px_1fr]"
                >
                  <div className="relative overflow-hidden rounded-xl bg-zinc-900">
                    {analysis.video.thumbnail ? (
                      <Image
                        src={analysis.video.thumbnail}
                        alt={analysis.video.title}
                        width={480}
                        height={270}
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-video" />
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-5">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                        <span>{analysis.video.channelTitle ?? "Unknown channel"}</span>
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold">
                        {analysis.title ?? analysis.video.title}
                      </h2>

                      <p className="mt-3 line-clamp-2 text-zinc-400">
                        {analysis.summary ?? "No summary stored for this analysis."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                        {analysis.overallSentiment ?? "Neutral"}
                      </span>
                      <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
                        {analysis.totalComments.toLocaleString()} comments
                      </span>
                      {analysis.isBookmarked && (
                        <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-300">
                          Bookmarked
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
