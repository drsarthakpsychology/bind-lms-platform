"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { scoreObserve } from "@/lib/mse/ladder";

const STIMULI = [
  {
    id: "obs-1",
    text: "A 19-year-old student sits in the chair across from you, arms crossed, wearing yesterday's shirt. She glances at the door twice in the first minute. When she speaks her voice is barely audible and she uses exactly eight words per answer. Her hands are clasped so tight her knuckles are white. After you ask about sleep, she is silent for eleven seconds before saying 'fine.'",
    target: 100,
  },
  {
    id: "obs-2",
    text: "A 52-year-old shopkeeper sits slumped, shoulders rolled forward, in a checked shirt that is clean but crumpled. He runs his palm across his eyes every few seconds as if tired. His speech is slow, soft, and he lets sentences trail off and restart. When the shop is mentioned, he leans forward slightly and begins to shake his foot. He maintains eye contact only when discussing business.",
    target: 100,
  },
  {
    id: "obs-3",
    text: "A 40-year-old woman is brought in by her sister. She sits very still, hands folded in her lap, and does not speak first. Her sari is neat. When she finally speaks it is in a flat, even voice, and she looks at her sister before every answer. Twice, when the sister begins to answer for her, she closes her eyes for several seconds. She is the only one in the room who has not shifted posture once.",
    target: 100,
  },
  {
    id: "obs-4",
    text: "A 26-year-old man paces the small consulting room, pausing only to glance at the clock. He sits, immediately stands, then sits again. His voice is loud and rapid, and he finishes his sentences in bursts, hands gesturing. He laughs when he describes a fight with his landlord, though nothing in the story is funny. When asked to slow down, he apologises, taps his foot continuously, and returns to the same speed within twenty seconds.",
    target: 100,
  },
  // --- v5 Part 1: Idiom-of-distress stimuli (Decoder bank) ---
  {
    id: "obs-idiom-1",
    text: "A 34-year-old clerk says: \"Doctor, there's a heaviness. I can't explain it. My body just… everything feels like a lot.\" He sits still, shoulders rolled in. When you lean in, he looks at his hands. He doesn't elaborate unless asked.",
    target: 100,
  },
  {
    id: "obs-idiom-2",
    text: "A 28-year-old engineer says: \"My heart races and I feel like I'm going to die. The doctors say my heart is fine, but it doesn't feel fine.\" Her fingers find her wrist pulse repeatedly. She breathes shallow. When you ask about sleep, she says \"I don't sleep. I watch the ceiling.\"",
    target: 100,
  },
  {
    id: "obs-idiom-3",
    text: "A 15-year-old student, brought by parents. She says nothing. The mother says: \"She says it's nothing. Koi baat nahi. But her marks fell, she stopped eating with us, she's always on the phone.\" The girl looks at the floor. Her nails are bitten to the quick.",
    target: 100,
  },
  {
    id: "obs-idiom-4",
    text: "A 45-year-old shop owner says: \"My wife dragged me here. I'm not an alcoholic. I can stop any time I want.\" He leans back, arms crossed. A faint smell of alcohol. When you ask about the bottles she found, he says: \"Business stress. That's all. Sab kuch kar liya — I've tried everything.\"",
    target: 100,
  },
];

/**
 * MSE Level 1 — Observe. The first rung of the ladder: describe what you can
 * see and hear, with zero diagnostic labels. Score = observations kept minus
 * a hard penalty per smuggled conclusion. Target: 100 words, no labels.
 */
export function ObserveLevel({ onComplete }: { onComplete?: () => void }) {
  const [idx, setIdx] = React.useState(0);
  const [text, setText] = React.useState("");
  const [roundDone, setRoundDone] = React.useState(false);
  const stimulus = STIMULI[idx];

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
    setIdx((i) => (i + 1) % STIMULI.length);
    haptic("tap");
  }

  return (
    <div className="space-y-4 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-eyebrow text-muted-foreground">
          Level 1 · Observe · stimulus {idx + 1}/{STIMULI.length}
        </p>
        <p className="text-caption text-muted-foreground">{wordCount} words · {result.score} score</p>
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <p className="text-small leading-relaxed">{stimulus.text}</p>
      </div>

      <div>
        <p className="text-small text-muted-foreground">
          Now describe what you observed. Diagnostic words are conclusions — &quot;depressed&quot;,
          &quot;anxious&quot;, &quot;manipulative&quot;. Behaviour words are observations. Target:{" "}
          <span className="font-semibold">100 words with zero labels</span>.
        </p>
        <textarea
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
                onClick={onComplete}
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