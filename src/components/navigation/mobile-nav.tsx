"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Menu, LogOut, Settings } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavItems, type NavItem } from "@/components/navigation/nav-items";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { BRAND } from "@/lib/brand";

/**
 * Mobile navigation drawer. Radix handles focus management, Escape, and
 * scroll-locking. Closes on navigation.
 *
 * The logout <form action={logout}> is rendered here (a Client Component)
 * rather than passed in as a Server Component prop — a server action
 * reference isn't serializable across the server→client boundary, and
 * passing it as a ReactNode would throw "Functions cannot be passed directly
 * to Client Components".
 */
export function MobileNav({
  items,
  viewModeSwitch,
}: {
  items: NavItem[];
  viewModeSwitch?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation"
          className="inline-flex size-11 items-center justify-center rounded-md border-2 border-border bg-card text-foreground transition-transform hover:bg-accent active:translate-y-0.5"
        >
          <Menu className="size-4" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b-2 border-border px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <SheetTitle className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-sm bg-primary text-xs font-black text-primary-foreground">
              {BRAND.shortName.charAt(0)}
            </span>
            <span>{BRAND.shortName}</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <NavItems
            items={items}
            onNavigate={() => setOpen(false)}
          />
          {viewModeSwitch ? <div className="mt-4">{viewModeSwitch}</div> : null}
        </div>
        <div
          className="flex items-center justify-between border-t-2 border-border px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <ThemeToggle />
          <div className="flex items-center gap-1.5">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-md border-2 border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden />
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-md border-2 border-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
              aria-label="Settings"
            >
              <Settings className="size-4" aria-hidden />
            </Link>
            <form action={logout}>
              <Button type="submit" variant="secondary" size="icon-sm" aria-label="Log out">
                <LogOut className="size-4" aria-hidden />
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
