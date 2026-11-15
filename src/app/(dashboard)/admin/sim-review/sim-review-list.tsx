"use client";

import * as React from "react";
import { ChevronDown, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { StatusPill } from "@/components/mobile/status-pill";
import { Empty, Notice, Status, btn, control } from "../_v2/kit";

interface ReviewRow {
  id: string;
  sessionId: string;
  studentEmail: string;
  overall: number | null;
  rubric: Record<string, unknown>;
  transcript: Array<{ role: string; content: string }>;
  createdAt: string;
  /** Existing faculty note, pre-filled so edits accumulate. */
  note?: string;
  /** Faculty-corrected overall score, if any. */
  correctedOverall?: number | null;
}

export function SimReviewList({ rows, v2 = false }: { rows: ReviewRow[]; v2?: boolean }) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [comments, setComments] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.note ?? ""])),
  );
  const [corrected, setCorrected] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((r) => [r.id, r.correctedOverall != null ? String(r.correctedOverall) : ""])),
  );
  const [saving, setSaving] = React.useState<Record<string, boolean>>({});
  const [saved, setSaved] = React.useState<Record<string, boolean>>({});
  const [error, setError] = React.useState<string | null>(null);

  if (rows.length === 0 && v2) return <Empty>No practice sessions yet. When students finish a Consulting Room session, the AI score and the transcript land here.</Empty>;

  if (rows.length === 0) {
    return (
      <div className="rounded-md border-2 border-border bg-card p-6 text-center">
        <p className="text-base font-medium">No simulated sessions yet</p>
        <p className="mt-1 text-small text-muted-foreground">
          Once students run the Consulting Room, their AI scores + transcripts land here for faculty review.
        </p>
      </div>
    );
  }

  async function saveComment(id: string, sessionId: string, originalOverall: number | null) {
    haptic("tap");
    setError(null);
    setSaving((s) => ({ ...s, [id]: true }));
    try {
      const note = (comments[id] ?? "").trim();
      if (!note) throw new Error("Write a comment first.");
      const correctedOverall = corrected[id]?.trim() === "" ? null : Number(corrected[id]);
      const res = await fetch("/api/admin/sim-corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, note, originalOverall, correctedOverall }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Failed to save");
      }
      setSaved((s) => ({ ...s, [id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [id]: false })), 1500);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  }

  if (v2) {
    const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
    return (
      <div className="flex min-w-0 flex-col gap-3">
        {error ? <Notice tone="alert">{error}</Notice> : null}
        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {rows.map((r) => {
            const isOpen = open === r.id;
            const overall = typeof r.overall === "number" ? r.overall.toFixed(1) : "No score";
            const panel = `sim-${r.id}`;
            return (
              <li key={r.id} className="min-w-0">
                <button
                  type="button"
                  data-sim-toggle
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => { setOpen(isOpen ? null : r.id); haptic("tap"); }}
                  className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-3 text-left outline-none transition-colors hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="min-w-0">
                    <span className="block type-body font-semibold [overflow-wrap:anywhere]">{r.studentEmail}</span>
                    <span className="block type-small text-muted-foreground">
                      {fmt(r.createdAt)} · {r.transcript.length} turns
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="type-body font-semibold type-num whitespace-nowrap">
                      {overall}
                      {typeof r.overall === "number" ? <span className="text-muted-foreground">/5</span> : null}
                    </span>
                    <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} aria-hidden />
                  </span>
                  <span className="col-span-2">
                    {r.correctedOverall != null ? <Status tone="ok">Checked by faculty, score {r.correctedOverall}</Status> : <Status tone="warn">AI score, not checked yet</Status>}
                  </span>
                </button>

                {isOpen ? (
                  <div id={panel} className="flex min-w-0 flex-col gap-4 pb-5 pt-1">
                    <div className="flex min-w-0 max-w-[65ch] flex-col gap-2">
                      {r.transcript.map((t, i) => (
                        <p key={i} className={cn("type-small [overflow-wrap:anywhere]", t.role === "student" ? "text-foreground" : "text-muted-foreground")}>
                          <span className="font-semibold text-foreground">{t.role === "student" ? "Student" : "Patient"}: </span>
                          {t.content}
                        </p>
                      ))}
                    </div>

                    <dl className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-10">
                      {[
                        ["Open to closed", r.rubric.open_closed_ratio],
                        ["Reflections", r.rubric.reflective_statements],
                        ["Early reassurance", r.rubric.premature_reassurance],
                        ["Risk questions", r.rubric.risk_timing],
                      ].map(([label, value]) => (
                        <div key={String(label)} className="flex min-w-0 flex-col">
                          <dt className="type-caption text-muted-foreground">{String(label)}</dt>
                          <dd className={cn("type-body font-semibold type-num", label === "Early reassurance" && Number(value) > 0 && "text-status-pending-fg")}>{String(value ?? "-")}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex min-w-0 max-w-[65ch] flex-col gap-2">
                      <label className="flex min-w-0 flex-col gap-1">
                        <span className="type-small font-semibold">Your comment</span>
                        <textarea
                          value={comments[r.id] ?? ""}
                          onChange={(e) => setComments((c) => ({ ...c, [r.id]: e.target.value }))}
                          rows={3}
                          placeholder="Add context, correct a score, praise a specific moment"
                          className={cn(control, "h-auto py-2 lg:h-auto")}
                        />
                      </label>
                      <div className="flex min-w-0 flex-wrap items-end gap-3">
                        <label className="flex flex-col gap-1">
                          <span className="type-small font-semibold">Corrected score</span>
                          <input
                            type="number"
                            min={0}
                            max={5}
                            step={0.5}
                            inputMode="decimal"
                            value={corrected[r.id] ?? ""}
                            onChange={(e) => setCorrected((c) => ({ ...c, [r.id]: e.target.value }))}
                            placeholder="-"
                            className={cn(control, "w-24 text-center type-num")}
                          />
                        </label>
                        <button type="button" disabled={saving[r.id]} onClick={() => void saveComment(r.id, r.sessionId, r.overall)} className={btn.primary}>
                          {saving[r.id] ? "Saving" : saved[r.id] ? "Saved" : "Save comment"}
                        </button>
                      </div>
                      <p className="type-caption text-muted-foreground">A correction also guides future scoring.</p>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const isOpen = open === r.id;
        const overall = typeof r.overall === "number" ? r.overall.toFixed(1) : "-";
        return (
          <div key={r.id} className="rounded-md border-2 border-border bg-card hard-shadow-sm">
            <button
              type="button"
              onClick={() => { setOpen(isOpen ? null : r.id); haptic("tap"); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link">
                <Sparkles className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-small font-medium">{r.studentEmail}</span>
                <span className="block text-caption text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()} · {r.transcript.length} turns
                </span>
              </span>
              <span className="text-numeric text-small font-semibold">{overall}<span className="text-muted-foreground">/5</span></span>
              {r.correctedOverall != null ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-caption font-medium text-link">
                  corrected
                </span>
              ) : (
                <StatusPill tone="warning" label="Not faculty reviewed" />
              )}
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} aria-hidden />
            </button>

            {isOpen ? (
              <div className="space-y-3 border-t border-border p-4">
                {/* transcript */}
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border bg-background p-3">
                  {r.transcript.map((t, i) => (
                    <p key={i} className={cn("text-small", t.role === "student" ? "text-foreground" : "italic text-muted-foreground")}>
                      <span className="font-semibold text-caption">{t.role === "student" ? "You" : "Patient"}: </span>
                      {t.content}
                    </p>
                  ))}
                </div>

                {/* rubric quick view */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <MiniStat label="Open:closed" value={String(r.rubric.open_closed_ratio ?? "-")} />
                  <MiniStat label="Reflective" value={String(r.rubric.reflective_statements ?? "-")} />
                  <MiniStat label="Premature reassure" value={String(r.rubric.premature_reassurance ?? "-")} warn={(r.rubric.premature_reassurance as number) > 0} />
                  <MiniStat label="Risk timing" value={String(r.rubric.risk_timing ?? "-")} />
                </div>

                {/* faculty comment */}
                <div className="flex items-start gap-2">
                  <MessageSquare className="mt-1 size-4 shrink-0 text-link" aria-hidden />
                  <div className="flex-1">
                    <p className="text-caption font-medium text-muted-foreground">
                      Faculty comment (sits on top of the AI score)
                    </p>
                    <textarea
                      value={comments[r.id] ?? ""}
                      onChange={(e) => setComments((c) => ({ ...c, [r.id]: e.target.value }))}
                      rows={2}
                      placeholder="Add context, correct a score, praise a specific moment…"
                      className="mt-1 w-full resize-none rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-2 text-caption text-muted-foreground">
                        Correct overall score to:
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.5}
                          value={corrected[r.id] ?? ""}
                          onChange={(e) => setCorrected((c) => ({ ...c, [r.id]: e.target.value }))}
                          placeholder="-"
                          className="w-16 rounded-md border-2 border-border bg-background px-2 py-1 text-center text-numeric text-small focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </label>
                      <span className="text-caption text-muted-foreground">
                        Your correction also guides future scoring.
                      </span>
                    </div>
                    {error ? <p className="mt-2 text-caption font-medium text-destructive">{error}</p> : null}
                    <button
                      type="button"
                      disabled={saving[r.id]}
                      onClick={() => void saveComment(r.id, r.sessionId, r.overall)}
                      className="mt-2 rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px active:hard-shadow-none disabled:opacity-50"
                    >
                      {saving[r.id] ? "Saving…" : saved[r.id] ? "Saved" : "Save comment"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function MiniStat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-md border-2 border-border p-2", warn && "bg-status-pending-bg")}>
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-numeric text-small font-semibold">{value}</p>
    </div>
  );
}
