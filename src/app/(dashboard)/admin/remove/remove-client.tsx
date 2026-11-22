"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { RemovePersonButton } from "@/components/admin/remove-person";
import type { RemovalData, RemovalPerson, RemovalRequest } from "@/lib/people/removal";
import { btn, control } from "../_v2/kit";
import { declineDeletion } from "./actions";

const ROLE: Record<RemovalPerson["role"], string> = { admin: "Super Admin", view_admin: "View Admin", student: "Student", alumni: "Alumni" };
const STATE: Record<RemovalPerson["state"], string> = { active: "Has access", locked: "Locked", removed: "Removed" };
type View = "requests" | "everyone" | "removed";

const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "");

function PersonRow({ p, canWrite }: { p: RemovalPerson; canWrite: boolean }) {
  const blocked = p.isYou || p.role === "admin";
  return (
    <li className="flex flex-col gap-2 border-b border-[var(--ds-hairline)] py-3 sm:flex-row sm:items-center sm:justify-between" data-testid={`remove-row-${p.id}`}>
      <div className="min-w-0">
        <p className="type-small font-semibold [overflow-wrap:anywhere]">
          {p.name}
          {p.isYou ? <span className="font-normal text-muted-foreground"> (you)</span> : null}
        </p>
        <p className="type-caption text-muted-foreground [overflow-wrap:anywhere]">
          {ROLE[p.role]}
          {p.rollNumber ? ` · ${p.rollNumber}` : ""}
          {p.email ? ` · ${p.email}` : ""}
        </p>
        <p className={`type-caption ${p.state === "removed" ? "text-status-alert-fg" : "text-muted-foreground"}`}>
          {STATE[p.state]}
          {p.state === "removed" && p.removedAt ? ` on ${day(p.removedAt)}` : ""}
          {p.note ? `. ${p.note}` : ""}
        </p>
      </div>
      {canWrite && !blocked ? (
        <div className="flex flex-wrap gap-2">
          <RemovePersonButton target={{ id: p.id, name: p.name, confirmWord: p.confirmWord, state: p.state }} />
          {p.state === "removed" ? <RemovePersonButton target={{ id: p.id, name: p.name, confirmWord: p.confirmWord, state: p.state }} start="delete" label="Delete account" /> : null}
        </div>
      ) : canWrite && p.role === "admin" && !p.isYou ? (
        <p className="type-caption text-muted-foreground">Change to View Admin in Admins first.</p>
      ) : null}
    </li>
  );
}

function RequestRow({ r, canWrite }: { r: RemovalRequest; canWrite: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <li className="flex flex-col gap-2 border-b border-[var(--ds-hairline)] py-3" data-testid={`request-${r.id}`}>
      <div className="min-w-0">
        <p className="type-small font-semibold [overflow-wrap:anywhere]">{r.name}</p>
        <p className="type-caption text-muted-foreground [overflow-wrap:anywhere]">
          Asked on {day(r.createdAt)}
          {r.email ? ` · ${r.email}` : ""}
        </p>
        {r.reason ? <p className="type-small [overflow-wrap:anywhere]">&ldquo;{r.reason}&rdquo;</p> : null}
        {r.status !== "open" ? <p className="type-caption text-muted-foreground">{r.status === "done" ? "Account deleted" : "Declined"}{r.handledAt ? ` on ${day(r.handledAt)}` : ""}</p> : null}
      </div>
      {error ? <p role="alert" className="type-small text-status-alert-fg">{error}</p> : null}
      {canWrite && r.status === "open" ? (
        <div className="flex flex-wrap gap-2">
          {r.accountGone ? null : <RemovePersonButton target={{ id: r.userId, name: r.name, confirmWord: r.confirmWord, state: "active", requestId: r.id }} start="delete" label="Approve and delete" />}
          <button
            type="button"
            className={btn.quiet}
            disabled={pending}
            onClick={() =>
              start(async () => {
                const res = await declineDeletion(r.id);
                if (res.error) setError(res.error);
                else router.refresh();
              })
            }
          >
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Decline
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function RemoveClient({ data, canWrite }: { data: RemovalData; canWrite: boolean }) {
  const open = data.requests.filter((r) => r.status === "open");
  const [view, setView] = useState<View>(open.length ? "requests" : "everyone");
  const [q, setQ] = useState("");
  const people = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.people.filter((p) => (view === "removed" ? p.state === "removed" : true) && (!s || `${p.name} ${p.email ?? ""} ${p.rollNumber ?? ""}`.toLowerCase().includes(s)));
  }, [data.people, q, view]);
  const removed = data.people.filter((p) => p.state === "removed").length;
  const tabs: { id: View; label: string }[] = [
    { id: "requests", label: `Asked to delete${open.length ? ` (${open.length})` : ""}` },
    { id: "everyone", label: "Everyone" },
    { id: "removed", label: `Removed${removed ? ` (${removed})` : ""}` },
  ];
  return (
    <div className="space-y-4">
      {!canWrite ? <p className="type-small text-muted-foreground">You have view-only access. Ask a Super Admin to remove someone.</p> : null}
      <div role="tablist" aria-label="Show" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={view === t.id} onClick={() => setView(t.id)} className={view === t.id ? btn.ink : btn.quiet}>
            {t.label}
          </button>
        ))}
      </div>
      {view === "requests" ? (
        <section aria-label="Asked to delete">
          <p className="type-small text-muted-foreground">People who asked, from the app, for their account to be deleted. Approve to delete it, or decline to keep it.</p>
          {!data.requestsReady ? (
            <p className="py-6 type-small text-muted-foreground">Requests are not stored yet. Each one still reaches you as a notification.</p>
          ) : data.requests.length ? (
            <ul>{data.requests.map((r) => <RequestRow key={r.id} r={r} canWrite={canWrite} />)}</ul>
          ) : (
            <p className="py-6 type-small text-muted-foreground">No one has asked.</p>
          )}
        </section>
      ) : (
        <section aria-label={view === "removed" ? "Removed" : "Everyone"}>
          <input type="search" aria-label="Search people" placeholder="Search by name, email or roll number" value={q} onChange={(e) => setQ(e.target.value)} className={`${control} w-full`} />
          {people.length ? <ul>{people.map((p) => <PersonRow key={p.id} p={p} canWrite={canWrite} />)}</ul> : <p className="py-6 type-small text-muted-foreground">{view === "removed" ? "No one is removed." : "No one matches."}</p>}
        </section>
      )}
    </div>
  );
}
