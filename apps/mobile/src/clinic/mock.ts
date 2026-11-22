/**
 * The clinic part of the mock server (EXPO_PUBLIC_API_MODE=mock). It answers
 * the server's own routes with the server's own shapes
 * (docs/app/API_CONTRACT_CLINIC.md, the `Clinic*` types in src/api/contract.ts),
 * with state in memory so every action shows its result.
 *
 * Dates follow the real clock (India time) so "Today" always has something.
 * Unlike the server, a session can be scanned all day on its own date (the
 * server opens it from 30 minutes before start to 60 after end), so the
 * screens can be tried at any hour.
 *
 * The signed-in student is Ananya Mehta (u-student), assigned to today's
 * evening OPD. Admin writes need the Super Admin; a view admin gets 403.
 */
import type { RawResponse } from "@/api/client";
import type * as W from "@/api/contract";
import { addDays, CODE_LETTERS, isOpd, minutesOf, todayIST, weekdayOf } from "./logic";
import { WEEKDAYS, weekdayNumber, type Batch, type SessionKind, type Weekday } from "./contract";

const ME = "u-student";
const C2: W.ClinicCohortRef = { id: "c2", name: "Cohort Two" };
const C1: W.ClinicCohortRef = { id: "c1", name: "Cohort One" };

type Student = { id: string; name: string; roll: string; cohortId: string; batch: Batch | null; batchLocked: boolean; leaveAllowance: number; base: number; extras: { count: number; note: string | null; at: string }[]; allowanceLog: { old: number | null; new: number; note: string | null; at: string }[] };
type Sess = { id: string; date: string; start: string; end: string; kind: SessionKind; title: string; place: string | null; link: string | null; compulsory: boolean; cancelled: boolean; movedFrom: string | null; note: string | null; cohortIds: string[]; oneOff: boolean; slotId: string | null };
type Slot = { id: string; weekday: Weekday; kind: SessionKind; title: string; start: string; end: string; place: string | null; link: string | null; cohortIds: string[]; compulsory: boolean };
type Scan = { inAt: string | null; outAt: string | null; manual: boolean; note: string | null; inAttempt?: string; outAttempt?: string };
type Log = { cases: number; absent: boolean; note: string | null };
type Leave = W.ClinicLeaveRequest;
type Plan = Record<string, Record<Batch, string[]>>;
type Settings = { from: string; to: string; casesPerVisit: number; seats: Record<Weekday, Record<Batch, number>>; lateMinutes: number; holidays: string[]; freezeDays: number };

type State = {
  students: Student[];
  slots: Slot[];
  sessions: Sess[];
  scans: Record<string, Scan>;
  logs: Record<string, Log>;
  leaves: Leave[];
  notes: Record<string, string>;
  secrets: Record<string, string>;
  settings: Settings;
  draft: Plan | null;
  published: Plan;
  seq: number;
};

const TIMES: Record<Batch, { start: string; end: string }> = { morning: { start: "08:00", end: "10:00" }, evening: { start: "17:00", end: "20:00" } };
const iso = (date: string, hm: string) => new Date(Date.parse(`${date}T${hm}:00+05:30`)).toISOString();
const sk = (sessionId: string, studentId: string) => `${sessionId}|${studentId}`;
const vk = (date: string, studentId: string) => `${date}|${studentId}`;
const aid = (date: string, b: Batch, studentId: string) => `${date}:${b}:${studentId}`;
const now = () => Date.now();
const nowIso = () => new Date(now()).toISOString();

function addMin(hm: string, m: number): string {
  const c = Math.max(0, Math.min(23 * 60 + 59, minutesOf(hm) + m));
  return `${String(Math.floor(c / 60)).padStart(2, "0")}:${String(c % 60).padStart(2, "0")}`;
}

function seedSlots(): Slot[] {
  const s = (id: string, weekday: Weekday, kind: SessionKind, title: string, start: string, end: string, place: string | null, link: string | null = null): Slot => ({ id, weekday, kind, title, start, end, place, link, cohortIds: ["c2"], compulsory: !isOpd(kind) });
  return [
    s("sl1", "mon", "opd_morning", "OPD", "08:00", "10:00", "VIBHA Clinic, OPD 2"),
    s("sl2", "mon", "opd_evening", "OPD", "17:00", "20:00", "VIBHA Clinic, OPD 2"),
    s("sl3", "tue", "class", "Case formulation", "10:00", "13:00", "VIBHA Clinic, Room 1"),
    s("sl4", "wed", "opd_morning", "OPD", "08:00", "10:00", "VIBHA Clinic, OPD 2"),
    s("sl5", "wed", "opd_evening", "OPD", "17:00", "20:00", "VIBHA Clinic, OPD 2"),
    s("sl6", "thu", "online_class", "Psychopathology", "19:00", "20:30", null, "https://meet.google.com/vib-hapsy-chl"),
    s("sl7", "fri", "opd_morning", "OPD", "08:00", "10:00", "VIBHA Clinic, OPD 2"),
    s("sl8", "fri", "opd_evening", "OPD", "17:00", "20:00", "VIBHA Clinic, OPD 2"),
    s("sl9", "sat", "class", "Weekend class", "10:00", "13:00", "VIBHA Clinic, Room 1"),
  ];
}

const fromSlot = (sl: Slot, date: string): Sess => ({ id: `${sl.id}-${date}`, date, start: sl.start, end: sl.end, kind: sl.kind, title: sl.title, place: sl.place, link: sl.link, compulsory: sl.compulsory, cancelled: false, movedFrom: null, note: null, cohortIds: sl.cohortIds, oneOff: false, slotId: sl.id });

function sessionsFromSlots(slots: Slot[], from: string, to: string): Sess[] {
  const out: Sess[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) for (const sl of slots.filter((x) => x.weekday === weekdayOf(date))) out.push(fromSlot(sl, date));
  return out;
}

const seatsOf = (m: number, e: number) => ({ morning: m, evening: e });

function oneOff(p: Partial<Sess> & Pick<Sess, "id" | "date" | "start" | "end" | "kind" | "title">): Sess {
  return { place: null, link: null, compulsory: !isOpd(p.kind), cancelled: false, movedFrom: null, note: null, cohortIds: ["c2"], oneOff: true, slotId: null, ...p };
}

