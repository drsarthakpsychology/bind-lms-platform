import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ChevronDown, Clock, FileText, Lock, PartyPopper, Play } from "lucide-react";

import type { WeekStatus } from "@/lib/course/status";
import { Badge } from "@/components/ui/badge";
import { LessonThumb, type LessonState } from "@/components/course/lesson-thumb";
import { cn } from "@/lib/utils";

export type OverviewLesson = {
  id: string;
  title: string;
  number: number;
  href: string | null;
  state: LessonState;
  hasVideo: boolean;
  /** For a student in 2+ cohorts: which of their own cohorts this lecture is for. */
  cohorts?: { id: string; name: string }[];
};

export type OverviewWeek = {
  num: number;
  status: WeekStatus;
  isCurrent: boolean;
  isFuture: boolean;
  done: number;
  total: number;
  lessons: OverviewLesson[];
  materials: { id: string; title: string; meta: string; href: string | null }[];
  assignments: {
    id: string;
    title: string;
    lessonTitle: string;
    status: "not_started" | "submitted" | "graded";
    isNext: boolean;
    href: string | null;
  }[];
};

export type OverviewModel = {
  courseId: string;
  title: string;
  published: boolean;
  completedCount: number;
  totalLessons: number;
  started: boolean;
  backHref: string | null;
  /** `midway`: the student started this lecture and stopped part-way. */
  next: { title: string; href: string; week: number; kind: "lesson" | "assignment"; number: number | null; midway?: boolean } | null;
  weeks: OverviewWeek[];
  empty: boolean;
  /** The student's own cohorts (never anyone else's). */
  myCohorts?: { id: string; name: string }[];
};

export const STATE_LABEL: Record<LessonState, string> = {
  next: "Up next",
  done: "Watched",
  started: "Started",
  open: "Not watched yet",
  live: "Yet to be live",
  later: "Opens later",
};

const WEEK_LABEL: Record<WeekStatus, string> = {
  complete: "Complete",
  "in-progress": "In progress",
  upcoming: "Opens later",
  "not-started": "Not started",
};

/** The big "Continue watching" tile (or the all-done card). */
export function ContinueCard({ model }: { model: OverviewModel }) {
  const allDone = model.totalLessons > 0 && model.completedCount === model.totalLessons;
  if (!model.next) {
    return (
      <div className="flex flex-col items-start justify-center gap-3 rounded-2xl border-2 border-foreground bg-primary p-6 text-primary-foreground hard-shadow-sm">
        <PartyPopper className="size-8" aria-hidden />
        <p className="text-h2">{allDone ? "You've watched every lecture." : "Nothing to watch yet."}</p>
        <p className="text-sm">{allDone ? "Rewatch anything, any time." : "New lectures appear here as they open."}</p>
      </div>
    );
  }
  return (
    <Link
      href={model.next.href}
      prefetch
      className="group/thumb grid gap-4 rounded-2xl border-2 border-foreground bg-card p-3 outline-none transition-[transform,box-shadow] duration-fast ease-snappy hard-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:hard-shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:p-4"
    >
      {model.next.kind === "lesson" ? (
        <LessonThumb number={model.next.number} state="next" size="lg" className="group-hover/thumb:translate-x-0 group-hover/thumb:translate-y-0 group-hover/thumb:shadow-none" />
      ) : (
        <span aria-hidden className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-foreground bg-brand text-primary">
          <FileText className="size-12" />
        </span>
      )}
      <span className="flex min-w-0 flex-col justify-center gap-2 px-1 pb-1">
        <span className="text-eyebrow text-link">{model.started ? "Continue watching" : "Start here"}</span>
        <span className="text-h2 line-clamp-3 break-words">{model.next.title}</span>
        <span className="text-sm text-muted-foreground">
          Week {model.next.week}
          {model.next.number ? ` · Lecture ${model.next.number}` : ""}
          {model.next.kind === "assignment" ? " · Assignment" : ""}
        </span>
        <span className="mt-2 inline-flex h-11 w-fit items-center gap-2 rounded-full border-2 border-foreground bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors duration-fast group-hover/thumb:bg-[#111111] group-hover/thumb:text-primary dark:group-hover/thumb:bg-white dark:group-hover/thumb:text-[#111111]">
          <Play className="size-4 fill-current" aria-hidden />
          {model.started ? "Resume" : "Start"}
        </span>
      </span>
    </Link>
  );
}

