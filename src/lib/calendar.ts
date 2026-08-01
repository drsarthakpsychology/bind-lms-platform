/**
 * Cohort calendar generator — builds the session schedule from a start date
 * and a weekly pattern, and exports it as an .ics file.
 *
 * A cohort runs N weeks; each week has sessions on given weekdays at a given
 * time. Instead of entering 48 dates by hand, an admin sets the start date,
 * the weekday(s), the time, and the number of weeks.
 */

export interface CohortScheduleInput {
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h, local)
  weekdays: number[]; // 0=Sun .. 6=Sat
  weeks: number; // number of weeks
  title: string;
  durationMinutes: number; // default 90
}

export interface Session {
  start: Date;
  end: Date;
  summary: string;
}

export function buildSchedule(input: CohortScheduleInput): Session[] {
  const sessions: Session[] = [];
  const start = new Date(`${input.startDate}T${input.startTime}:00`);
  if (Number.isNaN(start.getTime()) || input.weeks < 1) return sessions;

  for (let w = 0; w < input.weeks; w++) {
    for (const day of input.weekdays) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7 + ((day - start.getDay() + 7) % 7));
      // Only include dates >= the start date.
      if (d < start) continue;
      const end = new Date(d.getTime() + input.durationMinutes * 60_000);
      sessions.push({
        start: d,
        end,
        summary: `${input.title} — Week ${w + 1}`,
      });
    }
  }
  return sessions;
}

/** Render sessions as an .ics calendar file. */
export function toIcs(sessions: Session[], calendarName: string): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PLMS//Cohort Calendar//EN",
    `X-WR-CALNAME:${calendarName}`,
    ...sessions.flatMap((s) => [
      "BEGIN:VEVENT",
      `UID:${s.start.getTime()}@plms`,
      `DTSTART:${fmt(s.start)}`,
      `DTEND:${fmt(s.end)}`,
      `SUMMARY:${s.summary}`,
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
