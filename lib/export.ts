import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildAnalysisCsv(analysis: any) {
  const rows: string[] = [];
  rows.push("Section,Value");
  rows.push(`Title,${escapeCsv(analysis.title ?? "")}`);
  rows.push(`Summary,${escapeCsv(analysis.summary ?? "")}`);
  rows.push(`Overall Sentiment,${escapeCsv(analysis.overallSentiment ?? "")}`);
  rows.push(`Total Comments,${analysis.totalComments ?? 0}`);
  rows.push(`Analyzed Chunks,${analysis.analyzedChunks ?? 0}`);
  rows.push("\nCategory,Count,Summary");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (analysis.categories ?? []).forEach((category: any) => {
    rows.push(`${escapeCsv(category.name)},${category.count},${escapeCsv(category.summary ?? "")}`);
  });

  return rows.join("\n");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildAnalysisJson(analysis: any) {
  return JSON.stringify(analysis, null, 2);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function buildAnalysisPdf(analysis: any) {
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  doc.pipe(stream);
  doc.fontSize(22).fillColor("#ef4444").text("CommentIQ Analysis Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).fillColor("#ffffff").text(`Title: ${analysis.title ?? "Untitled"}`);
  doc.text(`Video: ${analysis.video?.title ?? "Unknown"}`);
  doc.text(`Date: ${new Date(analysis.createdAt).toLocaleString()}`);
  doc.text(`Total Comments: ${analysis.totalComments ?? 0}`);
  doc.text(`Overall Sentiment: ${analysis.overallSentiment ?? "Unknown"}`);
  doc.moveDown();
  doc.fontSize(14).fillColor("#f8fafc").text("Summary", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#e2e8f0").text(analysis.summary ?? "No summary available", { lineGap: 4 });
  doc.moveDown();
  doc.fontSize(14).fillColor("#f8fafc").text("Top Categories", { underline: true });
  doc.moveDown(0.5);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (analysis.categories ?? []).slice(0, 10).forEach((category: any) => {
    doc.fontSize(11).fillColor("#e2e8f0").text(`• ${category.name} (${category.count})`, { continued: true });
    if (category.summary) {
      doc.text(` — ${category.summary}`);
    } else {
      doc.text("");
    }
  });

  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

function escapeCsv(value: unknown) {
  const asString = String(value ?? "");
  if (asString.includes(",") || asString.includes("\n") || asString.includes('"')) {
    return `"${asString.replace(/"/g, '""')}"`;
  }
  return asString;
}
