"use client";

import * as React from "react";
import { ChevronDown, Lock, Stethoscope, Brain, Layers, Timer, BookOpen, BookMarked, Scale, Users, CircleCheck, Gauge, Search, MessageSquare, Siren, GraduationCap, Wand2, Repeat, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileListItem } from "@/components/mobile/mobile-list-item";

/** Icon name → component map (functions can't cross the Server→Client
 *  boundary, so the page passes plain string names — same pattern as the
 *  sidebar nav). */
export const PRACTICE_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  brain: Brain,
  layers: Layers,
  timer: Timer,
  bookOpen: BookOpen,
  bookMarked: BookMarked,
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
  locked?: boolean; // flag is "live" — section visible but not yet unlocked
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

/** Flagship "core" tools — curated full workflows, set apart visually from the
 *  single-skill drills. Matched by href (server passes href, not a flag). */
const CORE_TOOLS = new Set([
  "/practice/consulting-room",
  "/practice/mse",
  "/practice/formulation",
]);

const OPEN_KEY = "practice:group-open";

/**
 * The /practice list, grouped by session length (casebook Axis 5) with
 * collapsible sections whose open/closed state is remembered per user in
 * localStorage. Default: the "Under 5 minutes" group open (the most common
 * "how long have I got" answer), everything else collapsed.
 *
 * Mobile-first: each group is a quiet text header (a full-width toggle, not a
 * bordered box) and each tool is a single tappable `MobileListItem` — icon
 * tile + two-line title + one meta line + state chip. No card-inside-card.
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
    <div className="space-y-6">
      {groups.map((group) => {
        const isOpen = open.has(group.id);
        return (
          <section key={group.id} aria-label={group.label}>
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={isOpen}
              aria-controls={`practice-group-${group.id}`}
              className="flex w-full min-h-12 items-center justify-between gap-3 rounded-md px-1 text-left transition-colors hover:bg-muted/40"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-h3 text-foreground">{group.label}</span>
                <span className="text-small text-muted-foreground">{group.hint}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5">
                <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-caption font-medium text-muted-foreground">
                  {group.tools.length} {group.tools.length === 1 ? "tool" : "tools"}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 text-muted-foreground transition-transform duration-fast ease-snappy",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </span>
            </button>

            {isOpen ? (
              <div id={`practice-group-${group.id}`} className="mt-1 space-y-1">
                {group.tools.map((tool) => {
                  const Icon = PRACTICE_ICONS[tool.icon] ?? CircleCheck;
                  const chip = tool.state ? STATE_STYLE[tool.state] : null;
                  const dimmed = tool.state === "done_today";
                  const locked = tool.locked === true;
                  const isCore = CORE_TOOLS.has(tool.href);
                  const meta = [tool.time, tool.description, tool.progress]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <MobileListItem
                      key={tool.href}
                      href={tool.href}
                      leading={
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-9 items-center justify-center rounded-md border-2",
                            isCore
                              ? "border-foreground bg-primary text-primary-foreground"
                              : "border-border bg-secondary text-link",
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                      }
                      title={tool.title}
                      subtitle={meta}
                      trailing={
                        locked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-caption font-medium text-muted-foreground">
                            <Lock className="size-3" aria-hidden />
                            Yet to be live
                          </span>
                        ) : chip ? (
                          <span className={cn("rounded-full px-2 py-0.5 text-caption font-medium", chip.className)}>
                            {chip.label}
                          </span>
                        ) : undefined
                      }
                      className={cn(dimmed && "opacity-60", locked && "opacity-70")}
                    />
                  );
                })}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
