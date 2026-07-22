import Link from "next/link";
import { Sparkles, ArrowRight, Brain, MessageSquare } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  stats: {
    videosAnalyzed: number;
    comments: number;
    aiCategories: number;
  };
}

export default function WelcomeBanner({ user, stats }: WelcomeBannerProps) {
  const displayName = user.name || user.email || "Creator";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 p-8 text-white shadow-2xl">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            AI Powered Dashboard
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            Welcome back, {displayName}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-red-100">
            Analyze YouTube comments, discover trends, identify feature requests, and generate AI-powered insights from your stored reports.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-zinc-100">
              <Link href="/analyze">
                Analyze New Video
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:w-[420px]">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <FaYoutube className="mb-4 h-8 w-8" />
            <h2 className="text-3xl font-black">{stats.videosAnalyzed.toLocaleString()}</h2>
            <p className="mt-2 text-red-100">Videos</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <MessageSquare className="mb-4 h-8 w-8" />
            <h2 className="text-3xl font-black">{stats.comments.toLocaleString()}</h2>
            <p className="mt-2 text-red-100">Comments</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md">
            <Brain className="mb-4 h-8 w-8" />
            <h2 className="text-3xl font-black">{stats.aiCategories.toLocaleString()}</h2>
            <p className="mt-2 text-red-100">AI Categories</p>
          </div>
        </div>
      </div>
    </section>
  );
}
