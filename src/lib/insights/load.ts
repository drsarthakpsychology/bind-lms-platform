import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount } from "@/lib/people/hidden";
import { conceptById } from "@/lib/learn/concepts";
import { istToday } from "@/lib/learn/engine";
import { MODULES } from "@/lib/study";
import { EXPERIMENTS } from "@/lib/lab/experiments";
import { computeLearningInsights, type InsightCatalog, type InsightRow, type LearningInsights } from "./learning";

export const LEARNING_CATALOG: InsightCatalog = {
  modules: MODULES.map((m) => ({ id: m.id, num: m.num, title: m.title, sections: m.sections.map((s) => s.id) })),
  experiments: EXPERIMENTS.map((e) => ({ id: e.id, num: e.num, title: e.title })),
  conceptLabel: (id) => conceptById(id)?.term,
};

export type LoadResult = { ok: true; insights: LearningInsights } | { ok: false; reason: string };

/**
 * Loads every student's Learn state with the service-role client and
 * aggregates it. Callers MUST have checked requireAdmin() first: this reads
 * every student's row. Never throws; a failed query returns { ok: false }.
 */
export async function loadLearningInsights(): Promise<LoadResult> {
  try {
    const admin = createAdminClient();
    const [profilesRes, learnRes] = await Promise.all([
      admin.from("profiles").select("id, name, email, is_test, role").eq("role", "student").limit(5000),
      admin.from("learn_progress").select("user_id, state, updated_at").limit(5000),
    ]);
    if (profilesRes.error) return { ok: false, reason: "profiles" };
    if (learnRes.error) return { ok: false, reason: "learn_progress" };

    const learn = new Map((learnRes.data ?? []).map((r) => [String(r.user_id), r]));
    const rows: InsightRow[] = (profilesRes.data ?? [])
      .filter((p) => !isHiddenAccount(p))
      .map((p) => {
        const l = learn.get(String(p.id));
        return {
          user_id: String(p.id),
          name: (p.name as string | null) || (p.email as string | null) || "Unnamed student",
          state: l?.state ?? null,
          updated_at: (l?.updated_at as string | null | undefined) ?? null,
        };
      });
    return { ok: true, insights: computeLearningInsights(rows, LEARNING_CATALOG, istToday()) };
  } catch {
    return { ok: false, reason: "unexpected" };
  }
}
