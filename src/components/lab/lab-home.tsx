"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Baby, Brain, Check, Eye, FlaskConical, Lightbulb, Microscope, RotateCcw, Sparkles, Timer, Users } from "lucide-react";
import { emptyState, istToday, labRechecksDue, type LearnState } from "@/lib/learn/engine";
import { initLearnStore, useLearnState } from "@/lib/learn/store";
import { EXPERIMENTS, type LabExperiment } from "@/lib/lab/experiments";
import { cn } from "@/lib/utils";

const EMPTY = emptyState();
const AREA_ICON = { Memory: Brain, Attention: Eye, Perception: Eye, Learning: Sparkles, Thinking: Lightbulb, Methods: Microscope, Development: Baby, Social: Users } as const;

/** The single next step: a due re-check first, then the next experiment not yet done. */
function nextStep(st: LearnState): { href: string; title: string; why: string; recheck: boolean } | null {
  const due = labRechecksDue(st, istToday());
  if (due.length) {
    const e = EXPERIMENTS.find((x) => x.id === due[0]);
    if (e) return { href: `/games/lab/${e.id}?recheck=1`, title: `Re-check: ${e.title}`, why: `Three quick questions. ${due.length > 1 ? `${due.length} re-checks are due.` : "Recalling it now makes it last."}`, recheck: true };
  }
  const todo = EXPERIMENTS.find((e) => !st.lab[e.id]);
  if (todo) return { href: `/games/lab/${todo.id}`, title: todo.title, why: todo.hook, recheck: false };
  return null;
}

function headline(e: LabExperiment, r: Record<string, number>): string | null {
  switch (e.id) {
    case "digit-span":
      return r.forward !== undefined ? `Forwards ${r.forward} · backwards ${r.backward}` : null;
    case "serial-position":
      return r.primacy !== undefined ? `Start ${r.primacy}% · middle ${r.middle}% · end ${r.recency}%` : null;
    case "stroop":
      return r.effect !== undefined ? `Clash cost ${r.effect} ms` : null;
    case "change-detection":
      return r.k !== undefined ? `About ${r.k} squares held` : null;
    case "muller-lyer":
      return r.finsOut !== undefined ? `Fooled by ${r.finsOut}%` : null;
    case "bias-spotter":
      return r.biasRight !== undefined ? `${r.biasRight} of ${r.of} traps named` : null;
    case "schedules":
      return r.tried ? `${r.tried} reward rules tried` : null;
    case "pavlov":
      return r.peak !== undefined ? `Peak ${r.peak} · back to ${r.recovery} after rest` : null;
    case "design-study":
      return r.final !== undefined ? `${r.final} of ${r.of} threats closed` : null;
    case "correlation-cause":
      return r.right !== undefined ? `${r.right} of ${r.of} headlines judged` : null;
    case "conservation":
      return r.stage !== undefined ? `${r.stage} of ${r.of} stages · ${r.reason} reasons` : null;
    case "attribution":
      return r.before !== undefined ? `${r.before}% person → ${r.after}% after facts` : null;
    default:
      return null;
  }
}

export function LabHome({ serverState, save }: { serverState: LearnState | null; save: (s: LearnState) => Promise<unknown> }) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const next = nextStep(st);
  const doneCount = EXPERIMENTS.filter((e) => st.lab[e.id]).length;
  const levels = ["Foundation", "Intermediate", "Advanced"] as const;

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/games" className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Games
      </Link>

      <header className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-primary text-primary-foreground hard-shadow-sm">
          <FlaskConical className="size-7" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-eyebrow text-link">Psychology Lab</p>
          <h1 className="text-h1">
            Do the experiment. <span className="font-serif italic font-normal">Then</span> read why.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Classic studies you run on yourself, with your own data, linked to the clinic.</p>
        </div>
      </header>

      <div className="flex items-center gap-3" aria-label={`${doneCount} of ${EXPERIMENTS.length} experiments done`}>
        <div className="flex gap-1.5" aria-hidden>
          {EXPERIMENTS.map((e) => (
            <span key={e.id} className={cn("size-3 rounded-full border-2 border-foreground", st.lab[e.id] ? "bg-primary" : "bg-background")} />
          ))}
        </div>
        <span className="text-sm font-semibold tabular-nums">
          {doneCount} of {EXPERIMENTS.length} done
        </span>
      </div>

      {next ? (
        <Link href={next.href} className="btn-sweep flex items-center gap-4 rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md transition-transform active:translate-y-0.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-card text-foreground">
            {next.recheck ? <RotateCcw className="size-6" aria-hidden /> : <FlaskConical className="size-6" aria-hidden />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">{next.recheck ? "Due now" : doneCount ? "Next experiment" : "Start here"}</span>
            <span className="block text-xl font-bold leading-tight">{next.title}</span>
            <span className="block text-sm opacity-85">{next.why}</span>
          </span>
          <ArrowRight className="size-6 shrink-0" aria-hidden />
        </Link>
      ) : (
        <div className="rounded-3xl border-2 border-foreground bg-card p-5">
          <p className="font-bold">All experiments done, and nothing due.</p>
          <p className="text-sm text-muted-foreground">Re-checks will appear here when they come due. Running one again with a friend and comparing results is a good next step.</p>
        </div>
      )}

      {levels.map((lvl) => {
        const items = EXPERIMENTS.filter((e) => e.level === lvl);
        if (!items.length) return null;
        return (
          <section key={lvl} aria-labelledby={`lvl-${lvl}`} className="space-y-3">
            <h2 id={`lvl-${lvl}`} className="flex items-center gap-2 text-lg font-bold">
              <span className="size-2 rounded-full bg-primary ring-2 ring-foreground" aria-hidden /> {lvl}
            </h2>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
              {items.map((e) => {
                const r = st.lab[e.id];
                const Icon = AREA_ICON[e.area];
                const h = r ? headline(e, r.result) : null;
                return (
                  <li key={e.id}>
                    <Link href={`/games/lab/${e.id}`} className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-foreground bg-card p-4 transition-transform hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-0.5">
                      <span className="flex items-start gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-background">
                          <Icon className="size-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-xs font-bold text-link">
                            {String(e.num).padStart(2, "0")} · {e.area}
                          </span>
                          <span className="block font-bold leading-tight">{e.title}</span>
                        </span>
                        {r && (
                          <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground" aria-label="Done">
                            <Check className="size-4" aria-hidden />
                          </span>
                        )}
                      </span>
                      <span className="text-sm leading-snug text-muted-foreground">{e.hook}</span>
                      <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1">
                          <Timer className="size-3.5" aria-hidden /> {e.minutes} min
                        </span>
                        {h && <span className="rounded-full border-2 border-foreground bg-background px-2 py-0.5">{h}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <p className="rounded-2xl border-2 border-dashed border-foreground/50 p-4 text-sm text-muted-foreground">
        These are teaching demonstrations, not assessments. One run on a phone is a rough measure, so treat your numbers as interesting, not as a diagnosis.
      </p>
    </div>
  );
}
