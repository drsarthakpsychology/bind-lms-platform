import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { ClinicDirection, ClinicScanChoice, ClinicScanConfirm, ClinicScanConfirmBody, ClinicScanIdentify, ClinicScanIdentifyBody, ClinicScanReason, ClinicSession } from "@/lib/app-api/contract";
import { ApiFail } from "@/lib/app-api/respond";
import { isLate, isOpen, minutesPresent, sessionTimes } from "./attendance";
import { must, todayOf, type Db } from "./data";
import { codeFor, normalizeCode, parseQr, tokenFor, verifyCode, verifyToken, windowOf } from "./qr";
import { addDays, localTime } from "./time";
import { toSession } from "./timetable";
import type { AttendanceRow, SecretRow, SessionRow } from "./types";

/**
 * Marking attendance in two steps.
 *
 *   identify: the QR text or the 6 characters, checked while the code is
 *             live. Saves nothing. Answers the session, where the student
 *             stands in it, which of IN and OUT makes sense now, and a ticket.
 *   confirm:  the ticket, the direction the student chose, and the id of
 *             that Confirm press. Saves the mark once.
 *
 * The rules live here, on the server; the screens only show them:
 *   - the direction is always given, never guessed;
 *   - OUT needs an IN for the same session;
 *   - a mark that is already there is answered as it is ("already marked
 *     at 9:02 am") and never moved;
 *   - the same Confirm press sent twice (double tap, retry) saves once;
 *   - the code may rotate between the two steps: the ticket carries the
 *     proof that it was right at scan time, for 2 minutes.
 */

/** How long a ticket lasts after the scan. */
export const TICKET_MS = 120_000;
/** How far back an old code is still recognised as "ours, but old" (10 minutes). */
const OLD_WINDOWS = 20;

const refuse = (code: "bad_request" | "forbidden" | "conflict", reason: ClinicScanReason, message: string): ApiFail => new ApiFail(code, message, { reason });

/** "9:02 am" in clinic time. */
export function clockAt(at: string | number): string {
  const [h, m] = localTime(typeof at === "number" ? at : Date.parse(at)).split(":").map(Number) as [number, number];
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
}

/* ------------------------------------------------------------ ticket */

type Method = "qr" | "code";

function ticketMac(secret: string, userId: string, sessionId: string, exp: number, method: Method): string {
  return createHmac("sha256", secret).update(`ticket:1:${userId}:${sessionId}:${exp}:${method}`).digest("base64url");
}

/** Signed with the session's own secret, for one student and one session. It does not carry a direction. */
export function makeTicket(secret: string, userId: string, sessionId: string, method: Method, now: number): { ticket: string; exp: number } {
  const exp = now + TICKET_MS;
  return { ticket: `t1.${sessionId}.${exp}.${method === "qr" ? "q" : "c"}.${ticketMac(secret, userId, sessionId, exp, method)}`, exp };
}

