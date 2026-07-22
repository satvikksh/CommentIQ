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

interface AnalysisChartProps {
  data: Array<{ month: string; comments: number }>;
}

export default function AnalysisChart({ data }: AnalysisChartProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Monthly Activity</h2>
        <p className="mt-2 text-zinc-400">
          Comments analyzed from your stored reports.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/60 text-zinc-500">
          No activity yet.
        </div>
      ) : (
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="comments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
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
      )}
    </div>
  );
}
