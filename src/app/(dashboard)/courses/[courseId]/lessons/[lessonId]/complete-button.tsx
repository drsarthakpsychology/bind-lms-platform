"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { completeAndAdvance } from "./actions";
import { Button } from "@/components/ui/button";

/**
 * Client wrapper for the single forward action on a lesson.
 *
 * Three states, one button:
 *   - Mid-course          → "Next lesson" — advance, no toast.
 *   - Final, not complete → "Finish course" — fires a success toast before the
 *     redirect lands on the dashboard (a clear success moment).
 *   - Final, already done → "Back to my courses" — secondary variant; nothing
 *     to mark complete, just a link back.
 *
 * Completing the final lesson always calls completeAndAdvance, which marks the
 * lesson complete server-side before redirecting to the dashboard.
 */
export function CompleteButton({
  lessonId,
  courseId,
  continueTarget,
  label,
  disabled,
  isFinalLesson,
  alreadyComplete,
}: {
  lessonId: string;
  courseId: string;
  continueTarget: string;
  label: string;
  disabled: boolean;
  isFinalLesson: boolean;
  alreadyComplete?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (disabled || isPending) return;
    if (isFinalLesson && !alreadyComplete) {
      toast.success("Course complete! 🎉", {
        description: "Great work — you finished the course.",
      });
    }
    startTransition(() => {
      completeAndAdvance(lessonId, courseId, continueTarget);
    });
  }

  return (
    <Button
      type="button"
      variant={alreadyComplete ? "secondary" : "default"}
      disabled={disabled || isPending}
      onClick={onClick}
      title={disabled ? "Submit the assignment below to continue" : undefined}
    >
      {label}
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}
