import * as React from "react";
import Link from "next/link";

import { AppSidebar, type SidebarMode } from "@/components/navigation/app-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { MobileBarVisibility } from "@/components/navigation/mobile-bar-visibility";
import { BottomTabBar } from "@/components/navigation/bottom-tab-bar";
import { SidebarGate } from "@/components/navigation/sidebar-gate";
import { ShellContent } from "@/components/navigation/shell-content";
import { STUDENT_ITEMS, ADMIN_ITEMS, LECTURE_ONLY_ITEMS } from "@/components/navigation/nav-config";
import { PaletteHost } from "@/components/search/palette-host";
import { BRAND } from "@/lib/brand";
import { VibhaMark } from "@/components/brand/vibha-logo";

/**
 * Application shell: persistent desktop sidebar + compact mobile top bar with a
 * drawer. Server Component; interactive islands are composed in.
 *
 * Round 5 (student drill-down): on inner student pages (course/lesson/material)
 * the app sidebar is hidden so there's never two navigation columns — the page
 * owns a single back header. Top-level (dashboard) keeps the sidebar. Admin is
 * unchanged.
 */
export function AppShell({
  role,
  mode,
  scope = "full",
  viewModeSwitch,
  children,
}: {
  role: "admin" | "student";
  mode: SidebarMode;
  scope?: "full" | "lectures_only";
  viewModeSwitch?: React.ReactNode;
  children: React.ReactNode;
}) {
  const items =
    role === "admin" && mode === "admin"
      ? ADMIN_ITEMS
      : scope === "lectures_only"
        ? LECTURE_ONLY_ITEMS
        : STUDENT_ITEMS;
  // The sidebar gate treats "admin previewing as student" like a student on
  // inner pages (they get the drill-down too).
  const gateRole = role === "admin" && mode === "student" ? "admin-preview" : role;

  return (
    <div className="min-h-dvh bg-background lg:flex">
      {/* Ask the Syllabus — ⌘K command palette, available across the shell. */}
      <PaletteHost />

      {/* Desktop sidebar. On inner student pages (lesson/material) the ENTIRE
          column is removed — the page owns the only navigation surface, which
          is the point of the drill-down. Previously a slim top-bar fallback was
          rendered into this column, which produced a 56px stub with a border
          ending in mid-air. The admin's return-to-admin control persists as a
          small fixed control in the bottom-left, matching where it sits in the
          sidebar footer. */}
      <SidebarGate
        role={gateRole}
        fallback={
          viewModeSwitch ? (
            <div className="fixed bottom-4 left-4 z-40 hidden lg:block">
              {viewModeSwitch}
            </div>
          ) : null
        }
      >
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <AppSidebar role={role} mode={mode} scope={scope} viewModeSwitch={viewModeSwitch} />
          </div>
        </div>
      </SidebarGate>

      {/* Mobile top bar — hidden on inner student pages so there's one header
          row (the page's back control). Round 9 drill-down on mobile. */}
      <MobileBarVisibility role={role} mode={mode}>
        <div
          className="flex min-h-14 items-center justify-between border-b-2 border-border bg-card px-4 lg:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Link
            href={mode === "admin" && role === "admin" ? "/admin" : "/dashboard"}
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <VibhaMark size={24} className="shrink-0 text-foreground" />
            <span className="text-base">{BRAND.shortName}</span>
          </Link>
          <MobileNav items={items} viewModeSwitch={viewModeSwitch} />
        </div>
      </MobileBarVisibility>

      <main className="min-w-0 flex-1">
        {/* Safe-area bottom clearance for the fixed tab bar is scoped to
            mobile (the bar is lg:hidden) so desktop keeps lg:px-10 / lg:py-8
            instead of being clamped by an inline style. The immersive patient
            session renders full-bleed (ShellContent). */}
        <ShellContent>{children}</ShellContent>
      </main>

      {/* Mobile bottom tab bar — thumb reach. Student gets the 5 core tabs;
          admin gets a compact 4-destination bar (Overview/Review/Submissions/
          Students) so the review workflow isn't drawer-only. Hidden on the
          immersive session (the chat owns the whole viewport). */}
      <BottomTabBar mode={mode} scope={scope} />
    </div>
  );
}
