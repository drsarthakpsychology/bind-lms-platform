import "server-only";
import { randomBytes } from "node:crypto";
import type { ClinicCalendarLink, ClinicMySession, ClinicVisit } from "@/lib/app-api/contract";
import { appUrl } from "@/lib/app-url";
import { dayShort, timeRange } from "@/components/clinic/format";
import { loadBundle, must, myVisits, mySessions, studentCohort, todayOf, type Db } from "./data";
import { buildIcs, type IcsEvent } from "./ics";
import { addDays } from "./time";
import type { DayNoteRow } from "./types";

/**
 * The student's private calendar link (supabase/migrations_pending/2026_11_17_calendar.sql).
 * One secret token per student; the link is /api/calendar/<token>.ics, which
 * Google Calendar and Apple Calendar subscribe to and fetch again on their
 * own, so moved and cancelled sessions follow. "Make a new link" replaces
 * the token, and the old link stops working at once.
 */

export const FEED_PAST_DAYS = 30;
export const FEED_AHEAD_DAYS = 180;
const TOKEN_RE = /^[A-Za-z0-9_-]{40,64}$/;

export const newToken = () => randomBytes(32).toString("base64url");
export const isToken = (t: string) => TOKEN_RE.test(t);

type TokenRow = { user_id: string; token: string; created_at: string };

