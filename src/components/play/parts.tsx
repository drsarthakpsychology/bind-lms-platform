import * as React from "react";
import { BackLink } from "@/components/ds";
import { cn } from "@/lib/utils";

/** The gap between the parts of a tool's page (32px phone, 48px desktop). */
export function PlayStack({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex min-w-0 flex-col gap-[var(--ds-section)]", className)}>{children}</div>;
}

/** Back, the page's one H1 and a quiet line under it, close together. */
export function ListHead({ back, title, lead, tag }: { back: { href: string; label: string }; title: React.ReactNode; lead?: React.ReactNode; tag?: string }) {
  return (
    <header className="flex min-w-0 flex-col gap-1">
      <BackLink href={back.href}>{back.label}</BackLink>
      {tag ? <p className="type-pix text-link [overflow-wrap:anywhere]">{tag}</p> : null}
      <h1 className="type-h1 ds-stroke [overflow-wrap:anywhere]">{title}</h1>
      {lead ? <p className="type-small text-muted-foreground">{lead}</p> : null}
    </header>
  );
}
