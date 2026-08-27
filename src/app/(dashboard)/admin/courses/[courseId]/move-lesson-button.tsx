"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { moveLesson } from "./actions";
import { cn } from "@/lib/utils";

/**
 * Swap a lesson one slot up/down in its course (reorders the student path).
 * Disabled at the edges of the course's order.
 */
export function MoveLessonButton({
  lessonId,
  courseId,
  direction,
  disabled,
  label,
}: {
  lessonId: string;
  courseId: string;
  direction: "up" | "down";
  disabled: boolean;
  label: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function move() {
    if (disabled || isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await moveLesson(lessonId, courseId, direction);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  const Icon = direction === "up" ? ChevronUp : ChevronDown;

  return (
    <>
      <button
        type="button"
        onClick={move}
        disabled={disabled || isPending}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md border-2 border-border bg-background text-muted-foreground",
          "transition-transform duration-fast ease-snappy hover:bg-accent hover:text-accent-foreground active:translate-y-px",
          "focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </button>
      {error ? (
        <span role="alert" className="text-caption text-status-alert-fg">
          {error}
        </span>
      ) : null}
    </>
  );
}
