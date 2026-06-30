import {
  Link2,
  Download,
  BrainCircuit,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Paste YouTube URL",
    description:
      "Paste the link of any public YouTube video you want to analyze.",
  },
  {
    number: "02",
    icon: Download,
    title: "Fetch Comments",
    description:
      "Our system securely retrieves comments using the official YouTube Data API.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "AI Processing",
    description:
      "AI groups similar comments, detects sentiment, questions, requests, and trends.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Get Insights",
    description:
      "Explore interactive dashboards, summaries, analytics, and downloadable reports.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-zinc-900 py-28 text-white"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
            How It Works
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-6xl">
            Analyze Comments in
            <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Four Simple Steps
            </span>
          </h2>

          <p className="mt-6 text-lg text-zinc-400">
            No technical knowledge required. Paste a YouTube link and let AI
            transform thousands of comments into valuable insights.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                {/* Connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-full top-14 hidden h-[2px] w-full bg-gradient-to-r from-red-500/40 to-transparent lg:block" />
                )}

                {/* Card */}
                <div className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-white/10">
                  {/* Step Number */}
                  <span className="absolute right-6 top-6 text-5xl font-black text-white/5">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="mb-8 inline-flex rounded-2xl bg-red-500/15 p-4 transition group-hover:scale-110 group-hover:bg-red-500/25">
                    <Icon className="h-8 w-8 text-red-400" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-2xl font-bold">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="leading-7 text-zinc-400">
                    {step.description}
                  </p>

                  {/* Learn More */}
                  <div className="mt-8 flex items-center gap-2 text-red-400 transition group-hover:translate-x-1">
                    <span className="text-sm font-medium">
                      Learn More
                    </span>

                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-lg text-zinc-400">
            Analyze thousands of comments in minutes—not hours.
          </p>
        </div>
      </div>
    </section>
  );
}