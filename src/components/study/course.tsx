"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookmarkCheck, BookOpen, Check, Clock, Compass, Flame, Map as MapIcon, NotebookPen, PenLine, RotateCcw, Sparkles, Target, Trophy, Zap, ListChecks } from "lucide-react";
import { emptyState, istToday, liveStreak, markActivity, markWritten, studyKey, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { checkpointHref, checkpoints, checkpointStatus, type Checkpoint } from "@/lib/study/checkpoints";
import { activityHref, courseNext, hoursOf, moduleNext, moduleStatus, readingSections, retestDue, sectionHref, studyTime, testSection, type Next } from "@/lib/study/plan";
import type { StudyModule } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { BOARDS } from "@/lib/standing/boards";
import { ChaiSays } from "@/components/learn/chai";
import { MarksList, RelatedLab, useSectionMarks, type LabLink } from "./marks";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;

function nextLabel(n: Next): { eyebrow: string; title: string; sub?: string } {
  switch (n.kind) {
    case "read":
      return { eyebrow: `Module ${n.module.num} · Read`, title: `${n.section.num} ${n.section.title}`, sub: n.module.title };
    case "checkpoint":
      return { eyebrow: `Module ${n.module.num} · Checkpoint`, title: n.label.replace(/^Checkpoint \d+: /, "Quiz on "), sub: "Now that you've moved on, see what stuck" };
    case "write":
      return { eyebrow: `Module ${n.module.num} · Write it out`, title: "Reproduce the key frameworks on paper", sub: n.module.title };
    case "practise":
      return { eyebrow: `Module ${n.module.num} · Practise`, title: n.label, sub: n.module.title };
    case "test":
      return { eyebrow: `Module ${n.module.num} · Test`, title: "Take the module test", sub: n.module.title };
    case "retest":
      return { eyebrow: "Due today · Re-test", title: n.module.title, sub: "Spaced re-tests are what make it stick" };
    default:
      return { eyebrow: "All done", title: "You've completed every module", sub: "Keep your re-tests going" };
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
        <span className="block text-xl font-bold leading-tight sm:text-2xl">{l.title}</span>
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
  const secs = statuses.reduce((a, s) => a + s.seconds, 0);
  const read = statuses.reduce((a, s) => a + s.readDone, 0);
  const total = statuses.reduce((a, s) => a + s.readTotal, 0);
  const complete = statuses.filter((s) => s.complete).length;
  const totalMinutes = modules.reduce((a, m) => a + m.minutes, 0);
  const streak = liveStreak(st.streak, today);
  const currentId = next.kind !== "done" ? next.module.id : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <p className="text-eyebrow text-link">Notes</p>
        <h1 className="text-h1">Your notes, module by module</h1>
        <p className="max-w-2xl text-muted-foreground">
          {modules.length} {modules.length === 1 ? "module" : "modules"}, {studyTime(totalMinutes)} of focused study. Work through them in order: read, check yourself, write it out, practise, then take the test. We keep your place.
        </p>
      </header>

      <ContinueCard next={next} />

      <nav aria-label="Your progress" className="flex flex-wrap gap-2">
        <Link href="/study/map" className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
          <MapIcon className="size-4" aria-hidden /> Strengths &amp; weak spots
        </Link>
        <Link href="/study/placement" className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-foreground bg-card px-4 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
          <Compass className="size-4" aria-hidden /> Placement quiz
        </Link>
      </nav>

      <Link
        href="/prep"
        className="flex min-h-14 items-center gap-3 rounded-md border-2 border-foreground/70 bg-card px-4 py-3 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        <Target className="size-5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Psychology Entrance &amp; Competitive Exam Preparation</span>
          <span className="block text-sm text-muted-foreground">CUET-PG · UGC-NET · Clinical Psychology Entrances. One course for all three.</span>
        </span>
        <ArrowRight className="size-4 shrink-0" aria-hidden />
      </Link>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {[
          { icon: Clock, value: hoursOf(secs), label: "studied" },
          { icon: BookOpen, value: `${read}/${total}`, label: "sections read" },
          { icon: Trophy, value: `${complete}/${modules.length}`, label: "modules done" },
          { icon: Flame, value: String(streak), label: "day streak" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-2xl border-2 border-foreground bg-card p-3">
            <p className="flex items-center gap-1.5 text-2xl font-bold">
              <Icon className="size-5" aria-hidden /> {value}
            </p>
            <p className="text-caption text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <MarksList owner={owner} modules={modules} />

      <section aria-labelledby="modules">
        <h2 id="modules" className="text-h2">
          The modules
        </h2>
        <p className="text-sm text-muted-foreground">In curriculum order. Your current module is highlighted.</p>
        <ol className="mt-4 space-y-3">
          {modules.map((m, i) => {
            const s = statuses[i];
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
                    <span className="block text-lg font-bold leading-tight">{m.title}</span>
                    <span className="mt-2 flex items-center gap-3">
                      <span className="w-full max-w-60">
                        <Bar pct={s.pct} tone={here ? "primary" : "brand"} />
                      </span>
                      <span className="shrink-0 text-xs font-bold">{s.complete ? "Complete" : s.pct ? `${s.pct}%` : studyTime(m.minutes)}</span>
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="More ways to practise" className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3">
        <Link href="/games" className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-foreground p-4 text-background">
          <Sparkles className="size-6 shrink-0 text-primary" aria-hidden />
          <span>
            <span className="block font-bold">Games</span>
            <span className="text-caption opacity-85">Review, Coach, quizzes</span>
          </span>
        </Link>
        <Link href="/study/notes" className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4">
          <NotebookPen className="size-6 shrink-0" aria-hidden />
          <span>
            <span className="block font-bold">One-page summaries</span>
            <span className="text-caption text-muted-foreground">One page per topic, before exams</span>
          </span>
        </Link>
        <Link href={BOARDS.quiz.href} className="flex items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4">
          <Trophy className="size-6 shrink-0" aria-hidden />
          <span>
            <span className="block font-bold">{BOARDS.quiz.label}</span>
            <span className="text-caption text-muted-foreground">{BOARDS.quiz.explainer} This week.</span>
          </span>
        </Link>
      </section>
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
        <ArrowLeft className="size-4" aria-hidden /> All modules
      </Link>

      <header className="relative overflow-hidden rounded-3xl border-2 border-foreground bg-brand p-5 text-brand-foreground sm:p-7">
        <p className="text-xs font-bold uppercase opacity-90">
          Module {m.num}
        </p>
        <h1 className="mt-2 break-words text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl short:lg:text-4xl">{m.title}</h1>
        <p className="mt-2 max-w-2xl font-semibold opacity-90">{m.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full border-2 border-brand-foreground px-3 py-1">{studyTime(m.minutes)}</span>
          <span className="rounded-full border-2 border-brand-foreground px-3 py-1">{reading.length} sections</span>
          {test ? <span className="rounded-full border-2 border-brand-foreground px-3 py-1">Test included</span> : null}
          <span className="rounded-full border-2 border-brand-foreground px-3 py-1">You&apos;ve studied {hoursOf(s.seconds)}</span>
        </div>
        <div className="mt-4 max-w-md">
          <Bar pct={s.pct} tone="primary" />
          <p className="mt-1 text-xs font-bold">{s.pct}% complete</p>
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
            {due ? `Your next re-test is due on ${due}. It takes 20 minutes and doubles how much you keep.` : "All re-tests done. This module is in long-term memory."}
          </p>
          {nextModule ? (
            <Link href={`/study/${nextModule.id}`} className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-md border-2 border-foreground bg-foreground px-4 py-2 font-bold text-background">
              Start Module {nextModule.num}: {nextModule.title} <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        <section className="rounded-3xl border-2 border-foreground bg-card p-5">
          <h2 className="text-lg font-bold">By the end, you can</h2>
          <ul className="mt-2 space-y-1.5 text-sm">
            {m.outcomes.map((o) => (
              <li key={o} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> {o}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border-2 border-foreground bg-foreground p-5 text-background">
          <h2 className="text-lg font-bold text-primary">How to study this</h2>
          <ol className="mt-2 space-y-1.5 text-sm">
            <li><b>1 Read</b> each section. After every few sections, once you&apos;ve moved on, a checkpoint quiz asks what stuck.</li>
            <li><b>2 Write</b> the key frameworks on paper from memory.</li>
            <li><b>3 Practise</b> with the activities for this topic.</li>
            <li><b>4 Test</b> yourself, then re-test after 3, 7 and 21 days.</li>
          </ol>
        </section>
      </div>

      <section id="steps" aria-label="Steps" className="scroll-mt-24 space-y-6">
        {/* Step 1: Read */}
        <div className={cn("rounded-3xl border-2 border-foreground bg-card p-5", step === 1 && "hard-shadow-md")}>
          <StepHead n={1} title="Read the notes" done={s.readDone === s.readTotal} current={step === 1} sub={`${s.readDone} of ${s.readTotal} sections · ${studyTime(m.minutes)} in all`} />
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
                      <span className="font-bold">{sec.num}</span> {sec.title}
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
          <StepHead n={2} title="Write it out" done={s.written} current={step === 2} sub="On paper, from memory. About an hour." />
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
          <StepHead n={3} title="Practise" done={s.actsDone === s.actsTotal} current={step === 3} sub={`${s.actsDone} of ${s.actsTotal} activities · each opens, then brings you back here`} />
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
              sub={t ? `Best score ${t.best} of ${t.total} · ${t.tries} attempt${t.tries === 1 ? "" : "s"}` : "Answer every question before checking"}
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

      <RelatedLab open={labOpen} items={labLinks} />

      {m.noteId ? (
        <Link href={`/study/notes/${m.noteId}`} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-foreground p-4">
          <NotebookPen className="size-6 shrink-0" aria-hidden />
          <span>
            <span className="block font-bold">One-page summary</span>
            <span className="text-sm text-muted-foreground">For the night before the exam, after you&apos;ve done the module.</span>
          </span>
        </Link>
      ) : null}

      <ChaiSays mood="happy" size={64}>
        One section at a time. Answering the recall check before you move on is the part that actually builds memory.
      </ChaiSays>
    </div>
  );
}
