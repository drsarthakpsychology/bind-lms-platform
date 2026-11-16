"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { Res } from "@/components/clinic/result";
import type { ClinicAllowanceBody, ClinicAllowanceRow, ClinicAllowances } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { Empty, Field, Notice, btn, control, table } from "../../_v2/kit";

/**
 * Leaves allowed: set or add for the whole cohort or the students ticked,
 * and change one student by hand with a note. The log of changes sits under
 * each name.
 */

/** The body a bulk change sends: no userIds means the whole cohort. */
export function bulkBody(cohortId: string, picked: string[], mode: "set" | "add", n: number, note: string): ClinicAllowanceBody {
  return { cohortId, ...(picked.length ? { userIds: picked } : {}), ...(mode === "set" ? { set: n } : { add: n }), ...(note.trim() ? { note: note.trim() } : {}) };
}

export function Allowances({ data, save, canWrite }: { data: ClinicAllowances; save: (body: ClinicAllowanceBody) => Promise<Res<{ changed: number }>>; canWrite: boolean }) {
  const router = useRouter();
  const [picked, setPicked] = React.useState<string[]>([]);
  const [mode, setMode] = React.useState<"set" | "add">("set");
  const [n, setN] = React.useState("");
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const all = data.rows.length > 0 && picked.length === data.rows.length;

  async function bulk(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(n);
    if (!Number.isInteger(v) || (mode === "set" && v < 0) || n === "") {
      setMsg({ ok: false, text: "Type a whole number." });
      return;
    }
    setBusy(true);
    const x = await save(bulkBody(data.cohortId, picked, mode, v, note)).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setMsg({ ok: true, text: `Changed for ${x.data.changed} ${x.data.changed === 1 ? "student" : "students"}.` });
    setN("");
    setNote("");
    setPicked([]);
    router.refresh();
  }

  if (!data.rows.length) return <Empty>No students in this cohort yet.</Empty>;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {canWrite ? (
        <form onSubmit={bulk} className="flex min-w-0 flex-col gap-3 border-y border-[var(--ds-hairline)] py-4">
          <p className="type-small font-semibold">{picked.length ? `For the ${picked.length} ticked` : "For the whole cohort"}</p>
          <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end">
            <div role="group" aria-label="Change" className="flex gap-1">
              {(["set", "add"] as const).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cn(btn.ghost, mode === m && "bg-[var(--ds-tint)] text-foreground")}>
                  {m === "set" ? "Set to" : "Add"}
                </button>
              ))}
            </div>
            <Field label="Leaves" className="md:w-28">
              <input inputMode="numeric" value={n} onChange={(e) => setN(e.target.value.replace(/[^\d-]/g, ""))} className={control} />
            </Field>
            <Field label="Note" className="md:w-72">
              <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className={control} />
            </Field>
            <button type="submit" disabled={busy} className={btn.primary}>
              {busy ? "Saving" : "Save"}
            </button>
          </div>
          {msg ? (
            <p role={msg.ok ? "status" : "alert"} className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
              {msg.text}
            </p>
          ) : null}
        </form>
      ) : (
        <Notice>View only. A Super Admin changes leaves.</Notice>
      )}

      <table className={table.root}>
        <thead>
          <tr>
            {canWrite ? (
              <th className={cn(table.th, "w-11")}>
                <input type="checkbox" aria-label="Tick everyone" checked={all} onChange={() => setPicked(all ? [] : data.rows.map((r) => r.userId))} className="size-5 accent-[var(--link)]" />
              </th>
            ) : null}
            <th className={table.th}>Student</th>
            <th className={cn(table.th, "text-right")}>Allowed</th>
            <th className={cn(table.th, "hidden text-right sm:table-cell")}>Used</th>
            <th className={cn(table.th, "hidden text-right sm:table-cell")}>Waiting</th>
            <th className={cn(table.th, "text-right")}>Left</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r) => (
            <AllowanceTr key={r.userId} r={r} cohortId={data.cohortId} canWrite={canWrite} picked={picked.includes(r.userId)} onPick={() => setPicked((p) => (p.includes(r.userId) ? p.filter((x) => x !== r.userId) : [...p, r.userId]))} save={save} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AllowanceTr({ r, cohortId, canWrite, picked, onPick, save }: { r: ClinicAllowanceRow; cohortId: string; canWrite: boolean; picked: boolean; onPick: () => void; save: (body: ClinicAllowanceBody) => Promise<Res<{ changed: number }>> }) {
  const router = useRouter();
  const [edit, setEdit] = React.useState(false);
  const [v, setV] = React.useState(String(r.balance.allowance));
  const [note, setNote] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const b = r.balance;
  const cols = canWrite ? 6 : 5;
  async function one(e: React.FormEvent) {
    e.preventDefault();
    const x = Number(v);
    if (!Number.isInteger(x) || x < 0) return setErr("Type a whole number.");
    setBusy(true);
    const res = await save({ cohortId, userIds: [r.userId], set: x, ...(note.trim() ? { note: note.trim() } : {}) }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!res.ok) return setErr(res.error);
    setEdit(false);
    setNote("");
    router.refresh();
  }
  return (
    <>
      <tr className={table.tr} aria-selected={picked || undefined}>
        {canWrite ? (
          <td className={table.td}>
            <input type="checkbox" aria-label={`Tick ${r.name ?? "student"}`} checked={picked} onChange={onPick} className="size-5 accent-[var(--link)]" />
          </td>
        ) : null}
        <td className={table.td}>
          <span className="font-semibold [overflow-wrap:anywhere]">{r.name ?? "Student"}</span>
          {r.roll ? <span className="ml-2 text-muted-foreground">{r.roll}</span> : null}
          {r.log.length ? (
            <details className="mt-1">
              <summary className="inline-flex min-h-11 cursor-pointer items-center type-caption font-semibold text-muted-foreground hover:text-foreground lg:min-h-0">Changes</summary>
              <ul className="type-caption text-muted-foreground">
                {r.log.map((l, i) => (
                  <li key={i} className="[overflow-wrap:anywhere]">
                    {l.at.slice(0, 10)}: {l.old ?? 0} to {l.new}
                    {l.note ? `, ${l.note}` : ""}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </td>
        <td className={cn(table.td, table.num)}>
          {canWrite ? (
            <button type="button" onClick={() => setEdit((e) => !e)} aria-expanded={edit} aria-label={`Change leaves for ${r.name ?? "student"}, now ${b.allowance}`} className={cn(btn.ghost, "ml-auto type-num underline decoration-dotted underline-offset-4")}>
              {b.allowance}
            </button>
          ) : (
            b.allowance
          )}
        </td>
        <td className={cn(table.td, table.num, "hidden sm:table-cell")}>{b.used}</td>
        <td className={cn(table.td, table.num, "hidden sm:table-cell")}>{b.pending}</td>
        <td className={cn(table.td, table.num, b.left <= 0 && "font-semibold text-status-alert-fg")}>{b.left}</td>
      </tr>
      {edit ? (
        <tr>
          <td colSpan={cols} className="border-b border-[var(--ds-hairline)] py-3">
            <form onSubmit={one} className="flex min-w-0 flex-col gap-2 md:flex-row md:items-end">
              <Field label="Leaves allowed" className="md:w-32">
                <input inputMode="numeric" value={v} onChange={(e) => setV(e.target.value.replace(/\D/g, ""))} className={control} />
              </Field>
              <Field label="Note" className="md:w-72">
                <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className={control} />
              </Field>
              <div className="flex gap-2">
                <button type="submit" disabled={busy} className={btn.ink}>
                  Save
                </button>
                <button type="button" onClick={() => setEdit(false)} className={btn.quiet}>
                  Cancel
                </button>
              </div>
              {err ? (
                <p role="alert" className="type-small text-status-alert-fg">
                  {err}
                </p>
              ) : null}
            </form>
          </td>
        </tr>
      ) : null}
    </>
  );
}
