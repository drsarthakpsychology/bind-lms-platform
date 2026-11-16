/**
 * Clinic time: dates and times are clinic local time (India, UTC+05:30, no
 * daylight saving), so plain fixed-offset arithmetic is exact.
 */
export const CLINIC_OFFSET_MIN = 330;
const OFFSET_MS = CLINIC_OFFSET_MIN * 60_000;
const DAY_MS = 86_400_000;

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

/** "2026-11-16" for an instant, in clinic local time. */
export function localDate(at: Date | number): string {
  return new Date(+at + OFFSET_MS).toISOString().slice(0, 10);
}

/** "08:05" for an instant, in clinic local time. */
export function localTime(at: Date | number): string {
  return new Date(+at + OFFSET_MS).toISOString().slice(11, 16);
}

/** "08:00:00" or "08:00" to "08:00". */
export function hhmm(t: string): string {
  return t.slice(0, 5);
}

/** The instant of a local date and time. */
export function instant(date: string, time: string): number {
  const [h, m] = hhmm(time).split(":").map(Number);
  return Date.parse(`${date}T00:00:00Z`) + ((h ?? 0) * 60 + (m ?? 0)) * 60_000 - OFFSET_MS;
}

export function isDate(s: unknown): s is string {
  return typeof s === "string" && DATE_RE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s);
}

/** 0 Sunday .. 6 Saturday. */
export function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function addDays(date: string, n: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
}

/** The Monday on or before a date. */
export function mondayOf(date: string): string {
  return addDays(date, -((weekday(date) + 6) % 7));
}

/** Every date from `from` to `to`, both included. */
export function dateRange(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}
