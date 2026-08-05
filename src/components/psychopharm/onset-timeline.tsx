"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Onset + half-life panel. Student view shows a compact phase timeline with
 * only the phases the source supports; clinician view shows the verbatim
 * source text with citation. Band-specific onset overrides the drug-level one.
 * No data → one honest line.
 */
export function OnsetTimeline({
  onsetTime,
  onsetKb,
  onsetKbPage,
  halfLife,
  halfLifePage,
  bandOnset,
  register,
  sourceTitle,
}: {
  onsetTime?: { value: string; source_id: string; page_ref: string };
  onsetKb?: string;
  onsetKbPage?: string;
  halfLife?: string;
  halfLifePage?: string;
  bandOnset?: { value: string; page_ref?: string };
  register: "student" | "clinician";
  sourceTitle: string;
}) {
  const studentText = bandOnset?.value ?? onsetTime?.value;
  const studentPage = bandOnset?.page_ref ?? onsetTime?.page_ref;

  // Phases the sources actually name, in order; only those whose text the
  // source supports are drawn filled.
  const phases = [
    { label: "First days", text: ["early", "first day", "first days", "immediate", "hours", "minutes", "within 1 week", "within a week"] },
    { label: "2–4 weeks", text: ["2–4 weeks", "2 to 4 weeks", "two to four weeks"] },
    { label: "6–8 weeks", text: ["6–8 weeks", "6 to 8 weeks", "four to six", "4–6 weeks", "4 to 6 weeks"] },
    { label: "Months", text: ["months", "6 months", "up to 6 months"] },
  ];

  const reached = phases.filter((p) => {
    const hay = `${studentText ?? ""} ${onsetKb ?? ""}`.toLowerCase();
    return p.text.some((t) => hay.includes(t));
  });

  return (
    <section className="space-y-3">
      <h2 className="text-h2">When it starts working</h2>

      {!studentText && !onsetKb && !bandOnset ? (
        <p className="text-small text-muted-foreground">
          Our sources don&apos;t describe an onset timeline for this medication.
        </p>
      ) : null}

      {studentText ? (
        <div className="space-y-2">
          <p className="text-small">{studentText}</p>

          {/* Compact phase timeline — only phases the source names. */}
          {reached.length ? (
            <div className="flex items-center gap-1" role="img" aria-label={`Onset timeline: ${reached.map(p => p.label).join(", ")}`}>
              {phases.map((p, i) => {
                const active = reached.includes(p);
                return (
                  <div key={p.label} className="flex flex-1 items-center gap-1">
                    <div
                      className={cn(
                        "h-2 flex-1 rounded-full",
                        active ? "bg-primary" : "bg-muted-foreground/30",
                      )}
                    />
                    {i < phases.length - 1 ? null : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {studentPage ? (
            <p className="text-caption text-muted-foreground">Source: {sourceTitle} · {studentPage}</p>
          ) : null}
        </div>
      ) : null}

      {register === "clinician" && onsetKb ? (
        <div className="rounded-md border-2 border-dashed border-border p-3 text-caption text-muted-foreground">
          <p className="italic">{onsetKb.slice(0, 300)}…</p>
          <p>{sourceTitle} · p{onsetKbPage}</p>
        </div>
      ) : null}

      {halfLife ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">How long it stays</p>
          <p className="text-small">{halfLife.slice(0, 240)}</p>
          {halfLifePage ? (
            <p className="text-caption text-muted-foreground">{sourceTitle} · p{halfLifePage}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}