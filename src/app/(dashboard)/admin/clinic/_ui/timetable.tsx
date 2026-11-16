"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { KIND_LABEL, WEEKDAYS, addDays, dayLong, dayShort, timeRange } from "@/components/clinic/format";
import type { Res } from "@/components/clinic/result";
import type { ClinicApplyBody, ClinicApplyResult, ClinicDayNoteBody, ClinicKind, ClinicSession, ClinicSessionBody, ClinicSessionPatch, ClinicSlot, ClinicSlotBody } from "@/lib/clinic/types";
import { CLINIC_KINDS } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { Block, Empty, Field, More, Rows, RowItem, Status, btn, control } from "../../_v2/kit";

/**
 * Timetable: the weekly pattern (set once), making sessions from it for a
 * date range, and the week's real sessions with one-offs, moves, cancels and
 * a short note on a day.
 */

export type TimetableActions = {
  saveSlot: (id: string | null, body: ClinicSlotBody) => Promise<Res<ClinicSlot>>;
  deleteSlot: (id: string) => Promise<Res<unknown>>;
  apply: (body: ClinicApplyBody) => Promise<Res<ClinicApplyResult>>;
  addSession: (body: ClinicSessionBody) => Promise<Res<ClinicSession>>;
  patchSession: (id: string, patch: ClinicSessionPatch) => Promise<Res<ClinicSession>>;
  saveNote: (body: ClinicDayNoteBody) => Promise<Res<unknown>>;
};

/** Monday first, Sunday last; each day's slots by start time. */
export function slotsByDay(slots: ClinicSlot[]): { weekday: number; slots: ClinicSlot[] }[] {
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => ({ weekday, slots: slots.filter((s) => s.weekday === weekday).sort((a, b) => a.start.localeCompare(b.start)) })).filter((d) => d.slots.length);
}

/** OPD kinds are not compulsory for everyone (only students given that day); classes are. */
export function defaultCompulsory(kind: ClinicKind): boolean {
  return kind !== "opd_morning" && kind !== "opd_evening";
}

type Draft = { weekday: number; date: string; start: string; end: string; kind: ClinicKind; title: string; place: string; onlineLink: string; compulsory: boolean };

function emptyDraft(date: string): Draft {
  return { weekday: 1, date, start: "10:00", end: "13:00", kind: "class", title: "", place: "", onlineLink: "", compulsory: true };
}

