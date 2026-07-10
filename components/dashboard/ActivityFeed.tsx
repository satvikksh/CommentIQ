"use client";

import { Brain, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  createdAt: string | Date;
  title: string;
  totalComments: number;
  categoriesCount: number;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          <p className="mt-2 text-zinc-400">Latest events from your stored history.</p>
        </div>
      </div>

      <div className="space-y-6">
        {activities.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center text-zinc-500">
            No activity yet.
          </div>
        )}

        {activities.map((activity, index) => (
          <div key={activity.id} className="relative flex gap-5">
            {index !== activities.length - 1 && (
              <div className="absolute left-6 top-14 h-full w-px bg-white/10" />
            )}

            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-zinc-900/60 p-5 transition hover:border-red-500/30">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-white">{activity.action}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Clock className="h-4 w-4" />
                  {new Date(activity.createdAt).toLocaleDateString()}
                </div>
              </div>

              <p className="mt-3 leading-7 text-zinc-400">
                {activity.title}: {activity.totalComments.toLocaleString()} comments across{" "}
                {activity.categoriesCount.toLocaleString()} categories.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
