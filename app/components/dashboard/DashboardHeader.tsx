import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-4xl font-black text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Welcome back! Analyze your YouTube comments with AI.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <Input
            placeholder="Search analysis..."
            className="h-11 border-white/10 bg-white/5 pl-11"
          />
        </div>

        <Button
          size="icon"
          variant="outline"
          className="border-white/10 bg-white/5"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}