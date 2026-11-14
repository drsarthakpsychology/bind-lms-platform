"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, LogOut, Settings } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavItems, type NavItem } from "@/components/navigation/nav-items";
import { Avatar } from "@/components/navigation/account-menu";
import { OPEN_NAV_EVENT } from "@/components/navigation/sidebar-state";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { MiddleTruncate } from "@/components/ui/middle-truncate";
import { cn } from "@/lib/utils";

/**
 * Phone "More" drawer: opened by the More tab in the bottom bar (the
 * Instagram/YouTube pattern). Holds every destination, your account, the
 * light/dark switch and log out. Focus is trapped and Escape closes it
 * (Radix Sheet).
 */
export function MobileNav({
  items,
  viewModeSwitch,
  email,
  role,
  showSettings,
}: {
  items: NavItem[];
  viewModeSwitch?: React.ReactNode;
  email: string | null;
  role: string;
  showSettings: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_NAV_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_NAV_EVENT, onOpen);
  }, []);

  const close = () => setOpen(false);
  // Phones open it from the More tab at the bottom, so it rises from the
  // bottom (thumb reach); tablets open it from ☰ at the top left.
  const phone = React.useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(max-width: 767px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
  const row =
    "flex min-h-12 items-center gap-3 rounded-xl border-2 border-transparent px-3 text-sm font-bold transition-colors hover:border-foreground hover:bg-card";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={phone ? "bottom" : "left"}
        className={cn(
          "gap-0 p-0",
          phone ? "max-h-[88dvh] overflow-hidden rounded-t-lg border-t-2 border-foreground" : "w-[min(20rem,88vw)] border-r-2 border-foreground",
        )}
      >
        <SheetHeader className={cn("border-b-2 border-foreground bg-brand px-4 pr-14 pb-4 text-brand-foreground", phone ? "pt-4" : "pt-[max(1rem,env(safe-area-inset-top))]")}>
          <SheetTitle className="flex items-center gap-3 text-brand-foreground">
            <Avatar email={email} />
            <span className="min-w-0">
              <MiddleTruncate text={email ?? "Signed in"} className="text-sm font-bold" />
              <span className="block text-caption font-medium capitalize opacity-85">{role}</span>
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">Menu and account</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-4">
          <NavItems items={items} onNavigate={close} />
          <div className="my-4 h-0.5 bg-line" aria-hidden />
          <Link href="/notifications" onClick={close} className={row}>
            <Bell className="size-5" aria-hidden /> Notifications
          </Link>
          {showSettings ? (
            <Link href="/settings" onClick={close} className={row}>
              <Settings className="size-5" aria-hidden /> Settings
            </Link>
          ) : null}
          {viewModeSwitch ? <div className="mt-3 px-1">{viewModeSwitch}</div> : null}
        </div>
        <div className="flex items-center justify-between gap-2 border-t-2 border-foreground px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <ThemeToggle />
          <form action={logout}>
            <Button type="submit" variant="danger" size="sm" className="h-11">
              <LogOut className="size-4" aria-hidden /> Log out
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
