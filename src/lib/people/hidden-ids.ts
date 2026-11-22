import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount } from "./hidden";
import { isRemovedAccount } from "./removal-rules";
import { requestMemo } from "@/lib/app-api/context";

/** Ids of every hidden (test or robot) account, once per request. */
export const loadHiddenIds = cache(
  (): Promise<Set<string>> =>
    requestMemo("people:hidden", async () => {
      const { data } = await createAdminClient().from("profiles").select("id, email, is_test").limit(10000);
      return new Set((data ?? []).filter(isHiddenAccount).map((p) => p.id as string));
    }),
);

/**
 * Ids of people removed from VIBHA (and deleted accounts), once per request.
 * Students' lists (wall, doubts) leave them out; admin lists still show them
 * so they can be restored. See src/lib/people/removal-rules.ts.
 */
export const loadRemovedIds = cache(
  (): Promise<Set<string>> =>
    requestMemo("people:removed", async () => {
      const { data } = await createAdminClient().from("profiles").select("id, status, block_reason").eq("status", "blocked").limit(10000);
      return new Set((data ?? []).filter(isRemovedAccount).map((p) => p.id as string));
    }),
);

/** Hidden accounts plus removed people: who students never see in a list. */
export async function loadStudentHiddenIds(): Promise<Set<string>> {
  const [hidden, removed] = await Promise.all([loadHiddenIds().catch(() => new Set<string>()), loadRemovedIds().catch(() => new Set<string>())]);
  return new Set([...hidden, ...removed]);
}
