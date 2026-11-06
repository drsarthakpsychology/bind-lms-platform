"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

import { AccountMenu } from "@/components/navigation/account-menu";
import { BackForward } from "@/components/navigation/back-forward";
import { toggleSidebar } from "@/components/navigation/sidebar-state";
import { isImmersiveSessionPath, isInnerStudentPath } from "@/components/navigation/sidebar-gate";
import { cn } from "@/lib/utils";

function openSearch() {
  window.dispatchEvent(new CustomEvent("plms:open-search"));
}

const iconBtn =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-transparent text-foreground outline-none transition-[background-color,border-color,transform] duration-fast ease-snappy hover:border-foreground hover:bg-primary active:scale-95 focus-visible:ring-[3px] focus-visible:ring-ring/60";

/**
 * The masthead — the layout people already know from YouTube, Gmail and
 * Drive: ☰ + logo on the left, a big search box in the middle, the bell and
 * your avatar on the right. Sticky on laptops; on phones it scrolls away so
 * the page gets the room (and on lesson pages the page's own back bar takes
 * over).
 */
export function TopBar({
  homeHref,
  role,
  gateRole,
  email,
  showSettings,
  viewModeSwitch,
  isAdminView,
  unread = 0,
}: {
  unread?: number;
  homeHref: string;
  role: string;
  gateRole: string;
  email: string | null;
  showSettings: boolean;
  viewModeSwitch?: React.ReactNode;
  isAdminView: boolean;
}) {
  const pathname = usePathname() ?? "";
  if (isImmersiveSessionPath(pathname)) return null;
  const innerPage = isInnerStudentPath(pathname, gateRole);

  return (
    <header
      className={cn(
        "z-40 border-b-2 border-foreground bg-card lg:sticky lg:top-0",
        innerPage && "hidden lg:block",
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:h-16">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Show or hide the menu"
          className={cn(iconBtn, "hidden lg:inline-flex", innerPage && "lg:hidden")}
        >
          <Menu className="size-5" aria-hidden />
        </button>

        <BackForward className="shrink-0" />

        <Link
          href={homeHref}
          className="group/logo flex shrink-0 items-center gap-2 rounded-full pr-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label="VIBHA home"
        >
          <span className="leading-none">
            <span className="block text-[1.35rem] font-black tracking-tight [font-stretch:125%]">VIBHA</span>
            <span className="mt-[3px] block text-[0.56rem] font-pix uppercase tracking-[0.06em] text-muted-foreground">
              {isAdminView ? "Admin" : "School of Psychology"}
            </span>
          </span>
        </Link>

        {/* Search: a real-looking box on tablet/desktop, an icon on phones. */}
        <button
          type="button"
          onClick={openSearch}
          className="group/search mx-auto hidden h-11 w-full max-w-xl items-center gap-3 rounded-full border-2 border-foreground bg-background px-4 text-left text-sm text-muted-foreground outline-none transition-[box-shadow,transform] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/60 md:flex"
        >
          <Search className="size-4 shrink-0 text-foreground" aria-hidden />
          <span className="flex-1 truncate">Search lectures, topics, medicines…</span>
          <kbd className="hidden rounded-md border-2 border-foreground bg-card px-1.5 font-mono text-[0.7rem] text-foreground lg:inline">
            /
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <button type="button" onClick={openSearch} aria-label="Search" className={cn(iconBtn, "md:hidden")}>
            <Search className="size-5" aria-hidden />
          </button>
          {viewModeSwitch ? <div className="hidden sm:block">{viewModeSwitch}</div> : null}
          <Link href="/notifications" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} className={cn(iconBtn, "relative")}>
            <Bell className="size-5" aria-hidden />
            {unread ? (
              <span aria-hidden className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-background bg-destructive px-1 text-[0.65rem] font-bold leading-none text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </Link>
          <AccountMenu email={email} role={role} showSettings={showSettings} />
        </div>
      </div>
    </header>
  );
}
