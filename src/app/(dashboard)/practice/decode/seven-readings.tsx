"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import type { IdiomEntry } from "@/lib/decode/idioms";

const SEVEN_READINGS = [
  { key: "disease", label: "A disease", desc: "a real medical condition causing the symptom" },
  { key: "intrapsychic", label: "Symbolic expression of intrapsychic conflict", desc: "the body says what the mind can't" },
  { key: "psychopathology", label: "Specific psychopathology", desc: "a diagnosable disorder (depression, anxiety, psychosis)" },
  { key: "cultural_idiom", label: "A culturally salient idiom of distress", desc: "the socially-recognised way to say 'I'm suffering'" },
  { key: "metaphor", label: "A metaphor for experience", desc: "literal words doing figurative work ('she gives me acidity')" },
  { key: "social_positioning", label: "An act of social positioning", desc: "claiming a sick role, deflecting blame, securing care" },
  { key: "protest", label: "A form of protest", desc: "the body refuses what the person cannot refuse" },
];

/**
 * Mode 3 — Seven Readings (Kirmayer & Young). One somatic complaint in
 * context; the student assigns which of the seven readings apply and
 * justifies in one line. Often more than one is right — that's the lesson.
 */
export function SevenReadings({ entry }: { entry: IdiomEntry }) {
  type ReadingKey = (typeof SEVEN_READINGS)[number]["key"];
  const [picked, setPicked] = React.useState<Set<ReadingKey>>(new Set());
  const [revealed, setRevealed] = React.useState(false);

  const correct = new Set<ReadingKey>(entry.readings);
  const hits = [...picked].filter((p) => correct.has(p)).length;
  const misses = [...picked].filter((p) => !correct.has(p)).length;
  const missedCorrect = [...correct].filter((p) => !picked.has(p));

  function toggle(k: ReadingKey) {
    haptic("tap");
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-small text-muted-foreground">
        A somatic complaint can indicate any combination of <strong>seven</strong> things.
        You were taught one. Assign every reading that could apply.
      </p>

      <div className="rounded-md border-2 border-border bg-card p-4">
        <p className="text-caption text-muted-foreground">In context, the patient says</p>
        <p className="mt-1 text-base font-medium">&ldquo;{entry.phrase}&rdquo;</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {SEVEN_READINGS.map((r) => {
          const on = picked.has(r.key);
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => toggle(r.key)}
              disabled={revealed}
              aria-pressed={on}
              className={cn(
                "flex items-start gap-2 rounded-md border-2 border-border px-3 py-2 text-left transition-transform active:translate-y-px disabled:opacity-70",
                on ? "bg-primary text-primary-foreground" : "bg-background",
              )}
            >
              <Layers className={cn("mt-0.5 size-4 shrink-0", on ? "text-primary-foreground" : "text-muted-foreground")} aria-hidden />
              <span>
                <span className="block text-small font-medium">{r.label}</span>
                <span className={cn("block text-caption", on ? "text-primary-foreground/70" : "text-muted-foreground")}>{r.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => { setRevealed(true); haptic("success"); }}
          disabled={picked.size === 0}
          className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
        >
          Compare with the expert panel
        </button>
      ) : null}

      {revealed ? (
        <div className="rounded-md border-2 border-border bg-card p-4">
          <p className="text-base font-semibold">
            {hits} right{misses > 0 ? `, ${misses} off the mark` : ""}
          </p>
          {missedCorrect.length > 0 ? (
            <p className="mt-2 text-small">
              You missed: <span className="font-medium">{missedCorrect.join(", ")}</span>. For &quot;{entry.phrase}&quot;,
              several readings are true at once — that coexistence <em>is</em> the clinical skill.
            </p>
          ) : (
            <p className="mt-2 text-small text-muted-foreground">
              Right — &quot;{entry.phrase}&quot; genuinely spans {entry.readings.length} readings. A student who stops at one
              has already lost the case.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
