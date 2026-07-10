import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { buildAnalysisCsv } from "@/lib/export";

async function getAnalysisId(req: NextRequest) {
  if (req.method === "GET") {
    return req.nextUrl.searchParams.get("analysisId");
  }

  const body = await req.json();
  return typeof body.analysisId === "string" ? body.analysisId : null;
}

async function handleExport(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const analysisId = await getAnalysisId(req);

  if (!analysisId) {
    return NextResponse.json({ success: false, error: "analysisId is required" }, { status: 400 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId: user.id },
    include: { categories: true },
  });

  if (!analysis) {
    return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 });
  }

  const csv = buildAnalysisCsv(analysis);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="commentiq-analysis-${analysisId}.csv"`,
    },
  });
}

export async function GET(req: NextRequest) {
  return handleExport(req);
}

export async function POST(req: NextRequest) {
  return handleExport(req);
}
