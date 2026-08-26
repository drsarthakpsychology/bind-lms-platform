"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { setCoursePublished, deleteCourse } from "./actions";

import { Button } from "@/components/ui/button";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

export function CourseActions({
  courseId,
  isPublished,
  showOpenBuilder = true,
}: {
  courseId: string;
  isPublished: boolean;
  /** Hide the "Open builder" nav when already inside the builder. */
  showOpenBuilder?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<"menu" | "delete">("menu");
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
      try {
        const result = await deleteCourse(courseId);
        setMenuOpen(false);
        setMenuView("menu");
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else {
          toast.success("Course deleted");
          router.refresh();
        }
      } catch (err) {
        setMenuOpen(false);
        setMenuView("menu");
        const message = err instanceof Error ? err.message : "Could not delete the course.";
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {showOpenBuilder && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/courses/${courseId}`)}
        >
          <Pencil className="size-3.5" aria-hidden />
          Open builder
        </Button>
      )}

      <Button
        type="button"
        variant={isPublished ? "secondary" : "default"}
        size="sm"
        onClick={handleTogglePublishConfirmed}
        disabled={isPending}
      >
        {isPending && <Loader2 className="size-3 animate-spin" aria-hidden />}
        {isPublished ? "Set to draft" : "Publish"}
      </Button>

      {/* Confirm before unpublishing — it hides the course from students. */}
      <MobileBottomSheet
        open={publishConfirmOpen}
        onOpenChange={setPublishConfirmOpen}
        title="Unpublish this course?"
        description="Students will no longer see this course until you publish it again."
        footer={
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPublishConfirmOpen(false);
                handleTogglePublish();
              }}
              disabled={isPending}
              className="w-full"
            >
              Set to draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPublishConfirmOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        }
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Course actions"
        onClick={() => {
          setMenuView("menu");
          setError(null);
          setMenuOpen(true);
        }}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </Button>

      <MobileBottomSheet
        open={menuOpen}
        onOpenChange={(next) => !next && setMenuOpen(false)}
        title={menuView === "delete" ? "Delete this course?" : "Course actions"}
        description={
          menuView === "delete"
            ? "Deleting this course also deletes its lessons, progress, and submissions. This can't be undone."
            : undefined
        }
        footer={
          menuView === "delete" ? (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="w-full"
              >
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {isPending ? "Deleting…" : "Delete course"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMenuView("menu")}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          ) : undefined
        }
      >
        {error && (
          <p role="alert" className="mb-2 text-sm text-status-alert-fg">
            {error}
          </p>
        )}
        {menuView === "menu" ? (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMenuView("delete");
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium text-status-alert-fg transition-colors hover:bg-accent"
            >
              <Trash2 className="size-4" aria-hidden />
              Delete course
            </button>
          </div>
        ) : null}
      </MobileBottomSheet>
    </div>
  );
}
