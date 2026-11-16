/**
 * The clinic part of the mock server (EXPO_PUBLIC_API_MODE=mock): schedule,
 * attendance by code, leave, OPD quotas and the generated OPD timetable, with
 * state in memory so every action shows its result.
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
import * as C from "./contract";
import { addDays, CODE_LETTERS, isOpd, minutesOf, todayIST, weekdayOf } from "./logic";

const ME = "u-student";
const C2: C.Ref = { id: "c2", name: "Cohort Two" };
const C1: C.Ref = { id: "c1", name: "Cohort One" };

type Student = { id: string; name: string; cohortId: string; batch: C.Batch | null; batchLocked: boolean; leaveAllowance: number; opdTotal: number; extras: number };
type Sess = Omit<C.ClinicSession, "mine"> & { cohortIds: string[]; oneOff: boolean; slotId: string | null };
type Scan = { inAt: string | null; outAt: string | null; manual: boolean; note: string | null };
type Log = { cases: number | null; absent: boolean; note: string | null };
type Leave = C.LeaveRequest & { studentId: string };
type Plan = Record<string, Record<C.Batch, string[]>>;

type State = {
  students: Student[];
  slots: C.Slot[];
  sessions: Sess[];
  scans: Record<string, Scan>;
  logs: Record<string, Log>;
  leaves: Leave[];
  notes: Record<string, string>;
  secrets: Record<string, string>;
  settings: C.OpdSettings;
  draft: Plan | null;
  published: Plan;
  generatedAt: string | null;
  publishedAt: string | null;
  notified: number;
  seq: number;
};

const iso = (date: string, hm: string) => new Date(Date.parse(`${date}T${hm}:00+05:30`)).toISOString();
const sk = (sessionId: string, studentId: string) => `${sessionId}|${studentId}`;
const vk = (date: string, studentId: string) => `${date}|${studentId}`;
const now = () => Date.now();

function seedSlots(): C.Slot[] {
  const s = (id: string, weekday: C.Weekday, kind: C.SessionKind, title: string, start: string, end: string, place: string | null, link: string | null = null, cohortIds = ["c2"]): C.Slot => ({ id, weekday, kind, title, start, end, place, link, cohortIds, compulsory: !isOpd(kind) });
  return [
    s("sl1", "mon", "opd_morning", "OPD", "08:00", "10:00", "VIBHA Clinic, OPD 2"),
    s("sl2", "mon", "opd_evening", "OPD", "17:00", "20:00", "VIBHA Clinic, OPD 2"),
    s("sl3", "tue", "class", "Case formulation", "10:00", "13:00", "VIBHA Clinic, Room 1"),
    s("sl4", "wed", "opd_morning", "OPD", "08:00", "10:00", "VIBHA Clinic, OPD 2"),
    s("sl5", "wed", "opd_evening", "OPD", "17:00", "20:00", "VIBHA Clinic, OPD 2"),
    s("sl6", "thu", "online", "Psychopathology", "19:00", "20:30", null, "https://meet.google.com/vib-hapsy-chl"),
    s("sl7", "fri", "opd_morning", "OPD", "08:00", "10:00", "VIBHA Clinic, OPD 2"),
    s("sl8", "fri", "opd_evening", "OPD", "17:00", "20:00", "VIBHA Clinic, OPD 2"),
    s("sl9", "sat", "class", "Weekend class", "10:00", "13:00", "VIBHA Clinic, Room 1"),
  ];
}

function sessionsFromSlots(slots: C.Slot[], today: string): Sess[] {
  const out: Sess[] = [];
  for (let d = -21; d <= 28; d++) {
    const date = addDays(today, d);
    for (const sl of slots.filter((x) => x.weekday === weekdayOf(date))) {
      out.push({ id: `${sl.id}-${date}`, date, start: sl.start, end: sl.end, kind: sl.kind, title: sl.title, place: sl.place, link: sl.link, compulsory: sl.compulsory, status: "scheduled", note: null, cohortIds: sl.cohortIds, oneOff: false, slotId: sl.id });
    }
  }
  return out;
}

const seats = (m: number, e: number) => ({ morning: m, evening: e });

function fresh(): State {
  const today = todayIST(now());
  const slots = seedSlots();
  const sessions = sessionsFromSlots(slots, today);
  // Today always has a class, an evening OPD and a Cohort One session (whose code is "not your session").
  const has = (k: C.SessionKind) => sessions.some((s) => s.date === today && s.kind === k);
  if (!has("class")) sessions.push({ id: `one-class-${today}`, date: today, start: "10:00", end: "13:00", kind: "class", title: "Case formulation", place: "VIBHA Clinic, Room 1", link: null, compulsory: true, status: "scheduled", note: null, cohortIds: ["c2"], oneOff: true, slotId: null });
  if (!has("opd_evening")) sessions.push({ id: `one-opd-${today}`, date: today, start: "17:00", end: "20:00", kind: "opd_evening", title: "OPD", place: "VIBHA Clinic, OPD 2", link: null, compulsory: false, status: "scheduled", note: null, cohortIds: ["c2"], oneOff: true, slotId: null });
  sessions.push({ id: `one-c1-${today}`, date: today, start: "14:00", end: "15:30", kind: "other", title: "Cohort One review", place: "VIBHA Clinic, Room 2", link: null, compulsory: true, status: "scheduled", note: null, cohortIds: ["c1"], oneOff: true, slotId: null });
  // A moved class and a cancelled one in the coming days.
  const nextTue = sessions.find((s) => s.slotId === "sl3" && s.date > today);
  if (nextTue) Object.assign(nextTue, { status: "moved", start: "11:00", end: "14:00", note: "Starts an hour later this week" });
  const nextSat = sessions.find((s) => s.slotId === "sl9" && s.date > addDays(today, 6));
  if (nextSat) Object.assign(nextSat, { status: "cancelled", note: "No class: public holiday" });

  const students: Student[] = [
    { id: ME, name: "Ananya Mehta", cohortId: "c2", batch: "evening", batchLocked: true, leaveAllowance: 4, opdTotal: 8, extras: 0 },
    { id: "u3", name: "Meera Pillai", cohortId: "c2", batch: "morning", batchLocked: true, leaveAllowance: 4, opdTotal: 8, extras: 0 },
    { id: "u5", name: "Sana Khan", cohortId: "c2", batch: "evening", batchLocked: true, leaveAllowance: 4, opdTotal: 10, extras: 2 },
    { id: "u8", name: "Dev Malhotra", cohortId: "c2", batch: "morning", batchLocked: true, leaveAllowance: 4, opdTotal: 8, extras: 0 },
    { id: "u12", name: "Aditi Verma", cohortId: "c2", batch: "evening", batchLocked: true, leaveAllowance: 4, opdTotal: 7, extras: 0 },
    { id: "u6", name: "Arjun Nair", cohortId: "c2", batch: null, batchLocked: false, leaveAllowance: 4, opdTotal: 8, extras: 0 },
    { id: "u10", name: "Neha Joshi", cohortId: "c1", batch: "morning", batchLocked: true, leaveAllowance: 3, opdTotal: 6, extras: 0 },
  ];
  const settings: C.OpdSettings = {
    from: addDays(today, -21),
    to: addDays(today, 28),
    casesPerVisit: 2,
    seats: { mon: seats(2, 2), tue: seats(0, 0), wed: seats(2, 2), thu: seats(0, 0), fri: seats(2, 2), sat: seats(0, 0), sun: seats(0, 0) },
    times: { morning: { start: "08:00", end: "10:00" }, evening: { start: "17:00", end: "20:00" } },
  };
  const s: State = { students, slots, sessions, scans: {}, logs: {}, leaves: [], notes: {}, secrets: {}, settings, draft: null, published: {}, generatedAt: null, publishedAt: null, notified: 0, seq: 1 };

  // A published plan: past visits for history, today's evening for Ananya.
  s.published = generate(s, settings.from, {}, true);
  const tday = (s.published[today] ??= { morning: [], evening: [] });
  if (!tday.evening.includes(ME)) tday.evening = [ME, ...tday.evening.filter((x) => x !== ME)].slice(0, Math.max(2, tday.evening.length));
  s.publishedAt = iso(addDays(today, -22), "18:00");
  s.generatedAt = s.publishedAt;
  s.notes[today] = "Bring your case sheets to the OPD.";

  // History: past scans and case logs.
  const past = sessions.filter((x) => x.date < today && x.status !== "cancelled");
  let i = 0;
  for (const x of past) {
    for (const st of expected(s, x)) {
      i++;
      if (i % 11 === 0) continue; // missed now and then
      const late = i % 7 === 0;
      s.scans[sk(x.id, st.id)] = { inAt: iso(x.date, addMin(x.start, late ? 18 : -5)), outAt: i % 13 === 0 ? null : iso(x.date, addMin(x.end, 2)), manual: false, note: null };
    }
  }
  let j = 0;
  for (const [date, day] of Object.entries(s.published)) {
    if (date >= today) continue;
    for (const b of ["morning", "evening"] as const)
      for (const id of day[b]) {
        j++;
        // One unsubmitted log for Ananya (the newest past visit), one for Sana, the rest logged.
        if (id === ME && date === latestPast(s, ME, today)) continue;
        if (id === "u5" && j % 5 === 0) continue;
        s.logs[vk(date, id)] = j % 9 === 0 ? { cases: null, absent: true, note: null } : { cases: 2, absent: false, note: null };
      }
  }
  // Leave requests.
  const nextOpd = Object.keys(s.published).filter((d) => d > today && s.published[d]!.evening.includes(ME)).sort()[0];
  const sat = sessions.find((x) => x.slotId === "sl9" && x.date > today && x.status !== "cancelled");
  s.leaves.push({ id: "lv1", studentId: ME, kind: "leave", sessions: sat ? [brief(sat)] : [], reason: "Family wedding out of town", leaveAt: null, status: "pending", overLimit: false, adminNote: null, createdAt: iso(today, "09:10"), decidedAt: null });
  const oldClass = past.filter((x) => x.kind === "class").slice(-1)[0];
  if (oldClass) s.leaves.push({ id: "lv2", studentId: ME, kind: "leave", sessions: [brief(oldClass)], reason: "Fever", leaveAt: null, status: "approved", overLimit: false, adminNote: "Get well soon", createdAt: iso(addDays(oldClass.date, -1), "20:00"), decidedAt: iso(addDays(oldClass.date, -1), "21:00") });
  const todays = sessions.find((x) => x.date === today && x.kind === "class");
  if (todays) s.leaves.push({ id: "lv3", studentId: "u8", kind: "early", sessions: [brief(todays)], reason: "Hospital appointment", leaveAt: addMin(todays.end, -60), status: "pending", overLimit: false, adminNote: null, createdAt: iso(today, "08:00"), decidedAt: null });
  if (nextOpd) s.leaves.push({ id: "lv4", studentId: "u12", kind: "leave", sessions: [{ id: `opd-${nextOpd}`, title: "OPD evening", date: nextOpd, start: "17:00", end: "20:00" }], reason: "Exam at college", leaveAt: null, status: "pending", overLimit: true, adminNote: null, createdAt: iso(today, "07:30"), decidedAt: null });
  // Aditi has used all her leaves.
  for (let k = 0; k < 4 && k < past.length; k++) s.leaves.push({ id: `lvx${k}`, studentId: "u12", kind: "leave", sessions: [brief(past[k]!)], reason: "Unwell", leaveAt: null, status: "approved", overLimit: false, adminNote: null, createdAt: iso(past[k]!.date, "07:00"), decidedAt: iso(past[k]!.date, "08:00") });
  return s;
}

function addMin(hm: string, m: number): string {
  const t = minutesOf(hm) + m;
  const c = Math.max(0, Math.min(23 * 60 + 59, t));
  return `${String(Math.floor(c / 60)).padStart(2, "0")}:${String(c % 60).padStart(2, "0")}`;
}
const brief = (x: Sess) => ({ id: x.id, title: x.title || "Session", date: x.date, start: x.start, end: x.end });
function latestPast(s: State, id: string, today: string): string | undefined {
  return Object.keys(s.published)
    .filter((d) => d < today && (s.published[d]!.morning.includes(id) || s.published[d]!.evening.includes(id)))
    .sort()
    .pop();
}

let state: State | null = null;
const st = (): State => (state ??= fresh());

export const clinicMock = {
  reset() {
    state = null;
  },
  /** Tests: the code on the admin's screen for a session right now. */
  codeFor: (sessionId: string) => code(st(), sessionId, windowNow()),
  qrFor: (sessionId: string) => `vibha:att:${sessionId}:${code(st(), sessionId, windowNow())}`,
  todaySessions: () => st().sessions.filter((x) => x.date === todayIST(now())),
  generate: (from: string, fixed: Plan) => generate(st(), from, fixed, false),
  state: () => st(),
};

