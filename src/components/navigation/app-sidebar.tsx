"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Eye, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { NavItems } from "@/components/navigation/nav-items";
import { STUDENT_ITEMS, ADMIN_SIDEBAR, LECTURE_ONLY_ITEMS, withStudy, withoutBlocked } from "@/components/navigation/nav-config";
import { isFocusPath } from "@/components/navigation/sections";
import { setFocusPref, useFocusPref } from "@/components/navigation/sidebar-state";
import { cn } from "@/lib/utils";

export type SidebarMode = "admin" | "student";

/**
 * Sidebar (YouTube-style guide). Full width with names on wide screens, a
 * slim rail on laptops and always on tablets (768-1023). On focus pages
 * (questions, reading, a game) it folds to icons on laptops and up, with an
 * open/fold control at the top; both choices are remembered per device
 * (sidebar-state.ts). Sizes live in globals.css, so the server render already
 * has the right width. `role`/`mode` are decided server-side: this component
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
  const pathname = usePathname() ?? "";
  const studentSide = !(role === "admin" && mode === "admin");
  const focus = studentSide && isFocusPath(pathname);
  const items = studentSide
    ? withoutBlocked(withStudy(scope === "lectures_only" ? LECTURE_ONLY_ITEMS : STUDENT_ITEMS, showStudy), blocked)
    : ADMIN_SIDEBAR;

  return (
    <aside
      data-focus={focus ? "" : undefined}
      aria-label="Sections"
      className={cn("app-side flex h-full shrink-0 flex-col border-r-2 border-foreground bg-card", className)}
    >
      {focus ? <FoldControl /> : null}
      <div className="side-scroll flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-4">
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

/**
 * Open the folded sidebar, or fold it back to icons. Which icon and words
 * show follows the sidebar's width (CSS), so it is right before the page
 * finishes loading; aria-expanded follows the remembered choice.
 */
function FoldControl() {
  const open = useFocusPref() === "full";
  return (
    <div className="hidden border-b-2 border-foreground px-3 py-2 lg:block">
      <button
        type="button"
        onClick={() => setFocusPref(open ? "icons" : "full")}
        aria-expanded={open}
        aria-label={open ? "Shrink menu to icons" : "Show full menu"}
        title={open ? "Shrink menu to icons" : "Show full menu"}
        className="side-fold min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-transparent px-3 text-sm font-bold text-foreground/80 outline-none transition-[color,background-color,box-shadow] duration-fast ease-snappy hover:border-foreground hover:bg-background hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        <PanelLeftOpen className="fold-open size-5 shrink-0" aria-hidden />
        <PanelLeftClose className="fold-close size-5 shrink-0" aria-hidden />
        <span className="fold-text truncate" aria-hidden>
          Shrink menu
        </span>
      </button>
    </div>
  );
}
