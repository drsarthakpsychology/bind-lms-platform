"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { Flag, CheckCircle2 } from "lucide-react";

interface ReportRow {
  id: string;
  content: string;
  reason: string;
  createdAt: string;
}

/**
 * The reported-content queue. Faculty resolves a report (status → resolved);
 * the content stays visible on the wall unless they remove it separately.
 */
export function WallReportsList({ reports }: { reports: ReportRow[] }) {
  const [rows, setRows] = React.useState<ReportRow[]>(reports);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function resolve(id: string) {
    if (busy) return;
    setBusy(id);
    haptic("tap");
    try {
      const res = await fetch("/api/admin/wall-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id, status: "resolved" }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not resolve.");
        return;
      }
      setRows((r) => r.filter((x) => x.id !== id));
      haptic("success");
    } finally {
      setBusy(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-dashed border-border bg-card p-8 text-center">
        <p className="flex items-center justify-center gap-2 text-base font-medium">
          <CheckCircle2 className="size-4 text-green-600" aria-hidden /> Nothing reported
        </p>
        <p className="mt-1 text-small text-muted-foreground">
          The wall is clean — no open reports right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
      {rows.map((r) => (
        <div key={r.id} className="rounded-md border-2 border-border bg-card p-4">
          <div className="flex items-center justify-between text-caption text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Flag className="size-3.5 text-amber-600" aria-hidden />
              Reported · {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
          <blockquote className="mt-2 rounded-md border border-border bg-background p-3 text-small italic">
            {r.content}
          </blockquote>
          <p className="mt-2 text-small">
            <span className="font-semibold text-muted-foreground">Reason: </span>
            {r.reason}
          </p>
          <button
            type="button"
            onClick={() => void resolve(r.id)}
            disabled={busy === r.id}
            className="mt-3 rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px disabled:opacity-50"
          >
            {busy === r.id ? "Resolving…" : "Resolve report"}
          </button>
        </div>
      ))}
    </div>
  );
}