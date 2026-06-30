import {
  BarChart3,
  PieChart,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-28 text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
            Dashboard Preview
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-6xl">
            Powerful Insights
            <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              At a Glance
            </span>
          </h2>

          <p className="mt-6 text-lg text-zinc-400">
            Your AI dashboard transforms thousands of YouTube comments into
            easy-to-understand insights, trends, and actionable data.
          </p>
        </div>

        {/* Dashboard */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                YouTube Video Analysis
              </h3>

              <p className="mt-2 text-zinc-400">
                How to Build an AI SaaS Product
              </p>
            </div>

            <div className="rounded-full bg-green-500/20 px-4 py-2 text-green-400">
              Analysis Completed
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between">
                <ThumbsUp className="text-green-400" />
                <TrendingUp className="text-green-400" />
              </div>

              <h2 className="mt-6 text-4xl font-bold">
                82%
              </h2>

              <p className="mt-2 text-zinc-400">
                Positive Comments
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between">
                <AlertTriangle className="text-red-400" />
                <TrendingUp className="text-red-400" />
              </div>

              <h2 className="mt-6 text-4xl font-bold">
                7%
              </h2>

              <p className="mt-2 text-zinc-400">
                Negative Comments
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between">
                <HelpCircle className="text-blue-400" />
                <MessageSquare className="text-blue-400" />
              </div>

              <h2 className="mt-6 text-4xl font-bold">
                143
              </h2>

              <p className="mt-2 text-zinc-400">
                Viewer Questions
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between">
                <Lightbulb className="text-yellow-400" />
                <MessageSquare className="text-yellow-400" />
              </div>

              <h2 className="mt-6 text-4xl font-bold">
                57
              </h2>

              <p className="mt-2 text-zinc-400">
                Suggestions
              </p>
            </div>

          </div>

          {/* Bottom */}
          <div className="mt-10 grid gap-8 xl:grid-cols-3">

            {/* Categories */}
            <div className="rounded-2xl bg-zinc-900/70 p-6">

              <div className="mb-6 flex items-center gap-3">
                <PieChart className="text-red-400" />
                <h3 className="text-xl font-semibold">
                  Top Categories
                </h3>
              </div>

              <div className="space-y-4">

                {[
                  ["❤️ Appreciation", 512],
                  ["❓ Questions", 143],
                  ["💡 Suggestions", 57],
                  ["📹 Requests", 83],
                  ["🐞 Complaints", 31],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                  >
                    <span>{label}</span>

                    <span className="font-semibold">
                      {value}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            {/* AI Summary */}
            <div className="rounded-2xl bg-zinc-900/70 p-6">

              <div className="mb-6 flex items-center gap-3">
                <MessageSquare className="text-red-400" />
                <h3 className="text-xl font-semibold">
                  AI Summary
                </h3>
              </div>

              <p className="leading-8 text-zinc-400">
                Viewers overwhelmingly enjoyed this tutorial and praised the
                explanations. The most requested follow-up is a Part 2 video.
                Several users also asked for downloadable source code, while a
                small number mentioned microphone quality issues.
              </p>

            </div>

            {/* Analytics */}
            <div className="rounded-2xl bg-zinc-900/70 p-6">

              <div className="mb-6 flex items-center gap-3">
                <BarChart3 className="text-red-400" />
                <h3 className="text-xl font-semibold">
                  Analytics
                </h3>
              </div>

              <div className="space-y-5">

                {[
                  ["Positive", "82%"],
                  ["Neutral", "11%"],
                  ["Negative", "7%"],
                ].map(([label, value]) => (
                  <div key={label}>

                    <div className="mb-2 flex justify-between">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>

                    <div className="h-3 rounded-full bg-zinc-700">

                      <div
                        className={`h-3 rounded-full ${
                          label === "Positive"
                            ? "w-[82%] bg-green-500"
                            : label === "Neutral"
                            ? "w-[11%] bg-yellow-500"
                            : "w-[7%] bg-red-500"
                        }`}
                      />

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}