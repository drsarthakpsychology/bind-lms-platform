"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronLeft, Clock, FileText } from "lucide-react";

import {
  ContinueCard,
  ProgressCard,
  Row,
  WeekBlock,
  type OverviewModel,
  type OverviewWeek,
} from "@/components/course/course-overview-view";
import { WeekChips } from "@/components/course/week-chips";
import { EmptyState } from "@/components/design-system/empty-state";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tab = "lectures" | "materials" | "assignments";
type Filter = "all" | "todo" | "watched";

/**
 * Lectures — the course library, laid out like a playlist page:
 * continue tile + progress, then tabs (Lectures / Materials / Assignments).
 * Lectures can be filtered to what's left or what's watched, and the week
 * chips jump straight to a week.
 */
export function CourseLibrary({ model }: { model: OverviewModel }) {
  const [tab, setTab] = React.useState<Tab>("lectures");
  const [filter, setFilter] = React.useState<Filter>("all");

  const materials = model.weeks.flatMap((w) => w.materials.map((m) => ({ ...m, week: w.num })));
  const assignments = model.weeks.flatMap((w) => w.assignments.map((a) => ({ ...a, week: w.num })));

  const weeks: OverviewWeek[] = model.weeks
    .map((w) => ({
      ...w,
      lessons: w.lessons.filter((l) =>
        filter === "all" ? true : filter === "watched" ? l.state === "done" : l.state !== "done" && l.href !== null,
      ),
    }))
    .filter((w) => w.lessons.length > 0);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "lectures", label: "Lectures", count: model.weeks.reduce((n, w) => n + w.lessons.length, 0) },
    { id: "materials", label: "Materials", count: materials.length },
    { id: "assignments", label: "Assignments", count: assignments.length },
  ];

  return (
    <div className="space-y-7">
      {model.backHref ? (
        <Link
          href={model.backHref}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none"
        >
          <ChevronLeft className="size-4" aria-hidden />
          All courses
        </Link>
      ) : null}

      <header className="space-y-2">
        <p className="text-eyebrow text-link">{model.published ? "Lectures" : "Draft — only you can see this"}</p>
        <h1 className="text-display break-words">{model.title}</h1>
      </header>

      <section aria-label="Where you are" className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <ContinueCard model={model} />
        <ProgressCard model={model} />
      </section>

      {/* Tabs */}
      <div role="tablist" aria-label="Course content" className="flex gap-1 overflow-x-auto border-b-2 border-foreground/10 [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 px-3 text-sm font-bold transition-colors",
              "after:absolute after:inset-x-2 after:-bottom-0.5 after:h-1 after:rounded-full",
              tab === t.id ? "text-foreground after:bg-link" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span className="rounded-full border-2 border-foreground/20 px-1.5 font-pix text-[0.6rem] leading-4">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "lectures" ? (
        <div className="space-y-4">
          <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["todo", "Still to watch"],
                ["watched", "Watched"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center rounded-full border-2 border-foreground px-3.5 text-sm font-bold transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none",
                  filter === id ? "bg-[#111111] text-primary dark:bg-white dark:text-[#111111]" : "bg-card",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {filter === "all" ? (
            <WeekChips
              weeks={model.weeks.map((w) => ({
                num: w.num,
                isCurrent: w.isCurrent,
                complete: w.status === "complete",
                future: w.isFuture,
              }))}
            />
          ) : null}
          <section aria-label="Weeks" className="space-y-4">
            {weeks.map((w) => (
              <WeekBlock key={w.num} week={w} lessonsOnly openAll={filter !== "all"} />
            ))}
          </section>
          {weeks.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="size-8" aria-hidden />}
              title={model.empty ? "No lectures yet" : filter === "watched" ? "Nothing watched yet" : "All caught up"}
              description={
                model.empty
                  ? "Lectures appear here as soon as they're added."
                  : filter === "watched"
                    ? "Lectures you finish show up here."
                    : "You've watched everything that's open."
              }
            />
          ) : null}
        </div>
      ) : null}

      {tab === "materials" ? (
        materials.length ? (
          <ul className="grid gap-2 md:grid-cols-2">
            {materials.map((m) => (
              <li key={m.id}>
                <Row href={m.href} icon={<BookOpen className="size-5" aria-hidden />} title={m.title} meta={`Week ${m.week} · ${m.meta}`} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<BookOpen className="size-8" aria-hidden />} title="No materials yet" description="Handouts and readings appear here." />
        )
      ) : null}

      {tab === "assignments" ? (
        assignments.length ? (
          <ul className="grid gap-2 md:grid-cols-2">
            {assignments.map((a) => (
              <li key={a.id}>
                <Row
                  href={a.href}
                  highlight={a.isNext}
                  icon={<FileText className="size-5" aria-hidden />}
                  title={a.title}
                  meta={`Week ${a.week} · ${a.lessonTitle}`}
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
        ) : (
          <EmptyState icon={<FileText className="size-8" aria-hidden />} title="No assignments" description="When there's work to hand in, it shows up here." />
        )
      ) : null}
    </div>
  );
}
