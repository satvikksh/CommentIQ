"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryChartProps {
  data: Array<{ name: string; value: number }>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item) => ({ category: item.name, comments: item.value }));
  const topCategory = chartData[0];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">AI Category Distribution</h2>
        <p className="mt-2 text-zinc-400">
          Comment groups generated from your saved analyses.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-[380px] items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/60 text-zinc-500">
          No category data yet.
        </div>
      ) : (
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
              <XAxis type="number" stroke="#a1a1aa" />
              <YAxis type="category" dataKey="category" stroke="#a1a1aa" width={120} />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="comments" radius={[0, 8, 8, 0]} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {topCategory && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <h3 className="mb-2 font-semibold text-white">Top Category</h3>
          <p className="leading-7 text-zinc-400">
            <strong>{topCategory.category}</strong> is currently your most common AI category with{" "}
            <strong>{topCategory.comments.toLocaleString()}</strong> comments.
          </p>
        </div>
      )}
    </section>
  );
}
