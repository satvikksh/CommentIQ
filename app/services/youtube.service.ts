import { z } from "zod";

import { prisma } from "@/app/lib/prisma";
import { extractVideoId } from "@/app/lib/youtube/extractVideoId";
import { getComments } from "@/app/lib/youtube/getComments";
import { getVideo } from "@/app/lib/youtube/getVideo";

const youtubeUrlSchema = z.string().url().refine((value) => {
  try {
    const parsed = new URL(value);
    return parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be");
  } catch {
    return false;
  }
}, "Please provide a valid YouTube URL");

export async function resolveVideoMetadata(url: string) {
  const parsed = youtubeUrlSchema.safeParse(url);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid YouTube URL");
  }

  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error("Unable to extract video ID from the provided URL");
  }

  console.log("[YouTube] fetching video metadata", { videoId });
  const video = await getVideo(videoId);
  console.log("[YouTube] video metadata fetched", {
    videoId,
    title: video.title,
    commentCount: video.comments,
  });

  console.log("[YouTube] fetching comments", { videoId, maxResults: 1000 });
  const comments = await getComments(videoId, 1000);
  console.log("[YouTube] comments fetched", {
    videoId,
    comments: comments.length,
  });

  return {
    videoId,
    video,
    comments,
  };
}

export async function ensureVideoRecord(video: {
  id: string;
  title: string;
  description?: string | null;
  channelTitle?: string;
  thumbnail?: string;
  publishedAt?: string;
  duration?: string;
  views?: number;
  likes?: number;
  comments?: number;
}) {
  const normalized = await prisma.video.upsert({
    where: { youtubeId: video.id },
    update: {
      title: video.title,
      description: video.description ?? null,
      channelTitle: video.channelTitle ?? null,
      thumbnail: video.thumbnail ?? null,
      publishedAt: video.publishedAt ? new Date(video.publishedAt) : null,
      duration: video.duration ?? null,
      views: video.views ?? 0,
      likes: video.likes ?? 0,
      comments: video.comments ?? 0,
    },
    create: {
      youtubeId: video.id,
      title: video.title,
      description: video.description ?? null,
      channelTitle: video.channelTitle ?? null,
      thumbnail: video.thumbnail ?? null,
      publishedAt: video.publishedAt ? new Date(video.publishedAt) : null,
      duration: video.duration ?? null,
      views: video.views ?? 0,
      likes: video.likes ?? 0,
      comments: video.comments ?? 0,
    },
  });

  return normalized;
}