function DraftFields({ d, set, mode }: { d: Draft; set: (d: Draft) => void; mode: "slot" | "session" }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {mode === "slot" ? (
        <Field label="Day">
          <select value={d.weekday} onChange={(e) => set({ ...d, weekday: Number(e.target.value) })} className={control}>
            {[1, 2, 3, 4, 5, 6, 0].map((w) => (
              <option key={w} value={w}>
                {WEEKDAYS[w]}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Date">
          <input type="date" value={d.date} onChange={(e) => set({ ...d, date: e.target.value })} className={control} />
        </Field>
      )}
      <Field label="Starts">
        <input type="time" value={d.start} onChange={(e) => set({ ...d, start: e.target.value })} className={control} />
      </Field>
      <Field label="Ends">
        <input type="time" value={d.end} onChange={(e) => set({ ...d, end: e.target.value })} className={control} />
      </Field>
      <Field label="Kind">
        <select value={d.kind} onChange={(e) => { const kind = e.target.value as ClinicKind; set({ ...d, kind, compulsory: defaultCompulsory(kind) }); }} className={control}>
          {CLINIC_KINDS.map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Title" className="sm:col-span-2">
        <input value={d.title} placeholder={KIND_LABEL[d.kind]} onChange={(e) => set({ ...d, title: e.target.value })} maxLength={80} className={control} />
      </Field>
      <Field label="Place" className="sm:col-span-2">
        <input value={d.place} onChange={(e) => set({ ...d, place: e.target.value })} maxLength={120} className={control} />
      </Field>
      <Field label="Online link" className="sm:col-span-2">
        <input type="url" inputMode="url" value={d.onlineLink} onChange={(e) => set({ ...d, onlineLink: e.target.value })} placeholder="https://" className={control} />
      </Field>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end sm:col-span-2">
        <input type="checkbox" checked={d.compulsory} onChange={(e) => set({ ...d, compulsory: e.target.checked })} className="size-5 accent-[var(--link)]" />
        <span className="type-small font-semibold">Everyone must attend</span>
      </label>
    </div>
  );
}

function fail(): { ok: false; error: string } {
  return { ok: false, error: "Could not reach the server." };
}

export function WeeklyTimetable({ cohortId, slots, actions, canWrite, today }: { cohortId: string; slots: ClinicSlot[]; actions: TimetableActions; canWrite: boolean; today: string }) {
  const router = useRouter();
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [from, setFrom] = React.useState(today);
  const [to, setTo] = React.useState(addDays(today, 27));

  async function saveSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (draft.end <= draft.start) return setMsg({ ok: false, text: "The end time is before the start." });
    setBusy(true);
    const body: ClinicSlotBody = { cohortIds: [cohortId], weekday: draft.weekday, start: draft.start, end: draft.end, kind: draft.kind, title: draft.title.trim() || KIND_LABEL[draft.kind], place: draft.place.trim() || null, onlineLink: draft.onlineLink.trim() || null, compulsory: draft.compulsory, validFrom: null, validTo: null };
    const x = await actions.saveSlot(editId, body).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setDraft(null);
    setEditId(null);
    setMsg({ ok: true, text: "Saved. Make sessions to put it on the calendar." });
    router.refresh();
  }

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const x = await actions.apply({ cohortId, from, to }).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setMsg({ ok: true, text: x.data.created ? `Made ${x.data.created} ${x.data.created === 1 ? "session" : "sessions"}.` : "Nothing new to make: those days already have their sessions." });
    router.refresh();
  }

  const days = slotsByDay(slots);
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {days.length ? (
        <div className="flex min-w-0 flex-col gap-5">
          {days.map((d) => (
            <div key={d.weekday} className="grid min-w-0 gap-1 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
              <h3 className="type-body font-semibold md:pt-3">{WEEKDAYS[d.weekday]}</h3>
              <Rows>
                {d.slots.map((s) => (
                  <RowItem key={s.id} className="py-2.5">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <span className="flex min-w-0 flex-col">
                        <span className="type-body font-semibold [overflow-wrap:anywhere]">
                          <span className="type-num">{timeRange(s.start, s.end)}</span>, {s.title}
                        </span>
                        <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">
                          {[KIND_LABEL[s.kind], s.place, s.onlineLink ? "Online" : null, s.compulsory ? null : "Not for everyone", s.active ? null : "Paused"].filter(Boolean).join(", ")}
                        </span>
                      </span>
                      {canWrite ? (
                        <span className="flex gap-1">
                          <button type="button" className={btn.ghost} onClick={() => { setEditId(s.id); setDraft({ weekday: s.weekday, date: today, start: s.start, end: s.end, kind: s.kind, title: s.title, place: s.place ?? "", onlineLink: s.onlineLink ?? "", compulsory: s.compulsory }); }}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className={cn(btn.ghost, "text-status-alert-fg")}
                            onClick={async () => {
                              if (!window.confirm(`Remove ${WEEKDAYS[s.weekday]} ${timeRange(s.start, s.end)} from the timetable? Sessions already made stay.`)) return;
                              const x = await actions.deleteSlot(s.id).catch(fail);
                              if (!x.ok) setMsg({ ok: false, text: x.error });
                              else router.refresh();
                            }}
                          >
                            Remove
                          </button>
                        </span>
                      ) : null}
                    </div>
                  </RowItem>
                ))}
              </Rows>
            </div>
          ))}
        </div>
      ) : (
        <Empty>No weekly timetable yet.</Empty>
      )}

      {canWrite ? (
        draft ? (
          <form onSubmit={saveSlot} className="flex min-w-0 flex-col gap-4 border-y border-[var(--ds-hairline)] py-4">
            <p className="type-body font-semibold">{editId ? "Change this slot" : "New weekly slot"}</p>
            <DraftFields d={draft} set={setDraft} mode="slot" />
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className={btn.ink}>
                Save
              </button>
              <button type="button" onClick={() => { setDraft(null); setEditId(null); }} className={btn.quiet}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setDraft(emptyDraft(today))} className={cn(btn.quiet, "self-start")}>
            Add a weekly slot
          </button>
        )
      ) : null}

      {canWrite && slots.length ? (
        <form onSubmit={apply} className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end">
          <Field label="Make sessions from">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={control} />
          </Field>
          <Field label="To">
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={control} />
          </Field>
          <button type="submit" disabled={busy} className={btn.primary}>
            Make sessions
          </button>
        </form>
      ) : null}
      {msg ? (
        <p role={msg.ok ? "status" : "alert"} className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
          {msg.text}
        </p>
      ) : null}
    </div>
  );
}