function fresh(): State {
  const today = todayIST(now());
  const slots = seedSlots();
  const sessions = sessionsFromSlots(slots, addDays(today, -21), addDays(today, 28));
  // Today always has a class, an evening OPD and a Cohort One session (whose code is "not your session").
  const has = (k: SessionKind) => sessions.some((s) => s.date === today && s.kind === k);
  if (!has("class")) sessions.push(oneOff({ id: `one-class-${today}`, date: today, start: "10:00", end: "13:00", kind: "class", title: "Case formulation", place: "VIBHA Clinic, Room 1" }));
  if (!has("opd_evening")) sessions.push(oneOff({ id: `one-opd-${today}`, date: today, start: "17:00", end: "20:00", kind: "opd_evening", title: "OPD", place: "VIBHA Clinic, OPD 2" }));
  sessions.push(oneOff({ id: `one-c1-${today}`, date: today, start: "14:00", end: "15:30", kind: "other", title: "Cohort One review", place: "VIBHA Clinic, Room 2", cohortIds: ["c1"] }));
  // A moved class and a cancelled one in the coming days.
  const nextTue = sessions.find((s) => s.slotId === "sl3" && s.date > today);
  if (nextTue) Object.assign(nextTue, { movedFrom: `${nextTue.date} 10:00`, start: "11:00", end: "14:00", note: "Starts an hour later this week" });
  const nextSat = sessions.find((s) => s.slotId === "sl9" && s.date > addDays(today, 6));
  if (nextSat) Object.assign(nextSat, { cancelled: true, note: "No class: public holiday" });

  const st = (id: string, name: string, roll: string, batch: Batch | null, base = 8, cohortId = "c2"): Student => ({ id, name, roll, cohortId, batch, batchLocked: !!batch, leaveAllowance: 4, base, extras: [], allowanceLog: [{ old: null, new: 4, note: "Start of the cohort", at: iso(addDays(today, -30), "10:00") }] });
  const students: Student[] = [
    st(ME, "Ananya Mehta", "VIBHA-000123", "evening"),
    st("u3", "Meera Pillai", "VIBHA-000118", "morning"),
    { ...st("u5", "Sana Khan", "VIBHA-000142", "evening"), extras: [{ count: 2, note: "paid 12 Nov", at: iso(addDays(today, -4), "12:00") }] },
    st("u8", "Dev Malhotra", "VIBHA-000170", "morning"),
    st("u12", "Aditi Verma", "VIBHA-000186", "evening", 7),
    st("u6", "Arjun Nair", "VIBHA-000150", null),
    st("u10", "Neha Joshi", "VIBHA-000092", "morning", 6, "c1"),
  ];
  const settings: Settings = {
    from: addDays(today, -21),
    to: addDays(today, 28),
    casesPerVisit: 2,
    seats: { mon: seatsOf(2, 2), tue: seatsOf(0, 0), wed: seatsOf(2, 2), thu: seatsOf(0, 0), fri: seatsOf(2, 2), sat: seatsOf(0, 0), sun: seatsOf(0, 0) },
    lateMinutes: 10,
    holidays: [],
    freezeDays: 2,
  };
  const s: State = { students, slots, sessions, scans: {}, logs: {}, leaves: [], notes: {}, secrets: {}, settings, draft: null, published: {}, seq: 1 };

  // A published plan: past visits for history, today's evening for Ananya.
  s.published = generate(s, settings.from, {}, true);
  const tday = (s.published[today] ??= { morning: [], evening: [] });
  if (!tday.evening.includes(ME)) tday.evening = [ME, ...tday.evening.filter((x) => x !== ME)].slice(0, 2);
  s.notes[today] = "Bring your case sheets to the OPD.";

  // History: past scans and case logs.
  const past = sessions.filter((x) => x.date < today && !x.cancelled);
  let i = 0;
  for (const x of past) {
    for (const p of expected(s, x)) {
      i++;
      if (i % 11 === 0) continue; // missed now and then
      const late = i % 7 === 0;
      s.scans[sk(x.id, p.id)] = { inAt: iso(x.date, addMin(x.start, late ? 18 : -5)), outAt: i % 13 === 0 ? null : iso(x.date, addMin(x.end, 2)), manual: false, note: null };
    }
  }
  const lastMine = Object.keys(s.published).filter((d) => d < today && (s.published[d]!.morning.includes(ME) || s.published[d]!.evening.includes(ME))).sort().pop();
  let j = 0;
  for (const [date, day] of Object.entries(s.published)) {
    if (date >= today) continue;
    for (const b of ["morning", "evening"] as const)
      for (const id of day[b]) {
        j++;
        // One case log due for Ananya (her newest past visit) and a few for Sana; the rest are in.
        if ((id === ME && date === lastMine) || (id === "u5" && j % 5 === 0)) continue;
        s.logs[vk(date, id)] = j % 9 === 0 ? { cases: 0, absent: true, note: null } : { cases: 2, absent: false, note: null };
      }
  }
  // Leave requests.
  const req = (p: Partial<Leave> & Pick<Leave, "id" | "userId" | "kind" | "sessions" | "reason" | "status">): Leave => ({ cohortId: "c2", leaveAt: null, overLimit: false, cost: p.kind === "early" ? 0 : p.sessions.length, decidedAt: null, decisionNote: null, createdAt: iso(today, "09:00"), ...p });
  const brief = (x: Sess) => ({ id: x.id, date: x.date, start: x.start, title: x.title || "Session" });
  const sat = sessions.find((x) => x.slotId === "sl9" && x.date > today && !x.cancelled);
  if (sat) s.leaves.push(req({ id: "lv1", userId: ME, kind: "leave", sessions: [brief(sat)], reason: "Family wedding out of town", status: "pending", createdAt: iso(today, "09:10") }));
  const oldClass = past.filter((x) => x.kind === "class").slice(-1)[0];
  if (oldClass) s.leaves.push(req({ id: "lv2", userId: ME, kind: "leave", sessions: [brief(oldClass)], reason: "Fever", status: "approved", decisionNote: "Get well soon", createdAt: iso(addDays(oldClass.date, -1), "20:00"), decidedAt: iso(addDays(oldClass.date, -1), "21:00") }));
  const todays = sessions.find((x) => x.date === today && x.kind === "class");
  if (todays) s.leaves.push(req({ id: "lv3", userId: "u8", kind: "early", sessions: [brief(todays)], reason: "Hospital appointment", leaveAt: addMin(todays.end, -60), status: "pending", createdAt: iso(today, "08:00") }));
  const nextOpd = sessions.find((x) => x.kind === "opd_evening" && x.date > today && !x.cancelled);
  for (let k = 0; k < 4 && k < past.length; k++) s.leaves.push(req({ id: `lvx${k}`, userId: "u12", kind: "leave", sessions: [brief(past[k]!)], reason: "Unwell", status: "approved", createdAt: iso(past[k]!.date, "07:00"), decidedAt: iso(past[k]!.date, "08:00") }));
  if (nextOpd) s.leaves.push(req({ id: "lv4", userId: "u12", kind: "leave", sessions: [brief(nextOpd)], reason: "Exam at college", status: "pending", overLimit: true, createdAt: iso(today, "07:30") }));
  return s;
}

let state: State | null = null;
const st = (): State => (state ??= fresh());
/** Before the owner runs the SQL every clinic route answers 503 `unavailable`. */
let off = false;

export const clinicMock = {
  reset() {
    state = null;
    off = false;
  },
  /** Tests and screenshots: the server has the routes but not the tables yet. */
  setOff(v: boolean) {
    off = v;
  },
  /** Tests: the 6 characters and the QR text on the admin's screen for a session right now. */
  codeFor: (sessionId: string) => code(st(), sessionId, windowNow()),
  qrFor: (sessionId: string) => qrText(st(), sessionId, windowNow()),
  todaySessions: () => st().sessions.filter((x) => x.date === todayIST(now())),
  state: () => st(),
};

/* ----------------------------------------------------------- who, what */

const studentOf = (s: State, id: string) => s.students.find((p) => p.id === id);

function expected(s: State, x: Sess): Student[] {
  if (isOpd(x.kind)) {
    const b: Batch = x.kind === "opd_morning" ? "morning" : "evening";
    const ids = s.published[x.date]?.[b] ?? [];
    return s.students.filter((p) => ids.includes(p.id));
  }
  return s.students.filter((p) => x.compulsory && x.cohortIds.includes(p.cohortId));
}

const approvedLeave = (s: State, sessionId: string, userId: string, kind: Leave["kind"] = "leave") => s.leaves.find((l) => l.userId === userId && l.kind === kind && l.status === "approved" && l.sessions.some((x) => x.id === sessionId));
const isOpen = (x: Sess) => !x.cancelled && x.date === todayIST(now());

function myOf(s: State, x: Sess, userId: string): W.ClinicMySession["my"] {
  const scan = s.scans[sk(x.id, userId)];
  const early = approvedLeave(s, x.id, userId, "early");
  const leave = approvedLeave(s, x.id, userId);
  const late = !!scan?.inAt && Date.parse(scan.inAt) > Date.parse(iso(x.date, x.start)) + s.settings.lateMinutes * 60_000;
  const minutes = scan?.inAt && scan.outAt ? Math.round((Date.parse(scan.outAt) - Date.parse(scan.inAt)) / 60_000) : null;
  const required = expected(s, x).some((p) => p.id === userId);
  const today = todayIST(now());
  let status: W.ClinicMyStatus;
  if (x.cancelled) status = "cancelled";
  else if (scan?.inAt && scan.outAt) status = late ? "late" : "present";
  else if (scan?.inAt) status = x.date < today ? "no_scan_out" : late ? "late" : "in";
  else if (!required) status = "not_required";
  else if (leave) status = "on_leave";
  else if (x.date < today) status = "absent";
  else status = "upcoming";
  return { status, inAt: scan?.inAt ?? null, outAt: scan?.outAt ?? null, late, minutes, leaveId: leave?.id ?? null, earlyLeaveAt: early?.leaveAt ?? null };
}

