import Link from "next/link";
import { ArrowLeft, BadgeCheck, Circle, Sprout, TriangleAlert, type LucideIcon } from "lucide-react";
import { PREP_EXAMS, PREP_SHORT, PREP_TITLE } from "@/lib/prep/catalog";
import { STATUS_LABEL, type TopicStatus } from "@/lib/prep/plan";
import { cn } from "@/lib/utils";

export { btn, btnInk, btnPlain, btnPrimary } from "@/app/(dashboard)/study/map/ui";

const STATUS_ICON: Record<TopicStatus, LucideIcon> = { new: Circle, weak: TriangleAlert, building: Sprout, strong: BadgeCheck };
const STATUS_TONE: Record<TopicStatus, string> = {
  new: "border-dashed border-foreground/50 bg-card text-muted-foreground",
  weak: "border-foreground bg-status-alert-bg text-status-alert-fg",
  building: "border-foreground bg-status-info-bg text-status-info-fg",
  strong: "border-foreground bg-status-success-bg text-status-success-fg",
};

/** Status tag (pill = is): icon + word. */
export function StatusTag({ status, className }: { status: TopicStatus; className?: string }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-2 py-0.5 text-xs font-bold", STATUS_TONE[status], className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

/** "← Exam Prep" back link, 44 px tall. */
export function BackToPrep({ href = "/prep", label = PREP_SHORT }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link hover:underline">
      <ArrowLeft className="size-4" aria-hidden /> {label}
    </Link>
  );
}

/**
 * The section's name, big, with the three exams on their own line. The
 * learning is the same for all three, so the exams read as one strip, not
 * as choices.
 */
export function PrepHero({ eyebrow, children }: { eyebrow?: string; children?: React.ReactNode }) {
  return (
    <header className="space-y-3">
      {eyebrow ? (
        <p className="flex items-center gap-2 text-eyebrow text-link">
          <span className="size-2 shrink-0 rounded-[2px] bg-primary" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-h1 text-balance">{PREP_TITLE}</h1>
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border-2 border-foreground bg-secondary px-3 py-2 font-mono text-sm font-bold text-secondary-foreground hard-shadow-xs sm:text-base">
        <span className="sr-only">For </span>
        {PREP_EXAMS.map((e, i) => (
          <span key={e} className="inline-flex items-center gap-2">
            {i ? (
              <span aria-hidden className="text-link">
                ·
              </span>
            ) : null}
            {i === PREP_EXAMS.length - 1 ? <span className="sr-only">and </span> : null}
            <span>{e}</span>
          </span>
        ))}
      </p>
      {children}
    </header>
  );
}

/** Page frame shared by every prep screen. */
export function PrepFrame({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={cn("mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:py-10", wide ? "max-w-6xl" : "max-w-2xl")}>{children}</div>;
}

export const card = "rounded-md border-2 border-foreground bg-card p-5";
