"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { CheckSquare, Eye, LockOpen, UserX, Users } from "lucide-react";
import { Notice, Status, btn, control, type Tone } from "../_v2/kit";

interface GrantedStudent {
  id: string;
  email: string;
}

interface ModuleRow {
  id: string;
  title: string;
  order: number;
  state: string;
  releaseAt: string | null;
  cohortGranted: boolean;
  grantedStudents: GrantedStudent[];
}

const STATE_CHIP: Record<string, string> = {
  draft: "bg-secondary text-muted-foreground",
  scheduled: "bg-status-pending-bg text-status-pending-fg",
  published: "bg-status-success-bg text-status-success-fg",
  archived: "bg-muted text-muted-foreground",
};

/**
 * Admin modules: access-control system. Multi-select for bulk
 * publish/schedule/unpublish/cohort grant & revoke, plus per-module access
 * (who has it, revoke per student or revoke the cohort), and an explicit
 * "grant every module to one student" override.
 */
export function ModulesAdmin({ modules, students, v2 = false }: { modules: ModuleRow[]; students: Array<{ id: string; email: string }>; v2?: boolean }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [grantTargetId, setGrantTargetId] = React.useState<string>("");
  const [overrideTargetId, setOverrideTargetId] = React.useState<string>("");

  const selectedModules = modules.filter((m) => selected.has(m.id));
  const single = selectedModules.length === 1 ? selectedModules[0] : null;

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function apply(body: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setError(null);
    haptic("tap");
    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  function bulk(action: "publish" | "schedule" | "unpublish" | "grant_cohort" | "revoke_cohort") {
    if (selected.size === 0) return;
    const body: Record<string, unknown> = { ids: [...selected] };
    if (action === "revoke_cohort") {
      body.action = "revoke";
      body.revokeScope = "cohort";
    } else {
      body.action = action;
    }
    void apply(body);
  }

  function grantToStudent() {
    if (selected.size === 0 || !grantTargetId) return;
    void apply({ action: "grant_cohort", ids: [...selected], targetStudentId: grantTargetId });
  }

  function revokeStudent(studentId: string) {
    if (!single) return;
    void apply({ action: "revoke", ids: [single.id], revokeScope: "student", targetStudentId: studentId });
  }

  function revokeCohort(moduleId: string) {
    void apply({ action: "revoke", ids: [moduleId], revokeScope: "cohort" });
  }

  function overrideAll() {
    if (!overrideTargetId) return;
    void apply({ action: "grant_cohort", ids: modules.map((m) => m.id), targetStudentId: overrideTargetId });
  }

  if (v2) {
    const STATE: Record<string, { tone: Tone; label: string }> = {
      draft: { tone: "quiet", label: "Draft" },
      scheduled: { tone: "info", label: "Scheduled" },
      published: { tone: "ok", label: "Published" },
      archived: { tone: "quiet", label: "Archived" },
    };
    const pick = (id: string, value: string, onChange: (v: string) => void, label: string, disabled?: boolean) => (
      <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className={cn(control, "w-full sm:w-auto sm:max-w-xs")}>
        <option value="">Choose a student</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>{s.email}</option>
        ))}
      </select>
    );
    return (
      <div className="flex min-w-0 flex-col gap-[var(--ds-6)]">
        {error ? <Notice tone="alert">{error}</Notice> : null}

        <div className="flex min-w-0 flex-col gap-3">
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {modules.map((m) => {
              const checked = selected.has(m.id);
              const isExpanded = single?.id === m.id;
              const st = STATE[m.state] ?? { tone: "quiet" as Tone, label: m.state };
              const meta = [
                m.cohortGranted ? "Whole cohort" : "No cohort access",
                m.grantedStudents.length > 0 ? `${m.grantedStudents.length} ${m.grantedStudents.length === 1 ? "student" : "students"} added by hand` : null,
                m.releaseAt ? `opens ${new Date(m.releaseAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}` : null,
              ].filter(Boolean).join(" · ");
              return (
                <li key={m.id} className={cn("min-w-0", checked && "bg-[color-mix(in_oklab,var(--link)_6%,transparent)]")}>
                  <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 py-2">
                    <label className="flex size-11 cursor-pointer items-center justify-center">
                      <input type="checkbox" checked={checked} onChange={() => toggle(m.id)} className="size-4 accent-[var(--link)]" aria-label={`Select ${m.title}`} />
                    </label>
                    <div className="min-w-0 py-1">
                      <p className="type-body font-semibold [overflow-wrap:anywhere]">
                        <span className="mr-2 type-small font-medium text-muted-foreground type-num">{m.order}</span>
                        {m.title}
                      </p>
                      <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{meta}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Status tone={st.tone}>{st.label}</Status>
                      <button type="button" onClick={() => setSelected(isExpanded ? new Set() : new Set([m.id]))} aria-expanded={isExpanded} className={cn(btn.ghost, "-mr-2 text-link")}>
                        Who has it
                      </button>
                    </div>
                  </div>
                  {isExpanded ? <AccessPanelV2 module={m} busy={busy} onRevokeStudent={revokeStudent} onRevokeCohort={() => revokeCohort(m.id)} /> : null}
                </li>
              );
            })}
          </ul>
        </div>

        {selected.size > 0 ? (
          <section aria-label="Change the selected modules" className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[3] -mx-4 flex min-w-0 flex-col gap-3 border-t border-[var(--ds-card-line)] bg-background px-4 py-3 md:bottom-0 md:mx-0 md:px-0">
            <p className="type-small font-semibold type-num">{selected.size} selected</p>
            <div className="flex min-w-0 flex-wrap gap-2">
              <button type="button" onClick={() => bulk("publish")} disabled={busy} className={btn.ink}>Publish</button>
              <button type="button" onClick={() => bulk("schedule")} disabled={busy} className={btn.quiet}>Schedule</button>
              <button type="button" onClick={() => bulk("unpublish")} disabled={busy} className={btn.quiet}>Unpublish</button>
              <button type="button" onClick={() => bulk("grant_cohort")} disabled={busy} className={btn.quiet}>Give the cohort access</button>
              <button type="button" onClick={() => bulk("revoke_cohort")} disabled={busy} className={btn.danger}>Take cohort access away</button>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {pick("grant-student", grantTargetId, setGrantTargetId, "Give one student the selected modules", busy)}
              <button type="button" onClick={grantToStudent} disabled={busy || !grantTargetId} className={btn.quiet}>
                Give this student access
              </button>
            </div>
          </section>
        ) : (
          <p className="type-small text-muted-foreground">Tick modules to publish, schedule or change who has them.</p>
        )}

        <section className="flex min-w-0 max-w-[65ch] flex-col gap-2">
          <h2 className="type-h3">Give one student every module</h2>
          <p className="type-small text-muted-foreground">For fee waivers or catching up. It adds the student to every module and leaves cohort access as it is.</p>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {pick("override-student", overrideTargetId, setOverrideTargetId, "Student to give every module")}
            <button type="button" onClick={overrideAll} disabled={busy || !overrideTargetId} className={btn.quiet}>
              <LockOpen aria-hidden /> Give every module
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* bulk action bar */}
      <div className="rounded-lg border-2 border-border bg-card p-4">
        <p className="text-caption text-muted-foreground">
          {selected.size} selected · bulk:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <BulkBtn onClick={() => bulk("publish")} label="Publish" busy={busy} />
          <BulkBtn onClick={() => bulk("schedule")} label="Schedule" busy={busy} />
          <BulkBtn onClick={() => bulk("unpublish")} label="Unpublish" busy={busy} />
          <BulkBtn onClick={() => bulk("grant_cohort")} label="Grant to cohort" busy={busy} />
          <BulkBtn onClick={() => bulk("revoke_cohort")} label="Revoke cohort access" busy={busy} />
        </div>

        {/* grant to one student: select, not free-text email */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t-2 border-border pt-3">
          <label className="text-caption text-muted-foreground" htmlFor="grant-student">
            Grant one student the selected modules:
          </label>
          <select
            id="grant-student"
            value={grantTargetId}
            onChange={(e) => setGrantTargetId(e.target.value)}
            disabled={busy || selected.size === 0}
            className="rounded-md border-2 border-border bg-background px-3 py-1.5 text-small focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            <option value="">Select a student…</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.email}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={grantToStudent}
            disabled={busy || selected.size === 0 || !grantTargetId}
            className="rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm disabled:opacity-50"
          >
            Grant
          </button>
        </div>

        {error ? <p className="mt-2 text-small text-destructive" role="alert">{error}</p> : null}
      </div>

      {/* module list: selecting one expands its access list */}
      <div className="space-y-2">
        {modules.map((m) => {
          const checked = selected.has(m.id);
          const isExpanded = single?.id === m.id;
          return (
            <div key={m.id}>
              <div className={cn("flex items-center gap-3 rounded-md border-2 border-border bg-card px-4 py-3", checked && "border-primary")}>
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
                    order {m.order}
                    {m.cohortGranted ? " · cohort access" : ""}
                    {m.grantedStudents.length > 0 ? ` · ${m.grantedStudents.length} student${m.grantedStudents.length === 1 ? "" : "s"}` : ""}
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
              {isExpanded ? (
                <AccessPanel
                  module={m}
                  busy={busy}
                  onRevokeStudent={revokeStudent}
                  onRevokeCohort={() => revokeCohort(m.id)}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* explicit override: grant every module to one student */}
      <div className="rounded-lg border-2 border-dashed border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <LockOpen className="size-4 text-muted-foreground" aria-hidden />
          <p className="text-caption font-medium">Override: grant every module to one student</p>
        </div>
        <p className="mt-1 text-caption text-muted-foreground">
          For fee waivers or catch-up only. Adds an individual grant to every module; it does not
          touch cohort-wide access.
        </p>
        <select
          value={overrideTargetId}
          onChange={(e) => setOverrideTargetId(e.target.value)}
          className="mt-2 w-full rounded-md border-2 border-border bg-background px-3 py-2 text-small focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a student…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.email}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={overrideAll}
          disabled={busy || !overrideTargetId}
          className="mt-2 rounded-md border-2 border-border bg-primary px-3 py-1.5 text-caption font-semibold text-primary-foreground hard-shadow-sm disabled:opacity-50"
        >
          Grant every module to this student
        </button>
      </div>
    </div>
  );
}

function AccessPanel({
  module,
  busy,
  onRevokeStudent,
  onRevokeCohort,
}: {
  module: ModuleRow;
  busy: boolean;
  onRevokeStudent: (studentId: string) => void;
  onRevokeCohort: () => void;
}) {
  return (
    <div className="ml-6 mt-2 rounded-md border-2 border-border bg-card p-3">
      <p className="text-eyebrow text-muted-foreground">Access control</p>

      {/* cohort indicator + revoke */}
      <div className="mt-2 flex items-center justify-between gap-2 rounded-md border-2 border-border bg-muted px-3 py-2">
        <span className="flex min-w-0 items-center gap-2 text-small">
          <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className={cn(module.cohortGranted ? "text-body-strong" : "text-muted-foreground")}>
            {module.cohortGranted ? "Whole cohort has access" : "No cohort-wide access"}
          </span>
        </span>
        {module.cohortGranted ? (
          <button
            type="button"
            onClick={onRevokeCohort}
            disabled={busy}
            className="flex shrink-0 items-center gap-1 rounded-md border-2 border-border px-2 py-1 text-caption font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
          >
            <UserX className="size-3.5" aria-hidden /> Revoke cohort
          </button>
        ) : null}
      </div>

      {/* individual grants + per-row revoke */}
      <p className="mt-3 text-caption text-muted-foreground">
        Individual grants ({module.grantedStudents.length})
      </p>
      {module.grantedStudents.length === 0 ? (
        <p className="mt-1 text-caption text-muted-foreground">No students have individual access.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {module.grantedStudents.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-1.5">
              <span className="min-w-0 truncate text-small">{s.email}</span>
              <button
                type="button"
                onClick={() => onRevokeStudent(s.id)}
                disabled={busy}
                className="flex shrink-0 items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-caption font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
              >
                <UserX className="size-3" aria-hidden /> Revoke
              </button>
            </li>
          ))}
        </ul>
      )}
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

/** v2: who has one module, with a remove button per student. */
function AccessPanelV2({ module, busy, onRevokeStudent, onRevokeCohort }: { module: ModuleRow; busy: boolean; onRevokeStudent: (studentId: string) => void; onRevokeCohort: () => void }) {
  return (
    <div className="ml-11 flex min-w-0 flex-col gap-2 pb-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 type-small">
          <Users className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          {module.cohortGranted ? "The whole cohort has access" : "No cohort access"}
        </span>
        {module.cohortGranted ? (
          <button type="button" onClick={onRevokeCohort} disabled={busy} className={btn.danger}>
            <UserX aria-hidden /> Take cohort access away
          </button>
        ) : null}
      </div>
      {module.grantedStudents.length === 0 ? (
        <p className="type-small text-muted-foreground">Nobody added by hand.</p>
      ) : (
        <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {module.grantedStudents.map((s) => (
            <li key={s.id} className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1.5">
              <span className="min-w-0 type-small [overflow-wrap:anywhere]">{s.email}</span>
              <button type="button" onClick={() => onRevokeStudent(s.id)} disabled={busy} className={btn.ghost} aria-label={`Remove ${s.email}`}>
                <UserX aria-hidden /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
