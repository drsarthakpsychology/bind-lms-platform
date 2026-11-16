"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, ChevronRight, FileText, Lock, Play } from "lucide-react";

import { STATE_LABEL, type OverviewLesson, type OverviewModel } from "@/components/course/course-overview-view";
import { HeroButton, PageFrame, Row, RowList, Section, Choices, BackLink, ProgressLine, ProgressRing, EmptyLine, TabRow } from "@/components/ds";
import { cn } from "@/lib/utils";

type Tab = "lectures" | "materials" | "assignments";
type Filter = "all" | "todo" | "watched";

/** What to do next in this course: small label, the lecture, a thin line, one button. */
export function ContinueBlock({ model, courseTitle }: { model: OverviewModel; courseTitle?: string }) {
  const pct = model.totalLessons ? (model.completedCount / model.totalLessons) * 100 : 0;
  const allDone = model.totalLessons > 0 && model.completedCount === model.totalLessons;
  if (!model.next) {
    return (
      <section aria-label="Continue" className="flex min-w-0 flex-col gap-2">
        <p className="type-h2">{allDone ? "You've watched every lecture." : "Nothing to watch yet."}</p>
        <p className="type-body text-muted-foreground">{allDone ? "Rewatch anything, any time." : "New lectures appear here as they open."}</p>
      </section>
    );
  }
  const n = model.next;
  return (
    <section aria-label="Continue" className="ds-hero flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">
          {courseTitle ? `${courseTitle} · ` : ""}
          {n.kind === "assignment" ? "Assignment" : n.number ? `Lecture ${n.number}` : "Lecture"} · Week {n.week}
        </p>
        <h2 className="type-h2 [overflow-wrap:anywhere]">{n.title}</h2>
      </div>
      {model.totalLessons > 0 ? (
        <div className="flex min-w-0 items-center gap-3">
          <ProgressLine pct={pct} label="Lectures watched" />
          <span className="shrink-0 type-small text-muted-foreground type-num">
            {model.completedCount} of {model.totalLessons} watched
          </span>
        </div>
      ) : null}
      <HeroButton href={n.href} icon={n.kind === "lesson" ? <Play className="fill-current" /> : <ArrowRight />} className="md:w-full md:min-w-0">
        {n.kind === "assignment" ? "Open the assignment" : n.midway ? "Resume" : model.started ? "Continue" : "Start"}
      </HeroButton>
    </section>
  );
}

/** One lecture as a row: its number, the title, where it stands. Locked lectures are not links. */
function LectureRow({ lesson }: { lesson: OverviewLesson }) {
  const locked = !lesson.href;
  const num = String(lesson.number).padStart(2, "0");
  const note = [
    lesson.state === "done" || lesson.state === "open" || lesson.state === "later" ? null : STATE_LABEL[lesson.state],
    !lesson.hasVideo && lesson.href ? "Reading" : null,
    lesson.cohorts?.length ? lesson.cohorts.map((c) => c.name).join(", ") : null,
  ].filter(Boolean);
  const body = (
    <>
      <span aria-hidden className={cn("w-7 shrink-0 type-small type-num", lesson.state === "next" ? "font-bold text-foreground" : "text-muted-foreground")}>
        {num}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("type-body [overflow-wrap:anywhere]", lesson.state === "next" ? "font-bold" : "font-semibold", locked && "text-muted-foreground")}>{lesson.title}</span>
        {note.length ? <span className={cn("type-small [overflow-wrap:anywhere]", lesson.state === "next" ? "font-semibold text-foreground" : "text-muted-foreground")}>{note.join(" · ")}</span> : null}
      </span>
      {lesson.state === "done" ? (
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
          <span className="sr-only">Watched</span>
        </span>
      ) : locked ? (
        <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      ) : (
        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/row:translate-x-0.5" />
      )}
    </>
  );
  const inner = "flex min-h-14 min-w-0 items-center gap-3 py-2";
  if (locked) return <li className={inner}>{body}</li>;
  return (
    <li className="min-w-0">
      <Link
        href={lesson.href!}
        prefetch
        aria-label={`Lecture ${lesson.number}: ${lesson.title}`}
        className={cn(inner, "group/row -mx-2 rounded-lg px-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]")}
      >
        {body}
      </Link>
    </li>
  );
}

