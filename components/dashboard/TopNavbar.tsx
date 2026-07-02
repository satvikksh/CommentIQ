"use client";

import Link from "next/link";
import {
  Bell,
  Menu,
  Moon,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-zinc-950/80 px-8 backdrop-blur-xl">

      {/* Left */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}

        <div className="relative hidden md:block">

          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

          <Input
            placeholder="Search videos, comments..."
            className="w-80 border-white/10 bg-white/5 pl-11"
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Analyze Button */}

        <Button
          asChild
          className="bg-red-600 hover:bg-red-700"
        >
          <Link href="/analyze">

            <Plus className="mr-2 h-4 w-4" />

            Analyze

          </Link>
        </Button>

        {/* Theme */}

        <Button
          variant="outline"
          size="icon"
          className="border-white/10 bg-white/5"
        >
          <Moon className="h-5 w-5" />
        </Button>

        {/* Notification */}

        <Button
          variant="outline"
          size="icon"
          className="relative border-white/10 bg-white/5"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

        </Button>

        {/* User */}

        <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10">

          <Avatar>

            <AvatarImage src="" />

            <AvatarFallback className="bg-red-600 text-white">
              SK
            </AvatarFallback>

          </Avatar>

          <div className="hidden text-left md:block">

            <h3 className="text-sm font-semibold">
              Satvik
            </h3>

            <p className="text-xs text-zinc-500">
              Pro Plan
            </p>

          </div>

          <ChevronDown className="h-4 w-4 text-zinc-500" />

        </button>

      </div>

    </header>
  );
}