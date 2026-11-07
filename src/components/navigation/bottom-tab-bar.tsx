"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Activity, Bell, BookOpen, Home, Mail, Menu, Pill, Play, Stethoscope, Target, Users, MessageCircleQuestion, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { blockedBy } from "@/lib/access/features";
import { isImmersiveSessionPath } from "./sidebar-gate";
import { openNavDrawer } from "./sidebar-state";
import { activeNavHref, isRunPath } from "./sections";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match exactly (a hub route like /admin) rather than prefix-matching children. */
  exact?: boolean;
  /** Other path prefixes that belong to this tab. */
  match?: string[];
}

/**
 * Students, Study unlocked: the four most used places of the approved menu.
 * Everything else (Medicines, Practice, Games, Progress...) is one tap away in More.
 */
const STUDENT_TABS: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/study", label: "Study", icon: BookOpen },
  { href: "/courses", label: "Lectures", icon: Play },
  { href: "/prep", label: "Exam Prep", icon: Target },
];

/** Students before Study opens: no links to locked screens. */
const STUDENT_TABS_NO_STUDY: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/courses", label: "Lectures", icon: Play },
  { href: "/practice/medicines", label: "Medicines", icon: Pill },
  { href: "/practice", label: "Practice", icon: Stethoscope },
];

/** Admin: the 4 highest-frequency destinations; everything else is in More. */
const ADMIN_TABS: Tab[] = [
  { href: "/admin", label: "Home", icon: Home, exact: true },
  // Phone tabs follow the 2026-11 admin menu: Students, Activity, Messages, and More for the rest.
  { href: "/admin/students", label: "Students", icon: Users, match: ["/admin/access", "/admin/roster", "/admin/cohorts"] },
  { href: "/admin/activity", label: "Activity", icon: Activity, match: ["/admin/pulse", "/admin/learning", "/admin/checkins"] },
  { href: "/admin/emails", label: "Messages", icon: Mail },
];

/** Lecture roster: lectures, practice and alerts. */
const LECTURE_ONLY_TABS: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/courses", label: "Lectures", icon: Play },
  { href: "/doubts", label: "Doubts", icon: MessageCircleQuestion },
  { href: "/notifications", label: "Alerts", icon: Bell },
];

/**
 * Phone bottom navigation (<768px; tablets get the icon rail instead)
 * (Android/Instagram/YouTube pattern): icon over a
 * short label, the active tab gets a lime pill behind its icon, and the last
 * slot is always "More": the drawer with everything else and your account.
 * Hidden on lesson/material pages and in the patient session.
 */
export function BottomTabBar({
  mode = "student",
  scope = "full",
  showStudy = false,
  blocked = [],
}: {
  mode?: "student" | "admin";
  scope?: "full" | "lectures_only";
  showStudy?: boolean;
  blocked?: string[];
}) {
  const pathname = usePathname() ?? "";
  const from = useSearchParams()?.get("from");
  const reduce = useReducedMotion();
  const base =
    mode === "admin" ? ADMIN_TABS : scope === "lectures_only" ? LECTURE_ONLY_TABS : showStudy ? STUDENT_TABS : STUDENT_TABS_NO_STUDY;
  const tabs = mode === "admin" ? base : base.filter((t) => !blockedBy(t.href, blocked));

  // During a run (answering, reading one text, playing) the page's own Back
  // row is the only navigation (navigation/sections.ts).
  const focusedPath = isImmersiveSessionPath(pathname) || /^\/courses\/[^/]+\/(?:lessons|materials)\//.test(pathname) || (mode === "student" && isRunPath(pathname));
  if (focusedPath) return null;
  const activeHref = activeNavHref(tabs, pathname, from);

  const cell =
    "group/tab flex min-h-16 flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5 text-[0.7rem] font-bold leading-none outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/60";
  const pill =
    "relative flex h-8 w-14 items-center justify-center rounded-full border-2 transition-transform duration-fast ease-snappy group-active/tab:scale-90";

  return (
    <nav
      className="bottom-tabs fixed inset-x-0 bottom-0 z-40 border-t-2 border-foreground bg-card md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary tabs"
    >
      <div className="mx-auto flex max-w-xl items-stretch">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.href === activeHref;
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
              <span className="max-w-full whitespace-nowrap">{t.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={openNavDrawer} className={cn(cell, "text-muted-foreground")}>
          <span className={cn(pill, "border-transparent")}>
            <Menu className="relative z-10 size-5" aria-hidden />
          </span>
          <span className="whitespace-nowrap">More</span>
        </button>
      </div>
    </nav>
  );
}
