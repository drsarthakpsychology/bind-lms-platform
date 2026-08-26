"use client";

import * as React from "react";
import Link from "next/link";
import { Stethoscope, ListChecks, Timer, ArrowRight, Zap } from "lucide-react";
import { cardVariants } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";

/**
 * The dashboard's Practice section — a deliberate block, not scattered cards.
 *
 * Three tiers, in the order a busy student actually meets them:
 *   1. The daily habit strip (Judgment Calls + Two-Minute Clinic) — the
 *      retention loop. Opening the app costs nothing.
 *   2. The flagship (Consulting Room) — the main practice event.
 *   3. A single "more" affordance into /practice — the full toolset stays one
 *      click away, not crowding the dashboard.
 */
export function DashboardPracticeSection() {
  return (
    <section aria-label="Practice" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-h2">Practice</h2>
        <Link
          href="/practice"
          className="inline-flex items-center gap-1 text-small font-medium text-link hover:underline"
        >
          All practice tools
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <p className="-mt-2 text-caption text-muted-foreground">
        The more you practise, the more ready you are. Two minutes a day beats two hours on Sunday.
      </p>

      {/* Daily habit strip — the retention loop */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/practice/judgment"
          onClick={() => haptic("tap")}
          className={cn(cardVariants({ variant: "interactive" }), "flex items-center gap-3 p-4")}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link">
            <ListChecks className="size-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-eyebrow text-muted-foreground">Daily · 2 min</span>
            <span className="block text-body-strong">5 Judgment Calls</span>
            <span className="block text-caption text-muted-foreground">
              New information, new probability. See how experts disagree.
            </span>
          </span>
          <Zap className="ml-auto size-4 shrink-0 text-link" aria-hidden />
        </Link>

        <Link
          href="/practice/two-minute-clinic"
          onClick={() => haptic("tap")}
          className={cn(cardVariants({ variant: "interactive" }), "flex items-center gap-3 p-4")}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link">
            <Timer className="size-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-eyebrow text-muted-foreground">Daily · 2 minutes</span>
            <span className="block text-body-strong">Two-Minute Clinic</span>
            <span className="block text-caption text-muted-foreground">
              One line, your differential, instant expert comparison.
            </span>
          </span>
          <Zap className="ml-auto size-4 shrink-0 text-link" aria-hidden />
        </Link>
      </div>

      {/* Flagship — the main event */}
      <Link
        href="/practice/consulting-room"
        onClick={() => haptic("tap")}
        className={cn(
          cardVariants({ variant: "interactive" }),
          "group flex items-center gap-4 border-foreground p-5",
        )}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-primary text-primary-foreground">
          <Stethoscope className="size-6" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-eyebrow text-muted-foreground">AI simulated patient</span>
          <span className="block text-h3 leading-snug">Consulting Room</span>
          <span className="block text-caption text-muted-foreground">
            Interview a patient who presents like a real person. The debrief shows you what you missed.
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-small font-medium text-link">
          Practise
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </Link>
    </section>
  );
}
