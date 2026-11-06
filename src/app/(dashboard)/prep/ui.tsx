import Link from "next/link";
import { ArrowLeft, BadgeCheck, Circle, Sprout, TriangleAlert, type LucideIcon } from "lucide-react";
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

/** "← Prep" back link, 44 px tall. */
export function BackToPrep({ href = "/prep", label = "Prep" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link hover:underline">
      <ArrowLeft className="size-4" aria-hidden /> {label}
    </Link>
  );
}

/** Page frame shared by every prep screen. */
export function PrepFrame({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={cn("mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:py-10", wide ? "max-w-6xl" : "max-w-2xl")}>{children}</div>;
}

export const card = "rounded-md border-2 border-foreground bg-card p-5";
