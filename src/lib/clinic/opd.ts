import type { ClinicBatch, ClinicSeats } from "@/lib/app-api/contract";
import { CLINIC_BATCHES } from "./types";
import { addDays, dateRange, daysBetween, weekday } from "./time";

/**
 * The OPD timetable generator. Pure: no database, no clock (today is passed in).
 *
 * Each student needs ceil(pending cases / cases per visit) more visits, all in
 * their own batch. Published visits from today on are kept ("Generate again"
 * only fills the gaps). New visits are spread evenly over each student's
 * remaining days and across the seats of each day. When seats run out, the
 * students left short are listed.
 */

export type GenDay = { date: string; batch: ClinicBatch; seats: number };

export type GenStudent = {
  userId: string;
  batch: ClinicBatch | null;
  /** Cases still to do, not counting visits already planned from today on. */
  pendingCases: number;
  /** No visit before this date (a student who joined late). */
  joinedOn?: string | null;
  /** Approved leave days: never a visit on these. */
  blockedDates?: readonly string[];
};

export type GenVisit = { id?: string; userId: string; date: string; batch: ClinicBatch };

export type GenInput = {
  today: string;
  casesPerVisit: number;
  /** Published visits closer than this many days are never dropped for surplus or a batch change. */
  freezeDays: number;
  /** Open OPD days (from opdDays). */
  days: readonly GenDay[];
  /** Days with no OPD at all (holidays) and "date|batch" keys whose OPD session is cancelled. */
  closed?: readonly string[];
  students: readonly GenStudent[];
  /** Published visits (any date; only today on is used). */
  published: readonly GenVisit[];
};

export type GenEntry = GenVisit & { source: "kept" | "new" };
export type GenDrop = GenVisit & { reason: "closed" | "leave" | "surplus" | "batch" | "no_seats" | "duplicate" };

export type GenResult = {
  entries: GenEntry[];
  dropped: GenDrop[];
  /** Visits that would not fit. */
  short: { userId: string; visits: number }[];
  /** Students with no batch (left out). */
  noBatch: string[];
  /** "date|batch" keys holding more people than seats (kept visits after seats were lowered). */
  overfull: string[];
};

const key = (date: string, batch: ClinicBatch) => `${date}|${batch}`;

/**
 * The open OPD days from settings: every date in the range (from `from` on)
 * whose weekday has seats for a batch, minus holidays and cancelled OPD
 * sessions ("date|batch" keys).
 */
export function opdDays(input: { seats: ClinicSeats; startDate: string | null; endDate: string | null; holidays: readonly string[]; cancelled?: readonly string[]; from: string }): GenDay[] {
  if (!input.startDate || !input.endDate) return [];
  const start = input.startDate > input.from ? input.startDate : input.from;
  if (start > input.endDate || daysBetween(start, input.endDate) > 800) return [];
  const holidays = new Set(input.holidays);
  const cancelled = new Set(input.cancelled ?? []);
  const out: GenDay[] = [];
  for (const date of dateRange(start, input.endDate)) {
    if (holidays.has(date)) continue;
    const row = input.seats[String(weekday(date))] ?? {};
    for (const batch of CLINIC_BATCHES) {
      const seats = Math.max(0, Math.floor(Number(row[batch] ?? 0)) || 0);
      if (seats > 0 && !cancelled.has(key(date, batch))) out.push({ date, batch, seats });
    }
  }
  return out;
}

export function visitsNeeded(pendingCases: number, casesPerVisit: number): number {
  const cpv = Math.max(1, Math.floor(casesPerVisit));
  return pendingCases > 0 ? Math.ceil(pendingCases / cpv) : 0;
}

