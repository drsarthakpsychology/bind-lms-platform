"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

import { AccountMenu } from "@/components/navigation/account-menu";
import { toggleSidebar } from "@/components/navigation/sidebar-state";
import { isImmersiveSessionPath, isInnerStudentPath } from "@/components/navigation/sidebar-gate";
import { VibhaMark } from "@/components/brand/vibha-logo";
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
}: {
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

        <Link
          href={homeHref}
          className="group/logo flex shrink-0 items-center gap-2 rounded-full pr-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label="VIBHA home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl border-2 border-foreground bg-primary text-primary-foreground transition-transform duration-base ease-springy group-hover/logo:-rotate-12">
            <VibhaMark size={22} className="shrink-0" />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-black tracking-tight [font-stretch:125%]">VIBHA</span>
            <span className="hidden text-[0.55rem] font-pix uppercase text-muted-foreground sm:block">
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
          <Link href="/notifications" aria-label="Notifications" className={iconBtn}>
            <Bell className="size-5" aria-hidden />
          </Link>
          <AccountMenu email={email} role={role} showSettings={showSettings} />
        </div>
      </div>
    </header>
  );
}
