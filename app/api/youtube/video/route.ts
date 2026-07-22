import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { extractVideoId } from "@/app/lib/youtube/extractVideoId";
import { isYouTubeRequestError } from "@/app/lib/youtube/errors";
import { getVideo } from "@/app/lib/youtube/getVideo";

const videoSchema = z.object({
  url: z.string().trim().optional(),
  videoId: z.string().trim().optional(),
  maxResults: z.coerce.number().int().min(1).max(5000).optional(),
});

const youtubeVideoIdSchema = z.string().regex(/^[A-Za-z0-9_-]{11}$/);

type ApiErrorBody = {
  success: false;
  status: number;
  error: string;
  details?: string;
  code?: string;
};

function jsonError(status: number, error: string, details?: string, code?: string) {
  const body: ApiErrorBody = {
    success: false,
    status,
    error,
  };

  if (details) {
    body.details = details;
  }

  if (code) {
    body.code = code;
  }

  console.error("[YouTube Video API] final error response", body);

  return NextResponse.json(body, { status });
}

function isJsonContentType(req: NextRequest) {
  const contentType = req.headers.get("content-type");
  return typeof contentType === "string" && contentType.toLowerCase().includes("application/json");
}

function isYouTubeUrl(value: string) {
  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    return hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtu.be";
  } catch {
    return false;
  }
}

async function readJsonBody(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function validateAndResolveVideoId(body: unknown) {
  const parsed = videoSchema.safeParse(body);

  if (!parsed.success) {
    return {
      success: false as const,
      response: jsonError(
        400,
        "Invalid request body",
        parsed.error.issues[0]?.message ?? "Request body does not match the expected JSON shape."
      ),
    };
  }

  const { url, videoId, maxResults } = parsed.data;

  console.log("[YouTube Video API] body validation result", {
    hasUrl: Boolean(url),
    hasVideoId: Boolean(videoId),
    maxResults: maxResults ?? null,
  });

  if (!url && !videoId) {
    return {
      success: false as const,
      response: jsonError(
        400,
        "Missing videoId in request body.",
        "Provide either a valid YouTube URL in `url` or an 11-character YouTube video ID in `videoId`."
      ),
    };
  }

  if (videoId) {
    const videoIdValidation = youtubeVideoIdSchema.safeParse(videoId);

    if (!videoIdValidation.success) {
      return {
        success: false as const,
        response: jsonError(
          400,
          "Invalid video ID",
          "The `videoId` field must be an 11-character YouTube video ID."
        ),
      };
    }

    return {
      success: true as const,
      videoId: videoIdValidation.data,
      url: url ?? null,
      maxResults,
    };
  }

  if (!url) {
    return {
      success: false as const,
      response: jsonError(400, "Missing YouTube URL", "The `url` field is required when `videoId` is not provided."),
    };
  }

  if (!isYouTubeUrl(url)) {
    return {
      success: false as const,
      response: jsonError(
        400,
        "Invalid YouTube URL",
        "URL must use youtube.com, m.youtube.com, www.youtube.com, or youtu.be."
      ),
    };
  }

  const extractedVideoId = extractVideoId(url);

  console.log("[YouTube Video API] URL extraction result", {
    url,
    videoId: extractedVideoId,
  });

  if (!extractedVideoId) {
    return {
      success: false as const,
      response: jsonError(
        400,
        "Invalid YouTube URL",
        "Could not extract a valid 11-character video ID."
      ),
    };
  }

  return {
    success: true as const,
    videoId: extractedVideoId,
    url,
    maxResults,
  };
}

export async function POST(req: NextRequest) {
  try {
    console.log("[YouTube Video API] request received", {
      method: req.method,
      contentType: req.headers.get("content-type"),
      accept: req.headers.get("accept"),
    });

    if (!isJsonContentType(req)) {
      return jsonError(
        415,
        "Invalid request headers",
        "Content-Type must be application/json."
      );
    }

    const body = await readJsonBody(req);

    console.log("[YouTube Video API] incoming request body", {
      body,
    });

    if (!body) {
      return jsonError(400, "Invalid request body", "Request body must be valid JSON.");
    }

    const resolved = validateAndResolveVideoId(body);

    if (!resolved.success) {
      return resolved.response;
    }

    console.log("[YouTube Video API] fetching YouTube video", {
      videoId: resolved.videoId,
      url: resolved.url,
      maxResults: resolved.maxResults ?? null,
    });

    const video = await getVideo(resolved.videoId);

    const response = { success: true, status: 200, data: video };

    console.log("[YouTube Video API] final success response", {
      success: response.success,
      status: response.status,
      videoId: video.id,
      title: video.title,
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    if (isYouTubeRequestError(error)) {
      return jsonError(error.status, error.message, error.details, error.code);
    }

    const message = error instanceof Error ? error.message : "Unable to fetch video.";

    console.error("[YouTube Video API] unexpected failure", {
      message,
    });

    return jsonError(500, "Unable to fetch video", message);
  }
}
