"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookmarkCheck, BookOpen, Check, ChevronDown, NotebookPen, PenLine, RotateCcw, Trophy, Zap, ListChecks } from "lucide-react";
import { emptyState, istToday, markActivity, markWritten, studyKey, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { checkpointHref, checkpoints, checkpointStatus, type Checkpoint } from "@/lib/study/checkpoints";
import { activityHref, courseNext, moduleNext, moduleStatus, readingSections, retestDue, sectionHref, sectionTitle, testSection, type Next } from "@/lib/study/plan";
import { courseProgress, moduleProgress } from "@/lib/study/progress";
import type { StudyModule } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { MarksList, RelatedLab, useSectionMarks, type LabLink } from "./marks";
import { PageHeader } from "@/components/design-system/page-header";
import { backLinkClass } from "@/components/design-system/back-link";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;

function nextLabel(n: Next): { eyebrow: string; title: string; sub?: string } {
  switch (n.kind) {
    case "read":
      return { eyebrow: `Module ${n.module.num} · Read`, title: `${n.section.num} ${sectionTitle(n.section)}`, sub: n.module.title };
    case "checkpoint":
      return { eyebrow: `Module ${n.module.num} · Checkpoint`, title: n.label.replace(/^Checkpoint \d+: /, "Quiz on "), sub: n.module.title };
    case "write":
      return { eyebrow: `Module ${n.module.num} · Write it out`, title: "Reproduce the key frameworks on paper", sub: n.module.title };
    case "practise":
      return { eyebrow: `Module ${n.module.num} · Practise`, title: n.label, sub: n.module.title };
    case "test":
      return { eyebrow: `Module ${n.module.num} · Test`, title: "Take the module test", sub: n.module.title };
    case "retest":
      return { eyebrow: "Due today · Re-test", title: n.module.title };
    default:
      return { eyebrow: "All done", title: "You've completed every module" };
  }
}

/**
 * The one next step: the only lime (action) card on the screen. Same shape as
 * Home's Continue card: icon tile, small label, title, then an ink button
 * that sits under the words on phones (full width, in thumb reach) and on the
 * right from 640 px.
 */
function ContinueCard({ next, onGo }: { next: Next; onGo?: () => void }) {
  const l = nextLabel(next);
  const Icon = next.kind === "read" ? BookOpen : next.kind === "checkpoint" ? ListChecks : next.kind === "write" ? PenLine : next.kind === "practise" ? Zap : next.kind === "done" ? Trophy : RotateCcw;
  return (
    <Link
      href={next.href}
      onClick={onGo}
      className="group/continue flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md outline-none transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none motion-reduce:hover:translate-y-0 sm:flex-row sm:items-center sm:p-6"
    >
      <span className="flex min-w-0 flex-1 items-start gap-4 sm:items-center">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-card text-foreground sm:size-14">
          <Icon className="size-6 sm:size-7" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-eyebrow opacity-80">{l.eyebrow}</span>
          <span className="text-h2 [overflow-wrap:anywhere]">{l.title}</span>
          {l.sub ? <span className="text-sm font-semibold opacity-80 [overflow-wrap:anywhere]">{l.sub}</span> : null}
        </span>
      </span>
      <span className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-md border-2 border-foreground bg-foreground px-5 text-sm font-bold text-background transition-transform duration-fast ease-snappy group-hover/continue:translate-x-0.5 sm:min-h-11 sm:w-fit">
        {next.kind === "done" ? "Review" : "Continue"} <ArrowRight className="size-4" aria-hidden />
      </span>
    </Link>
  );
}

function Bar({ pct, tone = "brand" }: { pct: number; tone?: "brand" | "primary" }) {
  return (
    <span className="block h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card">
      <span className={cn("block h-full origin-left transition-transform duration-slower ease-out-expo motion-reduce:transition-none", tone === "brand" ? "bg-brand" : "bg-primary")} style={{ transform: `scaleX(${pct / 100})` }} />
    </span>
  );
}

/**
 * The modules in three shelves, so fifty rows read as a map, not a wall:
 * the clinical course (1 to 29), the deeper modules (30s) and psychology
 * (40 up). Pharmacokinetics is numbered with the psychology modules but is
 * about medicines, so it sits with the clinical ones.
 */
const SHELF_OVERRIDE: Record<string, number> = { pharmacokinetics: 0 };
const SHELVES = ["Clinical", "Going deeper", "Psychology"] as const;
function shelfOf(m: StudyModule): number {
  return SHELF_OVERRIDE[m.id] ?? (m.num < 30 ? 0 : m.num < 40 ? 1 : 2);
}

/** Reading sections in runs of the same part, in order. */
function partsOf<T extends { part?: string }>(secs: T[]): { part?: string; items: T[] }[] {
  const out: { part?: string; items: T[] }[] = [];
  for (const sec of secs) {
    const last = out[out.length - 1];
    if (last && last.part === sec.part) last.items.push(sec);
    else out.push({ part: sec.part, items: [sec] });
  }
  return out;
}

function ModuleTile({ m, pct, complete, here }: { m: StudyModule; pct: number; complete: boolean; here: boolean }) {
  const started = pct > 0 && !complete;
  return (
    <Link
      href={`/study/${m.id}`}
      aria-current={here ? "step" : undefined}
      className={cn(
        "group/mod flex h-full min-h-[4.5rem] items-center gap-3 rounded-2xl border-2 border-foreground p-3 outline-none transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none motion-reduce:hover:translate-y-0 sm:p-4",
        here ? "bg-brand text-brand-foreground hard-shadow-sm" : "bg-card",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl border-2 text-xl",
          here ? "border-brand-foreground" : "border-foreground",
          complete && "bg-primary",
        )}
      >
        {complete ? <Check className="size-5 text-primary-foreground" /> : m.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-eyebrow opacity-80">{here ? `Module ${m.num} · You are here` : `Module ${m.num}`}</span>
        <span className="mt-0.5 block font-bold leading-snug [overflow-wrap:anywhere]">{m.title}</span>
        {started ? (
          <span className="mt-2 flex items-center gap-2">
            <span className="w-full max-w-40">
              <Bar pct={pct} tone={here ? "primary" : "brand"} />
            </span>
            <span className="shrink-0 text-xs font-bold tabular-nums">{pct}%</span>
          </span>
        ) : null}
      </span>
      {complete ? <span className="shrink-0 text-xs font-bold">Done</span> : <ArrowRight className="size-5 shrink-0 transition-transform duration-fast ease-snappy group-hover/mod:translate-x-0.5" aria-hidden />}
    </Link>
  );
}

/* ------------------------------------------------------------ course home */

export function StudyHome({ modules, serverState, save, owner = "" }: { modules: StudyModule[]; serverState: LearnState | null; save: Save; owner?: string }) {
  initLearnStore(serverState, save, owner || undefined);
  const st = useLearnState(serverState ?? EMPTY);
  const today = istToday();
  const next = courseNext(modules, st.study, today);
  const statuses = modules.map((m) => moduleStatus(m, st.study));
  const progress = courseProgress(modules, st.study);
  const currentId = next.kind !== "done" ? next.module.id : null;

  const shelves = SHELVES.map((name, k) => ({ name, items: modules.map((m, i) => ({ m, i })).filter(({ m }) => shelfOf(m) === k) })).filter((s) => s.items.length);
  const link = "inline-flex min-h-11 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <PageHeader
          eyebrow="Study"
          title="Your course"
          className="pb-0"
          actions={
            <>
              <Link href="/study/notes" className={link}>
                <NotebookPen className="size-4" aria-hidden /> Summaries
              </Link>
              <Link href="/progress" className={link}>
                <Trophy className="size-4" aria-hidden /> Certificate
              </Link>
            </>
          }
        />
        {/* The course bar only once there is something on it: an empty bar
            on day one says "nothing done", which is not the point. */}
        {progress.pct > 0 ? (
          <div className="flex max-w-md items-center gap-3">
            <span className="flex-1">
              <Bar pct={progress.pct} />
            </span>
            <span className="shrink-0 text-sm font-bold tabular-nums">{progress.pct}% done</span>
          </div>
        ) : null}
      </div>

      <ContinueCard next={next} />

      <MarksList owner={owner} modules={modules} />

      {shelves.map((shelf, k) => (
        <section key={shelf.name} aria-labelledby={`shelf-${k}`} className="space-y-3">
          <h2 id={`shelf-${k}`} className="flex items-center gap-2 text-h2">
            <span aria-hidden className="size-2.5 rounded-[3px] bg-primary ring-2 ring-foreground" />
            {shelf.name}
          </h2>
          <ol className="grid gap-3 md:grid-cols-2">
            {shelf.items.map(({ m, i }) => (
              <li key={m.id}>
                <ModuleTile m={m} pct={progress.modules[i].pct} complete={statuses[i].complete} here={m.id === currentId} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- module page */

function StepHead({ n, title, done, current, sub }: { n: number; title: string; done: boolean; current: boolean; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full border-2 border-foreground text-base font-bold", done ? "bg-foreground text-background" : current ? "bg-primary text-primary-foreground" : "bg-card")}>
        {done ? <Check className="size-4" aria-hidden /> : n}
      </span>
      <div>
        <h3 className="text-xl font-bold leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function CheckpointRow({ m, cp, st }: { m: StudyModule; cp: Checkpoint; st: LearnState["study"] }) {
  const status = checkpointStatus(m, cp, st);
  const t = st.tests[cp.key];
  // Every checkpoint opens any time; "ready" only marks the good moment to take it.
  const label = status === "done" ? `Best ${t?.best ?? 0} of ${t?.total ?? 0}` : status === "ready" ? "Good time now" : "Any time";
  return (
    <Link href={checkpointHref(m, cp)} className={cn("mt-1 ml-9 flex min-h-11 items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2", status === "ready" ? "border-foreground bg-brand text-brand-foreground" : "border-foreground/40")}>
      <ListChecks className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 text-sm font-semibold">Checkpoint {cp.n}</span>
      <span className="shrink-0 text-right text-xs font-semibold">{label}</span>
    </Link>
  );
}

export function ModuleView({
  module: m,
  nextModule,
  serverState,
  save,
  owner = "",
  labOpen = false,
  labLinks = [],
}: {
  module: StudyModule;
  nextModule?: { id: string; title: string; num: number };
  serverState: LearnState | null;
  save: Save;
  owner?: string;
  /** Lab is unlocked for students, or this is an admin. Computed on the server. */
  labOpen?: boolean;
  labLinks?: LabLink[];
}) {
  initLearnStore(serverState, save, owner || undefined);
  const st = useLearnState(serverState ?? EMPTY);
  const today = istToday();
  const s = moduleStatus(m, st.study);
  const prog = moduleProgress(m, st.study);
  const next = moduleNext(m, st.study);
  const reading = readingSections(m);
  const test = testSection(m);
  const t = st.study.tests[m.id];
  const due = retestDue(m, st.study);
  const step = !next ? 5 : next.kind === "read" || next.kind === "checkpoint" ? 1 : next.kind === "write" ? 2 : next.kind === "practise" ? 3 : 4;
  const marksOf = useSectionMarks(owner, m.id);
  const cpAfter = new Map(checkpoints(m).map((cp) => [cp.sectionIds[cp.sectionIds.length - 1], cp]));

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link href="/study" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Back to Study
      </Link>

      <header className="relative overflow-hidden rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-7">
        <p className="text-eyebrow opacity-90">
          Module {m.num}
        </p>
        <h1 className="mt-2 break-words text-display">{m.title}</h1>
        <p className="mt-2 max-w-2xl font-semibold opacity-90">{m.tagline}</p>
        {prog.pct > 0 ? (
          <div className="mt-4 flex max-w-md items-center gap-3">
            <span className="flex-1">
              <Bar pct={prog.pct} tone="primary" />
            </span>
            <span className="shrink-0 text-xs font-bold tabular-nums">{prog.pct}% done</span>
          </div>
        ) : null}
        <span className="pointer-events-none absolute -right-4 -bottom-8 text-[8rem] opacity-15 select-none" aria-hidden>
          {m.emoji}
        </span>
      </header>

      {next ? (
        <ContinueCard
          next={next}
          onGo={next.kind === "practise" ? () => {
            const cur = getLearnState();
            if (cur) setLearnState(markActivity(cur, m.id, next.activityId, today));
          } : undefined}
        />
      ) : (
        <div className="rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground">
          <p className="text-xl font-bold">Module complete ✓</p>
          <p className="text-sm font-semibold">
            {due ? `Next re-test due on ${due}.` : "All re-tests done."}
          </p>
          {nextModule ? (
            <Link href={`/study/${nextModule.id}`} className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-foreground bg-foreground px-4 py-2 font-bold text-background">
              Start Module {nextModule.num}: {nextModule.title} <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
      )}

      {/* The four steps at a glance: where you are, what is done, one tap to each. */}
      <nav aria-label="Steps in this module" className="grid grid-cols-4 gap-2">
        {([
          ["#step-read", "Read", s.readDone === s.readTotal],
          ["#write", "Write", s.written],
          ["#step-practise", "Practise", s.actsDone === s.actsTotal],
          ["#step-test", "Test", Boolean(t)],
        ] as const).map(([href, label, isDone], k) => {
          const isNow = step === k + 1;
          if (k === 3 && !test) return null;
          return (
            <a
              key={href}
              href={href}
              aria-current={isNow ? "step" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border-2 px-1 py-2 text-center text-xs font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none sm:flex-row sm:gap-2 sm:text-sm",
                isNow ? "border-foreground bg-card hard-shadow-xs" : "border-foreground/25 bg-card/60",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground text-[0.7rem]",
                  isDone ? "bg-foreground text-background" : isNow ? "bg-primary text-primary-foreground" : "bg-card",
                )}
              >
                {isDone ? <Check className="size-3.5" /> : k + 1}
              </span>
              <span>{label}</span>
              {isDone ? <span className="sr-only">(done)</span> : isNow ? <span className="sr-only">(now)</span> : null}
            </a>
          );
        })}
      </nav>

      <details className="group rounded-2xl border-2 border-foreground bg-card px-4 py-1">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 font-bold [&::-webkit-details-marker]:hidden">
          <span className="flex-1">What you will learn</span>
          <ChevronDown className="size-5 shrink-0 transition-transform duration-base ease-snappy group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
        </summary>
        <ul className="mt-2 space-y-1.5 text-sm">
          {m.outcomes.map((o) => (
            <li key={o} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> {o}
            </li>
          ))}
        </ul>
        <div className="h-3" />
      </details>

      <section id="steps" aria-label="Steps" className="scroll-mt-shell space-y-6">
        {/* Step 1: Read */}
        <div id="step-read" className={cn("scroll-mt-shell rounded-3xl border-2 border-foreground bg-card p-5", step === 1 && "hard-shadow-md")}>
          <StepHead n={1} title="Read the notes" done={s.readDone === s.readTotal} current={step === 1} sub={`${s.readDone} of ${s.readTotal} sections read`} />
          {/* Long modules fold into their parts: the part you are on stays
              open, finished and later parts close to one line each, so
              Write, Practise and Test are a short scroll away, not 45 rows. */}
          <div className="mt-4 space-y-2">
            {partsOf(reading).map((g, gi, all) => {
              const doneHere = g.items.filter((sec) => st.study.done[studyKey(m.id, sec.id)]).length;
              const hasHere = g.items.some((sec) => next?.kind === "read" && next.section.id === sec.id);
              const firstOpen = all.findIndex((x) => x.items.some((sec) => !st.study.done[studyKey(m.id, sec.id)]));
              const open = all.length === 1 || hasHere || (next?.kind !== "read" && gi === firstOpen);
              const list = (
          <ol className="space-y-1">
            {g.items.map((sec) => {
              const isDone = Boolean(st.study.done[studyKey(m.id, sec.id)]);
              const here = next?.kind === "read" && next.section.id === sec.id;
              return (
                <li key={sec.id}>
                  <Link
                    href={sectionHref(m, sec)}
                    className={cn("flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 transition-colors", here ? "border-foreground bg-primary text-primary-foreground" : "border-transparent hover:border-foreground")}
                  >
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground text-xs", isDone && "bg-foreground text-background")}>
                      {isDone ? <Check className="size-3.5" aria-hidden /> : null}
                    </span>
                    <span className="min-w-0 flex-1 font-semibold leading-snug">
                      <span className="font-bold">{sec.num}</span> {sectionTitle(sec)}
                      {sec.tag === "extra" ? <span className="ml-2 rounded-full border border-current px-1.5 text-[0.6rem] font-bold uppercase">Extra</span> : null}
                    </span>
                    {marksOf(sec.id).bookmarked ? <BookmarkCheck className="size-4 shrink-0" aria-label="Bookmarked" /> : null}
                    {marksOf(sec.id).note ? <NotebookPen className="size-4 shrink-0" aria-label="Has my note" /> : null}
                    {here ? <span className="shrink-0 text-sm font-bold">Start →</span> : null}
                  </Link>
                  {cpAfter.get(sec.id) ? <CheckpointRow m={m} cp={cpAfter.get(sec.id)!} st={st.study} /> : null}
                </li>
              );
            })}
          </ol>
              );
              if (all.length === 1 || !g.part) return <div key={gi}>{list}</div>;
              const complete = doneHere === g.items.length;
              return (
                <details key={gi} open={open} className="group/part rounded-2xl border-2 border-foreground/15 open:border-foreground/30">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-3 py-2 [&::-webkit-details-marker]:hidden">
                    <span aria-hidden className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground", complete && "bg-foreground text-background")}>
                      {complete ? <Check className="size-3.5" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-snug [overflow-wrap:anywhere]">{g.part.replace(/^Part [0IVX]+ · /, "")}</span>
                      <span className="block text-caption text-muted-foreground tabular-nums">
                        {g.part.match(/^Part [0IVX]+/)?.[0] ?? ""}
                        {doneHere ? ` · ${doneHere} of ${g.items.length} read` : ""}
                      </span>
                    </span>
                    <ChevronDown className="size-5 shrink-0 transition-transform duration-base ease-snappy group-open/part:rotate-180 motion-reduce:transition-none" aria-hidden />
                  </summary>
                  <div className="px-1 pb-2">{list}</div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Step 2: Write */}
        <div id="write" className={cn("scroll-mt-shell rounded-3xl border-2 border-foreground bg-card p-5", step === 2 && "hard-shadow-md")}>
          <StepHead n={2} title="Write it out" done={s.written} current={step === 2} sub="On paper, from memory." />
          <p className="mt-3 leading-relaxed">{m.writeTask}</p>
          {s.written ? (
            <p className="mt-3 inline-flex items-center gap-1 font-bold">
              <Check className="size-4" aria-hidden /> Done on {st.study.written[m.id]}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                const cur = getLearnState();
                if (cur) setLearnState(markWritten(cur, m.id, today));
              }}
              className="mt-4 min-h-12 rounded-md border-2 border-foreground bg-card px-5 font-bold hard-shadow-sm"
            >
              I&apos;ve done this on paper (+20 XP)
            </button>
          )}
        </div>

        {/* Step 3: Practise */}
        <div id="step-practise" className={cn("scroll-mt-shell rounded-3xl border-2 border-foreground bg-card p-5", step === 3 && "hard-shadow-md")}>
          <StepHead n={3} title="Practise" done={s.actsDone === s.actsTotal} current={step === 3} sub={`${s.actsDone} of ${s.actsTotal} done`} />
          <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
            {m.activities.map((a) => {
              const isDone = Boolean(st.study.acts[m.id]?.[a.id]);
              return (
                <li key={a.id}>
                  <Link
                    href={activityHref(m, a.href)}
                    onClick={() => {
                      const cur = getLearnState();
                      if (cur) setLearnState(markActivity(cur, m.id, a.id, today));
                    }}
                    className="flex h-full items-start gap-3 rounded-2xl border-2 border-foreground bg-background p-3 transition-transform hover:-translate-y-0.5"
                  >
                    <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground", isDone && "bg-primary")}>
                      {isDone ? <Check className="size-3.5" aria-hidden /> : <Zap className="size-3.5" aria-hidden />}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold leading-tight">{a.title}</span>
                      <span className="text-sm text-muted-foreground">{a.why}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Step 4: Test */}
        {test ? (
          <div id="step-test" className={cn("scroll-mt-shell rounded-3xl border-2 border-foreground bg-card p-5", step === 4 && "hard-shadow-md")}>
            <StepHead
              n={4}
              title="Test, then re-test"
              done={Boolean(t)}
              current={step === 4}
              sub={t ? `Best ${t.best} of ${t.total}. Pass with 80% for your certificate.` : "Pass with 80% for your certificate."}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={sectionHref(m, test)} className={cn("inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-foreground px-5 font-bold hard-shadow-sm", step >= 4 ? "bg-primary text-primary-foreground" : "bg-card")}>
                {t ? <RotateCcw className="size-4" aria-hidden /> : null} {t ? "Re-test" : "Take the test"}
              </Link>
              {due ? <span className="text-sm font-bold">Next re-test due {due <= today ? "today" : `on ${due}`}</span> : null}
            </div>
          </div>
        ) : null}
      </section>

      {m.noteId || (labOpen && labLinks.length) ? (
        <details className="rounded-2xl border-2 border-foreground bg-card">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold">More for this module</summary>
          <div className="space-y-3 px-3 pb-3">
            {m.noteId ? (
              <Link href={`/study/notes/${m.noteId}`} className="flex min-h-12 items-center gap-3 rounded-2xl border-2 border-dashed border-foreground p-3">
                <NotebookPen className="size-5 shrink-0" aria-hidden />
                <span className="font-bold">One-page summary</span>
              </Link>
            ) : null}
            <RelatedLab open={labOpen} items={labLinks} />
          </div>
        </details>
      ) : null}

    </div>
  );
}
