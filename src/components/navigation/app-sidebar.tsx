"use client";

import * as React from "react";
import { Eye } from "lucide-react";

import { NavItems } from "@/components/navigation/nav-items";
import { STUDENT_ITEMS, ADMIN_SIDEBAR, LECTURE_ONLY_ITEMS, withStudy, withoutBlocked } from "@/components/navigation/nav-config";
import { useSidebarPref } from "@/components/navigation/sidebar-state";
import { cn } from "@/lib/utils";

export type SidebarMode = "admin" | "student";

/**
 * Sidebar (YouTube-style guide). Full width with labels on wide screens, a
 * slim icon rail on laptops and always on tablets (768-1023); on laptops the
 * ☰ in the top bar flips it and the choice is remembered. `role`/`mode` are decided server-side — this component
 * never makes authorization decisions.
 */
export function AppSidebar({
  role,
  mode,
  scope = "full",
  showStudy = false,
  blocked = [],
  className,
}: {
  role: "admin" | "student";
  mode: SidebarMode;
  scope?: "full" | "lectures_only";
  showStudy?: boolean;
  blocked?: string[];
  className?: string;
}) {
  const pref = useSidebarPref();
  const laptop = useLaptopWidth();
  // Tablets have no room for the full sidebar: the rail, whatever was chosen.
  const size = laptop ? pref : pref === "auto" ? "auto" : "mini";
  const items =
    role === "admin" && mode === "admin"
      ? ADMIN_SIDEBAR
      : withoutBlocked(withStudy(scope === "lectures_only" ? LECTURE_ONLY_ITEMS : STUDENT_ITEMS, showStudy), blocked);

  return (
    <aside
      data-size={size}
      aria-label="Sections"
      className={cn(
        "app-side flex h-full shrink-0 flex-col border-r-2 border-foreground bg-card",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <NavItems items={items} />
        {role === "admin" && mode === "student" ? (
          <p className="side-wide mt-5 flex items-start gap-2 rounded-xl border-2 border-dashed border-foreground px-3 py-2 text-caption font-semibold">
            <Eye className="mt-0.5 size-4 shrink-0" aria-hidden />
            You&apos;re seeing what students see.
          </p>
        ) : null}
      </div>
      <p className="side-wide border-t-2 border-foreground px-4 py-3 text-caption text-muted-foreground">
        Press <kbd className="rounded border border-foreground px-1 font-mono text-[0.7rem]">/</kbd> to search
      </p>
    </aside>
  );
}

/** True at 1024px and wider (laptops). The server assumes a laptop. */
function useLaptopWidth(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(min-width: 1024px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}
