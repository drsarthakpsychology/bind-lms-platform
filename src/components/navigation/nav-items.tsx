"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Play, LayoutDashboard, Users, BookOpen, Inbox, Mail, Wrench, Pill, Stethoscope, Mic, NotebookPen, MessageSquare, Gauge, HeartPulse, ClipboardCheck, ClipboardList, Radar, IdCard, Languages, ToggleLeft, Target, Layers, Flag, ShieldCheck, FileCheck, ListFilter, Activity, Copyright, Sparkles, Sun, Gamepad2, Trophy, Route, MessageCircleQuestion, KeyRound, Award, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icon name → component map. Icon components are functions, so they can't be
 * serialized across the Server→Client boundary as props. Instead the config
 * carries a plain string name, and the component is looked up here — inside
 * the client module graph — where functions are allowed.
 */
export const NAV_ICONS: Record<string, LucideIcon> = {
  home: Home,
  gamepad: Gamepad2,
  play: Play,
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
  sparkles: Sparkles,
  sun: Sun,
  listFilter: ListFilter,
  activity: Activity,
  trophy: Trophy,
  route: Route,
  doubt: MessageCircleQuestion,
  key: KeyRound,
  award: Award,
};

export type NavItem = {
  href: string;
  label: string;
  /** Key into NAV_ICONS (serializable string, not a function). */
  icon: keyof typeof NAV_ICONS | string;
  exact?: boolean;
  /** Optional section label — rendered as a group header the first time it appears. */
  section?: string;
  /** Extra path prefixes that also make this item active (admin sections). */
  match?: string[];
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

  // An item opens a section when it carries a `section` different from the
  // item before it. Pure, so the render stays deterministic.
  const rows = items.map((item, i) => ({
    item,
    showHeader: item.section !== undefined && item.section !== items[i - 1]?.section,
  }));

  return (
    <nav aria-label="Primary" className={cn("flex flex-col gap-1", className)}>
      {rows.map(({ item, showHeader }) => {
        const under = (h: string) => pathname === h || pathname.startsWith(`${h}/`);
        // A deeper item (e.g. /practice/medicines) wins over its parent (/practice).
        const deeper = items.some((o) => o.href !== item.href && o.href.startsWith(`${item.href}/`) && under(o.href));
        const active = item.exact
          ? pathname === item.href
          : (under(item.href) && !deeper) || (item.match ?? []).some(under);
        const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
        return (
          <React.Fragment key={item.href}>
            {showHeader ? (
              <p className="nav-section mt-4 mb-1 px-3 text-eyebrow text-muted-foreground">
                {item.section}
              </p>
            ) : null}
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={item.label}
              className={cn(
                "nav-link group/nav flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-[color,background-color,box-shadow,transform] duration-fast ease-snappy",
                active
                  ? "border-foreground bg-brand text-brand-foreground hard-shadow-xs"
                  : "border-transparent text-foreground/80 hover:border-foreground hover:bg-card hover:text-foreground hover:hard-shadow-xs active:translate-y-px active:shadow-none"
              )}
            >
              <Icon
                className="nav-icon size-5 shrink-0 transition-transform duration-fast ease-snappy group-hover/nav:-rotate-6 group-hover/nav:scale-110"
                aria-hidden
              />
              <span className="nav-label min-w-0 truncate">{item.label}</span>
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
