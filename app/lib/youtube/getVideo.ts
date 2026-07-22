import axios from "axios";

import youtube from "./client";
import { getYouTubeConfig } from "./config";
import { YouTubeRequestError } from "./errors";

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description?: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails: {
    duration: string;
  };
}

interface YouTubeVideosResponse {
  items?: YouTubeVideoItem[];
}

function getYouTubeErrorReason(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data as {
    error?: {
      message?: string;
      errors?: Array<{ reason?: string; message?: string }>;
    };
  } | undefined;

  return {
    status: error.response?.status,
    message: data?.error?.message ?? error.message,
    reason: data?.error?.errors?.[0]?.reason,
  };
}

export async function getVideo(videoId: string) {
  const { apiKey, baseUrl } = getYouTubeConfig();
  let data: YouTubeVideosResponse;

  try {
    console.log("[YouTube] sending videos request", {
      endpoint: "/videos",
      baseUrl,
      videoId,
      part: "snippet,statistics,contentDetails",
    });

    const response = await youtube.get<YouTubeVideosResponse>("/videos", {
      baseURL: baseUrl,
      params: {
        id: videoId,
        part: "snippet,statistics,contentDetails",
        key: apiKey,
      },
    });

    data = response.data;

    console.log("[YouTube] videos response received", {
      videoId,
      status: response.status,
      itemCount: data.items?.length ?? 0,
    });
  } catch (error) {
    const youtubeError = getYouTubeErrorReason(error);

    console.error("[YouTube] videos request failed", {
      videoId,
      status: youtubeError?.status,
      reason: youtubeError?.reason,
      message: youtubeError?.message,
    });

    if (youtubeError?.reason === "keyInvalid" || youtubeError?.reason === "badRequest") {
      throw new YouTubeRequestError(
        "YOUTUBE_INVALID_API_KEY",
        "Invalid YouTube API key",
        401,
        "YouTube rejected the configured API key."
      );
    }

    if (youtubeError?.reason === "quotaExceeded" || youtubeError?.reason === "dailyLimitExceeded") {
      throw new YouTubeRequestError(
        "YOUTUBE_QUOTA_EXCEEDED",
        "YouTube quota exceeded",
        429,
        "The configured YouTube API project has exceeded its quota."
      );
    }

    if (axios.isAxiosError(error) && !error.response) {
      throw new YouTubeRequestError(
        "YOUTUBE_NETWORK_ERROR",
        "Network error while contacting YouTube",
        503,
        error.message
      );
    }

    throw new YouTubeRequestError(
      "YOUTUBE_API_ERROR",
      "YouTube API request failed",
      youtubeError?.status ?? 502,
      youtubeError?.message
    );
  }

  if (!data.items?.length) {
    throw new YouTubeRequestError(
      "YOUTUBE_VIDEO_NOT_FOUND",
      "Video not found",
      404,
      "YouTube returned no video for the provided video ID."
    );
  }

  const video = data.items[0];

  return {
    id: video.id,

    title: video.snippet.title,

    description: video.snippet.description,

    channelTitle: video.snippet.channelTitle,

    publishedAt: video.snippet.publishedAt,

    thumbnail:
      video.snippet.thumbnails.high?.url ??
      video.snippet.thumbnails.default.url,

    views: Number(video.statistics.viewCount),

    likes: Number(video.statistics.likeCount),

    comments: Number(video.statistics.commentCount),

    duration: video.contentDetails.duration,
  };
}
