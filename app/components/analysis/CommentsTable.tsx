"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ThumbsUp,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CommentRow {
  id: string;
  author?: string | null;
  text: string;
  sentiment?: string | null;
  category?: string | null;
  language?: string | null;
  likeCount?: number;
  publishedAt?: string | Date | null;
}

interface CommentsTableProps {
  comments: CommentRow[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value?: string | Date | null) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString();
}

export default function CommentsTable({ comments }: CommentsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredComments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return comments;
    }

    return comments.filter((comment) => {
      return [
        comment.author,
        comment.text,
        comment.sentiment,
        comment.category,
        comment.language,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [comments, query]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            AI Comment Explorer
          </h2>

          <p className="mt-2 text-zinc-400">
            Search, filter and inspect AI-categorized comments.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search comments..."
              className="w-72 border-white/10 bg-zinc-900 pl-11"
            />
          </div>

          <Button variant="outline" disabled>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {filteredComments.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-8 text-center text-zinc-400">
            No stored comments match your search.
          </div>
        )}

        {filteredComments.map((comment) => {
          const author = comment.author ?? "Unknown";
          const preview =
            comment.text.length > 120
              ? `${comment.text.slice(0, 120)}...`
              : comment.text;

          return (
            <div
              key={comment.id}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                    {getInitials(author)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {author}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                        {comment.category ?? "Uncategorized"}
                      </span>

                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                        {comment.sentiment ?? "Neutral"}
                      </span>

                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                        {comment.language ?? "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {formatDate(comment.publishedAt)}
                  </div>
                </div>
              </div>

              <p className="mt-5 leading-7 text-zinc-300">
                {expanded === comment.id ? comment.text : preview}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-5 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    {comment.likeCount ?? 0}
                  </div>
                </div>

                {comment.text.length > 120 && (
                  <button
                    onClick={() =>
                      setExpanded(expanded === comment.id ? null : comment.id)
                    }
                    className="flex items-center gap-2 text-red-400 hover:text-red-300"
                  >
                    {expanded === comment.id ? (
                      <>
                        Show Less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read More
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
