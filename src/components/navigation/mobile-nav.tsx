"use client";

import * as React from "react";
import { Menu, LogOut } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavItems, type NavItem } from "@/components/navigation/nav-items";
import { ThemeToggle } from "@/components/theme-toggle";
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-card text-foreground transition-transform hover:bg-accent active:translate-y-0.5"
        >
          <Menu className="size-4" aria-hidden />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b-2 border-border px-4 py-3">
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
        <div className="flex items-center justify-between border-t-2 border-border p-3">
          <ThemeToggle />
          <form action={logout}>
            <button
              type="submit"
              aria-label="Log out"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-border bg-background text-foreground transition-[transform,box-shadow] hover:bg-accent active:translate-y-px"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
