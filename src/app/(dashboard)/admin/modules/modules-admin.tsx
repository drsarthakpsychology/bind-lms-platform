"use client";

import * as React from "react";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { CheckSquare, Eye, LockOpen, UserX, Users } from "lucide-react";

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
 * Admin modules — access-control system. Multi-select for bulk
 * publish/schedule/unpublish/cohort grant & revoke, plus per-module access
 * (who has it, revoke per student or revoke the cohort), and an explicit
 * "grant every module to one student" override.
 */
export function ModulesAdmin({ modules, students }: { modules: ModuleRow[]; students: Array<{ id: string; email: string }> }) {
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

        {/* grant to one student — select, not free-text email */}
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

      {/* module list — selecting one expands its access list */}
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
          <p className="text-caption font-medium">Override — grant every module to one student</p>
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
