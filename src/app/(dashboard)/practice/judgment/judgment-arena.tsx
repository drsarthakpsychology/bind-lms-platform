"use client";

import * as React from "react";
import Link from "next/link";
import { haptic } from "@/lib/haptics";
import { panelDistribution, scoreSctResponse, simulatedPanel, type SctItem, type SctResponse } from "@/lib/practice/sct";
import { buildSctAttemptPayload } from "@/lib/practice/sct-attempt";
import { JUDGMENT_COMPETENCY_KEYS, recordCompetencyEvent } from "@/lib/practice/competency-client";
import { MobileCompletionState } from "@/components/mobile/mobile-completion-state";
import { ThumbBar } from "@/components/mobile/thumb-bar";
import { ChevronDown, ChevronsDown, ChevronsUp, ChevronUp, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReaction } from "@/components/reactions/use-reaction";
import { EndReaction } from "@/components/reactions/graphics";

const RESPONSE_LABELS: Record<SctResponse, string> = {
  [-2]: "Much less likely",
  [-1]: "Less likely",
  0: "No change",
  1: "More likely",
  2: "Much more likely",
};

const RESPONSE_ICONS: Record<SctResponse, LucideIcon> = {
  [-2]: ChevronsDown,
  [-1]: ChevronDown,
  0: Minus,
  1: ChevronUp,
  2: ChevronsUp,
};
const RESPONSES: SctResponse[] = [-2, -1, 0, 1, 2];

export function JudgmentArena({ items }: { items: SctItem[] }) {
  const [idx, setIdx] = React.useState(0);
  const [answered, setAnswered] = React.useState<Array<{ response: SctResponse; score: number }>>([]);
  const [showPanel, setShowPanel] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const creditedRef = React.useRef(false);
  const reaction = useReaction();

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

  function answer(r: SctResponse) {
    if (showPanel) return;
    haptic("tap");
    const score = scoreSctResponse(r, panel);
    setAnswered((a) => [...a, { response: r, score }]);
    setShowPanel(true);
    // Half or more of the panel's credit counts as a good call; anything in between is partly right.
    reaction.onAnswer(score >= 0.5, { partial: score > 0 && score < 1 });
    // Persist this judgment call (a check, not a test, silent on failure).
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
    // Always advance: reaching idx === items.length triggers the "done" state.
    setIdx((i) => i + 1);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (idx >= items.length) {
    const total = answered.reduce((a, b) => a + b.score, 0);
    const avg = answered.length ? total / answered.length : 0;
    return (
      <>
      <EndReaction right={answered.filter((a) => a.score >= 0.5).length} total={answered.length} />
      <MobileCompletionState
        title="Done for today"
        description={
          <>
            Done in {mm}:{ss}. You matched the panel{" "}
            <span className="font-semibold text-numeric">{(avg * 100).toFixed(0)}%</span>.
          </>
        }
        action={
          <Link
            href="/practice"
            className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-px"
          >
            Back to practice
          </Link>
        }
      />
      </>
    );
  }

  const item = items[idx];
  const panel = simulatedPanel(item.id);
  const dist = panelDistribution(panel);

  return (
    <div className="space-y-4">
      {/* progress + timer */}
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Judgment call {idx + 1}</span>
        <span className="text-numeric">{mm}:{ss}</span>
      </div>

      {/* the item */}
      <div className="rounded-[10px] border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5">
        <p className="text-body">{item.vignette}</p>
        <p className="mt-3 rounded-md border-2 border-foreground/20 bg-secondary/60 p-3 text-body">
          <span className="font-semibold">Hypothesis: </span>{item.hypothesis}
        </p>
        <p className="mt-3 text-body">
          <span className="font-semibold text-link">New information: </span>
          {item.new_information}
        </p>
        <fieldset className="mt-4">
          <legend className="text-body-strong">This makes the hypothesis</legend>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-5">
            {RESPONSES.map((r) => {
              const Icon = RESPONSE_ICONS[r];
              const mine = showPanel && answered[answered.length - 1]?.response === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => answer(r)}
                  disabled={showPanel}
                  aria-pressed={mine}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-md border-2 border-foreground px-3 py-2 text-left text-body font-semibold transition-[transform,box-shadow] duration-fast ease-snappy sm:flex-col sm:justify-center sm:gap-1 sm:px-2 sm:text-center sm:text-small",
                    mine ? "bg-brand text-brand-foreground hard-shadow-xs" : "bg-background",
                    !showPanel && "hover:-translate-y-0.5 hover:hard-shadow-xs active:translate-y-px active:shadow-none",
                    showPanel && !mine && "opacity-50",
                  )}
                >
                  <span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full border-2 border-current", mine ? "bg-card text-foreground" : "bg-card")}>
                    <Icon className="size-4" strokeWidth={2.5} />
                  </span>
                  {RESPONSE_LABELS[r]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* panel reveal */}
      {showPanel ? (
        <div role="status" className="rounded-[10px] border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5">
          <h3 className="text-body-strong">What the expert panel said</h3>
          <div className="mt-3 flex h-28 items-end gap-2">
            {dist.map((d) => {
              const Icon = RESPONSE_ICONS[d.response as SctResponse];
              const mine = answered[answered.length - 1]?.response === d.response;
              return (
                <div key={d.response} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-caption text-numeric">{d.count}</span>
                  <div
                    className={cn("w-full rounded-t-md border-2 border-b-0 border-foreground", mine ? "bg-brand" : "bg-primary")}
                    style={{ height: `${Math.max(8, (d.count / Math.max(1, ...dist.map((x) => x.count))) * 100)}%` }}
                  />
                  <span className="flex items-center text-caption text-muted-foreground" title={RESPONSE_LABELS[d.response as SctResponse]}>
                    <Icon className="size-4" aria-hidden />
                    <span className="sr-only">{RESPONSE_LABELS[d.response as SctResponse]}</span>
                    {mine ? <span className="ml-0.5 font-bold text-foreground">You</span> : null}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-body">
            Your call matched the panel <span className="font-semibold text-numeric">{(answered[answered.length - 1]?.score * 100).toFixed(0)}%</span>.
          </p>
          {/* Phones: Next sits low, in thumb reach. */}
          <ThumbBar label="Next step" className="md:mt-3">
            <button
              type="button"
              onClick={next}
              className="min-h-12 w-full text-base md:min-h-11 md:w-auto md:text-small rounded-md border-2 border-foreground bg-primary px-4 py-2 font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
            >
              {idx + 1 < items.length ? "Next judgment call" : "See today's summary"}
            </button>
          </ThumbBar>
        </div>
      ) : null}
    </div>
  );
}
