"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import {
  isDiagnosticTerm,
  MOOD_AFFECT_ITEMS,
  MSE_VOCAB,
  SEED_MSE_STIMULI,
} from "@/lib/practice/mse";

type Mode = "tag" | "moodaffect" | "describe";

/** In-flight snapshot — a refresh mid-drill restores position instead of
 *  restarting the exercise (T46/T47). */
const MSE_KEY = "mse:trainer-in-flight";

export function MseTrainer() {
  const [mode, setMode] = React.useState<Mode>("tag");
  const [stimulusIdx, setStimulusIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<string[]>([]);
  const [revealed, setRevealed] = React.useState(false);
  const [moodIdx, setMoodIdx] = React.useState(0);
  const [describeText, setDescribeText] = React.useState("");

  // Restore the in-flight snapshot after first paint (deferred past hydration).
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(MSE_KEY);
        if (!raw) return;
        const s = JSON.parse(raw) as {
          mode?: Mode;
          stimulusIdx?: number;
          picked?: string[];
          revealed?: boolean;
          moodIdx?: number;
          describeText?: string;
        };
        if (s.mode === "tag" || s.mode === "moodaffect" || s.mode === "describe") setMode(s.mode);
        if (typeof s.stimulusIdx === "number" && s.stimulusIdx >= 0 && s.stimulusIdx < SEED_MSE_STIMULI.length) {
          setStimulusIdx(s.stimulusIdx);
        }
        if (Array.isArray(s.picked)) setPicked(s.picked);
        if (typeof s.revealed === "boolean") setRevealed(s.revealed);
        if (typeof s.moodIdx === "number" && s.moodIdx >= 0 && s.moodIdx < MOOD_AFFECT_ITEMS.length) {
          setMoodIdx(s.moodIdx);
        }
        if (typeof s.describeText === "string") setDescribeText(s.describeText);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Persist on every change.
  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        MSE_KEY,
        JSON.stringify({ mode, stimulusIdx, picked, revealed, moodIdx, describeText }),
      );
    } catch {
      /* ignore */
    }
  }, [mode, stimulusIdx, picked, revealed, moodIdx, describeText]);

  const stimulus = SEED_MSE_STIMULI[stimulusIdx];
  const vocab = MSE_VOCAB[stimulus.domain];

  function toggleTag(tag: string) {
    setPicked((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]));
    haptic("tap");
  }

  function check() {
    setRevealed(true);
    haptic("success");
  }

  function nextStimulus() {
    setPicked([]);
    setRevealed(false);
    setStimulusIdx((i) => (i + 1) % SEED_MSE_STIMULI.length);
  }

  const flagged = isDiagnosticTerm(describeText);

  return (
    <div className="space-y-4">
      {/* mode switch */}
      <div className="flex gap-2">
        {([
          ["tag", "Tag the domains"],
          ["moodaffect", "Mood vs affect"],
          ["describe", "Describe, don't diagnose"],
        ] as Array<[Mode, string]>).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); haptic("tap"); }}
            aria-pressed={mode === m}
            className={`rounded-md border-2 border-border px-3 py-1.5 text-caption font-medium transition-transform active:translate-y-px ${
              mode === m ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAG MODE */}
      {mode === "tag" ? (
        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-eyebrow text-muted-foreground">Domain: {stimulus.domain}</p>
          <p className="mt-2 text-base font-medium">{stimulus.content}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {vocab.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={picked.includes(tag)}
                className={`rounded-md border-2 border-border px-3 py-1.5 text-caption transition-transform active:translate-y-px ${
                  picked.includes(tag) ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={check}
            disabled={picked.length === 0}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
          >
            Check
          </button>

          {revealed ? (
            <div className="mt-4 space-y-2 rounded-md border border-border bg-background p-3">
              <p className="text-small">
                <span className="font-semibold text-green-700">Expert: </span>
                {stimulus.expertTags.join(", ")}
              </p>
              {stimulus.amberTags?.length ? (
                <p className="text-small text-amber-700">
                  <span className="font-semibold">Defensible alternative: </span>
                  {stimulus.amberTags.join(", ")}
                </p>
              ) : null}
              <p className="text-small text-muted-foreground">
                You picked: {picked.length ? picked.join(", ") : "(none)"}
              </p>
              <button
                type="button"
                onClick={nextStimulus}
                className="mt-2 rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Next stimulus
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* MOOD VS AFFECT */}
      {mode === "moodaffect" ? (
        moodIdx >= MOOD_AFFECT_ITEMS.length ? (
          <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
            <p className="text-eyebrow text-muted-foreground">Mood vs affect · complete</p>
            <p className="mt-3 text-small text-muted-foreground">
              Drill complete. Mood is what they report; affect is what you observe. Repeat to
              internalise it.
            </p>
          </div>
        ) : (
          <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
            <p className="text-eyebrow text-muted-foreground">Mood vs affect · {moodIdx + 1}/{MOOD_AFFECT_ITEMS.length}</p>
            <p className="mt-3 text-lg font-medium">{MOOD_AFFECT_ITEMS[moodIdx].text}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const correct = MOOD_AFFECT_ITEMS[moodIdx].answer === "mood";
                  haptic(correct ? "success" : "warning");
                  setMoodIdx((i) => i + 1);
                }}
                className="flex-1 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Mood
              </button>
              <button
                type="button"
                onClick={() => {
                  const correct = MOOD_AFFECT_ITEMS[moodIdx].answer === "affect";
                  haptic(correct ? "success" : "warning");
                  setMoodIdx((i) => i + 1);
                }}
                className="flex-1 rounded-md border-2 border-border bg-secondary px-4 py-2 text-small font-semibold text-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Affect
              </button>
            </div>
          </div>
        )
      ) : null}

      {/* DESCRIBE DON'T DIAGNOSE */}
      {mode === "describe" ? (
        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <p className="text-small text-muted-foreground">
            Describe what you see without using diagnostic words. Any diagnostic term gets
            flagged.
          </p>
          <textarea
            value={describeText}
            onChange={(e) => setDescribeText(e.target.value)}
            rows={4}
            placeholder='e.g. "Client is well-groomed but guarded. Speech is slow. Reports low energy."'
            className="mt-3 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {flagged.length ? (
            <div className="mt-3 rounded-md border-2 border-amber-400 bg-amber-50 p-3 text-small text-amber-800" role="alert">
              <span className="font-semibold">Diagnostic terms flagged:</span> {flagged.join(", ")}
              <p className="mt-1">Try describing the behaviour instead of naming the diagnosis.</p>
            </div>
          ) : describeText.trim().length > 10 ? (
            <div className="mt-3 rounded-md border-2 border-green-500 bg-green-50 p-3 text-small text-green-800" role="status">
              Clean — no diagnostic terms. That&apos;s the skill.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
