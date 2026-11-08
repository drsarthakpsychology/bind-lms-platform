"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { longCards } from "@/lib/prep/long-server";

const ids = z.array(z.string().min(1).max(120)).max(200);

/** Titles and links for the Saved and Practise again lists (the ids live on the device). */
export async function longCardsFor(input: string[]): Promise<ReturnType<typeof longCards>> {
  const s = await getSession();
  if (s.status !== "ok") return [];
  const parsed = ids.safeParse(input);
  return parsed.success ? longCards(parsed.data) : [];
}
