import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, History, MinusCircle, PlusCircle, Circle } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { EXAM_SPECS, PRACTICE_MARKING, PRACTICE_SPECS, specById } from "@/content/prep/specs";
import { EXAM_TRACKS_ENABLED, goalLabel } from "@/lib/prep/catalog";
import { loadMockHistory } from "@/lib/prep/server";
import { cn } from "@/lib/utils";
import { BackToPrep, PrepFrame, btnPlain, btnPrimary, card } from "../ui";
import { currentGoal, prepViewer } from "../viewer";
import { PatternFacts, marksText, totalQuestions } from "./facts";

export const metadata: Metadata = { title: "Psychology mock tests" };

/**
 * /prep/mock. Exam tracks off: the shared psychology mocks (one full-length
 * mixed paper, one sectional test per subject group) with the practice
 * marking spelled out. Exam tracks on: your exam's patterns first, every
 * other pattern one tap away, the shared mocks after them.
 */
export default async function MocksPage() {
  await requireFeature("learn");
  const me = await prepViewer();
  const [goal, history] = await Promise.all([currentGoal(me.id), loadMockHistory(me.id, 5)]);
  const done = history.filter((h) => h.submittedAt);
  const [full, ...parts] = PRACTICE_SPECS;
  const mine = EXAM_TRACKS_ENABLED ? (goal ? EXAM_SPECS.filter((s) => s.exam === goal) : EXAM_SPECS) : [];
  const others = EXAM_TRACKS_ENABLED && goal ? EXAM_SPECS.filter((s) => s.exam !== goal) : [];

  return (
    <PrepFrame>
      <BackToPrep />
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Timed mocks{goal ? ` · ${goalLabel(goal)}` : ""}</p>
        <h1 className="text-h1">Psychology mock tests</h1>
        <p className="text-muted-foreground">Timed papers with marking. Mostly questions you haven&apos;t seen.</p>
      </header>

      {mine.length ? (
        <ul className="space-y-3">
          {mine.map((s, i) => (
            <li key={s.id} className={cn(card, i === 0 && "hard-shadow-md")}>
              <h2 className="text-h3">{s.title}</h2>
              <div className="mt-3">
                <PatternFacts spec={s} compact />
              </div>
              <Link href={`/prep/mock/${s.id}`} className={cn(i === 0 ? btnPrimary : btnPlain, "mt-4 w-full")}>
                Open <ArrowRight className="size-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <section aria-labelledby="marking" className={cn(card, "space-y-2")}>
        <h2 id="marking" className="text-h3">
          How marking works
        </h2>
        <ul className="grid gap-1.5 text-sm sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <PlusCircle className="size-4 shrink-0" aria-hidden /> Right: +{marksText(PRACTICE_MARKING.right)}
          </li>
          <li className="flex items-center gap-2">
            <MinusCircle className="size-4 shrink-0" aria-hidden /> Wrong: minus {marksText(-PRACTICE_MARKING.wrong)}
          </li>
          <li className="flex items-center gap-2">
            <Circle className="size-4 shrink-0" aria-hidden /> Blank: 0
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">Practice marking, the same on every mock here. It is not any one exam&apos;s scheme. Guess only when you can rule out two options.</p>
      </section>

      <section aria-labelledby="full" className={cn(card, !mine.length && "hard-shadow-md")}>
        <h2 id="full" className="text-h3">
          {full.title}
        </h2>
        <div className="mt-3">
          <PatternFacts spec={full} compact />
        </div>
        <Link href={`/prep/mock/${full.id}`} className={cn(mine.length ? btnPlain : btnPrimary, "mt-4 w-full")}>
          Open <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="parts" className="space-y-2">
        <h2 id="parts" className="text-h3">
          Shorter sectional tests
        </h2>
        <p className="text-sm text-muted-foreground">
          {totalQuestions(parts[0])} questions, {parts[0].minutes} minutes, one subject group.
        </p>
        <ul className="space-y-2">
          {parts.map((s) => (
            <li key={s.id}>
              <Link href={`/prep/mock/${s.id}`} className={cn(btnPlain, "w-full justify-between")}>
                <span className="min-w-0 truncate">{s.short}</span> <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {others.length ? (
        <details className="rounded-md border-2 border-foreground bg-card">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60">Other exams</summary>
          <ul className="space-y-2 border-t-2 border-foreground p-4">
            {others.map((s) => (
              <li key={s.id}>
                <Link href={`/prep/mock/${s.id}`} className={cn(btnPlain, "w-full justify-between")}>
                  <span className="min-w-0 truncate">{s.title}</span> <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {done.length ? (
        <section aria-labelledby="past" className="space-y-2">
          <h2 id="past" className="flex items-center gap-2 text-h3">
            <History className="size-5" aria-hidden /> Your past mocks
          </h2>
          <ul className="space-y-2">
            {done.map((h) => (
              <li key={h.id}>
                <Link href={`/prep/mock/result/${h.id}`} className={cn(btnPlain, "w-full justify-between")}>
                  <span className="min-w-0 truncate">{specById(h.specId)?.short ?? h.specId}</span>
                  <span className="shrink-0 font-mono">
                    {h.score ?? 0} / {h.max ?? 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PrepFrame>
  );
}
