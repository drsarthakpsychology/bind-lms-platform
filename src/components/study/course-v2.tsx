"use client";

import * as React from "react";
import Link from "next/link";
import { BookmarkCheck, Check, ChevronDown, ChevronRight, ListChecks, NotebookPen, RotateCcw } from "lucide-react";
import { emptyState, istToday, markActivity, markWritten, studyKey, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { checkpointHref, checkpoints, checkpointStatus, type Checkpoint } from "@/lib/study/checkpoints";
import { activityHref, courseNext, moduleNext, moduleStatus, readingSections, retestDue, sectionHref, sectionTitle, testSection } from "@/lib/study/plan";
import { courseProgress, moduleProgress } from "@/lib/study/progress";
import type { StudyModule } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { HeroButton, PageFrame, Row, RowList, Section, BackLink, NextStep } from "@/components/ds";
import { MarksList, useSectionMarks, type LabLink } from "./marks";
import { nextLabel, partsOf, shelfOf, SHELVES } from "./course";

const EMPTY = emptyState();
type Save = (s: LearnState) => Promise<unknown>;

const rowLink = "group/row -mx-2 flex min-h-14 min-w-0 items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]";
const chevron = "size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/row:translate-x-0.5";

function DoneMark({ on, className }: { on: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full", on ? "bg-primary text-primary-foreground" : "border-[1.5px] border-[var(--ds-card-line)]", className)}>
      {on ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

/* ------------------------------------------------------------ /study */

/** Study in the new design: one Continue, then the modules as compact rows in three shelves. */
export function StudyHomeV2({ modules, serverState, save, owner = "" }: { modules: StudyModule[]; serverState: LearnState | null; save: Save; owner?: string }) {
  initLearnStore(serverState, save, owner || undefined);
  const st = useLearnState(serverState ?? EMPTY);
  const today = istToday();
  const next = courseNext(modules, st.study, today);
  const statuses = modules.map((m) => moduleStatus(m, st.study));
  const progress = courseProgress(modules, st.study);
  const currentId = next.kind !== "done" ? next.module.id : null;
  const l = nextLabel(next);
  const shelves = SHELVES.map((name, k) => ({ name, items: modules.map((m, i) => ({ m, i })).filter(({ m }) => shelfOf(m) === k) })).filter((s) => s.items.length);

  return (
    <PageFrame title="Study">
      <NextStep
        label={l.eyebrow}
        title={l.title}
        sub={l.sub}
        pct={progress.pct}
        pctLabel="Course progress"
        pctText={`${progress.pct}% done`}
        href={next.href}
        action={next.kind === "done" ? "Review" : "Continue"}
      />

      <MarksList owner={owner} modules={modules} />

      {shelves.map((shelf, k) => (
        <Section key={shelf.name} id={`shelf-${k}`} title={shelf.name}>
          <ol className="min-w-0 border-t border-[var(--ds-hairline)] md:columns-2 md:gap-12 md:border-t-0">
            {shelf.items.map(({ m, i }) => {
              const pct = progress.modules[i].pct;
              const complete = statuses[i].complete;
              const here = m.id === currentId;
              return (
                <li key={m.id} className="min-w-0 break-inside-avoid border-b border-[var(--ds-hairline)]">
                  <Link href={`/study/${m.id}`} aria-current={here ? "step" : undefined} className={rowLink}>
                    <span aria-hidden className={cn("w-7 shrink-0 type-small type-num", here ? "font-bold text-foreground" : "text-muted-foreground")}>
                      {String(m.num).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className={cn("type-body [overflow-wrap:anywhere]", here ? "font-bold" : "font-semibold")}>
                        <span className="sr-only">Module {m.num}: </span>
                        {m.title}
                      </span>
                      {here ? <span className="type-small font-semibold text-foreground">You are here</span> : null}
                    </span>
                    {complete ? (
                      <>
                        <DoneMark on />
                        <span className="sr-only">Done</span>
                      </>
                    ) : pct > 0 ? (
                      <span className="shrink-0 type-small text-muted-foreground type-num">{pct}%</span>
                    ) : null}
                    <ChevronRight aria-hidden className={chevron} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </Section>
      ))}

      <Section title="More">
        <RowList>
          <Row href="/study/notes" title="One-page summaries" />
          <Row href="/progress" title="Certificate" />
        </RowList>
      </Section>
    </PageFrame>
  );
}

/* ------------------------------------------------------------ /study/[module] */

function CheckpointLine({ m, cp, st }: { m: StudyModule; cp: Checkpoint; st: LearnState["study"] }) {
  const status = checkpointStatus(m, cp, st);
  const t = st.tests[cp.key];
  const label = status === "done" ? `Best ${t?.best ?? 0} of ${t?.total ?? 0}` : status === "ready" ? "Good time now" : "Any time";
  return (
    <li className="min-w-0">
      <Link href={checkpointHref(m, cp)} className={rowLink}>
        <ListChecks className="size-5 shrink-0" aria-hidden />
        <span className={cn("min-w-0 flex-1 type-body", status === "ready" ? "font-bold" : "font-semibold")}>Checkpoint {cp.n}</span>
        <span className={cn("shrink-0 type-small type-num", status === "ready" ? "font-semibold text-foreground" : "text-muted-foreground")}>{label}</span>
        <ChevronRight aria-hidden className={chevron} />
      </Link>
    </li>
  );
}

/** One module in the new design: what is next, then its four steps as plain sections. */
export function ModuleViewV2({
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
  const l = next ? nextLabel(next) : null;
  const noteActivity = (activityId: string) => {
    const cur = getLearnState();
    if (cur) setLearnState(markActivity(cur, m.id, activityId, today));
  };

  const steps = (
    [
      ["#step-read", "Read", s.readDone === s.readTotal],
      ["#write", "Write", s.written],
      ["#step-practise", "Practise", s.actsDone === s.actsTotal],
      ["#step-test", "Test", Boolean(t)],
    ] as const
  ).filter((_, k) => k !== 3 || Boolean(test));

  return (
    <PageFrame width="reading" className="!gap-8 md:!gap-10">
      <header className="flex min-w-0 flex-col gap-2">
        <BackLink href="/study">Study</BackLink>
        <p className="type-small text-muted-foreground type-num">Module {m.num}</p>
        <h1 className="type-h1 [overflow-wrap:anywhere]">{m.title}</h1>
        <p className="type-body text-muted-foreground [overflow-wrap:anywhere]">{m.tagline}</p>
      </header>

      {next && l ? (
        <NextStep
          label={l.eyebrow.replace(/^Module \d+ · /, "Next · ")}
          title={l.title}
          pct={prog.pct}
          pctLabel="Module progress"
          pctText={`${prog.pct}% done`}
          href={next.href}
          action="Continue"
          onGo={next.kind === "practise" ? () => noteActivity(next.activityId) : undefined}
        />
      ) : (
        <section aria-label="Continue" className="flex min-w-0 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="flex items-center gap-2 type-h2">
              <DoneMark on className="size-6" /> Module complete
            </h2>
            <p className="type-body text-muted-foreground">{due ? `Next re-test due on ${due}.` : "All re-tests done."}</p>
          </div>
          {nextModule ? (
            <HeroButton href={`/study/${nextModule.id}`}>
              Start Module {nextModule.num}: {nextModule.title}
            </HeroButton>
          ) : null}
        </section>
      )}

      {/* The four steps in one row: what is done, where you are, a tap to each. */}
      <nav aria-label="Steps in this module" className="flex min-w-0 gap-5 overflow-x-auto border-b border-[var(--ds-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {steps.map(([href, label, isDone], k) => {
          const isNow = step === k + 1;
          return (
            <a
              key={href}
              href={href}
              aria-current={isNow ? "step" : undefined}
              className={cn(
                "relative inline-flex h-12 min-w-11 shrink-0 items-center justify-center gap-1.5 px-1 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
                "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full",
                isNow ? "text-foreground after:bg-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isDone ? <Check className="size-4" strokeWidth={3} aria-hidden /> : null}
              {label}
              {isDone ? <span className="sr-only">(done)</span> : isNow ? <span className="sr-only">(now)</span> : null}
            </a>
          );
        })}
      </nav>

      <section id="steps" aria-label="Steps" className="flex min-w-0 scroll-mt-shell flex-col gap-[var(--ds-section)]">
        {/* 1 Read */}
        <Section id="step-read" title="Read the notes" className="scroll-mt-shell" action={<span className="text-muted-foreground type-num">{s.readDone} of {s.readTotal} read</span>}>
          <div className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {partsOf(reading).map((g, gi, all) => {
              const doneHere = g.items.filter((sec) => st.study.done[studyKey(m.id, sec.id)]).length;
              const hasHere = g.items.some((sec) => next?.kind === "read" && next.section.id === sec.id);
              const firstOpen = all.findIndex((x) => x.items.some((sec) => !st.study.done[studyKey(m.id, sec.id)]));
              const open = all.length === 1 || hasHere || (next?.kind !== "read" && gi === firstOpen);
              const list = (
                <ol className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)]">
                  {g.items.map((sec) => {
                    const isDone = Boolean(st.study.done[studyKey(m.id, sec.id)]);
                    const here = next?.kind === "read" && next.section.id === sec.id;
                    const marks = marksOf(sec.id);
                    return (
                      <React.Fragment key={sec.id}>
                        <li className="min-w-0">
                          <Link href={sectionHref(m, sec)} aria-current={here ? "step" : undefined} className={rowLink}>
                            <DoneMark on={isDone} />
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className={cn("type-body [overflow-wrap:anywhere]", here ? "font-bold" : "font-semibold")}>
                                <span className="mr-1.5 text-muted-foreground type-num">{sec.num}</span>
                                {sectionTitle(sec)}
                              </span>
                              {here || sec.tag === "extra" ? (
                                <span className={cn("type-small", here ? "font-semibold text-foreground" : "text-muted-foreground")}>{[here ? "Start here" : null, sec.tag === "extra" ? "Extra" : null].filter(Boolean).join(" · ")}</span>
                              ) : null}
                            </span>
                            {marks.bookmarked ? <BookmarkCheck className="size-4 shrink-0 text-muted-foreground" aria-label="Bookmarked" /> : null}
                            {marks.note ? <NotebookPen className="size-4 shrink-0 text-muted-foreground" aria-label="Has my note" /> : null}
                            <ChevronRight aria-hidden className={chevron} />
                          </Link>
                        </li>
                        {cpAfter.get(sec.id) ? <CheckpointLine m={m} cp={cpAfter.get(sec.id)!} st={st.study} /> : null}
                      </React.Fragment>
                    );
                  })}
                </ol>
              );
              if (all.length === 1 || !g.part) return <div key={gi}>{list}</div>;
              const complete = doneHere === g.items.length;
              return (
                <details key={gi} open={open} className="group/part min-w-0">
                  <summary className="-mx-2 flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="type-body font-bold [overflow-wrap:anywhere]">{g.part.replace(/^Part [0IVX]+ · /, "")}</span>
                      <span className="type-small text-muted-foreground type-num">
                        {[g.part.match(/^Part [0IVX]+/)?.[0], complete ? "Read" : doneHere ? `${doneHere} of ${g.items.length} read` : null].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    {complete ? <DoneMark on /> : null}
                    <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-open/part:rotate-180 motion-reduce:transition-none" aria-hidden />
                  </summary>
                  <div className="border-t border-[var(--ds-hairline)] pl-3">{list}</div>
                </details>
              );
            })}
          </div>
        </Section>

        {/* 2 Write */}
        <Section id="write" title="Write it out" className="scroll-mt-shell" action={<span className="text-muted-foreground">On paper, from memory</span>}>
          <p className="type-reading [overflow-wrap:anywhere]">{m.writeTask}</p>
          {s.written ? (
            <p className="inline-flex items-center gap-2 type-small font-semibold">
              <DoneMark on /> Done on {st.study.written[m.id]}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                const cur = getLearnState();
                if (cur) setLearnState(markWritten(cur, m.id, today));
              }}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] px-5 type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] md:w-fit"
            >
              I&apos;ve done this on paper (+20 XP)
            </button>
          )}
        </Section>

        {/* 3 Practise */}
        <Section id="step-practise" title="Practise" className="scroll-mt-shell" action={<span className="text-muted-foreground type-num">{s.actsDone} of {s.actsTotal} done</span>}>
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {m.activities.map((a) => {
              const isDone = Boolean(st.study.acts[m.id]?.[a.id]);
              return (
                <li key={a.id} className="min-w-0">
                  <Link href={activityHref(m, a.href)} onClick={() => noteActivity(a.id)} className={rowLink}>
                    <DoneMark on={isDone} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{a.title}</span>
                      <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{a.why}</span>
                    </span>
                    <ChevronRight aria-hidden className={chevron} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* 4 Test */}
        {test ? (
          <Section id="step-test" title="Test, then re-test" className="scroll-mt-shell">
            <p className="type-body text-muted-foreground">{t ? `Best ${t.best} of ${t.total}. Pass with 80% for your certificate.` : "Pass with 80% for your certificate."}</p>
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href={sectionHref(m, test)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] px-5 type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] md:w-fit"
              >
                {t ? <RotateCcw className="size-4" aria-hidden /> : null} {t ? "Re-test" : "Take the test"}
              </Link>
              {due ? <span className="type-small font-semibold">Next re-test due {due <= today ? "today" : `on ${due}`}</span> : null}
            </div>
          </Section>
        ) : null}
      </section>

      <Section title="More for this module">
        <div className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          <details className="group min-w-0">
            <summary className="-mx-2 flex min-h-14 cursor-pointer list-none items-center gap-3 rounded-lg px-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1 type-body font-semibold">What you will learn</span>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
            </summary>
            <ul className="flex flex-col gap-2 pt-1 pb-4 type-body">
              {m.outcomes.map((o) => (
                <li key={o} className="flex min-w-0 gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden /> <span className="min-w-0 [overflow-wrap:anywhere]">{o}</span>
                </li>
              ))}
            </ul>
          </details>
          {m.noteId ? (
            <Link href={`/study/notes/${m.noteId}`} className={rowLink}>
              <span className="min-w-0 flex-1 type-body font-semibold">One-page summary</span>
              <ChevronRight aria-hidden className={chevron} />
            </Link>
          ) : null}
          {labOpen
            ? labLinks.map((x) => (
                <Link key={x.id} href={`/games/lab/${x.id}`} className={rowLink}>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="type-body font-semibold [overflow-wrap:anywhere]">{x.title}</span>
                    <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">In the Lab · {x.hook}</span>
                  </span>
                  <ChevronRight aria-hidden className={chevron} />
                </Link>
              ))
            : null}
        </div>
      </Section>
    </PageFrame>
  );
}
