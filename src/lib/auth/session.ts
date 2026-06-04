import { cache } from "react";

import { auth } from "@/lib/auth";

export const getSession = cache(async () => auth());

export async function requireSession() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}