/** Watched X/Y with a bar, plus this week and course length. */
export function ProgressCard({ model, compact = false }: { model: OverviewModel; compact?: boolean }) {
  const pct = model.totalLessons ? Math.round((model.completedCount / model.totalLessons) * 100) : 0;
  const totalWeeks = model.weeks.length ? model.weeks[model.weeks.length - 1].num : 0;
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl border-2 border-foreground bg-card p-5 hard-shadow-sm">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-eyebrow text-muted-foreground">Watched</p>
          <p className="mt-1 font-pix text-4xl leading-none text-link">
            {model.completedCount}
            <span className="text-xl text-muted-foreground">/{model.totalLessons}</span>
          </p>
        </div>
        <p className="font-pix text-2xl leading-none">{pct}%</p>
      </div>
      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-4 overflow-hidden rounded-full border-2 border-foreground bg-muted"
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      {compact ? null : (
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border-2 border-foreground/15 px-3 py-2">
            <dt className="text-eyebrow text-muted-foreground">This week</dt>
            <dd className="mt-1 font-bold">{model.next ? `Week ${model.next.week}` : "None"}</dd>
          </div>
          <div className="rounded-xl border-2 border-foreground/15 px-3 py-2">
            <dt className="text-eyebrow text-muted-foreground">Course</dt>
            <dd className="mt-1 font-bold">{totalWeeks ? `${totalWeeks} weeks` : "Not set"}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

export function WeekBlock({ week, lessonsOnly = false, openAll = false }: { week: OverviewWeek; lessonsOnly?: boolean; openAll?: boolean }) {
  const pct = week.total ? Math.round((week.done / week.total) * 100) : 0;
  return (
    <details
      id={`week-${week.num}`}
      open={openAll || week.isCurrent}
      className="group/week scroll-mt-20 rounded-2xl border-2 border-foreground bg-card open:hard-shadow-sm lg:scroll-mt-36"
    >
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-accent sm:px-4 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border-2 font-pix text-sm",
            week.status === "complete"
              ? "border-foreground bg-primary text-primary-foreground"
              : week.isCurrent
                ? "border-foreground bg-brand text-brand-foreground"
                : week.isFuture
                  ? "border-dashed border-foreground/50 text-muted-foreground"
                  : "border-foreground bg-card",
          )}
        >
          {week.status === "complete" ? <CheckCircle2 className="size-5" /> : String(week.num).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-h3">Week {week.num}</h2>
            <span className="text-caption font-semibold text-muted-foreground">
              {week.isFuture ? (
                <span className="inline-flex items-center gap-1">
                  <Lock className="size-3" aria-hidden /> Opens later
                </span>
              ) : (
                WEEK_LABEL[week.status]
              )}
            </span>
          </span>
          {week.total > 0 ? (
            <span className="mt-1.5 flex items-center gap-2">
              <span className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="block h-full rounded-full bg-link" style={{ width: `${pct}%` }} />
              </span>
              <span className="shrink-0 text-caption font-semibold text-muted-foreground">
                {week.done}/{week.total} watched
              </span>
            </span>
          ) : null}
        </span>
        <ChevronDown
          className="size-5 shrink-0 transition-transform duration-fast ease-snappy group-open/week:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="space-y-5 border-t-2 border-foreground/10 px-3 pt-4 pb-4 sm:px-4">
        {week.lessons.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-6 xl:grid-cols-3 2xl:grid-cols-4">
            {week.lessons.map((l) => (
              <li key={l.id}>
                <LectureCard lesson={l} />
              </li>
            ))}
          </ul>
        ) : null}

        {!lessonsOnly && (week.materials.length > 0 || week.assignments.length > 0) ? (
          <div className="space-y-2">
            <p className="text-eyebrow text-muted-foreground">Reading &amp; tasks</p>
            <ul className="grid gap-2 md:grid-cols-2">
              {week.materials.map((m) => (
                <li key={m.id}>
                  <Row href={m.href} icon={<BookOpen className="size-5" aria-hidden />} title={m.title} meta={m.meta} />
                </li>
              ))}
              {week.assignments.map((a) => (
                <li key={a.id}>
                  <Row
                    href={a.href}
                    highlight={a.isNext}
                    icon={<FileText className="size-5" aria-hidden />}
                    title={a.title}
                    meta={a.lessonTitle}
                    badge={
                      a.status === "graded" ? (
                        <Badge variant="graded">
                          <CheckCircle2 className="size-3" aria-hidden /> Graded
                        </Badge>
                      ) : a.status === "submitted" ? (
                        <Badge variant="pending">
                          <Clock className="size-3" aria-hidden /> Submitted
                        </Badge>
                      ) : (
                        <Badge variant="outline">To do</Badge>
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function LectureCard({ lesson, tile = false }: { lesson: OverviewLesson; tile?: boolean }) {
  const inner = (
    <>
      <span className={cn("shrink-0", tile ? "w-full" : "w-32 sm:w-full")}>
        <LessonThumb number={lesson.number} state={lesson.state} />
      </span>
      <span className={cn("min-w-0 flex-1", tile ? "pt-2.5" : "sm:pt-2.5")}>
        <span className="line-clamp-2 text-sm font-bold leading-snug break-words sm:text-[0.95rem]">{lesson.title}</span>
        <span
          className={cn(
            "mt-1 flex items-center gap-1 text-caption font-semibold",
            lesson.state === "next" ? "text-link" : "text-muted-foreground",
          )}
        >
          {lesson.state === "done" ? <CheckCircle2 className="size-3.5" aria-hidden /> : null}
          {lesson.state === "next" ? <ArrowRight className="size-3.5" aria-hidden /> : null}
          {STATE_LABEL[lesson.state]}
          {!lesson.hasVideo && lesson.href ? " · Reading" : ""}
        </span>
        {lesson.cohorts?.length ? (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {lesson.cohorts.map((c) => (
              <span key={c.id} className="inline-flex max-w-full items-center truncate rounded-full border-2 border-foreground/30 bg-card px-2 text-[0.7rem] leading-5 font-bold">
                {c.name}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </>
  );
  const base = cn(
    "group/thumb flex items-start rounded-xl outline-none",
    tile ? "flex-col" : "gap-3 sm:flex-col sm:gap-0",
  );
  if (!lesson.href) {
    return (
      <div className={cn(base, "cursor-not-allowed")} aria-disabled="true">
        {inner}
      </div>
    );
  }
  return (
    <Link href={lesson.href} prefetch className={cn(base, "focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-[0.98]")}>
      {inner}
    </Link>
  );
}

export function Row({
  href,
  icon,
  title,
  meta,
  badge,
  highlight,
}: {
  href: string | null;
  icon: React.ReactNode;
  title: string;
  meta?: string;
  badge?: React.ReactNode;
  highlight?: boolean;
}) {
  const inner = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-foreground",
          highlight ? "bg-primary text-primary-foreground" : "bg-card",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{title}</span>
        {meta ? <span className="block truncate text-caption text-muted-foreground">{meta}</span> : null}
      </span>
      {href ? badge : <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
    </>
  );
  const cls = cn(
    "flex min-h-14 items-center gap-3 rounded-xl border-2 px-3 py-2",
    highlight ? "border-foreground bg-status-success-bg" : "border-foreground/15 bg-card",
  );
  if (!href) return <div className={cn(cls, "opacity-70")}>{inner}</div>;
  return (
    <Link
      href={href}
      className={cn(
        cls,
        "transition-[transform,box-shadow,border-color] duration-fast ease-snappy hover:-translate-y-px hover:border-foreground hover:hard-shadow-xs focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none",
      )}
    >
      {inner}
    </Link>
  );
}