const wire = (x: Sess): W.ClinicSession => ({ id: x.id, cohortIds: x.cohortIds, date: x.date, start: x.start, end: x.end, kind: x.kind, title: x.title, place: x.place, onlineLink: x.link, compulsory: x.compulsory, status: x.cancelled ? "cancelled" : "scheduled", origin: x.oneOff ? "one_off" : "timetable", note: x.note, movedFrom: x.movedFrom, batch: x.kind === "opd_morning" ? "morning" : x.kind === "opd_evening" ? "evening" : null });
const mine = (s: State, x: Sess, userId: string): W.ClinicMySession => {
  const required = expected(s, x).some((p) => p.id === userId);
  return { ...wire(x), required, assigned: isOpd(x.kind) && required, open: isOpen(x), my: myOf(s, x, userId) };
};
const sortT = <T extends { date: string; start: string }>(r: T[]) => r.sort((a, b) => (a.date === b.date ? minutesOf(a.start) - minutesOf(b.start) : a.date < b.date ? -1 : 1));
const cohortSessions = (s: State, cohortId: string) => s.sessions.filter((x) => x.cohortIds.includes(cohortId));

function liveCounts(s: State, x: Sess) {
  const rows = expected(s, x).map((p) => myOf(s, x, p.id));
  const inn = rows.filter((r) => r.inAt && !r.outAt).length;
  const out = rows.filter((r) => r.inAt && r.outAt).length;
  const onLeave = rows.filter((r) => r.status === "on_leave").length;
  return { expected: rows.length, in: inn, out, late: rows.filter((r) => r.late).length, onLeave, missing: rows.length - inn - out - onLeave };
}

/* ---------------------------------------------------------------- code */

const windowNow = () => Math.floor(now() / 30_000);
const secretOf = (s: State, id: string) => (s.secrets[id] ??= `sec-${id}-${s.seq++}`);
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0;
  return h;
}
function code(s: State, sessionId: string, w: number): string {
  let h = hash(`${secretOf(s, sessionId)}:${sessionId}:${w}:code`);
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += CODE_LETTERS[h % CODE_LETTERS.length];
    h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0;
  }
  return out;
}
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function token(s: State, sessionId: string, w: number): string {
  let h = hash(`${secretOf(s, sessionId)}:${sessionId}:${w}`);
  let out = "";
  for (let i = 0; i < 22; i++) {
    out += B64[h % 64];
    h = Math.imul(h ^ (h >>> 11), 2246822519) >>> 0;
  }
  return out;
}
const qrText = (s: State, sessionId: string, w: number) => `vibha-att:1:${sessionId}:${w}:${token(s, sessionId, w)}`;

/* ------------------------------------------------------------ OPD plan */

function done(s: State, id: string): { cases: number; visits: number; absent: number } {
  let cases = 0;
  let visits = 0;
  let absent = 0;
  for (const [k, v] of Object.entries(s.logs)) {
    if (!k.endsWith(`|${id}`)) continue;
    if (v.absent) absent++;
    else {
      visits++;
      cases += v.cases;
    }
  }
  return { cases, visits, absent };
}
const totalOf = (p: Student) => p.base + p.extras.reduce((n, e) => n + e.count, 0);

/**
 * Fills OPD seats from `from` to the end of the range: each student in their
 * batch until their cases are covered, seats per weekday respected, spread by
 * who still needs the most, skipping cancelled days and approved leave. Days
 * in `fixed` stay as they are.
 */
function generate(s: State, from: string, fixed: Plan, history: boolean): Plan {
  const set = s.settings;
  const plan: Plan = JSON.parse(JSON.stringify(fixed)) as Plan;
  const per = Math.max(1, set.casesPerVisit);
  const today = todayIST(now());
  const need: Record<string, number> = {};
  const pool = s.students.filter((p) => p.cohortId === "c2" && p.batch);
  for (const p of pool) {
    const left = Math.max(0, totalOf(p) - (history ? 0 : done(s, p.id).cases));
    const placed = Object.entries(plan).filter(([d, day]) => (history || d >= today) && (day.morning.includes(p.id) || day.evening.includes(p.id))).length;
    need[p.id] = Math.max(0, Math.ceil(left / per) - placed);
  }
  const count: Record<string, number> = {};
  for (let d = from < set.from ? set.from : from; d <= set.to; d = addDays(d, 1)) {
    if (fixed[d] || set.holidays.includes(d)) continue;
    const w = weekdayOf(d);
    for (const b of ["morning", "evening"] as const) {
      const n = set.seats[w][b];
      if (!n) continue;
      const kind = b === "morning" ? "opd_morning" : "opd_evening";
      if (s.sessions.some((x) => x.date === d && x.kind === kind && x.cancelled)) continue;
      const pick = pool
        .filter((p) => p.batch === b && (need[p.id] ?? 0) > 0)
        .filter((p) => !s.leaves.some((l) => l.userId === p.id && l.status === "approved" && l.kind === "leave" && l.sessions.some((x) => x.date === d)))
        .sort((a, c) => need[c.id]! - need[a.id]! || (count[a.id] ?? 0) - (count[c.id] ?? 0) || a.name.localeCompare(c.name))
        .slice(0, n);
      if (!pick.length) continue;
      const day = (plan[d] ??= { morning: [], evening: [] });
      for (const p of pick) {
        day[b].push(p.id);
        need[p.id]!--;
        count[p.id] = (count[p.id] ?? 0) + 1;
      }
    }
  }
  return plan;
}

function planOut(s: State, p: Plan, draft: boolean): W.ClinicPlan {
  const today = todayIST(now());
  const name = (id: string) => studentOf(s, id)?.name ?? null;
  const days: W.ClinicPlanDay[] = [];
  for (let d = s.settings.from; d <= s.settings.to; d = addDays(d, 1)) {
    const w = weekdayOf(d);
    const seat = s.settings.seats[w];
    const day = p[d];
    if (!seat.morning && !seat.evening && !day) continue;
    const people = (b: Batch) => (day?.[b] ?? []).map((id) => ({ assignmentId: aid(d, b, id), userId: id, name: name(id), source: (draft && !s.published[d]?.[b].includes(id) ? "new" : "kept") as "new" | "kept" }));
    days.push({ date: d, weekday: weekdayNumber(w), morning: { seats: seat.morning, people: people("morning") }, evening: { seats: seat.evening, people: people("evening") } });
  }
  const short = s.students
    .filter((x) => x.cohortId === "c2" && x.batch)
    .map((x) => {
      const needed = Math.ceil(Math.max(0, totalOf(x) - done(s, x.id).cases) / Math.max(1, s.settings.casesPerVisit));
      const placed = Object.entries(p).filter(([d, day]) => d >= today && !s.logs[vk(d, x.id)] && (day.morning.includes(x.id) || day.evening.includes(x.id))).length;
      return { userId: x.id, name: x.name, visits: needed - placed };
    })
    .filter((x) => x.visits > 0);
  return { v: 1, cohortId: "c2", state: draft ? "draft" : "published", hasDraft: !!s.draft, from: s.settings.from, to: s.settings.to, days, short, noBatch: s.students.filter((x) => x.cohortId === "c2" && !x.batch).map((x) => ({ userId: x.id, name: x.name })) };
}

