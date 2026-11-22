"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Lock, MoreHorizontal, Trash2, Unlock, UserX } from "lucide-react";
import { deleteStudent, resetStudentPassword, setAccountStatus } from "./actions";
import { RemovePersonSheet } from "@/components/admin/remove-person";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

type Mode = "menu" | "delete" | "block";

/**
 * Per-student actions in the admin list. One ⋯ trigger reveals a contextual
 * action sheet (mobile bottom sheet) with Reset, Block/Unblock, and Delete.
 * Block attaches a short internal note (never shown to the student) and is the
 * unconditional every-request override: the account is cut off on its very
 * next request, even mid-session.
 */
export function StudentActions({
  userId,
  isTest,
  status,
  name = "this person",
  confirmWord = "",
  removed = false,
}: {
  userId: string;
  isTest: boolean;
  status: "active" | "blocked";
  name?: string;
  /** The word the server asks for to delete (their name, or email). */
  confirmWord?: string;
  /** Removed from VIBHA (can be restored). */
  removed?: boolean;
}) {
  const [removeOpen, setRemoveOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");
  const [blockReason, setBlockReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setMode("menu");
    setBlockReason("");
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

  function handleBlock() {
    setError(null);
    startTransition(async () => {
      const result = await setAccountStatus(userId, "blocked", blockReason);
      if (result.error) setError(result.error);
      else {
        close();
        router.refresh();
      }
    });
  }

  function handleUnblock() {
    setError(null);
    startTransition(async () => {
      const result = await setAccountStatus(userId, "active");
      if (result.error) setError(result.error);
      else {
        close();
        router.refresh();
      }
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteStudent(userId);
        close();
        if (result.error) setError(result.error);
        else router.refresh();
      } catch (err) {
        close();
        setError(err instanceof Error ? err.message : "Could not delete the account.");
      }
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
        title={
          mode === "delete" ? "Delete this test account?" : mode === "block" ? "Block access" : "Student actions"
        }
        description={
          mode === "delete"
            ? "Test accounts only. This permanently deletes the account and everything in it. It cannot be undone."
            : mode === "block"
              ? "The account is cut off immediately, even if they're logged in right now. The note is for you only; the student just sees \"your access is paused\"."
              : undefined
        }
        footer={
          mode === "delete" ? (
            <div className="flex flex-col gap-2">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending} className="w-full">
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Delete test account
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode("menu")} className="w-full">
                Cancel
              </Button>
            </div>
          ) : mode === "block" ? (
            <div className="flex flex-col gap-2">
              <Button type="button" onClick={handleBlock} disabled={isPending} className="w-full">
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                Block access
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode("menu")} className="w-full">
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

        {mode === "block" ? (
          <div className="space-y-1.5">
            <label htmlFor="block-reason" className="text-small font-medium">
              Why? (internal only)
            </label>
            <Input
              id="block-reason"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. fee not paid"
            />
          </div>
        ) : mode === "menu" ? (
          <div className="flex flex-col gap-1">
            {isTest ? (
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                title="Reset password to K#test"
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium transition-colors hover:bg-accent disabled:opacity-50"
              >
                <KeyRound className="size-4 text-muted-foreground" aria-hidden />
                Reset test password
              </button>
            ) : null}
            {status === "blocked" ? (
              <button
                type="button"
                onClick={handleUnblock}
                disabled={isPending}
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium transition-colors hover:bg-accent disabled:opacity-50"
              >
                <Unlock className="size-4 text-muted-foreground" aria-hidden />
                Unblock access
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("block")}
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium text-status-alert-fg transition-colors hover:bg-accent"
              >
                <Lock className="size-4" aria-hidden />
                Block access
              </button>
            )}
            <button
              type="button"
              data-testid="student-remove"
              onClick={() => {
                close();
                setRemoveOpen(true);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium text-status-alert-fg transition-colors hover:bg-accent"
            >
              <UserX className="size-4" aria-hidden />
              {removed ? "Restore or delete" : "Remove from VIBHA"}
            </button>
            {isTest ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode("delete");
                }}
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-small font-medium text-status-alert-fg transition-colors hover:bg-accent"
              >
                <Trash2 className="size-4" aria-hidden />
                Delete test account
              </button>
            ) : null}
          </div>
        ) : null}
      </MobileBottomSheet>
      <RemovePersonSheet target={{ id: userId, name, confirmWord, state: removed ? "removed" : status === "blocked" ? "locked" : "active" }} open={removeOpen} onOpenChange={setRemoveOpen} />
    </>
  );
}
