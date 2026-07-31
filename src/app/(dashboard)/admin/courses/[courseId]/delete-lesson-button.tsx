"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLesson } from "./actions";

export function DeleteLessonButton({ lessonId, courseId }: { lessonId: string; courseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm("Delete this lesson and its video, assignment, and student progress? This can't be undone.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteLesson(lessonId, courseId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary disabled:opacity-60"
      >
        {isPending ? "…" : "Delete"}
      </button>
      {error && <span className="text-xs text-status-alert-fg">{error}</span>}
    </span>
  );
}
