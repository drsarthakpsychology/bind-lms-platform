"use client";

import * as React from "react";
import { startHowTo } from "@/components/help/how-to";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, BookOpen, Check, Eye, RotateCcw, TriangleAlert, X } from "lucide-react";
import type { PrepQView, PrepReveal } from "@/lib/prep/view";
import { cn } from "@/lib/utils";
import { checkAnswer, revealAnswer, toggleSaved } from "./actions";
import { KEYS, KeysHint, Options, QuestionBody, useShortcuts } from "./question";
import { btnInk, btnPlain, btnPrimary, card } from "./ui";
import { PrepVisualView } from "./visual";

/** A revealed question: `correct` is null when the student asked to see the answer without answering. */
type Result = PrepReveal & { correct: boolean | null; picked: number | null };

export type RunnerProps = {
  questions: PrepQView[];
  /** Where to open (the first unanswered question). */
  start?: number;
  /** Last result per question from before this visit (for the score at the end). */
  prior?: Record<string, boolean>;
  saved?: string[];
  /** Saving is set up (the bank table exists) and this viewer is a student. */
  canSave: boolean;
  /** Staff preview: nothing is recorded. */
  preview: boolean;
  /** For screen readers: what this set is. */
  label: string;
  /** The next set, if there is one. */
  next?: { href: string; label: string } | null;
  /** "reset" goes round the same questions again; "refresh" asks the server for a new set. */
  again: "reset" | "refresh";
  againLabel?: string;
  back: { href: string; label: string };
  empty: React.ReactNode;
};

/**
 * Answer, see right or wrong, the correct answer and the full explanation,
 * then go on. Any question can be saved. Answers are checked on the server
 * (the answer is never in the page before you answer) and kept, so a set
 * picks up where it was left.
 */
