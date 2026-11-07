"use client";

import { useTransition } from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { setViewMode } from "./view-mode-actions";
import { Button } from "@/components/ui/button";

/**
 * Admin/student switch: a single compact icon button in the sidebar footer,
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

  function switchTo(mode: "admin" | "student") {
    if (mode === currentMode || isPending) return;
    // setViewMode is a server action that writes the view-mode cookie and then
    // redirect()s server-side; the transition handles that redirect, so no
    // client-side router.refresh() is needed. Firing one immediately after a
    // redirecting server action is a known navigation/refresh race that loops.
    startTransition(() => setViewMode(mode));
  }

  const isAdmin = currentMode === "admin";

  return (
    <Button
      type="button"
      variant={isAdmin ? "outline" : "brand"}
      size="sm"
      onClick={() => switchTo(isAdmin ? "student" : "admin")}
      disabled={isPending}
      title={isAdmin ? "See what students see" : "Back to admin"}
      aria-label={isAdmin ? "See what students see" : "Back to admin"}
    >
      {isAdmin ? (
        <GraduationCap className="size-4" aria-hidden />
      ) : (
        <ShieldCheck className="size-4" aria-hidden />
      )}
      <span>{isAdmin ? "Student view" : "Back to admin"}</span>
    </Button>
  );
}
