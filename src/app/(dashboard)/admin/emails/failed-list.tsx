"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { retryFailedEmails, type RetryReport } from "./retry-actions";
import { ClearFailedButton } from "./mail-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FailedItem = {
  id: string;
  recipient: string;
  name: string | null;
  subject: string;
  kindLabel: string;
  reason: string;
  reasonKind: string;
  retryNow: boolean;
  attempts: number;
  lastTry: string;
  canResend: boolean;
};

function summary(r: RetryReport): string {
  if (r.error) return r.error;
  if (r.previewBlocked) return "This is a preview site, so nothing was sent (it only emails the test address). Retry from the live site.";
  const parts = [`Sent ${r.sent}`];
  if (r.failed) parts.push(`failed again ${r.failed}`);
  if (r.alreadyDelivered) parts.push(`${r.alreadyDelivered} already had it (not re-sent)`);
  if (r.duplicates) parts.push(`${r.duplicates} duplicates merged`);
  if (r.noCopy) parts.push(`${r.noCopy} have no saved copy: write them again`);
  if (r.notRetryable) parts.push(`${r.notRetryable} need the address fixed`);
  let s = parts.join(" · ") + ".";
  if (r.stoppedForQuota) s += " Stopped: the daily sending limit was reached. Try again tomorrow.";
  else if (r.left) s += ` ${r.left} still to go: press Retry again.`;
  return s;
}

/**
 * Mail → Failed. Why each email failed in plain words, how many times it was
 * tried, and Retry for one, the ticked ones, or all. Retries are paced and
 * never send the same email to the same person twice (see retry-actions.ts).
 */
export function FailedList({ items, canWrite }: { items: FailedItem[]; canWrite: boolean }) {
  const router = useRouter();
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ ok: boolean; text: string } | null>(null);

  const groups = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const i of items) m.set(i.reasonKind, (m.get(i.reasonKind) ?? 0) + 1);
    return m;
  }, [items]);

  async function run(ids: string[] | null, key: string) {
    if (busy) return;
    setBusy(key);
    setResult(null);
    const r = await retryFailedEmails(ids);
    setBusy(null);
    setResult({ ok: !r.error && r.failed === 0, text: summary(r) });
    setPicked(new Set());
    router.refresh();
  }

  const all = picked.size === items.length && items.length > 0;
  const toggle = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  if (!items.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-8 text-center">
        <CheckCircle2 className="size-10 text-link" aria-hidden />
        <p className="text-sm font-bold">Nothing failed. Every email went out.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-h1">Failed emails</h1>
        <p className="text-small text-muted-foreground">
          {items.length} email{items.length === 1 ? "" : "s"} didn&apos;t go out. Retrying is safe: nobody gets the same email twice, and sends go out slowly so the provider doesn&apos;t block them.
        </p>
      </header>

      <ul className="flex flex-wrap gap-2" aria-label="Why they failed">
        {[...groups.entries()].map(([k, n]) => {
          const sample = items.find((i) => i.reasonKind === k)!;
          return (
            <li key={k} className="rounded-xl border-2 border-foreground/15 bg-card px-3 py-2 text-caption">
              <span className="font-pix text-sm">{n}</span> <span className="font-semibold">{sample.reason.split(".")[0]}</span>
            </li>
          );
        })}
      </ul>

      {canWrite ? (
        <div className="z-10 flex lg:sticky lg:top-[var(--top-h)] flex-wrap items-center gap-2 rounded-2xl border-2 border-foreground bg-background/95 p-2 backdrop-blur">
          <label className="flex h-9 items-center gap-2 px-2 text-sm font-semibold">
            <input type="checkbox" className="size-4 accent-primary" checked={all} onChange={() => setPicked(all ? new Set() : new Set(items.map((i) => i.id)))} aria-label="Tick all" />
            {picked.size ? `${picked.size} ticked` : "Tick all"}
          </label>
          <Button size="sm" onClick={() => run([...picked], "sel")} disabled={!picked.size || Boolean(busy)}>
            {busy === "sel" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RefreshCw className="size-4" aria-hidden />}
            Retry ticked
          </Button>
          <Button size="sm" variant="secondary" onClick={() => run(null, "all")} disabled={Boolean(busy)}>
            {busy === "all" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RefreshCw className="size-4" aria-hidden />}
            Retry all
          </Button>
          <span className="ml-auto">
            <ClearFailedButton count={items.length} />
          </span>
        </div>
      ) : null}

      {result ? (
        <p role="status" className={cn("rounded-xl border-2 p-3 text-sm font-semibold", result.ok ? "border-foreground bg-status-success-bg" : "border-destructive bg-status-alert-bg text-status-alert-fg")}>
          {result.text}
        </p>
      ) : null}

      <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
        {items.map((i) => (
          <li key={i.id} className="flex items-start gap-3 px-3 py-3 sm:px-4">
            {canWrite ? (
              <input type="checkbox" className="mt-1 size-4 shrink-0 accent-primary" checked={picked.has(i.id)} onChange={() => toggle(i.id)} aria-label={`Tick ${i.recipient}`} />
            ) : null}
            <div className="min-w-0 flex-1 space-y-1">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <Link href={`/admin/emails?folder=failed&id=${i.id}`} className="truncate text-sm font-bold underline-offset-4 hover:underline">
                  {i.name || i.recipient}
                </Link>
                <span className="truncate text-caption text-muted-foreground">{i.name ? i.recipient : null}</span>
              </p>
              <p className="truncate text-sm">
                <span className="mr-1.5 inline-flex h-5 items-center rounded-full border-2 border-foreground/30 px-1.5 text-[0.65rem] font-bold">{i.kindLabel}</span>
                {i.subject}
              </p>
              <p className="flex items-start gap-1.5 text-caption text-status-alert-fg">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>{i.reason}</span>
              </p>
              <p className="text-caption text-muted-foreground">
                Tried {i.attempts} time{i.attempts === 1 ? "" : "s"} · last {i.lastTry}
                {!i.canResend ? " · no saved copy, write it again from Compose" : ""}
              </p>
            </div>
            {canWrite ? (
              <Button size="sm" variant="outline" className="shrink-0" onClick={() => run([i.id], i.id)} disabled={Boolean(busy) || !i.retryNow || !i.canResend}>
                {busy === i.id ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <RefreshCw className="size-4" aria-hidden />}
                <span className="hidden sm:inline">Retry</span>
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
