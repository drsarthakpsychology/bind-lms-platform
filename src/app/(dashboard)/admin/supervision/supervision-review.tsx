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
 * Admin review list — sign or reject a requested supervision entry.
 */
export function SupervisionReview({ entries }: { entries: Entry[] }) {
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
      {error ? <p className="text-small text-red-600" role="alert">{error}</p> : null}
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
                className="flex items-center gap-1 rounded-md border-2 border-green-600 bg-green-50 px-3 py-1.5 text-caption font-semibold text-green-800 transition-transform active:translate-y-px disabled:opacity-50"
              >
                <Check className="size-3.5" aria-hidden />
                Sign
              </button>
              <button
                type="button"
                disabled={busy === e.id}
                onClick={() => void decide(e.id, "rejected")}
                className="flex items-center gap-1 rounded-md border-2 border-red-400 bg-red-50 px-3 py-1.5 text-caption font-semibold text-red-700 transition-transform active:translate-y-px disabled:opacity-50"
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
