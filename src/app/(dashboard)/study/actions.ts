"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { istToday, normalise, type LearnState } from "@/lib/learn/engine";
import { clampLearnSave } from "@/lib/learn/integrity";
import { after } from "next/server";
import { awardEligibleBadges } from "@/lib/achievements/server";
import { newlyFinishedModules } from "@/lib/achievements/completion";
import { moduleFacets } from "@/lib/achievements/rules";
import { keepBestTests } from "@/lib/study/progress";
import { getSession } from "@/lib/auth/session";
import { MODULES } from "@/lib/study";
import { testSection } from "@/lib/study/plan";
import { splitSection } from "@/lib/study/chunk";
import { certificateModules } from "@/lib/achievements/certificate";
import { gradeTest, keepServerTests, withTestResult } from "@/lib/study/test-grade";

/** The stored state, plus the id of the student it belongs to (keys the browser copy). */
export type OwnedLearnState = LearnState & { owner?: string };

/**
 * Learn progress lives in one JSON row per student (learn_progress). If the
 * table hasn't been created yet, these fail quietly and the browser copy is
 * used instead, so the feature never breaks.
 *
 * The returned object carries an extra `owner` (the auth user id) so the
 * browser store can keep one localStorage copy per student. It is stripped by
 * normalise() everywhere else. When there is no row yet, an empty state is
 * returned (still with `owner`) rather than null.
 */
export async function loadLearnState(): Promise<OwnedLearnState | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("learn_progress").select("state").eq("user_id", user.id).maybeSingle();
    if (error) console.warn("loadLearnState: learn_progress read failed:", error.message);
    return { ...normalise(data?.state ?? null), owner: user.id };
  } catch (e) {
    console.warn("loadLearnState failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

/**
 * Save the student's Learn state. The client computes XP, so the server clamps
 * every save against the stored row (src/lib/learn/integrity.ts): XP never
 * drops, rises only with plausible per-day history, and old days are frozen.
 * `clamped: true` tells the browser store its local copy is not trustworthy,
 * so the server copy wins on the next load.
 */
export async function saveLearnState(state: LearnState): Promise<{ ok: boolean; clamped?: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const next = normalise(state);
    // Size guard: a state is a few KB; refuse anything absurd.
    if (JSON.stringify(next).length > 200_000) return { ok: false };

    const { data: row, error: readErr } = await supabase.from("learn_progress").select("state, updated_at").eq("user_id", user.id).maybeSingle();
    if (readErr) {
      // Without the stored row we cannot clamp safely, so do not write.
      console.warn("saveLearnState: learn_progress read failed:", readErr.message);
      return { ok: false };
    }
    const prev = row ? { state: normalise(row.state), updatedDay: row.updated_at ? istToday(new Date(row.updated_at as string)) : null } : null;
    const { state: clamp, clamped } = clampLearnSave(prev, next, istToday());
    // Best test scores never go down (the certificate counts the best score).
    // Module test results (the certificate's) are graded and stored only by
    // submitModuleTest; whatever the browser sends for them is ignored.
    const tests = keepServerTests(keepBestTests(prev?.state.study.tests, clamp.study.tests), prev?.state.study.tests, serverOwnedTests());
    const clean = { ...clamp, study: { ...clamp.study, tests } };
    if (clamped) console.warn(`saveLearnState: clamped an implausible Learn save for ${user.id} (sent xp ${next.xp}, kept ${clean.xp})`);

    // Write with the service role when it is configured, so student INSERT and
    // UPDATE on learn_progress can be revoked (optional migration
    // 2026_11_learn_progress_server_writes.sql) without breaking saves. The
    // user id comes from the verified session above, never from the client.
    let writer: Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createAdminClient> = supabase;
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) writer = createAdminClient();
    } catch {
      writer = supabase;
    }
    const { error } = await writer
      .from("learn_progress")
      .upsert({ user_id: user.id, state: clean, xp: clean.xp, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) console.warn("saveLearnState: learn_progress write failed:", error.message);
    // A module just finished: award its badge (and any mastery milestone) on
    // the server, after the response, so the save stays fast.
    if (!error) {
      const finished = newlyFinishedModules(prev?.state.study ?? null, clean.study, moduleFacets());
      if (finished.length && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        after(() => awardEligibleBadges(createAdminClient(), user.id, null).then(() => undefined, (e) => console.warn("module badge award failed:", e instanceof Error ? e.message : e)));
      }
    }
    return { ok: !error, clamped };
  } catch (e) {
    console.warn("saveLearnState failed:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}

/** Module ids whose test result only the server may write (the certificate's tests). */
function serverOwnedTests(): string[] {
  return certificateModules().map((m) => m.id);
}

/**
 * Grade a module test on the server. The browser sends only the picks; the
 * questions and answers come from the server copy of the module, the score is
 * worked out here, and the best result is stored with the service role. The
 * certificate reads only these results.
 */
export async function submitModuleTest(moduleId: string, picks: Record<string, number>): Promise<{ ok: boolean; right?: number; total?: number }> {
  try {
    const session = await getSession();
    if (session.status !== "ok") return { ok: false };
    const userId = session.profile.id;
    if (typeof moduleId !== "string" || !picks || typeof picks !== "object" || Object.keys(picks).length > 500) return { ok: false };
    const mod = MODULES.find((m) => m.id === moduleId);
    const section = mod ? testSection(mod) : undefined;
    if (!mod || !section) return { ok: false };
    const { right, total } = gradeTest(splitSection(section).mcq, moduleId, picks);
    if (!total) return { ok: false };

    let db: Awaited<ReturnType<typeof createClient>> | ReturnType<typeof createAdminClient>;
    try {
      db = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : await createClient();
    } catch {
      db = await createClient();
    }
    const { data: row, error: readErr } = await db.from("learn_progress").select("state").eq("user_id", userId).maybeSingle();
    if (readErr) return { ok: false };
    const state = withTestResult(normalise(row?.state ?? null), moduleId, right, total, istToday());
    const { error } = await db
      .from("learn_progress")
      .upsert({ user_id: userId, state, xp: state.xp, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) {
      console.warn("submitModuleTest: write failed:", error.message);
      return { ok: false };
    }
    return { ok: true, right, total };
  } catch (e) {
    console.warn("submitModuleTest failed:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}
