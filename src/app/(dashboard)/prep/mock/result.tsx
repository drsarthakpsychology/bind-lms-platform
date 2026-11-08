"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, Circle, Clock, Flag, Trophy, TriangleAlert, X } from "lucide-react";
import { PREP_ONBOARDING_ENABLED } from "@/lib/prep/catalog";
import { clock } from "@/lib/prep/exam";
import type { MockResultView, ReviewRow } from "@/lib/prep/results";
import { cn } from "@/lib/utils";
import { Options, QuestionBody } from "../question";
import { btnPlain, btnPrimary, card } from "../ui";

type Filter = "all" | "wrong" | "blank" | "marked";
const FILTERS: { id: Filter; label: string; test: (r: ReviewRow) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "wrong", label: "Wrong", test: (r) => r.chosen !== null && !r.correct },
  { id: "blank", label: "Blank", test: (r) => r.chosen === null },
  { id: "marked", label: "Marked", test: (r) => r.marked },
];

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ""));

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <span className="block h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card" aria-hidden>
      <span className="block h-full origin-left bg-brand" style={{ transform: `scaleX(${pct})` }} />
    </span>
  );
}

/** Results: score, standing among VIBHA students, time, breakdowns, and a review of every question. */
export function MockResult({ view }: { view: MockResultView }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const answered = view.right + view.wrong;
  const shown = view.rows.filter(FILTERS.find((f) => f.id === filter)!.test);
  const st = view.standing;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Results · {view.title}</p>
        <h1 className="text-h1">
          {fmt(view.score)} <span className="text-muted-foreground">/ {fmt(view.max)}</span>
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { Icon: Check, label: "Right", value: view.right },
          { Icon: X, label: "Wrong", value: view.wrong },
          { Icon: Circle, label: "Blank", value: view.blank },
          { Icon: Trophy, label: "Accuracy", value: view.accuracy === null ? "None" : `${Math.round(view.accuracy * 100)}%` },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="rounded-md border-2 border-foreground bg-card p-3">
            <p className="flex items-center gap-1.5 text-2xl font-bold tabular-nums">
              <Icon className="size-5" aria-hidden /> {value}
            </p>
            <p className="text-caption text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section aria-labelledby="standing" className={cn(card, "space-y-2")}>
        <h2 id="standing" className="text-h3">
          {PREP_ONBOARDING_ENABLED ? "Among VIBHA students" : "Time"}
        </h2>
        {/* Rank among students is the track record: shown only with PREP_ONBOARDING_ENABLED. */}
        {!PREP_ONBOARDING_ENABLED ? null : !view.saved ? (
          <p className="text-muted-foreground">This attempt wasn&apos;t saved, so it has no rank.</p>
        ) : !st || st.percentile === null ? (
          <p>You&apos;re the first VIBHA student to finish this mock. Your rank appears as others take it.</p>
        ) : (
          <p>
            <strong className="font-semibold">
              Rank {st.rank} of {st.of}.
            </strong>{" "}
            You scored higher than {st.percentile}% of the others who took this mock (their best attempts).
          </p>
        )}
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden /> {clock(view.totalMs)} on the paper{answered ? `, about ${Math.round(view.totalMs / 1000 / Math.max(1, view.rows.length))} s a question` : ""}.
        </p>
        {view.late ? (
          <p className="flex items-center gap-2 text-sm font-semibold">
            <TriangleAlert className="size-4" aria-hidden /> Submitted after the time limit.
          </p>
        ) : null}
        {view.marksPerWrong < 0 && view.wrong ? (
          <p className="text-sm text-muted-foreground">
            Wrong answers cost you {fmt(-view.marksPerWrong * view.wrong)} {Math.abs(view.marksPerWrong * view.wrong) === 1 ? "mark" : "marks"}.
          </p>
        ) : null}
      </section>

      {view.sections.length > 1 ? (
        <section aria-labelledby="parts" className="space-y-2">
          <h2 id="parts" className="text-h3">
            By part
          </h2>
          <ul className="space-y-2">
            {view.sections.map((s) => (
              <li key={s.title} className="rounded-md border-2 border-foreground bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{s.title}</span>
                  <span className="font-mono text-sm">
                    {fmt(s.score)} / {fmt(s.max)}
                  </span>
                </div>
                <div className="mt-2">
                  <Bar value={s.score} max={s.max} />
                </div>
                <p className="mt-1 text-caption text-muted-foreground">
                  {s.right} right · {s.wrong} wrong · {s.blank} blank
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="subjects" className="space-y-2">
        <h2 id="subjects" className="text-h3">
          By subject, weakest first
        </h2>
        <ul className="space-y-2">
          {view.subjects.map((s) => (
            <li key={s.subject} className="rounded-md border-2 border-foreground bg-card p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 font-semibold">{s.title}</span>
                <span className="font-mono text-sm">
                  {fmt(s.score)} / {fmt(s.max)}
                </span>
              </div>
              <div className="mt-2">
                <Bar value={s.score} max={s.max} />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-caption text-muted-foreground">
                  {s.right} right · {s.wrong} wrong · {s.blank} blank
                </span>
                <Link href={s.learnHref} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-link hover:underline">
                  <BookOpen className="size-4" aria-hidden /> Learn
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="review" className="space-y-3">
        <h2 id="review" className="text-h3">
          Every question
        </h2>
        <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const n = view.rows.filter(f.test).length;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-foreground px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
                  filter === f.id ? "bg-foreground text-background" : "bg-card",
                )}
              >
                {filter === f.id ? <Check className="size-4" aria-hidden /> : null}
                {f.label} <span className="font-mono text-xs">{n}</span>
              </button>
            );
          })}
        </div>
        {shown.length ? (
          <ol className="space-y-2">
            {shown.map((r) => (
              <li key={r.q.id}>
                <ReviewItem row={r} n={view.rows.indexOf(r) + 1} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground">Nothing here.</p>
        )}
      </section>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <Link href="/prep" className={btnPrimary}>
          Back to Exam Prep <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href="/prep/mock" className={btnPlain}>
          <ArrowLeft className="size-4" aria-hidden /> All mocks
        </Link>
      </div>
    </div>
  );
}

function ReviewItem({ row, n }: { row: ReviewRow; n: number }) {
  const state = row.chosen === null ? "Blank" : row.correct ? "Right" : "Wrong";
  const Icon = row.chosen === null ? Circle : row.correct ? Check : X;
  return (
    <details className="group rounded-md border-2 border-foreground bg-card">
      <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-sm text-link">Q{n}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold",
            row.chosen === null ? "bg-card" : row.correct ? "bg-status-success-bg text-status-success-fg" : "bg-status-alert-bg text-status-alert-fg",
          )}
        >
          <Icon className="size-3.5" aria-hidden /> {state}
        </span>
        {row.marked ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold">
            <Flag className="size-3.5" aria-hidden /> Marked
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-sm">{row.q.stem}</span>
        {row.ms !== null ? <span className="font-mono text-xs text-muted-foreground">{clock(row.ms)}</span> : null}
      </summary>
      <div className="space-y-3 border-t-2 border-foreground p-3">
        <QuestionBody q={row.q} />
        <Options q={row.q} picked={row.chosen} onPick={() => undefined} answer={row.answer} />
        <div className="rounded-md border-2 border-dashed border-foreground/50 p-3">
          <p className="text-eyebrow text-muted-foreground">Why</p>
          <p className="mt-1 whitespace-pre-line">{row.explanation}</p>
        </div>
        <Link href={row.learnHref} className={btnPlain}>
          <BookOpen className="size-4" aria-hidden /> Learn this
        </Link>
      </div>
    </details>
  );
}
