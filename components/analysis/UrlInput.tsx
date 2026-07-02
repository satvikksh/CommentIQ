"use client";

import { useState } from "react";
import {
  Link2,
  Clipboard,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  views: number;
  likes: number;
  comments: number;
}

interface UrlInputProps {
  onVideoLoaded?: (video: VideoData) => void;
}

export default function UrlInput({
  onVideoLoaded,
}: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "valid" | "invalid"
  >("idle");

  const [loading, setLoading] = useState(false);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();

      setUrl(text);
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePreview() {
    if (!url.trim()) return;

    try {
      setLoading(true);

      const response = await fetch("/api/youtube/video", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("invalid");
        return;
      }

      setStatus("valid");

      onVideoLoaded?.(data);
    } catch (error) {
      console.error(error);

      setStatus("invalid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="mb-8">

        <h2 className="text-3xl font-bold text-white">
          Paste YouTube Video URL
        </h2>

        <p className="mt-3 text-zinc-400">
          Paste any public YouTube video URL to preview
          the video and prepare it for AI analysis.
        </p>

      </div>

      <div className="flex flex-col gap-4 lg:flex-row">

        <div className="relative flex-1">

          <Link2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);

              if (status !== "idle") {
                setStatus("idle");
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="h-14 border-white/10 bg-zinc-900 pl-12 text-base"
          />

        </div>

        <Button
          variant="outline"
          className="h-14 border-white/10 bg-white/5"
          onClick={handlePaste}
          disabled={loading}
        >
          <Clipboard className="mr-2 h-5 w-5" />
          Paste
        </Button>

        <Button
          onClick={handlePreview}
          className="h-14 bg-red-600 px-8 hover:bg-red-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Preview
            </>
          )}
        </Button>

      </div>

      {status === "valid" && (

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">

          <CheckCircle2 className="h-5 w-5" />

          Video found successfully.

        </div>

      )}

      {status === "invalid" && (

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">

          <AlertCircle className="h-5 w-5" />

          Invalid YouTube URL or the video could not be loaded.

        </div>

      )}

    </section>
  );
}