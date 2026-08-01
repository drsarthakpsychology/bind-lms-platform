"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, Lock, Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type SidebarLesson = {
  id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  has_video: boolean;
};

function LessonNav({
  courseId,
  lessons,
  onNavigate,
}: {
  courseId: string;
  lessons: SidebarLesson[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeLessonId = pathname.split("/lessons/")[1]?.split("/")[0];

  return (
    <nav aria-label="Course lessons" className="space-y-1">
      {lessons.map((lesson, i) => {
        const isActive = lesson.id === activeLessonId;
        const href = lesson.has_video
          ? `/courses/${courseId}/lessons/${lesson.id}`
          : undefined;

        return (
          <div
            key={lesson.id}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md border-2 px-3 py-2.5",
              isActive
                ? "border-foreground bg-primary text-primary-foreground hard-shadow-flat"
                : "border-transparent text-foreground",
              href && !isActive && "hover:border-border hover:bg-accent"
            )}
          >
            <span className="relative flex size-5 shrink-0 items-center justify-center">
              {lesson.is_completed ? (
                <CheckCircle2 className="size-5 text-status-success-fg dark:text-status-success-fg" aria-hidden />
              ) : (
                <>
                  <Circle className="size-5 text-muted-foreground" aria-hidden />
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                </>
              )}
            </span>
            {href ? (
              <Link
                href={href}
                onClick={onNavigate}
                tabIndex={isActive ? -1 : 0}
                className="min-w-0 flex-1 truncate text-small font-medium"
              >
                {lesson.title}
              </Link>
            ) : (
              <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-small font-medium text-muted-foreground opacity-70">
                <Lock className="size-3 shrink-0" aria-hidden />
                {lesson.title}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile: course bar + Sheet drawer */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-border bg-card px-4 py-3 lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-small font-semibold text-foreground">{courseTitle}</p>
          <p className="text-numeric text-xs text-muted-foreground">{progressPercent}% complete</p>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open course lessons"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border-2 border-border bg-card px-3 text-small font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-0.5"
            >
              <Menu className="size-4" aria-hidden />
              Lessons
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="border-b-2 border-border px-4 py-3">
              <SheetTitle className="text-small font-semibold">{courseTitle}</SheetTitle>
              <div className="flex items-center gap-2">
                <Progress value={progressPercent} aria-label="Course progress" className="flex-1" />
                <span className="text-numeric text-xs text-muted-foreground">
                  {progressPercent}%
                </span>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-3">
              <LessonNav
                courseId={courseId}
                lessons={lessons}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: persistent course rail */}
      <aside className="hidden w-72 shrink-0 border-r-2 border-border bg-card lg:flex lg:flex-col">
        <div className="border-b-2 border-border p-5">
          <p className="text-h3 leading-tight">{courseTitle}</p>
          <div className="mt-4 flex items-center gap-2">
            <Progress value={progressPercent} aria-label="Course progress" className="flex-1" />
            <span className="text-numeric text-xs font-semibold text-foreground">
              {progressPercent}%
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <LessonNav courseId={courseId} lessons={lessons} />
        </div>
      </aside>
    </>
  );
}
