import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get("search") || undefined;
  const sort = req.nextUrl.searchParams.get("sort") || "desc";
  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 10), 50);
  const bookmarked = req.nextUrl.searchParams.get("bookmarked") === "true";

  const where: any = { userId: user.id };

  if (bookmarked) {
    where.isBookmarked = true;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
      { video: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [analyses, total] = await Promise.all([
    prisma.analysis.findMany({
      where,
      include: { video: true },
      orderBy: { createdAt: sort === "asc" ? "asc" : "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.analysis.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: analyses,
    meta: {
      total,
      page,
      limit,
    },
  });
}
