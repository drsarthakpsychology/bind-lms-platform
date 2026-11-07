"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, TriangleAlert, X } from "lucide-react";
import type { PrepQView, PrepReveal } from "@/lib/prep/view";
import { cn } from "@/lib/utils";
import { checkAnswer } from "../actions";
import { KeysHint, Options, QuestionBody, useShortcuts } from "../question";
import { btnInk, btnPlain, btnPrimary, card } from "../ui";

type Checked = PrepReveal & { correct: boolean; picked: number };

/**
 * A short round: pick, check, read why, next. Each answer is checked on the
 * server (the answer is never in the page) and goes to the student model.
 */
export function PracticeRunner({ questions: initial, title, saving, empty, againLabel = "Another round" }: { questions: PrepQView[]; title: string; saving: boolean; empty: React.ReactNode; againLabel?: string }) {
  const router = useRouter();
  const [questions] = React.useState(initial);
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState<Checked | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [right, setRight] = React.useState(0);
  const [refreshing, startRefresh] = React.useTransition();
  const startedAt = React.useRef(0);
  const heading = React.useRef<HTMLHeadingElement>(null);
  const feedback = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);

  React.useEffect(() => {
    startedAt.current = performance.now();
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [idx]);

  React.useEffect(() => {
    if (checked) feedback.current?.focus();
  }, [checked]);

  const done = idx >= questions.length;
  const q = questions[Math.min(idx, questions.length - 1)];

  async function check() {
    if (picked === null || checked || busy || !q) return;
    setBusy(true);
    setFailed(false);
    const ms = Math.max(0, Math.min(3_600_000, performance.now() - startedAt.current));
    try {
      const r = await checkAnswer({ id: q.id, choice: picked, ms });
      setChecked({ ...r, picked });
      if (r.correct) setRight((n) => n + 1);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  function next() {
    if (!checked) return;
    setIdx((i) => i + 1);
    setPicked(null);
    setChecked(null);
  }

  useShortcuts({
    pick: (i) => !done && !checked && setPicked(i),
    next: () => (checked ? next() : void check()),
  });

  if (!questions.length) return <div className={card}>{empty}</div>;

  if (done) {
    return (
      <div className={cn(card, "space-y-5 hard-shadow-md sm:p-6")}>
        <p className="text-eyebrow text-link">Round done</p>
        <p className="text-h2">
          {right} of {questions.length} right
        </p>
        <p className="text-muted-foreground">{saving ? "Your plan has been updated. The next round adapts to these answers." : "Staff preview: answers are not saved."}</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <button type="button" className={btnPrimary} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>
            <RotateCcw className="size-4" aria-hidden /> {refreshing ? "Picking questions…" : againLabel}
          </button>
          <Link href="/prep" className={btnPlain}>
            <ArrowLeft className="size-4" aria-hidden /> Back to your plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">
          <span className="sr-only">{title}: </span>Question {idx + 1} of {questions.length}
        </p>
        <KeysHint />
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
        <div className="h-full origin-left bg-brand transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${idx / questions.length})` }} />
      </div>

      <QuestionBody key={q.id} q={q} headingRef={heading} />
      <Options q={q} picked={checked ? checked.picked : picked} onPick={setPicked} answer={checked?.answer} disabled={busy} />

      {failed ? (
        <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          <TriangleAlert className="size-4 shrink-0" aria-hidden /> Couldn&apos;t check that. Check your connection and try again.
        </p>
      ) : null}

      {!checked ? (
        <button type="button" className={cn(btnPrimary, "w-full text-base")} disabled={picked === null || busy} onClick={() => void check()}>
          {busy ? "Checking…" : "Check"}
        </button>
      ) : (
        <div
          ref={feedback}
          tabIndex={-1}
          aria-live="polite"
          className={cn("space-y-3 rounded-md border-2 border-foreground p-4 outline-none", checked.correct ? "bg-status-success-bg text-status-success-fg" : "bg-status-alert-bg text-status-alert-fg")}
        >
          <p className="flex items-center gap-2 text-lg font-bold">
            {checked.correct ? <Check className="size-5" aria-hidden /> : <X className="size-5" aria-hidden />}
            {checked.correct ? "Right" : `Not quite. The answer is ${checked.answer + 1}.`}
          </p>
          <p className="whitespace-pre-line text-foreground">{checked.explanation}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href={checked.learnHref} className={cn(btnPlain, "text-foreground")}>
              <BookOpen className="size-4" aria-hidden /> Learn this
            </Link>
            <button type="button" className={btnInk} onClick={next}>
              {idx + 1 === questions.length ? "See how you did" : "Next"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
