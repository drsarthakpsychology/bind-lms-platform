import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount } from "./hidden";

/** Ids of every hidden (test or robot) account, once per request. */
export const loadHiddenIds = cache(async (): Promise<Set<string>> => {
  const { data } = await createAdminClient().from("profiles").select("id, email, is_test").limit(10000);
  return new Set((data ?? []).filter(isHiddenAccount).map((p) => p.id as string));
});
