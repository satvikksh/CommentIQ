"use client";

import { CalendarDays, MessageSquareText, ThumbsUp } from "lucide-react";

type Sentiment = "Positive" | "Neutral" | "Negative";

export interface SentimentComment {
  id: string;
  author?: string | null;
  text: string;
  sentiment?: string | null;
  likeCount?: number | null;
  publishedAt?: string | Date | null;
}

interface SentimentCommentSectionsProps {
  comments: SentimentComment[];
}

const sections: Array<{
  sentiment: Sentiment;
  title: string;
  badge: string;
  badgeClassName: string;
  accentClassName: string;
}> = [
  {
    sentiment: "Positive",
    title: "Positive Comments",
    badge: "🟢 Positive",
    badgeClassName: "border-green-500/20 bg-green-500/10 text-green-300",
    accentClassName: "from-green-500/20 to-transparent",
  },
  {
    sentiment: "Neutral",
    title: "Neutral Comments",
    badge: "🟡 Neutral",
    badgeClassName: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
    accentClassName: "from-yellow-500/20 to-transparent",
  },
  {
    sentiment: "Negative",
    title: "Negative Comments",
    badge: "🔴 Negative",
    badgeClassName: "border-red-500/20 bg-red-500/10 text-red-300",
    accentClassName: "from-red-500/20 to-transparent",
  },
];

function normalizeSentiment(value?: string | null): Sentiment {
  return value === "Positive" || value === "Negative" || value === "Neutral"
    ? value
    : "Neutral";
}

function formatDate(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SentimentCommentCard({
  comment,
  badge,
  badgeClassName,
}: {
  comment: SentimentComment;
  badge: string;
  badgeClassName: string;
}) {
  const author = comment.author?.trim() || "Unknown author";
  const publishedDate = formatDate(comment.publishedAt);
  const hasLikeCount = typeof comment.likeCount === "number";

  return (
    <article className="group rounded-2xl border border-white/10 bg-zinc-950/70 p-5 transition duration-200 hover:border-white/20 hover:bg-zinc-900/80">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words font-semibold text-white">{author}</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full border px-3 py-1 ${badgeClassName}`}>
              {badge}
            </span>
            {hasLikeCount && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
                <ThumbsUp className="h-3.5 w-3.5" />
                {comment.likeCount?.toLocaleString()}
              </span>
            )}
            {publishedDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
                <CalendarDays className="h-3.5 w-3.5" />
                {publishedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">
        {comment.text}
      </p>
    </article>
  );
}

export default function SentimentCommentSections({
  comments,
}: SentimentCommentSectionsProps) {
  const grouped = sections.reduce<Record<Sentiment, SentimentComment[]>>(
    (accumulator, section) => {
      accumulator[section.sentiment] = comments.filter(
        (comment) => normalizeSentiment(comment.sentiment) === section.sentiment
      );
      return accumulator;
    },
    {
      Positive: [],
      Neutral: [],
      Negative: [],
    }
  );

  return (
    <section className="space-y-6">
      {sections.map((section) => {
        const sectionComments = grouped[section.sentiment];

        return (
          <div
            key={section.sentiment}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <div className={`bg-gradient-to-r ${section.accentClassName} p-6`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {section.title} ({sectionComments.length.toLocaleString()})
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Comments classified as {section.sentiment.toLowerCase()} by the AI.
                  </p>
                </div>

                <span className={`w-fit rounded-full border px-4 py-2 text-sm font-medium ${section.badgeClassName}`}>
                  {section.badge}
                </span>
              </div>
            </div>

            <div className="max-h-[32rem] overflow-y-auto p-5 sm:p-6">
              {sectionComments.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-8 text-center">
                  <MessageSquareText className="mx-auto h-8 w-8 text-zinc-500" />
                  <p className="mt-3 text-zinc-400">No comments available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sectionComments.map((comment) => (
                    <SentimentCommentCard
                      key={comment.id}
                      comment={comment}
                      badge={section.badge}
                      badgeClassName={section.badgeClassName}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
