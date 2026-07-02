import {
  MessageSquare,
  Brain,
  TrendingUp,
} from "lucide-react";

import { FaYoutube } from "react-icons/fa";

const stats = [
  {
    title: "Videos Analyzed",
    value: "24",
    icon: FaYoutube,
  },
  {
    title: "Comments",
    value: "18.5K",
    icon: MessageSquare,
  },
  {
    title: "AI Categories",
    value: "143",
    icon: Brain,
  },
  {
    title: "Positive Rate",
    value: "82%",
    icon: TrendingUp,
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-8 w-8 text-red-500" />

              <span className="text-sm text-green-400">
                +12%
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-black text-white">
              {item.value}
            </h2>

            <p className="mt-2 text-zinc-400">
              {item.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}