"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type PickerLesson = {
  id: string;
  title: string;
  orderIndex: number;
  isCompleted: boolean;
  hasVideo: boolean;
};

/**
 * Compact lesson picker for the lesson header — `Lesson 3 of 12 ▾`. Opens a
 * dropdown list on demand instead of a permanently visible course column.
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
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Lesson ${index + 1} of ${lessons.length} — choose a lesson`}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border-2 border-border bg-card px-3 text-sm font-medium text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
      >
        {courseTitle}
        <span className="text-caption text-muted-foreground">
          {index >= 0 ? `${index + 1} of ${lessons.length}` : ""}
        </span>
        <ChevronDown
          className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <>
          {/* Dismiss on outside click */}
          <button
            type="button"
            aria-label="Close lesson list"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            aria-label="Lessons"
            className="absolute right-0 z-40 mt-2 max-h-80 w-72 overflow-y-auto rounded-md border-2 border-border bg-popover p-1 shadow-md"
          >
            {lessons.map((lesson) => {
              const isActive = lesson.id === active;
              return (
                <Link
                  key={lesson.id}
                  role="option"
                  aria-selected={isActive}
                  href={lesson.hasVideo ? `/courses/${courseId}/lessons/${lesson.id}` : "#"}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded px-2.5 py-2 text-small transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent",
                    !lesson.hasVideo && "opacity-50"
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
        </>
      )}
    </div>
  );
}
