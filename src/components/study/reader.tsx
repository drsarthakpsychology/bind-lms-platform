"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock, ListOrdered } from "lucide-react";
import { addStudySeconds, emptyState, finishSection, istToday, studyKey, visitSection, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; num: string; title: string; part?: string; isTest: boolean; href: string; minutes: number };

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
            {part ? <p className="mt-3 mb-1 px-2 text-[0.65rem] font-black tracking-wide text-muted-foreground uppercase">{part}</p> : null}
            <Link
              href={t.href}
              onClick={onPick}
              aria-current={here ? "page" : undefined}
              className={cn(
                "flex items-start gap-2 rounded-xl px-2 py-1.5 text-sm leading-snug transition-colors",
                here ? "bg-foreground font-black text-background" : "hover:bg-muted",
              )}
            >
              <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2", here ? "border-background" : "border-foreground", isDone && !here && "bg-primary")}>
                {isDone ? <Check className="size-2.5" aria-hidden /> : null}
              </span>
              <span className="min-w-0">
                <span className="font-bold">{t.isTest ? "Test" : t.num}</span> {t.title}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** The reading screen: contents on the left (desktop) or in a drop-down (phone), one section at a time. */
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
  children,
}: {
  moduleId: string;
  moduleNum: number;
  moduleTitle: string;
  section: { id: string; num: string; title: string; part?: string; tag?: "core" | "extra"; isTest: boolean; minutes: number };
  toc: TocItem[];
  prevHref?: string;
  next: { href: string; label: string };
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
  children: React.ReactNode;
}) {
  initLearnStore(serverState, save);
  const st = useLearnState(serverState ?? EMPTY);
  const router = useRouter();
  const [tocOpen, setTocOpen] = React.useState(false);
  useStudyTimer(moduleId);

  React.useEffect(() => {
    const s = getLearnState();
    if (s) setLearnState(visitSection(s, moduleId, section.id));
  }, [moduleId, section.id]);

  const index = toc.findIndex((t) => t.id === section.id);
  const done = Boolean(st.study.done[studyKey(moduleId, section.id)]);
  const readCount = toc.filter((t) => !t.isTest && st.study.done[studyKey(moduleId, t.id)]).length;
  const readTotal = toc.filter((t) => !t.isTest).length;

  function finish() {
    const s = getLearnState();
    if (s) setLearnState(finishSection(s, moduleId, section.id, istToday()));
    router.push(next.href);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:py-8">
      {/* Contents: sticky column on desktop */}
      <aside className="hidden lg:block" aria-label="Module contents">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border-2 border-foreground bg-card p-3">
          <Link href={`/study/${moduleId}`} className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm font-black hover:bg-muted">
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

      <article className="min-w-0">
        {/* Phone: back + contents */}
        <div className="mb-4 flex items-center justify-between gap-2 lg:hidden">
          <Link href={`/study/${moduleId}`} className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-black">
            <ArrowLeft className="size-4" aria-hidden /> Module {moduleNum}
          </Link>
          <button
            type="button"
            onClick={() => setTocOpen(!tocOpen)}
            aria-expanded={tocOpen}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-black"
          >
            <ListOrdered className="size-4" aria-hidden /> {index + 1} of {toc.length}
            <ChevronDown className={cn("size-4 transition-transform", tocOpen && "rotate-180")} aria-hidden />
          </button>
        </div>
        {tocOpen ? (
          <div className="mb-5 max-h-[60vh] overflow-y-auto rounded-3xl border-2 border-foreground bg-card p-3 lg:hidden">
            <Toc items={toc} moduleId={moduleId} current={section.id} done={st.study.done} onPick={() => setTocOpen(false)} />
          </div>
        ) : null}

        <header className="mb-6 max-w-[72ch]">
          <p className="text-xs font-black tracking-wide text-link uppercase">
            {moduleTitle}
            {section.part ? ` · ${section.part.replace(/^Part [IVX]+ · /, "")}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-black leading-[1.08] sm:text-4xl">
            {section.isTest ? "" : <span className="mr-2 text-link">{section.num}</span>}
            {section.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" aria-hidden /> about {section.minutes} min
            </span>
            {section.tag === "extra" ? <span className="rounded-full border-2 border-foreground px-2 py-0.5 text-[0.65rem] font-black text-foreground uppercase">Extra · read once</span> : null}
            {section.tag === "core" ? <span className="rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-black text-primary-foreground uppercase">Core · must know</span> : null}
            {done ? (
              <span className="inline-flex items-center gap-1 font-bold text-foreground">
                <Check className="size-4" aria-hidden /> Done
              </span>
            ) : null}
          </p>
        </header>

        <div className="max-w-[72ch]">{children}</div>

        {/* What to do next: one clear button */}
        <footer className="mt-10 max-w-[72ch] border-t-2 border-foreground pt-5">
          {section.isTest ? (
            <Link href={`/study/${moduleId}`} className="flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-lg font-black text-primary-foreground hard-shadow-md">
              Back to the module <ArrowRight className="size-5" aria-hidden />
            </Link>
          ) : (
            <button type="button" onClick={finish} className="btn-sweep flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 border-foreground bg-primary px-5 py-3 text-left font-black text-primary-foreground hard-shadow-md">
              <span>
                <span className="block text-xs uppercase opacity-80">{done ? "Next" : "I've answered the recall check"}</span>
                <span className="block text-lg leading-tight">{next.label}</span>
              </span>
              <ArrowRight className="size-6 shrink-0" aria-hidden />
            </button>
          )}
          {prevHref ? (
            <Link href={prevHref} className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline-offset-4 hover:underline">
              <ArrowLeft className="size-4" aria-hidden /> Previous section
            </Link>
          ) : null}
        </footer>
      </article>
    </div>
  );
}
