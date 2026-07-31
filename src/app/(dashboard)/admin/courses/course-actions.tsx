"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCoursePublished, deleteCourse } from "./actions";

export function CourseActions({
  courseId,
  isPublished,
}: {
  courseId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleTogglePublish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      const result = await setCoursePublished(courseId, !isPublished);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this course? This also deletes its lessons, progress, and submissions. This can't be undone.")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteCourse(courseId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleTogglePublish}
        disabled={isPending}
        className={
          isPublished
            ? "rounded-full bg-status-success-bg px-2 py-0.5 text-xs text-status-success-fg disabled:opacity-60"
            : "rounded-full bg-status-pending-bg px-2 py-0.5 text-xs text-status-pending-fg disabled:opacity-60"
        }
      >
        {isPending ? "…" : isPublished ? "Published" : "Draft"}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-secondary disabled:opacity-60"
      >
        Delete
      </button>
      {error && <span className="text-xs text-status-alert-fg">{error}</span>}
    </div>
  );
}
