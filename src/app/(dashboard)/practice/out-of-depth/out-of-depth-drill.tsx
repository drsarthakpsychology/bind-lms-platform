"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { AlertTriangle, Siren, CheckCircle2 } from "lucide-react";
import { OUT_OF_DEPTH_SCENARIOS, scoreReferralDecision, type ReferralOption } from "@/lib/out-of-depth/scenarios";
import { MobileCompletionState } from "@/components/mobile/mobile-completion-state";

/**
 * Out of Depth (v5.1 A4) — the refer/escalate drill.
 * Vignette → commit → consequence → reasoning. Scored both directions:
 * failing to refer is dangerous, referring everything is also a harm.
 */
export function OutOfDepthDrill() {
  const [idx, setIdx] = React.useState(0);
  const [chosen, setChosen] = React.useState<ReferralOption | null>(null);
  const [overReferrals, setOverReferrals] = React.useState(0);
  const [finished, setFinished] = React.useState(false);

  const s = OUT_OF_DEPTH_SCENARIOS[idx];
  if (!s) return null;

  function pick(o: ReferralOption) {
    if (chosen !== null) return;
    haptic("tap");
    const result = scoreReferralDecision(s, o);
    setChosen(o);
    if (result.overReferral) setOverReferrals((n) => n + 1);
    if (result.correct) haptic("success");
  }

  function next() {
    if (idx + 1 >= OUT_OF_DEPTH_SCENARIOS.length) {
      setFinished(true);
      haptic("success");
      return;
    }
    setChosen(null);
    setIdx((i) => i + 1);
  }

  function back() {
    setChosen(null);
    setIdx((i) => Math.max(0, i - 1));
  }

  function restart() {
    setIdx(0);
    setChosen(null);
    setOverReferrals(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-md border-2 border-border bg-card hard-shadow-sm">
        <MobileCompletionState
          title="Drill complete"
          description={`You worked through all ${OUT_OF_DEPTH_SCENARIOS.length} scenarios. ${overReferrals} over-referral${overReferrals === 1 ? "" : "s"} this session.`}
          action={
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center rounded-md border-2 border-foreground bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
            >
              Restart drill
            </button>
          }
        />
      </div>
    );
  }

  const result = chosen ? scoreReferralDecision(s, chosen) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Scenario {idx + 1} of {OUT_OF_DEPTH_SCENARIOS.length}</span>
        <span className="text-caption">Over-referrals this session: {overReferrals}</span>
      </div>

      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-eyebrow text-muted-foreground">Your client</p>
        <p className="mt-2 text-small">{s.vignette}</p>
      </div>

      <div className="space-y-2">
        {s.options.map((o) => {
          const picked = chosen === o.option;
          const isCorrect = o.option === s.correct;
          const reveal = chosen !== null && picked;
          return (
            <button
              key={o.option}
              type="button"
              onClick={() => pick(o.option)}
              disabled={chosen !== null}
              className={cn(
                "w-full rounded-md border-2 border-border bg-background px-3 py-2.5 text-left text-small transition-transform active:translate-y-px disabled:opacity-60",
                reveal && isCorrect && "border-green-600 bg-green-50",
                reveal && !isCorrect && "border-red-400 bg-red-50",
              )}
            >
              {o.label}
              {reveal ? (
                <span className={cn("mt-1 block text-caption font-medium", isCorrect ? "text-green-700" : "text-red-600")}>
                  {isCorrect ? "✓ The right call" : "✗"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {result ? (
        <div className="rounded-md border-2 border-border bg-card p-5">
          <p className={cn("flex items-center gap-2 text-base font-semibold", result.correct ? "text-green-700" : "text-red-600")}>
            {result.correct ? <CheckCircle2 className="size-4" aria-hidden /> : <AlertTriangle className="size-4" aria-hidden />}
            {result.correct ? "Right call" : result.overReferral ? "Over-referral — a real harm too" : "Missing the call"}
          </p>
          <p className="mt-2 text-small">{s.reasoning}</p>
          {s.over_referral_trap ? (
            <p className="mt-2 flex items-center gap-1.5 text-caption text-amber-700">
              <Siren className="size-3.5" aria-hidden />
              Anxious novices refer everything. Abandoning a client you can serve is also a failure.
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={back}
              disabled={idx === 0}
              className="rounded-md border-2 border-border bg-background px-4 py-2 text-small font-semibold text-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              {idx + 1 < OUT_OF_DEPTH_SCENARIOS.length ? "Next scenario" : "Finish"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
