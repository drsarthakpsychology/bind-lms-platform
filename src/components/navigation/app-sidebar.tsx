import * as React from "react";
import Link from "next/link";
import { Bell, LogOut, Settings } from "lucide-react";

import { NavItems } from "@/components/navigation/nav-items";
import { PaletteTrigger } from "@/components/search/palette-trigger";
import { STUDENT_ITEMS, ADMIN_ITEMS, LECTURE_ONLY_ITEMS } from "@/components/navigation/nav-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { BRAND } from "@/lib/brand";
import { VibhaMark } from "@/components/brand/vibha-logo";

export type SidebarMode = "admin" | "student";

/**
 * Persistent app sidebar. `role` and `mode` are decided server-side and passed
 * in — this component never makes authorization decisions itself.
 */
export function AppSidebar({
  role,
  mode,
  scope = "full",
  viewModeSwitch,
  className,
}: {
  role: "admin" | "student";
  mode: SidebarMode;
  scope?: "full" | "lectures_only";
  viewModeSwitch?: React.ReactNode;
  className?: string;
}) {
  const isAdminView = role === "admin" && mode === "admin";
  const items =
    role === "admin" && mode === "admin"
      ? ADMIN_ITEMS
      : scope === "lectures_only"
        ? LECTURE_ONLY_ITEMS
        : STUDENT_ITEMS;

  return (
    <aside
      className={
        "flex h-full w-60 shrink-0 flex-col border-r-2 border-border bg-card " +
        (className ?? "")
      }
    >
      <div className="flex h-14 items-center gap-2 border-b-2 border-border px-4">
        <Link
          href={isAdminView ? "/admin" : "/dashboard"}
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <VibhaMark size={28} className="shrink-0 text-foreground" />
          <span className="text-base">{BRAND.shortName}</span>
        </Link>
        {/* Ask the Syllabus trigger — the palette also opens via ⌘K. */}
        <PaletteTrigger />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavItems items={items} />
        {role === "admin" && mode === "student" ? (
          <p className="mt-4 rounded-md border-2 border-dashed border-border px-3 py-2 text-caption text-muted-foreground">
            You&apos;re previewing the student experience.
          </p>
        ) : null}
      </div>

      <div className="border-t-2 border-border p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {viewModeSwitch}
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href="/notifications"
              className="inline-flex size-8 items-center justify-center rounded-md border-2 border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden />
            </Link>
            <Link
              href="/settings"
              className="inline-flex size-8 items-center justify-center rounded-md border-2 border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              aria-label="Settings"
            >
              <Settings className="size-4" aria-hidden />
            </Link>
            <form action={logout}>
              <Button type="submit" variant="secondary" size="icon-sm" aria-label="Log out">
                <LogOut className="size-4" aria-hidden />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
