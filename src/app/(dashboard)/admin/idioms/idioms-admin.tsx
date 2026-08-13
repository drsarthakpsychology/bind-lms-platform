"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export interface IdiomRow {
  id: string;
  phrase: string;
  transliteration?: string;
  trap: string;
  approved: boolean;
  createdAt: string;
}

/** Faculty review of the seeded idiom bank (approve → the Decoder shows it). */
export function IdiomsAdmin({ idioms }: { idioms: IdiomRow[] }) {
  const [rows, setRows] = React.useState<IdiomRow[]>(idioms);
  const [busy, setBusy] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [phrase, setPhrase] = React.useState("");
  const [trap, setTrap] = React.useState("");

  async function act(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/idioms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) return;
      haptic("success");
      setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/idioms?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      haptic("warning");
      setRows((r) => r.filter((row) => row.id !== id));
    } finally {
      setBusy(false);
    }
  }

  function startEdit(row: IdiomRow) {
    setEditing(row.id);
    setPhrase(row.phrase);
    setTrap(row.trap);
  }

  async function saveEdit(id: string) {
    await act(id, { phrase: phrase.trim(), trap: trap.trim() });
    setEditing(null);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-border bg-card p-6 text-center text-small text-muted-foreground">
        No idioms in the bank. Re-run <code className="rounded bg-muted px-1.5 py-0.5">npm run seed-idioms</code>.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className={cn("rounded-md border-2 border-border bg-card p-4 hard-shadow-sm", !row.approved && "bg-secondary/30")}>
          {editing === row.id ? (
            <div className="space-y-2">
              <label className="block">
                <span className="text-caption font-semibold text-muted-foreground">Phrase</span>
                <input value={phrase} onChange={(e) => setPhrase(e.target.value)} className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small" />
              </label>
              <label className="block">
                <span className="text-caption font-semibold text-muted-foreground">Trap (the default misread)</span>
                <textarea value={trap} onChange={(e) => setTrap(e.target.value)} rows={2} className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small" />
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => void saveEdit(row.id)} disabled={busy || !phrase.trim()} className="rounded-md border-2 border-border bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground">
                  Save
                </button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-md border-2 border-border bg-background px-3 py-1 text-caption font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="min-w-0 break-words text-small font-medium text-foreground">{row.phrase}</p>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-caption font-medium", row.approved ? "bg-status-success-bg text-status-success-fg" : "bg-status-pending-bg text-status-pending-fg")}>
                  {row.approved ? "Approved" : "Queued"}
                </span>
              </div>
              {row.transliteration ? <p className="mt-0.5 text-caption text-muted-foreground">{row.transliteration}</p> : null}
              <p className="mt-1 min-w-0 break-words text-small text-muted-foreground">
                <span className="font-medium">Trap:</span> {row.trap}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!row.approved ? (
                  <button type="button" onClick={() => void act(row.id, { approved: true })} disabled={busy} className="rounded-md border-2 border-status-success-fg/40 bg-status-success-bg px-3 py-1 text-caption font-semibold text-status-success-fg">
                    Approve &amp; publish
                  </button>
                ) : (
                  <button type="button" onClick={() => void act(row.id, { approved: false })} disabled={busy} className="rounded-md border-2 border-border bg-background px-3 py-1 text-caption font-semibold text-muted-foreground">
                    Unapprove
                  </button>
                )}
                <button type="button" onClick={() => startEdit(row)} disabled={busy} className="rounded-md border-2 border-border bg-background px-3 py-1 text-caption font-semibold">
                  Edit
                </button>
                <button type="button" onClick={() => void remove(row.id)} disabled={busy} className="ml-auto rounded-md border-2 border-destructive/40 bg-status-alert-bg px-3 py-1 text-caption font-semibold text-destructive">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
