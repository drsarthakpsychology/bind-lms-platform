import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Honest per-user practice state (casebook Finding 3).
 *
 * /practice used to hardcode `state` and `progress` strings ("day 4",
 * "case 3 / 60") in a config array, so every student saw the same fabricated
 * numbers. This computes state + progress from the real activity tables:
 *
 *   new          → no data at all (blank is honest; the card just shows its
 *                  description, no state chip, no progress line)
 *   in_progress  → an unfinished session exists (active sim session, pair
 *                  session, partial MSE/OSCE/Formulation history)
 *   done_today   → completed something since 00:00 IST
 *   due          → scheduled today (no surface has a real schedule yet — we
 *                  never fabricate it)
 *
 * Surfaces with no per-user table (Judgment, Decode, Two-Minute Clinic,
 * Ethics, Landmark, Out of Depth, Modules) return nothing → the card renders
 * without a state chip or progress line. That is the honest state.
 */

export type PracticeState = "new" | "in_progress" | "done_today" | "due";

export interface SurfaceState {
  state?: PracticeState;
  /** A real count from the user's own rows. Never fabricated. */
  progress?: string;
}

/** Midnight IST (UTC+05:30) as a UTC timestamp. */
export function startOfTodayIST(): Date {
  const now = new Date();
  const istMs = now.getTime() + 5.5 * 3600_000;
  const ist = new Date(istMs);
  const utcMidnight = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate());
  return new Date(utcMidnight - 5.5 * 3600_000);
}

/** Count the user's rows in a table, optionally filtered to today and/or by a
 *  non-default user column (wall_posts uses author_id) or an OR filter
 *  (pair_sessions: student_a OR student_b). */
async function countRows(
  supabase: SupabaseClient,
  table: string,
  userId: string,
  opts: {
    userCol?: string;
    or?: string;
    status?: string;
    todayOnly?: boolean;
    todayCol?: string;
  } = {},
): Promise<number> {
  const todayCol = opts.todayCol ?? "created_at";
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (opts.or) {
    q = q.or(opts.or);
  } else {
    q = q.eq(opts.userCol ?? "user_id", userId);
  }
  if (opts.status) q = q.eq("status", opts.status);
  if (opts.todayOnly) q = q.gte(todayCol, startOfTodayIST().toISOString());
  const { count, error } = await q;
  if (error) return 0;
  return count ?? 0;
}

export async function computePracticeStates(
  supabase: SupabaseClient,
  userId: string,
): Promise<Record<string, SurfaceState>> {
  const out: Record<string, SurfaceState> = {};

  // --- Consulting Room — sim_sessions (active = in progress; complete today = done) ---
  const [activeSessions, completeToday] = await Promise.all([
    countRows(supabase, "sim_sessions", userId, { status: "active" }),
    countRows(supabase, "sim_sessions", userId, { status: "complete", todayOnly: true, todayCol: "ended_at" }),
  ]);
  if (activeSessions > 0) out["/practice/consulting-room"] = { state: "in_progress" };
  else if (completeToday > 0) out["/practice/consulting-room"] = { state: "done_today" };

  // --- MSE Trainer — mse_attempts ---
  const [mseToday, mseCount] = await Promise.all([
    countRows(supabase, "mse_attempts", userId, { todayOnly: true }),
    countRows(supabase, "mse_attempts", userId),
  ]);
  if (mseToday > 0) out["/practice/mse"] = { state: "done_today" };
  else if (mseCount > 0) out["/practice/mse"] = { state: "in_progress", progress: `${mseCount} attempt${mseCount === 1 ? "" : "s"}` };

  // --- OSCE — osce_attempts ---
  const [osceToday, osceCount] = await Promise.all([
    countRows(supabase, "osce_attempts", userId, { todayOnly: true }),
    countRows(supabase, "osce_attempts", userId),
  ]);
  if (osceToday > 0) out["/practice/osce"] = { state: "done_today" };
  else if (osceCount > 0) out["/practice/osce"] = { state: "in_progress", progress: `${osceCount} station${osceCount === 1 ? "" : "s"} done` };

  // --- Formulation — formulation_attempts ---
  const [formToday, formCount] = await Promise.all([
    countRows(supabase, "formulation_attempts", userId, { todayOnly: true }),
    countRows(supabase, "formulation_attempts", userId),
  ]);
  if (formToday > 0) out["/practice/formulation"] = { state: "done_today" };
  else if (formCount > 0) out["/practice/formulation"] = { state: "in_progress", progress: `${formCount} case${formCount === 1 ? "" : "s"} done` };

  // --- Peer Role-Play — pair_sessions (a OR b) ---
  const pairCount = await countRows(supabase, "pair_sessions", userId, {
    or: `student_a.eq.${userId},student_b.eq.${userId}`,
  });
  if (pairCount > 0) out["/practice/role-play"] = { state: "in_progress", progress: `${pairCount} session${pairCount === 1 ? "" : "s"}` };

  // --- Cohort Wall — wall_posts (author_id) ---
  const wallCount = await countRows(supabase, "wall_posts", userId, { userCol: "author_id" });
  if (wallCount > 0) out["/wall"] = { progress: `${wallCount} post${wallCount === 1 ? "" : "s"}` };

  // --- Case Library — library_notes ---
  const libCount = await countRows(supabase, "library_notes", userId);
  if (libCount > 0) out["/practice/library"] = { progress: `${libCount} note${libCount === 1 ? "" : "s"}` };

  return out;
}
