"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { FaGoogle, FaGithub } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6 py-20 text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[150px]" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-red-500/10 blur-[120px]" />

        <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

        {/* Logo */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-2xl font-bold">
            C
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            <Sparkles className="h-4 w-4" />
            Create Your Account
          </div>

          <h1 className="mt-6 text-4xl font-black">
            Welcome to CommentIQ
          </h1>

          <p className="mt-3 text-zinc-400">
            Start analyzing YouTube comments with AI.
          </p>

        </div>

        {/* Social Login */}

        <div className="space-y-4">

          <Button
            variant="outline"
            className="h-12 w-full border-white/10 bg-white/5 hover:bg-white/10"
          >
            <FaGoogle className="mr-3 text-lg" />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full border-white/10 bg-white/5 hover:bg-white/10"
          >
            <FaGithub className="mr-3 text-lg" />
            Continue with GitHub
          </Button>

        </div>

        {/* Divider */}

        <div className="my-8 flex items-center">

          <div className="h-px flex-1 bg-white/10" />

          <span className="px-4 text-sm text-zinc-500">
            OR
          </span>

          <div className="h-px flex-1 bg-white/10" />

        </div>

        {/* Form */}

        <form className="space-y-5">

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Full Name
            </label>

            <Input
              placeholder="John Doe"
              className="h-12 border-white/10 bg-white/5"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Email Address
            </label>

            <Input
              type="email"
              placeholder="john@example.com"
              className="h-12 border-white/10 bg-white/5"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <div className="relative">

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="h-12 border-white/10 bg-white/5 pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Password Strength */}

          <div>

            <div className="mb-2 flex justify-between text-sm">

              <span>Password Strength</span>

              <span className="text-red-400">
                Weak
              </span>

            </div>

            <div className="h-2 rounded-full bg-zinc-800">

              <div className="h-2 w-1/4 rounded-full bg-red-500" />

            </div>

          </div>

          <Button className="h-12 w-full bg-red-600 hover:bg-red-700">

            Create Account

            <ArrowRight className="ml-2 h-4 w-4" />

          </Button>

        </form>

        {/* Footer */}

        <p className="mt-8 text-center text-sm text-zinc-500">

          Already have an account?

          <Link
            href="/login"
            className="ml-2 text-red-400 hover:text-red-300"
          >
            Sign In
          </Link>

        </p>

      </div>
    </main>
  );
}