"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useExplainView, ViewToggle } from "@/components/learn/view-toggle";
import { cn } from "@/lib/utils";
import { answerPractice } from "../actions";
import { QuestionView, type Pick, type QView } from "../question";
import { btnInk, btnPlain, btnPrimary } from "../ui";

export type PracticeQ = QView & { answer: number | boolean; student: string; clinician: string; label: string };

/** A short adaptive round: answer, see why, next. Every answer is saved to the student model. */
export function PracticeRunner({ questions, title, saving }: { questions: PracticeQ[]; title: string; saving: boolean }) {
  const router = useRouter();
  const view = useExplainView();
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<Pick>(null);
  const [checked, setChecked] = React.useState(false);
  const [right, setRight] = React.useState(0);
  const [refreshing, startRefresh] = React.useTransition();
  const startedAt = React.useRef(0);
  const heading = React.useRef<HTMLHeadingElement>(null);
  const feedback = React.useRef<HTMLDivElement>(null);
  const first = React.useRef(true);

  React.useEffect(() => {
    startedAt.current = Date.now();
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [idx]);

  React.useEffect(() => {
    if (checked) feedback.current?.focus();
  }, [checked]);

  if (!questions.length) {
    return (
      <div className="rounded-lg border-2 border-foreground bg-card p-5">
        <p className="font-bold">No questions for this yet.</p>
        <Link href="/study/map" className={cn(btnPlain, "mt-4")}>
          <ArrowLeft className="size-4" aria-hidden /> Back to your map
        </Link>
      </div>
    );
  }

  const done = idx >= questions.length;
  if (done) {
    return (
      <div className="space-y-5 rounded-lg border-2 border-foreground bg-card p-5 hard-shadow-md sm:p-6">
        <p className="text-eyebrow text-link">Round done</p>
        <p className="text-h2">
          {right} of {questions.length} right
        </p>
        <p className="text-muted-foreground">
          {saving ? "Your map has been updated. The next round adapts to these answers." : "Preview only: answers are not saved for staff accounts."}
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={btnPrimary} disabled={refreshing} onClick={() => startRefresh(() => router.refresh())}>
            <RotateCcw className="size-4" aria-hidden /> {refreshing ? "Picking questions…" : "Another round"}
          </button>
          <Link href="/study/map" className={btnPlain}>
            <ArrowLeft className="size-4" aria-hidden /> Back to your map
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const ok = checked && picked === q.answer;

  function check(p: Pick = picked) {
    if (p === null || checked) return;
    const isRight = p === q.answer;
    setPicked(p);
    setChecked(true);
    if (isRight) setRight((r) => r + 1);
    const ms = Math.max(0, Math.min(3_600_000, Date.now() - startedAt.current));
    void answerPractice({ item: q.id, choice: p, ms }).catch(() => undefined);
  }

  function next() {
    setIdx((i) => i + 1);
    setPicked(null);
    setChecked(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold">
          <span className="sr-only">{title}: </span>Question {idx + 1}
        </p>
        <ViewToggle />
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
        <div className="h-full origin-left bg-brand transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${idx / questions.length})` }} />
      </div>
      <p className="text-caption text-muted-foreground">{q.label}</p>

      <QuestionView key={q.id} q={q} picked={picked} answer={checked ? q.answer : undefined} headingRef={heading} onPick={(p) => (q.kind === "tf" ? check(p) : setPicked(p))} />

      {!checked && q.kind === "mcq" ? (
        <button type="button" className={cn(btnPrimary, "w-full text-base")} disabled={picked === null} onClick={() => check()}>
          Check
        </button>
      ) : null}

      {checked ? (
        <div
          ref={feedback}
          tabIndex={-1}
          aria-live="polite"
          className={cn("space-y-3 rounded-md border-2 border-foreground p-4 outline-none", ok ? "bg-status-success-bg text-status-success-fg" : "bg-status-alert-bg text-status-alert-fg")}
        >
          <p className="flex items-center gap-2 text-lg font-bold">
            {ok ? <Check className="size-5" aria-hidden /> : <X className="size-5" aria-hidden />}
            {ok ? "Right" : "Not quite"}
          </p>
          <p className="text-foreground">{view === "clinician" ? q.clinician : q.student}</p>
          <button type="button" className={cn(btnInk, "w-full")} onClick={next}>
            {idx + 1 === questions.length ? "See how you did" : "Next"} <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
