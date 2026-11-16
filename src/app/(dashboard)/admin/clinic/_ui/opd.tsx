"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { BATCH_LABEL, WEEKDAYS, dayShort } from "@/components/clinic/format";
import type { Res } from "@/components/clinic/result";
import type {
  ClinicAdminBatchBody,
  ClinicBatch,
  ClinicExtraBody,
  ClinicMoveBody,
  ClinicOpdSettings,
  ClinicPlan,
  ClinicPlanEntry,
  ClinicPublishBody,
  ClinicPublishResult,
  ClinicQuotaBody,
  ClinicQuotas,
} from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { holidaysFrom, planRows, seatsFrom } from "./opd-logic";
import { Empty, Field, More, Notice, Tag, btn, control, table } from "../../_v2/kit";

/**
 * OPD: seats per weekday and batch, the date range and cases per visit;
 * each student's cases (base plus paid extras) and batch; Generate a draft
 * timetable, look at it as a calendar (day by batch, with names), move a
 * student, then Publish.
 */

export type OpdAdminActions = {
  saveSettings: (body: ClinicOpdSettings) => Promise<Res<ClinicOpdSettings>>;
  setQuota: (body: ClinicQuotaBody) => Promise<Res<{ changed: number }>>;
  addExtra: (body: ClinicExtraBody) => Promise<Res<unknown>>;
  setBatch: (body: ClinicAdminBatchBody) => Promise<Res<unknown>>;
  generate: (cohortId: string) => Promise<Res<ClinicPlan>>;
  move: (body: ClinicMoveBody) => Promise<Res<ClinicPlan>>;
  publish: (body: ClinicPublishBody) => Promise<Res<ClinicPublishResult>>;
  discard: (cohortId: string) => Promise<Res<unknown>>;
};

const fail = () => ({ ok: false as const, error: "Could not reach the server." });
const ORDER = [1, 2, 3, 4, 5, 6, 0];
const BATCHES: ClinicBatch[] = ["morning", "evening"];



