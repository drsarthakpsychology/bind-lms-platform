"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, Paperclip } from "lucide-react";
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
      className="inline-flex items-stretch overflow-hidden rounded-md border-2 border-foreground bg-background hard-shadow-sm"
    >
      {tabs.map((t) => {
        const isActive = tab === t.id;
        return (
          <Link
            key={t.id}
            href={hrefFor(t.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 px-3 text-sm font-semibold transition-[background-color,color] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
