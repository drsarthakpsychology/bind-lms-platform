import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { appContext } from "@/lib/app-api/context";

/** Sections switched off for one student. Missing table = nothing off. */
export const loadMyBlocks = cache(async (userId: string): Promise<string[]> => {
  // A mobile-app request reads them once (the guard started the read) and
  // every later caller in the same request reuses that answer.
  const app = appContext();
  if (app && app.profile.id === userId) return (app.blocks ??= readBlocks(userId));
  return readBlocks(userId);
});

async function readBlocks(userId: string): Promise<string[]> {
  const { data, error } = await createAdminClient().from("access_blocks").select("feature").eq("user_id", userId).limit(200);
  if (error) return [];
  return (data ?? []).map((r) => r.feature as string);
}

/** Everyone's switched-off sections, for admin lists. */
export async function loadAllBlocks(): Promise<{ byUser: Map<string, string[]>; ready: boolean }> {
  const { data, error } = await createAdminClient().from("access_blocks").select("user_id, feature").limit(50000);
  const byUser = new Map<string, string[]>();
  for (const r of data ?? []) byUser.set(r.user_id as string, [...(byUser.get(r.user_id as string) ?? []), r.feature as string]);
  return { byUser, ready: !error };
}
