"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

const LEVELS = [1, 2, 3, 4, 5];
const LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Running on empty", color: "bg-red-200" },
  2: { label: "Low", color: "bg-amber-200" },
  3: { label: "Steady", color: "bg-yellow-100" },
  4: { label: "Good", color: "bg-green-200" },
  5: { label: "Excellent", color: "bg-emerald-300" },
};

interface Props {
  weekLabel: string;
  initial?: { workload: number; energy: number; preparedness: number; freeLine?: string };
}

/**
 * Weekly check-in — 30 seconds, non-clinical, aggregate-only for admin.
 * Slider tap for each of workload / energy / preparedness, one free line.
 */
export function CheckinForm({ weekLabel, initial }: Props) {
  const [workload, setWorkload] = React.useState<number | null>(initial?.workload ?? null);
  const [energy, setEnergy] = React.useState<number | null>(initial?.energy ?? null);
  const [preparedness, setPreparedness] = React.useState<number | null>(initial?.preparedness ?? null);
  const [freeLine, setFreeLine] = React.useState(initial?.freeLine ?? "");
  const [busy, setBusy] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Focus management for keyboard users
  const freeLineRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!busy && freeLineRef.current) {
      freeLineRef.current.focus();
    }
  }, [busy]);

  const complete = workload !== null && energy !== null && preparedness !== null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !complete) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workload, energy, preparedness, freeLine: freeLine.trim() || undefined, weekLabel }),
      });
      if (!res.ok) {
        setError("Could not save. Please try again.");
        return;
      }
      setSaved(true);
      haptic("success");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Row label="Workload" hint="How heavy has the week been?">
        <Slider value={workload} onChange={setWorkload} />
      </Row>
      <Row label="Energy" hint="How much do you have left?">
        <Slider value={energy} onChange={setEnergy} />
      </Row>
      <Row label="Preparedness" hint="Ready for what's next?">
        <Slider value={preparedness} onChange={setPreparedness} />
      </Row>

      <div>
        <label htmlFor="free-line" className="text-small font-medium">Anything to add? (optional)</label>
        <input
          ref={freeLineRef}
          id="free-line"
          value={freeLine}
          onChange={(e) => setFreeLine(e.target.value)}
          maxLength={500}
          placeholder="One honest line about the week."
          className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error ? <p className="text-small text-status-alert-fg" role="alert">{error}</p> : null}
      <button
        type="submit"
        disabled={busy || !complete}
        className="w-full rounded-md border-2 border-border bg-primary px-4 py-2.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
      >
        {saved ? "Saved — see you next week" : busy ? "Saving…" : "Save check-in"}
      </button>
      {saved ? (
        <p className="text-center text-caption text-muted-foreground">
          Anonymous in aggregate. Faculty see trends only — never who said what.
        </p>
      ) : null}
    </form>
  );
}

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border-2 border-border bg-card p-4">
      <p className="text-small font-medium">{label}</p>
      <p className="text-caption text-muted-foreground">{hint}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Slider({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {LEVELS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => { onChange(n); haptic("tap"); }}
          aria-pressed={value === n}
          className={cn(
            "rounded-md border-2 border-border px-1 py-2 text-caption font-medium transition-transform active:translate-y-px",
            value === n ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground",
          )}
        >
          {n}
        </button>
      ))}
      {value !== null ? (
        <p className="col-span-5 mt-1 text-caption text-muted-foreground">
          <span className={cn("mr-1 inline-block size-2 rounded-full", LABELS[value].color)} /> {LABELS[value].label}
        </p>
      ) : null}
    </div>
  );
}
