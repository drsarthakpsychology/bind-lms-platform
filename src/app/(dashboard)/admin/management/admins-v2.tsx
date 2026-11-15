"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Block, Notice, Status, btn, control, table } from "../_v2/kit";
import { addAdmin, removeAdmin, resendAdminInvite, setAdminRole, type AdminRow } from "./actions";

type Role = AdminRow["role"];
const ROLE: Record<Role, string> = { admin: "Super Admin", view_admin: "View Admin" };
const ROLE_NOTE: Record<Role, string> = { admin: "Full access: can change anything", view_admin: "Read only: can see, cannot change" };

type Ask = { kind: "role"; row: AdminRow; to: Role } | { kind: "remove"; row: AdminRow } | null;

/**
 * Admins (new design). The list first: who, what they can do, and their
 * account state; changing a role and removing someone both ask first. Adding
 * someone gives a one-time setup link, shown once with Copy.
 */
export function AdminsV2({ admins, me }: { admins: AdminRow[]; me: { id: string; email: string | null } }) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("view_admin");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [note, setNote] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [setup, setSetup] = React.useState<{ email: string; url: string } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [ask, setAsk] = React.useState<Ask>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy("add");
    setNote(null);
    setSetup(null);
    const res = await addAdmin(email, role);
    setBusy(null);
    if (res.error) return setNote({ ok: false, text: res.error });
    if (res.setupUrl) setSetup({ email: email.trim(), url: res.setupUrl });
    setNote({ ok: true, text: `${email.trim()} added as ${ROLE[role]}.` });
    setCopied(false);
    setEmail("");
    router.refresh();
  }

  async function confirm() {
    if (!ask || busy) return;
    setBusy("confirm");
    const res = ask.kind === "role" ? await setAdminRole(ask.row.id, ask.to) : await removeAdmin(ask.row.id);
    setBusy(null);
    setNote(res.error ? { ok: false, text: res.error } : { ok: true, text: ask.kind === "role" ? `${ask.row.email} is now ${ROLE[ask.to]}.` : `${ask.row.email} removed.` });
    setAsk(null);
    router.refresh();
  }

  async function resend(a: AdminRow) {
    if (busy) return;
    setBusy(`resend:${a.id}`);
    const res = await resendAdminInvite(a.email);
    setBusy(null);
    setNote(res.error ? { ok: false, text: res.error } : { ok: true, text: `Setup link sent to ${a.email}.` });
  }

  async function copy() {
    if (!setup) return;
    try {
      await navigator.clipboard.writeText(setup.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const roleSelect = (a: AdminRow) => (
    <select
      value={a.role}
      aria-label={`Role for ${a.email}`}
      onChange={(e) => setAsk({ kind: "role", row: a, to: e.target.value as Role })}
      className={cn(control, "w-full sm:w-auto")}
    >
      <option value="view_admin">View Admin</option>
      <option value="admin">Super Admin</option>
    </select>
  );
  const rowActions = (a: AdminRow) => (
    <span className="flex flex-wrap justify-end gap-2">
      <button type="button" className={btn.quiet} onClick={() => void resend(a)} disabled={busy !== null}>
        {busy === `resend:${a.id}` ? <Loader2 className="animate-spin" aria-hidden /> : null} Resend link
      </button>
      <button type="button" className={btn.danger} onClick={() => setAsk({ kind: "remove", row: a })} aria-label={`Remove ${a.email}`}>
        Remove
      </button>
    </span>
  );
  const state = (a: AdminRow) => <Status tone={a.status === "active" ? "ok" : a.status === "blocked" ? "alert" : "quiet"}>{a.status === "active" ? "Active" : a.status === "blocked" ? "Locked" : a.status}</Status>;

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
      {note ? (
        note.ok ? (
          <p role="status" className="rounded-md bg-status-success-bg px-3 py-2.5 type-small font-semibold [overflow-wrap:anywhere]">{note.text}</p>
        ) : (
          <Notice tone="alert">{note.text}</Notice>
        )
      ) : null}

      {setup ? (
        <section aria-labelledby="setup-link" data-keep className="flex min-w-0 flex-col gap-3 rounded-[var(--ds-radius)] border-[1.5px] border-foreground p-4">
          <h2 id="setup-link" className="type-h3">Setup link for {setup.email}</h2>
          <p className="type-small text-muted-foreground">It works once. Send it to them yourself; you will not see it again here.</p>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 basis-64 rounded-md bg-[var(--ds-tint)] px-3 py-2.5 font-mono type-small [overflow-wrap:anywhere]">{setup.url}</code>
            <button type="button" onClick={() => void copy()} className={btn.primary}>
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button type="button" className={cn(btn.ghost, "self-start")} onClick={() => setSetup(null)}>
            Done, hide it
          </button>
        </section>
      ) : null}

      <Block title="Administrators" count={admins.length}>
        <table className={cn(table.root, "hidden md:table")}>
          <thead>
            <tr>
              <th scope="col" className={table.th}>Email</th>
              <th scope="col" className={table.th}>Can</th>
              <th scope="col" className={table.th}>Account</th>
              <th scope="col" className={table.th}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className={table.tr}>
                <td className={table.td}>
                  <span className="block font-semibold [overflow-wrap:anywhere]">{a.email}</span>
                  {a.id === me.id ? <span className="block text-muted-foreground">You</span> : null}
                </td>
                <td className={table.td}>
                  {a.id === me.id ? <span>{ROLE[a.role]}</span> : roleSelect(a)}
                  <span className="mt-1 block text-muted-foreground">{ROLE_NOTE[a.role]}</span>
                </td>
                <td className={cn(table.td, "whitespace-nowrap")}>{state(a)}</td>
                <td className={cn(table.td, "text-right")}>{a.id === me.id ? null : rowActions(a)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)] md:hidden">
          {admins.map((a) => (
            <li key={a.id} className="flex min-w-0 flex-col gap-2 py-3">
              <span className="type-body font-semibold [overflow-wrap:anywhere]">{a.email}{a.id === me.id ? <span className="font-normal text-muted-foreground"> · you</span> : null}</span>
              <span className="flex flex-wrap items-center gap-x-4 gap-y-1 type-small text-muted-foreground">
                <span>{ROLE[a.role]}</span>
                {state(a)}
              </span>
              {a.id === me.id ? null : (
                <>
                  {roleSelect(a)}
                  <span className="[&>span]:justify-start">{rowActions(a)}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Add an administrator">
        <form onSubmit={add} className="flex min-w-0 flex-wrap items-end gap-2">
          <label className="flex min-w-0 flex-1 basis-64 flex-col gap-1">
            <span className="type-small font-semibold">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={cn(control, "w-full")} />
          </label>
          <label className="flex min-w-0 basis-48 flex-col gap-1">
            <span className="type-small font-semibold">They can</span>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={cn(control, "w-full")}>
              <option value="view_admin">View Admin: read only</option>
              <option value="admin">Super Admin: full access</option>
            </select>
          </label>
          <button type="submit" className={btn.ink} disabled={busy !== null || !email.trim()}>
            {busy === "add" ? <Loader2 className="animate-spin" aria-hidden /> : <UserPlus aria-hidden />} Add
          </button>
        </form>
      </Block>

      <Dialog open={ask !== null} onOpenChange={(o) => !busy && !o && setAsk(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="[overflow-wrap:anywhere]">{ask?.kind === "role" ? `Make ${ask.row.email} a ${ROLE[ask.to]}?` : ask ? `Remove ${ask.row.email}?` : ""}</DialogTitle>
            <DialogDescription>
              {ask?.kind === "role" ? ROLE_NOTE[ask.to] + "." : "This deletes their account. They lose access at once. It cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" className={btn.quiet} onClick={() => setAsk(null)} disabled={busy !== null}>
              Cancel
            </button>
            <button type="button" className={ask?.kind === "remove" ? cn(btn.danger, "border-status-alert-fg") : btn.ink} onClick={() => void confirm()} disabled={busy !== null}>
              {busy === "confirm" ? <Loader2 className="animate-spin" aria-hidden /> : null}
              {ask?.kind === "remove" ? "Remove" : "Change"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
