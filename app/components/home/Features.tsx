import {
  Brain,
  MessageSquareText,
  SmilePlus,
  Search,
  BarChart3,
  Download,
  Languages,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Categorization",
    description:
      "Automatically groups thousands of similar comments into meaningful topics.",
  },
  {
    icon: SmilePlus,
    title: "Sentiment Analysis",
    description:
      "Measure positive, negative, and neutral audience sentiment instantly.",
  },
  {
    icon: MessageSquareText,
    title: "AI Summary",
    description:
      "Generate a concise summary of what your audience is saying.",
  },
  {
    icon: Search,
    title: "Question Detection",
    description:
      "Find unanswered viewer questions in seconds.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track trends, engagement, and audience interests with visual charts.",
  },
  {
    icon: Download,
    title: "Export Reports",
    description:
      "Download insights as CSV, Excel, or PDF for easy sharing.",
  },
  {
    icon: Languages,
    title: "Multi-language Support",
    description:
      "Analyze comments from creators around the world.",
  },
  {
    icon: ShieldCheck,
    title: "Spam Detection",
    description:
      "Automatically detect repetitive, spammy, or bot-generated comments.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative bg-zinc-950 py-28 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
            Features
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-6xl">
            Everything You Need to
            <span className="block bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Understand Your Audience
            </span>
          </h2>

          <p className="mt-6 text-lg text-zinc-400">
            Turn thousands of YouTube comments into actionable insights
            using AI-powered categorization, analytics, and summaries.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:bg-white/10"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-2xl bg-red-500/15 p-4 transition group-hover:scale-110 group-hover:bg-red-500/25">
                  <Icon className="h-8 w-8 text-red-400" />
                </div>

                {/* Title */}
                <h3 className="mb-4 text-2xl font-bold">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}