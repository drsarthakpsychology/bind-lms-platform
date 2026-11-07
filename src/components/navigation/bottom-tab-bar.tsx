"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, BookOpen, Gamepad2, Home, Mail, Menu, MessageSquare, Play, Stethoscope, Users, MessageCircleQuestion, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { blockedBy } from "@/lib/access/features";
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

const STUDY_TAB: Tab = { href: "/study", label: "Notes", icon: BookOpen };
const GAMES_TAB: Tab = { href: "/games", label: "Games", icon: Gamepad2 };

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
  const reduce = useReducedMotion();
  const base = mode === "admin" ? ADMIN_TABS : scope === "lectures_only" ? LECTURE_ONLY_TABS : STUDENT_TABS;
  // When learning is unlocked the phone tabs are Home, Lectures, Notes, Games
  // (four destinations plus More): Practice, Wall and Alerts move into More.
  const wanted = mode !== "admin" && showStudy && scope !== "lectures_only" ? [base[0], base[1], STUDY_TAB, GAMES_TAB] : base;
  const tabs = mode === "admin" ? wanted : wanted.filter((t) => !blockedBy(t.href, blocked));

  const focusedPath =
    isImmersiveSessionPath(pathname) || /^\/courses\/[^/]+\/(?:lessons|materials)\//.test(pathname) || /^\/games\/(?:play|coach|detective|scenarios|terms|lab\/)/.test(pathname) || /^\/study\/(?!notes\/)[^/]+\/[^/]+/.test(pathname) || /^\/prep\/mock\/(?!result\/)[^/]+$/.test(pathname);
  if (focusedPath) return null;

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
