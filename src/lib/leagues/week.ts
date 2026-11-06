import { addDays } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";

/**
 * League calendar. A league week starts Monday 00:00 IST and is named by
 * that Monday's date (YYYY-MM-DD). Pure apart from the optional `now`.
 */

/** 0 = Monday … 6 = Sunday for an IST day string. */
export function weekdayIndex(day: string): number {
  return (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** The Monday (IST) of the week containing `day`. */
export function weekOf(day: string): string {
  return addDays(day, -weekdayIndex(day));
}

/** This league week's Monday, for a moment in time. */
export function leagueWeek(now: Date = new Date()): string {
  return weekOf(istToday(now));
}

export function previousWeek(week: string): string {
  return addDays(week, -7);
}

/** First day of the month containing `day` (YYYY-MM-01). */
export function monthOf(day: string): string {
  return `${day.slice(0, 7)}-01`;
}

/** First day of the next month. */
export function nextMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
}

export function previousMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return m === 1 ? `${y - 1}-12-01` : `${y}-${String(m - 1).padStart(2, "0")}-01`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** "Nov 2026" for 2026-11-01. */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** UTC instant of 00:00 IST on `day` (IST is UTC+05:30). */
export function istMidnightUtc(day: string): Date {
  return new Date(`${day}T00:00:00+05:30`);
}

/** Days left until the next reset, counting today ("3 days left"). */
export function daysLeftInWeek(today: string): number {
  return 7 - weekdayIndex(today);
}
