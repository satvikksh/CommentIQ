"use client";

import { Heart, MessageSquare, ThumbsUp, Clock, ChevronRight } from "lucide-react";

interface RecentComment {
  id: string;
  author?: string | null;
  category?: string | null;
  sentiment?: string | null;
  likeCount: number;
  publishedAt?: string | Date | null;
  text: string;
  videoTitle: string;
}

interface RecentCommentsProps {
  comments: RecentComment[];
}

const sentimentStyles: Record<string, string> = {
  Positive: "bg-green-500/10 text-green-400",
  Neutral: "bg-yellow-500/10 text-yellow-400",
  Negative: "bg-red-500/10 text-red-400",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value?: string | Date | null) {
  return value ? new Date(value).toLocaleDateString() : "Unknown";
}

export default function RecentComments({ comments }: RecentCommentsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Recent Comments</h2>
          <p className="mt-2 text-zinc-400">Latest comments stored from your analyses.</p>
        </div>

        <button className="flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300">
          View All
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5">
        {comments.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center text-zinc-500">
            No comments stored yet.
          </div>
        )}

        {comments.map((comment) => {
          const author = comment.author ?? "Unknown";
          const sentiment = comment.sentiment ?? "Unknown";

          return (
            <div key={comment.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-red-500/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                    {getInitials(author)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{author}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{comment.videoTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                        {comment.category ?? "Uncategorized"}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs ${sentimentStyles[sentiment] ?? "bg-zinc-800 text-zinc-300"}`}>
                        {sentiment}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Clock className="h-4 w-4" />
                  {formatDate(comment.publishedAt)}
                </div>
              </div>

              <p className="mt-5 leading-7 text-zinc-300">{comment.text}</p>

              <div className="mt-6 flex items-center gap-6 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  {comment.likeCount}
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Categorized
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  Stored
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
