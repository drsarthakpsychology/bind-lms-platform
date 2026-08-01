"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { completeAndAdvance } from "./actions";
import { Button } from "@/components/ui/button";

/**
 * Client wrapper for "Complete and Continue" / "Complete Course".
 *
 * Fires a success toast when the student completes the FINAL lesson (course
 * done) before the redirect lands them on the dashboard — a clear success
 * moment instead of a silent jump. Non-final lessons just advance with no
 * toast (the next lesson loading is feedback enough).
 */
export function CompleteButton({
  lessonId,
  courseId,
  continueTarget,
  label,
  disabled,
  isFinalLesson,
  size = "default",
}: {
  lessonId: string;
  courseId: string;
  continueTarget: string;
  label: string;
  disabled: boolean;
  isFinalLesson: boolean;
  size?: "default" | "lg";
}) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (disabled || isPending) return;
    if (isFinalLesson) {
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
      size={size}
      disabled={disabled || isPending}
      onClick={onClick}
      title={disabled ? "Submit the assignment below to continue" : undefined}
    >
      {label}
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}