/* ----------------------------------------------------------- who, what */

function expected(s: State, x: Sess): Student[] {
  if (isOpd(x.kind)) {
    const b: C.Batch = x.kind === "opd_morning" ? "morning" : "evening";
    const ids = s.published[x.date]?.[b] ?? [];
    return s.students.filter((p) => ids.includes(p.id));
  }
  return s.students.filter((p) => x.cohortIds.includes(p.cohortId));
}

function approvedLeave(s: State, sessionId: string, studentId: string, kind: "leave" | "early" = "leave"): Leave | undefined {
  return s.leaves.find((l) => l.studentId === studentId && l.kind === kind && l.status === "approved" && l.sessions.some((x) => x.id === sessionId));
}

function mineOf(s: State, x: Sess, studentId: string): NonNullable<C.ClinicSession["mine"]> {
  const scan = s.scans[sk(x.id, studentId)];
  const early = approvedLeave(s, x.id, studentId, "early");
  const late = !!scan?.inAt && Date.parse(scan.inAt) > Date.parse(iso(x.date, x.start)) + 10 * 60_000;
  const base = { inAt: scan?.inAt ?? null, outAt: scan?.outAt ?? null, late, leaveAt: early?.leaveAt ?? null };
  const today = todayIST(now());
  if (x.status === "cancelled") return { ...base, state: "cancelled" };
  if (scan?.inAt && scan.outAt) return { ...base, state: "done" };
  if (scan?.inAt) return { ...base, state: x.date < today ? "no_out" : "in" };
  if (approvedLeave(s, x.id, studentId)) return { ...base, state: "leave" };
  if (x.date < today) return { ...base, state: "missed" };
  if (x.date > today) return { ...base, state: "upcoming" };
  return { ...base, state: "open" };
}

