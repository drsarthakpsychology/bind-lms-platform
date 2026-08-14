"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { FULL_MSE_STIMULI, scoreFullMse, type MseAttemptFields, type FullMseStimulus } from "@/lib/mse/mse4-stimuli";
import { MSE_DOMAIN_ORDER, summarizeMseScore, formatDomainKey } from "@/lib/mse/ladder";
import { buildMseAttemptPayload } from "@/lib/practice/mse-attempt";
import type { MseDomainKey } from "@/lib/mse/ladder";

const TEN_MINUTES = 10 * 60;

/**
 * MSE Level 4 — Full MSE under time. Ten minutes to write the complete MSE
 * for a vignette, scored green/amber/red per domain against the expert code.
 * Amber = a defensible alternative; red = missed or wrong.
 *
 * `stimuli` comes from the live mse_stimuli table (content wiring); the static
 * bank is the fallback when the DB is empty or the fetch fails.
 */
export function FullMseLevel({
  onComplete,
  stimuli = FULL_MSE_STIMULI,
}: {
  onComplete?: () => void;
  stimuli?: FullMseStimulus[];
}) {
  const [idx, setIdx] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(TEN_MINUTES);
  const [rawText, setRawText] = React.useState<Record<string, string>>({});
  const [fields, setFields] = React.useState<MseAttemptFields>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [running, setRunning] = React.useState(true);
  const [startedAt] = React.useState(() => new Date());

  const stimulus = stimuli[idx];
  const done = submitted ? idx >= stimuli.length - 1 : false;

  // Timer.
  React.useEffect(() => {
    if (!running || submitted) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, submitted]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const urgent = secondsLeft < 120;

  function setDomain(domain: string, value: string) {
    setRawText((r) => ({ ...r, [domain]: value }));
    setFields((f) => ({
      ...f,
      [domain]: value.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
    }));
  }

  function submit() {
    setRunning(false);
    setSubmitted(true);
    haptic("success");
  }

  const scores = submitted ? scoreFullMse(stimulus, fields) : null;
  const summary = scores ? summarizeMseScore(scores) : null;
  const filled = MSE_DOMAIN_ORDER.filter((d) => (fields[d] ?? []).length > 0).length;

  /** Persist this Level 4 attempt (a check, not a test — silent on failure). */
  async function persist() {
    const completedAt = new Date();
    const payload = buildMseAttemptPayload(
      stimulus,
      "4",
      {
        // The same 0..1 score the UI shows (green + amber·0.5 over all domains).
        score: summary && summary.max > 0 ? Math.round((summary.score / summary.max) * 100) / 100 : 0,
        // The domains the student actually addressed on this case.
        labels: [...MSE_DOMAIN_ORDER].filter((d) => (fields[d] ?? []).length > 0) as string[],
      },
      startedAt,
      completedAt,
    );
    await fetch("/api/practice/mse/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {}); // silent; a check, not a test
  }

  return (
    <div className="space-y-4 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      {/* Header: timer + progress */}
      <div className="flex items-center justify-between text-small">
        <span className="text-muted-foreground">
          Level 4 · Full MSE · case {idx + 1}/{stimuli.length}
        </span>
        {running && !submitted ? (
          <span className={cn("font-mono font-semibold", urgent && "text-red-700")}>
            {mins}:{String(secs).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      {!submitted ? (
        <>
          <div className="rounded-md border border-border bg-background p-4">
            <p className="text-small font-medium">{stimulus.title}</p>
            <p className="mt-1 text-small text-muted-foreground leading-relaxed">{stimulus.context}</p>
          </div>

          <p className="text-small text-muted-foreground">
            Write the full MSE — one line per domain, comma-separated terms.
            {filled >= 7 ? " Good, keep going." : " Domain " + (filled + 1) + " of 11…"}
          </p>

          {/* Domain inputs */}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            {MSE_DOMAIN_ORDER.map((d) => (
              <label key={d} className="block">
                <span className="text-caption font-semibold text-muted-foreground">{formatDomainKey(d)}</span>
                <input
                  value={rawText[d] ?? ""}
                  onChange={(e) => setDomain(d, e.target.value)}
                  placeholder="e.g. flat, congruent"
                  className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            ))}
            <button
              type="submit"
              className="w-full rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              {secondsLeft === 0 ? "Time's up — submit" : "Submit MSE"}
            </button>
          </form>
        </>
      ) : (
        <div className="space-y-3">
          {/* Green / amber / red per domain */}
          <div className="rounded-md border border-border bg-background p-4">
            <p className="text-small font-semibold">
              Score: {summary?.green}/{summary?.max} domains matched{summary && summary.amber > 0 ? ` · ${summary.amber} amber` : ""}
              {summary && summary.red > 0 ? ` · ${summary.red} red` : ""}
            </p>
            <div className="mt-2 space-y-1.5">
              {MSE_DOMAIN_ORDER.map((d) => {
                const v = scores?.[d];
                const student = (fields[d] ?? []) as string[];
                const expert = (stimulus.expert[d as MseDomainKey] ?? []) as string[];
                return (
                  <div key={d} className={cn(
                    "flex items-start gap-2 rounded-md border px-2 py-1.5 text-small",
                    v === "green" && "border-green-400 bg-green-50 text-green-800",
                    v === "amber" && "border-amber-400 bg-amber-50 text-amber-800",
                    v === "red" && "border-red-400 bg-red-50 text-red-800",
                  )}>
                    <span className="font-semibold w-28 shrink-0">{formatDomainKey(d)}</span>
                    <span className="flex-1">
                      <span className="font-medium">You: </span>
                      {student.length ? student.join(", ") : "(none)"}
                      <span className="text-caption opacity-70"> · Expert: {expert && expert.length ? expert.join(", ") : "no finding"}</span>
                    </span>
                    <span className="font-bold uppercase text-caption">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* The teaching summary */}
          <div className="rounded-md border border-border bg-secondary/40 p-3 text-small text-muted-foreground">
            <span className="font-semibold">The lesson: </span>
            green is what the expert coded. amber is defensible — that&apos;s real
            clinical judgment, not a miss. red is where the patient actually
            presented something and you didn&apos;t describe it. The MSE is a
            description of what you saw; if you didn&apos;t see it, say so — describing
            the absence is still an observation.
          </div>

          {!done && onComplete ? (
            <button
              type="button"
              onClick={() => {
                setIdx((i) => i + 1);
                setFields({});
                setRawText({});
                setSubmitted(false);
                setRunning(true);
                setSecondsLeft(TEN_MINUTES);
                haptic("tap");
              }}
              className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Next case
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-small text-green-700" role="status">
                All Level 4 cases written. Ten minutes, full MSE, scored per domain.
              </p>
              {onComplete ? (
                <button
                  type="button"
                  onClick={() => {
                    haptic("success");
                    void persist();
                    onComplete();
                  }}
                  className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
                >
                  Mark Level 4 complete
                </button>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}