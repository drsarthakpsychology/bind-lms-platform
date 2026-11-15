import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, MessageCircleQuestion, Play } from "lucide-react";

import { MobileStickyAction } from "@/components/mobile/mobile-sticky-action";
import { cn } from "@/lib/utils";
import { Crumb, TabRow } from "./parts";
import s from "./lesson.module.css";

export type LessonTab = "watch" | "materials" | "assignment";

/**
 * The lecture page in the new design, built around the video.
 * Phones: the video edge to edge at the top, the title under it, About /
 * Materials / Assignment in one row of tabs, and Previous / Next pinned at
 * the bottom. Desktop: the video and its tabs on the left, the course's
 * lectures as a quiet list on the right.
 *
 * Pure composition: the page loads the data and hands in the player, the
 * forward button, the materials, the assignment and the quiz as they are.
 */
export function LessonScreenV2({
  courseId,
  lessonId,
  courseTitle,
  title,
  description,
  hasVideo,
  position,
  cohorts,
  tab,
  hasMaterials,
  hasAssignment,
  watched,
  lessons,
  player,
  picker,
  complete,
  nav,
  materials,
  assignment,
  quiz,
  showDoubts,
}: {
  courseId: string;
  lessonId: string;
  courseTitle: string;
  title: string;
  description: string | null;
  hasVideo: boolean;
  /** "Lecture 3 of 12", or null for a lecture outside the playable list. */
  position: string | null;
  cohorts: { id: string; name: string }[];
  tab: LessonTab;
  hasMaterials: boolean;
  hasAssignment: boolean;
  watched: boolean;
  lessons: { id: string; title: string; isCompleted: boolean }[];
  player: React.ReactNode;
  /** Phones: the lecture list in a bottom sheet. */
  picker: React.ReactNode;
  /** "Mark complete" (shown until the lecture is watched). */
  complete: React.ReactNode;
  /** Previous / Next. */
  nav: React.ReactNode;
  materials: React.ReactNode;
  assignment: React.ReactNode;
  quiz: React.ReactNode;
  showDoubts: boolean;
}) {
  const base = `/courses/${courseId}/lessons/${lessonId}`;
  const tabs: { id: LessonTab; label: string; href: string }[] = [{ id: "watch", label: "About", href: base }];
  if (hasMaterials) tabs.push({ id: "materials", label: "Materials", href: `${base}?tab=materials` });
  if (hasAssignment) tabs.push({ id: "assignment", label: "Assignment", href: `${base}?tab=assignment` });

  return (
    <div data-ds="page" className="ds-page mx-auto grid w-full min-w-0 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="flex min-w-0 flex-col gap-4">
        {/* A reading lecture has no video: its text is the page. */}
        {hasVideo ? (
          <div className={cn(s.stage, tab === "watch" && s.stick)}>
            <div className={s.fit}>{player}</div>
          </div>
        ) : null}

        <div className="flex min-w-0 items-center justify-between gap-3">
          <Crumb href={`/courses/${courseId}`}>{courseTitle}</Crumb>
          {picker ? <div className="shrink-0 lg:hidden">{picker}</div> : null}
        </div>

        <header className="flex min-w-0 flex-col gap-2">
          {position || watched ? (
            <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 type-small text-muted-foreground type-num">
              {position ? <span>{position}</span> : null}
              {watched ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <span aria-hidden className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  Watched
                </span>
              ) : null}
            </p>
          ) : null}
          <h1 className="type-h1 [overflow-wrap:anywhere]">{title}</h1>
          {cohorts.length ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{cohorts.map((c) => c.name).join(", ")}</p> : null}
        </header>

        {tabs.length > 1 ? <TabRow label="Lecture sections" tabs={tabs} current={tab} /> : null}

        {tab === "watch" ? (
          <div className="flex min-w-0 flex-col gap-6">
            {description ? (
              <p className="type-reading whitespace-pre-line text-foreground/90 [overflow-wrap:anywhere]">{description}</p>
            ) : hasVideo ? null : (
              <p className="type-reading text-muted-foreground">This lecture&apos;s video is being prepared.</p>
            )}
            {!watched ? <div>{complete}</div> : null}
            <div className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              <details className="group min-w-0">
                <summary className="-mx-2 flex min-h-14 cursor-pointer list-none items-center gap-4 rounded-lg px-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1 type-body font-semibold">Check what stuck</span>
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
                </summary>
                <div className="pt-2 pb-6">{quiz}</div>
              </details>
              {showDoubts ? (
                <Link
                  href="/doubts"
                  className="group/row -mx-2 flex min-h-14 min-w-0 items-center gap-4 rounded-lg px-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="min-w-0 flex-1 type-body font-semibold">Ask a doubt</span>
                  <MessageCircleQuestion className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {tab === "materials" ? <section aria-label="Materials" className="flex min-w-0 flex-col gap-4">{materials}</section> : null}
        {tab === "assignment" ? <section aria-label="Assignment" className="flex min-w-0 flex-col gap-4">{assignment}</section> : null}

        {/* Desktop: Previous / Next in the page. Phones and tablets: pinned low. */}
        <div className="mt-4 hidden border-t border-[var(--ds-hairline)] pt-6 lg:block">{nav}</div>
        <MobileStickyAction offsetForNav className={cn("border-t border-[var(--ds-hairline)] lg:hidden", s.pin)}>
          {nav}
        </MobileStickyAction>
      </div>

      {lessons.length > 1 ? (
        <aside aria-label="Lectures in this course" className="hidden min-w-0 lg:block">
          <div className="sticky top-[calc(var(--top-h)+1.5rem)] flex max-h-[calc(100dvh-var(--top-h)-3rem)] min-w-0 flex-col gap-3">
            <div className="flex min-w-0 items-baseline justify-between gap-3">
              <h2 className="min-w-0 type-h3 [overflow-wrap:anywhere]">Lectures</h2>
              <p className="shrink-0 type-small text-muted-foreground type-num">
                {lessons.filter((l) => l.isCompleted).length} of {lessons.length} watched
              </p>
            </div>
            <ol className="flex min-w-0 flex-1 flex-col divide-y divide-[var(--ds-hairline)] overflow-y-auto overscroll-contain border-y border-[var(--ds-hairline)]">
              {lessons.map((l, i) => {
                const current = l.id === lessonId;
                return (
                  <li key={l.id} className="min-w-0">
                    <Link
                      href={`/courses/${courseId}/lessons/${l.id}`}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 min-w-0 items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring",
                        current && "bg-[var(--ds-tint)]",
                      )}
                    >
                      <span aria-hidden className={cn("grid w-6 shrink-0 place-items-center type-small type-num", current ? "text-foreground" : "text-muted-foreground")}>
                        {current ? <Play className="size-4 fill-current" /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("min-w-0 flex-1 type-small [overflow-wrap:anywhere]", current ? "font-bold text-foreground" : "font-semibold")}>{l.title}</span>
                      {l.isCompleted ? (
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3" strokeWidth={3} aria-hidden />
                          <span className="sr-only">Watched</span>
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
