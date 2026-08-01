import * as React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { AppSidebar, type SidebarMode } from "@/components/navigation/app-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { STUDENT_ITEMS, ADMIN_ITEMS } from "@/components/navigation/nav-config";
import { logout } from "@/lib/auth/actions";
import { BRAND } from "@/lib/brand";

/**
 * Application shell: persistent desktop sidebar + compact mobile top bar
 * with a drawer. Server Component; interactive islands are composed in.
 */
export function AppShell({
  role,
  mode,
  viewModeSwitch,
  children,
}: {
  role: "admin" | "student";
  mode: SidebarMode;
  viewModeSwitch?: React.ReactNode;
  children: React.ReactNode;
}) {
  const items = role === "admin" && mode === "admin" ? ADMIN_ITEMS : STUDENT_ITEMS;

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <AppSidebar role={role} mode={mode} viewModeSwitch={viewModeSwitch} />
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="flex min-h-14 items-center justify-between border-b-2 border-border bg-card px-4 lg:hidden">
        <Link
          href={mode === "admin" && role === "admin" ? "/admin" : "/dashboard"}
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-xs font-black text-primary-foreground">
            {BRAND.shortName.charAt(0)}
          </span>
          <span className="text-base">{BRAND.shortName}</span>
        </Link>
        <MobileNav
          items={items}
          viewModeSwitch={viewModeSwitch}
          logoutButton={
            <form action={logout}>
              <button
                type="submit"
                aria-label="Log out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </form>
          }
        />
      </div>

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
