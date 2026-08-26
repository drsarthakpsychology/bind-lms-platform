"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Unlock } from "lucide-react";
import { setAccountStatus } from "@/app/(dashboard)/admin/students/actions";
import { cn } from "@/lib/utils";

/**
 * One-click Lock/Unlock toggle for a student's whole access. Locking is the
 * unconditional every-request override (`profiles.status = blocked`) — the
 * student is cut off on their very next request, even mid-session. Unlocking
 * restores access on the next request with no re-login.
 */
export function LockToggle({
  userId,
  status,
}: {
  userId: string;
  status: "active" | "blocked";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locked = status === "blocked";

  function flip() {
    startTransition(async () => {
      await setAccountStatus(userId, locked ? "active" : "blocked", locked ? undefined : "Admin lock");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={flip}
      disabled={isPending}
      aria-pressed={locked}
      aria-label={locked ? "Unlock this student's access" : "Lock this student's access"}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border-2 px-3 text-small font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        locked
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground hover:bg-accent active:translate-y-px",
      )}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : locked ? (
        <Lock className="size-3.5" aria-hidden />
      ) : (
        <Unlock className="size-3.5" aria-hidden />
      )}
      {locked ? "Locked" : "Unlocked"}
    </button>
  );
}
