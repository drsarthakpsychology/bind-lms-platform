"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { CLINICS } from "@/lib/practice/clinic";

/**
 * Two-Minute Clinic — produce a one-liner, differential, and next question in
 * 120 seconds. The three prompts are sequential (one cognitive task at a time,
 * T19): the differential first, then the next question, then the comparison —
 * never two stacked textareas on the first screenful.
 */
export function TwoMinuteClinic() {
  const [itemIdx, setItemIdx] = React.useState(0);
  const [phase, setPhase] = React.useState<"read" | "type" | "compare">("read");
  const [typeStep, setTypeStep] = React.useState<"differential" | "nextQuestion">("differential");
  const [seconds, setSeconds] = React.useState(120);
  const [differential, setDifferential] = React.useState("");
  const [nextQuestion, setNextQuestion] = React.useState("");
  const item = CLINICS[itemIdx];

  React.useEffect(() => {
    if (phase !== "type") return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setPhase("compare");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function startClock() {
    setPhase("type");
    setTypeStep("differential");
    setSeconds(120);
    haptic("tap");
  }

  function advanceToQuestion() {
    setTypeStep("nextQuestion");
    haptic("tap");
  }

  function compare() {
    setPhase("compare");
    haptic("success");
    // Retention loop: completing the daily drill keeps the streak alive.
    fetch("/api/practice/clinic/complete", { method: "POST" }).catch(() => {});
  }

  function nextItem() {
    setItemIdx((i) => (i + 1) % CLINICS.length);
    setPhase("read");
    setTypeStep("differential");
    setDifferential("");
    setNextQuestion("");
    haptic("tap");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-eyebrow text-muted-foreground">One-liner {itemIdx + 1}</span>
          {phase === "type" ? (
            <span className="text-numeric text-small" aria-live="polite">{seconds}s</span>
          ) : null}
        </div>
        <p className="mt-3 text-base font-medium">{item.line}</p>

        {phase === "read" ? (
          <button
            type="button"
            onClick={startClock}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            Start the clock
          </button>
        ) : null}
      </div>

      {phase === "type" ? (
        <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <div className="flex items-center justify-between text-caption font-medium text-muted-foreground">
            <span>
              {typeStep === "differential" ? "Step 1 of 2 — your differential" : "Step 2 of 2 — your next question"}
            </span>
            {typeStep === "nextQuestion" ? (
              <button
                type="button"
                onClick={() => { setTypeStep("differential"); haptic("tap"); }}
                className="text-link hover:underline"
              >
                ← Back
              </button>
            ) : null}
          </div>

          {typeStep === "differential" ? (
            <>
              <div>
                <label className="text-small font-medium" htmlFor="diff">Your differential (top 2-3)</label>
                <textarea
                  id="diff"
                  value={differential}
                  onChange={(e) => setDifferential(e.target.value)}
                  rows={3}
                  placeholder="e.g. Depression, adjustment disorder, anaemia"
                  className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={advanceToQuestion}
                disabled={!differential.trim()}
                className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
              >
                Next question →
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="text-small font-medium" htmlFor="nextq">Your next question</label>
                <textarea
                  id="nextq"
                  value={nextQuestion}
                  onChange={(e) => setNextQuestion(e.target.value)}
                  rows={3}
                  placeholder="e.g. 'How have you been sleeping lately?'"
                  className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={compare}
                className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
              >
                Compare with the expert
              </button>
            </>
          )}
        </div>
      ) : null}

      {phase === "compare" ? (
        <div className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <h2 className="text-base font-semibold">Expert comparison</h2>
          <div>
            <p className="text-small font-medium text-muted-foreground">Your differential</p>
            <p className="text-small">{differential || "(blank)"}</p>
          </div>
          <div>
            <p className="text-small font-medium text-muted-foreground">Expert differential</p>
            <ul className="mt-1 space-y-1 text-small">
              {item.expertDifferential.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-small font-medium text-muted-foreground">Best next question</p>
            <p className="text-small">{item.expertNext}</p>
          </div>
          <div className="rounded-md border border-border bg-secondary/60 p-3 text-small">
            <span className="font-semibold">The lesson: </span>{item.lesson}
          </div>
          <button
            type="button"
            onClick={nextItem}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            Next one-liner
          </button>
        </div>
      ) : null}
    </div>
  );
}
