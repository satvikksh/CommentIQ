import { NextRequest } from "next/server";

import { auth } from "@/lib/auth/auth";

export async function getSessionUser(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return null;
  }

  return session.user;
}
