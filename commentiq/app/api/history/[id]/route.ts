import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      video: true,
      comments: true,
      categories: true,
    },
  });

  if (!analysis) {
    return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: analysis });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await prisma.analysis.deleteMany({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
