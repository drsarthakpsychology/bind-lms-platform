"use client";

import * as React from "react";
import { BackPill, useBack } from "./back";

/**
 * Every activity (Coach, quizzes, Detective, cases, clinical words) sits in
 * this frame so it never looks like a phone screen floating on a big monitor:
 * - phones: a top row with a labelled Back and the activity name;
 * - desktop: the activity on the left, a side panel on the right with Back,
 *   what this activity is for, and how to use it.
 */
export function ActivityFrame({ title, purpose, how, fallback, children }: { title: string; purpose: string; how: string[]; fallback?: string; children: React.ReactNode }) {
  const back = useBack(fallback);
  return (
    <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8 lg:px-8 lg:py-6">
      <div className="flex items-center gap-3 border-b-2 border-foreground/10 px-4 py-3 lg:hidden">
        <BackPill fallback={fallback} />
        <p className="truncate font-bold">{title}</p>
      </div>
      <div className="min-w-0 lg:rounded-3xl lg:border-2 lg:border-foreground lg:bg-card lg:py-2">{children}</div>
      <aside className="hidden lg:block" aria-label="About this activity">
        <div className="sticky top-20 space-y-4">
          <BackPill fallback={fallback} className="h-11 w-full justify-center text-base" />
          <section className="rounded-3xl border-2 border-foreground bg-foreground p-5 text-background">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">You&apos;re in</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-90">{purpose}</p>
          </section>
          <section className="rounded-3xl border-2 border-foreground bg-card p-5">
            <h3 className="font-bold">How to use it</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-snug">
              {how.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">When you finish, {back.label.toLowerCase().replace(/^back to /, "you'll go back to ")}.</p>
          </section>
        </div>
      </aside>
    </div>
  );
}
