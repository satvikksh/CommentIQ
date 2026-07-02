export default function RecentAnalysis() {
  const items = [
    {
      title: "How to Build SaaS",
      comments: "5,243",
      sentiment: "Positive",
    },
    {
      title: "React Tutorial",
      comments: "8,102",
      sentiment: "Mixed",
    },
    {
      title: "Next.js Course",
      comments: "2,321",
      sentiment: "Positive",
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white">
        Recent Analysis
      </h2>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-2xl bg-zinc-900/60 p-4"
          >
            <div>
              <h3 className="font-semibold text-white">
                {item.title}
              </h3>

              <p className="text-sm text-zinc-500">
                {item.comments} comments
              </p>
            </div>

            <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
              {item.sentiment}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}