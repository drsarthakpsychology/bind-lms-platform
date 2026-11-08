"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookmarkCheck, BookOpen, Check, NotebookPen, PenLine, RotateCcw, Trophy, Zap, ListChecks } from "lucide-react";
import { emptyState, istToday, markActivity, markWritten, studyKey, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { checkpointHref, checkpoints, checkpointStatus, type Checkpoint } from "@/lib/study/checkpoints";
import { activityHref, courseNext, moduleNext, moduleStatus, readingSections, retestDue, sectionHref, sectionTitle, testSection, type Next } from "@/lib/study/plan";
import { courseProgress, moduleProgress } from "@/lib/study/progress";
import type { StudyModule } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { MarksList, RelatedLab, useSectionMarks, type LabLink } from "./marks";

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

function ContinueCard({ next, onGo }: { next: Next; onGo?: () => void }) {
  const l = nextLabel(next);
  return (
    <Link
      href={next.href}
      onClick={onGo}
      className="btn-sweep group flex items-center gap-4 rounded-3xl border-2 border-foreground bg-primary p-5 text-primary-foreground hard-shadow-md transition-transform active:translate-y-0.5 sm:p-6"
    >
      <span className="hidden size-14 shrink-0 place-items-center rounded-2xl border-2 border-foreground bg-card text-foreground sm:grid">
        {next.kind === "read" ? <BookOpen className="size-7" aria-hidden /> : next.kind === "checkpoint" ? <ListChecks className="size-7" aria-hidden /> : next.kind === "write" ? <PenLine className="size-7" aria-hidden /> : next.kind === "practise" ? <Zap className="size-7" aria-hidden /> : <RotateCcw className="size-7" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">{l.eyebrow}</span>
        <span className="block text-xl font-bold leading-tight break-words sm:text-2xl">{l.title}</span>
        {l.sub ? <span className="mt-0.5 block text-sm font-semibold opacity-80">{l.sub}</span> : null}
      </span>
      {/* Narrow phones: just the arrow, so the title keeps its room. */}
      <span className="hidden shrink-0 items-center gap-1 rounded-md border-2 border-foreground bg-foreground px-4 py-2 font-bold text-background min-[400px]:flex">
        {next.kind === "done" ? "Review" : "Continue"} <ArrowRight className="size-4" aria-hidden />
      </span>
      <ArrowRight className="size-6 shrink-0 min-[400px]:hidden" aria-hidden />
    </Link>
  );
}

function Bar({ pct, tone = "brand" }: { pct: number; tone?: "brand" | "primary" }) {
  return (
    <span className="block h-2.5 overflow-hidden rounded-full border-2 border-foreground bg-card">
      <span className={cn("block h-full transition-[width] duration-700", tone === "brand" ? "bg-brand" : "bg-primary")} style={{ width: `${pct}%` }} />
    </span>
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-h1">Study</h1>
        <p className="max-w-2xl text-muted-foreground">{progress.pct}% complete</p>
      </header>

      <ContinueCard next={next} />

      <Link href="/progress" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link underline-offset-4 hover:underline">
        <Trophy className="size-4" aria-hidden /> Your progress and certificate <ArrowRight className="size-4" aria-hidden />
      </Link>

      <section aria-labelledby="modules">
        <h2 id="modules" className="text-h2">
          The modules
        </h2>
        <ol className="mt-4 space-y-3">
          {modules.map((m, i) => {
            const s = statuses[i];
            const pct = progress.modules[i].pct;
            const here = m.id === currentId;
            return (
              <li key={m.id}>
                <Link
                  href={`/study/${m.id}`}
                  className={cn(
                    "flex items-center gap-4 rounded-3xl border-2 border-foreground p-4 transition-transform hover:-translate-y-0.5",
                    here ? "bg-brand text-brand-foreground hard-shadow-md" : "bg-card",
                  )}
                >
                  <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl border-2 text-2xl", here ? "border-brand-foreground" : "border-foreground", s.complete && "bg-primary")}>
                    {s.complete ? <Check className="size-6 text-primary-foreground" aria-hidden /> : <span aria-hidden>{m.emoji}</span>}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase opacity-80">
                      Module {m.num}
                    </span>
                    <span className="block text-lg font-bold leading-tight break-words">{m.title}</span>
                    <span className="mt-2 flex items-center gap-3">
                      <span className="w-full max-w-60">
                        <Bar pct={pct} tone={here ? "primary" : "brand"} />
                      </span>
                      <span className="shrink-0 text-xs font-bold">{pct}% complete</span>
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <MarksList owner={owner} modules={modules} />

      <Link href="/study/notes" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline">
        <NotebookPen className="size-4" aria-hidden /> One-page summaries
      </Link>
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
      <Link href="/study" className="inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-sm font-bold">
        <ArrowLeft className="size-4" aria-hidden /> Back to Study
      </Link>

      <header className="relative overflow-hidden rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-7">
        <p className="text-xs font-bold uppercase opacity-90">
          Module {m.num}
        </p>
        <h1 className="mt-2 break-words text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl short:lg:text-4xl">{m.title}</h1>
        <p className="mt-2 max-w-2xl font-semibold opacity-90">{m.tagline}</p>
        <div className="mt-4 max-w-md">
          <Bar pct={prog.pct} tone="primary" />
          <p className="mt-1 text-xs font-bold">{prog.pct}% complete</p>
        </div>
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

      <details className="rounded-[10px] border-2 border-foreground bg-card p-4">
        <summary className="flex min-h-11 cursor-pointer items-center font-bold">What you will learn</summary>
        <ul className="mt-2 space-y-1.5 text-sm">
          {m.outcomes.map((o) => (
            <li key={o} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> {o}
            </li>
          ))}
        </ul>
      </details>

      <section id="steps" aria-label="Steps" className="scroll-mt-24 space-y-6">
        {/* Step 1: Read */}
        <div className={cn("rounded-3xl border-2 border-foreground bg-card p-5", step === 1 && "hard-shadow-md")}>
          <StepHead n={1} title="Read the notes" done={s.readDone === s.readTotal} current={step === 1} sub={`${s.readDone} of ${s.readTotal} sections read`} />
          <ol className="mt-4 space-y-1">
            {reading.map((sec, k) => {
              const isDone = Boolean(st.study.done[studyKey(m.id, sec.id)]);
              const here = next?.kind === "read" && next.section.id === sec.id;
              const part = k === 0 || reading[k - 1].part !== sec.part ? sec.part : undefined;
              return (
                <li key={sec.id}>
                  {part ? <p className="mt-4 mb-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">{part}</p> : null}
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
        </div>

        {/* Step 2: Write */}
        <div id="write" className={cn("scroll-mt-24 rounded-3xl border-2 border-foreground bg-card p-5", step === 2 && "hard-shadow-md")}>
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
        <div className={cn("rounded-3xl border-2 border-foreground bg-card p-5", step === 3 && "hard-shadow-md")}>
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
          <div className={cn("rounded-3xl border-2 border-foreground bg-card p-5", step === 4 && "hard-shadow-md")}>
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
