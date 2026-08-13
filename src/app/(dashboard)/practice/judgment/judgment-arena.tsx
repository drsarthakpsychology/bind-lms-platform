"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { panelDistribution, scoreSctResponse, type SctItem, type SctResponse } from "@/lib/practice/sct";
import { buildSctAttemptPayload } from "@/lib/practice/sct-attempt";
import { JUDGMENT_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";

const RESPONSE_LABELS: Record<SctResponse, string> = {
  [-2]: "Much less likely",
  [-1]: "Less likely",
  0: "No change",
  1: "More likely",
  2: "Much more likely",
};

/** Deterministic simulated panel responses for the seed items (admin flow wires real ones). */
function simulatedPanel(id: string): SctResponse[] {
  const h = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = (h % 5) - 2; // -2..2
  // A distribution clustered around `base`.
  return [
    base as SctResponse,
    base as SctResponse,
    Math.max(-2, Math.min(2, base + 1)) as SctResponse,
    Math.max(-2, Math.min(2, base - 1)) as SctResponse,
    Math.max(-2, Math.min(2, base + (h % 2 === 0 ? 1 : -1))) as SctResponse,
  ];
}

export function JudgmentArena({ items }: { items: SctItem[] }) {
  const [idx, setIdx] = React.useState(0);
  const [answered, setAnswered] = React.useState<Array<{ response: SctResponse; score: number }>>([]);
  const [showPanel, setShowPanel] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const creditedRef = React.useRef(false);

  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Credit the completed daily set into the Skills Passport exactly once.
  React.useEffect(() => {
    if (idx >= items.length && answered.length > 0 && !creditedRef.current) {
      creditedRef.current = true;
      const avg = answered.reduce((a, b) => a + b.score, 0) / answered.length;
      void recordCompetencyEvent("judgment", JUDGMENT_COMPETENCY_KEYS, avg * 5, `${answered.length} judgment calls`).catch(() => {
        creditedRef.current = false; // allow retry next visit
      });
    }
  }, [idx, items.length, answered]);

  const item = items[idx];
  const panel = simulatedPanel(item.id);
  const dist = panelDistribution(panel);

  function answer(r: SctResponse) {
    if (showPanel) return;
    haptic("tap");
    const score = scoreSctResponse(r, panel);
    setAnswered((a) => [...a, { response: r, score }]);
    setShowPanel(true);
    // Persist this judgment call (a check, not a test — silent on failure).
    const payload = buildSctAttemptPayload(item.id, r, score, seconds);
    void fetch("/api/practice/sct/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        vignette: item.vignette,
        hypothesis: item.hypothesis,
        new_information: item.new_information,
      }),
    }).catch(() => {}); // silent; a check, not a test
    haptic("success");
  }

  function next() {
    setShowPanel(false);
    if (idx + 1 < items.length) setIdx(idx + 1);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (idx >= items.length) {
    const total = answered.reduce((a, b) => a + b.score, 0);
    const avg = answered.length ? total / answered.length : 0;
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <h2 className="text-base font-semibold">Done for today</h2>
        <p className="mt-2 text-small text-muted-foreground">
          {answered.length} judgment calls in {mm}:{ss}. Panel-aligned score:{" "}
          <span className="font-semibold text-numeric">{(avg * 100).toFixed(0)}%</span>.
        </p>
        <p className="mt-2 text-small text-muted-foreground">
          This is a trend over the cohort, not a grade. Experts disagree — the distribution
          is the lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* progress + timer */}
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Judgment call {idx + 1} of {items.length}</span>
        <span className="text-numeric">{mm}:{ss}</span>
      </div>

      {/* the item */}
      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-small">{item.vignette}</p>
        <p className="mt-3 rounded-md border border-border bg-secondary/60 p-3 text-small">
          <span className="font-semibold">Hypothesis: </span>{item.hypothesis}
        </p>
        <p className="mt-3 text-small">
          <span className="font-semibold text-link">New information: </span>
          {item.new_information}
        </p>
        <p className="mt-4 text-small font-medium">This becomes:</p>

        <div className="mt-2 grid grid-cols-5 gap-2">
          {([-2, -1, 0, 1, 2] as SctResponse[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => answer(r)}
              disabled={showPanel}
              className="rounded-md border-2 border-border bg-background px-2 py-2 text-caption font-medium transition-transform active:translate-y-px disabled:opacity-60"
            >
              {RESPONSE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* panel reveal */}
      {showPanel ? (
        <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
          <h3 className="text-base font-semibold">The panel disagreed — that&apos;s the lesson</h3>
          <div className="mt-3 flex h-20 items-end gap-2">
            {dist.map((d) => (
              <div key={d.response} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-caption text-numeric">{d.count}</span>
                <div
                  className="w-full rounded-t-md border-2 border-b-0 border-border bg-primary"
                  style={{ height: `${Math.max(8, (d.count / Math.max(1, ...dist.map((x) => x.count))) * 100)}%` }}
                />
                <span className="text-caption text-muted-foreground">{RESPONSE_LABELS[d.response as SctResponse].replace(/^(\w+).*$/, "$1")}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-small text-muted-foreground">
            Your call scored <span className="font-semibold text-numeric">{(answered[answered.length - 1]?.score * 100).toFixed(0)}%</span>{" "}
            of the modal panel weight. Partial credit for reasonable disagreement is the whole point.
          </p>
          <button
            type="button"
            onClick={next}
            className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            {idx + 1 < items.length ? "Next judgment call" : "See today's summary"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
