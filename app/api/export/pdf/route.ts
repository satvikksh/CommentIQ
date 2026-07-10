import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { buildAnalysisPdf } from "@/lib/export";

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
    include: { video: true, categories: true },
  });

  if (!analysis) {
    return NextResponse.json({ success: false, error: "Analysis not found" }, { status: 404 });
  }

  const buffer = await buildAnalysisPdf(analysis);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="commentiq-analysis-${analysisId}.pdf"`,
    },
  });
}

export async function GET(req: NextRequest) {
  return handleExport(req);
}

export async function POST(req: NextRequest) {
  return handleExport(req);
}
