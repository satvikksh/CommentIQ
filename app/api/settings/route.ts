import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  theme: z.enum(["dark", "light"]).optional(),
  notifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  aiPreferences: z.record(z.boolean()).optional(),
  exportPreferences: z.record(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.settings.findUnique({
    where: { userId: user.id },
  });

  if (!settings) {
    const created = await prisma.settings.create({
      data: {
        userId: user.id,
        theme: "dark",
        notifications: true,
        emailNotifications: true,
        aiPreferences: {
          sentiment: true,
          categories: true,
          spam: true,
          keywords: true,
        },
        exportPreferences: {
          format: "json",
        },
      },
    });

    return NextResponse.json({ success: true, data: created });
  }

  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser(req);

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updated = await prisma.settings.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      theme: parsed.data.theme ?? "dark",
      notifications: parsed.data.notifications ?? true,
      emailNotifications: parsed.data.emailNotifications ?? true,
      aiPreferences: parsed.data.aiPreferences ?? {},
      exportPreferences: parsed.data.exportPreferences ?? {},
    },
    update: parsed.data,
  });

  return NextResponse.json({ success: true, data: updated });
}
