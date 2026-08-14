"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { WeakSpot } from "@/lib/practice/weak-spots";
import { EmptyState } from "@/components/design-system/empty-state";

/**
 * Weak-spots view — the student's ranked gaps across sim debriefs, each with
 * a concrete next practice target.
 */
export function WeakSpotsView({ spots, sessions }: { spots: WeakSpot[]; sessions: number }) {
  if (sessions === 0) {
    return (
      <EmptyState
        compact
        icon={<AlertTriangle className="size-6" aria-hidden />}
        title="No sessions scored yet"
        description="Run the Consulting Room and finish a debrief — your weak spots surface here."
      />
    );
  }

  if (spots.length === 0) {
    return (
      <EmptyState
        compact
        icon={<CheckCircle2 className="size-6" aria-hidden />}
        title="No consistent weak spots"
        description={`Across ${sessions} scored session${sessions === 1 ? "" : "s"}, no skill stands out as missed. Keep drilling in the Consulting Room.`}
      />
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
            <span className="flex items-center gap-2 text-caption text-muted-foreground">
              <span
                className={s.trend === 1 ? "text-green-700" : s.trend === -1 ? "text-red-600" : ""}
                title={s.trend === 1 ? "Improving" : s.trend === -1 ? "Worsening" : "Flat"}
              >
                {s.trend === 1 ? "▲ improving" : s.trend === -1 ? "▼ worsening" : "— flat"}
              </span>
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
            className="mt-3 inline-flex items-center gap-1 text-small font-medium text-link hover:underline"
          >
            {s.remedyLabel}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
          <Link
            href="/practice/rounds"
            className="mt-1 block text-caption text-muted-foreground hover:underline"
          >
            The card that teaches this: {s.teachCard} →
          </Link>
        </div>
      ))}
    </div>
  );
}