function visits(s: State, id: string): W.ClinicVisit[] {
  const today = todayIST(now());
  const out: W.ClinicVisit[] = [];
  for (const [date, day] of Object.entries(s.published)) {
    for (const b of ["morning", "evening"] as const) {
      if (!day[b].includes(id)) continue;
      const log = s.logs[vk(date, id)];
      const sess = s.sessions.find((x) => x.date === date && x.kind === (b === "morning" ? "opd_morning" : "opd_evening"));
      const onLeave = s.leaves.some((l) => l.userId === id && l.status === "approved" && l.kind === "leave" && l.sessions.some((x) => x.date === date));
      const state: W.ClinicVisit["state"] = log ? (log.absent ? "absent" : "done") : onLeave ? "on_leave" : date > today ? "upcoming" : date === today ? "today" : "due";
      out.push({ assignmentId: aid(date, b, id), date, batch: b, start: sess?.start ?? TIMES[b].start, end: sess?.end ?? TIMES[b].end, sessionId: sess?.id ?? null, state, log: log ? { cases: log.cases, absent: log.absent, note: log.note } : null });
    }
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.batch === "morning" ? -1 : 1));
}

function balance(s: State, id: string): W.ClinicLeaveBalance {
  const p = studentOf(s, id)!;
  const mine = s.leaves.filter((l) => l.userId === id);
  const used = mine.filter((l) => l.status === "approved").reduce((n, l) => n + l.cost, 0) + Object.entries(s.logs).filter(([k, v]) => k.endsWith(`|${id}`) && v.absent).length;
  const pending = mine.filter((l) => l.status === "pending").reduce((n, l) => n + l.cost, 0);
  return { allowance: p.leaveAllowance, used, pending, left: Math.max(0, p.leaveAllowance - used - pending) };
}

function quota(s: State, p: Student): W.ClinicQuota {
  const total = totalOf(p);
  const d = done(s, p.id).cases;
  return { base: p.base, extras: p.extras, total, done: d, pending: Math.max(0, total - d) };
}

function summary(s: State, id: string, cohortId: string): W.ClinicAttendanceSummary {
  const today = todayIST(now());
  const rows = cohortSessions(s, cohortId)
    .filter((x) => x.date <= today && !x.cancelled)
    .map((x) => ({ x, req: expected(s, x).some((p) => p.id === id), my: myOf(s, x, id) }));
  const req = rows.filter((r) => r.req && (r.x.date < today || r.my.inAt));
  const attended = req.filter((r) => r.my.inAt).length;
  const onLeave = req.filter((r) => r.my.status === "on_leave").length;
  const denom = req.length - onLeave;
  return { required: req.length, attended, late: req.filter((r) => r.my.late).length, onLeave, absent: req.filter((r) => r.my.status === "absent").length, noScanOut: req.filter((r) => r.my.status === "no_scan_out").length, percent: denom > 0 ? Math.round((attended / denom) * 100) : null, minutes: rows.reduce((n, r) => n + (r.my.minutes ?? 0), 0) };
}

function trackerRow(s: State, p: Student): W.ClinicTrackerRow {
  const v = visits(s, p.id);
  return {
    userId: p.id,
    name: p.name,
    roll: p.roll,
    batch: p.batch,
    attendance: summary(s, p.id, p.cohortId),
    leave: balance(s, p.id),
    cases: quota(s, p),
    visits: { planned: v.length, done: v.filter((x) => x.state === "done").length, absent: v.filter((x) => x.state === "absent").length, missed: v.filter((x) => x.state === "missed").length, due: v.filter((x) => x.state === "due").length },
  };
}

