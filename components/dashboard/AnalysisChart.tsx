"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", comments: 240 },
  { day: "Tue", comments: 380 },
  { day: "Wed", comments: 520 },
  { day: "Thu", comments: 470 },
  { day: "Fri", comments: 650 },
  { day: "Sat", comments: 810 },
  { day: "Sun", comments: 730 },
];

export default function AnalysisChart() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Weekly Comment Analysis
        </h2>

        <p className="mt-2 text-zinc-400">
          Number of comments analyzed during the last 7 days.
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="comments"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />

            <XAxis
              dataKey="day"
              stroke="#a1a1aa"
            />

            <YAxis
              stroke="#a1a1aa"
            />

            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="comments"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#comments)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}