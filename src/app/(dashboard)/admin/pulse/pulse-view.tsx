"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { Radar, AlertTriangle, Rocket } from "lucide-react";

/**
 * Cohort Pulse — the human dashboard. Drifting / Flying lists, an active
 * summary, and a one-tap nudge (never automated guilt; Kavya presses send).
 */
export function PulseView({
  drifting,
  flying,
  total,
  active,
}: {
  drifting: Array<{ email: string; daysSilent: number }>;
  flying: string[];
  total: number;
  active: number;
}) {
  const [nudged, setNudged] = React.useState<Record<string, boolean>>({});

  async function nudge(email: string) {
    haptic("tap");
    // Pre-drafted, personal. Send via Resend when configured; for now it
    // records intent and would call /api/admin/nudge.
    setNudged((n) => ({ ...n, [email]: true }));
  }

  return (
    <div className="space-y-6">
      {/* cohort curve summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="text-caption text-muted-foreground">Active this week</p>
          <p className="text-numeric text-h3 font-semibold">{active}/{total}</p>
        </div>
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="text-caption text-muted-foreground">Drifting (7+ days)</p>
          <p className="text-numeric text-h3 font-semibold text-amber-700">{drifting.length}</p>
        </div>
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="text-caption text-muted-foreground">Flying</p>
          <p className="text-numeric text-h3 font-semibold text-green-700">{flying.length}</p>
        </div>
      </div>

      {/* drifting */}
      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="size-4 text-amber-600" aria-hidden /> Drifting
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
                  disabled={nudged[d.email]}
                  className="rounded-md border border-border px-2 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  {nudged[d.email] ? "Nudge drafted" : "One-tap nudge"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* flying */}
      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className="flex items-center gap-2 text-base font-semibold">
          <Rocket className="size-4 text-green-700" aria-hidden /> Flying — don&apos;t lose these
        </p>
        {flying.length === 0 ? (
          <p className="mt-2 text-small text-muted-foreground">No one is ahead of the pack yet.</p>
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
        Cross-reference with the weekly check-in aggregate: if activity drops AND load spikes, that&apos;s a curriculum problem, not a motivation problem.
      </p>
    </div>
  );
}
