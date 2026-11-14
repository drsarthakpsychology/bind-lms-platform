"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { SMALL_THINGS, smallItem } from "@/lib/mse/small-things";
import { noteAnswer } from "@/lib/history/client";
import { clearCaseProgress, saveCaseProgress } from "@/lib/cases/progress-client";
import { RecycleNote } from "@/components/cases/case-mark";
import { OnceHint } from "@/components/help/once-hint";
import { EndReaction } from "@/components/reactions/graphics";

/**
 * The small things checklist (v5 Part 2.2) as a drill: a moment in an
 * interview is shown, the student says what it means (read), then the move.
 * Novices never notice these; this trains the noticing.
 */
export function SmallThingsDrill({ walk }: { walk?: { order: string[]; start: number; fresh: number } }) {
  // Fresh cases (src/lib/cases): moments never seen first, done ones last; it opens where it was left.
  const [items] = React.useState(() => {
    const byId = new Map(SMALL_THINGS.map((x) => [x.id, x]));
    const list = (walk?.order ?? []).map((id) => byId.get(id)).filter((x): x is (typeof SMALL_THINGS)[number] => !!x);
    return list.length === SMALL_THINGS.length ? list : SMALL_THINGS;
  });
  const [idx, setIdx] = React.useState(() => Math.min(Math.max(0, walk?.start ?? 0), items.length - 1));
  const [revealed, setRevealed] = React.useState(false);

  const item = items[idx % items.length];
  const done = idx >= items.length;
  const seen = done ? items : items.slice(0, idx + (revealed ? 1 : 0));
  const recycled = walk !== undefined && !done && idx >= walk.fresh;

  function next() {
    setRevealed(false);
    const to = idx + 1;
    setIdx(to);
    if (to < items.length) saveCaseProgress("mse-small", "walk", { at: items[to].id });
    else clearCaseProgress("mse-small", "walk");
    haptic("tap");
  }

  return (
    <div className="space-y-3">
      {recycled && !revealed ? <RecycleNote /> : null}
      {!done ? (
        <div className="rounded-lg border-2 border-border bg-background p-4">
          <p className="text-caption font-semibold text-muted-foreground">
            The small things · {idx + 1} · {item.skill}
          </p>
          <p className="mt-2 text-small leading-relaxed">
            &quot;{item.moment}&quot;
          </p>

          {!revealed ? (
            <div className="mt-3">
              <OnceHint id="mse-small-things" className="text-caption text-muted-foreground">
                Take a beat: what did you actually just see?
              </OnceHint>
              <button
                type="button"
                onClick={() => {
                  setRevealed(true);
                  // Seen (nothing is graded here): it goes behind the ones not seen yet.
                  noteAnswer("mse-trainer", smallItem(item.id), null);
                  haptic("success");
                }}
                className="mt-2 min-h-11 rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Reveal the read
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="rounded-md border border-border bg-secondary/40 p-3 text-small">
                <span className="font-semibold text-muted-foreground">What it means: </span>
                {item.read}
              </p>
              <p className="rounded-md border border-border bg-background p-3 text-small">
                <span className="font-semibold text-muted-foreground">The move: </span>
                {item.move}
              </p>
              <button
                type="button"
                onClick={next}
                className="min-h-11 rounded-md border-2 border-border bg-primary px-4 py-1.5 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
              >
                Next observation
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-border bg-background p-4 text-small text-muted-foreground">
          {/* The finish sticker: no score here, so finishing is a win. */}
          <EndReaction mood="streak" seed="mse-small-things" />
          Every small thing you practice here is a real second-channel of the
          MSE. Module reviews love the ones nobody notices: the past tense, the
          pause, the look at the family member.
        </div>
      )}

      {/* Reference card: only the moments already read, so it never gives away the next one. */}
      {seen.length > 0 ? (
        <details className="rounded-md border border-border bg-background p-3">
          <summary className="flex min-h-11 cursor-pointer items-center text-caption font-medium text-muted-foreground">The reference card</summary>
          <ul className="mt-2 space-y-1.5">
            {seen.map((s) => (
              <li key={s.id} className="text-small">
                <span className="font-medium">{s.moment}</span>
                <span className="text-muted-foreground">: {s.read}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}