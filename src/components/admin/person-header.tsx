import * as React from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PersonHeaderProps = {
  name: string;
  roll: string | null;
  email: string;
  mobile: string | null;
  status: { label: string; tone: "published" | "destructive" | "pending" | "outline" } | null;
  scopeLabel: string;
  cohorts: { id: string; name: string }[];
  lastSeen: string;
  onNow: boolean;
  lecturesDone: number;
  lecturesAvailable: number;
  progressPct: number;
  flags: string[];
  isTest: boolean;
  next: { label: string; why: string };
  /** The next-step control (a link or a client button); omitted when nothing is needed. */
  nextAction?: React.ReactNode;
  /** The action rail (Message, Add to cohort, Send login link, Issue certificate). */
  actions?: React.ReactNode;
};

/**
 * Student 360 header (DI §C-8): who this is and how they're doing, at a
 * glance. Status, cohorts, last seen, progress, flags and ONE suggested next
 * step, with the action rail under it. Compact on phones: small avatar, facts
 * in two columns, actions two-by-two.
 */
export function PersonHeader(p: PersonHeaderProps) {
  return (
    <header className="space-y-4 rounded-xl border-2 border-foreground bg-card p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-foreground bg-primary font-pix text-base text-primary-foreground sm:size-14 sm:text-lg"
        >
          {p.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-h2 break-words sm:text-h1">{p.name}</h1>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-small text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">{p.roll ?? "No roll number"}</span>
            <span className="min-w-0 break-all">· {p.email}</span>
            {p.mobile ? (
              <a className="font-semibold text-link underline" href={`https://wa.me/91${p.mobile}`} target="_blank" rel="noopener noreferrer">
                · WhatsApp +91 {p.mobile}
              </a>
            ) : (
              <span>· No mobile</span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {p.status ? <Badge variant={p.status.tone}>{p.status.label}</Badge> : null}
            <span className="rounded-full border-2 border-foreground/20 px-2 py-0.5 text-caption font-semibold">{p.scopeLabel}</span>
            {p.cohorts.length ? (
              p.cohorts.map((c) => (
                <Link key={c.id} href={`/admin/cohorts/${c.id}`} className="rounded-full border-2 border-foreground px-2 py-0.5 text-caption font-semibold hover:bg-accent">
                  {c.name}
                </Link>
              ))
            ) : (
              <span className="rounded-full border-2 border-dashed border-foreground/40 px-2 py-0.5 text-caption font-semibold">No cohort</span>
            )}
            {p.isTest ? <Badge variant="pending">Test account</Badge> : null}
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t-2 border-foreground/10 pt-3 sm:grid-cols-3">
        <div className="min-w-0">
          <dt className="text-caption text-muted-foreground">Last seen</dt>
          <dd className="text-small font-semibold">
            {p.onNow ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2 rounded-full bg-status-success-fg" /> On VIBHA now
              </span>
            ) : (
              p.lastSeen
            )}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption text-muted-foreground">Progress</dt>
          <dd className="text-small font-semibold tabular-nums">
            {p.lecturesAvailable ? `${p.lecturesDone} of ${p.lecturesAvailable} lectures (${p.progressPct}%)` : "No lectures open yet"}
            {p.lecturesAvailable ? (
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                <span className="block h-full bg-link" style={{ width: `${p.progressPct}%` }} />
              </span>
            ) : null}
          </dd>
        </div>
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <dt className="text-caption text-muted-foreground">Flags</dt>
          <dd className="mt-0.5 flex flex-wrap gap-1">
            {p.flags.length ? (
              p.flags.map((f) => (
                <span key={f} className="rounded-full bg-status-pending-bg px-2 py-0.5 text-caption font-semibold text-status-pending-fg">
                  {f}
                </span>
              ))
            ) : (
              <span className="text-small font-semibold">None</span>
            )}
          </dd>
        </div>
      </dl>

      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border-2 p-3 sm:flex-row sm:items-center sm:justify-between",
          p.nextAction ? "border-foreground bg-secondary" : "border-foreground/20",
        )}
      >
        <p className="flex min-w-0 items-start gap-2 text-small">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-link" aria-hidden />
          <span>
            <span className="font-semibold">Next step: {p.next.label}.</span> <span className="text-muted-foreground">{p.next.why}</span>
          </span>
        </p>
        {p.nextAction ? <div className="shrink-0">{p.nextAction}</div> : null}
      </div>

      {p.actions}
    </header>
  );
}

/** A next-step link styled as the primary button. */
export function NextStepLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border-2 border-foreground bg-primary px-4 text-sm font-bold text-primary-foreground hard-shadow-xs pointer-coarse:min-h-11"
    >
      {children} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}
