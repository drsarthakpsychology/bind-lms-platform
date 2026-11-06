import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { describePath } from "@/lib/analytics/activity";

export type LiveRow = { userId: string; where: string; lessonId: string | null; since: string; watching: boolean };

/** Lecture progress is pinged every 10 s while a video plays. */
const WATCHING_MS = 90 * 1000;
/** The visit tracker beats every 2 minutes. */
const ONLINE_MS = 5 * 60 * 1000;

/**
 * Who is on VIBHA right now, and who is watching a lecture right now — from
 * the live signals the app already sends (visit heartbeat, lecture progress
 * ping). Nothing is guessed: "watching" means the player reported progress in
 * the last 90 seconds.
 */
export async function loadLive(now = Date.now()) {
  const admin = createAdminClient();
  const [visits, progress, lessons] = await Promise.all([
    admin.from("page_visits").select("user_id, path, entered_at, left_at, duration_seconds").gte("entered_at", new Date(now - 6 * 3600000).toISOString()).order("entered_at", { ascending: false }).limit(5000),
    admin.from("progress").select("user_id, lesson_id, updated_at").gte("updated_at", new Date(now - WATCHING_MS).toISOString()).limit(2000),
    admin.from("lessons").select("id, title"),
  ]);
  const titles = new Map((lessons.data ?? []).map((l) => [l.id as string, l.title as string]));
  const live = new Map<string, LiveRow>();
  for (const v of visits.data ?? []) {
    const id = v.user_id as string;
    if (live.has(id)) continue; // newest visit first
    const end = v.left_at ? new Date(v.left_at as string).getTime() : new Date(v.entered_at as string).getTime() + Math.max(0, Number(v.duration_seconds ?? 0)) * 1000;
    if (now - Math.max(end, new Date(v.entered_at as string).getTime()) > ONLINE_MS) continue;
    live.set(id, { userId: id, where: describePath(String(v.path), titles), lessonId: null, since: v.entered_at as string, watching: false });
  }
  for (const p of progress.error ? [] : (progress.data ?? [])) {
    const id = p.user_id as string;
    const row = live.get(id) ?? { userId: id, where: "", lessonId: null, since: p.updated_at as string, watching: false };
    row.watching = true;
    row.lessonId = p.lesson_id as string;
    row.where = `Watching: ${titles.get(p.lesson_id as string) ?? "a lecture"}`;
    live.set(id, row);
  }
  return [...live.values()].sort((a, b) => Number(b.watching) - Number(a.watching) || (a.since < b.since ? 1 : -1));
}

/** Students seen today (India time). */
export function istDayStart(now = Date.now()): string {
  const ist = new Date(now + 5.5 * 3600000);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - 5.5 * 3600000).toISOString();
}
