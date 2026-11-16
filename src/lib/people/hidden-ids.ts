import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount } from "./hidden";
import { requestMemo } from "@/lib/app-api/context";

/** Ids of every hidden (test or robot) account, once per request. */
export const loadHiddenIds = cache(
  (): Promise<Set<string>> =>
    requestMemo("people:hidden", async () => {
      const { data } = await createAdminClient().from("profiles").select("id, email, is_test").limit(10000);
      return new Set((data ?? []).filter(isHiddenAccount).map((p) => p.id as string));
    }),
);
