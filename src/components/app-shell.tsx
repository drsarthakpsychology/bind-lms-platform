import * as React from "react";

import { AppSidebar, type SidebarMode } from "@/components/navigation/app-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { BottomTabBar } from "@/components/navigation/bottom-tab-bar";
import { SidebarGate } from "@/components/navigation/sidebar-gate";
import { ShellContent } from "@/components/navigation/shell-content";
import { TopBar } from "@/components/navigation/top-bar";
import { SIDEBAR_BOOT_SCRIPT } from "@/components/navigation/sidebar-boot";
import { ADMIN_ITEMS, studentItems } from "@/components/navigation/nav-config";
import { PaletteHost } from "@/components/search/palette-host";
import { InboxBadge } from "@/components/admin/inbox-badge";
import { InboxLink } from "@/components/navigation/inbox-link";
import { AddPeopleHost } from "@/components/admin/add-people-host";

/**
 * Application shell: the layout people already know from YouTube:
 *   - top bar: ☰ + logo, a big search box, bell, avatar menu
 *   - left: a sidebar that folds into a slim icon rail (☰ toggles it); on
 *     focus pages (questions, reading, a game) it folds to icons by itself
 *   - tablets (768-1023): the slim icon rail, ☰ opens the full menu drawer
 *   - phones (<768): a bottom tab bar with a "More" drawer
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
  flags = {},
  children,
}: {
  /** Feature switches (key to status): menu items whose switch is not on are hidden. */
  flags?: Record<string, string>;
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
  const items = isAdminView ? ADMIN_ITEMS : studentItems({ scope, showStudy, blocked, flags });
  // The sidebar gate treats "admin previewing as student" like a student on
  // inner pages (they get the drill-down too).
  const gateRole = role === "admin" && mode === "student" ? "admin-preview" : role;
  // Lecture-only accounts can't open /settings (server-guarded), so don't link it.
  const showSettings = role === "admin" || scope === "full";

  return (
    <div className="min-h-dvh bg-background">
      {/* The remembered sidebar size, set before the sidebar paints (no jump on load). */}
      <script dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOT_SCRIPT }} />
      <a
        href="#main"
        className="sr-only z-50 rounded-md border-2 border-foreground bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {/* Search palette: opens from the top bar, ⌘K or "/". */}
      <React.Suspense fallback={null}>
        <PaletteHost isAdmin={isAdminView} flags={flags} blocked={blocked} />
      </React.Suspense>
      {/* Add people panel: one panel, opened from the palette, Home, Students and cohorts. */}
      {isAdminView ? (
        <React.Suspense fallback={null}>
          <AddPeopleHost />
        </React.Suspense>
      ) : null}

      <TopBar
        homeHref={isAdminView ? "/admin" : "/dashboard"}
        role={role}
        gateRole={gateRole}
        email={email}
        showSettings={showSettings}
        viewModeSwitch={viewModeSwitch}
        isAdminView={isAdminView}
        unread={unread}
        inboxSlot={
          isAdminView ? (
            <React.Suspense fallback={<InboxLink count={0} />}>
              <InboxBadge />
            </React.Suspense>
          ) : null
        }
      />

      <div className="md:flex">
        <SidebarGate role={gateRole} fallback={null}>
          <div className="hidden shrink-0 md:block">
            <div className="sticky top-[var(--top-h)] z-30 h-[calc(100dvh-var(--top-h))]">
              <AppSidebar items={items} studentSide={!isAdminView} adminPreview={role === "admin" && mode === "student"} />
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
