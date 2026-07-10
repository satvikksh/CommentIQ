import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-28 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[180px]" />

        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-red-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl md:p-16">

          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm text-red-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered YouTube Comment Intelligence
            </div>
          </div>

          {/* Heading */}
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              Ready to Understand
              <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                What Your Audience Really Thinks?
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
              Stop reading thousands of comments manually.
              Let AI organize, summarize, and discover the insights hidden
              inside every YouTube comment section.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-xl bg-red-600 px-8 text-base hover:bg-red-700"
            >
              <Link href="/analyze">
                Analyze Your First Video
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 rounded-xl border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10"
            >
              <Link href="#">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              No Credit Card Required
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              AI Powered Analysis
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Analyze Public YouTube Videos
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
