"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { WeakSpot } from "@/lib/practice/weak-spots";

/**
 * Weak-spots view — the student's ranked gaps across sim debriefs, each with
 * a concrete next practice target.
 */
export function WeakSpotsView({ spots, sessions }: { spots: WeakSpot[]; sessions: number }) {
  if (sessions === 0) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No sessions scored yet</p>
        <p className="mt-1 text-small text-muted-foreground">
          Run the Consulting Room and finish a debrief — your weak spots surface here.
        </p>
      </div>
    );
  }

  if (spots.length === 0) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-green-600" aria-hidden />
        <p className="mt-2 text-base font-medium">No consistent weak spots</p>
        <p className="mt-1 text-small text-muted-foreground">
          Across {sessions} scored session{sessions === 1 ? "" : "s"}, no skill stands out as missed.
          Keep drilling in the Consulting Room.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
        <AlertTriangle className="size-3.5" aria-hidden />
        Based on {sessions} scored session{sessions === 1 ? "" : "s"}. The severity bar is how often
        each skill was missed — practise the top one first.
      </p>
      {spots.map((s) => (
        <div key={s.key} className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-small font-semibold">{s.label}</p>
            <span className="text-caption text-muted-foreground">
              {s.sessions} session{s.sessions === 1 ? "" : "s"}
            </span>
          </div>
          {/* severity bar */}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.round(s.severity * 100)}%` }}
            />
          </div>
          <Link
            href={s.remedyHref}
            className="mt-3 inline-flex items-center gap-1 text-small font-medium text-primary hover:underline"
          >
            {s.remedyLabel}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      ))}
    </div>
  );
}
