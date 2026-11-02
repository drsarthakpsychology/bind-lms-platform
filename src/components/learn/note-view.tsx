"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Trophy, Zap } from "lucide-react";
import { pick, WEEK_BLOCKS, type Note } from "@/lib/learn/notes/types";
import { cn } from "@/lib/utils";
import { ChaiSays } from "./chai";
import { useExplainView, ViewToggle } from "./view-toggle";
import n from "./notes.module.css";
import l from "./learn.module.css";

const TONE: Record<string, string> = {
  lime: "bg-primary text-primary-foreground",
  blue: "bg-brand text-brand-foreground",
  ink: "bg-foreground text-background",
  white: "bg-card",
};
const TILTS = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];

/** One aesthetic, point-by-point study note, with a Student / Clinician switch. */
export function NoteView({ note, prev, next, scenarioCount }: { note: Note; prev?: Note; next?: Note; scenarioCount: number }) {
  const view = useExplainView();
  const [flipped, setFlipped] = React.useState<number[]>([]);
  const quizHref = note.quiz.lessonId ? `/practice/learn/play?lesson=${note.quiz.lessonId}` : `/practice/learn/coach?domain=${note.quiz.domain}`;

  return (
    <article className={cn("mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6", l.texture)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/practice/notes" className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
          <ArrowLeft className="size-4" aria-hidden /> All notes
        </Link>
        <ViewToggle />
      </div>

      <header className={cn("relative overflow-hidden rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-7", n.glow)}>
        <p className="font-pix text-[0.65rem] uppercase opacity-90">{WEEK_BLOCKS[note.block]}</p>
        <h1 className="mt-2 text-3xl font-black leading-[1.05] sm:text-5xl">
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
        <p className="mt-1 text-lg font-bold leading-snug">
          <span className={n.hl}>{pick(note.tldr, view)}</span>
        </p>
      </div>

      {note.sections.map((sec, si) => (
        <section key={sec.title} className={cn("overflow-hidden rounded-3xl border-2 border-foreground", sec.style === "alert" ? "bg-status-alert-bg text-status-alert-fg" : TONE[sec.tone ?? "white"], n.reveal)}>
          <h2 className="flex items-center gap-2 border-b-2 border-current/20 px-4 py-3 text-lg font-black">
            {sec.style === "alert" ? "⚠️" : <Sparkles className="size-4" aria-hidden />} {sec.title}
          </h2>
          {sec.style === "chips" ? (
            <ul className="flex flex-wrap gap-2 p-4">
              {sec.points.map((p, k) => (
                <li key={k} className={cn(n.sticker, "rounded-xl border-2 border-current bg-background/10 px-3 py-1.5 text-sm font-black")} style={{ ["--tilt" as string]: TILTS[(k + si) % TILTS.length] }}>
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
      ))}

      {note.terms?.length ? (
        <section className={n.reveal}>
          <h2 className="text-h2">Say it clinically</h2>
          <p className="text-caption text-muted-foreground">Tap a card to flip from everyday words to the clinical term.</p>
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
                        <span className="font-black leading-tight">{term}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <ChaiSays mood="happy" size={70}>
        Read it once, then test yourself. Quizzing right after reading is how it sticks.
      </ChaiSays>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href={quizHref} className="btn-sweep flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-lg font-black text-primary-foreground hard-shadow-md">
          <Zap className="size-5" aria-hidden /> Quiz me
        </Link>
        {scenarioCount ? (
          <Link href={`/practice/learn/scenarios?note=${note.id}`} className="flex h-14 items-center justify-center rounded-2xl border-2 border-foreground bg-brand font-black text-brand-foreground hard-shadow-sm">
            What would you do? ({scenarioCount})
          </Link>
        ) : (
          <Link href="/practice/learn/terms" className="flex h-14 items-center justify-center rounded-2xl border-2 border-foreground bg-brand font-black text-brand-foreground hard-shadow-sm">
            Say it clinically
          </Link>
        )}
        <Link href="/practice/learn/progress" className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-card font-black hard-shadow-sm">
          <Trophy className="size-5" aria-hidden /> Leaderboard
        </Link>
      </div>

      <nav className="flex items-center justify-between gap-3 pt-2" aria-label="Other notes">
        {prev ? (
          <Link href={`/practice/notes/${prev.id}`} className="inline-flex min-w-0 items-center gap-1 text-sm font-bold">
            <ArrowLeft className="size-4 shrink-0" aria-hidden /> <span className="truncate">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/practice/notes/${next.id}`} className="inline-flex min-w-0 items-center gap-1 text-sm font-bold">
            <span className="truncate">{next.title}</span> <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
