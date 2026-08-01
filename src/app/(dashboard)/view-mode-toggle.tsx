"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { setViewMode } from "./view-mode-actions";
import { Button } from "@/components/ui/button";

/**
 * Admin/student switch — a single compact icon button in the sidebar footer,
 * the same size as the theme and logout buttons (no more full-width segmented
 * control).
 *
 * Clicking it NAVIGATES to the real student dashboard route (the cookie still
 * marks the admin is previewing, but the destination is a genuine route, not an
 * embedded preview). From any student screen a small persistent control returns
 * to admin in one click (see ReturnToAdmin).
 */
export function ViewModeToggle({ currentMode }: { currentMode: "admin" | "student" }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function switchTo(mode: "admin" | "student") {
    if (mode === currentMode || isPending) return;
    startTransition(() => setViewMode(mode));
    // setViewMode redirects server-side; also refresh so client nav stays in sync.
    router.refresh();
  }

  const isAdmin = currentMode === "admin";

  return (
    <Button
      type="button"
      variant={isAdmin ? "secondary" : "outline"}
      size="icon-sm"
      onClick={() => switchTo(isAdmin ? "student" : "admin")}
      title={isAdmin ? "View the student side" : "Back to admin"}
      aria-label={isAdmin ? "View the student side" : "Back to admin"}
    >
      {isAdmin ? (
        <GraduationCap className="size-4" aria-hidden />
      ) : (
        <ShieldCheck className="size-4" aria-hidden />
      )}
    </Button>
  );
}
