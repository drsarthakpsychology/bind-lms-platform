"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { istToday, normalise, type LearnState } from "@/lib/learn/engine";
import { clampLearnSave } from "@/lib/learn/integrity";

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
    const { state: clean, clamped } = clampLearnSave(prev, next, istToday());
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
    return { ok: !error, clamped };
  } catch (e) {
    console.warn("saveLearnState failed:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}
