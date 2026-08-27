"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAssignmentPublished } from "./actions";
import { Badge } from "@/components/ui/badge";

/**
 * The assignment's visibility to students, as a badge + one-tap toggle.
 * Fixes the invisible-assignment lifecycle: an assignment can never exist
 * without the admin seeing whether it's live and being able to flip it.
 */
export function AssignmentToggle({
  lessonId,
  courseId,
  published,
}: {
  lessonId: string;
  courseId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function flip() {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await setAssignmentPublished(lessonId, courseId, !published);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={flip}
        disabled={isPending}
        aria-pressed={published}
        title={published ? "Students can see this assignment. Tap to hide." : "Hidden from students. Tap to publish."}
        className="transition-opacity focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50"
      >
        {published ? (
          <Badge variant="published">Assignment live</Badge>
        ) : (
          <Badge variant="draft">Assignment draft</Badge>
        )}
      </button>
      {error ? (
        <span role="alert" className="text-caption text-status-alert-fg">
          {error}
        </span>
      ) : null}
    </span>
  );
}
