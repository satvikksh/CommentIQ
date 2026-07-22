import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-16 text-center">
      <Inbox className="mx-auto h-16 w-16 text-zinc-500" />

      <h2 className="mt-6 text-3xl font-bold text-white">
        No Analysis Yet
      </h2>

      <p className="mt-4 text-zinc-400">
        Analyze your first YouTube video and start discovering AI-powered insights.
      </p>

      <Button asChild className="mt-8 bg-red-600 hover:bg-red-700">
        <Link href="/analyze">
          Analyze First Video
        </Link>
      </Button>
    </div>
  );
}