export function linksFor(token: string, base = appUrl()): ClinicCalendarLink {
  const https = `${base}/api/calendar/${token}.ics`;
  const webcal = https.replace(/^https?:\/\//i, "webcal://");
  return { v: 1, https, webcal, google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}` };
}

/** My link, made the first time I ask. */
export async function getCalendarLink(db: Db, userId: string): Promise<ClinicCalendarLink> {
  const row = must(await db.from("clinic_calendar_tokens").select("*").eq("user_id", userId).maybeSingle(), null as TokenRow | null);
  if (row && isToken(row.token)) return linksFor(row.token);
  const token = newToken();
  const r = await db.from("clinic_calendar_tokens").insert({ user_id: userId, token });
  if (r.error?.code === "23505") {
    // Two taps at once: the other one made it.
    const again = must(await db.from("clinic_calendar_tokens").select("*").eq("user_id", userId).maybeSingle(), null as TokenRow | null);
    if (again) return linksFor(again.token);
  }
  must(r, null);
  return linksFor(token);
}

/** A new link; the old one stops working. */
export async function resetCalendarLink(db: Db, userId: string): Promise<ClinicCalendarLink> {
  const token = newToken();
  must(await db.from("clinic_calendar_tokens").upsert({ user_id: userId, token, created_at: new Date().toISOString() }, { onConflict: "user_id" }), null);
  return linksFor(token);
}

/** Who a token belongs to, or null (unknown, malformed or replaced). */
export async function userOfToken(db: Db, token: string): Promise<string | null> {
  if (!isToken(token)) return null;
  const row = must(await db.from("clinic_calendar_tokens").select("user_id, token").eq("token", token).maybeSingle(), null as Pick<TokenRow, "user_id" | "token"> | null);
  return row && row.token === token ? row.user_id : null;
}

/* -------------------------------------------------------------- feed */

/** "2026-11-18 08:00" to "Wed 18 Nov, 8 am". */
function movedWords(from: string): string {
  const [d, t] = from.split(" ");
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return from;
  return t ? `${dayShort(d)}, ${timeRange(t, null)}` : dayShort(d);
}

/** Goes up with every edit (minutes since 2026), so calendars take the newest copy. */
export function sequenceOf(updatedAt: string | null | undefined, moved: boolean): number {
  const t = updatedAt ? Date.parse(updatedAt) : NaN;
  if (Number.isNaN(t)) return moved ? 1 : 0;
  return Math.max(0, Math.floor((t - Date.UTC(2026, 0, 1)) / 60_000));
}

/**
 * The events a student's calendar shows: their sessions (classes, and OPD
 * only on their own OPD days), cancelled ones left out, moved ones marked,
 * approved leave shown as free time. An OPD day with no session made for it
 * yet is an all-day event.
 */
export function feedEvents(sessions: readonly (ClinicMySession & { updatedAt?: string | null })[], visits: readonly ClinicVisit[], notes: ReadonlyMap<string, string>): IcsEvent[] {
  const events: IcsEvent[] = [];
  const shown = new Set<string>();
  for (const s of sessions) {
    if (s.status === "cancelled") continue;
    if (s.batch && !s.assigned) continue;
    shown.add(s.id);
    const onLeave = s.my.status === "on_leave";
    let summary = s.title.trim() || "Session";
    if (s.batch && !/morning|evening/i.test(summary)) summary = `${summary}, ${s.batch}`;
    if (s.batch) summary = `Your OPD day: ${summary}`;
    if (s.movedFrom) summary = `${summary} (moved)`;
    if (onLeave) summary = `On leave: ${summary}`;
    const desc: string[] = [];
    if (s.movedFrom) desc.push(`Moved from ${movedWords(s.movedFrom)}.`);
    if (s.note) desc.push(s.note);
    const dayNote = notes.get(s.date);
    if (dayNote) desc.push(`From the admin: ${dayNote}`);
    if (s.my.earlyLeaveAt) desc.push(`You leave at ${timeRange(s.my.earlyLeaveAt, null)}.`);
    if (s.onlineLink) desc.push(`Join: ${s.onlineLink}`);
    if (s.required && !onLeave) desc.push("Scan in when you arrive and out when you leave.");
    events.push({
      uid: s.id,
      date: s.date,
      start: s.start,
      end: s.end,
      summary,
      description: desc.join("\n") || null,
      location: s.place || (s.onlineLink ? "Online" : null),
      url: s.onlineLink,
      sequence: sequenceOf(s.updatedAt, Boolean(s.movedFrom)),
      updatedAt: s.updatedAt ?? null,
      alarmMinutes: onLeave ? null : 30,
      free: onLeave,
    });
  }
  for (const v of visits) {
    if (v.sessionId && shown.has(v.sessionId)) continue;
    if (v.sessionId) continue; // its session was cancelled: nothing to go to
    events.push({ uid: `opd-${v.assignmentId}`, date: v.date, start: v.start, end: v.end, summary: `Your OPD day, ${v.batch}`, description: notes.get(v.date) ? `From the admin: ${notes.get(v.date)}` : null, alarmMinutes: 30 });
  }
  return events.sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? "").localeCompare(b.start ?? ""));
}

/** The whole calendar file for one student. Read only: it never writes. */
export async function calendarFeed(db: Db, userId: string, now: number): Promise<string> {
  const name = "VIBHA schedule";
  const description = "Your classes and OPD days. Updates on its own.";
  const c = await studentCohort(db, userId, null);
  if (!c) return buildIcs({ name, description, events: [], now });
  const today = todayOf(now);
  const from = addDays(today, -FEED_PAST_DAYS);
  const to = addDays(today, FEED_AHEAD_DAYS);
  const b = await loadBundle(db, c.cohortId, userId);
  const rows = b.sessions.filter((s) => s.date >= from && s.date <= to);
  const updated = new Map(rows.map((r) => [r.id, (r as { updated_at?: string | null }).updated_at ?? null]));
  const sessions = mySessions(b, userId, rows, now).map((s) => ({ ...s, updatedAt: updated.get(s.id) ?? null }));
  const visits = myVisits(b, userId, today).filter((v) => v.date >= from && v.date <= to);
  const noteRows = must(await db.from("clinic_day_notes").select("date, note").eq("cohort_id", c.cohortId).gte("date", from).lte("date", to), [] as Pick<DayNoteRow, "date" | "note">[]);
  return buildIcs({ name, description, events: feedEvents(sessions, visits, new Map(noteRows.map((r) => [r.date, r.note]))), now });
}
