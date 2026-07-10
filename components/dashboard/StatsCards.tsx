import { Bookmark, Brain, MessageSquare, TrendingUp } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

interface StatsCardsProps {
  stats: {
    totalAnalyses: number;
    videosAnalyzed: number;
    comments: number;
    bookmarkedReports: number;
    positiveRate: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: "Total Analyses", value: stats.totalAnalyses.toLocaleString(), icon: Brain },
    { title: "Videos Analyzed", value: stats.videosAnalyzed.toLocaleString(), icon: FaYoutube },
    { title: "Comments", value: stats.comments.toLocaleString(), icon: MessageSquare },
    { title: "Bookmarked Reports", value: stats.bookmarkedReports.toLocaleString(), icon: Bookmark },
    { title: "Positive Rate", value: `${stats.positiveRate}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <Icon className="h-8 w-8 text-red-500" />

            <h2 className="mt-6 text-4xl font-black text-white">
              {item.value}
            </h2>

            <p className="mt-2 text-zinc-400">{item.title}</p>
          </div>
        );
      })}
    </div>
  );
}
