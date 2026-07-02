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

const data = [
  {
    category: "Appreciation",
    comments: 512,
  },
  {
    category: "Questions",
    comments: 243,
  },
  {
    category: "Suggestions",
    comments: 178,
  },
  {
    category: "Requests",
    comments: 124,
  },
  {
    category: "Bug Reports",
    comments: 58,
  },
  {
    category: "Funny",
    comments: 31,
  },
];

export default function CategoryChart() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          AI Category Distribution
        </h2>

        <p className="mt-2 text-zinc-400">
          Compare the number of comments grouped into each AI-generated category.
        </p>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              stroke="#27272a"
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
              stroke="#a1a1aa"
            />

            <YAxis
              type="category"
              dataKey="category"
              stroke="#a1a1aa"
              width={120}
            />

            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
              }}
            />

            <Bar
              dataKey="comments"
              radius={[0, 8, 8, 0]}
              fill="#ef4444"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
        <h3 className="mb-2 font-semibold text-white">
          AI Observation
        </h3>

        <p className="leading-7 text-zinc-400">
          Most comments fall under <strong>Appreciation</strong>, followed by
          <strong> Questions</strong> and <strong>Suggestions</strong>. This
          indicates strong audience engagement and a high level of interest in
          additional content.
        </p>
      </div>
    </section>
  );
}