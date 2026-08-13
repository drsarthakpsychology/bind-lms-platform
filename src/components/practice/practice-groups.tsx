"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Stethoscope, Brain, Layers, Timer, BookOpen, Scale, Users, CircleCheck, Gauge, Search, MessageSquare, Siren, GraduationCap, Wand2, Repeat, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { cardVariants } from "@/components/ui/card";

/** Icon name → component map (functions can't cross the Server→Client
 *  boundary, so the page passes plain string names — same pattern as the
 *  sidebar nav). */
export const PRACTICE_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  brain: Brain,
  layers: Layers,
  timer: Timer,
  bookOpen: BookOpen,
  scale: Scale,
  users: Users,
  circleCheck: CircleCheck,
  gauge: Gauge,
  search: Search,
  messageSquare: MessageSquare,
  siren: Siren,
  graduationCap: GraduationCap,
  wand2: Wand2,
  repeat: Repeat,
};

/** A practice card's data (serializable — passed over the Server→Client boundary). */
export interface PracticeCardData {
  href: string;
  title: string;
  verb: string;
  description: string;
  time: string;
  icon: string; // key into PRACTICE_ICONS
  state?: string; // "new" | "in_progress" | "done_today" | "due"
  progress?: string;
}

export interface PracticeGroup {
  id: string;
  label: string;
  hint: string;
  tools: PracticeCardData[];
}

const STATE_STYLE: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-secondary text-muted-foreground" },
  in_progress: { label: "In progress", className: "bg-primary text-primary-foreground" },
  done_today: { label: "Done today", className: "bg-status-success-bg text-status-success-fg" },
  due: { label: "Due", className: "bg-status-pending-bg text-status-pending-fg" },
};

const OPEN_KEY = "practice:group-open";

/**
 * The /practice grid, grouped by session length (casebook Axis 5) with
 * collapsible sections whose open/closed state is remembered per user in
 * localStorage. Default: the "Under 5 minutes" group open (the most common
 * "how long have I got" answer), everything else collapsed.
 */
export function PracticeGroups({ groups }: { groups: PracticeGroup[] }) {
  const [open, setOpen] = React.useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set(["quick"]);
    try {
      const saved = JSON.parse(window.localStorage.getItem(OPEN_KEY) ?? "null");
      if (Array.isArray(saved)) return new Set(saved);
    } catch {
      /* ignore */
    }
    return new Set(["quick"]);
  });

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(OPEN_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isOpen = open.has(group.id);
        return (
          <details key={group.id} open={isOpen} className="group/row rounded-lg border-2 border-border bg-card hard-shadow-sm">
            <summary
              onClick={(e) => {
                e.preventDefault();
                toggle(group.id);
              }}
              className="flex cursor-pointer list-none items-center justify-between gap-3 p-3.5"
            >
              <span>
                <span className="text-small font-semibold">{group.label}</span>
                <span className="ml-2 text-caption text-muted-foreground">{group.hint}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground">
                  {group.tools.length}
                </span>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform group-open/row:rotate-180", isOpen && "rotate-180")} aria-hidden />
              </span>
            </summary>
            <div className="grid grid-cols-1 gap-3 border-t-2 border-border p-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool, i) => {
                const Icon = PRACTICE_ICONS[tool.icon] ?? CircleCheck;
                const chip = tool.state ? STATE_STYLE[tool.state] : null;
                const dimmed = tool.state === "done_today";
                return (
                  <Reveal key={tool.href} delay={0.15 + i * 0.05} className="h-full">
                  <Link
                    href={tool.href}
                    className={cn(
                      cardVariants({ variant: "interactive" }),
                      "group h-full gap-3 bg-background p-4",
                      dimmed && "opacity-60",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="text-caption font-semibold tracking-wide text-muted-foreground">{tool.verb}</span>
                      {chip ? (
                        <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-caption font-medium ${chip.className}`}>
                          {chip.label}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="flex items-center gap-2 text-body-strong">
                        {tool.title}
                        <span className="shrink-0 text-caption font-normal text-muted-foreground">{tool.time}</span>
                      </h3>
                      <p className="mt-1 text-small text-muted-foreground">{tool.description}</p>
                      {tool.progress ? (
                        <p className="mt-1 text-caption text-muted-foreground">{tool.progress}</p>
                      ) : null}
                    </div>
                  </Link>
                  </Reveal>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
