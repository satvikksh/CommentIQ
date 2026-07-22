import { headers } from "next/headers";

import { auth } from "@/app/lib/auth/auth";

export async function getServerUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
