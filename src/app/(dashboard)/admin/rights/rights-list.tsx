"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export interface RightsRow {
  id: string;
  title: string;
  authors: string[] | null;
  publisher: string | null;
  category: string;
  layer: string;
  priority: number;
  rights_status: string;
  author_consent: boolean | null;
  unlocks: string | null;
  updated_at: string | null;
}

export const RIGHTS_STATUSES = [
  "public_domain",
  "open_access",
  "licensed",
  "pending_licence",
  "not_started",
  "unlicensed",
  "acquisition_failed",
] as const;

export const LAYERS = ["clinical", "phenomenological", "style", "cultural", "reasoning"] as const;

/** 1 = get this first, so "priority 1" is the hottest. */
export const PRIORITY_LABELS: Record<number, string> = {
  1: "P1 · first",
  2: "P2",
  3: "P3",
};

const STATUS_LABELS: Record<string, string> = {
  public_domain: "Public domain",
  open_access: "Open access",
  licensed: "Licensed",
  pending_licence: "Pending licence",
  not_started: "Not started",
  unlicensed: "Unlicensed",
  acquisition_failed: "Acquisition failed",
};

const LAYER_LABELS: Record<string, string> = {
  clinical: "Clinical",
  phenomenological: "Phenomenological",
  style: "Style",
  cultural: "Cultural",
  reasoning: "Reasoning",
};

const CATEGORY_LABELS: Record<string, string> = {
  interviewing: "Interviewing",
  psychopathology: "Psychopathology",
  formulation: "Formulation",
  culture: "Culture",
  india: "India",
  sleep: "Sleep",
  anomalous: "Anomalous",
  trauma: "Trauma",
  addiction: "Addiction",
  narrative: "Narrative",
  fiction: "Fiction",
  transcripts: "Transcripts",
  guideline: "Guideline",
  reasoning: "Reasoning",
  conversation: "Conversation",
};

/** "free" = ingestible today (the licence gate in the ingester matches this). */
const FREE_STATUSES = new Set(["public_domain", "open_access"]);
/** "done" = ingestible and actually on the shelf. */
const INGESTIBLE = new Set(["public_domain", "open_access", "licensed"]);

