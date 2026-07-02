import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { extractVideoId } from "@/lib/youtube/extractVideoId";
import { getVideo } from "@/lib/youtube/getVideo";

const videoSchema = z.object({
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = videoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(parsed.data.url);

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube URL." },
        { status: 400 }
      );
    }

    const video = await getVideo(videoId);

    return NextResponse.json({ success: true, data: video });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to fetch video.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
