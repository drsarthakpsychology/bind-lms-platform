"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";

// Blind score is a 0–5 scale in 0.5 steps (matches the scorer's rubric).
const SCORE_OPTIONS = ["0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"].map(
  (v) => ({ value: v, label: v }),
);

interface Row {
  id: string;
  sessionId: string;
  overall: number;
  rubric: Record<string, unknown>;
  transcript: Array<{ role: string; content: string }>;
  createdAt: string;
  alreadyCorrected: boolean;
}

/**
 * A3 calibration row — shows the transcript, hides the AI score until the
 * faculty submits their own. Reveal compares side by side.
 */
export function CalibrationList({ rows }: { rows: Row[] }) {
  const [scores, setScores] = React.useState<Record<string, number>>({});
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});
  const [saved, setSaved] = React.useState<Record<string, boolean>>({});
  const [error, setError] = React.useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No transcripts to calibrate yet</p>
        <p className="mt-1 text-small text-muted-foreground">
          Once students run sessions, their debriefs land here for blind scoring.
        </p>
      </div>
    );
  }

  async function submit(r: Row) {
    const score = scores[r.id];
    if (score == null) return;
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/admin/sim-corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: r.sessionId,
          note: "Calibration score",
          originalOverall: r.overall,
          correctedOverall: score,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not save.");
        return;
      }
      setSaved((s) => ({ ...s, [r.id]: true }));
      haptic("success");
    } catch {
      setError("Network error.");
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
      {rows.map((r) => {
        const human = scores[r.id];
        const isRevealed = revealed[r.id];
        const diff = human != null && isRevealed ? Math.abs(human - r.overall) : null;
        return (
          <div key={r.id} className="rounded-md border-2 border-border bg-card p-4">
            {/* transcript */}
            <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border border-border bg-background p-3">
              {r.transcript.map((t, i) => (
                <p key={i} className={cn("text-small", t.role === "patient" && "italic text-muted-foreground")}>
                  <span className="font-semibold text-caption">{t.role === "student" ? "S" : "P"}: </span>
                  {t.content}
                </p>
              ))}
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {/* blind score — stepped 0–5 segmented control, then reveal, then save. */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-small text-muted-foreground">Your score (0-5):</span>
                {human != null && (
                  <span className="text-numeric text-small font-semibold">{human.toFixed(1)}</span>
                )}
              </div>
              <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <SegmentedControl
                  value={human != null ? String(human) : ""}
                  onValueChange={(v) => setScores((s) => ({ ...s, [r.id]: Number(v) }))}
                  options={SCORE_OPTIONS}
                  label={`Your score for ${r.sessionId}`}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setRevealed((x) => ({ ...x, [r.id]: true })); haptic("tap"); }}
                  disabled={human == null}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-md border-2 border-border px-3 text-caption font-medium transition-transform active:translate-y-px disabled:opacity-50"
                >
                  {isRevealed ? <EyeOff className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
                  Reveal AI score
                </button>
                <button
                  type="button"
                  onClick={() => void submit(r)}
                  disabled={human == null || saved[r.id]}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border-2 border-border bg-primary px-3 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
                >
                  {saved[r.id] ? "Saved (feeds scorer)" : "Save & correct"}
                </button>
              </div>
            </div>

            {/* reveal comparison */}
            {isRevealed && human != null ? (
              <div className="mt-3 rounded-md border border-border bg-secondary/40 p-3">
                <p className="text-small">
                  <span className="text-muted-foreground">You: </span>
                  <span className="font-semibold text-numeric">{human}</span>
                  <span className="mx-2 text-muted-foreground">vs</span>
                  <span className="text-muted-foreground">AI: </span>
                  <span className="font-semibold text-numeric">{r.overall.toFixed(1)}</span>
                  {diff != null ? (
                    <span className={cn("ml-2 text-caption font-medium", diff > 0.5 ? "text-amber-700" : "text-green-700")}>
                      {diff > 0.5 ? `disagreement ${diff.toFixed(1)} — saved as a correction` : "agree"}
                    </span>
                  ) : null}
                </p>
              </div>
            ) : null}

            {r.alreadyCorrected ? (
              <p className="mt-2 text-caption text-muted-foreground">Previously corrected — this session feeds the scorer already.</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
