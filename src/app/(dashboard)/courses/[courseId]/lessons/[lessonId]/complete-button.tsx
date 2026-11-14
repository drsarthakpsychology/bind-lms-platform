"use client";

import { useTransition } from "react";
import { unstable_isUnrecognizedActionError, useRouter } from "next/navigation";
import { toast } from "sonner";
import { flushSaves, queueSave } from "@/lib/save/client";
import { ArrowRight } from "lucide-react";
import { completeAndAdvance } from "./actions";
import { haptic } from "@/lib/haptics";
import { Button } from "@/components/ui/button";

/**
 * Client wrapper for the single forward action on a lesson.
 *
 * Three states, one button:
 *   - Mid-course          → "Next lesson": advance, no toast.
 *   - Final, not complete → "Finish course": fires a success toast before the
 *     redirect lands on the dashboard (a clear success moment).
 *   - Final, already done → "Back to my courses": secondary variant; nothing
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
  isFinalLesson,
  alreadyComplete,
}: {
  lessonId: string;
  courseId: string;
  continueTarget: string;
  label: string;
  isFinalLesson: boolean;
  alreadyComplete?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  /** The direct save failed: keep it in the save outbox (it retries) and move on. */
  function queueAndGo(hard: boolean) {
    if (!queueSave("complete", lessonId, { lessonId })) {
      toast.error("Couldn't save. Try again.");
      return;
    }
    void flushSaves();
    if (hard) window.location.assign(continueTarget);
    else router.push(continueTarget);
  }

  function onClick() {
    if (isPending) return;
    haptic("success");
    if (isFinalLesson && !alreadyComplete) {
      toast.success("Course complete! 🎉", {
        description: "Great work. You finished the course.",
      });
    }
    startTransition(async () => {
      try {
        const r = await completeAndAdvance(lessonId, courseId, continueTarget);
        if (r?.error) queueAndGo(false);
      } catch (e) {
        // A new version went live while this page was open: save through the
        // outbox and load the next lesson fresh. Anything else (including the
        // redirect itself) is left to Next.
        if (unstable_isUnrecognizedActionError(e)) queueAndGo(true);
        else throw e;
      }
    });
  }

  return (
    <Button
      type="button"
      variant={alreadyComplete ? "secondary" : "default"}
      disabled={isPending}
      onClick={onClick}
    >
      {label}
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}
