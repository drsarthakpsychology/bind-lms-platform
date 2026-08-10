"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { diffNarratives, FIVE_P, scoreSort, SEED_FORMULATION, type FiveP } from "@/lib/practice/formulation";

/**
 * Stage 1: sort factor cards. Mobile: tap a card to select, tap a bucket to
 * place (drag-and-drop has a tap fallback). Stage 2: narrative. Stage 3: diff.
 */
export function FormulationForge() {
  const [attempt, setAttempt] = React.useState<Array<{ factorId: string; bucket: FiveP | null }>>(
    SEED_FORMULATION.factors.map((f) => ({ factorId: f.id, bucket: null })),
  );
  const [selected, setSelected] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<1 | 2 | 3>(1);
  const [narrative, setNarrative] = React.useState("");
  const [diff, setDiff] = React.useState<{ missing: string[]; present: string[] } | null>(null);

  function assign(factorId: string, bucket: FiveP) {
    setAttempt((a) => a.map((x) => (x.factorId === factorId ? { ...x, bucket } : x)));
    setSelected(null);
    haptic("tap");
  }

  function placeSelected(bucket: FiveP) {
    if (selected) {
      assign(selected, bucket);
    }
  }

  const placed = (bucket: FiveP) => attempt.filter((a) => a.bucket === bucket);
  const unplaced = SEED_FORMULATION.factors.filter((f) => !attempt.find((a) => a.factorId === f.id)?.bucket);
  const sorted = attempt.filter((a) => a.bucket !== null);
  const score = scoreSort(sorted, SEED_FORMULATION.factors);

  return (
    <div className="space-y-4">
      {/* stage indicator */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s as 1 | 2 | 3)}
            className={`rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium transition-transform active:translate-y-px ${
              stage === s ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {s === 1 ? "1 · Sort" : s === 2 ? "2 · Narrative" : "3 · Diff"}
          </button>
        ))}
      </div>

      {/* STAGE 1: sort */}
      {stage === 1 ? (
        <div className="space-y-4">
          <p className="text-small text-muted-foreground">{SEED_FORMULATION.prompt}</p>

          {/* the 5P grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {FIVE_P.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => placeSelected(p)}
                className="min-h-[120px] rounded-md border-2 border-dashed border-border bg-card p-3 text-left transition-transform active:translate-y-px"
              >
                <span className="text-caption font-semibold uppercase text-primary">{p}</span>
                <span className="mt-1 flex flex-col gap-1">
                  {placed(p).map((a) => {
                    const f = SEED_FORMULATION.factors.find((x) => x.id === a.factorId);
                    return (
                      <span key={a.factorId} className="rounded border border-border bg-background px-2 py-1 text-caption">
                        {f?.text}
                      </span>
                    );
                  })}
                </span>
              </button>
            ))}
          </div>

          {/* unplaced + distractor cards */}
          <div>
            <p className="text-caption text-muted-foreground">Tap a card, then tap a bucket. Or drag.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEED_FORMULATION.factors.map((f) => {
                const placedIn = attempt.find((a) => a.factorId === f.id)?.bucket;
                const isSel = selected === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => { setSelected(isSel ? null : f.id); haptic("tap"); }}
                    aria-pressed={isSel}
                    className={`rounded-md border-2 border-border px-3 py-1.5 text-caption transition-transform active:translate-y-px ${
                      isSel ? "bg-primary text-primary-foreground ring-2 ring-ring" : placedIn ? "bg-secondary text-muted-foreground" : "bg-background"
                    }`}
                  >
                    {f.text.slice(0, 42)}…
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-caption text-muted-foreground">
              Score so far: <span className="font-semibold text-numeric">{Math.round(score * 100)}%</span> — a diff, not a grade.
            </p>
          </div>

          <button
            type="button"
            onClick={() => { setStage(2); haptic("tap"); }}
            disabled={unplaced.length > 0}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            {unplaced.length ? `${unplaced.length} cards left to sort` : "Write the narrative →"}
          </button>
        </div>
      ) : null}

      {/* STAGE 2: narrative */}
      {stage === 2 ? (
        <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-small text-muted-foreground">
            Write a 3-6 sentence formulation linking the factors you sorted.
          </p>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            rows={8}
            placeholder="Ravi presents with…"
            className="w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => { setDiff(diffNarratives(narrative, SEED_FORMULATION.modelNarrative)); setStage(3); haptic("tap"); }}
            disabled={narrative.trim().length < 40}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            Diff against the model →
          </button>
        </div>
      ) : null}

      {/* STAGE 3: diff */}
      {stage === 3 && diff ? (
        <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <h2 className="text-base font-semibold">Your formulation vs the model</h2>
          <div className="rounded-md border border-border bg-background p-3 text-small">
            <span className="font-semibold text-muted-foreground">The model says: </span>
            <span className="italic">{SEED_FORMULATION.modelNarrative}</span>
          </div>
          <p className="text-small text-muted-foreground">
            Words the model used that you missed: <span className="text-amber-700">{diff.missing.join(", ") || "(none — excellent)"}</span>
          </p>
          <p className="text-small text-muted-foreground">
            Model words you captured: <span className="text-green-700">{diff.present.join(", ") || "(none yet)"}</span>
          </p>
          <p className="text-small text-muted-foreground">
            This is a diff, not a grade. The structure is the skill.
          </p>
        </div>
      ) : null}
    </div>
  );
}
