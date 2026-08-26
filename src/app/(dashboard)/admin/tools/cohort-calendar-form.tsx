"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Builds the cohort session schedule as a calendar file. A plain form instead
 * of hand-editing a URL — the admin enters the start date, time, days and
 * weeks, and downloads the generated .ics. The download is a real link whose
 * href is computed from the form state, so it stays current as fields change.
 *
 * Weekdays follow the calendar lib convention: 0 = Sunday … 6 = Saturday.
 */
export function CohortCalendarForm() {
  const [startDate, setStartDate] = React.useState("2026-08-20");
  const [startTime, setStartTime] = React.useState("09:00");
  const [weekdays, setWeekdays] = React.useState("6,0");
  const [weeks, setWeeks] = React.useState("12");
  const [title, setTitle] = React.useState("Cohort One");

  const params = new URLSearchParams({
    startDate,
    startTime,
    weekdays: weekdays
      .split(",")
      .map((d) => d.trim())
      .filter((d) => /^[0-6]$/.test(d))
      .join(","),
    weeks: String(Math.max(1, Math.min(52, Number(weeks) || 1))),
    title,
  });
  const downloadHref = `/api/cohort-calendar?${params.toString()}`;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="cc-start">Start date</Label>
          <Input id="cc-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cc-time">Start time</Label>
          <Input id="cc-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cc-days">Days of the week</Label>
          <Input id="cc-days" value={weekdays} onChange={(e) => setWeekdays(e.target.value)} placeholder="6,0" />
          <p className="text-caption text-muted-foreground">0 = Sunday … 6 = Saturday, comma-separated.</p>
        </div>
        <div className="space-y-1">
          <Label htmlFor="cc-weeks">Number of weeks</Label>
          <Input id="cc-weeks" type="number" min={1} max={52} value={weeks} onChange={(e) => setWeeks(e.target.value)} />
        </div>
        <div className="col-span-2 space-y-1">
          <Label htmlFor="cc-title">Schedule name</Label>
          <Input id="cc-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>
      <Button asChild>
        <a href={downloadHref} download>
          Download calendar file
        </a>
      </Button>
    </div>
  );
}
