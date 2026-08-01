import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { buildSchedule, toIcs, type CohortScheduleInput } from "@/lib/calendar";

/**
 * GET /api/cohort-calendar?startDate=2026-08-20&startTime=09:00&weekdays=6,0&weeks=12&title=...
 *
 * Generates the cohort session schedule as an .ics file. Admin-only.
 */
export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate") ?? "";
  const startTime = url.searchParams.get("startTime") ?? "09:00";
  const weeks = Number(url.searchParams.get("weeks") ?? 12);
  const title = url.searchParams.get("title") ?? "Cohort Session";
  const weekdays = (url.searchParams.get("weekdays") ?? "6")
    .split(",")
    .map((n) => Number(n))
    .filter((n) => n >= 0 && n <= 6);

  if (!startDate || weeks < 1 || weekdays.length === 0) {
    return NextResponse.json({ error: "startDate, weeks, weekdays required." }, { status: 400 });
  }

  const input: CohortScheduleInput = { startDate, startTime, weekdays, weeks, title, durationMinutes: 90 };
  const sessions = buildSchedule(input);
  if (sessions.length === 0) {
    return NextResponse.json({ error: "No sessions generated — check dates." }, { status: 400 });
  }

  const ics = toIcs(sessions, title);
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="cohort-calendar.ics"`,
    },
  });
}
