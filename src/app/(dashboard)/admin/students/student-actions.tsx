"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { deleteStudent, resetStudentPassword } from "./actions";

import { Button } from "@/components/ui/button";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

/**
 * Per-student actions in the admin list. One ⋯ trigger reveals a contextual
 * action sheet (mobile bottom sheet) with Reset and Delete; delete then asks
 * for confirmation in the same sheet (no stacked modal transitions).
 */
export function StudentActions({
  userId,
  isTest,
}: {
  userId: string;
  isTest: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setConfirming(false);
    setError(null);
  }

  function handleReset() {
    setError(null);
    startTransition(async () => {
      const result = await resetStudentPassword(userId);
      if (result.error) setError(result.error);
      else close();
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteStudent(userId);
      close();
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Student actions"
        onClick={() => setOpen(true)}
      >
        <MoreHorizontal className="size-4" aria-hidden />
      </Button>

      <MobileBottomSheet
        open={open}
        onOpenChange={(next) => !next && close()}
        title={confirming ? "Delete this student?" : "Student actions"}
        description={
          confirming
            ? "This permanently deletes the account and all of its progress, submissions, and files. This can't be undone."
            : undefined
        }
        footer={
          confirming ? (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="w-full"
              >
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Delete student
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirming(false)}
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
        {confirming ? null : (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              title="Reset password to K#test"
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium transition-colors hover:bg-accent disabled:opacity-50"
            >
              <KeyRound className="size-4 text-muted-foreground" aria-hidden />
              {isTest ? "Reset test password" : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setConfirming(true);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium text-status-alert-fg transition-colors hover:bg-accent"
            >
              <Trash2 className="size-4" aria-hidden />
              Delete student
            </button>
          </div>
        )}
      </MobileBottomSheet>
    </>
  );
}
