"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Action = "approve" | "edit" | "merge" | "add_evidence" | "reject" | "publish";

/**
 * Wired review actions. Each button POSTs the decision to the review API,
 * which writes the status transition + an immutable audit row. Doses are
 * always single-approve (one id per request). The page refresh shows the new
 * status.
 */
export function ReviewActions({
  table,
  id,
  status,
  isDose,
}: {
  table: string;
  id: string;
  status: string;
  isDose?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");

  async function run(action: Action) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/psychopharm/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, table, id, note: note || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "request failed");
        return;
      }
      router.refresh();
    } catch {
      setError("network error");
    } finally {
      setBusy(null);
    }
  }

  const btn = "rounded-md border-2 border-border px-3 py-1.5 text-sm";
  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn} disabled={busy !== null} onClick={() => run("approve")}>
          {busy === "approve" ? "…" : "Approve"}
        </button>
        <button type="button" className={btn} disabled={busy !== null} onClick={() => run("edit")}>
          {busy === "edit" ? "…" : "Edit"}
        </button>
        <button type="button" className={btn} disabled={busy !== null} onClick={() => run("merge")}>
          {busy === "merge" ? "…" : "Merge evidence"}
        </button>
        <button type="button" className={btn} disabled={busy !== null} onClick={() => run("add_evidence")}>
          {busy === "add_evidence" ? "…" : "Add evidence"}
        </button>
        <button type="button" className={btn} disabled={busy !== null} onClick={() => run("reject")}>
          {busy === "reject" ? "…" : "Reject"}
        </button>
        <button
          type="button"
          className={`${btn} ${isDose ? "opacity-60" : ""}`}
          disabled={busy !== null}
          onClick={() => run("publish")}
        >
          {busy === "publish" ? "…" : "Publish"}
        </button>
      </div>
      <div className="flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isDose ? "Dose note (required before publish)…" : "Optional rationale…"}
          className="w-full rounded-md border-2 border-border px-2 py-1 text-sm"
        />
      </div>
      {error ? <p className="text-caption text-destructive">{error}</p> : null}
      <p className="text-caption text-muted-foreground">
        Status: {status} · {isDose ? "doses approve one at a time" : "versioned + auditable"}
      </p>
    </div>
  );
}