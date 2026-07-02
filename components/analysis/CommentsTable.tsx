"use client";

import { useState } from "react";
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

const comments = [
  {
    id: 1,
    user: "Rahul Sharma",
    avatar: "RS",
    sentiment: "Positive",
    category: "Appreciation",
    language: "English",
    likes: 126,
    time: "2 hours ago",
    text:
      "This tutorial is fantastic. Everything is explained clearly and I finally understood authentication. Please create a Part 2.",
  },
  {
    id: 2,
    user: "Emily Johnson",
    avatar: "EJ",
    sentiment: "Neutral",
    category: "Question",
    language: "English",
    likes: 42,
    time: "5 hours ago",
    text:
      "Can this project also work with Supabase instead of MongoDB Atlas?",
  },
  {
    id: 3,
    user: "David Lee",
    avatar: "DL",
    sentiment: "Negative",
    category: "Bug Report",
    language: "English",
    likes: 17,
    time: "Yesterday",
    text:
      "Everything works except the login flow. I receive an authentication error after submitting the form.",
  },
];

export default function CommentsTable() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      {/* Header */}

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
              placeholder="Search comments..."
              className="w-72 border-white/10 bg-zinc-900 pl-11"
            />

          </div>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

        </div>

      </div>

      {/* Comments */}

      <div className="space-y-5">

        {comments.map((comment) => (

          <div
            key={comment.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5"
          >

            <div className="flex items-start justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                  {comment.avatar}
                </div>

                <div>

                  <h3 className="font-semibold text-white">
                    {comment.user}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-2">

                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                      {comment.category}
                    </span>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                      {comment.sentiment}
                    </span>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      {comment.language}
                    </span>

                  </div>

                </div>

              </div>

              <div className="text-right text-sm text-zinc-500">

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {comment.time}
                </div>

              </div>

            </div>

            <p className="mt-5 leading-7 text-zinc-300">

              {expanded === comment.id
                ? comment.text
                : `${comment.text.slice(0, 120)}...`}

            </p>

            <div className="mt-6 flex items-center justify-between">

              <div className="flex items-center gap-5 text-sm text-zinc-400">

                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  {comment.likes}
                </div>

              </div>

              <button
                onClick={() =>
                  setExpanded(
                    expanded === comment.id ? null : comment.id
                  )
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

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}