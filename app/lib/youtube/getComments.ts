import axios from "axios";

import youtube from "./client";
import { getYouTubeConfig } from "./config";
import { YouTubeRequestError } from "./errors";

export interface YouTubeComment {
  id: string;
  author: string;
  authorProfileImage: string;
  text: string;
  likeCount: number;
  publishedAt: string;
}

interface YouTubeCommentThreadItem {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        textDisplay: string;
        likeCount: number;
        publishedAt: string;
      };
    };
  };
}

interface YouTubeCommentThreadsResponse {
  items?: YouTubeCommentThreadItem[];
  nextPageToken?: string;
}

function classifyCommentError(error: unknown, videoId: string): never {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as {
      error?: {
        message?: string;
        errors?: Array<{ reason?: string; message?: string }>;
      };
    } | undefined;
    const reason = data?.error?.errors?.[0]?.reason;
    const message = data?.error?.message ?? error.message;

    console.error("[YouTube] commentThreads request failed", {
      videoId,
      status: error.response?.status,
      reason,
      message,
    });

    if (reason === "commentsDisabled") {
      throw new YouTubeRequestError(
        "YOUTUBE_COMMENTS_DISABLED",
        "Comments disabled",
        403,
        "Comments are disabled for this video."
      );
    }

    if (reason === "keyInvalid" || reason === "badRequest") {
      throw new YouTubeRequestError(
        "YOUTUBE_INVALID_API_KEY",
        "Invalid YouTube API key",
        401,
        "YouTube rejected the configured API key."
      );
    }

    if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
      throw new YouTubeRequestError(
        "YOUTUBE_QUOTA_EXCEEDED",
        "YouTube quota exceeded",
        429,
        "The configured YouTube API project has exceeded its quota."
      );
    }

    if (!error.response) {
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
      error.response.status,
      message
    );
  }

  throw error;
}

export async function getComments(
  videoId: string,
  maxResults = 100
) {
  const { apiKey, baseUrl } = getYouTubeConfig();
  const comments: YouTubeComment[] = [];

  let nextPageToken: string | undefined;

  while (comments.length < maxResults) {
    const pageSize = Math.min(100, maxResults - comments.length);
    let data: YouTubeCommentThreadsResponse;

    try {
      console.log("[YouTube] sending commentThreads request", {
        endpoint: "/commentThreads",
        baseUrl,
        videoId,
        maxResults: pageSize,
        hasPageToken: Boolean(nextPageToken),
      });

      const response = await youtube.get<YouTubeCommentThreadsResponse>("/commentThreads", {
        baseURL: baseUrl,
        params: {
          part: "snippet",
          videoId,
          maxResults: pageSize,
          pageToken: nextPageToken,
          textFormat: "plainText",
          key: apiKey,
        },
      });

      data = response.data;

      console.log("[YouTube] commentThreads response received", {
        videoId,
        status: response.status,
        itemCount: data.items?.length ?? 0,
        hasNextPage: Boolean(data.nextPageToken),
      });
    } catch (error) {
      classifyCommentError(error, videoId);
    }

    const items = data.items ?? [];

    for (const item of items) {
      const comment =
        item.snippet.topLevelComment.snippet;

      comments.push({
        id: item.id,
        author: comment.authorDisplayName,
        authorProfileImage: comment.authorProfileImageUrl,
        text: comment.textDisplay,
        likeCount: comment.likeCount,
        publishedAt: comment.publishedAt,
      });
    }

    if (!data.nextPageToken) {
      break;
    }

    nextPageToken = data.nextPageToken;
  }

  return comments;
}
