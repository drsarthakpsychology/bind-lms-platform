"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarLesson = {
  id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  has_video: boolean;
};

export function CourseSidebar({
  courseId,
  courseTitle,
  lessons,
  progressPercent,
}: {
  courseId: string;
  courseTitle: string;
  lessons: SidebarLesson[];
  progressPercent: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLessonId = pathname.split("/lessons/")[1]?.split("/")[0];

  const list = (
    <nav aria-label="Course lessons" className="space-y-0.5">
      {lessons.map((lesson) => {
        const isActive = lesson.id === activeLessonId;
        const href = lesson.has_video
          ? `/courses/${courseId}/lessons/${lesson.id}`
          : undefined;

        return (
          <Link
            key={lesson.id}
            href={href ?? "#"}
            aria-disabled={!href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
            className={
              isActive
                ? "flex items-center gap-3 rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground"
                : href
                  ? "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                  : "flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground opacity-60"
            }
          >
            <span
              aria-hidden="true"
              className={
                lesson.is_completed
                  ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-success-bg text-[10px] text-status-success-fg"
                  : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px] text-transparent"
              }
            >
              ✓
            </span>
            <span className="truncate">{lesson.title}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-semibold text-foreground">
            {courseTitle}
          </p>
          <p className="font-mono text-xs text-muted-foreground">{progressPercent}% complete</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground"
        >
          {mobileOpen ? "Close" : "Lessons"}
        </button>
      </div>
      {mobileOpen && (
        <div className="border-b border-border bg-card p-3 lg:hidden">{list}</div>
      )}

      {/* Desktop persistent sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="border-b border-border p-5">
          <p className="font-serif text-lg font-semibold leading-tight text-foreground">
            {courseTitle}
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-xs text-muted-foreground">
            {progressPercent}% complete
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{list}</div>
      </aside>
    </>
  );
}
