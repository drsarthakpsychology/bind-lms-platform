"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Trash2 } from "lucide-react";
import { deleteStudent, resetStudentPassword } from "./actions";

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

/**
 * Per-student actions in the admin list — one-click reset and delete. Delete
 * needs a confirm (irreversible); reset is immediate.
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleReset() {
    setError(null);
    startTransition(async () => {
      const result = await resetStudentPassword(userId);
      if (result.error) setError(result.error);
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteStudent(userId);
      setConfirmOpen(false);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant={isTest ? "secondary" : "ghost"}
        size="xs"
        onClick={handleReset}
        disabled={isPending}
        title="Reset password to K#test"
      >
        {isPending ? <Loader2 className="size-3 animate-spin" aria-hidden /> : <KeyRound className="size-3" aria-hidden />}
        Reset
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon-xs" aria-label="Delete student">
            <Trash2 className="size-3.5" aria-hidden />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this student?</DialogTitle>
            <DialogDescription>
              This permanently deletes the account and all of its progress,
              submissions, and files. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <p role="alert" className="text-sm text-status-alert-fg">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
              Delete student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