const TICKET_RE = /^t1\.([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(\d{10,16})\.([qc])\.([A-Za-z0-9_-]{43})$/;

export function parseTicket(ticket: string): { sessionId: string; exp: number; method: Method; mac: string } | null {
  const m = TICKET_RE.exec(ticket.trim());
  if (!m) return null;
  return { sessionId: m[1]!, exp: Number(m[2]), method: m[3] === "q" ? "qr" : "code", mac: m[4]! };
}

export function ticketGood(secret: string, userId: string, t: { sessionId: string; exp: number; method: Method; mac: string }): boolean {
  const want = Buffer.from(ticketMac(secret, userId, t.sessionId, t.exp, t.method));
  const got = Buffer.from(t.mac);
  return want.length === got.length && timingSafeEqual(want, got);
}

/* ------------------------------------------------------------- rules */

type Marks = Pick<AttendanceRow, "in_at" | "out_at"> | null;

/** Which of the two buttons makes sense now, each with its one-line reason when it does not. */
export function choicesFor(att: Marks): { state: ClinicScanIdentify["state"]; in: ClinicScanChoice; out: ClinicScanChoice } {
  const yes: ClinicScanChoice = { allowed: true, reason: null };
  if (!att?.in_at) return { state: "none", in: yes, out: { allowed: false, reason: "Mark IN first." } };
  if (!att.out_at) return { state: "in", in: { allowed: false, reason: `You are already IN since ${clockAt(att.in_at)}.` }, out: yes };
  return { state: "out", in: { allowed: false, reason: `You marked IN at ${clockAt(att.in_at)}.` }, out: { allowed: false, reason: `You marked OUT at ${clockAt(att.out_at)}.` } };
}

/** Is this session one the student may mark at all? Throws the reason when not. */
function checkSession(s: ClinicSession, memberOf: readonly string[], testCohortId: string | null | undefined, now: number, open: boolean): void {
  // The test student only ever marks in its own test cohort; a real student is never a member of one.
  const mine = s.cohortIds.some((c) => memberOf.includes(c)) && (testCohortId === undefined || (testCohortId !== null && s.cohortIds.includes(testCohortId)));
  if (!mine) throw refuse("forbidden", "wrong_cohort", "This code is for another group's session. Check you are in the right room, then scan the code there.");
  if (s.status === "cancelled") throw refuse("conflict", "cancelled", `${s.title} was cancelled. There is nothing to mark.`);
  if (!open || isOpen(s, now)) return;
  const t = sessionTimes(s);
  if (now < t.opensAt) throw refuse("conflict", "not_open_yet", `${s.title} is not open yet. Marking opens at ${clockAt(t.opensAt)}. Scan again then.`);
  throw refuse("conflict", "closed", `Marking for ${s.title} closed at ${clockAt(t.closesAt)}. Ask the admin to mark you.`);
}

async function membership(db: Db, userId: string): Promise<{ memberOf: string[]; testCohortId: string | null | undefined }> {
  const rows = must(await db.from("cohort_members").select("cohort_id").eq("user_id", userId), [] as { cohort_id: string }[]);
  // undefined: a real person. A test student gets its test cohort (or null when it has none yet).
  // Before the test mode database step there is no such table and nobody is a test student.
  let testCohortId: string | null | undefined;
  try {
    const r = await db.from("test_mode").select("test_user_id, test_cohort_id").eq("test_user_id", userId).limit(1).maybeSingle();
    const link = r.error ? null : (r.data as { test_cohort_id: string | null } | null);
    if (link) testCohortId = link.test_cohort_id ?? null;
  } catch {
    testCohortId = undefined;
  }
  return { memberOf: rows.map((r) => r.cohort_id), testCohortId };
}

async function secretOf(db: Db, sessionId: string): Promise<SecretRow | null> {
  return must(await db.from("clinic_session_secrets").select("*").eq("session_id", sessionId).maybeSingle(), null as SecretRow | null);
}

async function rowOf(db: Db, sessionId: string, userId: string): Promise<AttendanceRow | null> {
  return must(await db.from("clinic_attendance").select("*").eq("session_id", sessionId).eq("user_id", userId).maybeSingle(), null as AttendanceRow | null);
}

const EXPIRED = "That code has changed. Scan the one on the screen now.";

/* ---------------------------------------------------------- identify */

export async function identify(db: Db, userId: string, body: ClinicScanIdentifyBody, now: number): Promise<ClinicScanIdentify> {
  const { memberOf, testCohortId } = await membership(db, userId);
  let row: SessionRow | null = null;
  let secret: SecretRow | null = null;
  let method: Method;

  if (body.token) {
    method = "qr";
    const p = parseQr(body.token);
    if (!p) throw refuse("bad_request", "not_a_code", "That is not a VIBHA attendance code. Scan the code on the admin's screen.");
    row = must(await db.from("clinic_sessions").select("*").eq("id", p.sessionId).maybeSingle(), null as SessionRow | null);
    secret = row ? await secretOf(db, row.id) : null;
    if (!row || !secret) throw refuse("bad_request", "not_a_code", "That code is not right. Scan the code on the admin's screen.");
    if (verifyToken(secret.secret, row.id, p.token, now) === null) {
      // Ours but old (a photo, or a slow hand) gets the kind answer; anything else is simply not right.
      const w = windowOf(now);
      const old = p.window < w && p.window >= w - OLD_WINDOWS && tokenFor(secret.secret, row.id, p.window) === p.token;
      throw old ? refuse("bad_request", "code_expired", EXPIRED) : refuse("bad_request", "not_a_code", "That code is not right. Scan the code on the admin's screen.");
    }
  } else if (body.code) {
    method = "code";
    const code = normalizeCode(body.code);
    const today = todayOf(now);
    const day = must(await db.from("clinic_sessions").select("*").in("date", [addDays(today, -1), today, addDays(today, 1)]), [] as SessionRow[]);
    // A typed code is matched against the student's own open sessions only.
    const candidates = day.filter((s) => s.cohort_ids.some((c) => memberOf.includes(c)) && isOpen(toSession(s), now));
    let wasOld = false;
    for (const s of candidates) {
      const sec = await secretOf(db, s.id);
      if (!sec) continue;
      if (verifyCode(sec.secret, s.id, code, now) !== null) {
        row = s;
        secret = sec;
        break;
      }
      const w = windowOf(now);
      for (let k = 2; k <= OLD_WINDOWS && !wasOld; k++) wasOld = codeFor(sec.secret, s.id, w - k) === code;
    }
    if (!row || !secret) throw wasOld ? refuse("bad_request", "code_expired", "That code has changed. Type the one on the screen now.") : refuse("bad_request", "not_a_code", "That code is not right. Check the 6 letters and numbers under the picture.");
  } else {
    throw refuse("bad_request", "not_a_code", "Scan the code or type it.");
  }

  const s = toSession(row);
  checkSession(s, memberOf, testCohortId, now, true);
  const att = await rowOf(db, s.id, userId);
  const { ticket, exp } = makeTicket(secret.secret, userId, s.id, method, now);
  return {
    ticket,
    ticketExpiresAt: new Date(exp).toISOString(),
    now: new Date(now).toISOString(),
    session: { id: s.id, title: s.title, kind: s.kind, date: s.date, start: s.start, end: s.end, place: s.place },
    inAt: att?.in_at ?? null,
    outAt: att?.out_at ?? null,
    ...choicesFor(att),
  };
}

/* ----------------------------------------------------------- confirm */

/** The database has no `in_attempt` / `out_attempt` columns yet (the SQL step has not run). */
function attemptColumnMissing(e: { code?: string; message?: string } | null | undefined): boolean {
  return Boolean(e) && (e!.code === "42703" || e!.code === "PGRST204") && /_attempt/.test(e!.message ?? "");
}

type Write = { error: { code?: string; message?: string } | null };

/**
 * Save one mark, only where that direction is still empty. Tries with the
 * attempt id first and again without it on a database that has no such
 * column yet. A row that another request made first (unique session and
 * student) is not an error: the caller reads what is there.
 */
async function saveMark(db: Db, existing: AttendanceRow | null, sessionId: string, userId: string, direction: ClinicDirection, at: string, method: Method, attemptId: string): Promise<void> {
  const base = direction === "in" ? { in_at: at, in_method: method, updated_at: at } : { out_at: at, out_method: method, updated_at: at };
  const withAttempt = { ...base, [direction === "in" ? "in_attempt" : "out_attempt"]: attemptId };
  const write = async (patch: Record<string, unknown>): Promise<Write> => {
    if (direction === "in" && !existing) return (await db.from("clinic_attendance").insert({ session_id: sessionId, user_id: userId, ...patch })) as Write;
    const q = db.from("clinic_attendance").update(patch).eq("session_id", sessionId).eq("user_id", userId);
    return (await (direction === "in" ? q.is("in_at", null) : q.is("out_at", null).not("in_at", "is", null))) as Write;
  };
  let r = await write(withAttempt);
  if (attemptColumnMissing(r.error)) r = await write(base);
  if (r.error?.code === "23505") return;
  must(r as never, null);
}

export async function confirm(db: Db, userId: string, body: ClinicScanConfirmBody, now: number): Promise<ClinicScanConfirm> {
  const again = "That took too long. Scan the code again.";
  const t = parseTicket(body.ticket);
  if (!t) throw refuse("bad_request", "ticket_expired", again);
  const row = must(await db.from("clinic_sessions").select("*").eq("id", t.sessionId).maybeSingle(), null as SessionRow | null);
  const secret = row ? await secretOf(db, row.id) : null;
  // A ticket made for someone else, or for another session, never checks out.
  if (!row || !secret || !ticketGood(secret.secret, userId, t)) throw refuse("bad_request", "ticket_expired", again);
  if (now > t.exp || t.exp - now > TICKET_MS + 5_000) throw refuse("bad_request", "ticket_expired", again);

  const s = toSession(row);
  const { memberOf, testCohortId } = await membership(db, userId);
  // The ticket proves the session was open at scan time; a cancellation since then still stops the mark.
  checkSession(s, memberOf, testCohortId, now, false);

  const direction = body.direction;
  const word = direction === "in" ? "IN" : "OUT";
  const existing = await rowOf(db, s.id, userId);
  const cohortId = s.cohortIds.find((c) => memberOf.includes(c))!;
  const settings = must(await db.from("clinic_opd_settings").select("late_minutes").eq("cohort_id", cohortId).maybeSingle(), null as { late_minutes: number } | null);
  const answer = (att: AttendanceRow, already: boolean): ClinicScanConfirm => {
    const at = (direction === "in" ? att.in_at : att.out_at)!;
    return {
      sessionId: s.id,
      title: s.title,
      direction,
      at,
      already,
      message: already ? `Already marked ${word} at ${clockAt(at)}. Nothing was changed.` : `Marked ${word} at ${clockAt(at)}.`,
      late: isLate(att.in_at, s, settings?.late_minutes ?? 10),
      minutes: direction === "out" ? minutesPresent(att.in_at, att.out_at) : null,
    };
  };
  const attemptOf = (att: AttendanceRow) => (direction === "in" ? att.in_attempt : att.out_attempt) ?? null;

  if (direction === "out" && !existing?.in_at) throw refuse("bad_request", "out_before_in", `You have not marked IN for ${s.title}. Mark IN first.`);
  // Already there: the same answer again for the same Confirm press, "already marked" for any other. The time never moves.
  if (existing && (direction === "in" ? existing.in_at : existing.out_at)) return answer(existing, attemptOf(existing) !== body.attemptId);
  if (direction === "out" && Date.parse(existing!.in_at!) > now) throw new ApiFail("conflict", "Your IN time is later than now. Ask the admin to check it.");

  const at = new Date(now).toISOString();
  await saveMark(db, existing, s.id, userId, direction, at, t.method, body.attemptId);
  const saved = await rowOf(db, s.id, userId);
  const savedAt = saved ? (direction === "in" ? saved.in_at : saved.out_at) : null;
  if (!saved || !savedAt) {
    // Nothing was written: for OUT the IN went away in between (the admin cleared it).
    if (direction === "out") throw refuse("bad_request", "out_before_in", `You have not marked IN for ${s.title}. Mark IN first.`);
    throw new ApiFail("server_error", "That did not save. Try again.");
  }
  // Someone else's write landed first (another phone, the admin): show theirs, unchanged.
  const by = attemptOf(saved);
  const mine = by ? by === body.attemptId : Date.parse(savedAt) === now;
  return answer(saved, !mine);
}
