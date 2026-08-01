"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { setCoursePublished, deleteCourse } from "./actions";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);

  function handleTogglePublish() {
    setError(null);
    startTransition(async () => {
      const result = await setCoursePublished(courseId, !isPublished);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(isPublished ? "Course set to draft" : "Course published");
        router.refresh();
      }
    });
  }

  function handleTogglePublishConfirmed() {
    // Unpublishing (published → draft) hides the course from students — confirm.
    if (isPublished) {
      setPublishConfirmOpen(true);
    } else {
      handleTogglePublish();
    }
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCourse(courseId);
      setConfirmOpen(false);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Course deleted");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={isPublished ? "secondary" : "outline"}
        size="sm"
        onClick={handleTogglePublishConfirmed}
        disabled={isPending}
      >
        {isPending && <Loader2 className="size-3 animate-spin" aria-hidden />}
        {isPublished ? "Set to draft" : "Publish"}
      </Button>

      {/* Confirm before unpublishing — it hides the course from students. */}
      <Dialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unpublish this course?</DialogTitle>
            <DialogDescription>
              Students will no longer see this course until you publish it again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPublishConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPublishConfirmOpen(false);
                handleTogglePublish();
              }}
              disabled={isPending}
            >
              Set to draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Course actions">
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => router.push(`/admin/courses/${courseId}`)}
            >
              <Pencil className="size-4" aria-hidden />
              Open builder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
                <Trash2 className="size-4" aria-hidden />
                Delete course
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this course?</DialogTitle>
            <DialogDescription>
              Deleting this course also deletes its lessons, progress, and submissions. This
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
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
