"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Send, Target } from "lucide-react";
import { scoreFunnelQuestion, funnelComplete, type FunnelAnswer } from "@/lib/decode/funnel";
import type { IdiomEntry } from "@/lib/decode/idioms";

/**
 * Mode 2 — The Funnel. The patient opens with a vague phrase. The student
 * gets FIVE questions to disambiguate. Scored on question efficiency: did
 * they cover the funnel (open → specify → instantiate → quantify →
 * contextualise → attribute) or waste turns on closed questions?
 */
export function FunnelDrill({ entry }: { entry: IdiomEntry }) {
  const [answers, setAnswers] = React.useState<FunnelAnswer[]>([]);
  const [draft, setDraft] = React.useState("");
  const [committed, setCommitted] = React.useState<string | null>(null);

  const MAX_Q = 5;
  const usedSteps = new Set(answers.map((a) => a.step));
  const done = answers.length >= MAX_Q || funnelComplete(answers.map((a) => a.step)).complete;
  const totalValue = answers.reduce((a, x) => a + x.value, 0);
  const maxValue = MAX_Q; // best case ~1 per question

  function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || done) return;
    haptic("tap");
    const scored = scoreFunnelQuestion(draft, usedSteps);
    setAnswers((a) => [...a, { question: draft.trim(), step: scored.step, value: scored.value, hint: scored.hint }]);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      {/* the funnel taught */}
      <div className="rounded-md border-2 border-border bg-secondary/40 p-3 text-small text-muted-foreground">
        <p className="font-semibold text-foreground">The funnel:</p>
        <p>open → specify → <span className="font-semibold text-link">instantiate</span> → quantify → contextualise → attribute</p>
        <p className="mt-1 text-caption">“Walk me through yesterday morning” is the highest-yield question in clinical interviewing — almost nobody teaches it.</p>
      </div>

      {/* the phrase */}
      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className="text-caption text-muted-foreground">The patient says</p>
        <p className="mt-1 text-base font-medium">&ldquo;{entry.phrase}&rdquo;</p>
      </div>

      {/* answers so far */}
      {answers.length > 0 ? (
        <div className="space-y-2">
          {answers.map((a, i) => (
            <div key={i} className="rounded-md border-2 border-border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-small">{i + 1}. {a.question}</p>
                <span className="shrink-0 text-caption font-medium text-muted-foreground">
                  {a.step ?? "closed"} · {Math.round(a.value * 100)}%
                </span>
              </div>
              <p className="mt-1 text-caption text-muted-foreground">{a.hint}</p>
            </div>
          ))}
          <p className="text-caption text-muted-foreground">
            Efficiency so far: {Math.round((totalValue / maxValue) * 100)}% ({answers.length}/{MAX_Q} questions)
          </p>
        </div>
      ) : (
        <p className="text-small text-muted-foreground">Ask your first question to disambiguate the phrase. You have five.</p>
      )}

      {/* composer */}
      {!done ? (
        <form onSubmit={ask} className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask a question…"
            maxLength={300}
            enterKeyHint="send"
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

      {/* commit to a reading */}
      {done ? (
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="flex items-center gap-1.5 text-base font-semibold">
            <Target className="size-4" aria-hidden /> Commit to a reading
          </p>
          <div className="mt-3 space-y-2">
            {entry.possible_meanings.map((m) => (
              <button
                key={m.reading}
                type="button"
                onClick={() => { setCommitted(m.reading); haptic("success"); }}
                className={cn(
                  "w-full rounded-md border-2 border-border px-3 py-2 text-left text-small transition-transform active:translate-y-px",
                  committed === m.reading ? "bg-primary text-primary-foreground" : "bg-background",
                )}
              >
                {m.reading}
                <span className={cn("ml-2 text-caption", committed === m.reading ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  ({m.likelihood})
                </span>
              </button>
            ))}
          </div>
          {committed ? (
            <p className="mt-3 text-caption text-muted-foreground">
              Now verify: does the patient&apos;s story match? If it doesn&apos;t, the phrase was doing other work.
              Ask what feeling &quot;{entry.phrase}&quot; would look like if it were gone.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