const pub = (x: Sess): C.ClinicSession => ({ id: x.id, date: x.date, start: x.start, end: x.end, kind: x.kind, title: x.title, place: x.place, link: x.link, compulsory: x.compulsory, status: x.status, note: x.note, mine: null });
const forStudent = (s: State, x: Sess, id: string): C.ClinicSession => ({ ...pub(x), mine: mineOf(s, x, id) });
const mySessions = (s: State, id: string) => s.sessions.filter((x) => expected(s, x).some((p) => p.id === id) || (x.status === "cancelled" && x.cohortIds.includes(s.students.find((p) => p.id === id)?.cohortId ?? "") && !isOpd(x.kind)));
const sortT = <T extends { date: string; start: string }>(r: T[]) => r.sort((a, b) => (a.date === b.date ? minutesOf(a.start) - minutesOf(b.start) : a.date < b.date ? -1 : 1));

function counts(s: State, x: Sess): C.SessionCounts {
  const rows = roster(s, x);
  return { expected: rows.length, in: rows.filter((r) => r.state === "in").length, out: rows.filter((r) => r.state === "out" || r.state === "no_out").length, missing: rows.filter((r) => r.state === "missing").length, late: rows.filter((r) => r.late).length, leave: rows.filter((r) => r.state === "leave").length };
}
const adminSess = (s: State, x: Sess): C.AdminSession => ({ ...pub(x), cohorts: [C1, C2].filter((c) => x.cohortIds.includes(c.id)), counts: counts(s, x) });

function roster(s: State, x: Sess): C.RosterRow[] {
  return expected(s, x).map((p) => {
    const m = mineOf(s, x, p.id);
    const scan = s.scans[sk(x.id, p.id)];
    const state: C.RosterState = m.state === "done" ? "out" : m.state === "in" ? "in" : m.state === "no_out" ? "no_out" : m.state === "leave" ? "leave" : "missing";
    return { studentId: p.id, name: p.name, state, inAt: m.inAt, outAt: m.outAt, late: m.late, manual: !!scan?.manual, note: scan?.note ?? null, leaveAt: m.leaveAt };
  });
}

/* ---------------------------------------------------------------- code */

const windowNow = () => Math.floor(now() / 30_000);
function secretOf(s: State, id: string): string {
  return (s.secrets[id] ??= `sec-${id}-${s.seq++}`);
}
function code(s: State, sessionId: string, w: number): string {
  const text = `${secretOf(s, sessionId)}:${sessionId}:${w}`;
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0;
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += CODE_LETTERS[h % CODE_LETTERS.length];
    h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0;
  }
  return out;
}

/* ------------------------------------------------------------ OPD plan */

