"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";

/**
 * A single feature-flag row: label + on/off toggle that persists to the DB.
 */
export function FlagToggle({
  flagKey,
  label,
  enabled,
  liveForCohortOne,
}: {
  flagKey: string;
  label: string;
  enabled: boolean;
  liveForCohortOne: boolean;
}) {
  const [on, setOn] = React.useState(enabled);
  const [busy, setBusy] = React.useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    haptic("tap");
    const next = !on;
    try {
      const res = await fetch("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: flagKey, enabled: next }),
      });
      if (!res.ok) return;
      setOn(next);
      haptic("success");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-md border-2 border-border bg-card px-4 py-3">
      <div>
        <p className="text-small font-medium">{label}</p>
        <p className="text-caption text-muted-foreground">
          {liveForCohortOne ? "Live for students" : "Not live yet"}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => void toggle()}
        disabled={busy}
        className={`relative h-7 w-12 rounded-full border-2 border-border transition-colors ${on ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full border-2 border-border bg-card transition-all ${on ? "left-[calc(100%-1.4rem)]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