/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export function OpdSettingsForm({ s, save, canWrite }: { s: ClinicOpdSettings; save: OpdAdminActions["saveSettings"]; canWrite: boolean }) {
  const router = useRouter();
  const [grid, setGrid] = React.useState(() => Object.fromEntries(ORDER.map((w) => [String(w), { morning: String(s.seats[String(w)]?.morning ?? ""), evening: String(s.seats[String(w)]?.evening ?? "") }])));
  const [startDate, setStart] = React.useState(s.startDate ?? "");
  const [endDate, setEnd] = React.useState(s.endDate ?? "");
  const [perVisit, setPerVisit] = React.useState(String(s.casesPerVisit));
  const [late, setLate] = React.useState(String(s.lateMinutes));
  const [freeze, setFreeze] = React.useState(String(s.freezeDays));
  const [holidays, setHolidays] = React.useState(s.holidays.join("\n"));
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (startDate && endDate && endDate < startDate) return setMsg({ ok: false, text: "The last day is before the first." });
    setBusy(true);
    const x = await save({
      cohortId: s.cohortId,
      seats: seatsFrom(grid),
      casesPerVisit: Math.max(1, Math.floor(Number(perVisit) || 1)),
      startDate: startDate || null,
      endDate: endDate || null,
      lateMinutes: Math.max(0, Math.floor(Number(late) || 0)),
      holidays: holidaysFrom(holidays),
      freezeDays: Math.max(0, Math.floor(Number(freeze) || 0)),
    }).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setMsg({ ok: true, text: "Saved." });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-col gap-5">
      <fieldset disabled={!canWrite} className="flex min-w-0 flex-col gap-5">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="First day">
            <input type="date" value={startDate} onChange={(e) => setStart(e.target.value)} className={control} />
          </Field>
          <Field label="Last day">
            <input type="date" value={endDate} onChange={(e) => setEnd(e.target.value)} className={control} />
          </Field>
          <Field label="Cases per visit">
            <input inputMode="numeric" value={perVisit} onChange={(e) => setPerVisit(e.target.value.replace(/\D/g, ""))} className={control} />
          </Field>
          <Field label="Late after (minutes)">
            <input inputMode="numeric" value={late} onChange={(e) => setLate(e.target.value.replace(/\D/g, ""))} className={control} />
          </Field>
          <Field label="Keep days fixed (days ahead)" hint="Generate again leaves these alone.">
            <input inputMode="numeric" value={freeze} onChange={(e) => setFreeze(e.target.value.replace(/\D/g, ""))} className={control} />
          </Field>
        </div>

        <div className="min-w-0">
          <p className="pb-2 type-small font-semibold">Seats</p>
          <table className={cn(table.root, "max-w-md")}>
            <thead>
              <tr>
                <th className={table.th}>Day</th>
                {BATCHES.map((b) => (
                  <th key={b} className={cn(table.th, "text-right")}>
                    {BATCH_LABEL[b]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDER.map((w) => (
                <tr key={w}>
                  <td className={table.td}>{WEEKDAYS[w]}</td>
                  {BATCHES.map((b) => (
                    <td key={b} className={cn(table.td, "text-right")}>
                      <input
                        aria-label={`${WEEKDAYS[w]} ${BATCH_LABEL[b].toLowerCase()} seats`}
                        inputMode="numeric"
                        value={grid[String(w)][b]}
                        placeholder="0"
                        onChange={(e) => setGrid((g) => ({ ...g, [String(w)]: { ...g[String(w)], [b]: e.target.value.replace(/\D/g, "") } }))}
                        className={cn(control, "ml-auto w-20 text-right type-num")}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Field label="Holidays" hint="One date per line, like 2026-12-25." className="max-w-md">
          <textarea value={holidays} onChange={(e) => setHolidays(e.target.value)} rows={3} className={cn(control, "h-auto min-h-24 py-2 font-mono")} />
        </Field>
      </fieldset>
      {canWrite ? (
        <button type="submit" disabled={busy} className={cn(btn.ink, "self-start")}>
          {busy ? "Saving" : "Save settings"}
        </button>
      ) : null}
      {msg ? (
        <p role={msg.ok ? "status" : "alert"} className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
          {msg.text}
        </p>
      ) : null}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Cases (quotas) and batch                                            */
/* ------------------------------------------------------------------ */

export function QuotaTable({ data, actions, canWrite }: { data: ClinicQuotas; actions: Pick<OpdAdminActions, "setQuota" | "addExtra" | "setBatch">; canWrite: boolean }) {
  const router = useRouter();
  const [picked, setPicked] = React.useState<string[]>([]);
  const [base, setBase] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const all = data.rows.length > 0 && picked.length === data.rows.length;

  async function bulk(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(base);
    if (base === "" || !Number.isInteger(n) || n < 0) return setMsg({ ok: false, text: "Type a whole number." });
    setBusy(true);
    const x = await actions.setQuota({ cohortId: data.cohortId, ...(picked.length ? { userIds: picked } : {}), base: n }).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setMsg({ ok: true, text: `Changed for ${x.data.changed} ${x.data.changed === 1 ? "student" : "students"}.` });
    setBase("");
    setPicked([]);
    router.refresh();
  }

  if (!data.rows.length) return <Empty>No students in this cohort yet.</Empty>;
  return (
    <div className="flex min-w-0 flex-col gap-4">
      {canWrite ? (
        <form onSubmit={bulk} className="flex min-w-0 flex-col gap-2 md:flex-row md:items-end">
          <Field label={picked.length ? `Cases to do, for the ${picked.length} ticked` : "Cases to do, for the whole cohort"} className="md:w-72">
            <input inputMode="numeric" value={base} onChange={(e) => setBase(e.target.value.replace(/\D/g, ""))} className={control} />
          </Field>
          <button type="submit" disabled={busy} className={btn.ink}>
            Set cases
          </button>
          {msg ? (
            <p role={msg.ok ? "status" : "alert"} className={cn("type-small md:pb-2", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
              {msg.text}
            </p>
          ) : null}
        </form>
      ) : null}
      <table className={table.root}>
        <thead>
          <tr>
            {canWrite ? (
              <th className={cn(table.th, "w-11")}>
                <input type="checkbox" aria-label="Tick everyone" checked={all} onChange={() => setPicked(all ? [] : data.rows.map((r) => r.userId))} className="size-5 accent-[var(--link)]" />
              </th>
            ) : null}
            <th className={table.th}>Student</th>
            <th className={cn(table.th, "hidden md:table-cell")}>Batch</th>
            <th className={cn(table.th, "text-right")}>Done</th>
            <th className={cn(table.th, "hidden text-right sm:table-cell")}>Visits</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r) => (
            <QuotaTr key={r.userId} r={r} cohortId={data.cohortId} canWrite={canWrite} picked={picked.includes(r.userId)} onPick={() => setPicked((p) => (p.includes(r.userId) ? p.filter((x) => x !== r.userId) : [...p, r.userId]))} actions={actions} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuotaTr({ r, cohortId, canWrite, picked, onPick, actions }: { r: ClinicQuotas["rows"][number]; cohortId: string; canWrite: boolean; picked: boolean; onPick: () => void; actions: Pick<OpdAdminActions, "setQuota" | "addExtra" | "setBatch"> }) {
  const router = useRouter();
  const [count, setCount] = React.useState("");
  const [note, setNote] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const q = r.quota;
  async function run(p: Promise<Res<unknown>>) {
    setBusy(true);
    setErr(null);
    const x = await p.catch(fail);
    setBusy(false);
    if (!x.ok) setErr(x.error);
    else router.refresh();
    return x.ok;
  }
  return (
    <tr className={table.tr} aria-selected={picked || undefined}>
      {canWrite ? (
        <td className={cn(table.td, "align-top")}>
          <input type="checkbox" aria-label={`Tick ${r.name ?? "student"}`} checked={picked} onChange={onPick} className="mt-1 size-5 accent-[var(--link)]" />
        </td>
      ) : null}
      <td className={cn(table.td, "align-top")}>
        <span className="font-semibold [overflow-wrap:anywhere]">{r.name ?? "Student"}</span>
        {r.roll ? <span className="ml-2 text-muted-foreground">{r.roll}</span> : null}
        <span className="block text-muted-foreground md:hidden">{r.batch ? BATCH_LABEL[r.batch] : "No batch"}</span>
        {q.extras.length ? (
          <span className="block type-caption text-muted-foreground [overflow-wrap:anywhere]">
            {q.base} plus {q.extras.map((e) => `${e.count}${e.note ? ` (${e.note})` : ""}`).join(", ")}
          </span>
        ) : null}
        {canWrite ? (
          <More summary="Add cases or change batch" className="mt-1 border-t-0 pt-0">
            <div className="flex min-w-0 flex-col gap-3 pb-1">
              <form
                className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const n = Number(count);
                  if (!Number.isInteger(n) || n <= 0) return setErr("Type how many cases to add.");
                  if (await run(actions.addExtra({ cohortId, userId: r.userId, count: n, note: note.trim() || undefined }))) {
                    setCount("");
                    setNote("");
                  }
                }}
              >
                <Field label="Add cases" className="sm:w-28">
                  <input inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))} className={control} />
                </Field>
                <Field label="Note" className="sm:w-56">
                  <input value={note} placeholder="paid 12 Nov" onChange={(e) => setNote(e.target.value)} maxLength={120} className={control} />
                </Field>
                <button type="submit" disabled={busy} className={btn.quiet}>
                  Add
                </button>
              </form>
              <div role="group" aria-label={`Batch for ${r.name ?? "student"}`} className="flex flex-wrap items-center gap-1">
                <span className="mr-1 type-small font-semibold">Batch</span>
                {BATCHES.map((b) => (
                  <button key={b} type="button" disabled={busy} aria-pressed={r.batch === b} onClick={() => r.batch !== b && run(actions.setBatch({ cohortId, userId: r.userId, batch: b }))} className={cn(btn.ghost, r.batch === b && "bg-[var(--ds-tint)] text-foreground")}>
                    {BATCH_LABEL[b]}
                  </button>
                ))}
              </div>
              {err ? (
                <p role="alert" className="type-small text-status-alert-fg">
                  {err}
                </p>
              ) : null}
            </div>
          </More>
        ) : null}
      </td>
      <td className={cn(table.td, "hidden align-top md:table-cell")}>{r.batch ? BATCH_LABEL[r.batch] : <Tag tone="warn">No batch</Tag>}</td>
      <td className={cn(table.td, table.num, "align-top")}>
        {q.done} of {q.total}
      </td>
      <td className={cn(table.td, table.num, "hidden align-top sm:table-cell")}>{r.visitsPlanned}</td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Plan: generate, calendar, move, publish                             */
/* ------------------------------------------------------------------ */

type Picked = { entry: ClinicPlanEntry; date: string; batch: ClinicBatch } | null;


export function OpdPlan({ plan, actions, canWrite }: { plan: ClinicPlan; actions: Pick<OpdAdminActions, "generate" | "move" | "publish" | "discard">; canWrite: boolean }) {
  const router = useRouter();
  const [p, setP] = React.useState(plan);
  const [picked, setPicked] = React.useState<Picked>(null);
  const [busy, setBusy] = React.useState(false);
  const [notify, setNotify] = React.useState(true);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [full, setFull] = React.useState<{ date: string; batch: ClinicBatch } | null>(null);
  const draft = p.state === "draft";
  const rows = planRows(p);

  async function moveTo(date: string, batch: ClinicBatch, force = false) {
    if (!picked) return;
    if (picked.date === date && picked.batch === batch) return setPicked(null);
    setBusy(true);
    setMsg(null);
    const x = await actions.move({ assignmentId: picked.entry.assignmentId, date, batch, ...(force ? { force: true } : {}) }).catch(fail);
    setBusy(false);
    if (!x.ok) {
      // A full day: offer to go over the seats once.
      if (!force && /full/i.test(x.error)) setFull({ date, batch });
      setMsg({ ok: false, text: x.error });
      return;
    }
    setFull(null);
    setP(x.data);
    setPicked(null);
    setMsg({ ok: true, text: `Moved ${picked.entry.name ?? "the student"} to ${dayShort(date)}, ${BATCH_LABEL[batch].toLowerCase()}.` });
  }

  async function generate() {
    setBusy(true);
    setMsg(null);
    const x = await actions.generate(p.cohortId).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setP(x.data);
    setMsg({ ok: true, text: "Draft ready. Check it, move anyone you need to, then publish." });
  }

  async function publish() {
    if (!window.confirm(notify ? "Publish these OPD days and tell the students?" : "Publish these OPD days?")) return;
    setBusy(true);
    const x = await actions.publish({ cohortId: p.cohortId, notify }).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setMsg({ ok: true, text: `Published ${x.data.published} OPD days${x.data.notified ? `, told ${x.data.notified} students` : ""}.` });
    router.refresh();
  }

  async function discard() {
    if (!window.confirm("Throw this draft away?")) return;
    setBusy(true);
    const x = await actions.discard(p.cohortId).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    router.refresh();
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {canWrite ? (
          <button type="button" disabled={busy} onClick={generate} className={draft ? btn.quiet : btn.primary}>
            {p.hasDraft || p.days.length ? "Generate again" : "Generate draft"}
          </button>
        ) : null}
        {canWrite && draft ? (
          <>
            <button type="button" disabled={busy} onClick={publish} className={btn.primary}>
              Publish
            </button>
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 px-1">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="size-5 accent-[var(--link)]" />
              <span className="type-small font-semibold">Tell students</span>
            </label>
            <button type="button" disabled={busy} onClick={discard} className={btn.danger}>
              Throw draft away
            </button>
          </>
        ) : null}
        <span className="type-small text-muted-foreground">{draft ? "Draft, not seen by students" : p.days.length ? "Published" : ""}</span>
      </div>
      <div aria-live="polite" className="min-w-0">
        {msg ? <p className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>{msg.text}</p> : null}
        {full && picked ? (
          <button type="button" disabled={busy} onClick={() => moveTo(full.date, full.batch, true)} className={cn(btn.quiet, "mt-2")}>
            Move anyway (over the seats)
          </button>
        ) : null}
      </div>

      {p.short.length ? (
        <Notice>
          Not enough seats for{" "}
          {p.short.map((s, i) => (
            <span key={s.userId}>
              {i ? ", " : ""}
              {s.name ?? "a student"} ({s.visits} {s.visits === 1 ? "visit" : "visits"} short)
            </span>
          ))}
          .
        </Notice>
      ) : null}
      {p.noBatch.length ? (
        <Notice>
          No batch yet, so left out: {p.noBatch.map((s) => s.name ?? "a student").join(", ")}.
        </Notice>
      ) : null}

      {picked ? (
        <p role="status" className="flex flex-wrap items-center gap-2 type-small font-semibold">
          Moving {picked.entry.name ?? "a student"} from {dayShort(picked.date)}, {BATCH_LABEL[picked.batch].toLowerCase()}. Pick the new day below.
          <button type="button" onClick={() => setPicked(null)} className={btn.ghost}>
            Stop
          </button>
        </p>
      ) : null}

      {rows.length ? (
        <table className={table.root}>
          <thead>
            <tr>
              <th className={cn(table.th, "w-28")}>Day</th>
              {BATCHES.map((b) => (
                <th key={b} className={table.th}>
                  {BATCH_LABEL[b]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.date} className="align-top">
                <td className={cn(table.td, "align-top")}>
                  <span className="font-semibold type-num">{dayShort(d.date)}</span>
                </td>
                {BATCHES.map((b) => {
                  const cell = d[b];
                  const over = cell.people.length > cell.seats;
                  return (
                    <td
                      key={b}
                      className={cn(table.td, "align-top", picked && "bg-[color-mix(in_oklab,var(--link)_5%,transparent)]")}
                      onDragOver={(e) => canWrite && picked && e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        void moveTo(d.date, b);
                      }}
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className={cn("type-caption type-num text-muted-foreground", over && "font-semibold text-status-alert-fg")}>
                          {cell.people.length} of {cell.seats} {cell.seats === 1 ? "seat" : "seats"}
                        </span>
                        <ul className="flex min-w-0 flex-wrap gap-1">
                          {cell.people.map((e) => {
                            const on = picked?.entry.assignmentId === e.assignmentId;
                            return (
                              <li key={e.assignmentId} className="min-w-0">
                                {canWrite ? (
                                  <button
                                    type="button"
                                    draggable
                                    onDragStart={() => setPicked({ entry: e, date: d.date, batch: b })}
                                    aria-pressed={on}
                                    aria-label={`${e.name ?? "Student"}${e.source === "kept" ? ", kept" : e.source === "moved" ? ", moved" : ""}. Move`}
                                    onClick={() => setPicked(on ? null : { entry: e, date: d.date, batch: b })}
                                    className={cn(
                                      "inline-flex min-h-11 max-w-full items-center rounded-md border px-2 text-left type-small outline-hidden transition-colors duration-[var(--ds-state)] focus-visible:ring-2 focus-visible:ring-ring lg:min-h-8 [overflow-wrap:anywhere]",
                                      on ? "border-foreground bg-foreground text-background" : e.source === "new" ? "border-[var(--ds-card-line)] bg-background hover:border-foreground" : "border-transparent bg-[var(--ds-tint)] hover:border-foreground",
                                    )}
                                  >
                                    {e.name ?? "Student"}
                                  </button>
                                ) : (
                                  <span className="inline-flex rounded-md bg-[var(--ds-tint)] px-2 py-1 type-small [overflow-wrap:anywhere]">{e.name ?? "Student"}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        {picked && canWrite && !(picked.date === d.date && picked.batch === b) && (cell.seats > 0 || cell.people.length > 0) ? (
                          <button type="button" disabled={busy} onClick={() => moveTo(d.date, b)} className={cn(btn.ghost, "self-start text-link")}>
                            Move here
                          </button>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Empty>{canWrite ? "No OPD days yet. Set seats and the date range, then generate a draft." : "No OPD days yet."}</Empty>
      )}
      {draft && rows.length ? <p className="type-caption text-muted-foreground">Outlined names are new in this draft. Filled ones were already published or moved.</p> : null}
    </div>
  );
}