export function QuestionRunner({ questions, start = 0, prior = {}, saved: initialSaved = [], canSave, preview, label, next, again, againLabel, back, empty }: RunnerProps) {
  const router = useRouter();
  const [idx, setIdx] = React.useState(() => Math.min(Math.max(0, start), Math.max(0, questions.length - 1)));
  const [picked, setPicked] = React.useState<number | null>(null);
  const [results, setResults] = React.useState<Record<string, Result>>({});
  const [saved, setSaved] = React.useState<ReadonlySet<string>>(() => new Set(initialSaved));
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [refreshing, startRefresh] = React.useTransition();
  const startedAt = React.useRef(0);
  const heading = React.useRef<HTMLHeadingElement>(null);
  const feedback = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);

  const done = idx >= questions.length;
  const q = questions[Math.min(idx, questions.length - 1)];
  const result = q ? results[q.id] : undefined;

  React.useEffect(() => {
    startedAt.current = performance.now();
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [idx]);

  React.useEffect(() => {
    if (result) feedback.current?.focus();
  }, [result]);

  async function check() {
    if (picked === null || result || busy || !q) return;
    setBusy(true);
    setFailed(false);
    const ms = Math.max(0, Math.min(3_600_000, performance.now() - startedAt.current));
    try {
      const r = await checkAnswer({ id: q.id, choice: picked, ms });
      setResults((m) => ({ ...m, [q.id]: { ...r, picked } }));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function show() {
    if (result || busy || !q) return;
    setBusy(true);
    setFailed(false);
    try {
      const r = await revealAnswer(q.id);
      setResults((m) => ({ ...m, [q.id]: { ...r, correct: null, picked: null } }));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  function go(to: number) {
    setIdx(to);
    setPicked(null);
    setFailed(false);
  }

  async function flipSave(id: string) {
    const on = !saved.has(id);
    const set = (v: boolean) =>
      setSaved((s) => {
        const n = new Set(s);
        if (v) n.add(id);
        else n.delete(id);
        return n;
      });
    set(on);
    const r = await toggleSaved({ id, saved: on }).catch(() => ({ ok: false }));
    if (!r.ok) set(!on);
  }

  // The first answer closes the Keys how-to (it folds into its button).
  const pickOne = (i: number) => {
    startHowTo(KEYS);
    setPicked(i);
  };

  useShortcuts({
    pick: (i) => !done && !result && pickOne(i),
    next: () => (result ? go(idx + 1) : void check()),
  });

  if (!questions.length) return <div className={card}>{empty}</div>;

  if (done) {
    let right = 0;
    let answered = 0;
    for (const x of questions) {
      const ok = results[x.id] ? results[x.id].correct : prior[x.id];
      if (ok === true || ok === false) answered++;
      if (ok === true) right++;
    }
    return (
      <div className={cn(card, "space-y-5 hard-shadow-md sm:p-6")} role="status">
        <p className="text-eyebrow text-link">Set done</p>
        <p className="text-h2">
          {right} of {questions.length} right
        </p>
        {answered < questions.length ? <p className="text-muted-foreground">{questions.length - answered} not answered yet.</p> : null}
        {preview ? <p className="text-sm text-muted-foreground">Staff preview: answers are not saved.</p> : null}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {next ? (
            <Link href={next.href} className={btnPrimary}>
              {next.label} <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
          {again === "reset" ? (
            <button type="button" className={next ? btnPlain : btnPrimary} onClick={() => go(0)}>
              <RotateCcw className="size-4" aria-hidden /> {againLabel ?? "Go through again"}
            </button>
          ) : (
            <button type="button" className={next ? btnPlain : btnPrimary} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>
              <RotateCcw className="size-4" aria-hidden /> {refreshing ? "Picking questions…" : (againLabel ?? "Another set")}
            </button>
          )}
          <Link href={back.href} className={btnPlain}>
            <ArrowLeft className="size-4" aria-hidden /> {back.label}
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = saved.has(q.id);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          <span className="sr-only">{label}: </span>Question {idx + 1}
        </p>
        <div className="flex items-center gap-2">
          {idx > 0 ? (
            <button type="button" onClick={() => go(idx - 1)} className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-bold text-link hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
          ) : null}
          {canSave ? (
            <button
              type="button"
              aria-pressed={isSaved}
              onClick={() => void flipSave(q.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground px-3 text-sm font-bold transition-transform duration-150 active:translate-y-px motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
                isSaved ? "bg-foreground text-background" : "bg-card",
              )}
            >
              {isSaved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
              {isSaved ? "Saved" : "Save"}
            </button>
          ) : null}
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
        <div className="h-full origin-left bg-brand transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${idx / questions.length})` }} />
      </div>

      <QuestionBody key={q.id} q={q} headingRef={heading} />
      <Options q={q} picked={result ? result.picked : picked} onPick={pickOne} answer={result?.answer} disabled={busy} />

      {failed ? (
        <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          <TriangleAlert className="size-4 shrink-0" aria-hidden /> Couldn&apos;t reach the server. Check your connection and try again.
        </p>
      ) : null}

      {!result ? (
        <div className="space-y-2">
          <button type="button" className={cn(btnPrimary, "w-full text-base")} disabled={picked === null || busy} onClick={() => void check()}>
            {busy ? "Checking…" : "Check answer"}
          </button>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={() => void show()} disabled={busy} className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">
              <Eye className="size-4" aria-hidden /> Show the answer
            </button>
            <KeysHint />
          </div>
        </div>
      ) : (
        <div
          ref={feedback}
          tabIndex={-1}
          aria-live="polite"
          className={cn(
            "min-w-0 space-y-3 rounded-md border-2 border-foreground p-4 outline-none [overflow-wrap:anywhere]",
            result.correct === true ? "bg-status-success-bg text-status-success-fg" : result.correct === false ? "bg-status-alert-bg text-status-alert-fg" : "bg-card",
          )}
        >
          <p className="flex items-center gap-2 text-lg font-bold">
            {result.correct === true ? <Check className="size-5 shrink-0" aria-hidden /> : result.correct === false ? <X className="size-5 shrink-0" aria-hidden /> : <Eye className="size-5 shrink-0" aria-hidden />}
            {result.correct === true ? "Right" : result.correct === false ? "Wrong" : "The answer"}
          </p>
          <p className="font-semibold text-foreground">
            Correct answer: {result.answer + 1}. {q.options[result.answer]}
          </p>
          <p className="whitespace-pre-line text-foreground">{result.explanation}</p>
          {result.visual ? <PrepVisualView visual={result.visual} /> : null}
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href={result.learnHref} className={cn(btnPlain, "text-foreground")}>
              <BookOpen className="size-4" aria-hidden /> Learn this
            </Link>
            <button type="button" className={btnInk} onClick={() => go(idx + 1)}>
              {idx + 1 === questions.length ? "See your score" : "Next question"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
