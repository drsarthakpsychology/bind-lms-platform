"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";

type Status = "off" | "live" | "unlocked";

const OPTIONS: readonly { value: Status; label: string }[] = [
  { value: "off", label: "Hidden" },
  { value: "live", label: "Live" },
  { value: "unlocked", label: "Unlock" },
];

const STATUS_TEXT: Record<Status, string> = {
  off: "Hidden",
  live: "Yet to be live",
  unlocked: "Unlocked",
};

const STATUS_TONE: Record<Status, string> = {
  off: "bg-status-info-bg text-status-info-fg",
  live: "bg-status-pending-bg text-status-pending-fg",
  unlocked: "bg-status-success-bg text-status-success-fg",
};

/**
 * The new page passes `status: "off" | "live" | "unlocked"`. The old page still
 * passes `enabled` + `liveForCohortOne` booleans — keep a fallback so either
 * shape works until the page is migrated.
 */
function normalizeStatus(
  status: string | undefined,
  enabled: boolean | undefined,
  liveForCohortOne: boolean | undefined,
): Status {
  if (status === "off" || status === "live" || status === "unlocked") return status;
  if (enabled === true) return liveForCohortOne ? "unlocked" : "live";
  return "off";
}

/**
 * A single feature-flag row: label + three-state segmented control
 * (Hidden / Live / Unlock) that persists to the DB.
 */
export function FlagToggle({
  flagKey,
  label,
  status,
  enabled,
  liveForCohortOne,
}: {
  flagKey: string;
  label: string;
  status?: string;
  enabled?: boolean;
  liveForCohortOne?: boolean;
}) {
  const [value, setValue] = React.useState<Status>(() =>
    normalizeStatus(status, enabled, liveForCohortOne),
  );
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(false);

  async function handleChange(next: Status) {
    if (busy || next === value) return;
    const prev = value;
    haptic("tap");
    setValue(next);
    setError(false);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: flagKey, status: next }),
      });
      if (!res.ok) throw new Error(`flag save failed: ${res.status}`);
      haptic("success");
    } catch {
      setValue(prev);
      setError(true);
      haptic("warning");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border-2 border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-small font-medium">{label}</p>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-md border-2 border-border px-2 py-0.5 text-caption font-semibold hard-shadow-flat",
            STATUS_TONE[value],
          )}
        >
          {STATUS_TEXT[value]}
        </span>
      </div>

      <SegmentedControl<Status>
        value={value}
        onValueChange={(next) => void handleChange(next)}
        options={OPTIONS}
        label={`${label} status`}
        className="mt-3 w-full [&>button]:flex-1"
      />

      {error && !busy && (
        <p className="mt-2 text-caption font-medium text-destructive">
          Couldn&apos;t save. Try again.
        </p>
      )}
    </div>
  );
}
