"use client";

import { ArrowRight } from "lucide-react";

interface CategoryGridProps {
  categories: Array<{
    name: string;
    count: number;
    summary?: string | null;
    sampleComments?: string[];
  }>;
}

const colors = [
  "bg-pink-500/10 text-pink-400",
  "bg-yellow-500/10 text-yellow-400",
  "bg-blue-500/10 text-blue-400",
  "bg-red-500/10 text-red-400",
  "bg-purple-500/10 text-purple-400",
  "bg-green-500/10 text-green-400",
  "bg-orange-500/10 text-orange-400",
  "bg-sky-500/10 text-sky-400",
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">AI Comment Categories</h2>
        <p className="mt-2 text-zinc-400">AI automatically grouped similar comments into meaningful categories.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => {
          const [bg, color] = colors[index % colors.length].split(" ");

          return (
            <button key={category.name} type="button" className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-6 text-left transition-all duration-300 hover:border-red-500/30 hover:-translate-y-1 hover:shadow-xl">
              <div className={`mb-5 inline-flex rounded-2xl p-4 ${bg}`}>
                <span className={`h-7 w-7 rounded-full ${color}`} />
              </div>

              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{category.summary ?? "No category summary available."}</p>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Comments</span>
                  <span className="font-semibold text-white">{category.count}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Sample comments</span>
                  <span className="font-semibold text-green-400">{category.sampleComments?.length ?? 0}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center font-medium text-red-400 opacity-0 transition-opacity group-hover:opacity-100">
                View Comments
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-center text-zinc-300">AI analyzed <span className="font-bold text-white">{categories.reduce((sum, category) => sum + category.count, 0)}</span> comments and classified them into <span className="font-bold text-white">{categories.length}</span> categories.</p>
      </div>
    </section>
  );
}
