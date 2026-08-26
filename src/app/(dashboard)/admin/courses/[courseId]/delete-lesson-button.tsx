"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteLesson } from "./actions";

import { Button } from "@/components/ui/button";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

export function DeleteLessonButton({ lessonId, courseId }: { lessonId: string; courseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteLesson(lessonId, courseId);
        if (result.error) {
          // Keep the sheet open so the error (rendered inside it) is visible.
          setError(result.error);
          return;
        }
        setConfirmOpen(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete the lesson.");
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="size-3.5 text-status-alert-fg" aria-hidden />
        Delete
      </Button>
      <MobileBottomSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this lesson?"
        description="This also deletes the lesson's video, assignment, and student progress. This can't be undone."
        footer={
          <div className="flex flex-col gap-2">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending} className="w-full">
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {isPending ? "Deleting…" : "Delete lesson"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        }
      >
        {error && (
          <p role="alert" className="text-sm text-status-alert-fg">
            {error}
          </p>
        )}
      </MobileBottomSheet>
    </>
  );
}
