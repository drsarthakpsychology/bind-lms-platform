"use server";

import { createClient } from "@/lib/supabase/server";
import { normalise, type LearnState } from "@/lib/learn/engine";

/**
 * Learn progress lives in one JSON row per student (learn_progress). If the
 * table hasn't been created yet, these fail quietly and the browser copy is
 * used instead, so the feature never breaks.
 */
export async function loadLearnState(): Promise<LearnState | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("learn_progress").select("state").eq("user_id", user.id).maybeSingle();
    if (error || !data) return null;
    return normalise(data.state);
  } catch {
    return null;
  }
}

export async function saveLearnState(state: LearnState): Promise<{ ok: boolean }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const clean = normalise(state);
    // Size guard: a state is a few KB; refuse anything absurd.
    if (JSON.stringify(clean).length > 200_000) return { ok: false };
    const { error } = await supabase
      .from("learn_progress")
      .upsert({ user_id: user.id, state: clean, xp: clean.xp, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