const SUBMITTED: Record<"not_started" | "submitted" | "graded", string> = { not_started: "To do", submitted: "Submitted", graded: "Graded" };

/**
 * A course in the new design: an editorial list of its lectures by week.
 * Phones: what to watch next, then the list. Desktop: the list on the left,
 * what is next in a narrow column on the right. Same model as the old screen.
 */
export function CourseV2({ model }: { model: OverviewModel }) {
  const [tab, setTab] = React.useState<Tab>("lectures");
  const [filter, setFilter] = React.useState<Filter>("all");
  const mine = model.myCohorts ?? [];
  const [cohort, setCohort] = React.useState<string | null>(null);

  const materials = model.weeks.flatMap((w) => w.materials.map((m) => ({ ...m, week: w.num })));
  const assignments = model.weeks.flatMap((w) => w.assignments.map((a) => ({ ...a, week: w.num })));
  const weeks = model.weeks
    .map((w) => ({
      ...w,
      lessons: w.lessons.filter(
        (l) =>
          (filter === "all" ? true : filter === "watched" ? l.state === "done" : l.state !== "done" && l.href !== null) &&
          (!cohort || Boolean(l.cohorts?.some((c) => c.id === cohort))),
      ),
    }))
    .filter((w) => w.lessons.length > 0);

  const tabs: { id: Tab; label: string }[] = [{ id: "lectures", label: "Lectures" }];
  if (materials.length) tabs.push({ id: "materials", label: "Materials" });
  if (assignments.length) tabs.push({ id: "assignments", label: "Assignments" });

  return (
    <PageFrame area="learn" className="!gap-6 md:!gap-8">
      <header className="flex min-w-0 flex-col gap-1">
        {model.backHref ? <BackLink href={model.backHref}>All courses</BackLink> : null}
        <h1 className="type-h1 [overflow-wrap:anywhere]">{model.title}</h1>
        {!model.published ? <p className="type-small text-muted-foreground">Draft, only you can see this</p> : null}
        {mine.length === 1 ? <p className="type-small text-muted-foreground">Your cohort: {mine[0].name}</p> : null}
      </header>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1fr)_19rem] md:gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="min-w-0 md:order-2">
          <div className="md:sticky md:top-[calc(var(--top-h)+1.5rem)]">
            <ContinueBlock model={model} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6 md:order-1">
          {tabs.length > 1 ? <TabRow label="Course content" tabs={tabs} current={tab} onSelect={setTab} /> : null}

          {tab === "lectures" ? (
            <>
              {model.empty ? null : (
                <div className="-my-2 flex min-w-0 flex-col">
                  <Choices
                    label="Show"
                    value={filter}
                    onChange={setFilter}
                    options={[
                      { id: "all", label: "All" },
                      { id: "todo", label: "To watch" },
                      { id: "watched", label: "Watched" },
                    ]}
                  />
                  {mine.length > 1 ? (
                    <Choices
                      label="Your cohorts"
                      value={cohort}
                      onChange={setCohort}
                      options={[{ id: null as string | null, label: mine.length > 2 ? "All cohorts" : "Both cohorts" }, ...mine.map((c) => ({ id: c.id as string | null, label: c.name }))]}
                    />
                  ) : null}
                </div>
              )}
              {weeks.map((w) => (
                <Section
                  key={w.num}
                  id={`week-${w.num}`}
                  title={`Week ${w.num}`}
                  className="scroll-mt-shell"
                  action={<span className="text-muted-foreground type-num">{w.isFuture ? "Opens later" : w.total > 0 && w.done === w.total ? "Watched" : w.done > 0 ? `${w.done} of ${w.total} watched` : ""}</span>}
                >
                  <ol className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
                    {w.lessons.map((l) => (
                      <LectureRow key={l.id} lesson={l} />
                    ))}
                  </ol>
                </Section>
              ))}
              {weeks.length === 0 ? (
                model.empty ? (
                  <EmptyLine title="No lectures yet">Lectures appear here as soon as they are added.</EmptyLine>
                ) : cohort && filter === "all" ? (
                  <EmptyLine title="No lectures here yet">Lectures for this cohort appear here as they are added.</EmptyLine>
                ) : filter === "watched" ? (
                  <EmptyLine title="Nothing watched yet">Lectures you finish show up here.</EmptyLine>
                ) : (
                  <EmptyLine title="All caught up">You have watched everything that is open.</EmptyLine>
                )
              ) : null}
            </>
          ) : null}

          {tab === "materials" ? (
            <RowList label="Materials">
              {materials.map((m) =>
                m.href ? (
                  <Row key={m.id} href={m.href} icon={<BookOpen />} title={m.title} meta={`Week ${m.week} · ${m.meta}`} />
                ) : (
                  <Row key={m.id} icon={<BookOpen />} title={m.title} meta={`Week ${m.week} · Opens later`} trailing={<Lock className="size-4" aria-hidden />} className="text-muted-foreground" />
                ),
              )}
            </RowList>
          ) : null}

          {tab === "assignments" ? (
            <RowList label="Assignments">
              {assignments.map((a) =>
                a.href ? (
                  <Row key={a.id} href={a.href} icon={<FileText />} title={a.title} meta={`Week ${a.week} · ${a.lessonTitle}`} trailing={<span className={cn(a.status === "not_started" && "font-bold text-foreground")}>{SUBMITTED[a.status]}</span>} />
                ) : (
                  <Row key={a.id} icon={<FileText />} title={a.title} meta={`Week ${a.week} · Opens later`} trailing={<Lock className="size-4" aria-hidden />} className="text-muted-foreground" />
                ),
              )}
            </RowList>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}

/** /courses with more than one course: one Continue, then the courses as rows with progress. */
export function LecturesListV2({ models }: { models: OverviewModel[] }) {
  const lead = models.find((m) => m.next && m.started) ?? models.find((m) => m.next) ?? null;
  return (
    <PageFrame title="Lectures" area="learn" className="!gap-6 md:!gap-8">
      {models.length === 0 ? (
        <EmptyLine title="No courses yet">Your course appears here when it is available.</EmptyLine>
      ) : (
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1fr)_19rem] md:gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          {lead ? (
            <div className="min-w-0 md:order-2">
              <ContinueBlock model={lead} courseTitle={lead.title} />
            </div>
          ) : null}
          <Section title="Your courses" className="md:order-1">
            <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              {models.map((m) => {
                const pct = m.totalLessons ? Math.round((m.completedCount / m.totalLessons) * 100) : 0;
                return (
                  <li key={m.courseId} className="min-w-0">
                    <Link
                      href={`/courses/${m.courseId}`}
                      className="group/row -mx-2 flex min-h-[4.5rem] min-w-0 items-center gap-4 rounded-lg px-2 py-3 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]"
                    >
                      {m.totalLessons > 0 ? <ProgressRing pct={pct} label={`${m.title}: lectures watched`} /> : null}
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="type-body font-semibold [overflow-wrap:anywhere]">{m.title}</span>
                        <span className="type-small text-muted-foreground type-num">{m.totalLessons > 0 ? `${m.completedCount} of ${m.totalLessons} watched` : "Lectures appear here as they open"}</span>
                      </span>
                      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/row:translate-x-0.5" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Section>
        </div>
      )}
    </PageFrame>
  );
}
