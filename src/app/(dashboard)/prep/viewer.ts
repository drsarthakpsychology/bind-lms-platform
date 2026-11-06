import "server-only";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { isGoal } from "@/lib/prep/catalog";
import { loadProfile } from "@/lib/prep/server";
import type { PrepExam } from "@/lib/prep/types";

/** Cookie copies of the goal and "diagnostic done", so /prep still works before its tables exist. */
export const GOAL_COOKIE = "prep_goal";
export const DIAG_COOKIE = "prep_diag";

/** Who is viewing. `learner` = a student or alumnus whose answers count; staff see a preview. */
export async function prepViewer(): Promise<{ id: string; learner: boolean }> {
  const s = await getSession();
  if (s.status !== "ok") return { id: "", learner: false };
  return { id: s.profile.id, learner: s.profile.role === "student" || s.profile.role === "alumni" };
}

/** The goal from the database, else the cookie copy (only for the same account). */
export async function cookieGoal(userId: string): Promise<{ goal: PrepExam | null; diagnosed: boolean }> {
  const c = await cookies();
  const [owner, goal] = (c.get(GOAL_COOKIE)?.value ?? "").split(":");
  if (!userId || owner !== userId.slice(0, 8) || !isGoal(goal)) return { goal: null, diagnosed: false };
  return { goal, diagnosed: c.get(DIAG_COOKIE)?.value === `${userId.slice(0, 8)}:${goal}` };
}

/** The student's goal (database first, then the cookie copy). */
export async function currentGoal(userId: string): Promise<PrepExam | null> {
  const [p, c] = await Promise.all([loadProfile(userId), cookieGoal(userId)]);
  return p.goal ?? c.goal;
}
