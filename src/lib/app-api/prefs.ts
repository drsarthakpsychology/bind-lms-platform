import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { NotificationPrefs, ReminderPrefs } from "./contract";
import { tableMissing } from "./devices";
import { loadReminderPrefs, saveReminderPrefs } from "@/lib/reminders/prefs";

/**
 * Notification preferences (table app_notification_prefs, one row per
 * person, written by the server only). Before the database step every read
 * answers the defaults with `synced: false` and every write is a no-op: the
 * app keeps them on the phone.
 */
export type PushKind = "messages" | "doubtReplies" | "achievements" | "reminders";

export const DEFAULT_PREFS: Omit<NotificationPrefs, "synced" | "reminders"> = {
  push: true,
  messages: true,
  doubtReplies: true,
  achievements: true,
  studyReminder: false,
  studyReminderTime: "19:00",
};

type Row = { user_id: string; push: boolean; messages: boolean; doubt_replies: boolean; achievements: boolean; study_reminder: boolean; study_reminder_time: string };

type Base = Omit<NotificationPrefs, "synced" | "reminders">;

const fromRow = (r: Row | null): Base =>
  r
    ? { push: r.push, messages: r.messages, doubtReplies: r.doubt_replies, achievements: r.achievements, studyReminder: r.study_reminder, studyReminderTime: r.study_reminder_time }
    : { ...DEFAULT_PREFS };

function db() {
  try {
    return process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : null;
  } catch {
    return null;
  }
}

const COLS = "user_id, push, messages, doubt_replies, achievements, study_reminder, study_reminder_time";

async function loadBase(userId: string): Promise<Base & { synced: boolean }> {
  const d = db();
  if (!d) return { ...DEFAULT_PREFS, synced: false };
  const { data, error } = await d.from("app_notification_prefs").select(COLS).eq("user_id", userId).maybeSingle();
  if (error) return { ...DEFAULT_PREFS, synced: false };
  return { ...fromRow(data as Row | null), synced: true };
}

/** Every choice, with the reminder switches (their own table, all on until saved). */
export async function loadPrefs(userId: string): Promise<NotificationPrefs> {
  const [base, rem] = await Promise.all([loadBase(userId), loadReminderPrefs(userId)]);
  return { ...base, reminders: rem.prefs };
}

/** For push: the preferences of many people. People with no row get the defaults (absent from the map). */
export async function loadPrefsMany(userIds: string[]): Promise<Map<string, Base>> {
  const out = new Map<string, Base>();
  const d = db();
  if (!d || !userIds.length) return out;
  for (let i = 0; i < userIds.length; i += 500) {
    const { data, error } = await d.from("app_notification_prefs").select(COLS).in("user_id", userIds.slice(i, i + 500));
    if (error) return out;
    for (const r of (data ?? []) as Row[]) out.set(r.user_id, fromRow(r));
  }
  return out;
}

export async function savePrefs(userId: string, input: Partial<Omit<NotificationPrefs, "synced" | "reminders">> & { reminders?: Partial<ReminderPrefs> }): Promise<NotificationPrefs> {
  const { reminders: remPatch, ...patch } = input;
  const reminders = remPatch && Object.keys(remPatch).length ? (await saveReminderPrefs(userId, remPatch)).prefs : (await loadReminderPrefs(userId)).prefs;
  const d = db();
  const current = await loadBase(userId);
  if (!d || !current.synced) return { ...current, ...patch, reminders, synced: false };
  const next = { ...current, ...patch };
  const { error } = await d.from("app_notification_prefs").upsert(
    {
      user_id: userId,
      push: next.push,
      messages: next.messages,
      doubt_replies: next.doubtReplies,
      achievements: next.achievements,
      study_reminder: next.studyReminder,
      study_reminder_time: next.studyReminderTime,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) {
    if (!tableMissing(error)) console.error("app_notification_prefs write failed:", error.code, error.message);
    return { ...next, reminders, synced: false };
  }
  return { ...next, reminders, synced: true };
}
