interface RecentAnalysisItem {
  id: string;
  title?: string | null;
  summary?: string | null;
  totalComments: number;
  overallSentiment?: string | null;
  video: {
    title: string;
    channelTitle?: string | null;
  };
}

interface RecentAnalysisProps {
  items: RecentAnalysisItem[];
}

export default function RecentAnalysis({ items }: RecentAnalysisProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white">Recent Analysis</h2>

      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center text-zinc-500">
            No analyses yet.
          </div>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-900/60 p-4"
          >
            <div>
              <h3 className="font-semibold text-white">{item.title ?? item.video.title}</h3>
              <p className="text-sm text-zinc-500">
                {item.totalComments.toLocaleString()} comments
                {item.video.channelTitle ? ` · ${item.video.channelTitle}` : ""}
              </p>
            </div>

            <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
              {item.overallSentiment ?? "Unknown"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
