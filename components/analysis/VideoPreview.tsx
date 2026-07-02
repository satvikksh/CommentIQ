"use client";

import Image from "next/image";
import { Eye, ThumbsUp, MessageSquare, Calendar, Clock3, CheckCircle2, PlayCircle } from "lucide-react";

interface VideoPreviewProps {
  video: {
    thumbnail: string;
    title: string;
    channelTitle: string;
    views: number;
    likes: number;
    comments: number;
    publishedAt: string;
    duration: string;
  } | null;
}

export default function VideoPreview({ video }: VideoPreviewProps) {
  if (!video) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">No video loaded</h2>
            <p className="mt-2 text-zinc-400">Paste a YouTube URL to preview video details before analysis.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-green-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Video Found</h2>
          <p className="text-zinc-400">Review the video before starting AI analysis.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="relative overflow-hidden rounded-2xl">
          <Image src={video.thumbnail} alt={video.title} width={1280} height={720} className="aspect-video w-full object-cover" />
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/80 px-3 py-1 text-sm font-semibold text-white">{video.duration}</div>
          <button className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30">
            <PlayCircle className="h-16 w-16 text-white" />
          </button>
        </div>

        <div>
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">Ready for Analysis</span>
          <h3 className="mt-5 text-3xl font-black text-white">{video.title}</h3>
          <p className="mt-3 text-lg text-zinc-400">{video.channelTitle}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-zinc-900/60 p-4">
              <Eye className="mb-2 h-5 w-5 text-red-400" />
              <p className="text-sm text-zinc-500">Views</p>
              <h4 className="text-xl font-bold text-white">{video.views.toLocaleString()}</h4>
            </div>
            <div className="rounded-xl bg-zinc-900/60 p-4">
              <ThumbsUp className="mb-2 h-5 w-5 text-red-400" />
              <p className="text-sm text-zinc-500">Likes</p>
              <h4 className="text-xl font-bold text-white">{video.likes.toLocaleString()}</h4>
            </div>
            <div className="rounded-xl bg-zinc-900/60 p-4">
              <MessageSquare className="mb-2 h-5 w-5 text-red-400" />
              <p className="text-sm text-zinc-500">Comments</p>
              <h4 className="text-xl font-bold text-white">{video.comments.toLocaleString()}</h4>
            </div>
            <div className="rounded-xl bg-zinc-900/60 p-4">
              <Calendar className="mb-2 h-5 w-5 text-red-400" />
              <p className="text-sm text-zinc-500">Published</p>
              <h4 className="text-xl font-bold text-white">{new Date(video.publishedAt).toLocaleDateString()}</h4>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-zinc-400">
            <Clock3 className="h-5 w-5" />
            Estimated analysis time: <strong className="text-white">20–40 seconds</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
