"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { scoreObserve } from "@/lib/mse/ladder";
import { buildMseAttemptPayload, scoreMseLevel1Attempt } from "@/lib/practice/mse-attempt";
import { OBSERVE_STIMULI } from "@/lib/practice/mse-observe-stimuli";

/**
 * MSE Level 1 — Observe. The first rung of the ladder: describe what you can
 * see and hear, with zero diagnostic labels. Score = observations kept minus
 * a hard penalty per smuggled conclusion. Target: 100 words, no labels.
 *
 * `stimuli` comes from the live mse_stimuli table (content wiring); the static
 * bank is the fallback when the DB is empty or the fetch fails.
 */
export function ObserveLevel({
  onComplete,
  stimuli = OBSERVE_STIMULI,
}: {
  onComplete?: () => void;
  stimuli?: Array<{ id: string; content: string }>;
}) {
  const [idx, setIdx] = React.useState(0);
  const [text, setText] = React.useState("");
  const [roundDone, setRoundDone] = React.useState(false);
  // The attempt window starts when the level opens.
  const [startedAt] = React.useState(() => new Date());
  const stimulus = stimuli[idx];

  // Focus management for keyboard-only users
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (!roundDone && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [idx, roundDone]);

  const result = scoreObserve(text);
  const wordCount = text.trim().length ? text.trim().split(/\s+/).length : 0;

  function check() {
    setRoundDone(true);
    haptic(result.labels.length === 0 && wordCount >= 80 ? "success" : "warning");
  }

  function next() {
    setText("");
    setRoundDone(false);
    setIdx((i) => (i + 1) % stimuli.length);
    haptic("tap");
  }

  /** Persist this Level 1 attempt (a check, not a test — silent on failure). */
  async function persist() {
    const completedAt = new Date();
    const payload = buildMseAttemptPayload(
      stimulus,
      "1",
      {
        score: scoreMseLevel1Attempt(result.observations, result.labels, wordCount),
        labels: result.labels,
        observations: result.observations,
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
      <div className="flex items-center justify-between">
        <p className="text-eyebrow text-muted-foreground">
          Level 1 · Observe · stimulus {idx + 1}/{stimuli.length}
        </p>
        <p className="text-caption text-muted-foreground">{wordCount} words · {result.score} score</p>
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <p className="text-small leading-relaxed">{stimulus.content}</p>
      </div>

      <div>
        <p className="text-small text-muted-foreground">
          Now describe what you observed. Diagnostic words are conclusions — &quot;depressed&quot;,
          &quot;anxious&quot;, &quot;manipulative&quot;. Behaviour words are observations. Target:{" "}
          <span className="font-semibold">100 words with zero labels</span>.
        </p>
        <textarea enterKeyHint="enter"
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Sits slumped, voice soft, avoids eye contact when the marriage is mentioned…"
          className="mt-3 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Your observation description"
        />
      </div>

      {!roundDone ? (
        <button
          type="button"
          onClick={check}
          disabled={wordCount < 20}
          className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
        >
          Score my description
        </button>
      ) : (
        <div className="space-y-3 rounded-md border border-border bg-background p-4">
          {result.labels.length ? (
            <p className="text-small text-red-700" role="alert">
              <span className="font-semibold">Smuggled conclusions:</span>&nbsp;
              {result.labels.join(", ")}. Each one is an explanation, not an observation — it
              costs you 2 points.
            </p>
          ) : (
            <p className="text-small text-green-700" role="status">
              <span className="font-semibold">Zero labels.</span> That&apos;s the scarcer skill.
            </p>
          )}
          <p className="text-small text-muted-foreground">
            <span className="font-semibold">{result.observations}</span> observation words ·{" "}
            <span className="font-semibold">{result.score}</span> score (observations − 2×labels).
          </p>
          {wordCount < 80 ? (
            <p className="text-small text-amber-700">
              {wordCount} words — you can see more than that. Write what the clothes, the hands,
              the silences are doing.
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={next}
              className="rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
            >
              Next stimulus
            </button>
            {result.labels.length === 0 && wordCount >= 80 && onComplete ? (
              <button
                type="button"
                onClick={() => {
                  onComplete();
                  void persist();
                }}
                className="rounded-md border-2 border-border bg-secondary px-4 py-1.5 text-small font-semibold text-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Mark Level 1 complete
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
