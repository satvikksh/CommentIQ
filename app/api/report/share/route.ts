import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const shareSchema = z.object({
  analysisId: z.string().min(1),
  name: z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = shareSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: parsed.data.analysisId, userId: user.id },
  });

  if (!analysis) {
    return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 });
  }

  const saved = await prisma.savedReport.create({
    data: {
      userId: user.id,
      analysisId: analysis.id,
      name: parsed.data.name ?? `${analysis.title ?? "Analysis"} Report`,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/report/${saved.id}`;

  return NextResponse.json({ success: true, data: { id: saved.id, shareUrl } });
}
