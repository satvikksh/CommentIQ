"use client";

import {
  Heart,
  MessageSquare,
  ThumbsUp,
  Clock,
  ChevronRight,
} from "lucide-react";

const comments = [
  {
    id: 1,
    user: "Rahul Sharma",
    avatar: "RS",
    category: "Suggestion",
    sentiment: "Positive",
    likes: 124,
    time: "2 hours ago",
    text: "This tutorial is amazing! Please make a Part 2 covering authentication with Google and GitHub.",
  },
  {
    id: 2,
    user: "Emily Johnson",
    avatar: "EJ",
    category: "Question",
    sentiment: "Neutral",
    likes: 56,
    time: "4 hours ago",
    text: "Can this project be deployed on Vercel with a MongoDB Atlas database?",
  },
  {
    id: 3,
    user: "David Lee",
    avatar: "DL",
    category: "Bug Report",
    sentiment: "Negative",
    likes: 41,
    time: "Yesterday",
    text: "Everything works well except the login page. I receive an authentication error after submitting the form.",
  },
];

const sentimentStyles = {
  Positive: "bg-green-500/10 text-green-400",
  Neutral: "bg-yellow-500/10 text-yellow-400",
  Negative: "bg-red-500/10 text-red-400",
};

const categoryStyles = {
  Suggestion: "bg-blue-500/10 text-blue-400",
  Question: "bg-purple-500/10 text-purple-400",
  "Bug Report": "bg-red-500/10 text-red-400",
};

export default function RecentComments() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Comments
          </h2>

          <p className="mt-2 text-zinc-400">
            Latest comments analyzed by AI.
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
          View All
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-red-500/30"
          >
            {/* User */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                  {comment.avatar}
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {comment.user}
                  </h3>

                  <div className="mt-1 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        categoryStyles[
                          comment.category as keyof typeof categoryStyles
                        ]
                      }`}
                    >
                      {comment.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        sentimentStyles[
                          comment.sentiment as keyof typeof sentimentStyles
                        ]
                      }`}
                    >
                      {comment.sentiment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock className="h-4 w-4" />
                {comment.time}
              </div>
            </div>

            {/* Comment */}
            <p className="mt-5 leading-7 text-zinc-300">
              {comment.text}
            </p>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />
                {comment.likes}
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Categorized
              </div>

              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-400" />
                Saved
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}