/** The week's real sessions, with one-offs, moves, cancels and day notes. */
export function WeekSessions({
  cohortId,
  from,
  sessions,
  notes,
  actions,
  canWrite,
  weekHref,
}: {
  cohortId: string;
  from: string;
  sessions: ClinicSession[];
  notes: { date: string; note: string }[];
  actions: TimetableActions;
  canWrite: boolean;
  /** The week's address without its date: the date of the Monday is added. */
  weekHref: string;
}) {
  const router = useRouter();
  const [adding, setAdding] = React.useState<Draft | null>(null);
  const [notify, setNotify] = React.useState(true);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const days = Array.from({ length: 7 }, (_, i) => addDays(from, i));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!adding) return;
    if (adding.end <= adding.start) return setMsg({ ok: false, text: "The end time is before the start." });
    setBusy(true);
    const x = await actions.addSession({ cohortIds: [cohortId], date: adding.date, start: adding.start, end: adding.end, kind: adding.kind, title: adding.title.trim() || KIND_LABEL[adding.kind], place: adding.place.trim() || null, onlineLink: adding.onlineLink.trim() || null, compulsory: adding.compulsory, notify }).catch(fail);
    setBusy(false);
    if (!x.ok) return setMsg({ ok: false, text: x.error });
    setAdding(null);
    setMsg({ ok: true, text: notify ? "Added. Students got a notice." : "Added." });
    router.refresh();
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <nav aria-label="Week" className="flex min-w-0 flex-wrap items-center gap-2">
        <Link href={`${weekHref}${addDays(from, -7)}`} className={btn.quiet}>
          ← Earlier
        </Link>
        <span className="type-small font-semibold type-num">
          {dayShort(from)} to {dayShort(addDays(from, 6))}
        </span>
        <Link href={`${weekHref}${addDays(from, 7)}`} className={btn.quiet}>
          Later →
        </Link>
      </nav>

      {canWrite ? (
        adding ? (
          <form onSubmit={add} className="flex min-w-0 flex-col gap-4 border-y border-[var(--ds-hairline)] py-4">
            <p className="type-body font-semibold">New one-off session</p>
            <DraftFields d={adding} set={setAdding} mode="session" />
            <label className="flex min-h-11 w-fit cursor-pointer items-center gap-3">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="size-5 accent-[var(--link)]" />
              <span className="type-small font-semibold">Tell students</span>
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className={btn.ink}>
                Add session
              </button>
              <button type="button" onClick={() => setAdding(null)} className={btn.quiet}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={() => setAdding({ ...emptyDraft(from), kind: "early_class", start: "07:00", end: "08:00" })} className={cn(btn.quiet, "self-start")}>
            Add a one-off session
          </button>
        )
      ) : null}
      {msg ? (
        <p role={msg.ok ? "status" : "alert"} className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
          {msg.text}
        </p>
      ) : null}

      {days.map((date) => {
        const list = sessions.filter((s) => s.date === date).sort((a, b) => a.start.localeCompare(b.start));
        const note = notes.find((n) => n.date === date)?.note ?? "";
        return (
          <Block key={date} title={dayLong(date)}>
            <DayNote cohortId={cohortId} date={date} note={note} canWrite={canWrite} save={actions.saveNote} />
            {list.length ? (
              <Rows>
                {list.map((s) => (
                  <SessionItem key={s.id} s={s} canWrite={canWrite} patch={actions.patchSession} />
                ))}
              </Rows>
            ) : (
              <p className="type-small text-muted-foreground">Nothing on this day.</p>
            )}
          </Block>
        );
      })}
    </div>
  );
}

