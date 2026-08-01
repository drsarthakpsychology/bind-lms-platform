import { describe, it, expect } from "vitest";
import { buildSchedule, toIcs } from "./calendar";

describe("buildSchedule", () => {
  it("generates weekly sessions on the given weekdays", () => {
    // Start Thursday 2026-08-20; sessions on Saturday(6) + Sunday(0) for 2 weeks.
    const sessions = buildSchedule({
      startDate: "2026-08-20",
      startTime: "09:00",
      weekdays: [6, 0],
      weeks: 2,
      title: "Cohort",
      durationMinutes: 90,
    });
    // Week 1: Sat 22nd, Sun 23rd. Week 2: Sat 29th, Sun 30th → 4 sessions.
    expect(sessions.length).toBe(4);
    expect(sessions[0].start.getDay()).toBe(6);
    expect(sessions[1].start.getDay()).toBe(0);
    // Durations are 90 minutes.
    expect(sessions[0].end.getTime() - sessions[0].start.getTime()).toBe(90 * 60_000);
  });

  it("handles a start date that is already a session day", () => {
    // Start on Saturday; only the Saturday of week 1 onward counts.
    const sessions = buildSchedule({
      startDate: "2026-08-22",
      startTime: "10:00",
      weekdays: [6],
      weeks: 1,
      title: "C",
      durationMinutes: 60,
    });
    expect(sessions.length).toBe(1);
    expect(sessions[0].start.getDay()).toBe(6);
  });
});

describe("toIcs", () => {
  it("produces a valid VCALENDAR with VEVENTs", () => {
    const sessions = buildSchedule({
      startDate: "2026-08-20",
      startTime: "09:00",
      weekdays: [6],
      weeks: 1,
      title: "Cohort",
      durationMinutes: 60,
    });
    const ics = toIcs(sessions, "Cohort");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART");
  });
});
