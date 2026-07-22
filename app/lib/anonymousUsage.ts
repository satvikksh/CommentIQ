import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ANONYMOUS_USAGE_COOKIE = "commentiq_anon_usage";
export const ANONYMOUS_ANALYSIS_LIMIT = 5;

interface AnonymousUsage {
  count: number;
  updatedAt: string;
}

function getSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not configured");
  }

  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function serializeAnonymousUsage(usage: AnonymousUsage) {
  const payload = Buffer.from(JSON.stringify(usage)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readAnonymousUsage(req: NextRequest): AnonymousUsage {
  const raw = req.cookies.get(ANONYMOUS_USAGE_COOKIE)?.value;

  if (!raw) {
    return { count: 0, updatedAt: new Date().toISOString() };
  }

  const [payload, signature] = raw.split(".");

  if (!payload || !signature) {
    return { count: 0, updatedAt: new Date().toISOString() };
  }

  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return { count: 0, updatedAt: new Date().toISOString() };
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    return {
      count: Math.max(0, Number(parsed.count) || 0),
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return { count: 0, updatedAt: new Date().toISOString() };
  }
}

export function incrementAnonymousUsage(req: NextRequest) {
  const current = readAnonymousUsage(req);

  return {
    count: current.count + 1,
    updatedAt: new Date().toISOString(),
  };
}
