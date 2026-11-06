"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Compass, HelpCircle, Map as MapIcon, RotateCcw, Sprout, TriangleAlert } from "lucide-react";
import type { PlacementResult, PlacementTopic } from "@/lib/learn/model/placement";
import { cn } from "@/lib/utils";
import { QuestionView, type Pick, type QView } from "../map/question";
import { btnInk, btnPlain, btnPrimary } from "../map/ui";
import { submitPlacement } from "./actions";

type Answer = { item: string; choice: number | boolean | "skip" };

export function PlacementRunner({ questions, previous, saving }: { questions: QView[]; previous: { doneAt: string; result: PlacementResult } | null; saving: boolean }) {
  const [stage, setStage] = React.useState<"intro" | "quiz" | "sending" | "done">(previous ? "done" : "intro");
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState<Pick>(null);
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [result, setResult] = React.useState<PlacementResult | null>(previous?.result ?? null);
  const [failed, setFailed] = React.useState(false);
  const heading = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (stage === "quiz") heading.current?.focus();
  }, [idx, stage]);

  async function send(list: Answer[]) {
    setStage("sending");
    setFailed(false);
    try {
      const r = await submitPlacement(list);
      setResult(r.result);
      setStage("done");
    } catch {
      setFailed(true);
      setStage("quiz");
    }
  }

  function answer(choice: number | boolean | "skip") {
    const q = questions[idx];
    const list = [...answers.filter((a) => a.item !== q.id), { item: q.id, choice }];
    setAnswers(list);
    setPicked(null);
    if (idx + 1 >= questions.length) void send(list);
    else setIdx(idx + 1);
  }

  function restart() {
    setAnswers([]);
    setIdx(0);
    setPicked(null);
    setStage("quiz");
  }

  if (stage === "intro") {
    return (
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-eyebrow text-link">Placement quiz</p>
          <h1 className="text-h1">Let&apos;s see where you are</h1>
        </header>
        <div className="space-y-3 rounded-md border-2 border-foreground bg-card p-5 hard-shadow-md">
          <ul className="space-y-2">
            <li className="flex gap-2">
              <Compass className="mt-0.5 size-5 shrink-0" aria-hidden /> {questions.length} questions across every topic, about 8 minutes.
            </li>
            <li className="flex gap-2">
              <BadgeCheck className="mt-0.5 size-5 shrink-0" aria-hidden /> No marks and no rank. It only sets your starting level.
            </li>
            <li className="flex gap-2">
              <HelpCircle className="mt-0.5 size-5 shrink-0" aria-hidden /> Not sure? Tap &quot;I don&apos;t know yet&quot;. Guessing makes your map less useful.
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
    return <Results result={result} doneAt={previous && result === previous.result ? previous.doneAt : null} saving={saving} onRetake={restart} />;
  }

  const q = questions[idx];
  return (
    <div className="space-y-5">
      <h1 className="sr-only">Placement quiz</h1>
      <div className="flex items-center justify-between gap-3 text-sm font-bold">
        <span>
          Question {Math.min(idx + 1, questions.length)} of {questions.length}
        </span>
        <span className="text-muted-foreground">{q.topic}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
        <div className="h-full origin-left bg-brand transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${idx / questions.length})` }} />
      </div>
      {failed ? (
        <p role="alert" className="flex items-center gap-2 rounded-md border-2 border-foreground bg-status-alert-bg p-3 font-semibold text-status-alert-fg">
          <TriangleAlert className="size-5 shrink-0" aria-hidden /> Couldn&apos;t send your answers. Check your connection and try again.
        </p>
      ) : null}
      {failed ? (
        <button type="button" className={cn(btnPrimary, "w-full")} onClick={() => void send(answers)}>
          Try again
        </button>
      ) : (
        <>
          <QuestionView key={q.id} q={q} picked={picked} onPick={setPicked} headingRef={heading} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button type="button" className={btnPlain} disabled={stage === "sending"} onClick={() => answer("skip")}>
              I don&apos;t know yet
            </button>
            <button type="button" className={btnInk} disabled={picked === null || stage === "sending"} onClick={() => picked !== null && answer(picked)}>
              {stage === "sending" ? "Working out your level…" : idx + 1 === questions.length ? "Finish" : "Next"} <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function TopicRow({ t, tone }: { t: PlacementTopic; tone: "strong" | "okay" | "weak" }) {
  const Icon = tone === "strong" ? BadgeCheck : tone === "weak" ? TriangleAlert : Sprout;
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-md border-2 border-foreground bg-card p-3">
      <Icon className="size-5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 font-bold">{t.title}</span>
      <span className="text-sm text-muted-foreground">
        {t.right} of {t.total} right
      </span>
      {tone === "weak" ? (
        <Link href={`/study/map/practice?topic=${encodeURIComponent(t.topic)}`} className={cn(btnPlain, "w-full sm:w-auto")}>
          Fix it
        </Link>
      ) : null}
    </li>
  );
}

function Results({ result, doneAt, saving, onRetake }: { result: PlacementResult; doneAt: string | null; saving: boolean; onRetake: () => void }) {
  const strong = result.topics.filter((t) => t.level === "strong");
  const okay = result.topics.filter((t) => t.level === "okay");
  const weak = result.topics.filter((t) => t.level === "weak").reverse();
  const groups: { key: "strong" | "okay" | "weak"; title: string; list: PlacementTopic[] }[] = [
    { key: "strong", title: "Strengths", list: strong },
    { key: "weak", title: "Work on these", list: weak },
    { key: "okay", title: "Getting there", list: okay },
  ];
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-eyebrow text-link">Placement quiz</p>
        <h1 className="text-h1">
          {result.right} of {result.answered} right
        </h1>
        <p className="text-muted-foreground">
          {doneAt ? `You took this on ${new Date(doneAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" })}. ` : ""}
          {saving ? "Your map now starts from here, and practice is pitched at your level." : "Preview only: nothing was saved for this staff account."}
        </p>
      </header>
      {groups.map((g) =>
        g.list.length ? (
          <section key={g.key} aria-labelledby={`pl-${g.key}`} className="space-y-2">
            <h2 id={`pl-${g.key}`} className="text-h3">
              {g.title}
            </h2>
            <ul className="space-y-2">
              {g.list.map((t) => (
                <TopicRow key={t.topic} t={t} tone={g.key} />
              ))}
            </ul>
          </section>
        ) : null,
      )}
      <div className="flex flex-wrap gap-3">
        <Link href="/study/map" className={btnPrimary}>
          <MapIcon className="size-4" aria-hidden /> See your map
        </Link>
        <button type="button" className={btnPlain} onClick={onRetake}>
          <RotateCcw className="size-4" aria-hidden /> Take it again
        </button>
      </div>
    </div>
  );
}
