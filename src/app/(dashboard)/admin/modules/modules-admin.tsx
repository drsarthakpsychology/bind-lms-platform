"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { CheckSquare, Eye } from "lucide-react";

interface ModuleRow {
  id: string;
  title: string;
  order: number;
  state: string;
  releaseAt: string | null;
  grantedStudents: string[];
}

const STATE_CHIP: Record<string, string> = {
  draft: "bg-secondary text-muted-foreground",
  scheduled: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-muted text-muted-foreground",
};

/**
 * Admin modules — multi-select, bulk publish/schedule/grant/unpublish,
 * preview-as-student, one-click unlock-all.
 */
export function ModulesAdmin({ modules, students }: { modules: ModuleRow[]; students: Array<{ id: string; email: string }> }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [grantTarget, setGrantTarget] = React.useState<string>(""); // student email

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulk(action: "publish" | "schedule" | "unpublish" | "grant_cohort", targetEmail?: string) {
    if (selected.size === 0 || busy) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: [...selected], targetEmail }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not apply.");
        return;
      }
      haptic("success");
      window.location.reload();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* bulk action bar */}
      <div className="rounded-md border-2 border-border bg-card p-3">
        <p className="text-caption text-muted-foreground">
          {selected.size} selected · bulk:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <BulkBtn onClick={() => void bulk("publish")} label="Publish" busy={busy} />
          <BulkBtn onClick={() => void bulk("schedule")} label="Schedule" busy={busy} />
          <BulkBtn onClick={() => void bulk("unpublish")} label="Unpublish" busy={busy} />
          <BulkBtn onClick={() => void bulk("grant_cohort")} label="Grant to cohort" busy={busy} />
          <label className="flex items-center gap-2 text-caption">
            Grant to student:
            <input
              value={grantTarget}
              onChange={(e) => setGrantTarget(e.target.value)}
              placeholder="student@email"
              className="rounded-md border-2 border-border bg-background px-2 py-1 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => void bulk("grant_cohort", grantTarget)}
              disabled={busy || !grantTarget.trim()}
              className="rounded-md border-2 border-border px-2 py-1 text-caption font-medium disabled:opacity-50"
            >
              Grant
            </button>
          </label>
        </div>
        {error ? <p className="mt-2 text-small text-red-600" role="alert">{error}</p> : null}
      </div>

      {/* module list */}
      <div className="space-y-2">
        {modules.map((m) => {
          const checked = selected.has(m.id);
          return (
            <div key={m.id} className={cn("flex items-center gap-3 rounded-md border-2 border-border bg-card px-4 py-3", checked && "border-primary")}>
              <button
                type="button"
                onClick={() => toggle(m.id)}
                aria-pressed={checked}
                className={cn("flex size-5 shrink-0 items-center justify-center rounded border-2 border-border", checked && "bg-primary")}
              >
                {checked ? <CheckSquare className="size-3.5 text-primary-foreground" aria-hidden /> : null}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-medium">{m.title}</p>
                <p className="text-caption text-muted-foreground">
                  order {m.order} · {m.grantedStudents.length} students granted
                  {m.releaseAt ? ` · opens ${m.releaseAt.slice(0, 10)}` : ""}
                </p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-caption font-medium", STATE_CHIP[m.state] ?? "bg-secondary")}>
                {m.state}
              </span>
              <button
                type="button"
                onClick={() => { setSelected(new Set([m.id])); }}
                className="shrink-0 rounded-md border border-border px-2 py-1 text-caption text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Eye className="mr-1 inline size-3" aria-hidden /> preview
              </button>
            </div>
          );
        })}
      </div>

      {/* one-click unlock all */}
      <div className="rounded-md border-2 border-dashed border-border bg-card p-3">
        <p className="text-caption font-medium text-muted-foreground">One-click unlock everything for a student (fee waiver / catch-up)</p>
        <select
          value={grantTarget}
          onChange={(e) => setGrantTarget(e.target.value)}
          className="mt-2 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a student…</option>
          {students.map((s) => (
            <option key={s.id} value={s.email}>{s.email}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => { setSelected(new Set(modules.map((m) => m.id))); void bulk("grant_cohort", grantTarget); }}
          disabled={busy || !grantTarget}
          className="mt-2 rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm disabled:opacity-50"
        >
          Unlock everything for this student
        </button>
      </div>
    </div>
  );
}

function BulkBtn({ onClick, label, busy }: { onClick: () => void; label: string; busy: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-md border-2 border-border px-2.5 py-1.5 text-caption font-medium transition-transform active:translate-y-px disabled:opacity-50"
    >
      {label}
    </button>
  );
}
