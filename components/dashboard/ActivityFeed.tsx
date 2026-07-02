"use client";

import {
  Brain,
  Download,
  Sparkles,
  MessageSquare,
  Clock,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

const activities = [
  {
    id: 1,
    title: "AI Analysis Completed",
    description:
      "The AI successfully analyzed 5,243 comments and generated 8 categories.",
    time: "2 min ago",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    id: 2,
    title: "New YouTube Video Added",
    description:
      "A new YouTube video has been imported for comment analysis.",
    time: "15 min ago",
    icon: FaYoutube,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    id: 3,
    title: "Report Exported",
    description:
      "Analysis report exported successfully as PDF.",
    time: "1 hour ago",
    icon: Download,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    id: 4,
    title: "AI Categories Updated",
    description:
      "New category clusters were generated based on semantic similarity.",
    time: "Yesterday",
    icon: Sparkles,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    id: 5,
    title: "Comments Synced",
    description:
      "1,245 new comments were fetched from YouTube.",
    time: "2 days ago",
    icon: MessageSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

export default function ActivityFeed() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Activity
          </h2>

          <p className="mt-2 text-zinc-400">
            Latest events across your CommentIQ workspace.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="relative flex gap-5"
            >
              {/* Timeline Line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-6 top-14 h-full w-px bg-white/10" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl ${activity.bg}`}
              >
                <Icon className={`h-6 w-6 ${activity.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-red-500/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    {activity.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Clock className="h-4 w-4" />
                    {activity.time}
                  </div>
                </div>

                <p className="mt-3 leading-7 text-zinc-400">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}