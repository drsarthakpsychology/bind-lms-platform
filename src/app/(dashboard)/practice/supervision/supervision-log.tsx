"use client";

import * as React from "react";
import { ClipboardList } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { StatCard } from "@/components/design-system/stat-card";
import { EmptyState } from "@/components/design-system/empty-state";

export interface SupervisionEntry {
  id: string;
  activity: string;
  hours: number;
  date: string;
  supervisorName?: string;
  supervisorEmail?: string;
  competencyName?: string;
  signoffStatus: "pending" | "requested" | "signed" | "rejected";
}

const SIGN_OFF: Record<SupervisionEntry["signoffStatus"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-secondary text-muted-foreground" },
  requested: { label: "Sign-off requested", className: "bg-status-pending-bg text-status-pending-fg" },
  signed: { label: "Signed off", className: "bg-status-success-bg text-status-success-fg" },
  rejected: { label: "Rejected", className: "bg-status-alert-bg text-status-alert-fg" },
};

export function SupervisionLog({
  entries,
  competencies,
}: {
  entries: SupervisionEntry[];
  competencies: Array<{ key: string; name: string }>;
}) {
  const [activity, setActivity] = React.useState("");
  const [hours, setHours] = React.useState("1");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [supervisor, setSupervisor] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [competency, setCompetency] = React.useState("");
  const [transferNote, setTransferNote] = React.useState("");
  const [consentPromo, setConsentPromo] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [requestingId, setRequestingId] = React.useState<string | null>(null);

  const totalHours = entries.reduce((a, e) => a + (e.signoffStatus === "rejected" ? 0 : e.hours), 0);
  const signedHours = entries.filter((e) => e.signoffStatus === "signed").reduce((a, e) => a + e.hours, 0);

  async function requestSignoff(id: string) {
    setRequestingId(id);
    setError(null);
    try {
      const res = await fetch("/api/practice/supervision/signoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: id }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not request sign-off.");
        return;
      }
      haptic("success");
      window.location.reload();
    } catch {
      setError("Network error.");
    } finally {
      setRequestingId(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !activity.trim()) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/practice/supervision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: activity.trim(),
          hours: Number(hours),
          date,
          supervisorName: supervisor.trim() || undefined,
          supervisorEmail: email.trim() || undefined,
          competencyKey: competency || undefined,
          transferNote: transferNote.trim() || undefined,
          consentPromo,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error ?? "Could not save.");
        return;
      }
      setActivity("");
      setHours("1");
      setSupervisor("");
      setEmail("");
      setCompetency("");
      setTransferNote("");
      haptic("success");
      window.location.reload();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* summary */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total logged" value={`${totalHours.toFixed(1)}h`} />
        <StatCard label="Signed off" value={`${signedHours.toFixed(1)}h`} />
      </div>

      {/* log form */}
      <form onSubmit={submit} className="space-y-3 rounded-md border-2 border-border bg-card p-5 hard-shadow-sm">
        <p className="text-base font-semibold">Log a supervision contact hour</p>
        <div>
          <label htmlFor="sup-activity" className="text-caption font-medium text-muted-foreground">Activity</label>
          <input
            id="sup-activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            maxLength={1000}
            placeholder="e.g. Case review with Dr. Rao — formulation of the OCD case"
            className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="sup-hours" className="text-caption font-medium text-muted-foreground">Hours</label>
            <input
              id="sup-hours"
              type="number"
              min={0}
              max={200}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-numeric text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="sup-date" className="text-caption font-medium text-muted-foreground">Date</label>
            <input
              id="sup-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="sup-comp" className="text-caption font-medium text-muted-foreground">Competency (passport)</label>
            <select
              id="sup-comp"
              value={competency}
              onChange={(e) => setCompetency(e.target.value)}
              className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">— none —</option>
              {competencies.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sup-supervisor" className="text-caption font-medium text-muted-foreground">Supervisor</label>
            <input
              id="sup-supervisor"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              placeholder="Name"
              className="mt-1 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        {/* A9 transfer loop — the outcome measure */}
        <div className="rounded-md border border-border bg-secondary/30 p-3">
          <p className="text-caption font-semibold text-muted-foreground">The transfer loop — this is your outcome measure</p>
          <label htmlFor="transfer-note" className="mt-2 block text-caption font-medium text-muted-foreground">
            What did you try that you practised here — and what happened?
          </label>
          <textarea
            id="transfer-note"
            value={transferNote}
            onChange={(e) => setTransferNote(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="e.g. I used the open-question funnel from the Decoder in a real intake. The client opened up about the debt within two questions."
            className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="mt-2 flex items-start gap-2 text-caption text-muted-foreground">
            <input type="checkbox" checked={consentPromo} onChange={(e) => setConsentPromo(e.target.checked)} className="mt-0.5" />
            I consent to my transfer note being used anonymised in course materials (this is also the best marketing we will ever have).
          </label>
        </div>

        {error ? <p className="text-small text-status-alert-fg" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !activity.trim()}
          className="rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
        >
          {busy ? "Saving…" : "Log hours"}
        </button>
      </form>

      {/* history */}
      {entries.length === 0 ? (
        <EmptyState
          row
          icon={<ClipboardList className="size-4" aria-hidden />}
          title="No supervision hours logged yet"
          description="RCI-track supervision hours build your passport."
        />
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => {
            const so = SIGN_OFF[e.signoffStatus];
            return (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-md border-2 border-border bg-card px-4 py-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-small font-medium">{e.activity}</p>
                  <p className="text-caption text-muted-foreground">
                    {e.date} · {e.hours}h{e.supervisorName ? ` · ${e.supervisorName}` : ""}
                    {e.competencyName ? ` · ${e.competencyName}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-caption font-medium ${so.className}`}>{so.label}</span>
                  {e.signoffStatus === "pending" ? (
                    <button
                      type="button"
                      disabled={requestingId === e.id}
                      onClick={() => void requestSignoff(e.id)}
                      className="rounded-md border border-border px-2 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
                    >
                      {requestingId === e.id ? "Requesting…" : "Request sign-off"}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
