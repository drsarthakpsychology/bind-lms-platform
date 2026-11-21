import "server-only";
import type { ReminderPrefs } from "@/lib/app-api/contract";
import { sendPush, type BellRow } from "@/lib/app-api/push";
import { balanceOf, chunk, cohortStudents, fetchAll, loadBundle, mySessions, myVisits, type Db } from "@/lib/clinic/data";
import { localDate } from "@/lib/clinic/time";
import type { SessionRow } from "@/lib/clinic/types";
import { allowed, dueFor, KIND_DB, keyOf, type Reminder } from "./rules";

/**
 * The reminder run (GET /api/internal/cron?task=clinic-reminders, every 10
 * minutes from .github/workflows/reminders.yml). For every cohort with a
 * session today or a leave allowance: work out each student's due reminders
 * (rules.ts), drop the kinds they turned off, claim each one in
 * app_reminder_log (so it is sent once, even when two runs overlap), then
 * write the bell notice and send the phone push.
 *
 * Who gets what: only students (role student, not blocked) of that cohort,
 * and only about their own sessions, OPD days and leaves. A session made for
 * a test account's practice space (a `sandbox_user_id` on the session row)
 * reminds only that account.
 *
 * Without the reminders database step nothing is sent: no once-only record,
 * no reminder.
 */
export type ReminderReport = { ok: boolean; cohorts: number; due: number; sent: number; pushed: number; note?: string };

export type RunDeps = {
  db: Db;
  now: number;
  prefs: (userIds: string[]) => Promise<Map<string, ReminderPrefs>>;
  push: (rows: BellRow[]) => Promise<number>;
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const LINK_TEXT: Record<string, string> = { "/opd": "Log your cases", "/leave": "See your leaves" };

/** A session row's practice-space owner, when the test mode marks one. */
function sandboxOf(row: SessionRow): string | null {
  const v = (row as SessionRow & { sandbox_user_id?: string | null }).sandbox_user_id;
  return typeof v === "string" && v ? v : null;
}

/** Every reminder due now, over all cohorts, before the once-only check. */
export async function collectDue(db: Db, now: number): Promise<{ cohorts: number; due: Reminder[] }> {
  const today = localDate(now);
  const todays = await fetchAll<{ cohort_ids: string[] }>(() => db.from("clinic_sessions").select("cohort_ids").eq("date", today));
  const allowances = await fetchAll<{ cohort_id: string }>(() => db.from("clinic_leave_allowances").select("cohort_id"));
  const cohortIds = [...new Set([...todays.flatMap((s) => s.cohort_ids ?? []), ...allowances.map((a) => a.cohort_id)])].sort();

  const due = new Map<string, Reminder>();
  for (const cohortId of cohortIds) {
    const people = await cohortStudents(db, cohortId);
    if (!people.length) continue;
    const blocked = new Set<string>();
    for (const ids of chunk(people.map((p) => p.userId))) {
      const { data } = await db.from("profiles").select("id, status").in("id", ids);
      for (const p of (data ?? []) as { id: string; status: string | null }[]) if (p.status === "blocked" || p.status === "paused") blocked.add(p.id);
    }
    const b = await loadBundle(db, cohortId);
    const todayRows = b.sessions.filter((s) => s.date === today);
    const sandboxOwner = new Map<string, string>();
    for (const s of todayRows) {
      const owner = sandboxOf(s);
      if (owner) sandboxOwner.set(s.id, owner);
    }
    for (const p of people) {
      if (blocked.has(p.userId)) continue;
      const list = dueFor(
        {
          userId: p.userId,
          cohortId,
          sessions: mySessions(b, p.userId, todayRows, now),
          visits: myVisits(b, p.userId, today).filter((v) => v.date === today),
          balance: balanceOf(b, p.userId),
          sandboxOwner,
        },
        now,
      );
      for (const r of list) if (!due.has(keyOf(r))) due.set(keyOf(r), r);
    }
  }
  return { cohorts: cohortIds.length, due: [...due.values()] };
}

/** Claims reminders in the log; answers the ones this run may send. Null when the log table is not there. */
export async function claim(db: Db, list: readonly (Reminder & { notificationId: string })[], now: number): Promise<Set<string> | null> {
  const sentAt = new Date(now).toISOString();
  const won = new Set<string>();
  for (const part of chunk(list, 200)) {
    const r = await db
      .from("app_reminder_log")
      .upsert(
        part.map((x) => ({ user_id: x.userId, kind: KIND_DB[x.kind], ref: x.ref, notification_id: x.notificationId, sent_at: sentAt })),
        { onConflict: "user_id,kind,ref", ignoreDuplicates: true },
      )
      .select("user_id, kind, ref");
    if (r.error) {
      console.warn("reminders: log not ready:", r.error.code, r.error.message);
      return null;
    }
    for (const row of (r.data ?? []) as { user_id: string; kind: string; ref: string }[]) won.add(`${row.user_id}|${row.kind}|${row.ref}`);
  }
  return won;
}

export async function runReminders(deps: RunDeps): Promise<ReminderReport> {
  const { db, now } = deps;
  const { cohorts, due } = await collectDue(db, now);
  if (!due.length) return { ok: true, cohorts, due: 0, sent: 0, pushed: 0 };
  const prefs = await deps.prefs([...new Set(due.map((r) => r.userId))]);
  const wanted = allowed(due, prefs).map((r) => ({ ...r, notificationId: crypto.randomUUID() }));
  if (!wanted.length) return { ok: true, cohorts, due: due.length, sent: 0, pushed: 0 };

  const won = await claim(db, wanted, now);
  if (!won) return { ok: false, cohorts, due: due.length, sent: 0, pushed: 0, note: "Run the database step 2026_11_17_reminders.sql first." };
  const go = wanted.filter((r) => won.has(keyOf(r)));
  if (!go.length) return { ok: true, cohorts, due: due.length, sent: 0, pushed: 0 };

  const rows = go.map((r) => ({
    id: r.notificationId,
    user_id: r.userId,
    type: "message" as const,
    credential_id: null,
    title: r.title.slice(0, 140),
    body: r.text.slice(0, 500),
    body_html: `<p>${esc(r.text)}</p><p><a href="${r.link}">${LINK_TEXT[r.link] ?? "Open your schedule"}</a></p>`,
    href: `/notifications/${r.notificationId}`,
    sent_by: null,
  }));
  let sent = 0;
  for (const part of chunk(rows, 500)) {
    const { error } = await db.from("notifications").insert(part);
    if (error) {
      console.error("reminders: bell write failed:", error.code, error.message);
      break;
    }
    sent += part.length;
  }
  const pushed = sent ? await deps.push(rows.slice(0, sent)) : 0;

  // Keep the once-only log small: two months is plenty.
  await db.from("app_reminder_log").delete().lt("sent_at", new Date(now - 60 * 86_400_000).toISOString());
  return { ok: true, cohorts, due: due.length, sent, pushed };
}

/** The real run: service-role database, the saved switches, Expo push. */
export async function runRemindersNow(): Promise<ReminderReport> {
  const [{ clinicDb }, { loadReminderPrefsMany }] = await Promise.all([import("@/lib/clinic/db"), import("./prefs")]);
  return runReminders({
    db: clinicDb(),
    now: Date.now(),
    prefs: (ids) => loadReminderPrefsMany(ids),
    push: (rows) => sendPush(rows, "reminders"),
  });
}
