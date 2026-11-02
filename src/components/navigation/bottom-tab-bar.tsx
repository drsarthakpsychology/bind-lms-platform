"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Home, Inbox, Mail, Menu, MessageSquare, Play, Stethoscope, Users, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isImmersiveSessionPath } from "./sidebar-gate";
import { openNavDrawer } from "./sidebar-state";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match exactly (a hub route like /admin) rather than prefix-matching children. */
  exact?: boolean;
  /** Other path prefixes that belong to this tab. */
  match?: string[];
}

const STUDENT_TABS: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/courses", label: "Lectures", icon: Play },
  { href: "/practice", label: "Practice", icon: Stethoscope },
  { href: "/wall", label: "Wall", icon: MessageSquare },
];

const STUDY_TAB: Tab = { href: "/study", label: "Study", icon: BookOpen };

/** Admin: the 4 highest-frequency destinations; everything else is in More. */
const ADMIN_TABS: Tab[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  { href: "/admin/emails", label: "Mail", icon: Mail },
  { href: "/admin/people", label: "People", icon: Users, match: ["/admin/students", "/admin/activity", "/admin/enquiries", "/admin/pulse", "/admin/checkins", "/admin/roster"] },
  { href: "/admin/triage", label: "Review", icon: Inbox, match: ["/admin/submissions", "/admin/sim-review", "/admin/supervision", "/admin/wall-reports"] },
];

/** Lecture roster: lectures, practice and alerts. */
const LECTURE_ONLY_TABS: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/courses", label: "Lectures", icon: Play },
  { href: "/practice", label: "Practice", icon: Stethoscope },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

/**
 * Phone bottom navigation (Android/Instagram/YouTube pattern): icon over a
 * short label, the active tab gets a lime pill behind its icon, and the last
 * slot is always "More" — the drawer with everything else and your account.
 * Hidden on lesson/material pages and in the patient session.
 */
export function BottomTabBar({
  mode = "student",
  scope = "full",
  showStudy = false,
}: {
  mode?: "student" | "admin";
  scope?: "full" | "lectures_only";
  showStudy?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const reduce = useReducedMotion();
  const base = mode === "admin" ? ADMIN_TABS : scope === "lectures_only" ? LECTURE_ONLY_TABS : STUDENT_TABS;
  // Study takes the third slot when it's unlocked (Wall / Alerts stay in More and the top bar).
  const tabs = mode !== "admin" && showStudy ? [base[0], base[1], STUDY_TAB, base[2]] : base;

  const focusedPath =
    isImmersiveSessionPath(pathname) || /^\/courses\/[^/]+\/(?:lessons|materials)\//.test(pathname) || /^\/study\/(?:play|coach|detective|scenarios|terms)/.test(pathname);
  if (focusedPath) return null;

  const cell =
    "group/tab flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5 text-[0.7rem] font-bold leading-none outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/60";
  const pill =
    "relative flex h-8 w-14 items-center justify-center rounded-full border-2 transition-transform duration-fast ease-snappy group-active/tab:scale-90";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-foreground bg-card lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary tabs"
    >
      <div className="mx-auto flex max-w-xl items-stretch">
        {tabs.map((t) => {
          const Icon = t.icon;
          const under = (h: string) => pathname === h || pathname.startsWith(h + "/");
          const active = t.exact ? pathname === t.href : under(t.href) || (t.match ?? []).some(under);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cn(cell, active ? "text-foreground" : "text-muted-foreground")}
            >
              <span className={cn(pill, active ? "border-foreground" : "border-transparent")}>
                {active && (
                  <motion.span
                    layoutId="bottom-tab-active"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon className={cn("relative z-10 size-5", active && "text-primary-foreground")} aria-hidden />
              </span>
              <span>{t.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={openNavDrawer} className={cn(cell, "text-muted-foreground")}>
          <span className={cn(pill, "border-transparent")}>
            <Menu className="relative z-10 size-5" aria-hidden />
          </span>
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
