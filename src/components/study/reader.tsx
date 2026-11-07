"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ListOrdered } from "lucide-react";
import type { Card, Level, Mcq } from "@/lib/study/types";
import { ViewToggle } from "@/components/learn/view-toggle";
import { CardDeck, TestRunner } from "./interactive";
import { addStudySeconds, emptyState, finishSection, istToday, studyKey, visitSection, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { cn } from "@/lib/utils";
import { SectionMarks } from "./marks";
import s from "./study.module.css";

export type TocItem = { id: string; num: string; title: string; part?: string; isTest: boolean; href: string };

const EMPTY = emptyState();

/**
 * Counts focused study time: only while the tab is visible and the student
 * has scrolled, typed or tapped in the last two minutes. Saved every minute.
 */
function useStudyTimer(moduleId: string) {
  React.useEffect(() => {
    let lastActive = Date.now();
    let pending = 0;
    const mark = () => (lastActive = Date.now());
    const events = ["scroll", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const flush = () => {
      if (!pending) return;
      const s = getLearnState();
      if (s) setLearnState(addStudySeconds(s, moduleId, pending));
      pending = 0;
    };
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - lastActive < 120_000) pending += 15;
      if (pending >= 60) flush();
    }, 15_000);
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      flush();
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onHide);
      events.forEach((e) => window.removeEventListener(e, mark));
    };
  }, [moduleId]);
}

