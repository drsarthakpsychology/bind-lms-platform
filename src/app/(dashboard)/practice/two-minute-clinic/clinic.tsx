"use client";

import { noteAnswer } from "@/lib/history/client";
import * as React from "react";
import { startHowTo, useHowTo } from "@/components/help/how-to";
import { haptic } from "@/lib/haptics";
import { CLINICS } from "@/lib/practice/clinic";
import { useReaction } from "@/components/reactions/use-reaction";

const SKIP = new Set(["disorder", "disorders", "syndrome", "related", "induced", "other", "without", "major", "acute", "chronic", "primary", "secondary", "presentation", "features", "reconsider", "atypical", "early", "onset", "illness", "state"]);
/** Word stems that name a diagnosis (first 6 letters of 5+ letter words, minus filler like "disorder"). */
function keyWords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]{5,}/g) ?? []).filter((w) => !SKIP.has(w)).map((w) => w.slice(0, 6));
}

/**
 * A light check for the reaction only (nothing is scored here): did the typed
 * differential name the expert's first diagnosis (right), another one on the
 * list (partly right), or none (no reaction, since it may be a fair synonym)?
 */
export function differentialMatch(typed: string, expert: readonly string[]): "top" | "listed" | "none" {
  const mine = new Set(keyWords(typed));
  if (!mine.size) return "none";
  const hit = (d: string) => keyWords(d).some((w) => mine.has(w));
  if (expert[0] && hit(expert[0])) return "top";
  return expert.some(hit) ? "listed" : "none";
}

/**
 * `start` is picked on the server for each visit, so a returning student does
 * not open on the same one-liner every time (there are over 140).
 */
/** `order`: one-liner ids in answer-history order (src/lib/history), picked on the server; Next walks it. */
export function TwoMinuteClinic({ start = 0, order }: { start?: number; order?: string[] }) {
  const [seq] = React.useState(() => (order ?? []).map((id) => CLINICS.findIndex((c) => c.id === id)).filter((i) => i >= 0));
  const [itemIdx, setItemIdx] = React.useState(() => (seq.length ? seq[0] : ((Math.floor(start) % CLINICS.length) + CLINICS.length) % CLINICS.length));
  const advance = (i: number) => (seq.length ? seq[(seq.indexOf(i) + 1) % seq.length] : (i + 1) % CLINICS.length);
  const [phase, setPhase] = React.useState<"read" | "type" | "compare">("read");
  const [seconds, setSeconds] = React.useState(120);
  const [differential, setDifferential] = React.useState("");
  const [nextQuestion, setNextQuestion] = React.useState("");
  const item = CLINICS[itemIdx];
  // The clock stops while the how-to is open.
  const { open: paused } = useHowTo("two-minute-clinic");
  const reaction = useReaction();

  React.useEffect(() => {
    if (phase !== "type" || paused) return;
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
  }, [phase, paused]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
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
            onClick={() => { startHowTo("two-minute-clinic"); setPhase("type"); setSeconds(120); haptic("tap"); }}
            className="mt-4 rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            Start the clock
          </button>
        ) : null}
      </div>

      {phase === "type" ? (
        <div className="space-y-3 rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
          <div>
            <label className="text-small font-medium" htmlFor="diff">Your differential (top 2-3)</label>
            <textarea enterKeyHint="enter"
              id="diff"
              value={differential}
              onChange={(e) => setDifferential(e.target.value)}
              rows={2}
              placeholder="e.g. Depression, adjustment disorder, anaemia"
              className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-small font-medium" htmlFor="nextq">Your next question</label>
            <textarea enterKeyHint="enter"
              id="nextq"
              value={nextQuestion}
              onChange={(e) => setNextQuestion(e.target.value)}
              rows={2}
              placeholder="e.g. 'How have you been sleeping lately?'"
              className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase("compare");
              haptic("success");
              const m = differentialMatch(differential, item.expertDifferential);
              if (m !== "none") reaction.onAnswer(true, { partial: m === "listed" });
              // Retention loop: completing the daily drill keeps the streak alive.
              fetch("/api/practice/clinic/complete", { method: "POST" }).catch(() => {});
            }}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            Compare with the expert
          </button>
        </div>
      ) : null}

      {phase === "compare" ? (
        <div className="space-y-3 rounded-lg border-2 border-border bg-card p-5 hard-shadow-sm">
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
            onClick={() => {
              // Seen (there is no right or wrong here): it goes behind the ones not seen yet.
              noteAnswer("two-minute", item.id, null);
              setItemIdx(advance);
              setPhase("read");
              setDifferential(""); setNextQuestion("");
              haptic("tap");
            }}
            className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
          >
            Next one-liner
          </button>
        </div>
      ) : null}
    </div>
  );
}
