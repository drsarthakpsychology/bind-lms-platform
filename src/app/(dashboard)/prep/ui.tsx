import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { PREP_EXAMS, PREP_SHORT, PREP_TITLE } from "@/lib/prep/catalog";
import type { Stats } from "@/lib/prep/progress";
import { cn } from "@/lib/utils";
import { ToolHeader } from "@/components/help/tool-header";

export { btn, btnInk, btnPlain, btnPrimary } from "@/app/(dashboard)/study/map/ui";

/** "← Exam Prep" back link, 44 px tall. */
export function BackToPrep({ href = "/prep", label = PREP_SHORT }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-link hover:underline">
      <ArrowLeft className="size-4 shrink-0" aria-hidden /> <span className="min-w-0 truncate">{label}</span>
    </Link>
  );
}

/** The section's name with a help button, and the exams it prepares for as one plain line. */
export function PrepHero({ children }: { children?: React.ReactNode }) {
  return (
    <header className="space-y-3">
      <ToolHeader
        title={PREP_TITLE}
        tip={{
          id: "prep",
          steps: ["Pick a subject, then a topic.", "Save any question to see it again."],
        }}
      />
      <p className="text-sm font-semibold text-muted-foreground">{PREP_EXAMS.join(" · ")}</p>
      {children}
    </header>
  );
}

/** Page frame shared by every prep screen. */
export function PrepFrame({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <div className={cn("mx-auto w-full min-w-0 space-y-6 px-4 py-6 sm:px-6 lg:py-10", wide ? "max-w-6xl" : "max-w-2xl")}>{children}</div>;
}

export const card = "rounded-md border-2 border-foreground bg-card p-5";

/**
 * A bank size worth showing: "600+ questions" for a large bank, nothing for a
 * small one, so a list never makes the bank look thin.
 */
export function bigCount(n: number, noun: string): string | undefined {
  if (n < 100) return undefined;
  const step = n >= 1000 ? 500 : 100;
  return `${Math.floor(n / step) * step}+ ${noun}`;
}

/** "72% right" or "New", as words (never a bar alone). */
export function pctText(s: Stats): string {
  return s.pct === null ? "New" : `${s.pct}% right`;
}

/** A thin meter for how much of a topic is done. Decorative: the numbers are in the text beside it. */
export function DoneMeter({ stats, className }: { stats: Stats; className?: string }) {
  const done = stats.total ? stats.answered / stats.total : 0;
  return (
    <span className={cn("block h-2 overflow-hidden rounded-full border-2 border-foreground bg-card", className)} aria-hidden>
      <span className="block h-full origin-left bg-brand" style={{ transform: `scaleX(${done})` }} />
    </span>
  );
}

/** One tappable row in a list: title, a short line under it, the score on the right. */
export function ListRow({ href, title, sub, side, tag, stats }: { href: string; title: string; sub?: string; side?: string; tag?: string; stats?: Stats }) {
  return (
    <Link
      href={href}
      className="flex min-h-14 items-center gap-3 rounded-md border-2 border-foreground bg-card px-4 py-3 transition-transform duration-150 hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="min-w-0 font-semibold leading-snug [overflow-wrap:anywhere]">{title}</span>
          {tag ? <span className="shrink-0 rounded-full border-2 border-dashed border-foreground/60 px-2 py-0.5 text-xs font-bold text-muted-foreground">{tag}</span> : null}
        </span>
        {sub ? <span className="mt-0.5 block text-sm text-muted-foreground">{sub}</span> : null}
        {stats && stats.answered ? <DoneMeter stats={stats} className="mt-2 max-w-48" /> : null}
      </span>
      {side ? <span className="shrink-0 text-right font-mono text-sm font-bold">{side}</span> : null}
      <ChevronRight className="size-5 shrink-0" aria-hidden />
    </Link>
  );
}