function Toc({ items, moduleId, current, done, onPick }: { items: TocItem[]; moduleId: string; current: string; done: Record<string, string>; onPick?: () => void }) {
  return (
    <ol className="space-y-0.5">
      {items.map((t, i) => {
        const isDone = Boolean(done[studyKey(moduleId, t.id)]);
        const here = t.id === current;
        const part = i === 0 || items[i - 1].part !== t.part ? t.part : undefined;
        return (
          <li key={t.id}>
            {part ? <p className="mt-3 mb-1 px-2 text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase">{part}</p> : null}
            <Link
              href={t.href}
              onClick={onPick}
              aria-current={here ? "page" : undefined}
              className={cn(
                "flex items-start gap-2 rounded-md px-2 py-1.5 text-sm leading-snug transition-colors pointer-coarse:py-2.5",
                here ? "bg-foreground font-semibold text-background" : "hover:bg-muted",
              )}
            >
              <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2", here ? "border-background" : "border-foreground", isDone && !here && "bg-primary")}>
                {isDone ? <Check className="size-2.5" aria-hidden /> : null}
              </span>
              <span className="min-w-0">
                <span className="font-semibold tabular-nums">{t.isTest ? "Test" : t.num}</span> {t.title}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Tablet/desktop or phone, decided in the browser (phone first on the server). */
function useWide(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(min-width: 768px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => false,
  );
}

/** Smooth scrolling, unless the student asked for less motion. */
function scrollBehavior(): ScrollBehavior {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  } catch {
    return "auto";
  }
}

export type ChunkView = { title: string; node: React.ReactNode };

/**
 * The reading screen. A section is split into short parts.
 * - Phone: one part at a time, with Back and Next fixed at the bottom, in
 *   thumb reach.
 * - Tablet and desktop: a contents rail beside the text; parts appear one under another as you press Continue, so you
 *   never face the whole section at once but can still scroll back.
 * Self-tests sit behind start cards at the end; the module test is a start
 * screen, then one question at a time.
 */
export function SectionReader({
  moduleId,
  moduleNum,
  moduleTitle,
  section,
  toc,
  prevHref,
  next,
  serverState,
  save,
  chunks,
  recall,
  viva,
  mcq,
  checks = [],
  owner = "",
}: {
  moduleId: string;
  moduleNum: number;
  moduleTitle: string;
  section: { id: string; num: string; title: string; part?: string; tag?: "core" | "extra"; level?: Level; levelCheck?: Level; isTest: boolean };
  toc: TocItem[];
  prevHref?: string;
  next: { href: string; label: string };
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
  chunks: ChunkView[];
  recall: Card[];
  viva: Card[];
  mcq: Mcq[];
  /** This module's checkpoints, to open the one that becomes ready after this section. */
  checks?: { key: string; href: string; sectionIds: string[]; later: string[] }[];
  /** Student id: bookmarks and notes are kept per student on this device. */
  owner?: string;
}) {
  initLearnStore(serverState, save, owner || undefined);
  const st = useLearnState(serverState ?? EMPTY);
  const router = useRouter();
  const wide = useWide();
  const [tocOpen, setTocOpen] = React.useState(false);
  const done = Boolean(st.study.done[studyKey(moduleId, section.id)]);
  // step = index of the current part; chunks.length = the "check yourself / finish" screen.
  const [step, setStep] = React.useState(() => (done ? chunks.length : 0));
  const partRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const topRef = React.useRef<HTMLDivElement>(null);
  useStudyTimer(moduleId);

  React.useEffect(() => {
    const s = getLearnState();
    if (s) setLearnState(visitSection(s, moduleId, section.id));
  }, [moduleId, section.id]);

  const index = toc.findIndex((t) => t.id === section.id);
  const readCount = toc.filter((t) => !t.isTest && st.study.done[studyKey(moduleId, t.id)]).length;
  const readTotal = toc.filter((t) => !t.isTest).length;
  const atEnd = step >= chunks.length;
  // Recall questions are not asked straight after reading: they wait for the
  // checkpoint, once the student has moved on (see lib/study/checkpoints.ts).
  void recall;
  const hasCheck = viva.length > 0;

  function go(to: number) {
    setStep(to);
    const behavior = scrollBehavior();
    requestAnimationFrame(() => {
      if (wide && to < chunks.length) partRefs.current[to]?.scrollIntoView({ behavior, block: "start" });
      else topRef.current?.scrollIntoView({ behavior, block: "start" });
    });
  }

  function finish() {
    const s = getLearnState();
    const after = s ? finishSection(s, moduleId, section.id, istToday()) : null;
    if (after) setLearnState(after);
    // A checkpoint that this section has just opened comes first.
    const done = (id: string) => Boolean(after?.study.done[studyKey(moduleId, id)]);
    const ready = after
      ? checks.find((c) => !after.study.tests[c.key] && c.sectionIds.every(done) && (!c.later.length || c.later.some(done)))
      : undefined;
    router.push(ready ? `${ready.href}?then=${encodeURIComponent(next.href)}` : next.href);
  }

  const shownParts = section.isTest ? chunks.map((_, k) => k) : wide ? chunks.map((_, k) => k).filter((k) => k <= Math.min(step, chunks.length - 1) || atEnd) : atEnd ? [] : [step];

  const finishButton = (
    <button type="button" onClick={finish} className="btn-sweep flex min-h-14 w-full items-center justify-between gap-3 rounded-md border-2 border-foreground bg-primary px-5 py-3 text-left text-primary-foreground hard-shadow-md">
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">{done ? "Next" : "Finish this section"}</span>
        <span className="block text-lg font-bold leading-tight">{next.label}</span>
      </span>
      <ArrowRight className="size-6 shrink-0" aria-hidden />
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-6xl md:grid md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden md:block" aria-label="Module contents">
        <div className="sticky top-[calc(var(--top-h)+1rem)] max-h-[calc(100dvh-var(--top-h)-2rem)] overflow-y-auto overscroll-contain rounded-3xl border-2 border-foreground bg-card p-3">
          <Link href={`/study/${moduleId}`} className="flex min-h-10 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold hover:bg-muted pointer-coarse:min-h-11">
            <ArrowLeft className="size-4" aria-hidden /> Module {moduleNum} overview
          </Link>
          <p className="px-2 pt-1 text-xs text-muted-foreground">
            {readCount} of {readTotal} sections read
          </p>
          <div className="mt-1">
            <Toc items={toc} moduleId={moduleId} current={section.id} done={st.study.done} />
          </div>
        </div>
      </aside>

      <article className="min-w-0 pb-36 md:pb-0">
        <div ref={topRef} className="scroll-mt-24" />
        <div className="mb-4 flex items-center justify-between gap-2 md:hidden">
          <Link href={`/study/${moduleId}`} className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
            <ArrowLeft className="size-4" aria-hidden /> Module {moduleNum}
          </Link>
          <button type="button" onClick={() => setTocOpen(!tocOpen)} aria-expanded={tocOpen} className="inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
            <ListOrdered className="size-4 shrink-0" aria-hidden /> <span className="truncate">Section {index + 1} of {toc.length}</span>
            <ChevronDown className={cn("size-4 shrink-0 transition-transform", tocOpen && "rotate-180")} aria-hidden />
          </button>
        </div>
        {tocOpen ? (
          <div className="mb-5 max-h-[60dvh] overflow-y-auto overscroll-contain rounded-3xl border-2 border-foreground bg-card p-3 md:hidden">
            <Toc items={toc} moduleId={moduleId} current={section.id} done={st.study.done} onPick={() => setTocOpen(false)} />
          </div>
        ) : null}

        <header className="mb-6 max-w-[68ch]">
          <p className="text-xs font-semibold uppercase tracking-wide text-link">
            {moduleTitle}
            {section.part ? ` · ${section.part.replace(/^Part [IVX]+ · /, "")}` : ""}
          </p>
          <h1 className="mt-1.5 break-words text-[1.85rem] font-black leading-[1.1] tracking-tight sm:text-4xl short:lg:text-3xl">
            {section.isTest ? "" : <span className="mr-2 text-link">{section.num}</span>}
            {section.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {section.tag === "extra" ? <span className="rounded-full border-2 border-foreground px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-foreground">Extra · read once</span> : null}
            {section.tag === "core" ? <span className="rounded-full bg-primary px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-primary-foreground">Core · must know</span> : null}
            {section.level ? <span className="rounded-full border-2 border-foreground bg-card px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-foreground">{LEVEL_NAME[section.level]}</span> : null}
            {done ? (
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Check className="size-4" aria-hidden /> Done
              </span>
            ) : null}
          </p>
          {!section.isTest && chunks.length > 1 ? (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex flex-1 gap-1" aria-hidden>
                {chunks.map((_, k) => (
                  <span key={k} className={cn("h-1.5 flex-1 rounded-full", k <= step ? "bg-brand" : "bg-foreground/15")} />
                ))}
              </div>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">{atEnd ? "All parts read" : `Part ${step + 1} of ${chunks.length}`}</span>
            </div>
          ) : null}
          <div className="mt-3"><ViewToggle /></div>
          {!section.isTest ? <SectionMarks key={section.id} owner={owner} moduleId={moduleId} sectionId={section.id} sectionLabel={`${section.num} ${section.title}`} /> : null}
        </header>

        {section.levelCheck ? (
          <div className="max-w-[68ch] space-y-6">
            {chunks.map((c, k) => <div key={k}>{c.node}</div>)}
            <TestRunner items={mcq} moduleId={`${moduleId}@${section.levelCheck}`} label="Check yourself" intro={["Optional. Try it any time, as often as you like."]} />
            {finishButton}
          </div>
        ) : (
        <div className="max-w-[68ch] space-y-8">
          {shownParts.map((k) => (
            <div key={k} ref={(el) => { partRefs.current[k] = el; }} className={cn("scroll-mt-24", k > 0 && wide && !section.isTest && "border-t-2 border-foreground/10 pt-8", s.reveal)}>
              {chunks[k].node}
            </div>
          ))}

          {section.isTest ? <TestRunner items={mcq} moduleId={moduleId} /> : null}

          {/* Desktop: continue to the next part */}
          {wide && !section.isTest && !atEnd ? (
            <button type="button" onClick={() => go(step + 1)} className="group flex w-full items-center justify-between gap-3 rounded-md border-2 border-foreground bg-card px-5 py-4 text-left transition-colors hover:bg-muted">
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{step + 1 < chunks.length ? `Continue · part ${step + 2} of ${chunks.length}` : "Continue"}</span>
                <span className="block text-lg font-bold leading-tight">{step + 1 < chunks.length ? chunks[step + 1].title : hasCheck ? "Check yourself" : "Finish the section"}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          ) : null}

          {/* End of the section: self-check, then finish */}
          {!section.isTest && atEnd ? (
            <div className={cn("space-y-5", s.reveal)}>
              {viva.length ? <CardDeck items={viva} kind="viva" /> : null}
              {!wide ? (
                <button type="button" onClick={() => go(0)} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
                  Read this section again
                </button>
              ) : null}
              <div className="pt-2">{finishButton}</div>
              {prevHref ? (
                <Link href={prevHref} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
                  <ArrowLeft className="size-4" aria-hidden /> Previous section
                </Link>
              ) : null}
            </div>
          ) : null}

          {section.isTest ? (
            <Link href={`/study/${moduleId}`} className="flex h-12 items-center justify-center gap-2 rounded-md border-2 border-foreground bg-card font-semibold">
              Back to the module <ArrowRight className="size-5" aria-hidden />
            </Link>
          ) : null}
        </div>
        )}

        {/* Phone: Back and Next, fixed at the bottom while reading. Big,
            low and wide so a thumb reaches them; Next is the wide one on the
            right, Back sits clear of it. */}
        {!wide && !section.isTest && !section.levelCheck && !atEnd ? (
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-foreground bg-card px-4 pt-2 md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }} aria-label="Parts of this section">
            <div className="mx-auto flex max-w-xl items-stretch gap-3">
              <button
                type="button"
                onClick={() => go(step - 1)}
                disabled={step === 0}
                aria-label={step === 0 ? "Back (this is the first part)" : `Back to part ${step}`}
                className="inline-flex h-14 shrink-0 items-center gap-1 rounded-md border-2 border-foreground bg-card px-4 font-semibold active:translate-y-px disabled:border-foreground/30 disabled:text-muted-foreground"
              >
                <ArrowLeft className="size-5" aria-hidden /> Back
              </button>
              <button
                type="button"
                onClick={() => go(step + 1)}
                className="inline-flex h-14 min-w-0 flex-1 items-center justify-between gap-2 rounded-md border-2 border-foreground bg-primary px-4 text-left font-bold text-primary-foreground hard-shadow-xs active:translate-y-px active:shadow-none"
              >
                <span className="min-w-0">
                  <span className="block truncate text-base leading-tight">{step + 1 < chunks.length ? "Next" : hasCheck ? "Check yourself" : "Finish"}</span>
                  <span className="block text-caption font-semibold tabular-nums opacity-80">
                    {step + 1 < chunks.length ? `Part ${step + 2} of ${chunks.length}` : "End of this section"}
                  </span>
                </span>
                <ArrowRight className="size-5 shrink-0" aria-hidden />
              </button>
            </div>
          </nav>
        ) : null}
      </article>
    </div>
  );
}

const LEVEL_NAME: Record<Level, string> = { starting: "Starting", beginner: "Beginner", advanced: "Advanced" };
