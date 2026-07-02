"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  History,
  BarChart3,
  FileText,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analyze",
    href: "/analyze",
    icon: Search,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
];

const bottomItems = [
  {
    title: "Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-zinc-950">
      {/* Logo */}

      <div className="border-b border-white/10 p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">
              CommentIQ
            </h1>

            <p className="text-xs text-zinc-500">
              AI Analytics
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Navigation
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                  active
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />

                <span className="font-medium">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}

        <div className="my-8 border-t border-white/10" />

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Preferences
        </p>

        <div className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />

                <span className="font-medium">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom */}

      <div className="border-t border-white/10 p-5">
        <Button
          variant="outline"
          className="w-full justify-start border-white/10 bg-white/5 hover:bg-red-600 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>

        <Button
          variant="ghost"
          className="mt-3 w-full justify-center text-zinc-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Collapse
        </Button>
      </div>
    </aside>
  );
}