export function generatePlan(input: GenInput): GenResult {
  const { today } = input;
  const freezeEnd = addDays(today, Math.max(0, input.freezeDays));
  const closed = new Set(input.closed ?? []);
  const isClosed = (v: { date: string; batch: ClinicBatch }) => closed.has(v.date) || closed.has(key(v.date, v.batch));
  const open = new Map<string, GenDay>();
  for (const d of input.days) if (d.date >= today) open.set(key(d.date, d.batch), d);
  const seatsLeft = new Map<string, number>();
  for (const [k, d] of open) seatsLeft.set(k, d.seats);

  const entries: GenEntry[] = [];
  const dropped: GenDrop[] = [];
  const short: { userId: string; visits: number }[] = [];
  const noBatch: string[] = [];
  const taken = new Map<string, Set<string>>(); // userId -> dates

  const students = [...input.students].sort((a, b) => a.userId.localeCompare(b.userId));
  const byUser = new Map<string, GenVisit[]>();
  for (const v of input.published) {
    if (v.date < today) continue;
    const list = byUser.get(v.userId) ?? [];
    list.push(v);
    byUser.set(v.userId, list);
  }
  const known = new Set(students.map((s) => s.userId));

  // Published visits of people no longer in the list stay as they are (the admin removes them by hand).
  for (const [userId, list] of byUser) {
    if (known.has(userId)) continue;
    for (const v of list) {
      entries.push({ ...v, source: "kept" });
      seatsLeft.set(key(v.date, v.batch), (seatsLeft.get(key(v.date, v.batch)) ?? 0) - 1);
    }
  }

  type Need = { userId: string; count: number; avail: GenDay[] };
  const needs: Need[] = [];

  for (const s of students) {
    const mine = [...(byUser.get(s.userId) ?? [])].sort((a, b) => a.date.localeCompare(b.date));
    const blocked = new Set(s.blockedDates ?? []);
    const dates = new Set<string>();
    taken.set(s.userId, dates);
    const keep: GenVisit[] = [];
    for (const v of mine) {
      const frozen = v.date < freezeEnd;
      if (dates.has(v.date)) dropped.push({ ...v, reason: "duplicate" });
      else if (isClosed(v)) dropped.push({ ...v, reason: "closed" });
      else if (blocked.has(v.date)) dropped.push({ ...v, reason: "leave" });
      else if (!frozen && s.batch && v.batch !== s.batch) dropped.push({ ...v, reason: "batch" });
      else if (!frozen && !open.has(key(v.date, v.batch))) dropped.push({ ...v, reason: "no_seats" });
      else {
        keep.push(v);
        dates.add(v.date);
      }
    }
    const need = s.batch ? visitsNeeded(s.pendingCases, input.casesPerVisit) : keep.length;
    // Too many planned: drop the latest ones outside the frozen days.
    let surplus = keep.length - need;
    for (let i = keep.length - 1; i >= 0 && surplus > 0; i--) {
      const v = keep[i]!;
      if (v.date < freezeEnd) continue;
      dropped.push({ ...v, reason: "surplus" });
      dates.delete(v.date);
      keep.splice(i, 1);
      surplus--;
    }
    for (const v of keep) {
      entries.push({ ...v, source: "kept" });
      const k = key(v.date, v.batch);
      seatsLeft.set(k, (seatsLeft.get(k) ?? 0) - 1);
    }
    if (!s.batch) {
      noBatch.push(s.userId);
      continue;
    }
    const want = need - keep.length;
    if (want <= 0) continue;
    const from = s.joinedOn && s.joinedOn > today ? s.joinedOn : today;
    const avail = input.days
      .filter((d) => d.batch === s.batch && d.date >= from && !blocked.has(d.date) && !dates.has(d.date) && open.has(key(d.date, d.batch)))
      .sort((a, b) => a.date.localeCompare(b.date));
    needs.push({ userId: s.userId, count: want, avail });
  }

  // One request per visit wanted, with an ideal day spread evenly over the
  // student's own days. Each student's spread is shifted a little (phase) so
  // people with the same need do not all aim at the same days.
  type Req = { userId: string; frac: number; ideal: number; avail: GenDay[]; scarcity: number };
  const reqs: Req[] = [];
  const perBatch = new Map<string, number>();
  for (const n of needs) {
    const b = n.avail[0]?.batch ?? "morning";
    const ordinal = perBatch.get(b) ?? 0;
    perBatch.set(b, ordinal + 1);
    const count = Math.min(n.count, n.avail.length);
    if (n.count > count) short.push({ userId: n.userId, visits: n.count - count });
    if (!count) continue;
    const total = needs.filter((x) => (x.avail[0]?.batch ?? "morning") === b).length || 1;
    const phase = (ordinal + 0.5) / total;
    for (let i = 0; i < count; i++) {
      const pos = ((i + phase) * n.avail.length) / count;
      reqs.push({ userId: n.userId, frac: (i + 0.5) / count, ideal: Math.min(n.avail.length - 1, Math.floor(pos)), avail: n.avail, scarcity: n.avail.length / count });
    }
  }
  // First visits for everyone before second visits (fair when seats run short), then by scarcity and ideal day.
  reqs.sort((a, b) => a.frac - b.frac || a.scarcity - b.scarcity || a.avail[a.ideal]!.date.localeCompare(b.avail[b.ideal]!.date) || a.userId.localeCompare(b.userId));

  const shortBy = new Map(short.map((s) => [s.userId, s.visits]));
  for (const r of reqs) {
    const dates = taken.get(r.userId)!;
    let pick: GenDay | null = null;
    for (let off = 0; off < r.avail.length && !pick; off++) {
      const cands: GenDay[] = [];
      for (const i of off === 0 ? [r.ideal] : [r.ideal - off, r.ideal + off]) {
        const d = r.avail[i];
        if (!d || dates.has(d.date) || (seatsLeft.get(key(d.date, d.batch)) ?? 0) <= 0) continue;
        cands.push(d);
      }
      // Equal distance: the day with more free seats; then the earlier one.
      cands.sort((a, b) => (seatsLeft.get(key(b.date, b.batch)) ?? 0) - (seatsLeft.get(key(a.date, a.batch)) ?? 0) || a.date.localeCompare(b.date));
      pick = cands[0] ?? null;
    }
    if (!pick) {
      shortBy.set(r.userId, (shortBy.get(r.userId) ?? 0) + 1);
      continue;
    }
    dates.add(pick.date);
    const k = key(pick.date, pick.batch);
    seatsLeft.set(k, (seatsLeft.get(k) ?? 0) - 1);
    entries.push({ userId: r.userId, date: pick.date, batch: pick.batch, source: "new" });
  }

  const overfull = [...seatsLeft].filter(([, n]) => n < 0).map(([k]) => k).sort();
  entries.sort((a, b) => a.date.localeCompare(b.date) || a.batch.localeCompare(b.batch) || a.userId.localeCompare(b.userId));
  return {
    entries,
    dropped,
    short: [...shortBy].map(([userId, visits]) => ({ userId, visits })).sort((a, b) => a.userId.localeCompare(b.userId)),
    noBatch,
    overfull,
  };
}

/** Seats taken on a day and batch in a plan. */
export function seatsUsed(plan: readonly { date: string; batch: ClinicBatch }[], date: string, batch: ClinicBatch, exceptId?: string): number {
  return plan.filter((v) => v.date === date && v.batch === batch && (exceptId === undefined || (v as { id?: string }).id !== exceptId)).length;
}

/** The seats a day and batch has under the settings (0 = no OPD). */
export function seatsOn(seats: ClinicSeats, date: string, batch: ClinicBatch): number {
  return Math.max(0, Math.floor(Number(seats[String(weekday(date))]?.[batch] ?? 0)) || 0);
}
