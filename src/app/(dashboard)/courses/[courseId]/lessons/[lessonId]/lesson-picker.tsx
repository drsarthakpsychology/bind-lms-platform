"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { cn } from "@/lib/utils";

type PickerLesson = {
  id: string;
  title: string;
  orderIndex: number;
  isCompleted: boolean;
  hasVideo: boolean;
};

/**
 * Compact lesson picker for the lesson header — `Lesson 3 of 12 ▾`. Opens the
 * full curriculum as a bottom sheet (T27) instead of a cramped dropdown, so the
 * whole course is reachable while the current lesson stays the dominant
 * context. The current lesson is highlighted in the sheet.
 */
export function LessonPicker({
  courseId,
  courseTitle,
  lessons,
  currentId,
}: {
  courseId: string;
  courseTitle: string;
  lessons: PickerLesson[];
  currentId: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = pathname.split("/lessons/")[1]?.split("/")[0] ?? currentId;
  const index = lessons.findIndex((l) => l.id === active);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Lesson ${index + 1} of ${lessons.length} — open lesson list`}
        className="inline-flex h-11 items-center gap-1.5 rounded-md border-2 border-border bg-card px-3 text-sm font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
      >
        <span className="max-w-40 truncate">{courseTitle}</span>
        <span className="text-caption text-muted-foreground">
          {index >= 0 ? `${index + 1} of ${lessons.length}` : ""}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </button>

      <MobileBottomSheet
        open={open}
        onOpenChange={setOpen}
        title={courseTitle}
        description={`${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}
      >
        <div className="space-y-1">
          {lessons.map((lesson) => {
            const isActive = lesson.id === active;
            return (
              <Link
                key={lesson.id}
                href={lesson.hasVideo ? `/courses/${courseId}/lessons/${lesson.id}` : "#"}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-md px-3 py-2.5 text-small transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent",
                  !lesson.hasVideo && "opacity-50",
                )}
              >
                <span className="text-numeric w-5 shrink-0 text-caption">
                  {lesson.orderIndex}.
                </span>
                <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                {lesson.isCompleted && <Check className="size-3.5 shrink-0" aria-hidden />}
              </Link>
            );
          })}
        </div>
      </MobileBottomSheet>
    </>
  );
}
