"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Server copy of the first-time tips a student has closed (table
 * tip_dismissals, supabase/migrations_pending/2026_11_tips.sql). Until that
 * table exists every call fails quietly and the browser copy is used.
 */

const ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

/** The signed-in student's id and the tips they closed (`ids` is null when the table is missing). */
export async function loadTips(): Promise<{ owner: string | null; ids: string[] | null }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { owner: null, ids: null };
    const { data, error } = await supabase.from("tip_dismissals").select("tip_id").eq("user_id", user.id).limit(500);
    if (error) return { owner: user.id, ids: null };
    return { owner: user.id, ids: (data ?? []).map((r) => String(r.tip_id)) };
  } catch {
    return { owner: null, ids: null };
  }
}

/** Remember that the student closed these tips. Returns false when it could not be saved. */
export async function saveTips(ids: string[]): Promise<boolean> {
  const clean = [...new Set(ids)].filter((id) => ID.test(id)).slice(0, 100);
  if (!clean.length) return true;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from("tip_dismissals").upsert(
      clean.map((tip_id) => ({ user_id: user.id, tip_id })),
      { onConflict: "user_id,tip_id", ignoreDuplicates: true },
    );
    return !error;
  } catch {
    return false;
  }
}
