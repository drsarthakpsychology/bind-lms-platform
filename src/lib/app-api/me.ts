import "server-only";
import type { Profile } from "@/lib/auth/session";
import { gateFailure, type ApiGate } from "@/lib/auth/api-gate";
import { isLecturesOnly } from "@/lib/auth/scope";
import { loadMyBlocks } from "@/lib/access/blocks";
import { loadMyCohorts } from "@/lib/cohorts/access";
import { readFlags, type FlagStatus } from "@/lib/flags";
import { createAdminClient } from "@/lib/supabase/server";
import type { Access, Me, Watermark } from "./contract";

/** "Name · VIBHA-000123" for the moving video watermark. Falls back to the email, then a short id. */
export function watermarkFor(profile: Pick<Profile, "id" | "email" | "roll_number">, name: string | null): Watermark {
  const who = name || profile.email || `Student ${profile.id.slice(0, 8)}`;
  const roll = profile.roll_number ?? null;
  return { name: who, rollNumber: roll, text: roll ? `${who} · ${roll}` : `${who} · ${profile.id.slice(0, 8)}` };
}

/**
 * What this account may open, from the same three inputs the website uses
 * (scope, switched-off sections, feature flags) and the same decision
 * function (gateFailure). Pure.
 */
export function buildAccess(profile: Pick<Profile, "role" | "scope" | "status">, blocks: readonly string[], flags: Readonly<Record<string, FlagStatus | undefined>>, singleLessonId: string | null): Access {
  const admin = profile.role === "admin";
  const open = (gate: ApiGate) => admin || gateFailure(profile, gate, blocks, flags) === null;
  const lecturesOnly = isLecturesOnly(profile);
  const staff = profile.role === "admin" || profile.role === "view_admin";
  return {
    tabs: staff ? ["home", "students", "activity", "messages", "more"] : lecturesOnly ? ["home", "lectures", "doubts", "me"] : ["home", "learn", "practise", "library", "me"],
    lecturesOnly,
    singleLessonId: lecturesOnly ? singleLessonId : null,
    blocks: [...blocks],
    flags: Object.fromEntries(Object.entries(flags).filter((e): e is [string, FlagStatus] => e[1] !== undefined)),
    can: {
      lectures: open({ path: "/courses" }),
      study: open({ path: "/study", flag: "learn" }),
      doubts: open({ path: "/doubts" }),
      practice: open({ path: "/practice" }),
      games: open({ path: "/games" }),
      medicines: open({ path: "/practice/medicines" }),
      leaderboard: open({ path: "/leaderboard" }),
      journey: open({ path: "/journey" }),
      achievements: open({ path: "/achievements" }),
      notifications: open({ path: "/notifications" }),
    },
  };
}

export async function unreadCount(userId: string): Promise<number> {
  try {
    const { count } = await createAdminClient().from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).is("read_at", null);
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function singleLesson(userId: string): Promise<string | null> {
  try {
    const { data, error } = await createAdminClient().from("profiles").select("scope_lesson_id").eq("id", userId).maybeSingle();
    if (error) return null;
    return ((data as { scope_lesson_id?: string | null } | null)?.scope_lesson_id as string | null) ?? null;
  } catch {
    return null;
  }
}

/** Everything the app needs to know about the signed-in account. */
export async function buildMe(profile: Profile, name: string | null): Promise<Me> {
  const student = profile.role === "student";
  const [blocks, flags, cohorts, unread, lessonId] = await Promise.all([
    student ? loadMyBlocks(profile.id) : Promise.resolve([] as string[]),
    readFlags(),
    profile.role === "admin" || profile.role === "view_admin" ? Promise.resolve([]) : loadMyCohorts(profile.id),
    unreadCount(profile.id),
    isLecturesOnly(profile) ? singleLesson(profile.id) : Promise.resolve(null),
  ]);
  return {
    id: profile.id,
    email: profile.email,
    name,
    role: profile.role,
    scope: profile.scope,
    status: profile.status,
    rollNumber: profile.roll_number ?? null,
    mobileNumber: profile.mobile_number ?? null,
    askMobileNumber: student && !profile.mobile_number && !profile.mobile_prompt_skipped_at,
    expiresAt: profile.role === "alumni" ? null : (profile.expires_at ?? null),
    cohorts,
    access: buildAccess(profile, blocks, flags, lessonId),
    watermark: watermarkFor(profile, name),
    unreadNotifications: unread,
  };
}
