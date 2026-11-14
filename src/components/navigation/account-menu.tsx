"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, LogOut, Moon, Settings, Smile, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/actions";
import { MiddleTruncate } from "@/components/ui/middle-truncate";
import { useReactionsOn } from "@/components/reactions/use-reaction";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";

/** Initial for the avatar: first letter of the email (no fake names). */
export function initialOf(email: string | null | undefined) {
  return (email?.trim()[0] ?? "V").toUpperCase();
}

export function Avatar({ email, className }: { email: string | null; className?: string }) {
  return (
    <span
      aria-hidden
      className={
        "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary font-pix text-sm text-primary-foreground " +
        (className ?? "")
      }
    >
      {initialOf(email)}
    </span>
  );
}

/**
 * Avatar button → account menu (top right, like every big app): who you're
 * signed in as, settings, notifications, light/dark, log out.
 */
export function AccountMenu({
  email,
  role,
  showSettings,
}: {
  email: string | null;
  role: string;
  showSettings: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const formRef = React.useRef<HTMLFormElement>(null);
  const [funny, setFunny] = useReactionsOn();
  const [sheet, setSheet] = React.useState(false);
  const row =
    "flex min-h-12 w-full items-center gap-3 rounded-md border-2 border-foreground bg-card px-3 text-left font-semibold active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";

  return (
    <>
      {/* Phones: the account opens as a bottom sheet with big rows, not a small menu in the corner. */}
      <button
        type="button"
        aria-label="Your account"
        aria-haspopup="dialog"
        onClick={() => setSheet(true)}
        className="grid size-11 shrink-0 place-items-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-95 md:hidden"
      >
        <Avatar email={email} />
      </button>
      <MobileBottomSheet open={sheet} onOpenChange={setSheet} title="Your account">
        <div className="flex items-center gap-3 pb-3">
          <Avatar email={email} />
          <span className="min-w-0">
            <MiddleTruncate text={email ?? "Signed in"} className="text-sm font-bold" />
            <span className="block text-caption capitalize text-muted-foreground">{role}</span>
          </span>
        </div>
        <div className="grid gap-2">
          <Link href="/notifications" className={row} onClick={() => setSheet(false)}>
            <Bell className="size-5" aria-hidden /> Notifications
          </Link>
          {showSettings ? (
            <Link href="/settings" className={row} onClick={() => setSheet(false)}>
              <Settings className="size-5" aria-hidden /> Settings
            </Link>
          ) : null}
          <button type="button" className={row} onClick={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          {role === "student" ? (
            <button type="button" role="switch" aria-checked={funny} className={row} onClick={() => setFunny(!funny)}>
              <Smile className="size-5" aria-hidden />
              <span className="flex-1">Funny reactions</span>
              <span className="font-mono text-xs font-bold uppercase text-muted-foreground">{funny ? "On" : "Off"}</span>
            </button>
          ) : null}
          <button type="button" className={row + " mt-2 text-destructive"} onClick={() => formRef.current?.requestSubmit()}>
            <LogOut className="size-5" aria-hidden /> Log out
          </button>
        </div>
      </MobileBottomSheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Your account"
            className="hidden size-10 shrink-0 place-items-center rounded-full outline-none md:grid transition-transform duration-fast ease-snappy hover:-rotate-6 hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-95 pointer-coarse:size-11"
          >
            <Avatar email={email} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-xl border-2 border-foreground p-1.5 hard-shadow-md">
          <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
            <Avatar email={email} />
            <span className="min-w-0">
              <MiddleTruncate text={email ?? "Signed in"} className="text-sm font-bold" />
              <span className="block text-caption capitalize text-muted-foreground">{role}</span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="min-h-10 cursor-pointer rounded-lg font-semibold">
            <Link href="/notifications">
              <Bell className="size-4" aria-hidden /> Notifications
            </Link>
          </DropdownMenuItem>
          {showSettings ? (
            <DropdownMenuItem asChild className="min-h-10 cursor-pointer rounded-lg font-semibold">
              <Link href="/settings">
                <Settings className="size-4" aria-hidden /> Settings
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            className="min-h-10 cursor-pointer rounded-lg font-semibold"
            onSelect={(e) => {
              e.preventDefault();
              setTheme(isDark ? "light" : "dark");
            }}
          >
            {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
            {isDark ? "Light mode" : "Dark mode"}
          </DropdownMenuItem>
          {role === "student" ? (
            <DropdownMenuItem
              role="menuitemcheckbox"
              aria-checked={funny}
              className="min-h-10 cursor-pointer rounded-lg font-semibold"
              onSelect={(e) => {
                e.preventDefault();
                setFunny(!funny);
              }}
            >
              <Smile className="size-4" aria-hidden />
              <span className="flex-1">Funny reactions</span>
              <span className="font-mono text-xs font-bold uppercase text-muted-foreground">{funny ? "On" : "Off"}</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="min-h-10 cursor-pointer rounded-lg font-semibold text-destructive focus:text-destructive"
            onSelect={() => formRef.current?.requestSubmit()}
          >
            <LogOut className="size-4" aria-hidden /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <form ref={formRef} action={logout} className="hidden" aria-hidden />
    </>
  );
}
