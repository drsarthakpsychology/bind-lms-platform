import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";

/** Each student's cohort ids (empty map if the cohort tables are missing). */
export const loadCohortMap = cache(async (): Promise<Map<string, string[]>> => {
  const cohorts = new Map<string, string[]>();
  try {
    const { data, error } = await createAdminClient().from("cohort_members").select("cohort_id, user_id").limit(20000);
    if (error) return cohorts;
    for (const m of data ?? []) {
      const k = m.user_id as string;
      cohorts.set(k, [...(cohorts.get(k) ?? []), m.cohort_id as string]);
    }
  } catch {
    // No cohort data: everyone counts as "not in a cohort".
  }
  return cohorts;
});
