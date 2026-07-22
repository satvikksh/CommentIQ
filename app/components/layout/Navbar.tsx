"use client";

import Link from "next/link";
import { useState } from "react";
// import { Menu, X, Youtube } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          {/* <Youtube className="h-7 w-7 text-red-500" /> */}
          <span>CommentIQ</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>

          <Button asChild className="bg-red-600 text-white hover:bg-red-700">
            <Link href="/analyze">Analyze Now</Link>
          </Button>
 <Button asChild className="bg-red-600 text-white hover:bg-red-700">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
       
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white md:hidden"
        >
          {/* {mobileOpen ? <X size={26} /> : <Menu size={26} />} */}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-zinc-950 md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-zinc-300 transition hover:text-white"
              >
                {link.name}
              </Link>
            ))}
       

            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/register">Register</Link>
            </Button>

            <Button asChild className="bg-red-600 text-white hover:bg-red-700">
              <Link href="/analyze">Analyze Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
