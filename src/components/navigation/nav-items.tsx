"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Inbox, Mail, Wrench, Pill, Stethoscope, Mic, NotebookPen, MessageSquare, Gauge, HeartPulse, ClipboardCheck, ClipboardList, Radar, IdCard, Languages, ToggleLeft, Target, Layers, Flag, ShieldCheck, FileCheck, ListFilter, Activity, Copyright, type LucideIcon } from "lucide-react";
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
  mail: Mail,
  wrench: Wrench,
  pill: Pill,
  stethoscope: Stethoscope,
  mic: Mic,
  notebook: NotebookPen,
  wall: MessageSquare,
  gauge: Gauge,
  heartPulse: HeartPulse,
  clipboardCheck: ClipboardCheck,
  flag: Flag,
  toggle: ToggleLeft,
  target: Target,
  layers: Layers,
  shieldCheck: ShieldCheck,
  copyright: Copyright,
  radar: Radar,
  clipboardList: ClipboardList,
  idCard: IdCard,
  languages: Languages,
  fileCheck: FileCheck,
  listFilter: ListFilter,
  activity: Activity,
};

export type NavItem = {
  href: string;
  label: string;
  /** Key into NAV_ICONS (serializable string, not a function). */
  icon: keyof typeof NAV_ICONS | string;
  exact?: boolean;
  /** Optional section label — rendered as a group header the first time it appears. */
  section?: string;
};

/**
 * Renders nav items with active-state detection. Receives already-authorized
 * items — role/security decisions live in the server layout, not here.
 * A `section` on an item renders an eyebrow group header above the first item
 * of that group, chunking long nav lists into scannable sections.
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

  // Precompute section headers without mutating any value during render: an
  // item opens a section when it carries a `section` different from the item
  // before it. Pure, so the render stays deterministic.
  const rows = items.map((item, i) => ({
    item,
    showHeader: item.section !== undefined && item.section !== items[i - 1]?.section,
  }));

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", className)}>
      {rows.map(({ item, showHeader }) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
        return (
          <React.Fragment key={item.href}>
            {showHeader ? (
              <p className="mt-3 mb-0.5 px-3 text-eyebrow text-muted-foreground">
                {item.section}
              </p>
            ) : null}
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border-2 border-transparent px-3 py-2 text-small font-medium transition-[color,background-color,box-shadow,transform] duration-fast ease-snappy",
                active
                  ? "border-foreground bg-primary text-primary-foreground hard-shadow-flat"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground active:translate-y-px"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
