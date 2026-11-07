"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import type { PrepQView } from "@/lib/prep/view";
import { cn } from "@/lib/utils";
import { TipButton, TipPanel, useFirstTimeTip } from "@/components/help/first-time-tip";

import { LETTERS as LETTER, ROMAN } from "@/lib/prep/labels";

const option =
  "flex min-h-12 w-full min-w-0 items-start gap-3 rounded-md border-2 border-foreground bg-card px-4 py-3 text-left text-base font-medium transition-transform duration-150 motion-reduce:transition-none enabled:active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:cursor-default";
const keyBox = "mt-px grid size-7 shrink-0 place-items-center rounded-md border-2 border-current text-xs font-bold";

/** The stem, passage, statements and lists of a question (exam style). */
export function QuestionBody({ q, headingRef, number }: { q: PrepQView; headingRef?: React.Ref<HTMLHeadingElement>; number?: number }) {
  return (
    <div className="min-w-0 space-y-4 [overflow-wrap:anywhere]">
      {q.passage ? (
        <div className="max-h-[40vh] overflow-y-auto rounded-md border-2 border-dashed border-foreground/40 bg-muted px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
          <p className="mb-1 text-eyebrow text-muted-foreground">Read this</p>
          {q.passage}
        </div>
      ) : null}
      <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold leading-snug outline-none sm:text-xl">
        {number ? <span className="mr-2 font-mono text-link">Q{number}.</span> : null}
        <span className="whitespace-pre-line">{q.stem}</span>
      </h2>
      {q.statements?.length ? (
        q.type === "assertion-reason" ? (
          <dl className="space-y-2 rounded-md border-2 border-foreground bg-card p-3 text-base">
            {q.statements.slice(0, 2).map((s, i) => (
              <div key={i} className="min-w-0">
                <dt className="font-semibold">{i === 0 ? "Assertion (A)" : "Reason (R)"}</dt>
                <dd className="mt-0.5">{s}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <ol className="space-y-1.5 rounded-md border-2 border-foreground bg-card p-3 text-base">
            {q.statements.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 font-mono font-semibold">{i + 1}.</span>
                <span className="min-w-0">{s}</span>
              </li>
            ))}
          </ol>
        )
      ) : null}
      {q.lists ? (
        <div className="grid min-w-0 gap-3 rounded-md border-2 border-foreground bg-card p-3 text-sm sm:grid-cols-2 sm:text-base">
          <div>
            <p className="font-semibold">List I</p>
            <ol className="mt-1 space-y-1">
              {q.lists.left.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-6 shrink-0 font-mono font-semibold">{LETTER[i]}.</span>
                  <span className="min-w-0">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="font-semibold">List II</p>
            <ol className="mt-1 space-y-1">
              {q.lists.right.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-9 shrink-0 font-mono font-semibold">{ROMAN[i]}.</span>
                  <span className="min-w-0">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The four options. Keys 1 to 4 are shown on each. With `answer` set, picks lock
 * and right/wrong show with an icon and a word (never colour alone).
 */
export function Options({ q, picked, onPick, answer, disabled }: { q: PrepQView; picked: number | null; onPick: (i: number) => void; answer?: number; disabled?: boolean }) {
  const locked = answer !== undefined;
  return (
    <div role="radiogroup" aria-label="Answers" className="grid gap-2.5">
      {q.options.map((label, i) => {
        const isPicked = picked === i;
        const state = locked ? (i === answer ? "right" : isPicked ? "wrong" : "idle") : isPicked ? "picked" : "idle";
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={isPicked}
            disabled={locked || disabled}
            onClick={() => onPick(i)}
            className={cn(
              option,
              state === "picked" && "bg-brand text-brand-foreground",
              state === "right" && "bg-status-success-bg text-status-success-fg",
              state === "wrong" && "bg-status-alert-bg text-status-alert-fg",
            )}
          >
            <span className={keyBox} aria-hidden>
              {state === "right" ? <Check className="size-4" /> : state === "wrong" ? <X className="size-4" /> : i + 1}
            </span>
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
              <span className="block">{label}</span>
              {state === "right" ? (
                <span className="mt-1 block text-xs font-bold uppercase">{isPicked ? "Your answer: right" : picked === null ? "Answer" : "Right answer"}</span>
              ) : state === "wrong" ? (
                <span className="mt-1 block text-xs font-bold uppercase">Your answer</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** True when a key press is meant for a text field, not a shortcut. */
export function typingIn(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  return t.isContentEditable || t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT";
}

/** Desktop shortcuts: 1 to 4 pick, N next, M mark. Ignored while typing or with modifier keys. */
export function useShortcuts(handlers: { pick?: (i: number) => void; next?: () => void; mark?: () => void }) {
  const ref = React.useRef(handlers);
  React.useEffect(() => {
    ref.current = handlers;
  });
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey || typingIn(e)) return;
      const h = ref.current;
      if (/^[1-4]$/.test(e.key) && h.pick) {
        e.preventDefault();
        h.pick(Number(e.key) - 1);
      } else if ((e.key === "n" || e.key === "N") && h.next) {
        e.preventDefault();
        h.next();
      } else if ((e.key === "m" || e.key === "M") && h.mark) {
        e.preventDefault();
        h.mark();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/**
 * Keyboard keys, only where a keyboard is likely (wide screens). Shown once,
 * then folded into a small "Keys" button.
 */
export function KeysHint({ mark = false }: { mark?: boolean }) {
  const tip = useFirstTimeTip(mark ? "prep-keys-mock" : "prep-keys");
  return (
    <>
      <TipButton tip={tip} label="Keys" className="hidden lg:inline-flex" />
      <TipPanel tip={tip} title="Keys" className="hidden lg:block lg:basis-full">
        <p>
          <kbd className="font-mono">1</kbd> to <kbd className="font-mono">4</kbd> answer · <kbd className="font-mono">N</kbd> next
          {mark ? (
            <>
              {" "}· <kbd className="font-mono">M</kbd> mark for review
            </>
          ) : null}
        </p>
      </TipPanel>
    </>
  );
}
