"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Stethoscope, NotebookPen, MessageSquare, ListFilter, FileCheck, Users, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isImmersiveSessionPath } from "./sidebar-gate";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match exactly (a hub route like /admin) rather than prefix-matching children. */
  exact?: boolean;
}

const STUDENT_TABS: Tab[] = [
  { href: "/today", label: "Today", icon: LayoutDashboard, exact: true },
  { href: "/dashboard", label: "My Courses", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Stethoscope },
  { href: "/reflect", label: "Journal", icon: NotebookPen },
  { href: "/wall", label: "Wall", icon: MessageSquare },
];

/** Admin mobile nav — the 4 highest-frequency destinations; the rest live in the drawer. */
const ADMIN_TABS: Tab[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/triage", label: "Review", icon: ListFilter },
  { href: "/admin/submissions", label: "Submissions", icon: FileCheck },
  { href: "/admin/students", label: "Students", icon: Users },
];

/** Lecture-only roster: a single tab — the lecture list. */
const LECTURE_ONLY_TABS: Tab[] = [
  { href: "/dashboard", label: "Lectures", icon: BookOpen, exact: true },
];

/**
 * Mobile bottom tab bar (v5.1 Part B3) — thumb reach. Desktop keeps the
 * sidebar; this renders on small screens only. One tap per tab, active state.
 *
 * Student gets the 5 core tabs; admin gets a compact 4-destination bar so the
 * high-frequency review workflow isn't reduced to a drawer-only path.
 *
 * The active tab gets the system's standard "active" language — peach fill,
 * ink border, hard offset shadow (same as the sidebar active row and the
 * SegmentedControl active segment) — inside a constant-geometry chip, so the
 * active/inactive swap never shifts layout. The peach fill slides between tabs
 * via a layout-animated indicator (reduced-motion renders it statically).
 * Ink-on-peach ≈ 9:1 in both themes.
 */
export function BottomTabBar({
  mode = "student",
  scope = "full",
}: {
  mode?: "student" | "admin";
  scope?: "full" | "lectures_only";
}) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const tabs =
    mode === "admin"
      ? ADMIN_TABS
      : scope === "lectures_only"
        ? LECTURE_ONLY_TABS
        : STUDENT_TABS;

  // Focused modes hide the tab bar — the patient session and lesson/material
  // drill-downs own the viewport (the page has its own contextual back header),
  // so the global nav never competes with the task (§20).
  const focusedPath =
    isImmersiveSessionPath(pathname ?? "") ||
    /^\/courses\/[^/]+\/(?:lessons|materials)\//.test(pathname ?? "");
  if (focusedPath) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-card lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary tabs"
    >
      <div className="flex items-stretch justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.exact
            ? pathname === t.href
            : pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className="flex min-h-14 flex-1 flex-col items-center justify-center py-1.5 text-caption"
            >
              <span
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-md border-2 px-3 py-1 font-medium transition-colors duration-fast ease-snappy active:translate-y-px",
                  active
                    ? "border-foreground text-primary-foreground hard-shadow-flat"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Sliding active fill — same layoutId across the bar, so it
                    animates to whichever tab is active. */}
                {active && (
                  <motion.span
                    layoutId="bottom-tab-active"
                    aria-hidden
                    className="absolute inset-0 rounded-md bg-primary"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
                <Icon className="relative z-10 size-5" aria-hidden />
                <span className="relative z-10">{t.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
