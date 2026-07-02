import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { extractVideoId } from "@/lib/youtube/extractVideoId";
import { getVideo } from "@/lib/youtube/getVideo";
import { getComments } from "@/lib/youtube/getComments";
import { getSessionUser } from "@/lib/auth/session";

const commentsSchema = z.object({
  url: z.string().url(),
  maxResults: z.number().int().positive().max(5000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = commentsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const videoId = extractVideoId(parsed.data.url);

    if (!videoId) {
      return NextResponse.json({ success: false, error: "Invalid YouTube URL." }, { status: 400 });
    }

    await getVideo(videoId);
    const comments = await getComments(videoId, parsed.data.maxResults ?? 1000);

    return NextResponse.json({ success: true, data: comments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch comments.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "YouTube comments endpoint is available." });
}
