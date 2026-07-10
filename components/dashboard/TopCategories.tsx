"use client";

import { ArrowUpRight, FolderTree } from "lucide-react";

interface TopCategoriesProps {
  categories: Array<{ name: string; value: number }>;
}

export default function TopCategories({ categories }: TopCategoriesProps) {
  const total = categories.reduce((sum, category) => sum + category.value, 0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Top AI Categories</h2>
          <p className="mt-2 text-zinc-400">Similar comments grouped automatically by AI.</p>
        </div>

        <button className="flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5">
        {categories.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-center text-zinc-500">
            No categories yet.
          </div>
        )}

        {categories.map((category) => {
          const percentage = total ? Math.round((category.value / total) * 100) : 0;

          return (
            <div key={category.name} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-red-500/10 p-3">
                    <FolderTree className="h-6 w-6 text-red-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-zinc-500">{category.value.toLocaleString()} comments</p>
                  </div>
                </div>

                <span className="text-lg font-bold text-white">{percentage}%</span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="leading-7 text-zinc-300">
            AI organized <strong>{total.toLocaleString()} comments</strong> into{" "}
            <strong>{categories.length.toLocaleString()} categories</strong> across your saved analyses.
          </p>
        </div>
      )}
    </section>
  );
}
