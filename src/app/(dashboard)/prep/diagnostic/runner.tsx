"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, HelpCircle, TriangleAlert } from "lucide-react";
import type { DiagnosticResult, Level } from "@/lib/prep/scoring";
import type { PrepExam } from "@/lib/prep/types";
import type { PrepQView } from "@/lib/prep/view";
import { cn } from "@/lib/utils";
import { submitDiagnostic } from "../actions";
import { KeysHint, Options, QuestionBody, useShortcuts } from "../question";
import { btnPlain, btnPrimary, card } from "../ui";

type Answer = { id: string; choice: number | null };

const LEVEL: Record<Level, { label: string; tone: string; Icon: typeof BadgeCheck }> = {
  strong: { label: "Strong", tone: "bg-status-success-bg text-status-success-fg", Icon: BadgeCheck },
  okay: { label: "Okay", tone: "bg-status-info-bg text-status-info-fg", Icon: Clock },
  weak: { label: "Weak", tone: "bg-status-alert-bg text-status-alert-fg", Icon: TriangleAlert },
};

export function DiagnosticRunner({ goal, goalName, questions: initial, saving }: { goal: PrepExam; goalName: string; questions: PrepQView[]; saving: boolean }) {
  // Frozen on first render, so a background refresh never swaps the questions mid-check.
  const [questions] = React.useState(initial);
  const [stage, setStage] = React.useState<"intro" | "quiz" | "sending" | "done">("intro");
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [result, setResult] = React.useState<DiagnosticResult | null>(null);
  const [failed, setFailed] = React.useState(false);
  const heading = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (stage === "quiz") heading.current?.focus();
  }, [idx, stage]);

  async function send(list: Answer[]) {
    setStage("sending");
    setFailed(false);
    try {
      const r = await submitDiagnostic({ goal, answers: list });
      setResult(r.result);
      setStage("done");
    } catch {
      setFailed(true);
      setStage("quiz");
    }
  }

  function answer(choice: number | null) {
    if (stage !== "quiz") return;
    const q = questions[idx];
    const list = [...answers.filter((a) => a.id !== q.id), { id: q.id, choice }];
    setAnswers(list);
    setPicked(null);
    if (idx + 1 >= questions.length) void send(list);
    else setIdx(idx + 1);
  }

  useShortcuts({
    pick: (i) => stage === "quiz" && setPicked(i),
    next: () => stage === "quiz" && picked !== null && answer(picked),
  });

  if (!questions.length) {
    return (
      <div className={card}>
        <p className="font-semibold">Questions for {goalName} are still being added.</p>
        <p className="mt-1 text-muted-foreground">The starting check opens as soon as they land.</p>
      </div>
    );
  }

  if (stage === "intro") {
    return (
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-eyebrow text-link">Starting check · {goalName}</p>
          <h1 className="text-h1">Let&apos;s see where you are</h1>
        </header>
        <div className={cn(card, "space-y-4 hard-shadow-md")}>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-5 shrink-0" aria-hidden /> {questions.length} questions across the syllabus, about {Math.max(5, Math.round(questions.length))} minutes. No timer.
            </li>
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-5 shrink-0" aria-hidden /> No marks and no rank. It builds your plan.
            </li>
            <li className="flex gap-2">
              <HelpCircle className="mt-0.5 size-5 shrink-0" aria-hidden /> Not sure? Choose &quot;I don&apos;t know yet&quot;. Guessing makes your plan less useful.
            </li>
          </ul>
          <button type="button" className={cn(btnPrimary, "w-full text-base")} onClick={() => setStage("quiz")}>
            Start <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (stage === "done" && result) {
    return (
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-eyebrow text-link">Starting check done</p>
          <h1 className="text-h1">
            {result.right} of {result.answered} right
          </h1>
          <p className="text-muted-foreground">{saving ? "Your plan is ready. Weakest, biggest topics come first." : "Staff preview: nothing was saved."}</p>
        </header>
        <section aria-labelledby="profile" className={cn(card, "space-y-3")}>
          <h2 id="profile" className="text-h3">
            Your topics
          </h2>
          <ul className="space-y-2">
            {result.topics.map((t) => {
              const l = LEVEL[t.level];
              return (
                <li key={t.subject} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border-2 border-foreground/70 px-3 py-2">
                  <span className="min-w-0 flex-1 font-medium">{t.title}</span>
                  <span className="text-caption text-muted-foreground">
                    {t.right}/{t.total}
                  </span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold", l.tone)}>
                    <l.Icon className="size-3.5" aria-hidden /> {l.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        <Link href="/prep" className={cn(btnPrimary, "w-full text-base")}>
          See your plan <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const q = questions[Math.min(idx, questions.length - 1)];
  return (
    <div className="space-y-5">
      <h1 className="sr-only">Starting check</h1>
      <div className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span>
          Question {Math.min(idx + 1, questions.length)} of {questions.length}
        </span>
        <KeysHint />
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
        <div className="h-full origin-left bg-brand transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${idx / questions.length})` }} />
      </div>
      {failed ? (
        <>
          <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 font-semibold text-status-alert-fg">
            <TriangleAlert className="size-5 shrink-0" aria-hidden /> Couldn&apos;t send your answers. Check your connection and try again.
          </p>
          <button type="button" className={cn(btnPrimary, "w-full")} onClick={() => void send(answers)}>
            Try again
          </button>
        </>
      ) : (
        <>
          <QuestionBody key={q.id} q={q} headingRef={heading} />
          <Options q={q} picked={picked} onPick={setPicked} disabled={stage === "sending"} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button type="button" className={btnPlain} disabled={stage === "sending"} onClick={() => answer(null)}>
              I don&apos;t know yet
            </button>
            <button type="button" className={btnPrimary} disabled={picked === null || stage === "sending"} onClick={() => answer(picked)}>
              {stage === "sending" ? "Building your plan…" : idx + 1 >= questions.length ? "Finish" : "Next"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
