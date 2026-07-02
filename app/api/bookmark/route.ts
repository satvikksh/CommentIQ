import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const bookmarkSchema = z.object({
  analysisId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = bookmarkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: parsed.data.analysisId, userId: user.id },
  });

  if (!analysis) {
    return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 });
  }

  const updated = await prisma.analysis.update({
    where: { id: parsed.data.analysisId },
    data: { isBookmarked: !analysis.isBookmarked },
  });

  return NextResponse.json({ success: true, data: updated });
}
