"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { haptic } from "@/lib/haptics";

interface Entry {
  id: string;
  studentEmail: string;
  activity: string;
  hours: number;
  date: string;
  supervisorName?: string;
  signoffStatus: string;
}

/**
 * Admin review list: sign or reject a requested supervision entry.
 */
export function SupervisionReview({ entries, v2 = false }: { entries: Entry[]; v2?: boolean }) {
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function decide(id: string, action: "signed" | "rejected") {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/supervision-signoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: id, action }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not update.");
        return;
      }
      haptic("success");
      window.location.reload();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(null);
    }
  }

  if (v2) {
    const b = "inline-flex h-11 items-center justify-center gap-1.5 rounded-md border px-3 type-small font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-45 lg:h-9";
    if (entries.length === 0) return <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">No sign-off requests. When a student asks for one, it lands here.</p>;
    return (
      <div className="flex min-w-0 flex-col gap-2">
        {error ? <p className="rounded-md bg-status-alert-bg px-3 py-2.5 type-small text-status-alert-fg" role="alert">{error}</p> : null}
        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {entries.map((e) => (
            <li key={e.id} className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
              <div className="min-w-0 flex-1 basis-60">
                <p className="type-body font-semibold [overflow-wrap:anywhere]">{e.activity}</p>
                <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                  {e.studentEmail} · {e.date} · {e.hours}h{e.supervisorName ? ` · ${e.supervisorName}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" disabled={busy === e.id} onClick={() => void decide(e.id, "signed")} className={`${b} border-foreground bg-foreground text-background hover:opacity-90`}>
                  <Check className="size-4" aria-hidden /> Sign
                </button>
                <button type="button" disabled={busy === e.id} onClick={() => void decide(e.id, "rejected")} className={`${b} border-[var(--ds-card-line)] text-status-alert-fg hover:border-status-alert-fg`}>
                  <X className="size-4" aria-hidden /> Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No sign-off requests</p>
        <p className="mt-1 text-small text-muted-foreground">
          When students request sign-off on a supervision entry, it lands here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-small text-status-alert-fg" role="alert">{error}</p> : null}
      {entries.map((e) => (
        <div key={e.id} className="rounded-md border-2 border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-small font-medium">{e.activity}</p>
              <p className="text-caption text-muted-foreground">
                {e.studentEmail} · {e.date} · {e.hours}h{e.supervisorName ? ` · ${e.supervisorName}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                disabled={busy === e.id}
                onClick={() => void decide(e.id, "signed")}
                className="flex items-center gap-1 rounded-md border-2 border-status-success-fg bg-status-success-bg px-3 py-1.5 text-caption font-semibold text-status-success-fg transition-transform active:translate-y-px disabled:opacity-50"
              >
                <Check className="size-3.5" aria-hidden />
                Sign
              </button>
              <button
                type="button"
                disabled={busy === e.id}
                onClick={() => void decide(e.id, "rejected")}
                className="flex items-center gap-1 rounded-md border-2 border-status-alert-fg bg-status-alert-bg px-3 py-1.5 text-caption font-semibold text-status-alert-fg transition-transform active:translate-y-px disabled:opacity-50"
              >
                <X className="size-3.5" aria-hidden />
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
