"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface SentimentChartProps {
  data: Array<{ sentiment: string; count: number; percentage: number }>;
}

const colors: Record<string, string> = {
  Positive: "#22c55e",
  Neutral: "#eab308",
  Negative: "#ef4444",
  Unknown: "#71717a",
};

export default function SentimentChart({ data }: SentimentChartProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Sentiment Analysis</h2>
        <p className="mt-2 text-zinc-400">
          Sentiment from your stored AI reports.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/60 text-zinc-500">
          No sentiment data yet.
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="count">
                {data.map((entry) => (
                  <Cell key={entry.sentiment} fill={colors[entry.sentiment] ?? colors.Unknown} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {data.map((item) => (
          <div key={item.sentiment} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: colors[item.sentiment] ?? colors.Unknown }}
              />
              <span className="text-zinc-300">{item.sentiment}</span>
            </div>
            <span className="font-semibold text-white">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
