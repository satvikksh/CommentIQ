import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";

export async function getServerUser() {
  const session = await auth.api.getSession({ headers: headers() });
  return session?.user ?? null;
}
