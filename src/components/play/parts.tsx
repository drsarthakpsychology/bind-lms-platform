import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** The gap between the parts of a tool's page (32px phone, 48px desktop). */
export function PlayStack({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex min-w-0 flex-col gap-[var(--ds-section)]", className)}>{children}</div>;
}

/** Something extra under a tool, closed until asked for: a hairline row that opens in place. */
export function Fold({ title, children, className }: { title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <details className={cn("group/fold min-w-0 border-y border-[var(--ds-hairline)]", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg type-body font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 [overflow-wrap:anywhere]">{title}</span>
        <ChevronDown aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-open/fold:rotate-180" />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

/** A quiet way back at the top of a list page: an arrow and where it goes. */
export function BackLine({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="-ml-2 inline-flex min-h-11 max-w-full items-center gap-1.5 self-start rounded-lg px-2 type-small font-semibold text-muted-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
    </Link>
  );
}

/** Back, the page's one H1 and a quiet line under it, close together. */
export function ListHead({ back, title, lead, tag }: { back: { href: string; label: string }; title: React.ReactNode; lead?: React.ReactNode; tag?: string }) {
  return (
    <header className="flex min-w-0 flex-col gap-1">
      <BackLine href={back.href} label={back.label} />
      {tag ? <p className="type-caption text-muted-foreground">{tag}</p> : null}
      <h1 className="type-h1 [overflow-wrap:anywhere]">{title}</h1>
      {lead ? <p className="type-small text-muted-foreground">{lead}</p> : null}
    </header>
  );
}
