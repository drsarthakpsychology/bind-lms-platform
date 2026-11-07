"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { Radar, AlertTriangle, Rocket } from "lucide-react";

/**
 * Cohort Pulse: the human dashboard. Drifting / Flying lists, an active
 * summary, and a one-tap nudge (never automated guilt; Kavya presses send).
 */
export function PulseView({
  drifting,
  flying,
  total,
  active,
  activeNow = [],
  weeks = [],
  curriculumFlag = false,
}: {
  drifting: Array<{ email: string; daysSilent: number }>;
  flying: string[];
  total: number;
  active: number;
  /** Names of students on VIBHA in the last 5 minutes. */
  activeNow?: string[];
  /** checkins_aggregate weeks (no identifiers): the load/energy curve. */
  weeks?: Array<{ week: string; n: number; workload: number; energy: number; preparedness: number }>;
  /** activity dropping + load spiking = curriculum problem, not motivation. */
  curriculumFlag?: boolean;
}) {
  const [nudged, setNudged] = React.useState<Record<string, "sending" | "sent" | "not-set-up" | "failed">>({});

  async function nudge(email: string) {
    haptic("tap");
    // Personal, sent via the shared Resend path (/api/admin/nudge honestly
    // reports email-not-configured when no key exists: the button then says
    // so instead of claiming a message went out).
    setNudged((n) => ({ ...n, [email]: "sending" }));
    const res = await fetch("/api/admin/nudge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    const j = res?.ok ? ((await res.json().catch(() => null)) as { status?: string } | null) : null;
    const state = j?.status === "sent" ? "sent" : j?.status === "email-not-configured" ? "not-set-up" : "failed";
    setNudged((n) => ({ ...n, [email]: state }));
  }
  const NUDGE_LABEL = { sending: "Sending…", sent: "Sent", "not-set-up": "Email not set up", failed: "Failed. Try again" } as const;

  return (
    <div className="space-y-6">
      {/* cohort curve summary: one dominant metric (active), drifting/flying demoted */}
      <div className="space-y-3">
        <div className="rounded-md border-2 border-foreground bg-primary p-4 text-primary-foreground">
          <p className="flex items-center gap-2 text-caption font-semibold">
            <span className="size-2.5 animate-pulse rounded-full bg-foreground" aria-hidden /> Active now
          </p>
          <p className="mt-1 text-numeric text-h2 font-bold">{activeNow.length}</p>
          {activeNow.length ? <p className="mt-1 text-small">{activeNow.join(", ")}</p> : <p className="mt-1 text-small">Nobody is on VIBHA this minute.</p>}
        </div>
        <div className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
          <p className="text-caption text-muted-foreground">Active this week</p>
          <p className="mt-1 text-numeric text-h1 font-bold tracking-tight">
            {active}<span className="text-muted-foreground">/{total}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border-2 border-border bg-card p-3">
            <p className="text-caption text-muted-foreground">Quiet a week or more</p>
            <p className="text-numeric text-h3 font-semibold text-status-pending-fg">{drifting.length}</p>
          </div>
          <div className="rounded-md border-2 border-border bg-card p-3">
            <p className="text-caption text-muted-foreground">Active in the last 2 days</p>
            <p className="text-numeric text-h3 font-semibold text-status-success-fg">{flying.length}</p>
          </div>
        </div>
      </div>

      {/* curriculum flag: activity dropping while load spikes */}
      {curriculumFlag ? (
        <div className="rounded-md border-2 border-primary bg-primary/5 p-4">
          <p className="flex items-center gap-2 text-base font-semibold">
            <AlertTriangle className="size-4 text-link" aria-hidden />
            Curriculum problem, not a motivation problem
          </p>
          <p className="mt-1 text-small text-muted-foreground">
            Check-in responses are dropping while average workload is rising.
            Fix the load before blaming the students.
          </p>
        </div>
      ) : null}

      {/* cohort curve: aggregate weeks, no identifiers */}
      {weeks.length > 0 ? (
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="flex items-center gap-2 text-base font-semibold">
            <Radar className="size-4 text-muted-foreground" aria-hidden /> Activity by week
          </p>
          <ul className="mt-2 space-y-2">
            {weeks.map((w) => (
              <li key={w.week} className="rounded-md border border-border bg-background px-3 py-2">
                <div className="flex items-center justify-between gap-2 text-small">
                  <span className="font-medium">{w.week}</span>
                  <span className="text-caption text-muted-foreground">{w.n} responses</span>
                </div>
                <div className="mt-1 grid grid-cols-3 gap-2 text-caption text-muted-foreground">
                  <span>workload <span className="text-numeric font-semibold text-foreground">{w.workload.toFixed(1)}</span></span>
                  <span>energy <span className="text-numeric font-semibold text-foreground">{w.energy.toFixed(1)}</span></span>
                  <span>preparedness <span className="text-numeric font-semibold text-foreground">{w.preparedness.toFixed(1)}</span></span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* quiet students */}
      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="size-4 text-status-pending-fg" aria-hidden /> Quiet students
        </p>
        {drifting.length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">No one has gone quiet. Good sign.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {drifting.map((d) => (
              <li key={d.email} className="flex items-center justify-between gap-3">
                <span className="text-small">
                  {d.email}
                  <span className="ml-2 text-caption text-muted-foreground">{d.daysSilent} days silent</span>
                </span>
                <button
                  type="button"
                  onClick={() => void nudge(d.email)}
                  disabled={nudged[d.email] === "sending" || nudged[d.email] === "sent"}
                  className="flex min-h-[44px] shrink-0 items-center rounded-md border-2 border-border bg-primary px-3 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
                >
                  {nudged[d.email] ? NUDGE_LABEL[nudged[d.email]] : "Send nudge"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ahead of the pack */}
      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className="flex items-center gap-2 text-base font-semibold">
          <Rocket className="size-4 text-status-success-fg" aria-hidden /> Ahead of the pack
        </p>
        {flying.length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">No one is ahead yet.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {flying.map((f) => (
              <li key={f} className="text-small">{f}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
        <Radar className="size-3.5" aria-hidden />
        Cross-reference with the weekly check-in totals: if activity drops AND load spikes, that&apos;s a curriculum problem, not a motivation problem.
      </p>
    </div>
  );
}
