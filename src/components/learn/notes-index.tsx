"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { emptyState, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { cn } from "@/lib/utils";

export type NoteCard = { id: string; title: string; emoji: string; tagline: string; meta: string };
export type NoteBlock = { title: string; notes: NoteCard[] };

const EMPTY = emptyState();
const TONES = ["bg-primary text-primary-foreground", "bg-brand text-brand-foreground", "bg-foreground text-background", "bg-card"];

/** Notes grouped by week, with a tick on every note already read and a "Continue" card. */
export function NotesIndex({ blocks, serverState, save }: { blocks: NoteBlock[]; serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const all = blocks.flatMap((b) => b.notes);
  const read = all.filter((n) => st.notesRead[n.id]).length;
  const nextUp = all.find((n) => !st.notesRead[n.id]);
  const pct = Math.round((read / Math.max(1, all.length)) * 100);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {nextUp ? (
          <Link href={`/study/notes/${nextUp.id}`} className="btn-sweep flex items-center gap-4 rounded-3xl border-2 border-foreground bg-primary p-4 text-primary-foreground hard-shadow-md">
            <span className="text-4xl" aria-hidden>
              {nextUp.emoji}
            </span>
            <span className="min-w-0">
              <span className="text-eyebrow">{read ? "Continue with" : "Start here"}</span>
              <span className="block text-xl font-bold leading-tight">{nextUp.title}</span>
            </span>
            <ArrowRight className="ml-auto size-6 shrink-0" aria-hidden />
          </Link>
        ) : (
          <div className="rounded-3xl border-2 border-foreground bg-primary p-4 font-bold text-primary-foreground">You&apos;ve read every note.</div>
        )}
        <div className="rounded-3xl border-2 border-foreground bg-card p-4">
          <p className="text-2xl font-bold">
            {read}
            <span className="text-sm">/{all.length} read</span>
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-foreground">
            <div className="h-full bg-brand transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {blocks.map((block, b) => (
        <section key={block.title}>
          <h2 className="text-eyebrow text-link">{block.title}</h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {block.notes.map((n, k) => {
              const done = Boolean(st.notesRead[n.id]);
              return (
                <li key={n.id}>
                  <Link
                    href={`/study/notes/${n.id}`}
                    className={cn(
                      "group relative flex h-full flex-col gap-2 rounded-3xl border-2 border-foreground p-4 hard-shadow-sm transition-transform hover:-translate-y-1 hover:rotate-[-0.6deg] active:translate-y-0.5",
                      TONES[(b + k) % TONES.length],
                    )}
                  >
                    {done ? (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-2 py-0.5 text-xs font-semibold text-foreground">
                        <Check className="size-3.5" aria-hidden /> Read
                      </span>
                    ) : null}
                    <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>
                      {n.emoji}
                    </span>
                    <span className="text-lg font-bold leading-tight">{n.title}</span>
                    <span className="text-sm opacity-90">{n.tagline}</span>
                    <span className="mt-auto pt-1 text-xs font-bold opacity-80">{n.meta}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
