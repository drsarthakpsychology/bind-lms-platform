"use client";

import * as React from "react";
import { Check, Copy, KeyRound, Loader2, Plus, RotateCw, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SupportKeyView } from "@/lib/auth/support-keys";
import { cn } from "@/lib/utils";
import { Block, Empty, Notice, Status, btn, control, table } from "../_v2/kit";
import { createSupportKey, revokeLegacyKey, revokeSupportKey, rotateSupportKey } from "./master-actions";

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never";

type Ask = { kind: "revoke" | "rotate"; key: SupportKeyView } | { kind: "legacy" } | null;

/**
 * System, Support key (new design). A list of named keys: who made each one,
 * when, when it was last used, and Rotate or Revoke (both ask first). A new
 * key is shown once, with Copy, and never again: only its last four
 * characters are kept for recognising it.
 */
export function SupportKeys({
  keys,
  legacy,
  uses,
  ready,
  canWrite,
}: {
  keys: SupportKeyView[];
  /** The older single key, while it is still switched on. */
  legacy: { updatedAt: string | null } | null;
  uses: { email: string; at: string }[];
  ready: boolean;
  canWrite: boolean;
}) {
  const [label, setLabel] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fresh, setFresh] = React.useState<{ plain: string; label: string } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [ask, setAsk] = React.useState<Ask>(null);
  const live = keys.filter((k) => !k.revokedAt);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy("create");
    setError(null);
    const r = await createSupportKey(label);
    setBusy(null);
    if (r.error || !r.plain) return setError(r.error ?? "Could not make the key.");
    setFresh({ plain: r.plain, label: label.trim() });
    setCopied(false);
    setLabel("");
  }

  async function confirm() {
    if (!ask || busy) return;
    setBusy("confirm");
    setError(null);
    if (ask.kind === "legacy") {
      const r = await revokeLegacyKey();
      if (r.error) setError(r.error);
    } else if (ask.kind === "revoke") {
      const r = await revokeSupportKey(ask.key.id);
      if (r.error) setError(r.error);
    } else {
      const r = await rotateSupportKey(ask.key.id);
      if (r.error || !r.plain) setError(r.error ?? "Could not rotate it.");
      else {
        setFresh({ plain: r.plain, label: ask.key.label });
        setCopied(false);
      }
    }
    setBusy(null);
    setAsk(null);
  }

  async function copy() {
    if (!fresh) return;
    try {
      await navigator.clipboard.writeText(fresh.plain);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const status = (k: SupportKeyView) => (k.revokedAt ? <Status tone="quiet">Revoked {when(k.revokedAt)}</Status> : <Status tone="ok">Live</Status>);
  const actions = (k: SupportKeyView) =>
    canWrite && !k.revokedAt ? (
      <span className="flex flex-wrap justify-end gap-2">
        <button type="button" className={btn.quiet} onClick={() => setAsk({ kind: "rotate", key: k })} aria-label={`Rotate ${k.label}`}>
          <RotateCw aria-hidden /> Rotate
        </button>
        <button type="button" className={btn.danger} onClick={() => setAsk({ kind: "revoke", key: k })} aria-label={`Revoke ${k.label}`}>
          <X aria-hidden /> Revoke
        </button>
      </span>
    ) : null;

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
      {!ready ? <Notice tone="alert">Run the new database step (2026_11_access_doubts.sql) before making keys.</Notice> : null}

      {fresh ? (
        <section aria-labelledby="new-key" className="flex min-w-0 flex-col gap-3 rounded-[var(--ds-radius)] border-[1.5px] border-foreground p-4" data-keep>
          <h2 id="new-key" className="type-h3">New key for {fresh.label}</h2>
          <p className="type-small text-muted-foreground">Copy it now and keep it somewhere safe. You will not see it again; if it is lost, rotate it.</p>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 basis-64 rounded-md bg-[var(--ds-tint)] px-3 py-2.5 font-mono type-small [overflow-wrap:anywhere]">{fresh.plain}</code>
            <button type="button" onClick={() => void copy()} className={btn.primary}>
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button type="button" className={cn(btn.ghost, "self-start")} onClick={() => setFresh(null)}>
            Done, hide it
          </button>
        </section>
      ) : null}

      {error ? <Notice tone="alert">{error}</Notice> : null}

      <Block title="Keys" count={live.length || undefined}>
        {keys.length === 0 && !legacy ? (
          <Empty>No support keys yet. Make one below for each person who helps students.</Empty>
        ) : (
          <>
            <table className={cn(table.root, "hidden md:table")}>
              <thead>
                <tr>
                  <th scope="col" className={table.th}>Name</th>
                  <th scope="col" className={table.th}>Key</th>
                  <th scope="col" className={table.th}>Made by</th>
                  <th scope="col" className={table.th}>Last used</th>
                  <th scope="col" className={table.th}>Status</th>
                  <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k) => (
                  <tr key={k.id} className={cn(table.tr, k.revokedAt && "text-muted-foreground")}>
                    <td className={table.td}><span className="font-semibold [overflow-wrap:anywhere]">{k.label}</span></td>
                    <td className={cn(table.td, "whitespace-nowrap font-mono")}>…{k.last4}</td>
                    <td className={table.td}>
                      <span className="block [overflow-wrap:anywhere]">{k.createdByEmail ?? "Unknown"}</span>
                      <span className="block text-muted-foreground type-num">{when(k.createdAt)}</span>
                    </td>
                    <td className={cn(table.td, "type-num")}>{when(k.lastUsedAt)}</td>
                    <td className={table.td}>{status(k)}</td>
                    <td className={cn(table.td, "text-right")}>{actions(k)}</td>
                  </tr>
                ))}
                {legacy ? (
                  <tr className={table.tr}>
                    <td className={table.td}><span className="font-semibold">Older single key</span></td>
                    <td className={cn(table.td, "text-muted-foreground")}>Hidden</td>
                    <td className={cn(table.td, "type-num text-muted-foreground")}>Changed {when(legacy.updatedAt)}</td>
                    <td className={cn(table.td, "text-muted-foreground")}>See recent uses</td>
                    <td className={table.td}><Status tone="warn">Live, replace it</Status></td>
                    <td className={cn(table.td, "text-right")}>
                      {canWrite ? (
                        <button type="button" className={btn.danger} onClick={() => setAsk({ kind: "legacy" })}>
                          <X aria-hidden /> Revoke
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>

            <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden">
              {keys.map((k) => (
                <li key={k.id} className={cn("flex min-w-0 flex-col gap-1 py-3", k.revokedAt && "text-muted-foreground")}>
                  <span className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3">
                    <span className="type-body font-semibold [overflow-wrap:anywhere]">{k.label}</span>
                    <span className="font-mono type-small">…{k.last4}</span>
                  </span>
                  <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                    Made by {k.createdByEmail ?? "unknown"} · {when(k.createdAt)}
                  </span>
                  <span className="type-small text-muted-foreground">Last used {when(k.lastUsedAt)}</span>
                  {status(k)}
                  {actions(k) ? <span className="pt-1 [&>span]:justify-start">{actions(k)}</span> : null}
                </li>
              ))}
              {legacy ? (
                <li className="flex min-w-0 flex-col gap-1 py-3">
                  <span className="type-body font-semibold">Older single key</span>
                  <span className="type-small text-muted-foreground">Changed {when(legacy.updatedAt)}</span>
                  <Status tone="warn">Live, replace it</Status>
                  {canWrite ? (
                    <span className="pt-1">
                      <button type="button" className={btn.danger} onClick={() => setAsk({ kind: "legacy" })}>
                        <X aria-hidden /> Revoke
                      </button>
                    </span>
                  ) : null}
                </li>
              ) : null}
            </ul>
          </>
        )}
      </Block>

      {canWrite ? (
        <Block title="Make a key">
          <form onSubmit={create} className="flex min-w-0 flex-wrap items-end gap-2">
            <label className="flex min-w-0 flex-1 basis-64 flex-col gap-1">
              <span className="type-small font-semibold">Name</span>
              <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} placeholder="For example: Kavya, laptop" className={cn(control, "w-full")} disabled={!ready} />
            </label>
            <button type="submit" className={btn.ink} disabled={!ready || !label.trim() || busy === "create"}>
              {busy === "create" ? <Loader2 className="animate-spin" aria-hidden /> : <Plus aria-hidden />} Make key
            </button>
          </form>
          <p className="type-small text-muted-foreground">A key works only for student accounts, on the normal sign-in page with the student&apos;s email. Every use is recorded below.</p>
        </Block>
      ) : (
        <p className="type-small text-muted-foreground">View Admins can see the keys but not make, rotate or revoke them.</p>
      )}

      <Block title="Recent uses" count={uses.length || undefined}>
        {uses.length ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {uses.map((u, i) => (
              <li key={i} className="flex min-w-0 flex-wrap justify-between gap-x-4 py-2.5 type-small">
                <span className="min-w-0 [overflow-wrap:anywhere]">{u.email}</span>
                <span className="text-muted-foreground type-num">{when(u.at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No one has signed in with a support key yet.</Empty>
        )}
      </Block>

      <Dialog open={ask !== null} onOpenChange={(o) => !busy && !o && setAsk(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5" aria-hidden />
              {ask?.kind === "rotate" ? `Rotate ${ask.key.label}?` : ask?.kind === "revoke" ? `Revoke ${ask.key.label}?` : "Revoke the older key?"}
            </DialogTitle>
            <DialogDescription>
              {ask?.kind === "rotate"
                ? "The current key stops working now and a new one is made with the same name. You will see the new key once."
                : "It stops working now. Anyone using it will need a new key. This cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" className={btn.quiet} onClick={() => setAsk(null)} disabled={busy !== null}>
              Cancel
            </button>
            <button type="button" className={ask?.kind === "rotate" ? btn.ink : cn(btn.danger, "border-status-alert-fg")} onClick={() => void confirm()} disabled={busy !== null}>
              {busy === "confirm" ? <Loader2 className="animate-spin" aria-hidden /> : null}
              {ask?.kind === "rotate" ? "Rotate" : "Revoke"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
