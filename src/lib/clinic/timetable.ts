import type { ClinicBatch, ClinicKind, ClinicSession, ClinicSlot } from "@/lib/app-api/contract";
import { dateRange, hhmm, weekday } from "./time";
import type { SessionRow, SlotRow } from "./types";

/** The OPD batch a session kind belongs to (null for classes). */
export function batchOfKind(kind: ClinicKind): ClinicBatch | null {
  return kind === "opd_morning" ? "morning" : kind === "opd_evening" ? "evening" : null;
}

export function isOpd(kind: ClinicKind): boolean {
  return batchOfKind(kind) !== null;
}

export function toSlot(r: SlotRow): ClinicSlot {
  return {
    id: r.id,
    cohortIds: r.cohort_ids,
    weekday: r.weekday,
    start: hhmm(r.start_time),
    end: hhmm(r.end_time),
    kind: r.kind,
    title: r.title,
    place: r.place,
    onlineLink: r.online_link,
    compulsory: r.compulsory,
    validFrom: r.valid_from,
    validTo: r.valid_to,
    active: r.active,
  };
}

export function toSession(r: SessionRow): ClinicSession {
  return {
    id: r.id,
    cohortIds: r.cohort_ids,
    date: r.date,
    start: hhmm(r.start_time),
    end: hhmm(r.end_time),
    kind: r.kind,
    title: r.title,
    place: r.place,
    onlineLink: r.online_link,
    compulsory: r.compulsory,
    status: r.status,
    origin: r.origin,
    note: r.note,
    movedFrom: r.moved_from,
    batch: batchOfKind(r.kind),
  };
}

export type NewSession = Omit<SessionRow, "id">;

/**
 * The sessions the weekly timetable makes between two dates, leaving out the
 * ones already made (one per slot per day, even if the admin moved or
 * cancelled it since). Only active slots, inside their own valid dates.
 */
export function expandTimetable(slots: readonly SlotRow[], from: string, to: string, existing: readonly { slot_id: string | null; date: string }[]): { sessions: NewSession[]; skipped: number } {
  const made = new Set(existing.filter((e) => e.slot_id).map((e) => `${e.slot_id}|${e.date}`));
  const sessions: NewSession[] = [];
  let skipped = 0;
  for (const date of dateRange(from, to)) {
    const wd = weekday(date);
    for (const s of slots) {
      if (!s.active || s.weekday !== wd) continue;
      if (s.valid_from && date < s.valid_from) continue;
      if (s.valid_to && date > s.valid_to) continue;
      if (made.has(`${s.id}|${date}`)) {
        skipped++;
        continue;
      }
      sessions.push({
        cohort_ids: [...s.cohort_ids],
        slot_id: s.id,
        date,
        start_time: hhmm(s.start_time),
        end_time: hhmm(s.end_time),
        kind: s.kind,
        title: s.title,
        place: s.place,
        online_link: s.online_link,
        compulsory: s.compulsory,
        status: "scheduled",
        origin: "timetable",
        note: null,
        moved_from: null,
      });
    }
  }
  sessions.sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  return { sessions, skipped };
}

/** Sessions sorted by date then start. */
export function bySchedule<T extends { date: string; start: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}
