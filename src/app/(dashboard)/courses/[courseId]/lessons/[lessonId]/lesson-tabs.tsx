"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, Paperclip } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Lesson tab bar — Watch / Materials / Assignment.
 *
 * URL-driven (`?tab=`) so tabs are linkable and survive refresh, back and
 * forward. Rendered as link-anchored buttons so they work as Server-Component
 * navigation (no client-side tab state to desync).
 *
 * The bar is hidden entirely when a lesson has no materials and no assignment
 * (a plain video lesson looks exactly like it did before this feature).
 */
export function LessonTabs({
  courseId,
  lessonId,
  tab,
  hasMaterials,
  hasAssignment,
}: {
  courseId: string;
  lessonId: string;
  tab: "watch" | "materials" | "assignment";
  hasMaterials: boolean;
  hasAssignment: boolean;
}) {
  const searchParams = useSearchParams();
  const base = `/courses/${courseId}/lessons/${lessonId}`;
  const reduce = useReducedMotion();

  const tabs: { id: "watch" | "materials" | "assignment"; label: React.ReactNode }[] = [
    { id: "watch", label: "Watch" },
  ];
  if (hasMaterials) {
    tabs.push({ id: "materials", label: <span className="inline-flex items-center gap-1.5"><Paperclip className="size-3.5" aria-hidden />Materials</span> });
  }
  if (hasAssignment) {
    tabs.push({ id: "assignment", label: <span className="inline-flex items-center gap-1.5"><FileText className="size-3.5" aria-hidden />Assignment</span> });
  }

  if (tabs.length <= 1) {
    // Plain video lesson — no tab bar at all.
    return null;
  }

  function hrefFor(id: "watch" | "materials" | "assignment") {
    if (id === "watch") return base;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    return `${base}?${params.toString()}`;
  }

  return (
    <div
      role="group"
      aria-label="Lesson sections"
      className="flex w-full items-stretch overflow-hidden rounded-md border-2 border-foreground bg-background hard-shadow-sm lg:inline-flex lg:w-auto"
    >
      {tabs.map((t) => {
        const isActive = tab === t.id;
        return (
          <Link
            key={t.id}
            href={hrefFor(t.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative inline-flex h-11 items-center justify-center gap-1.5 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 lg:h-9",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="lesson-tabs-active"
                aria-hidden
                className="absolute inset-0 bg-primary"
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
