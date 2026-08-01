"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Inbox, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icon name → component map. Icon components are functions, so they can't be
 * serialized across the Server→Client boundary as props. Instead the config
 * carries a plain string name, and the component is looked up here — inside
 * the client module graph — where functions are allowed.
 */
export const NAV_ICONS: Record<string, LucideIcon> = {
  layoutDashboard: LayoutDashboard,
  users: Users,
  bookOpen: BookOpen,
  inbox: Inbox,
  wrench: Wrench,
};

export type NavItem = {
  href: string;
  label: string;
  /** Key into NAV_ICONS (serializable string, not a function). */
  icon: keyof typeof NAV_ICONS | string;
  exact?: boolean;
};

/**
 * Renders nav items with active-state detection. Receives already-authorized
 * items — role/security decisions live in the server layout, not here.
 */
export function NavItems({
  items,
  onNavigate,
  className,
}: {
  items: NavItem[];
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-small font-medium transition-[color,background-color,box-shadow,transform]",
              active
                ? "border-foreground bg-primary text-primary-foreground hard-shadow-flat"
                : "text-muted-foreground hover:bg-accent hover:text-foreground active:translate-y-px"
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
