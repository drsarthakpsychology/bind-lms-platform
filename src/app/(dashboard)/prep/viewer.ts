import "server-only";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { EXAM_TRACKS_ENABLED, activeGoal, isGoal } from "@/lib/prep/catalog";
import { loadProfile } from "@/lib/prep/server";
import type { PrepExam } from "@/lib/prep/types";

/** Cookie copies of the goal and "diagnostic done", so /prep still works before its tables exist. */
export const GOAL_COOKIE = "prep_goal";
export const DIAG_COOKIE = "prep_diag";
/** The diagnostic cookie's value for the shared course (no goal). */
export const ALL_SUBJECTS = "all";

/** Who is viewing. `learner` = a student or alumnus whose answers count; staff see a preview. */
export async function prepViewer(): Promise<{ id: string; learner: boolean }> {
  const s = await getSession();
  if (s.status !== "ok") return { id: "", learner: false };
  return { id: s.profile.id, learner: s.profile.role === "student" || s.profile.role === "alumni" };
}

/**
 * The cookie copies (only for the same account): the goal, and whether the
 * starting check is done. A shared-course check ("all") counts for any goal;
 * while exam tracks are off any check this account took counts.
 */
export async function cookieGoal(userId: string, tracks = EXAM_TRACKS_ENABLED): Promise<{ goal: PrepExam | null; diagnosed: boolean }> {
  const c = await cookies();
  const me = userId.slice(0, 8);
  if (!userId) return { goal: null, diagnosed: false };
  const [owner, raw] = (c.get(GOAL_COOKIE)?.value ?? "").split(":");
  const goal = owner === me && isGoal(raw) ? raw : null;
  const [dOwner, dFor] = (c.get(DIAG_COOKIE)?.value ?? "").split(":");
  const diagnosed = dOwner === me && (!tracks || dFor === ALL_SUBJECTS || (!!goal && dFor === goal));
  return { goal, diagnosed };
}

/** The goal that shapes what this student sees: database first, then the cookie copy. Always null while exam tracks are off. */
export async function currentGoal(userId: string): Promise<PrepExam | null> {
  if (!EXAM_TRACKS_ENABLED) return null;
  const [p, c] = await Promise.all([loadProfile(userId), cookieGoal(userId)]);
  return activeGoal(p.goal ?? c.goal);
}
