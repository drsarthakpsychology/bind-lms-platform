"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { AlertTriangle, Siren, CheckCircle2 } from "lucide-react";
import { MobileChoiceList } from "@/components/mobile/mobile-choice-list";
import { OUT_OF_DEPTH_SCENARIOS, scoreReferralDecision, type ReferralOption } from "@/lib/out-of-depth/scenarios";

/**
 * Out of Depth (v5.1 A4) — the refer/escalate drill.
 * Vignette → commit → consequence → reasoning. Scored both directions:
 * failing to refer is dangerous, referring everything is also a harm.
 */
export function OutOfDepthDrill() {
  const [idx, setIdx] = React.useState(0);
  const [chosen, setChosen] = React.useState<ReferralOption | null>(null);
  const [overReferrals, setOverReferrals] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const total = OUT_OF_DEPTH_SCENARIOS.length;
  const isLast = idx + 1 >= total;
  const s = OUT_OF_DEPTH_SCENARIOS[idx];

  function pick(o: ReferralOption) {
    if (chosen !== null) return;
    haptic("tap");
    const result = scoreReferralDecision(s, o);
    setChosen(o);
    if (result.overReferral) setOverReferrals((n) => n + 1);
    if (result.correct) haptic("success");
  }

  function next() {
    if (isLast) {
      setDone(true);
      haptic("success");
    } else {
      setChosen(null);
      setIdx((i) => i + 1);
    }
  }

  function restart() {
    setIdx(0);
    setChosen(null);
    setOverReferrals(0);
    setDone(false);
    haptic("tap");
  }

  if (done) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 hard-shadow-sm">
        <p className="flex items-center gap-2 text-base font-semibold">
          <CheckCircle2 className="size-4" aria-hidden /> {total} scenarios complete
        </p>
        <p className="mt-2 text-small text-muted-foreground">
          Over-referrals this session:{" "}
          <span className="font-semibold text-numeric">{overReferrals}</span>
          {overReferrals > 0
            ? " — referring everything is also a harm."
            : " — you referred when you had to, and held when you could."}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
        >
          Run the drill again
        </button>
      </div>
    );
  }

  if (!s) return null;

  const result = chosen ? scoreReferralDecision(s, chosen) : null;
  const optionLabels = s.options.map((o) => o.label);
  const correctIndex = s.options.findIndex((o) => o.option === s.correct);
  const pickedIndex = chosen !== null ? s.options.findIndex((o) => o.option === chosen) : -1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-small text-muted-foreground">
        <span>Scenario {idx + 1} of {total}</span>
        <span className="text-caption">Over-referrals this session: {overReferrals}</span>
      </div>

      <div className="rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-eyebrow text-muted-foreground">Your client</p>
        <p className="mt-2 text-small">{s.vignette}</p>
      </div>

      <MobileChoiceList
        options={optionLabels}
        correct={[correctIndex]}
        picked={pickedIndex >= 0 ? [pickedIndex] : []}
        revealed={chosen !== null}
        onPick={(i) => pick(s.options[i].option)}
        label="Referral decision"
      />

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
          <button
            type="button"
            onClick={next}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            {isLast ? "Finish" : "Next scenario"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
