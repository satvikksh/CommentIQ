import Link from "next/link";
import { Plus, History, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white">
        Quick Actions
      </h2>

      <div className="mt-6 flex flex-wrap gap-4">
        <Button asChild className="bg-red-600 hover:bg-red-700">
          <Link href="/analyze">
            <Plus className="mr-2 h-4 w-4" />
            New Analysis
          </Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/history">
            <History className="mr-2 h-4 w-4" />
            View History
          </Link>
        </Button>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>
    </div>
  );
}