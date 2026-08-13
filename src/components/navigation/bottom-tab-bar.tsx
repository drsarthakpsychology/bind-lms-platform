"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Stethoscope, NotebookPen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/dashboard", label: "Courses", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Stethoscope },
  { href: "/reflect", label: "Journal", icon: NotebookPen },
  { href: "/wall", label: "Wall", icon: MessageSquare },
];

/**
 * Mobile bottom tab bar (v5.1 Part B3) — thumb reach. Desktop keeps the
 * sidebar; this renders on small screens only. One tap per tab, active state.
 */
export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-card lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-around">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.href === "/today"
            ? pathname === "/today"
            : pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-caption transition-colors duration-fast ease-snappy",
                active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
