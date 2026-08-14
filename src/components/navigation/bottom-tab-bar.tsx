"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Stethoscope, NotebookPen, MessageSquare, ListFilter, FileCheck, Users, type LucideIcon } from "lucide-react";
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

/**
 * Mobile bottom tab bar (v5.1 Part B3) — thumb reach. Desktop keeps the
 * sidebar; this renders on small screens only. One tap per tab, active state.
 *
 * Student gets the 5 core tabs; admin gets a compact 4-destination bar so the
 * high-frequency review workflow isn't reduced to a drawer-only path.
 *
 * The active tab gets the system's standard "active" language — terracotta
 * fill, ink border, hard offset shadow (same as the sidebar active row and the
 * SegmentedControl active segment) — inside a constant-geometry chip, so the
 * active/inactive swap never shifts layout. Ink-on-peach ≈ 9:1 in both themes.
 */
export function BottomTabBar({ mode = "student" }: { mode?: "student" | "admin" }) {
  const pathname = usePathname();
  const tabs = mode === "admin" ? ADMIN_TABS : STUDENT_TABS;

  // The immersive patient session hides the tab bar — the conversation owns
  // the whole viewport (see shell-content.tsx).
  if (isImmersiveSessionPath(pathname ?? "")) return null;

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
              className="flex flex-1 flex-col items-center py-2 text-caption"
            >
              <span
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-md border-2 px-3 py-1 font-medium transition-colors duration-fast ease-snappy active:translate-y-px",
                  active
                    ? "border-foreground bg-primary text-primary-foreground hard-shadow-flat"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
