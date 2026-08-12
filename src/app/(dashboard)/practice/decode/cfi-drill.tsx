"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Send, Scale } from "lucide-react";
import { CFI_SCENARIOS, CFI_DOMAINS, scoreCfiQuestion } from "@/lib/decode/cfi";

/**
 * Mode 4 — CFI Practice. Elicit the patient's explanatory model without
 * dismissing it. The failure mode: correcting the belief instead of
 * understanding it.
 */
export function CfiDrill() {
  const [scenarioIdx, setScenarioIdx] = React.useState(0);
  const [questions, setQuestions] = React.useState<string[]>([]);
  const [scores, setScores] = React.useState<Array<{ eliciting: boolean; dismissive: boolean }>>([]);
  const [draft, setDraft] = React.useState("");
  const [done, setDone] = React.useState(false);

  const scenario = CFI_SCENARIOS[scenarioIdx];
  const elicitingCount = scores.filter((s) => s.eliciting).length;
  const dismissiveCount = scores.filter((s) => s.dismissive).length;

  function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || done) return;
    haptic("tap");
    const q = draft.trim();
    const s = scoreCfiQuestion(q);
    setQuestions((arr) => [...arr, q]);
    setScores((arr) => [...arr, s]);
    setDraft("");
    if (s.dismissive) haptic("warning");
    else if (s.eliciting) haptic("success");
  }

  return (
    <div className="space-y-4">
      <p className="rounded-md border-2 border-border bg-secondary/40 p-3 text-small text-muted-foreground">
        The <span className="font-semibold text-foreground">Cultural Formulation Interview</span> elicits the patient&apos;s
        explanatory model — perceived cause, meaning, course, expected treatment. The failure mode is
        correcting the belief instead of understanding it.
      </p>

      <div className="rounded-md border-2 border-border bg-card p-4 hard-shadow-sm">
        <p className="text-caption text-muted-foreground">The patient says</p>
        <p className="mt-1 text-base font-medium">&ldquo;{scenario.idiom}&rdquo;</p>
        <p className="mt-2 text-small text-muted-foreground">{scenario.setting}</p>
        <p className="mt-2 rounded-md border border-border bg-background p-2 text-small">
          <span className="font-semibold text-muted-foreground">Their belief: </span>{scenario.patientBelief}
        </p>
      </div>

      <div>
        <p className="text-caption font-semibold text-muted-foreground">Elicit the six domains without dismissing:</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {CFI_DOMAINS.map((d) => (
            <span key={d} className="rounded-full bg-secondary px-2 py-0.5 text-caption">{d}</span>
          ))}
        </div>
      </div>

      {questions.length > 0 ? (
        <div className="space-y-2">
          {questions.map((q, i) => {
            const s = scores[i];
            return (
              <div key={i} className="rounded-md border-2 border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-small">{i + 1}. {q}</p>
                  <span className={cn("shrink-0 text-caption font-medium", s.dismissive ? "text-red-600" : s.eliciting ? "text-green-700" : "text-muted-foreground")}>
                    {s.dismissive ? "dismissive — correcting, not understanding" : s.eliciting ? "eliciting" : "neutral"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {!done ? (
        <form onSubmit={ask} className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask the patient about their understanding…"
            maxLength={300}
            className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex items-center gap-1 rounded-md border-2 border-border bg-primary px-3 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            <Send className="size-3.5" aria-hidden /> Ask
          </button>
        </form>
      ) : null}

      {questions.length >= 6 || done ? (
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="flex items-center gap-2 text-base font-semibold">
            <Scale className="size-4" aria-hidden />
            Did you understand without dismissing?
          </p>
          <p className="mt-2 text-small">
            {elicitingCount} eliciting · {dismissiveCount} dismissive
            {dismissiveCount > 0 ? " — you corrected the belief. That closes the patient down." : " — you held the belief as theirs to hold. That's the skill."}
          </p>
          <button
            type="button"
            onClick={() => {
              if (scenarioIdx + 1 < CFI_SCENARIOS.length) {
                setScenarioIdx((i) => i + 1);
                setQuestions([]);
                setScores([]);
              } else {
                setDone(true);
              }
              haptic("tap");
            }}
            className="mt-3 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
          >
            {scenarioIdx + 1 < CFI_SCENARIOS.length ? "Next patient" : "Done"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
