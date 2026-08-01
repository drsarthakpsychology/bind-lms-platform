"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteLesson } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteLessonButton({ lessonId, courseId }: { lessonId: string; courseId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteLesson(lessonId, courseId);
      setConfirmOpen(false);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Trash2 className="size-3.5" aria-hidden />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this lesson?</DialogTitle>
          <DialogDescription>
            This also deletes the lesson&apos;s video, assignment, and student progress. This
            can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="text-sm text-status-alert-fg">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {isPending ? "Deleting…" : "Delete lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