function DayNote({ cohortId, date, note, canWrite, save }: { cohortId: string; date: string; note: string; canWrite: boolean; save: TimetableActions["saveNote"] }) {
  const router = useRouter();
  const [v, setV] = React.useState(note);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  if (!canWrite) return note ? <p className="border-l-2 border-link pl-3 type-small [overflow-wrap:anywhere]">{note}</p> : null;
  const changed = v.trim() !== note;
  return (
    <form
      className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const x = await save({ cohortId, date, note: v.trim() }).catch(fail);
        setBusy(false);
        if (!x.ok) setErr(x.error);
        else router.refresh();
      }}
    >
      <input aria-label={`Note for ${dayLong(date)}`} placeholder="Note for this day (bring your case sheets)" value={v} onChange={(e) => setV(e.target.value)} maxLength={200} className={cn(control, "sm:flex-1")} />
      {changed ? (
        <button type="submit" disabled={busy} className={btn.quiet}>
          {v.trim() ? "Save note" : "Remove note"}
        </button>
      ) : null}
      {err ? (
        <p role="alert" className="type-small text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </form>
  );
}

function SessionItem({ s, canWrite, patch }: { s: ClinicSession; canWrite: boolean; patch: TimetableActions["patchSession"] }) {
  const router = useRouter();
  const [date, setDate] = React.useState(s.date);
  const [start, setStart] = React.useState(s.start);
  const [end, setEnd] = React.useState(s.end);
  const [notify, setNotify] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const off = s.status === "cancelled";
  async function go(p: ClinicSessionPatch) {
    setBusy(true);
    setErr(null);
    const x = await patch(s.id, { ...p, notify }).catch(fail);
    setBusy(false);
    if (!x.ok) setErr(x.error);
    else router.refresh();
  }
  return (
    <RowItem className="py-2.5">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span className="flex min-w-0 flex-col">
          <span className={cn("type-body font-semibold [overflow-wrap:anywhere]", off && "text-muted-foreground line-through decoration-foreground/40")}>
            <span className="type-num">{timeRange(s.start, s.end)}</span>, {s.title}
          </span>
          <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">
            {[KIND_LABEL[s.kind], s.place, s.onlineLink ? "Online" : null, s.origin === "one_off" ? "One-off" : null, s.movedFrom ? `Moved from ${s.movedFrom}` : null].filter(Boolean).join(", ")}
          </span>
        </span>
        {off ? <Status tone="quiet">Cancelled</Status> : null}
      </div>
      {canWrite ? (
        <More summary={off ? "Restore" : "Move or cancel"}>
          <div className="flex min-w-0 flex-col gap-3">
            {!off ? (
              <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-end">
                <Field label="Date">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={control} />
                </Field>
                <Field label="Starts">
                  <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={control} />
                </Field>
                <Field label="Ends">
                  <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={control} />
                </Field>
                <button type="button" disabled={busy || (date === s.date && start === s.start && end === s.end) || end <= start} onClick={() => go({ date, start, end })} className={btn.ink}>
                  Move
                </button>
              </div>
            ) : null}
            <label className="flex min-h-11 w-fit cursor-pointer items-center gap-3">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="size-5 accent-[var(--link)]" />
              <span className="type-small font-semibold">Tell students</span>
            </label>
            <button type="button" disabled={busy} onClick={() => go({ status: off ? "scheduled" : "cancelled" })} className={cn(off ? btn.ink : btn.danger, "self-start")}>
              {off ? "Restore session" : "Cancel session"}
            </button>
            {err ? (
              <p role="alert" className="type-small text-status-alert-fg">
                {err}
              </p>
            ) : null}
          </div>
        </More>
      ) : null}
    </RowItem>
  );
}
