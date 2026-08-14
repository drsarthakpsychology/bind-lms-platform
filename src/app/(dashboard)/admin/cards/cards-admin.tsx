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

const STATUS_LABELS: Record<CardRow["status"], string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
  archived: "Archived",
};

const SOURCE_LABELS: Record<CardRow["source"], string> = {
  ai_generated: "AI-drafted",
  faculty: "Faculty",
  manual: "Manual",
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

  const [addOpen, setAddOpen] = React.useState(false);
  const [newFront, setNewFront] = React.useState("");
  const [newBack, setNewBack] = React.useState("");

  async function createCard(front: string, back: string) {
    if (busy || !front.trim() || !back.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: front.trim(), back: back.trim() }),
      });
      if (!res.ok) return;
      const j = (await res.json()) as {
        card?: {
          id: string;
          front: string;
          back: string;
          source: CardRow["source"];
          status: CardRow["status"];
          approved: boolean;
          created_at: string;
        } | null;
      };
      if (j.card) {
        haptic("success");
        const row: CardRow = {
          id: j.card.id,
          front: String(j.card.front),
          back: String(j.card.back),
          source: j.card.source,
          status: j.card.status,
          approved: Boolean(j.card.approved),
          createdAt: j.card.created_at,
        };
        setRows((r) => [row, ...r]);
      }
    } finally {
      setBusy(false);
      setAddOpen(false);
      setNewFront("");
      setNewBack("");
    }
  }

  if (rows.length === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-md border-2 border-dashed border-border bg-card p-6 text-center text-small text-muted-foreground">
          No study cards yet. They appear here once the programme auto-drafts them from lesson transcripts.
        </div>
        <AddCardButton
          open={addOpen}
          onOpenChange={setAddOpen}
          busy={busy}
          front={newFront}
          back={newBack}
          onFront={setNewFront}
          onBack={setNewBack}
          onSave={() => void createCard(newFront, newBack)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AddCardButton
        open={addOpen}
        onOpenChange={setAddOpen}
        busy={busy}
        front={newFront}
        back={newBack}
        onFront={setNewFront}
        onBack={setNewBack}
        onSave={() => void createCard(newFront, newBack)}
      />
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
                  {STATUS_LABELS[row.status]}
                </span>
                <span className="text-caption text-muted-foreground">
                  {SOURCE_LABELS[row.source]} · {new Date(row.createdAt).toLocaleDateString()}
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
                <button type="button" onClick={() => void createCard(row.front, row.back)} disabled={busy} className="rounded-md border-2 border-border bg-background px-3 py-1 text-caption font-semibold">
                  Duplicate
                </button>
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

/**
 * "Add card" toggle + the minimal creation form (front + back only — advanced
 * config lives behind review, not authoring). The whole point of T106: adding
 * a card takes two fields, not a data-model form.
 */
function AddCardButton({
  open,
  onOpenChange,
  busy,
  front,
  back,
  onFront,
  onBack,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  busy: boolean;
  front: string;
  back: string;
  onFront: (v: string) => void;
  onBack: (v: string) => void;
  onSave: () => void;
}) {
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none"
      >
        Add a card
      </button>
    );
  }
  return (
    <div className="space-y-2 rounded-md border-2 border-border bg-card p-3">
      <p className="text-caption font-semibold text-muted-foreground">New card</p>
      <label className="block">
        <span className="text-caption font-semibold text-muted-foreground">Front</span>
        <input
          value={front}
          onChange={(e) => onFront(e.target.value)}
          autoFocus
          className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small"
          placeholder="The question or prompt"
        />
      </label>
      <label className="block">
        <span className="text-caption font-semibold text-muted-foreground">Back</span>
        <textarea
          value={back}
          onChange={(e) => onBack(e.target.value)}
          rows={2}
          className="mt-0.5 w-full rounded-md border-2 border-border bg-background px-3 py-1.5 text-small"
          placeholder="The answer"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={busy || !front.trim() || !back.trim()}
          className="rounded-md border-2 border-border bg-primary px-3 py-1 text-caption font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Adding…" : "Save card"}
        </button>
        <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border-2 border-border bg-background px-3 py-1 text-caption font-semibold">
          Cancel
        </button>
      </div>
    </div>
  );
}