function visitsDone(s: State, id: string): { cases: number; visits: number; absences: number } {
  let cases = 0;
  let visits = 0;
  let absences = 0;
  for (const [k, v] of Object.entries(s.logs)) {
    if (!k.endsWith(`|${id}`)) continue;
    if (v.absent) absences++;
    else {
      visits++;
      cases += v.cases ?? 0;
    }
  }
  return { cases, visits, absences };
}

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
  const need: Record<string, number> = {};
  for (const p of s.students) {
    if (!p.batch) continue;
    const done = history ? 0 : visitsDone(s, p.id).cases;
    const placed = Object.entries(plan).filter(([d, day]) => (history || d >= todayIST(now())) && (day.morning.includes(p.id) || day.evening.includes(p.id))).length;
    need[p.id] = Math.max(0, Math.ceil(Math.max(0, p.opdTotal - done) / per) - placed);
  }
  const count: Record<string, number> = {};
  for (let d = from; d <= set.to; d = addDays(d, 1)) {
    if (d < set.from) continue;
    if (fixed[d]) continue;
    const w = weekdayOf(d);
    for (const b of ["morning", "evening"] as const) {
      const n = set.seats[w][b];
      if (!n) continue;
      const kind = b === "morning" ? "opd_morning" : "opd_evening";
      if (s.sessions.some((x) => x.date === d && x.kind === kind && x.status === "cancelled")) continue;
      const pick = s.students
        .filter((p) => p.batch === b && (need[p.id] ?? 0) > 0)
        .filter((p) => !s.leaves.some((l) => l.studentId === p.id && l.status === "approved" && l.kind === "leave" && l.sessions.some((x) => x.date === d)))
        .sort((a, c) => (need[c.id]! - need[a.id]!) || ((count[a.id] ?? 0) - (count[c.id] ?? 0)) || a.name.localeCompare(c.name))
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

function planOut(s: State, p: Plan, status: C.OpdPlan["status"]): C.OpdPlan {
  const today = todayIST(now());
  const name = (id: string) => s.students.find((x) => x.id === id)?.name ?? "Student";
  const days: C.PlanDay[] = [];
  for (let d = s.settings.from; d <= s.settings.to; d = addDays(d, 1)) {
    const w = weekdayOf(d);
    const seat = s.settings.seats[w];
    const day = p[d];
    if (!seat.morning && !seat.evening && !day) continue;
    const fixed = d < addDays(today, 2) && !!s.published[d];
    days.push({ date: d, morning: (day?.morning ?? []).map((id) => ({ studentId: id, name: name(id), fixed })), evening: (day?.evening ?? []).map((id) => ({ studentId: id, name: name(id), fixed })), seats: { ...seat } });
  }
  const short = s.students
    .filter((x) => x.batch)
    .map((x) => {
      const needed = Math.ceil(Math.max(0, x.opdTotal - visitsDone(s, x.id).cases) / Math.max(1, s.settings.casesPerVisit));
      const placed = Object.entries(p).filter(([d, day]) => d >= today && (day.morning.includes(x.id) || day.evening.includes(x.id))).length;
      return { studentId: x.id, name: x.name, needed, placed };
    })
    .filter((x) => x.placed < x.needed);
  return { status, generatedAt: s.generatedAt, publishedAt: s.publishedAt, days, short };
}

function myVisits(s: State, id: string): C.OpdVisit[] {
  const today = todayIST(now());
  const out: C.OpdVisit[] = [];
  for (const [date, day] of Object.entries(s.published)) {
    for (const b of ["morning", "evening"] as const) {
      if (!day[b].includes(id)) continue;
      const t = s.settings.times[b];
      const log = s.logs[vk(date, id)];
      const onLeave = s.leaves.some((l) => l.studentId === id && l.status === "approved" && l.kind === "leave" && l.sessions.some((x) => x.date === date));
      const status: C.OpdVisitStatus = log ? (log.absent ? "absent" : "logged") : onLeave ? "leave" : date > today ? "upcoming" : date === today ? "today" : "to_log";
      out.push({ id: `${date}:${b}`, date, batch: b, start: t.start, end: t.end, status, cases: log?.cases ?? null, note: log?.note ?? null });
    }
  }
  return sortT(out);
}

function leavesUsed(s: State, id: string): number {
  const approved = s.leaves.filter((l) => l.studentId === id && l.kind === "leave" && l.status === "approved").reduce((n, l) => n + Math.max(1, l.sessions.length), 0);
  const absentOpd = Object.entries(s.logs).filter(([k, v]) => k.endsWith(`|${id}`) && v.absent).length;
  return approved + absentOpd;
}

function studentRow(s: State, p: Student): C.ClinicStudent {
  const d = visitsDone(s, p.id);
  const used = leavesUsed(s, p.id);
  const mine = mySessions(s, p.id).filter((x) => x.date < todayIST(now()) && x.status !== "cancelled" && x.compulsory);
  const present = mine.filter((x) => s.scans[sk(x.id, p.id)]?.inAt).length;
  return {
    studentId: p.id,
    name: p.name,
    cohortId: p.cohortId,
    cohort: [C1, C2].find((c) => c.id === p.cohortId)?.name ?? null,
    batch: p.batch,
    leaveAllowance: p.leaveAllowance,
    leavesUsed: used,
    leavesLeft: Math.max(0, p.leaveAllowance - used),
    opdTotal: p.opdTotal,
    extras: p.extras,
    casesDone: d.cases,
    visits: d.visits,
    absences: d.absences,
    attendancePct: mine.length ? Math.round((present / mine.length) * 100) : null,
    unsubmitted: myVisits(s, p.id).filter((v) => v.status === "to_log").length,
  };
}

function dateLine(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getUTCDay()]} ${d.getUTCDate()} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getUTCMonth()]}`;
}

/* -------------------------------------------------------------- routes */

const ok = <T,>(data: T): RawResponse => ({ status: 200, json: { ok: true, data } });
const fail = (status: number, code: string, message: string): RawResponse => ({ status, json: { ok: false, error: { code, message } } });

/**
 * Answers a clinic route, or null when the path is not one. `who` is the
 * signed-in kind from the mock token ("student", "admin", "viewadmin", "lecture").
 */
export function clinicRoute(method: string, fullPath: string, rawBody: unknown, who: string): RawResponse | null {
  const [path = "", qs = ""] = fullPath.split("?");
  if (!path.startsWith("/clinic") && !path.startsWith("/admin/clinic")) return null;
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

  /* ------------------------------------------------------- student */
  if (path.startsWith("/clinic")) {
    if (who === "lecture") return fail(403, "scope", "Your account is for lectures only.");
    const id = ME;
    const me = s.students.find((p) => p.id === id)!;
    if (is("GET", "/clinic/today")) {
      const sessions = sortT(mySessions(s, id).filter((x) => x.date === today)).map((x) => forStudent(s, x, id));
      const v = myVisits(s, id);
      const t = v.find((x) => x.date === today && x.status !== "leave");
      const sess = t ? s.sessions.find((x) => x.date === today && x.kind === (t.batch === "morning" ? "opd_morning" : "opd_evening")) : undefined;
      return ok<C.ClinicToday>({ date: today, dateLine: dateLine(today), note: s.notes[today] ?? null, sessions, opd: t ? { batch: t.batch, start: t.start, end: t.end, place: sess?.place ?? null, sessionId: sess?.id ?? null } : null, toLog: v.filter((x) => x.status === "to_log"), batch: me.batch, leavesLeft: Math.max(0, me.leaveAllowance - leavesUsed(s, id)) });
    }
    if (is("GET", "/clinic/schedule")) {
      const from = /^\d{4}-\d{2}-\d{2}$/.test(query.from ?? "") ? query.from! : today;
      const to = addDays(from, 6);
      const mine = mySessions(s, id);
      const days = Array.from({ length: 7 }, (_, i) => addDays(from, i)).map((date) => ({ date, note: s.notes[date] ?? null, sessions: sortT(mine.filter((x) => x.date === date)).map((x) => forStudent(s, x, id)) }));
      const opdDays = myVisits(s, id).filter((v) => v.date >= from && v.date <= to).map((v) => ({ date: v.date, batch: v.batch, start: v.start, end: v.end }));
      return ok<C.ClinicWeek>({ from, to, days, opdDays });
    }
    if (is("POST", "/clinic/scan")) {
      const raw = typeof body.qr === "string" ? body.qr : "";
      const typed = typeof body.code === "string" ? body.code.toUpperCase() : "";
      const w = windowNow();
      let target: Sess | undefined;
      let fresh = false;
      if (raw) {
        const x = /^vibha:att:(.+):([A-Z0-9]{6})$/.exec(raw);
        if (!x) return fail(400, "bad_code", "That is not an attendance code.");
        target = s.sessions.find((y) => y.id === x[1]);
        fresh = !!target && (code(s, target.id, w) === x[2] || code(s, target.id, w - 1) === x[2]);
        if (target && !fresh) return fail(400, "code_expired", "That code has changed.");
      } else if (typed) {
        const live = s.sessions.filter((y) => y.date === today && y.status !== "cancelled");
        target = live.find((y) => code(s, y.id, w) === typed || code(s, y.id, w - 1) === typed);
        fresh = !!target;
        if (!target) {
          const old = live.some((y) => [2, 3, 4, 5, 6].some((k) => code(s, y.id, w - k) === typed));
          return old ? fail(400, "code_expired", "That code has changed.") : fail(400, "bad_code", "That code is not right.");
        }
      } else return fail(400, "bad_request", "Scan the code or type it.");
      if (!target) return fail(400, "bad_code", "That is not an attendance code.");
      if (target.date !== today || target.status === "cancelled") return fail(400, "session_closed", "This session is not open for scanning now.");
      if (!expected(s, target).some((p) => p.id === id)) return fail(403, "not_your_session", "This code is for a session you are not in.");
      const key = sk(target.id, id);
      const prev = s.scans[key];
      const at = new Date(now()).toISOString();
      if (prev?.inAt && prev.outAt) return fail(409, "already_scanned", `You scanned in and out of ${target.title || "this session"} already.`);
      if (prev?.inAt) {
        if (now() - Date.parse(prev.inAt) < 60_000) return fail(409, "already_scanned", "You are already scanned in. Scan again when you leave.");
        prev.outAt = at;
        const hours = Math.round(((now() - Date.parse(prev.inAt)) / 3600_000) * 10) / 10;
        return ok<C.ScanResult>({ direction: "out", at, session: brief(target), late: false, hours });
      }
      s.scans[key] = { inAt: at, outAt: null, manual: false, note: null };
      const late = now() > Date.parse(iso(target.date, target.start)) + 10 * 60_000;
      return ok<C.ScanResult>({ direction: "in", at, session: brief(target), late, hours: null });
    }
    if (is("GET", "/clinic/leave")) {
      const used = leavesUsed(s, id);
      const upcoming = sortT(mySessions(s, id).filter((x) => x.date >= today && x.status !== "cancelled" && !approvedLeave(s, x.id, id))).slice(0, 20).map((x) => forStudent(s, x, id));
      const requests = s.leaves.filter((l) => l.studentId === id).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).map(({ studentId: _s, ...l }) => l);
      return ok<C.LeavePage>({ allowance: me.leaveAllowance, used, left: Math.max(0, me.leaveAllowance - used), requests, upcoming });
    }
    if (is("POST", "/clinic/leave")) {
      const ids = Array.isArray(body.sessionIds) ? (body.sessionIds as string[]) : [];
      const reason = String(body.reason ?? "").trim();
      if (!ids.length) return fail(400, "bad_request", "Pick at least one session.");
      if (reason.length < 3) return fail(400, "bad_request", "Write a short reason.");
      const picked = s.sessions.filter((x) => ids.includes(x.id) && x.date >= today && expected(s, x).some((p) => p.id === id));
      if (picked.length !== ids.length) return fail(400, "bad_request", "One of those sessions is not yours or is over.");
      const left = me.leaveAllowance - leavesUsed(s, id) - s.leaves.filter((l) => l.studentId === id && l.kind === "leave" && l.status === "pending").reduce((n, l) => n + l.sessions.length, 0);
      const req: Leave = { id: `lv${100 + s.seq++}`, studentId: id, kind: "leave", sessions: picked.map(brief), reason, leaveAt: null, status: "pending", overLimit: left < picked.length, adminNote: null, createdAt: new Date(now()).toISOString(), decidedAt: null };
      s.leaves.push(req);
      const { studentId: _x, ...out } = req;
      return ok<C.LeaveResult>({ request: out });
    }
    if (is("POST", "/clinic/leave/early")) {
      const x = s.sessions.find((y) => y.id === body.sessionId);
      const reason = String(body.reason ?? "").trim();
      const at = String(body.leaveAt ?? "");
      if (!x || x.date < today || !expected(s, x).some((p) => p.id === id)) return fail(400, "bad_request", "Pick one of your sessions from today on.");
      if (!/^\d{2}:\d{2}$/.test(at) || minutesOf(at) <= minutesOf(x.start) || minutesOf(at) >= minutesOf(x.end)) return fail(400, "bad_request", "Pick a time between the start and the end.");
      if (reason.length < 3) return fail(400, "bad_request", "Write a short reason.");
      const req: Leave = { id: `lv${100 + s.seq++}`, studentId: id, kind: "early", sessions: [brief(x)], reason, leaveAt: at, status: "pending", overLimit: false, adminNote: null, createdAt: new Date(now()).toISOString(), decidedAt: null };
      s.leaves.push(req);
      const { studentId: _x, ...out } = req;
      return ok<C.LeaveResult>({ request: out });
    }
    if ((m = is("POST", "/clinic/leave/:id/cancel"))) {
      const l = s.leaves.find((x) => x.id === m![0] && x.studentId === id);
      if (!l) return fail(404, "not_found", "That request is not here.");
      if (l.status !== "pending") return fail(409, "bad_request", "Only a waiting request can be cancelled.");
      l.status = "cancelled";
      return ok<C.CancelLeaveResult>({ cancelled: true });
    }
    if (is("GET", "/clinic/opd")) {
      const d = visitsDone(s, id);
      return ok<C.OpdPage>({ batch: me.batch, batchLocked: me.batchLocked, total: me.opdTotal, extras: me.extras, done: d.cases, casesPerVisit: s.settings.casesPerVisit, published: !!s.publishedAt, visits: myVisits(s, id) });
    }
    if (is("PUT", "/clinic/batch")) {
      if (me.batchLocked) return fail(409, "forbidden", "Your batch is set. Ask the admin to change it.");
      if (body.batch !== "morning" && body.batch !== "evening") return fail(400, "bad_request", "Pick Morning or Evening.");
      me.batch = body.batch;
      me.batchLocked = true;
      return ok<C.BatchResult>({ batch: me.batch, batchLocked: true });
    }
    if ((m = is("POST", "/clinic/opd/visits/:id/log"))) {
      const v = myVisits(s, id).find((x) => x.id === m![0]);
      if (!v) return fail(404, "not_found", "That visit is not yours.");
      if (v.date > today) return fail(400, "bad_request", "Log your cases after the visit.");
      const absent = body.absent === true;
      const cases = absent ? null : Number(body.cases);
      if (!absent && (!Number.isInteger(cases) || (cases as number) < 0 || (cases as number) > 20)) return fail(400, "bad_request", "Write how many cases, 0 to 20.");
      s.logs[vk(v.date, id)] = { cases, absent, note: typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 140) : null };
      const nv = myVisits(s, id).find((x) => x.id === v.id)!;
      return ok<C.CaseLogResult>({ visit: nv, done: visitsDone(s, id).cases, total: me.opdTotal });
    }
    if (is("GET", "/clinic/attendance")) {
      const rows = sortT(mySessions(s, id).filter((x) => x.date <= today && x.status !== "cancelled"))
        .reverse()
        .map((x) => {
          const mm = mineOf(s, x, id);
          return { sessionId: x.id, date: x.date, title: x.title || "Session", kind: x.kind, state: mm.state, inAt: mm.inAt, outAt: mm.outAt, late: mm.late };
        });
      const past = rows.filter((r) => r.date < today || r.state === "done" || r.state === "in");
      const present = past.filter((r) => r.state === "done" || r.state === "in" || r.state === "no_out").length;
      const counted = past.filter((r) => r.state !== "leave").length;
      const hours = past.reduce((n, r) => (r.inAt && r.outAt ? n + (Date.parse(r.outAt) - Date.parse(r.inAt)) / 3600_000 : n), 0);
      return ok<C.MyAttendance>({ pct: counted ? Math.round((present / counted) * 100) : null, present, late: past.filter((r) => r.late).length, missed: past.filter((r) => r.state === "missed").length, onLeave: past.filter((r) => r.state === "leave").length, total: past.length, hours: Math.round(hours * 10) / 10, rows });
    }
    return fail(404, "not_found", "That could not be found.");
  }

  /* --------------------------------------------------------- admin */
  if (who !== "admin" && who !== "viewadmin") return fail(403, "forbidden", "Only admins can open this.");
  if (method !== "GET" && who !== "admin") return fail(403, "forbidden", "Only a Super Admin can do this.");
  const findS = (id: string) => s.sessions.find((x) => x.id === id);

  if (is("GET", "/admin/clinic/today")) {
    const rows = sortT(s.sessions.filter((x) => x.date === today)).map((x) => adminSess(s, x));
    return ok<C.AdminClinicToday>({ date: today, dateLine: dateLine(today), note: s.notes[today] ?? null, sessions: rows, pendingLeaves: s.leaves.filter((l) => l.status === "pending").length, unsubmittedLogs: s.students.reduce((n, p) => n + studentRow(s, p).unsubmitted, 0) });
  }
  if ((m = is("GET", "/admin/clinic/sessions/:id"))) {
    const x = findS(m[0]!);
    if (!x) return fail(404, "not_found", "That session is not here.");
    return ok<C.AdminSessionDetail>({ session: adminSess(s, x), roster: roster(s, x).sort((a, b) => a.name.localeCompare(b.name)), open: x.date === today && x.status !== "cancelled", opensAt: iso(x.date, addMin(x.start, -30)), closesAt: iso(x.date, addMin(x.end, 60)) });
  }
  if ((m = is("GET", "/admin/clinic/sessions/:id/code"))) {
    const x = findS(m[0]!);
    if (!x) return fail(404, "not_found", "That session is not here.");
    const open = x.date === today && x.status !== "cancelled";
    const w = windowNow();
    const c = code(s, x.id, w);
    return ok<C.ShowCode>({ qr: `vibha:att:${x.id}:${c}`, code: c, windowEndsAt: new Date((w + 1) * 30_000).toISOString(), periodSeconds: 30, serverNow: new Date(now()).toISOString(), open });
  }
  if ((m = is("POST", "/admin/clinic/sessions/:id/mark"))) {
    const x = findS(m[0]!);
    const p = s.students.find((y) => y.id === body.studentId);
    if (!x || !p) return fail(404, "not_found", "That student or session is not here.");
    const note = String(body.note ?? "").trim();
    if (note.length < 2) return fail(400, "bad_request", "Write a short note (for example: phone dead).");
    const key = sk(x.id, p.id);
    const at = new Date(Math.min(now(), Date.parse(iso(x.date, x.end)))).toISOString();
    if (body.state === "missing") delete s.scans[key];
    else if (body.state === "out") s.scans[key] = { inAt: s.scans[key]?.inAt ?? iso(x.date, x.start), outAt: at, manual: true, note };
    else s.scans[key] = { inAt: s.scans[key]?.inAt ?? (x.date === today ? new Date(now()).toISOString() : iso(x.date, x.start)), outAt: s.scans[key]?.outAt ?? null, manual: true, note };
    return ok({ saved: true });
  }
  if (is("POST", "/admin/clinic/sessions")) {
    const b = body as Partial<C.OneOffBody>;
    if (!b.date || !b.start || !b.end || !b.kind) return fail(400, "bad_request", "Give the date, start, end and kind.");
    if (minutesOf(b.end) <= minutesOf(b.start)) return fail(400, "bad_request", "The end must be after the start.");
    const x: Sess = { id: `one-${s.seq++}`, date: b.date, start: b.start, end: b.end, kind: b.kind, title: b.title ?? "", place: b.place ?? null, link: b.link ?? null, compulsory: b.compulsory ?? true, status: "scheduled", note: b.note ?? null, cohortIds: b.cohortIds?.length ? b.cohortIds : ["c2"], oneOff: true, slotId: null };
    s.sessions.push(x);
    return ok({ session: adminSess(s, x), notified: expected(s, x).length });
  }
  if ((m = is("PATCH", "/admin/clinic/sessions/:id"))) {
    const x = findS(m[0]!);
    const b = body as Partial<C.MoveSessionBody>;
    if (!x) return fail(404, "not_found", "That session is not here.");
    if (!b.date || !b.start || !b.end || minutesOf(b.end) <= minutesOf(b.start)) return fail(400, "bad_request", "Give a date and an end after the start.");
    Object.assign(x, { date: b.date, start: b.start, end: b.end, note: b.note ?? x.note, status: "moved" });
    return ok({ session: adminSess(s, x), notified: expected(s, x).length });
  }
  if ((m = is("POST", "/admin/clinic/sessions/:id/cancel"))) {
    const x = findS(m[0]!);
    if (!x) return fail(404, "not_found", "That session is not here.");
    Object.assign(x, { status: "cancelled", note: (body.note as string) || x.note });
    return ok({ session: adminSess(s, x), notified: expected(s, x).length });
  }
  if ((m = is("PUT", "/admin/clinic/days/:date/note"))) {
    const note = String(body.note ?? "").trim().slice(0, 200);
    if (note) s.notes[m[0]!] = note;
    else delete s.notes[m[0]!];
    return ok({ note: note || null });
  }
  if (is("GET", "/admin/clinic/leaves")) {
    const items = s.leaves
      .filter((l) => (query.status === "all" ? true : l.status === "pending"))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((l) => {
        const p = s.students.find((y) => y.id === l.studentId)!;
        const row = studentRow(s, p);
        return { ...l, name: p.name, cohort: row.cohort, left: row.leavesLeft, allowance: p.leaveAllowance };
      });
    return ok<C.AdminLeaves>({ items });
  }
  if ((m = is("POST", "/admin/clinic/leaves/:id/decide"))) {
    const l = s.leaves.find((x) => x.id === m![0]);
    if (!l) return fail(404, "not_found", "That request is not here.");
    if (l.status !== "pending") return fail(409, "bad_request", "This request was already decided.");
    l.status = body.decision === "approve" ? "approved" : "rejected";
    l.adminNote = typeof body.note === "string" && body.note.trim() ? body.note.trim() : null;
    l.decidedAt = new Date(now()).toISOString();
    return ok({ request: l });
  }
  if (is("GET", "/admin/clinic/students")) return ok<C.ClinicStudents>({ cohorts: [C2, C1], items: s.students.map((p) => studentRow(s, p)) });
  if (is("POST", "/admin/clinic/allowances")) {
    const b = body as Partial<C.BulkAllowanceBody>;
    const who2 = s.students.filter((p) => (b.studentIds?.length ? b.studentIds.includes(p.id) : b.cohortId ? p.cohortId === b.cohortId : false));
    if (!who2.length) return fail(400, "bad_request", "Pick a cohort or some students.");
    if (b.leaves === undefined && b.opdTotal === undefined) return fail(400, "bad_request", "Give leaves or cases.");
    for (const p of who2) {
      if (b.leaves !== undefined) p.leaveAllowance = Math.max(0, Math.round(b.leaves));
      if (b.opdTotal !== undefined) p.opdTotal = Math.max(0, Math.round(b.opdTotal)) + p.extras;
    }
    return ok<C.BulkAllowanceResult>({ updated: who2.length });
  }
  if ((m = is("PATCH", "/admin/clinic/students/:id"))) {
    const p = s.students.find((y) => y.id === m![0]);
    if (!p) return fail(404, "not_found", "That student is not here.");
    const b = body as Partial<C.StudentClinicBody>;
    if (!String(b.note ?? "").trim()) return fail(400, "bad_request", "Write a short note for the change.");
    if (b.leaveAllowance !== undefined) p.leaveAllowance = Math.max(0, Math.round(b.leaveAllowance));
    if (b.opdTotal !== undefined) p.opdTotal = Math.max(0, Math.round(b.opdTotal));
    if (b.batch) {
      p.batch = b.batch;
      p.batchLocked = true;
    }
    return ok({ student: studentRow(s, p) });
  }
  if ((m = is("POST", "/admin/clinic/students/:id/extra-cases"))) {
    const p = s.students.find((y) => y.id === m![0]);
    const n = Number(body.cases);
    if (!p) return fail(404, "not_found", "That student is not here.");
    if (!Number.isInteger(n) || n < 1 || n > 50) return fail(400, "bad_request", "Add 1 to 50 cases.");
    if (!String(body.note ?? "").trim()) return fail(400, "bad_request", "Write a note (for example: paid 12 Nov).");
    p.extras += n;
    p.opdTotal += n;
    return ok({ student: studentRow(s, p) });
  }
  if (is("POST", "/admin/clinic/logs/remind")) {
    const ids = Array.isArray(body.studentIds) ? (body.studentIds as string[]) : [];
    return ok<C.RemindResult>({ sent: s.students.filter((p) => ids.includes(p.id) && studentRow(s, p).unsubmitted > 0).length });
  }
  if (is("GET", "/admin/clinic/timetable")) {
    const upcoming = sortT(s.sessions.filter((x) => x.date >= today && x.date <= addDays(today, 13))).map((x) => adminSess(s, x));
    return ok<C.Timetable>({ cohorts: [C2, C1], slots: [...s.slots].sort((a, b) => C.WEEKDAYS.indexOf(a.weekday) - C.WEEKDAYS.indexOf(b.weekday) || minutesOf(a.start) - minutesOf(b.start)), upcoming });
  }
  const slotFrom = (b: Partial<C.SlotBody>): C.SlotBody | string => {
    if (!b.weekday || !b.kind || !b.start || !b.end) return "Give the day, kind, start and end.";
    if (minutesOf(b.end) <= minutesOf(b.start)) return "The end must be after the start.";
    return { weekday: b.weekday, kind: b.kind, title: b.title ?? "", start: b.start, end: b.end, place: b.place ?? null, link: b.link ?? null, cohortIds: b.cohortIds?.length ? b.cohortIds : ["c2"], compulsory: b.compulsory ?? !isOpd(b.kind) };
  };
  const rebuild = () => {
    const keep = s.sessions.filter((x) => x.oneOff || x.date < today || x.status !== "scheduled");
    const made = sessionsFromSlots(s.slots, today).filter((x) => x.date >= today && !keep.some((k) => k.id === x.id));
    s.sessions = [...keep.filter((x) => x.oneOff || x.date < today || s.slots.some((sl) => sl.id === x.slotId)), ...made];
  };
  if (is("POST", "/admin/clinic/slots")) {
    const v = slotFrom(body as Partial<C.SlotBody>);
    if (typeof v === "string") return fail(400, "bad_request", v);
    const sl: C.Slot = { id: `sl${100 + s.seq++}`, ...v };
    s.slots.push(sl);
    rebuild();
    return ok({ slot: sl });
  }
  if ((m = is("PATCH", "/admin/clinic/slots/:id"))) {
    const i = s.slots.findIndex((x) => x.id === m![0]);
    if (i < 0) return fail(404, "not_found", "That slot is not here.");
    const v = slotFrom({ ...s.slots[i]!, ...(body as Partial<C.SlotBody>) });
    if (typeof v === "string") return fail(400, "bad_request", v);
    s.slots[i] = { id: s.slots[i]!.id, ...v };
    s.sessions = s.sessions.filter((x) => !(x.slotId === m![0] && x.date >= today && x.status === "scheduled"));
    rebuild();
    return ok({ slot: s.slots[i] });
  }
  if ((m = is("DELETE", "/admin/clinic/slots/:id"))) {
    s.slots = s.slots.filter((x) => x.id !== m![0]);
    s.sessions = s.sessions.filter((x) => !(x.slotId === m![0] && x.date >= today && x.status === "scheduled"));
    return ok({ removed: true });
  }
  if (is("GET", "/admin/clinic/opd")) return ok<C.OpdAdmin>({ settings: s.settings, plan: planOut(s, s.draft ?? s.published, s.draft ? "draft" : s.publishedAt ? "published" : "none"), students: s.students.filter((p) => p.batch).length });
  if (is("PUT", "/admin/clinic/opd/settings")) {
    const b = body as Partial<C.OpdSettings>;
    if (!b.from || !b.to || b.to < b.from) return fail(400, "bad_request", "The last day must be after the first.");
    const per = Number(b.casesPerVisit);
    if (!Number.isInteger(per) || per < 1 || per > 10) return fail(400, "bad_request", "Cases per visit is 1 to 10.");
    s.settings = { from: b.from, to: b.to, casesPerVisit: per, seats: (b.seats as C.OpdSettings["seats"]) ?? s.settings.seats, times: (b.times as C.OpdSettings["times"]) ?? s.settings.times };
    return ok({ settings: s.settings });
  }
  if (is("POST", "/admin/clinic/opd/generate")) {
    // Days already published up to two days ahead stay; the rest is filled again.
    const keepTo = addDays(today, 1);
    const fixed: Plan = Object.fromEntries(Object.entries(s.published).filter(([d]) => d <= keepTo));
    s.draft = generate(s, addDays(today, 2), fixed, false);
    s.generatedAt = new Date(now()).toISOString();
    return ok<C.GenerateResult>({ plan: planOut(s, s.draft, "draft") });
  }
  if (is("POST", "/admin/clinic/opd/move")) {
    const b = body as Partial<C.MoveSeatBody>;
    const p = (s.draft ??= JSON.parse(JSON.stringify(s.published)) as Plan);
    if (!b.studentId || !b.fromDate || !b.toDate || (b.batch !== "morning" && b.batch !== "evening")) return fail(400, "bad_request", "Pick the student and the new day.");
    if (b.toDate < today) return fail(400, "bad_request", "Pick a day from today on.");
    const from = p[b.fromDate];
    if (!from || !(from.morning.includes(b.studentId) || from.evening.includes(b.studentId))) return fail(404, "not_found", "That student is not on that day.");
    const to = (p[b.toDate] ??= { morning: [], evening: [] });
    if (to.morning.includes(b.studentId) || to.evening.includes(b.studentId)) return fail(409, "bad_request", "Already on that day.");
    if (to[b.batch].length >= s.settings.seats[weekdayOf(b.toDate)][b.batch]) return fail(409, "bad_request", "That day has no seat left.");
    from.morning = from.morning.filter((x) => x !== b.studentId);
    from.evening = from.evening.filter((x) => x !== b.studentId);
    to[b.batch].push(b.studentId);
    return ok<C.GenerateResult>({ plan: planOut(s, p, "draft") });
  }
  if (is("POST", "/admin/clinic/opd/publish")) {
    if (!s.draft) return fail(409, "bad_request", "Generate a draft first.");
    s.published = s.draft;
    s.draft = null;
    s.publishedAt = new Date(now()).toISOString();
    const n = s.students.filter((p) => Object.entries(s.published).some(([d, day]) => d >= today && (day.morning.includes(p.id) || day.evening.includes(p.id)))).length;
    return ok<C.PublishResult>({ plan: planOut(s, s.published, "published"), notified: n });
  }
  return fail(404, "not_found", "That could not be found.");
}