/* -------------------------------------------------------------- routes */

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string, reason?: W.ClinicScanReason): RawResponse => ({ status, json: { ok: false, error: { code, message, ...(reason ? { details: { reason } } : {}) } } });
/** "9:02 am" in India time, as the server words it. */
const clockAt = (iso: string) => {
  const d = new Date(Date.parse(iso) + 330 * 60_000);
  const h = d.getUTCHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${String(d.getUTCMinutes()).padStart(2, "0")} ${h >= 12 ? "pm" : "am"}`;
};
const TICKET_MS = 120_000;

const slotOut = (x: Slot): W.ClinicSlot => ({ id: x.id, cohortIds: x.cohortIds, weekday: weekdayNumber(x.weekday), start: x.start, end: x.end, kind: x.kind, title: x.title, place: x.place, onlineLink: x.link, compulsory: x.compulsory, validFrom: null, validTo: null, active: true });

/**
 * Answers a clinic route, or null when the path is not one. `who` is the
 * signed-in kind from the mock token ("student", "admin", "viewadmin", "lecture").
 */
export function clinicRoute(method: string, fullPath: string, rawBody: unknown, who: string): RawResponse | null {
  const [path = "", qs = ""] = fullPath.split("?");
  if (!path.startsWith("/clinic")) return null;
  if (off) return fail(503, "unavailable", "This isn't set up yet.");
  const query = Object.fromEntries(new URLSearchParams(qs));
  const body = (rawBody ?? {}) as Record<string, unknown>;
  const seg = path.split("/").filter(Boolean);
  const is = (m: string, pattern: string): string[] | null => {
    if (method !== m) return null;
    const p = pattern.split("/").filter(Boolean);
    if (p.length !== seg.length) return null;
    const out: string[] = [];
    for (let i = 0; i < p.length; i++) {
      if (p[i]![0] === ":") out.push(decodeURIComponent(seg[i]!));
      else if (p[i] !== seg[i]) return null;
    }
    return out;
  };
  const s = st();
  const today = todayIST(now());
  let m: string[] | null;

  /* --------------------------------------------------------- admin */
  if (path.startsWith("/clinic/admin")) {
    if (who !== "admin" && who !== "viewadmin") return fail(403, "forbidden", "Only admins can open this.");
    if (method !== "GET" && who !== "admin") return fail(403, "forbidden", "Only a Super Admin can do this.");
    const cohortId = (typeof body.cohortId === "string" && body.cohortId) || query.cohort || "c2";
    const people = s.students.filter((p) => p.cohortId === cohortId);
    const findS = (id: string) => s.sessions.find((x) => x.id === id);
    const live = (x: Sess): W.ClinicLiveAttendance => ({
      v: 1,
      session: wire(x),
      open: isOpen(x),
      lateMinutes: s.settings.lateMinutes,
      rows: expected(s, x)
        .map((p) => {
          const my = myOf(s, x, p.id);
          const scan = s.scans[sk(x.id, p.id)];
          return { userId: p.id, name: p.name, roll: p.roll, status: my.status, inAt: my.inAt, outAt: my.outAt, late: my.late, minutes: my.minutes, manual: !!scan?.manual, note: scan?.note ?? null, earlyLeaveAt: my.earlyLeaveAt };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      counts: liveCounts(s, x),
    });

    if (is("GET", "/clinic/admin/overview")) {
      const sessions = sortT(cohortSessions(s, cohortId).filter((x) => x.date === today)).map((x) => {
        const c = liveCounts(s, x);
        return { ...wire(x), counts: { expected: c.expected, in: c.in, out: c.out, late: c.late, onLeave: c.onLeave } };
      });
      return ok<W.ClinicAdminOverview>({ v: 1, cohorts: [C2, C1], cohortId, today, sessions, pendingLeave: s.leaves.filter((l) => l.status === "pending" && people.some((p) => p.id === l.userId)).length, logsDue: people.reduce((n, p) => n + visits(s, p.id).filter((v) => v.state === "due").length, 0), canWrite: who === "admin" });
    }
    if (is("GET", "/clinic/admin/timetable")) return ok({ slots: s.slots.filter((x) => x.cohortIds.includes(cohortId)).map(slotOut) });
    const slotIn = (b: Record<string, unknown>): Slot | string => {
      const wd = Number(b.weekday);
      const kind = b.kind as SessionKind;
      if (!Number.isInteger(wd) || wd < 0 || wd > 6 || !kind || typeof b.start !== "string" || typeof b.end !== "string") return "Give the day, kind, start and end.";
      if (minutesOf(b.end) <= minutesOf(b.start)) return "The end must be after the start.";
      const w: Weekday = WEEKDAYS[(wd + 6) % 7]!;
      return { id: "", weekday: w, kind, title: String(b.title ?? ""), start: b.start, end: b.end, place: (b.place as string) || null, link: (b.onlineLink as string) || null, cohortIds: Array.isArray(b.cohortIds) && b.cohortIds.length ? (b.cohortIds as string[]) : [cohortId], compulsory: b.compulsory !== false };
    };
    if (is("POST", "/clinic/admin/timetable")) {
      const v = slotIn(body);
      if (typeof v === "string") return fail(400, "bad_request", v);
      v.id = `sl${100 + s.seq++}`;
      s.slots.push(v);
      return ok(slotOut(v));
    }
    if ((m = is("PUT", "/clinic/admin/timetable/:id"))) {
      const i = s.slots.findIndex((x) => x.id === m![0]);
      if (i < 0) return fail(404, "not_found", "That slot is not here.");
      const v = slotIn(body);
      if (typeof v === "string") return fail(400, "bad_request", v);
      v.id = m[0]!;
      s.slots[i] = v;
      // Sessions not made yet follow the slot; future ones made from it are made again by "apply".
      s.sessions = s.sessions.filter((x) => !(x.slotId === v.id && x.date >= today && !x.cancelled && !x.movedFrom));
      return ok(slotOut(v));
    }
    if ((m = is("DELETE", "/clinic/admin/timetable/:id"))) {
      s.slots = s.slots.filter((x) => x.id !== m![0]);
      return ok({ deleted: true });
    }
    if (is("POST", "/clinic/admin/timetable/apply")) {
      const from = String(body.from ?? today);
      const to = String(body.to ?? addDays(today, 55));
      let created = 0;
      let skipped = 0;
      for (const x of sessionsFromSlots(s.slots.filter((y) => y.cohortIds.includes(cohortId)), from, to)) {
        if (s.sessions.some((y) => y.id === x.id)) skipped++;
        else {
          s.sessions.push(x);
          created++;
        }
      }
      return ok<W.ClinicApplyResult>({ created, skipped });
    }
    if (is("GET", "/clinic/admin/sessions")) {
      const from = query.from || today;
      const to = query.to || addDays(from, 6);
      const rows = sortT(cohortSessions(s, cohortId).filter((x) => x.date >= from && x.date <= to));
      return ok({ sessions: rows.map((x) => ({ ...wire(x), counts: (({ missing: _m, ...c }) => c)(liveCounts(s, x)) })), notes: Object.entries(s.notes).filter(([d]) => d >= from && d <= to).map(([date, note]) => ({ date, note })) });
    }
    if (is("POST", "/clinic/admin/sessions")) {
      const b = body as Partial<W.ClinicSessionBody>;
      if (!b.date || !b.start || !b.end || !b.kind) return fail(400, "bad_request", "Give the date, start, end and kind.");
      if (minutesOf(b.end) <= minutesOf(b.start)) return fail(400, "bad_request", "The end must be after the start.");
      const x = oneOff({ id: `one-${s.seq++}`, date: b.date, start: b.start, end: b.end, kind: b.kind, title: b.title ?? "", place: b.place ?? null, link: b.onlineLink ?? null, compulsory: b.compulsory ?? !isOpd(b.kind), note: b.note ?? null, cohortIds: b.cohortIds?.length ? b.cohortIds : [cohortId] });
      s.sessions.push(x);
      return ok(wire(x));
    }
    if ((m = is("PATCH", "/clinic/admin/sessions/:id"))) {
      const x = findS(m[0]!);
      const b = body as W.ClinicSessionPatch;
      if (!x) return fail(404, "not_found", "That session is not here.");
      if (b.status === "cancelled") Object.assign(x, { cancelled: true, note: b.note ?? x.note });
      else if (b.status === "scheduled") x.cancelled = false;
      if (b.date || b.start || b.end) {
        const next = { date: b.date ?? x.date, start: b.start ?? x.start, end: b.end ?? x.end };
        if (minutesOf(next.end) <= minutesOf(next.start)) return fail(400, "bad_request", "The end must be after the start.");
        Object.assign(x, { movedFrom: x.movedFrom ?? `${x.date} ${x.start}`, ...next });
      }
      if (b.note !== undefined && b.status !== "cancelled") x.note = b.note;
      return ok(wire(x));
    }
    if (is("PUT", "/clinic/admin/notes")) {
      const date = String(body.date ?? "");
      const note = String(body.note ?? "").trim().slice(0, 200);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(400, "bad_request", "Give the date.");
      if (note) s.notes[date] = note;
      else delete s.notes[date];
      return ok({ date, note: note || null });
    }
    if ((m = is("GET", "/clinic/admin/sessions/:id/code"))) {
      const x = findS(m[0]!);
      if (!x) return fail(404, "not_found", "That session is not here.");
      if (!isOpen(x)) return fail(409, "conflict", x.cancelled ? "This session is cancelled." : "Scanning opens 30 minutes before the start.");
      const w = windowNow();
      const next = (w + 1) * 30_000;
      return ok<W.ClinicShowCode>({ sessionId: x.id, qr: qrText(s, x.id, w), code: code(s, x.id, w), window: w, validUntil: new Date(next).toISOString(), refreshInMs: next - now() });
    }
    if ((m = is("GET", "/clinic/admin/sessions/:id/attendance"))) {
      const x = findS(m[0]!);
      return x ? ok(live(x)) : fail(404, "not_found", "That session is not here.");
    }
    if ((m = is("POST", "/clinic/admin/sessions/:id/attendance"))) {
      const x = findS(m[0]!);
      const b = body as Partial<W.ClinicManualMarkBody>;
      const p = studentOf(s, String(b.userId ?? ""));
      if (!x || !p) return fail(404, "not_found", "That student or session is not here.");
      const key = sk(x.id, p.id);
      const note = typeof b.note === "string" && b.note.trim() ? b.note.trim() : null;
      const at = x.date === today ? nowIso() : iso(x.date, x.start);
      if (b.direction === "clear") delete s.scans[key];
      else if (b.direction === "out") s.scans[key] = { inAt: s.scans[key]?.inAt ?? iso(x.date, x.start), outAt: x.date === today ? nowIso() : iso(x.date, x.end), manual: true, note };
      else if (b.direction === "in") s.scans[key] = { inAt: s.scans[key]?.inAt ?? at, outAt: s.scans[key]?.outAt ?? null, manual: true, note };
      else return fail(400, "bad_request", "Say in, out or clear.");
      return ok(live(x));
    }
    if (is("GET", "/clinic/admin/leave")) {
      const status = query.status || "pending";
      const rows = s.leaves
        .filter((l) => people.some((p) => p.id === l.userId) && (status === "all" || l.status === status))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .map((l) => {
          const p = studentOf(s, l.userId)!;
          const bal = balance(s, l.userId);
          return { ...l, name: p.name, roll: p.roll, balance: bal, overLimitNow: l.status === "pending" && l.cost > 0 && bal.allowance - bal.used < l.cost };
        });
      return ok<W.ClinicLeaveQueue>({ v: 1, requests: rows });
    }
    if ((m = is("POST", "/clinic/admin/leave/:id"))) {
      const l = s.leaves.find((x) => x.id === m![0]);
      if (!l) return fail(404, "not_found", "That request is not here.");
      if (l.status !== "pending") return fail(409, "conflict", "This request was already decided.");
      l.status = body.decision === "approve" ? "approved" : "rejected";
      l.decisionNote = typeof body.note === "string" && body.note.trim() ? body.note.trim() : null;
      l.decidedAt = nowIso();
      return ok(l);
    }
    if (is("GET", "/clinic/admin/allowances")) return ok<W.ClinicAllowances>({ v: 1, cohortId, rows: people.map((p) => ({ userId: p.id, name: p.name, roll: p.roll, balance: balance(s, p.id), log: p.allowanceLog })) });
    if (is("PUT", "/clinic/admin/allowances")) {
      const b = body as Partial<W.ClinicAllowanceBody>;
      const who2 = b.userIds?.length ? people.filter((p) => b.userIds!.includes(p.id)) : people;
      if (b.set === undefined && b.add === undefined) return fail(400, "bad_request", "Give a number of leaves.");
      for (const p of who2) {
        const old = p.leaveAllowance;
        p.leaveAllowance = Math.max(0, Math.round(b.set ?? old + (b.add ?? 0)));
        p.allowanceLog.push({ old, new: p.leaveAllowance, note: b.note ?? null, at: nowIso() });
      }
      return ok<W.ClinicAllowanceResult>({ changed: who2.length });
    }
    if (is("GET", "/clinic/admin/opd/settings")) {
      const x = s.settings;
      return ok<W.ClinicOpdSettings>({ cohortId, seats: Object.fromEntries(WEEKDAYS.map((w) => [String(weekdayNumber(w)), x.seats[w]])), casesPerVisit: x.casesPerVisit, startDate: x.from, endDate: x.to, lateMinutes: x.lateMinutes, holidays: x.holidays, freezeDays: x.freezeDays });
    }
    if (is("PUT", "/clinic/admin/opd/settings")) {
      const b = body as Partial<W.ClinicOpdSettings>;
      const per = Number(b.casesPerVisit);
      if (!Number.isInteger(per) || per < 1 || per > 10) return fail(400, "bad_request", "Cases per visit is 1 to 10.");
      if (b.startDate && b.endDate && b.endDate < b.startDate) return fail(400, "bad_request", "The last day must be after the first.");
      const seats = (b.seats ?? {}) as W.ClinicSeats;
      s.settings = { ...s.settings, from: b.startDate ?? s.settings.from, to: b.endDate ?? s.settings.to, casesPerVisit: per, seats: Object.fromEntries(WEEKDAYS.map((w) => [w, { morning: Number(seats[String(weekdayNumber(w))]?.morning ?? 0), evening: Number(seats[String(weekdayNumber(w))]?.evening ?? 0) }])) as Settings["seats"], lateMinutes: Number(b.lateMinutes ?? s.settings.lateMinutes), holidays: b.holidays ?? s.settings.holidays, freezeDays: Number(b.freezeDays ?? s.settings.freezeDays) };
      return ok(body);
    }
    if (is("GET", "/clinic/admin/opd/quotas")) return ok<W.ClinicQuotas>({ v: 1, cohortId, casesPerVisit: s.settings.casesPerVisit, rows: people.map((p) => ({ userId: p.id, name: p.name, roll: p.roll, batch: p.batch, quota: quota(s, p), visitsPlanned: visits(s, p.id).length })) });
    if (is("PUT", "/clinic/admin/opd/quotas")) {
      const b = body as Partial<W.ClinicQuotaBody>;
      const n = Number(b.base);
      if (!Number.isInteger(n) || n < 0 || n > 200) return fail(400, "bad_request", "Cases are 0 to 200.");
      const who2 = b.userIds?.length ? people.filter((p) => b.userIds!.includes(p.id)) : people;
      who2.forEach((p) => (p.base = n));
      return ok({ changed: who2.length });
    }
    if (is("POST", "/clinic/admin/opd/extras")) {
      const p = studentOf(s, String(body.userId ?? ""));
      const n = Number(body.count);
      if (!p) return fail(404, "not_found", "That student is not here.");
      if (!Number.isInteger(n) || n < 1 || n > 50) return fail(400, "bad_request", "Add 1 to 50 cases.");
      p.extras.push({ count: n, note: typeof body.note === "string" ? body.note : null, at: nowIso() });
      return ok<W.ClinicQuotaRow>({ userId: p.id, name: p.name, roll: p.roll, batch: p.batch, quota: quota(s, p), visitsPlanned: visits(s, p.id).length });
    }
    if (is("PUT", "/clinic/admin/opd/batch")) {
      const p = studentOf(s, String(body.userId ?? ""));
      if (!p) return fail(404, "not_found", "That student is not here.");
      if (body.batch !== "morning" && body.batch !== "evening") return fail(400, "bad_request", "Morning or evening.");
      p.batch = body.batch;
      p.batchLocked = true;
      return ok({ batch: p.batch });
    }
    if (is("POST", "/clinic/admin/opd/generate")) {
      const keepTo = addDays(today, s.settings.freezeDays - 1);
      const fixed: Plan = Object.fromEntries(Object.entries(s.published).filter(([d]) => d <= keepTo));
      s.draft = generate(s, addDays(keepTo, 1), fixed, false);
      return ok(planOut(s, s.draft, true));
    }
    if (is("GET", "/clinic/admin/opd/plan")) {
      const wantDraft = query.state ? query.state === "draft" : !!s.draft;
      return ok(planOut(s, wantDraft && s.draft ? s.draft : s.published, wantDraft && !!s.draft));
    }
    if (is("POST", "/clinic/admin/opd/move")) {
      const b = body as Partial<W.ClinicMoveBody>;
      const [fromDate, fromBatch, userId] = String(b.assignmentId ?? "").split(":");
      if (!fromDate || !userId || !b.date || (b.batch !== "morning" && b.batch !== "evening")) return fail(400, "bad_request", "Pick the student and the new day.");
      if (b.date < today) return fail(400, "bad_request", "Pick a day from today on.");
      const p = (s.draft ??= JSON.parse(JSON.stringify(s.published)) as Plan);
      const from = p[fromDate];
      if (!from || !from[fromBatch as Batch]?.includes(userId)) return fail(404, "not_found", "That visit is not here.");
      const to = (p[b.date] ??= { morning: [], evening: [] });
      if (b.date !== fromDate && (to.morning.includes(userId) || to.evening.includes(userId))) return fail(409, "conflict", "Already on that day.");
      if (!b.force && to[b.batch].length >= s.settings.seats[weekdayOf(b.date)][b.batch]) return fail(409, "conflict", "That day is full.");
      from[fromBatch as Batch] = from[fromBatch as Batch].filter((x) => x !== userId);
      to[b.batch].push(userId);
      return ok(planOut(s, p, true));
    }
    if (is("POST", "/clinic/admin/opd/publish")) {
      if (!s.draft) return fail(409, "conflict", "Generate a draft first.");
      const before = Object.entries(s.published).filter(([d]) => d >= today).reduce((n, [, d]) => n + d.morning.length + d.evening.length, 0);
      const keep = Object.fromEntries(Object.entries(s.published).filter(([d]) => d < today));
      const fut = Object.fromEntries(Object.entries(s.draft).filter(([d]) => d >= today));
      s.published = { ...keep, ...fut };
      s.draft = null;
      const published = Object.values(fut).reduce((n, d) => n + d.morning.length + d.evening.length, 0);
      const notified = new Set(Object.values(fut).flatMap((d) => [...d.morning, ...d.evening])).size;
      return ok<W.ClinicPublishResult>({ published, removed: Math.max(0, before - published), notified });
    }
    if (is("DELETE", "/clinic/admin/opd/plan")) {
      const n = s.draft ? Object.values(s.draft).reduce((k, d) => k + d.morning.length + d.evening.length, 0) : 0;
      s.draft = null;
      return ok({ deleted: n });
    }
    if (is("POST", "/clinic/admin/opd/remind")) return ok<W.ClinicRemindResult>({ notified: people.filter((p) => visits(s, p.id).some((v) => v.state === "due")).length });
    if (is("GET", "/clinic/admin/trackers")) return ok<W.ClinicTrackers>({ v: 1, cohortId, rows: people.map((p) => trackerRow(s, p)) });
    return fail(404, "not_found", "That could not be found.");
  }

  /* ------------------------------------------------------- student */
  if (who === "lecture") return fail(403, "scope", "Your account is for lectures only.");
  if (who !== "student") return fail(403, "forbidden", "This is for students.");
  const id = ME;
  const me = studentOf(s, id)!;
  const mySessions = () => cohortSessions(s, me.cohortId);

  if (is("GET", "/clinic/today")) {
    const v = visits(s, id);
    const t = v.find((x) => x.date === today && x.state !== "on_leave");
    return ok<W.ClinicToday>({ v: 1, date: today, cohortId: me.cohortId, note: s.notes[today] ?? null, sessions: sortT(mySessions().filter((x) => x.date === today)).map((x) => mine(s, x, id)), opd: t ? { batch: t.batch, start: t.start, end: t.end, sessionId: t.sessionId, assignmentId: t.assignmentId } : null, leavesLeft: balance(s, id).left, logsDue: v.filter((x) => x.state === "due").length });
  }
  if (is("GET", "/clinic/week")) {
    const from = /^\d{4}-\d{2}-\d{2}$/.test(query.start ?? "") ? query.start! : addDays(today, -WEEKDAYS.indexOf(weekdayOf(today)));
    const to = addDays(from, 6);
    const days = Array.from({ length: 7 }, (_, i) => addDays(from, i)).map((date) => ({ date, note: s.notes[date] ?? null, sessions: sortT(mySessions().filter((x) => x.date === date)).map((x) => mine(s, x, id)) }));
    return ok<W.ClinicWeek>({ v: 1, from, to, cohortId: me.cohortId, days });
  }
  if (is("POST", "/clinic/scan")) {
    const raw = typeof body.token === "string" ? body.token : "";
    const typed = typeof body.code === "string" ? body.code.toUpperCase().replace(/[\s-]/g, "") : "";
    const w = windowNow();
    let target: Sess | undefined;
    if (raw) {
      const x = /^vibha-att:1:(.+):(\d+):([A-Za-z0-9_-]{22})$/.exec(raw);
      if (!x) return fail(400, "bad_request", "That is not an attendance code.");
      target = s.sessions.find((y) => y.id === x[1]);
      if (!target) return fail(400, "bad_request", "That is not an attendance code.");
      if (token(s, target.id, w) !== x[3] && token(s, target.id, w - 1) !== x[3]) return fail(400, "bad_request", "That code is too old. Scan the one on the screen now.");
    } else if (typed) {
      // Like the server: a typed code is matched to the student's own open sessions only.
      const open = s.sessions.filter((y) => isOpen(y) && y.cohortIds.includes(me.cohortId) && (!isOpd(y.kind) || expected(s, y).some((p) => p.id === id)));
      target = open.find((y) => code(s, y.id, w) === typed || code(s, y.id, w - 1) === typed);
      if (!target) return fail(400, "bad_request", open.some((y) => [2, 3, 4, 5, 6].some((k) => code(s, y.id, w - k) === typed)) ? "That code is too old. Type the one on the screen now." : "That code is not right. Check the 6 letters.");
    } else return fail(400, "bad_request", "Scan the code or type it.");
    if (!isOpen(target)) return fail(409, "conflict", "This session is not open for scanning now.");
    if (!target.cohortIds.includes(me.cohortId) || (isOpd(target.kind) && !expected(s, target).some((p) => p.id === id))) return fail(403, "forbidden", "This code is for a session you are not in.");
    const key = sk(target.id, id);
    const prev = s.scans[key];
    const at = nowIso();
    const title = target.title || "Session";
    if (prev?.inAt && prev.outAt) return fail(400, "bad_request", `You have already scanned in and out of ${title}.`);
    if (prev?.inAt || body.direction === "out") {
      if (!prev?.inAt) return fail(400, "bad_request", "Scan in before you scan out.");
      if (now() - Date.parse(prev.inAt) < 60_000) return fail(400, "bad_request", "You are already scanned in. Scan again when you leave.");
      prev.outAt = at;
      return ok<W.ClinicScanResult>({ sessionId: target.id, title, direction: "out", at, late: false, minutes: Math.round((now() - Date.parse(prev.inAt)) / 60_000) });
    }
    s.scans[key] = { inAt: at, outAt: null, manual: false, note: null };
    return ok<W.ClinicScanResult>({ sessionId: target.id, title, direction: "in", at, late: now() > Date.parse(iso(target.date, target.start)) + s.settings.lateMinutes * 60_000, minutes: null });
  }
  // Marking in two steps, like the server (src/lib/clinic/scan-flow.ts): identify saves nothing, confirm saves once.
  if (is("POST", "/clinic/scan/identify")) {
    const raw = typeof body.token === "string" ? body.token : "";
    const typed = typeof body.code === "string" ? body.code.toUpperCase().replace(/[\s-]/g, "") : "";
    const w = windowNow();
    const mineToMark = (y: Sess) => y.cohortIds.includes(me.cohortId) && (!isOpd(y.kind) || expected(s, y).some((p) => p.id === id));
    let target: Sess | undefined;
    if (raw) {
      const x = /^vibha-att:1:(.+):(\d+):([A-Za-z0-9_-]{22})$/.exec(raw);
      target = x ? s.sessions.find((y) => y.id === x[1]) : undefined;
      if (!x || !target) return fail(400, "bad_request", "That is not a VIBHA attendance code. Scan the code on the admin's screen.", "not_a_code");
      if (token(s, target.id, w) !== x[3] && token(s, target.id, w - 1) !== x[3]) {
        const old = Number(x[2]) < w && token(s, target.id, Number(x[2])) === x[3];
        return old ? fail(400, "bad_request", "That code has changed. Scan the one on the screen now.", "code_expired") : fail(400, "bad_request", "That code is not right. Scan the code on the admin's screen.", "not_a_code");
      }
    } else if (typed) {
      const open = s.sessions.filter((y) => isOpen(y) && mineToMark(y));
      target = open.find((y) => code(s, y.id, w) === typed || code(s, y.id, w - 1) === typed);
      if (!target) {
        const old = open.some((y) => [2, 3, 4, 5, 6].some((k) => code(s, y.id, w - k) === typed));
        return old ? fail(400, "bad_request", "That code has changed. Type the one on the screen now.", "code_expired") : fail(400, "bad_request", "That code is not right. Check the 6 letters and numbers under the picture.", "not_a_code");
      }
    } else return fail(400, "bad_request", "Scan the code or type it.", "not_a_code");
    const title = target.title || "Session";
    if (!mineToMark(target)) return fail(403, "forbidden", "This code is for another group's session. Check you are in the right room, then scan the code there.", "wrong_cohort");
    if (target.cancelled) return fail(409, "conflict", `${title} was cancelled. There is nothing to mark.`, "cancelled");
    if (!isOpen(target)) return target.date > today ? fail(409, "conflict", `${title} is not open yet. Scan again on the day.`, "not_open_yet") : fail(409, "conflict", `Marking for ${title} is closed. Ask the admin to mark you.`, "closed");
    const prev = s.scans[sk(target.id, id)];
    const yes = { allowed: true, reason: null };
    const choices: Pick<W.ClinicScanIdentify, "state" | "in" | "out"> = !prev?.inAt
      ? { state: "none", in: yes, out: { allowed: false, reason: "Mark IN first." } }
      : !prev.outAt
        ? { state: "in", in: { allowed: false, reason: `You are already IN since ${clockAt(prev.inAt)}.` }, out: yes }
        : { state: "out", in: { allowed: false, reason: `You marked IN at ${clockAt(prev.inAt)}.` }, out: { allowed: false, reason: `You marked OUT at ${clockAt(prev.outAt)}.` } };
    const exp = now() + TICKET_MS;
    return ok<W.ClinicScanIdentify>({
      ticket: `t1.${target.id}.${exp}.${raw ? "q" : "c"}.${id}`,
      ticketExpiresAt: new Date(exp).toISOString(),
      now: nowIso(),
      session: { id: target.id, title, kind: target.kind, date: target.date, start: target.start, end: target.end, place: target.place },
      inAt: prev?.inAt ?? null,
      outAt: prev?.outAt ?? null,
      ...choices,
    });
  }
  if (is("POST", "/clinic/scan/confirm")) {
    const again = () => fail(400, "bad_request", "That took too long. Scan the code again.", "ticket_expired");
    const t = /^t1\.(.+)\.(\d+)\.[qc]\.(.+)$/.exec(typeof body.ticket === "string" ? body.ticket : "");
    const direction = body.direction === "in" || body.direction === "out" ? body.direction : null;
    const attemptId = typeof body.attemptId === "string" ? body.attemptId : "";
    if (!direction || attemptId.length < 8) return fail(400, "bad_request", "Something is missing. Scan again.");
    const target = t ? s.sessions.find((y) => y.id === t[1]) : undefined;
    if (!t || !target || t[3] !== id || now() > Number(t[2])) return again();
    const title = target.title || "Session";
    if (target.cancelled) return fail(409, "conflict", `${title} was cancelled. There is nothing to mark.`, "cancelled");
    const key = sk(target.id, id);
    const prev = s.scans[key];
    const word = direction === "in" ? "IN" : "OUT";
    const late = (inAt: string) => Date.parse(inAt) > Date.parse(iso(target.date, target.start)) + s.settings.lateMinutes * 60_000;
    const answer = (sc: Scan, already: boolean) => {
      const at = (direction === "in" ? sc.inAt : sc.outAt)!;
      return ok<W.ClinicScanConfirm>({ sessionId: target.id, title, direction, at, already, message: already ? `Already marked ${word} at ${clockAt(at)}. Nothing was changed.` : `Marked ${word} at ${clockAt(at)}.`, late: late(sc.inAt!), minutes: direction === "out" ? Math.round((Date.parse(sc.outAt!) - Date.parse(sc.inAt!)) / 60_000) : null });
    };
    if (direction === "out" && !prev?.inAt) return fail(400, "bad_request", `You have not marked IN for ${title}. Mark IN first.`, "out_before_in");
    if (direction === "in" && prev?.inAt) return answer(prev, prev.inAttempt !== attemptId);
    if (direction === "out" && prev?.outAt) return answer(prev, prev.outAttempt !== attemptId);
    const next: Scan = direction === "in" ? { inAt: nowIso(), outAt: null, manual: false, note: null, inAttempt: attemptId } : { ...prev!, outAt: nowIso(), outAttempt: attemptId };
    s.scans[key] = next;
    return answer(next, false);
  }
  if (is("GET", "/clinic/attendance")) {
    const sessions = sortT(mySessions().filter((x) => x.date <= today)).map((x) => mine(s, x, id));
    return ok<W.ClinicMyAttendance>({ v: 1, cohortId: me.cohortId, summary: summary(s, id, me.cohortId), sessions });
  }
  if (is("GET", "/clinic/leave")) return ok<W.ClinicMyLeave>({ v: 1, cohortId: me.cohortId, balance: balance(s, id), requests: s.leaves.filter((l) => l.userId === id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) });
  if (is("POST", "/clinic/leave")) {
    const ids = Array.isArray(body.sessionIds) ? (body.sessionIds as string[]) : [];
    const reason = String(body.reason ?? "").trim();
    if (!ids.length) return fail(400, "bad_request", "Pick at least one session.");
    if (reason.length < 3) return fail(400, "bad_request", "Write a short reason.");
    const picked = s.sessions.filter((x) => ids.includes(x.id) && x.date >= today && !x.cancelled && expected(s, x).some((p) => p.id === id));
    if (picked.length !== ids.length) return fail(400, "bad_request", "One of those sessions is not yours or is over.");
    const bal = balance(s, id);
    const l: Leave = { id: `lv${100 + s.seq++}`, userId: id, cohortId: me.cohortId, kind: "leave", sessions: picked.map((x) => ({ id: x.id, date: x.date, start: x.start, title: x.title || "Session" })), leaveAt: null, reason, status: "pending", overLimit: bal.left < picked.length, cost: picked.length, decidedAt: null, decisionNote: null, createdAt: nowIso() };
    s.leaves.push(l);
    return ok(l);
  }
  if (is("POST", "/clinic/leave/early")) {
    const x = s.sessions.find((y) => y.id === body.sessionId);
    const reason = String(body.reason ?? "").trim();
    const at = String(body.leaveAt ?? "");
    if (!x || x.date < today || !expected(s, x).some((p) => p.id === id)) return fail(400, "bad_request", "Pick one of your sessions from today on.");
    if (!/^\d{2}:\d{2}$/.test(at) || minutesOf(at) <= minutesOf(x.start) || minutesOf(at) >= minutesOf(x.end)) return fail(400, "bad_request", "Pick a time between the start and the end.");
    if (reason.length < 3) return fail(400, "bad_request", "Write a short reason.");
    const l: Leave = { id: `lv${100 + s.seq++}`, userId: id, cohortId: me.cohortId, kind: "early", sessions: [{ id: x.id, date: x.date, start: x.start, title: x.title || "Session" }], leaveAt: at, reason, status: "pending", overLimit: false, cost: 0, decidedAt: null, decisionNote: null, createdAt: nowIso() };
    s.leaves.push(l);
    return ok(l);
  }
  if ((m = is("DELETE", "/clinic/leave/:id"))) {
    const l = s.leaves.find((x) => x.id === m![0] && x.userId === id);
    if (!l) return fail(404, "not_found", "That request is not here.");
    if (l.status !== "pending") return fail(409, "conflict", "Only a waiting request can be cancelled.");
    l.status = "cancelled";
    return ok({ cancelled: true });
  }
  const myOpd = (): W.ClinicMyOpd => ({ v: 1, cohortId: me.cohortId, batch: me.batch, canChooseBatch: !me.batchLocked, casesPerVisit: s.settings.casesPerVisit, quota: quota(s, me), visits: visits(s, id) });
  if (is("GET", "/clinic/opd")) return ok(myOpd());
  if (is("PUT", "/clinic/opd/batch")) {
    if (me.batchLocked) return fail(409, "conflict", "Your batch is set. Ask the admin to change it.");
    if (body.batch !== "morning" && body.batch !== "evening") return fail(400, "bad_request", "Pick Morning or Evening.");
    me.batch = body.batch;
    me.batchLocked = true;
    return ok(myOpd());
  }
  if (is("POST", "/clinic/opd/logs")) {
    const v = visits(s, id).find((x) => x.assignmentId === body.assignmentId);
    if (!v) return fail(404, "not_found", "That visit is not yours.");
    if (v.date > today) return fail(400, "bad_request", "Log your cases after the visit.");
    const absent = body.absent === true;
    const cases = absent ? 0 : Number(body.cases);
    if (!Number.isInteger(cases) || cases < 0 || cases > 20) return fail(400, "bad_request", "Write how many cases, 0 to 20.");
    s.logs[vk(v.date, id)] = { cases, absent, note: typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 140) : null };
    return ok(visits(s, id).find((x) => x.assignmentId === v.assignmentId)!);
  }
  return fail(404, "not_found", "That could not be found.");
}

/** Browser screenshots (web mock build only): the page can read today's code to walk through the scan. */
if (typeof document !== "undefined") (globalThis as { __clinicMock?: typeof clinicMock }).__clinicMock = clinicMock;
