import * as React from "react";

import { AppSidebar, type SidebarMode } from "@/components/navigation/app-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { BottomTabBar } from "@/components/navigation/bottom-tab-bar";
import { SidebarGate } from "@/components/navigation/sidebar-gate";
import { ShellContent } from "@/components/navigation/shell-content";
import { TopBar } from "@/components/navigation/top-bar";
import { STUDENT_ITEMS, ADMIN_ITEMS, LECTURE_ONLY_ITEMS, withStudy, withoutBlocked } from "@/components/navigation/nav-config";
import { PaletteHost } from "@/components/search/palette-host";

/**
 * Application shell — the layout people already know from YouTube:
 *   - top bar: ☰ + logo, a big search box, bell, avatar menu
 *   - left: a sidebar that folds into a slim icon rail (☰ toggles it)
 *   - phones: a bottom tab bar with a "More" drawer
 * Server Component; interactive islands are composed in. On lesson/material
 * pages the sidebar steps aside so the video gets the width (YouTube's watch
 * page does the same).
 */
export function AppShell({
  role,
  mode,
  scope = "full",
  email = null,
  showStudy = false,
  blocked = [],
  viewModeSwitch,
  unread = 0,
  children,
}: {
  /** Unread notifications (bell badge). */
  unread?: number;
  role: "admin" | "student";
  mode: SidebarMode;
  scope?: "full" | "lectures_only";
  email?: string | null;
  /** True when Study (the course) is unlocked for students. */
  showStudy?: boolean;
  /** Sections switched off for this student (People → Access). */
  blocked?: string[];
  viewModeSwitch?: React.ReactNode;
  children: React.ReactNode;
}) {
  const isAdminView = role === "admin" && mode === "admin";
  const items = isAdminView ? ADMIN_ITEMS : withoutBlocked(withStudy(scope === "lectures_only" ? LECTURE_ONLY_ITEMS : STUDENT_ITEMS, showStudy), blocked);
  // The sidebar gate treats "admin previewing as student" like a student on
  // inner pages (they get the drill-down too).
  const gateRole = role === "admin" && mode === "student" ? "admin-preview" : role;
  // Lecture-only accounts can't open /settings (server-guarded), so don't link it.
  const showSettings = role === "admin" || scope === "full";

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main"
        className="sr-only z-50 rounded-full border-2 border-foreground bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {/* Search palette — opens from the top bar, ⌘K or "/". */}
      <React.Suspense fallback={null}>
        <PaletteHost isAdmin={isAdminView} />
      </React.Suspense>

      <TopBar
        homeHref={isAdminView ? "/admin" : "/dashboard"}
        role={role}
        gateRole={gateRole}
        email={email}
        showSettings={showSettings}
        viewModeSwitch={viewModeSwitch}
        isAdminView={isAdminView}
        unread={unread}
      />

      <div className="lg:flex">
        <SidebarGate role={gateRole} fallback={null}>
          <div className="hidden shrink-0 lg:block">
            <div className="sticky top-16 h-[calc(100dvh-4rem)]">
              <AppSidebar role={role} mode={mode} scope={scope} showStudy={showStudy} blocked={blocked} />
            </div>
          </div>
        </SidebarGate>

        <main id="main" className="min-w-0 flex-1">
          <ShellContent>{children}</ShellContent>
        </main>
      </div>

      <BottomTabBar mode={mode} scope={scope} showStudy={showStudy} blocked={blocked} />
      <MobileNav
        items={items}
        viewModeSwitch={viewModeSwitch}
        email={email}
        role={role}
        showSettings={showSettings}
      />
    </div>
  );
}