function formatUpdated(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function selectClasses(busy: boolean) {
  return cn(
    "w-full max-w-44 rounded-md border-2 border-border bg-background px-2 py-1 text-caption font-medium",
    "focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
    busy && "opacity-60",
  );
}

/**
 * /admin/rights list — the acquisition tracker. A status select per row
 * POSTs the flip to /api/admin/rights; filters by status + layer; summary
 * counts up top (e.g. "12 licensed · 38 free · 51 pending").
 */
export function RightsList({ rows, loadError }: { rows: RightsRow[]; loadError: string | null }) {
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [layerFilter, setLayerFilter] = React.useState<string>("all");
  const [busyIds, setBusyIds] = React.useState<Set<string>>(new Set());
  const [statusOverrides, setStatusOverrides] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string | null>(loadError);

  /** Effective status = server row, overridden once a flip lands. */
  const statusOf = (r: RightsRow) => statusOverrides[r.id] ?? r.rights_status;

  const counts = React.useMemo(() => {
    const out: Record<string, number> = { total: rows.length };
    for (const r of rows) out[statusOf(r)] = (out[statusOf(r)] ?? 0) + 1;
    out.licensed = rows.filter((r) => statusOf(r) === "licensed").length;
    out.free = rows.filter((r) => FREE_STATUSES.has(statusOf(r))).length;
    out.pending = rows.filter((r) => !INGESTIBLE.has(statusOf(r))).length;
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, statusOverrides]);

  const filtered = React.useMemo(
    () =>
      rows.filter(
        (r) =>
          (statusFilter === "all" || statusOf(r) === statusFilter) &&
          (layerFilter === "all" || r.layer === layerFilter),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, statusFilter, layerFilter, statusOverrides],
  );

  async function setStatus(row: RightsRow, next: string) {
    if (busyIds.has(row.id) || next === statusOf(row)) return;
    setBusyIds((s) => new Set(s).add(row.id));
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/admin/rights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, updates: { rights_status: next } }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not save the status change.");
        haptic("warning");
        return;
      }
      setStatusOverrides((o) => ({ ...o, [row.id]: next }));
      haptic("success");
    } catch {
      setError("Network error.");
      haptic("warning");
    } finally {
      setBusyIds((s) => {
        const nextSet = new Set(s);
        nextSet.delete(row.id);
        return nextSet;
      });
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No titles in the registry yet</p>
        <p className="mt-1 text-small text-muted-foreground">
          {loadError ? `Could not load the registry (${loadError}).` : "Run `npm run seed-rights` to populate it."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary counts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border-2 border-border bg-card px-3 py-1.5 text-caption font-semibold hard-shadow-sm">
          {counts.total} total
        </span>
        <span className="rounded-md border-2 border-border bg-card px-3 py-1.5 text-caption font-semibold hard-shadow-sm">
          {counts.licensed} licensed
        </span>
        <span className="rounded-md border-2 border-border bg-card px-3 py-1.5 text-caption font-semibold hard-shadow-sm">
          {counts.free} free
        </span>
        <span className="rounded-md border-2 border-border bg-card px-3 py-1.5 text-caption font-semibold hard-shadow-sm">
          {counts.pending} pending
        </span>
        {statusFilter !== "all" ? (
          <span className="text-caption text-muted-foreground">
            {filtered.length} shown of {rows.length}
          </span>
        ) : null}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border-2 border-border bg-background px-2 py-1.5 text-caption font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by rights status"
        >
          <option value="all">All statuses</option>
          {RIGHTS_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]} ({counts[s] ?? 0})
            </option>
          ))}
        </select>
        <select
          value={layerFilter}
          onChange={(e) => setLayerFilter(e.target.value)}
          className="rounded-md border-2 border-border bg-background px-2 py-1.5 text-caption font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filter by layer"
        >
          <option value="all">All layers</option>
          {LAYERS.map((l) => (
            <option key={l} value={l}>
              {LAYER_LABELS[l] ?? l}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="text-small text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {/* Table */}
      <div className="overflow-x-auto rounded-md border-2 border-border bg-card">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-border text-caption text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Title</th>
              <th className="px-3 py-2 font-semibold">Authors</th>
              <th className="px-3 py-2 font-semibold">Publisher</th>
              <th className="px-3 py-2 font-semibold">Category</th>
              <th className="px-3 py-2 font-semibold">Layer</th>
              <th className="px-3 py-2 font-semibold">Priority</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 text-center font-semibold">Consent</th>
              <th className="px-3 py-2 font-semibold">Unlocks</th>
              <th className="px-3 py-2 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const busy = busyIds.has(r.id);
              const status = statusOf(r);
              return (
                <tr key={r.id} className="border-b border-border/60 align-top last:border-b-0">
                  <td className="px-3 py-2">
                    <p className="text-small font-medium">{r.title}</p>
                  </td>
                  <td className="px-3 py-2 text-small text-muted-foreground">
                    {(r.authors ?? []).length > 0 ? r.authors!.join(", ") : "—"}
                  </td>
                  <td className="px-3 py-2 text-small text-muted-foreground">
                    {r.publisher ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-caption">{CATEGORY_LABELS[r.category] ?? r.category}</td>
                  <td className="px-3 py-2 text-caption">{LAYER_LABELS[r.layer] ?? r.layer}</td>
                  <td className="px-3 py-2 text-caption font-semibold">
                    {PRIORITY_LABELS[r.priority] ?? `P${r.priority}`}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={status}
                      onChange={(e) => void setStatus(r, e.target.value)}
                      disabled={busy}
                      className={selectClasses(busy)}
                      aria-label={`Rights status for ${r.title}`}
                    >
                      {RIGHTS_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={cn(
                        "inline-block rounded-md border-2 border-border px-2 py-0.5 text-caption font-semibold",
                        r.author_consent ? "bg-green-100 text-green-900" : "bg-secondary text-muted-foreground",
                      )}
                      title={r.author_consent ? "Author consent on file" : "No author consent"}
                    >
                      {r.author_consent ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="max-w-52 px-3 py-2">
                    <p className="text-caption leading-snug text-muted-foreground">{r.unlocks ?? "—"}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-caption text-muted-foreground">
                    {formatUpdated(r.updated_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-center text-small text-muted-foreground">
            No titles match these filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}
