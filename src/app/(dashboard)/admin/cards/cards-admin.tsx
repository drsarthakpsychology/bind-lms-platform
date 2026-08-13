"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export interface CardRow {
  id: string;
  front: string;
  back: string;
  source: "ai_generated" | "faculty" | "manual";
  status: "draft" | "in_review" | "published" | "archived";
  approved: boolean;
  createdAt: string;
}

const STATUS_STYLE: Record<CardRow["status"], string> = {
  draft: "bg-status-pending-bg text-status-pending-fg",
  in_review: "bg-secondary text-muted-foreground",
  published: "bg-status-success-bg text-status-success-fg",
  archived: "bg-muted text-muted-foreground line-through",
};

/** Faculty review of the auto-drafted Rounds cards. */
export function CardsAdmin({ cards }: { cards: CardRow[] }) {
  const [rows, setRows] = React.useState<CardRow[]>(cards);
  const [busy, setBusy] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [front, setFront] = React.useState("");
  const [back, setBack] = React.useState("");

  async function act(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) return;
      haptic("success");
      setRows((r) =>
        r.map((row) => {
          if (row.id !== id) return row;
          const next = { ...row, ...patch };
          // Mirror the server: approve ⇒ publish; archive ⇒ unapprove.
          if (patch.approved === true) next.status = "published";
          if (patch.status === "archived") next.approved = false;
          return next;
        }),
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/cards?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      haptic("warning");
      setRows((r) => r.filter((row) => row.id !== id));
    } finally {
      setBusy(false);
    }
  }

  function startEdit(row: CardRow) {
    setEditing(row.id);
    setFront(row.front);
    setBack(row.back);
  }

  async function saveEdit(id: string) {
    await act(id, { front: front.trim(), back: back.trim() });
    setEditing(null);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-border bg-card p-6 text-center text-small text-muted-foreground">
        No cards yet. Run <code className="rounded bg-muted px-1.5 py-0.5">npm run draft-cards</code> to auto-draft
        flashcards from published lesson transcripts.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className={cn("rounded-md border-2 border-border bg-card p-4 hard-shadow-sm", row.status === "archived" && "opacity-60")}>
          {editing === row.id ? (
            <div className="space-y-2">
              <label className="block">
                <span className="text-caption font-semibold text-muted-foreground">Front</span>
                <input value={front} onChange={(e) => setFront(e.target.value)} className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small" />
              </label>
              <label className="block">
                <span className="text-caption font-semibold text-muted-foreground">Back</span>
                <textarea value={back} onChange={(e) => setBack(e.target.value)} rows={3} className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small" />
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => void saveEdit(row.id)} disabled={busy || !front.trim() || !back.trim()} className="rounded-md border-2 border-border bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground">
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
                <span className={cn("rounded-full px-2 py-0.5 text-caption font-medium", STATUS_STYLE[row.status])}>
                  {row.status}
                </span>
                <span className="text-caption text-muted-foreground">
                  {row.source} · {new Date(row.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-small font-medium">{row.front}</p>
              <p className="mt-1 text-small text-muted-foreground">{row.back}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {row.status !== "published" ? (
                  <button type="button" onClick={() => void act(row.id, { approved: true })} disabled={busy} className="rounded-md border-2 border-status-success-fg/40 bg-status-success-bg px-3 py-1 text-caption font-semibold text-status-success-fg">
                    Approve &amp; publish
                  </button>
                ) : null}
                {row.status !== "archived" ? (
                  <button type="button" onClick={() => void act(row.id, { status: "archived" })} disabled={busy} className="rounded-md border-2 border-border bg-background px-3 py-1 text-caption font-semibold text-muted-foreground">
                    Reject
                  </button>
                ) : null}
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
