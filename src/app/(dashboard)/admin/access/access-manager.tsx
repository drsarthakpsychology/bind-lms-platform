"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, Search, ToggleLeft, ToggleRight, X } from "lucide-react";
import { resetFor, setFeatureFor, setScopeFor } from "./actions";
import type { ResetKey } from "@/lib/access/features";
import { cn } from "@/lib/utils";

export type AccessRow = {
  id: string;
  email: string;
  name: string | null;
  scope: "full" | "lectures_only";
  locked: boolean;
  cohortIds: string[];
  off: string[];
};

type Opt = { key: string; label: string };

/**
 * One table for every student. Tick rows (or "all shown"), then use the bar:
 * Full / Lectures only, switch a section off or on, or start an area again.
 */
export function AccessManager({
  rows,
  cohorts,
  features,
  resets,
  initialQuery,
  initialCohort,
}: {
  rows: AccessRow[];
  cohorts: { id: string; name: string; courseId: string | null }[];
  features: (Opt & { group: string })[];
  resets: Opt[];
  initialQuery: string;
  initialCohort: string;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState(initialQuery);
  const [cohort, setCohort] = React.useState(initialCohort);
  const [scopeFilter, setScopeFilter] = React.useState<"" | "full" | "lectures_only">("");
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [feature, setFeature] = React.useState(features[0]?.key ?? "");
  const [reset, setReset] = React.useState<string>(resets[0]?.key ?? "");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [sure, setSure] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  const cohortName = React.useMemo(() => new Map(cohorts.map((c) => [c.id, c.name])), [cohorts]);
  const featureName = React.useMemo(() => new Map(features.map((f) => [f.key, f.label])), [features]);
  const needle = q.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (!needle || `${r.name ?? ""} ${r.email}`.toLowerCase().includes(needle)) &&
      (!cohort || (cohort === "none" ? r.cohortIds.length === 0 : r.cohortIds.includes(cohort))) &&
      (!scopeFilter || r.scope === scopeFilter),
  );
  const allPicked = shown.length > 0 && shown.every((r) => picked.has(r.id));
  const ids = [...picked];

  const run = async (key: string, fn: () => Promise<{ error: string | null; done: number }>, ok: (n: number) => string) => {
    setBusy(key);
    setMsg(null);
    const res = await fn();
    setBusy(null);
    setSure(false);
    setMsg(res.error ? { ok: false, text: res.error } : { ok: true, text: ok(res.done) });
    if (!res.error) router.refresh();
  };

  const counts = { full: rows.filter((r) => r.scope === "full").length, lectures: rows.filter((r) => r.scope === "lectures_only").length };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search students"
            className="h-11 w-full rounded-2xl border-2 border-foreground bg-card pr-10 pl-10 text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
          {q ? (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-md hover:bg-muted">
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
        <select value={cohort} onChange={(e) => setCohort(e.target.value)} aria-label="Cohort" className="h-11 rounded-2xl border-2 border-foreground bg-card px-3 text-sm font-semibold">
          <option value="">Every cohort</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="none">In no cohort</option>
        </select>
        <select value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value as typeof scopeFilter)} aria-label="Access level" className="h-11 rounded-2xl border-2 border-foreground bg-card px-3 text-sm font-semibold">
          <option value="">Full and Lectures only</option>
          <option value="full">Full only ({counts.full})</option>
          <option value="lectures_only">Lectures only ({counts.lectures})</option>
        </select>
      </div>

      {/* Bulk bar */}
      <div className="sticky top-16 z-20 space-y-2 rounded-2xl border-2 border-foreground bg-brand p-3 text-brand-foreground hard-shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={allPicked}
              onChange={() => setPicked(allPicked ? new Set() : new Set(shown.map((r) => r.id)))}
              className="size-4 accent-[#cdf24b]"
              aria-label="Tick everyone shown"
            />
            {picked.size ? `${picked.size} ticked` : `Tick all ${shown.length}`}
          </label>
          {picked.size ? (
            <button type="button" onClick={() => setPicked(new Set())} className="text-xs font-semibold underline">
              Clear
            </button>
          ) : null}
          <span className="mx-1 hidden h-6 w-0.5 bg-brand-foreground/40 sm:block" aria-hidden />
          <button
            type="button"
            disabled={!picked.size || busy !== null}
            onClick={() => run("full", () => setScopeFor(ids, "full"), (n) => `${n} now have Full access.`)}
            className="h-9 rounded-md border-2 border-foreground bg-primary px-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {busy === "full" ? <Loader2 className="inline size-4 animate-spin" aria-hidden /> : null} Full access
          </button>
          <button
            type="button"
            disabled={!picked.size || busy !== null}
            onClick={() => run("lec", () => setScopeFor(ids, "lectures_only"), (n) => `${n} now have Lectures only.`)}
            className="h-9 rounded-md border-2 border-foreground bg-card px-3.5 text-sm font-bold text-foreground disabled:opacity-50"
          >
            {busy === "lec" ? <Loader2 className="inline size-4 animate-spin" aria-hidden /> : null} Lectures only
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={feature} onChange={(e) => setFeature(e.target.value)} aria-label="Section" className="h-9 max-w-56 rounded-md border-2 border-foreground bg-card px-2.5 text-sm font-bold text-foreground">
            {["Sections", "Practice tools"].map((g) => (
              <optgroup key={g} label={g}>
                {features
                  .filter((f) => f.group === g)
                  .map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            disabled={!picked.size || busy !== null}
            onClick={() => run("off", () => setFeatureFor(ids, feature, true), (n) => `${featureName.get(feature)} switched off for ${n}.`)}
            className="inline-flex h-9 items-center gap-1 rounded-md border-2 border-foreground bg-foreground px-3.5 text-sm font-bold text-background disabled:opacity-50"
          >
            <ToggleLeft className="size-4" aria-hidden /> Switch off
          </button>
          <button
            type="button"
            disabled={!picked.size || busy !== null}
            onClick={() => run("on", () => setFeatureFor(ids, feature, false), (n) => `${featureName.get(feature)} back on for ${n}.`)}
            className="inline-flex h-9 items-center gap-1 rounded-md border-2 border-foreground bg-card px-3.5 text-sm font-bold text-foreground disabled:opacity-50"
          >
            <ToggleRight className="size-4" aria-hidden /> Switch on
          </button>
          <span className="mx-1 hidden h-6 w-0.5 bg-brand-foreground/40 sm:block" aria-hidden />
          <select
            value={reset}
            onChange={(e) => {
              setReset(e.target.value);
              setSure(false);
            }}
            aria-label="What to start again"
            className="h-9 max-w-60 rounded-md border-2 border-foreground bg-card px-2.5 text-sm font-bold text-foreground"
          >
            {resets.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!picked.size || busy !== null}
            onClick={() => (sure ? run("reset", () => resetFor(ids, reset as ResetKey), (n) => `Started again for ${n}.`) : setSure(true))}
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-md border-2 px-3.5 text-sm font-bold disabled:opacity-50",
              sure ? "border-destructive bg-destructive text-white" : "border-foreground bg-card text-foreground",
            )}
          >
            <RotateCcw className="size-4" aria-hidden /> {sure ? `Yes, reset ${picked.size}` : "Start again"}
          </button>
        </div>
        {sure ? <p className="text-xs font-semibold">Starting again deletes their saved progress in that area. It can&apos;t be undone.</p> : null}
      </div>

      {msg ? (
        <p role="status" className={cn("rounded-xl border-2 px-3 py-2 text-sm font-semibold", msg.ok ? "border-foreground bg-muted" : "border-destructive bg-status-alert-bg text-status-alert-fg")}>
          {msg.text}
        </p>
      ) : null}

      {/* Rows */}
      {shown.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm font-semibold text-muted-foreground">Nobody matches.</p>
      ) : (
        <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          {shown.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5">
              <input
                type="checkbox"
                checked={picked.has(r.id)}
                onChange={() =>
                  setPicked((s) => {
                    const n = new Set(s);
                    if (n.has(r.id)) n.delete(r.id);
                    else n.add(r.id);
                    return n;
                  })
                }
                aria-label={`Tick ${r.email}`}
                className="size-4 accent-[#1d44d8]"
              />
              <Link href={`/admin/students/${r.id}`} className="min-w-0 flex-1 basis-48">
                <span className="block truncate text-sm font-bold hover:underline">{r.name || r.email.split("@")[0]}</span>
                <span className="block truncate text-caption text-muted-foreground">{r.email}</span>
              </Link>
              <span className="flex flex-wrap gap-1">
                {r.cohortIds.map((c) => (
                  <Link key={c} href={`/admin/cohorts/${c}`} className="rounded-full border-2 border-foreground/30 px-2 text-[0.7rem] font-bold hover:border-foreground">
                    {cohortName.get(c) ?? "Cohort"}
                  </Link>
                ))}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap rounded-full border-2 border-foreground px-2.5 py-0.5 text-xs font-bold",
                  r.scope === "full" ? "bg-primary text-primary-foreground" : "bg-card",
                )}
              >
                {r.scope === "full" ? "Full" : "Lectures only"}
              </span>
              {r.locked ? <span className="rounded-full border-2 border-destructive px-2 text-xs font-bold text-status-alert-fg">Locked</span> : null}
              {r.off.length ? (
                <span className="flex w-full flex-wrap gap-1 pl-7 sm:w-auto sm:pl-0">
                  {r.off.map((f) => (
                    <span key={f} className="rounded-full bg-foreground px-2 py-0.5 text-[0.7rem] font-bold text-background" title="Switched off">
                      {featureName.get(f) ?? f} off
                    </span>
                  ))}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
