"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, LogOut, Moon, Settings, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/actions";

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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Your account"
            className="rounded-full outline-none transition-transform duration-fast ease-snappy hover:-rotate-6 hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-95"
          >
            <Avatar email={email} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-xl border-2 border-foreground p-1.5 hard-shadow-md">
          <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
            <Avatar email={email} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{email ?? "Signed in"}</span>
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
