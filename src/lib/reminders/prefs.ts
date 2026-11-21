import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { tableMissing } from "@/lib/app-api/devices";
import type { ReminderPrefs } from "@/lib/app-api/contract";
import { DEFAULT_REMINDERS } from "./rules";

/**
 * Reminder switches (table app_reminder_prefs, one row per person, written by
 * the server only). Kept apart from app_notification_prefs so the other
 * notification choices keep working before this database step is run.
 * Before it, reads answer all on (`synced: false`) and writes do nothing.
 */
type Row = { user_id: string; opd_day: boolean; session_soon: boolean; scan_out: boolean; case_log: boolean; leave_low: boolean };
const COLS = "user_id, opd_day, session_soon, scan_out, case_log, leave_low";

const fromRow = (r: Row | null): ReminderPrefs =>
  r ? { opdDay: r.opd_day, sessionSoon: r.session_soon, scanOut: r.scan_out, caseLog: r.case_log, leaveLow: r.leave_low } : { ...DEFAULT_REMINDERS };

function db() {
  try {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null;
  } catch {
    return null;
  }
}

export async function loadReminderPrefs(userId: string): Promise<{ prefs: ReminderPrefs; synced: boolean }> {
  const d = db();
  if (!d) return { prefs: { ...DEFAULT_REMINDERS }, synced: false };
  const { data, error } = await d.from("app_reminder_prefs").select(COLS).eq("user_id", userId).maybeSingle();
  if (error) return { prefs: { ...DEFAULT_REMINDERS }, synced: false };
  return { prefs: fromRow(data as Row | null), synced: true };
}

/** Many people at once. People with no row are absent (all on). */
export async function loadReminderPrefsMany(userIds: readonly string[]): Promise<Map<string, ReminderPrefs>> {
  const out = new Map<string, ReminderPrefs>();
  const d = db();
  if (!d || !userIds.length) return out;
  for (let i = 0; i < userIds.length; i += 500) {
    const { data, error } = await d.from("app_reminder_prefs").select(COLS).in("user_id", userIds.slice(i, i + 500));
    if (error) return out;
    for (const r of (data ?? []) as Row[]) out.set(r.user_id, fromRow(r));
  }
  return out;
}

export async function saveReminderPrefs(userId: string, patch: Partial<ReminderPrefs>): Promise<{ prefs: ReminderPrefs; synced: boolean }> {
  const current = await loadReminderPrefs(userId);
  const next = { ...current.prefs, ...patch };
  const d = db();
  if (!d || !current.synced) return { prefs: next, synced: false };
  const { error } = await d.from("app_reminder_prefs").upsert(
    {
      user_id: userId,
      opd_day: next.opdDay,
      session_soon: next.sessionSoon,
      scan_out: next.scanOut,
      case_log: next.caseLog,
      leave_low: next.leaveLow,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) {
    if (!tableMissing(error)) console.error("app_reminder_prefs write failed:", error.code, error.message);
    return { prefs: next, synced: false };
  }
  return { prefs: next, synced: true };
}
