"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { setLessonStatus } from "./actions";

export type LessonStatus = "hidden" | "live" | "unlocked";

const OPTIONS: { value: LessonStatus; label: string }[] = [
  { value: "hidden", label: "Hidden" },
  { value: "live", label: "Yet to be live" },
  { value: "unlocked", label: "Unlocked" },
];

/**
 * Three-way go-live control for a lesson row. Plain words, one tap to move a
 * lesson between hidden / locked-but-visible / fully open.
 */
export function LessonStatusToggle({
  lessonId,
  courseId,
  status,
}: {
  lessonId: string;
  courseId: string;
  status: LessonStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function choose(next: LessonStatus) {
    if (next === status || isPending) return;
    setErrorMsg(null);
    startTransition(async () => {
      const result = await setLessonStatus(lessonId, courseId, next);
      if (result.error) setErrorMsg(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Lesson status"
        className="inline-flex overflow-hidden rounded-md border-2 border-border"
      >
        {OPTIONS.map((option) => {
          const active = option.value === status;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              disabled={isPending}
              onClick={() => choose(option.value)}
              className={cn(
                "duration-fast h-8 px-2.5 text-xs font-medium transition-colors ease-snappy",
                "border-r-2 border-border last:border-r-0 focus-visible:relative focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {errorMsg && (
        <span role="alert" className="text-caption text-status-alert-fg">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
