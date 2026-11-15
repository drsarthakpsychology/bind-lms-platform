"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { retryFailedEmails, type RetryReport } from "./retry-actions";
import { ClearFailedButton } from "./mail-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Empty, Notice, Status, btn, nameLink, table } from "../_v2/kit";

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
export function FailedList({ items, canWrite, v2 = false }: { items: FailedItem[]; canWrite: boolean; /** Admin v2: no own title, a table on desktop, rows on phones, the action bar only while something is ticked. */ v2?: boolean }) {
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

  if (v2) {
    const tried = (i: FailedItem) => `Tried ${i.attempts} time${i.attempts === 1 ? "" : "s"} · last ${i.lastTry}${!i.canResend ? " · no saved copy, write it again from Compose" : ""}`;
    const retryOne = (i: FailedItem) =>
      canWrite ? (
        <button type="button" className={btn.quiet} onClick={() => run([i.id], i.id)} disabled={Boolean(busy) || !i.retryNow || !i.canResend} aria-label={`Retry ${i.recipient}`}>
          {busy === i.id ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
          Retry
        </button>
      ) : null;
    const tick = (i: FailedItem) => (
      <input type="checkbox" className="size-4 accent-primary" checked={picked.has(i.id)} onChange={() => toggle(i.id)} aria-label={`Tick ${i.recipient}`} />
    );
    if (!items.length) return <Empty>Nothing failed. Every email went out.</Empty>;
    return (
      <div className="flex min-w-0 flex-col gap-4">
        <p className="max-w-[72ch] type-small text-muted-foreground">
          {items.length} email{items.length === 1 ? "" : "s"} did not go out. Retrying is safe: nobody gets the same email twice, and sends go out slowly so the provider does not block them.
        </p>
        <ul className="flex min-w-0 flex-wrap gap-x-6 gap-y-1" aria-label="Why they failed">
          {[...groups.entries()].map(([k, n]) => {
            const sample = items.find((i) => i.reasonKind === k)!;
            return (
              <li key={k} className="type-small [overflow-wrap:anywhere]">
                <span className="font-semibold type-num">{n}</span> <span className="text-muted-foreground">{sample.reason.split(".")[0]}</span>
              </li>
            );
          })}
        </ul>
        {canWrite ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button type="button" className={btn.quiet} onClick={() => run(null, "all")} disabled={Boolean(busy)}>
              {busy === "all" ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
              Retry all
            </button>
            <ClearFailedButton count={items.length} />
          </div>
        ) : null}
        {result ? (
          result.ok ? (
            <p role="status" className="rounded-md bg-status-success-bg px-3 py-2.5 type-small font-semibold [overflow-wrap:anywhere]">{result.text}</p>
          ) : (
            <Notice tone="alert">{result.text}</Notice>
          )
        ) : null}

        <table className={cn(table.root, "hidden md:table")}>
          <thead>
            <tr>
              {canWrite ? (
                <th scope="col" className={cn(table.th, "w-10")}>
                  <label className="-my-2 -ml-3 grid size-11 cursor-pointer place-items-center">
                    <input type="checkbox" className="size-4 accent-primary" checked={all} onChange={() => setPicked(all ? new Set() : new Set(items.map((i) => i.id)))} aria-label="Tick all" />
                  </label>
                </th>
              ) : null}
              <th scope="col" className={table.th}>To</th>
              <th scope="col" className={table.th}>Email</th>
              <th scope="col" className={table.th}>Why it failed</th>
              {canWrite ? <th scope="col" className={table.th}><span className="sr-only">Retry</span></th> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className={table.tr} aria-selected={picked.has(i.id) || undefined}>
                {canWrite ? <td className={cn(table.td, "align-top")}><label className="-my-2.5 -ml-3 grid size-11 cursor-pointer place-items-center">{tick(i)}</label></td> : null}
                <td className={cn(table.td, "align-top")}>
                  <Link href={`/admin/emails?folder=failed&id=${i.id}`} className={nameLink}>{i.name || i.recipient}</Link>
                  {i.name ? <span className="block text-muted-foreground [overflow-wrap:anywhere]">{i.recipient}</span> : null}
                </td>
                <td className={cn(table.td, "align-top")}>
                  <span className="block [overflow-wrap:anywhere]">{i.subject}</span>
                  <span className="block text-muted-foreground">{i.kindLabel}</span>
                </td>
                <td className={cn(table.td, "align-top")}>
                  <Status tone="alert">{i.reason}</Status>
                  <span className="block text-muted-foreground">{tried(i)}</span>
                </td>
                {canWrite ? <td className={cn(table.td, "text-right align-top")}>{retryOne(i)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden">
          {items.map((i) => (
            <li key={i.id} className="flex min-w-0 items-start gap-3 py-3">
              {canWrite ? <label className="-mt-2.5 -ml-3 flex size-11 shrink-0 cursor-pointer items-center justify-center">{tick(i)}</label> : null}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={`/admin/emails?folder=failed&id=${i.id}`} className={cn(nameLink, "-my-2.5 flex min-h-11 items-center type-body")}>{i.name || i.recipient}</Link>
                <span className="type-small [overflow-wrap:anywhere]">{i.kindLabel} · {i.subject}</span>
                <Status tone="alert">{i.reason}</Status>
                <span className="type-small text-muted-foreground">{tried(i)}</span>
                {retryOne(i) ? <span className="pt-1">{retryOne(i)}</span> : null}
              </div>
            </li>
          ))}
        </ul>

        {canWrite && picked.size ? (
          <div role="region" aria-label="Ticked emails" className="sticky bottom-[calc(var(--nav-h)+0.75rem)] z-20 mx-auto flex w-full max-w-3xl min-w-0 flex-wrap items-center gap-2 rounded-xl border border-foreground bg-background p-2 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.35)] md:bottom-4">
            <span className="px-2 type-small font-semibold type-num">{picked.size} ticked</span>
            <button type="button" className={btn.primary} onClick={() => run([...picked], "sel")} disabled={Boolean(busy)}>
              {busy === "sel" ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
              Retry ticked
            </button>
            <button type="button" className={cn(btn.ghost, "ml-auto")} onClick={() => setPicked(new Set())}>Clear</button>
          </div>
        ) : null}
      </div>
    );
  }

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
