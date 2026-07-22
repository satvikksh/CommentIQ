export type YouTubeErrorCode =
  | "YOUTUBE_CONFIG_ERROR"
  | "YOUTUBE_INVALID_API_KEY"
  | "YOUTUBE_QUOTA_EXCEEDED"
  | "YOUTUBE_COMMENTS_DISABLED"
  | "YOUTUBE_VIDEO_NOT_FOUND"
  | "YOUTUBE_NETWORK_ERROR"
  | "YOUTUBE_API_ERROR";

export class YouTubeRequestError extends Error {
  code: YouTubeErrorCode;
  status: number;
  details?: string;

  constructor(code: YouTubeErrorCode, message: string, status: number, details?: string) {
    super(message);
    this.name = "YouTubeRequestError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function isYouTubeRequestError(error: unknown): error is YouTubeRequestError {
  return error instanceof YouTubeRequestError;
}
