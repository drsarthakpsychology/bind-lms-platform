"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Sparkles, Zap } from "lucide-react";
import { pick, WEEK_BLOCKS, type Note } from "@/lib/learn/notes/types";
import { NOTE_FIGURES } from "@/lib/learn/notes/figures";
import { emptyState, istToday, markNoteRead, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { toPoints } from "@/lib/psychopharm/points";
import { cn } from "@/lib/utils";
import { useExplainView, ViewToggle } from "./view-toggle";
import n from "./notes.module.css";
import { backLinkClass } from "@/components/design-system/back-link";
import { OnceHint } from "@/components/help/once-hint";

const TONE: Record<string, string> = {
  lime: "bg-primary text-primary-foreground",
  blue: "bg-brand text-brand-foreground",
  ink: "bg-foreground text-background",
  white: "bg-card",
};
const TILTS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];
const EMPTY = emptyState();
// The figure library is large, so it loads only on notes that show a diagram.
const Figure = dynamic(() => import("@/components/study/figures/figure").then((m) => m.Figure), {
  ssr: false,
  loading: () => <div className="my-4 h-64 animate-pulse rounded-2xl border-2 border-foreground bg-muted" aria-hidden />,
});

/** One aesthetic, point-by-point study note, with a Student / Clinician switch. */
export function NoteView({
  note,
  prev,
  next,
  scenarioCount,
  serverState,
  save,
  position,
}: {
  note: Note;
  prev?: Note;
  next?: Note;
  scenarioCount: number;
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
  position: { index: number; total: number };
}) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const view = useExplainView();
  const readCount = Object.keys(st.notesRead).length;

  // Opening a note counts as reading it (shown as a tick on the notes list).
  React.useEffect(() => {
    const cur = getLearnState();
    if (cur && !cur.notesRead[note.id]) setLearnState(markNoteRead(cur, note.id, istToday()));
  }, [note.id]);
  const [flipped, setFlipped] = React.useState<number[]>([]);
  // Opened from a note, so Back returns to this note (not to Games or Exam Prep).
  const from = `from=${encodeURIComponent(`/study/notes/${note.id}`)}`;
  const quizHref = note.quiz.lessonId ? `/prep/smart/play?lesson=${note.quiz.lessonId}&${from}` : `/prep/smart/coach?domain=${note.quiz.domain}&${from}`;

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/study/notes" className={backLinkClass}>
          <ArrowLeft className="size-4" aria-hidden /> Back to summaries
        </Link>
        <ViewToggle />
      </div>

      <header className={cn("relative overflow-hidden rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-7", n.glow)}>
        <p className="text-eyebrow opacity-90">
          {WEEK_BLOCKS[note.block]} · note {position.index + 1}
        </p>
        <h1 className="mt-2 break-words text-display">
          <span className="mr-2" aria-hidden>
            {note.emoji}
          </span>
          {note.title}
        </h1>
        <p className="mt-2 text-base font-semibold opacity-90">{note.tagline}</p>
        <span className="absolute -right-6 -bottom-6 text-[7rem] opacity-15 select-none" aria-hidden>
          {note.emoji}
        </span>
      </header>

      <div className={cn("rounded-3xl border-2 border-foreground bg-card p-4 hard-shadow-sm", n.reveal)}>
        <p className="text-eyebrow text-link">{view === "clinician" ? "Clinical summary" : "TL;DR"}</p>
        <ul className="mt-2 space-y-1.5 text-lg font-bold leading-snug">
          {toPoints(pick(note.tldr, view), 4).map((pt) => (
            <li key={pt}>
              <span className={n.hl}>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {note.sections.map((sec, si) => (
        <React.Fragment key={sec.title}>
        <section className={cn("overflow-hidden rounded-3xl border-2 border-foreground", sec.style === "alert" ? "bg-status-alert-bg text-status-alert-fg" : TONE[sec.tone ?? "white"], n.reveal)}>
          <h2 className="flex items-center gap-2 border-b-2 border-current/20 px-4 py-3 text-lg font-bold">
            {sec.style === "alert" ? "⚠️" : <Sparkles className="size-4" aria-hidden />} {sec.title}
          </h2>
          {sec.style === "chips" ? (
            <ul className="flex flex-wrap gap-2 p-4">
              {sec.points.map((p, k) => (
                <li key={k} className={cn(n.sticker, "rounded-xl border-2 border-current bg-background/10 px-3 py-1.5 text-sm font-semibold")} style={{ ["--tilt" as string]: TILTS[(k + si) % TILTS.length] }}>
                  {pick(p, view)}
                </li>
              ))}
            </ul>
          ) : (
            <ol className={cn("space-y-2.5 p-4 text-[0.95rem] leading-relaxed", sec.style === "steps" && n.steps)}>
              {sec.points.map((p, k) => (
                <li key={k} className={sec.style === "steps" ? cn(n.step, "font-semibold") : cn(n.bullet, "font-medium")}>
                  {pick(p, view)}
                </li>
              ))}
            </ol>
          )}
        </section>
        {(NOTE_FIGURES[note.id] ?? []).filter((f) => f.after === si).map((f) => (
          <div key={f.id} className={n.reveal}>
            <Figure d={{ id: f.id, quiz: f.quiz }} />
          </div>
        ))}
        </React.Fragment>
      ))}

      {note.figures?.length ? (
        <section className={n.reveal} aria-label="Pictures">
          <h2 className="text-h2">See it</h2>
          {note.figures.map((f, k) => (
            <Figure key={`${f.id}-${k}`} d={f} />
          ))}
        </section>
      ) : null}

      {note.terms?.length ? (
        <section className={n.reveal}>
          <h2 className="text-h2">Say it clinically</h2>
          <OnceHint id="notes-flip" className="text-caption text-muted-foreground">Tap a card to flip from everyday words to the clinical term.</OnceHint>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {note.terms.map(([lay, term], k) => {
              const on = flipped.includes(k);
              return (
                <li key={lay}>
                  <button type="button" className={cn(n.flip, "w-full text-left")} data-on={on} aria-pressed={on} onClick={() => setFlipped(on ? flipped.filter((x) => x !== k) : [...flipped, k])}>
                    <span className={n.flipInner}>
                      <span className={cn(n.face, "flex min-h-24 flex-col justify-between rounded-2xl border-2 border-foreground bg-card p-3 hard-shadow-sm")}>
                        <span className="text-caption text-muted-foreground">They say</span>
                        <span className="font-bold leading-tight">“{lay}”</span>
                      </span>
                      <span className={cn(n.back, "flex min-h-24 flex-col justify-between rounded-2xl border-2 border-foreground bg-primary p-3 text-primary-foreground hard-shadow-sm")}>
                        <span className="text-caption">You write</span>
                        <span className="font-bold leading-tight">{term}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="rounded-3xl border-2 border-foreground bg-card p-4 hard-shadow-sm sm:p-5" aria-labelledby="next-steps">
        <h2 id="next-steps" className="text-lg font-bold">
          What to do now
        </h2>
        <ol className="mt-3 space-y-2.5">
          <li className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-background p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-foreground bg-primary font-bold text-primary-foreground">✓</span>
            <span className="font-bold">Read this note</span>
            <span className="ml-auto text-caption text-muted-foreground">{readCount} read so far</span>
          </li>
          <li>
            <Link href={quizHref} className="btn-sweep flex items-center gap-3 rounded-2xl border-2 border-foreground bg-primary p-3 text-primary-foreground hard-shadow-md">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-current font-bold">2</span>
              <span className="text-lg font-bold">Quiz me on this</span>
              <Zap className="ml-auto size-5" aria-hidden />
            </Link>
          </li>
          <li>
            <Link
              href={scenarioCount ? `/practice/scenarios?note=${note.id}&${from}` : `/practice/terms?${from}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-brand p-3 text-brand-foreground hard-shadow-sm"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-current font-bold">3</span>
              <span className="font-bold">{scenarioCount ? `Practise with a patient (${scenarioCount})` : "Practise clinical words"}</span>
              <ArrowRight className="ml-auto size-5" aria-hidden />
            </Link>
          </li>
        </ol>
      </section>

      <nav className="flex items-center justify-between gap-3 pt-2" aria-label="Other notes">
        {prev ? (
          <Link href={`/study/notes/${prev.id}`} aria-label={`Previous: ${prev.title}`} className="inline-flex min-h-12 min-w-0 shrink-0 items-center gap-1 rounded-md sm:shrink border-2 border-foreground bg-card px-3 text-sm font-bold">
            <ArrowLeft className="size-4 shrink-0" aria-hidden /> <span className="sm:hidden">Back</span>
            <span className="hidden truncate sm:inline">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/study/notes/${next.id}`} className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-between gap-1 rounded-md border-2 border-foreground bg-primary px-3 text-sm font-bold text-primary-foreground hard-shadow-xs sm:flex-none">
            <span className="truncate">Next: {next.title}</span> <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
