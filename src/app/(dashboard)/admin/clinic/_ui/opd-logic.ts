import type { ClinicPlan, ClinicSeats } from "@/lib/clinic/types";

/** Pure helpers for the OPD screen (shared by the page on the server and the client parts). */

/** Seats from the grid's text fields: blanks and zeros dropped, so a day with none stays empty. */
export function seatsFrom(grid: Record<string, { morning: string; evening: string }>): ClinicSeats {
  const out: ClinicSeats = {};
  for (const [wd, v] of Object.entries(grid)) {
    const m = Math.max(0, Math.floor(Number(v.morning) || 0));
    const e = Math.max(0, Math.floor(Number(v.evening) || 0));
    if (m || e) out[wd] = { ...(m ? { morning: m } : {}), ...(e ? { evening: e } : {}) };
  }
  return out;
}

/** Holidays typed as dates, one per line or comma: kept only when they are real YYYY-MM-DD dates, sorted, no repeats. */
export function holidaysFrom(text: string): string[] {
  const ok = text
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T12:00:00Z`)));
  return [...new Set(ok)].sort();
}

/** The days to show as calendar rows: only days with seats or people. */
export function planRows(plan: ClinicPlan) {
  return plan.days.filter((d) => d.morning.seats || d.evening.seats || d.morning.people.length || d.evening.people.length);
}

/** A small summary line for the OPD page header. */
export function planSummary(plan: ClinicPlan): string {
  const visits = plan.days.reduce((n, d) => n + d.morning.people.length + d.evening.people.length, 0);
  return visits ? `${visits} visits over ${planRows(plan).length} days` : "";
}
