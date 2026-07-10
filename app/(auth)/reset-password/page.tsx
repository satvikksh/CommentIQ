"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        throw new Error(result.error.message ?? "Unable to reset password.");
      }

      setMessage("Password reset successfully. You can now sign in.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-20 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <KeyRound className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-3xl font-black">Reset Password</h1>
          <p className="mt-3 text-zinc-400">Choose a new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            minLength={8}
            className="h-12 border-white/10 bg-white/5"
            required
          />

          {message && (
            <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-sm text-zinc-200">
              {message}
            </div>
          )}

          <Button disabled={loading || !token} className="h-12 w-full bg-red-600 hover:bg-red-700">
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
          Loading...
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
