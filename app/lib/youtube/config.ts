import { YouTubeRequestError } from "./errors";

export function getYouTubeConfig() {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const baseUrl = process.env.YOUTUBE_API_BASE_URL?.trim();

  if (!apiKey) {
    throw new YouTubeRequestError(
      "YOUTUBE_CONFIG_ERROR",
      "Missing YouTube API key",
      500,
      "YOUTUBE_API_KEY is not configured."
    );
  }

  if (!baseUrl) {
    throw new YouTubeRequestError(
      "YOUTUBE_CONFIG_ERROR",
      "Missing YouTube API base URL",
      500,
      "YOUTUBE_API_BASE_URL is not configured."
    );
  }

  try {
    new URL(baseUrl);
  } catch {
    throw new YouTubeRequestError(
      "YOUTUBE_CONFIG_ERROR",
      "Invalid YouTube API base URL",
      500,
      "YOUTUBE_API_BASE_URL must be a valid absolute URL."
    );
  }

  return {
    apiKey,
    baseUrl,
  };
}
