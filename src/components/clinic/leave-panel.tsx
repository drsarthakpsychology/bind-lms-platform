"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { fieldClass, labelClass, primaryButton, quietButton, textButton } from "@/components/ds/parts";
import type { ClinicEarlyLeaveBody, ClinicLeaveBody, ClinicLeaveRequest, ClinicMyLeave, ClinicMySession } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { KIND_LABEL, LEAVE_STATUS_LABEL, clock, dayShort, leaves, timeRange } from "./format";
import type { Res } from "./result";
import { StatusText } from "./sessions";

/**
 * Leave: how many are left, ask for one or more sessions off, ask to leave
 * one session early (free), and the student's own requests.
 */

export type LeaveActions = {
  request: (body: ClinicLeaveBody) => Promise<Res<ClinicLeaveRequest>>;
  early: (body: ClinicEarlyLeaveBody) => Promise<Res<ClinicLeaveRequest>>;
  cancel: (id: string) => Promise<Res<unknown>>;
};

/** Sessions a student can ask leave for: upcoming, required, not cancelled, not already on leave. */
export function leaveable(sessions: ClinicMySession[]): ClinicMySession[] {
  return sessions.filter((s) => s.required && s.status !== "cancelled" && s.my.status === "upcoming" && !s.my.leaveId);
}

/** The note under the picker: how this request sits against the leaves left. */
export function overLimitLine(picked: number, left: number): string | null {
  if (!picked) return null;
  if (picked <= left) return `Uses ${leaves(picked)}. ${leaves(left - picked)} left after this.`;
  return left > 0 ? `You have ${leaves(left)} left. This asks for ${picked}, so it goes over the limit and the admin decides.` : "No leaves left. You can still ask; the admin decides.";
}

const STATUS_TONE = { pending: "warn", approved: "ok", rejected: "alert", cancelled: "quiet" } as const;

export function LeavePanel({ data, upcoming, actions }: { data: ClinicMyLeave; upcoming: ClinicMySession[]; actions: LeaveActions }) {
  const router = useRouter();
  const b = data.balance;
  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <div className="flex min-w-0 flex-wrap items-end gap-x-10 gap-y-3">
        <p className="flex flex-col">
          <span className="type-display type-num">{b.left}</span>
          <span className="type-small text-muted-foreground">Leaves left</span>
        </p>
        <p className="flex flex-col pb-1">
          <span className="type-h3 type-num">{b.allowance}</span>
          <span className="type-caption text-muted-foreground">Allowed</span>
        </p>
        <p className="flex flex-col pb-1">
          <span className="type-h3 type-num">{b.used}</span>
          <span className="type-caption text-muted-foreground">Used</span>
        </p>
        {b.pending ? (
          <p className="flex flex-col pb-1">
            <span className="type-h3 type-num">{b.pending}</span>
            <span className="type-caption text-muted-foreground">Waiting</span>
          </p>
        ) : null}
      </div>

      <RequestForm sessions={leaveable(upcoming)} left={b.left} onDone={() => router.refresh()} request={actions.request} />
      <EarlyForm sessions={upcoming.filter((s) => s.status !== "cancelled" && s.required && s.my.status !== "on_leave")} onDone={() => router.refresh()} early={actions.early} />

      <section aria-labelledby="my-requests" className="flex min-w-0 flex-col gap-2">
        <h2 id="my-requests" className="type-h3">
          My requests
        </h2>
        {data.requests.length ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {data.requests.map((r) => (
              <RequestRow key={r.id} r={r} cancel={actions.cancel} onDone={() => router.refresh()} />
            ))}
          </ul>
        ) : (
          <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">No requests yet.</p>
        )}
      </section>
    </div>
  );
}

function sessionLabel(s: { date: string; start: string; title: string }) {
  return `${dayShort(s.date)}, ${clock(s.start)}, ${s.title}`;
}

function RequestRow({ r, cancel, onDone }: { r: ClinicLeaveRequest; cancel: LeaveActions["cancel"]; onDone: () => void }) {
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const what = r.kind === "early" ? `Leave early${r.leaveAt ? ` at ${r.leaveAt.includes("T") ? r.leaveAt : clock(r.leaveAt)}` : ""}` : r.kind === "missed" ? "Missed OPD day" : r.cost === 1 ? "1 leave" : `${r.cost} leaves`;
  return (
    <li className="flex min-w-0 flex-col gap-1 py-3">
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="type-body font-semibold">{what}</span>
        <StatusText tone={STATUS_TONE[r.status]}>
          {LEAVE_STATUS_LABEL[r.status]}
          {r.overLimit && r.status === "pending" ? ", over the limit" : ""}
        </StatusText>
      </div>
      <ul className="flex min-w-0 flex-col type-small text-muted-foreground">
        {r.sessions.map((s) => (
          <li key={s.id} className="[overflow-wrap:anywhere]">
            {sessionLabel(s)}
          </li>
        ))}
      </ul>
      {r.reason ? <p className="type-small [overflow-wrap:anywhere]">{r.reason}</p> : null}
      {r.decisionNote ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">Admin: {r.decisionNote}</p> : null}
      {r.status === "pending" ? (
        <button
          type="button"
          disabled={busy}
          className={cn(textButton, "self-start")}
          onClick={async () => {
            setBusy(true);
            const res = await cancel(r.id).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
            setBusy(false);
            if (!res.ok) setErr(res.error);
            else onDone();
          }}
        >
          Withdraw
        </button>
      ) : null}
      {err ? (
        <p role="alert" className="type-small text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </li>
  );
}

function RequestForm({ sessions, left, request, onDone }: { sessions: ClinicMySession[]; left: number; request: LeaveActions["request"]; onDone: () => void }) {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const note = overLimitLine(picked.length, left);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked.length || !reason.trim()) {
      setMsg({ ok: false, text: !picked.length ? "Pick at least one session." : "Write a reason." });
      return;
    }
    setBusy(true);
    const res = await request({ sessionIds: picked, reason: reason.trim() }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!res.ok) {
      setMsg({ ok: false, text: res.error });
      return;
    }
    setPicked([]);
    setReason("");
    setMsg({ ok: true, text: "Sent. You will get a notice when the admin decides." });
    onDone();
  }

  return (
    <section aria-labelledby="ask-leave" className="flex min-w-0 flex-col gap-3">
      <h2 id="ask-leave" className="type-h3">
        Ask for leave
      </h2>
      {sessions.length ? (
        <form onSubmit={submit} className="flex min-w-0 flex-col gap-4">
          <fieldset className="min-w-0">
            <legend className={cn(labelClass, "pb-2")}>Sessions you will miss</legend>
            <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
              {sessions.map((s) => (
                <li key={s.id} className="min-w-0">
                  <label className="flex min-h-14 min-w-0 cursor-pointer items-center gap-3 py-2">
                    <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} className="size-5 shrink-0 accent-[var(--link)]" />
                    <span className="flex min-w-0 flex-col">
                      <span className="type-body font-semibold [overflow-wrap:anywhere]">{s.title || KIND_LABEL[s.kind]}</span>
                      <span className="type-small text-muted-foreground type-num">
                        {dayShort(s.date)}, {timeRange(s.start, s.end)}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          {note ? <p className={cn("type-small", picked.length > left ? "font-semibold text-status-pending-fg" : "text-muted-foreground")}>{note}</p> : null}
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className={labelClass}>Reason</span>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} maxLength={300} className={cn(fieldClass, "min-h-20 resize-y")} />
          </label>
          <button type="submit" disabled={busy} className={cn(primaryButton, "sm:self-start")}>
            {busy ? "Sending" : "Send request"}
          </button>
          {msg ? (
            <p role={msg.ok ? "status" : "alert"} className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
              {msg.text}
            </p>
          ) : null}
        </form>
      ) : (
        <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">No upcoming sessions to ask leave for.</p>
      )}
    </section>
  );
}

function EarlyForm({ sessions, early, onDone }: { sessions: ClinicMySession[]; early: LeaveActions["early"]; onDone: () => void }) {
  const [sessionId, setSessionId] = React.useState("");
  const [at, setAt] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  if (!sessions.length) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionId || !at || !reason.trim()) {
      setMsg({ ok: false, text: "Pick the session, the time and write a reason." });
      return;
    }
    setBusy(true);
    const res = await early({ sessionId, leaveAt: at, reason: reason.trim() }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!res.ok) {
      setMsg({ ok: false, text: res.error });
      return;
    }
    setSessionId("");
    setAt("");
    setReason("");
    setMsg({ ok: true, text: "Sent. It does not use a leave." });
    onDone();
  }

  return (
    <details className="group min-w-0 border-y border-[var(--ds-hairline)]">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 type-body font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        Leave a session early
        <span aria-hidden className="text-muted-foreground transition-transform duration-[var(--ds-state)] group-open:rotate-180">
          ▾
        </span>
      </summary>
      <form onSubmit={submit} className="flex min-w-0 flex-col gap-4 pb-4">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>Session</span>
          <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} className={fieldClass}>
            <option value="">Pick one</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {dayShort(s.date)}, {timeRange(s.start, s.end)}, {s.title || KIND_LABEL[s.kind]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 sm:w-48">
          <span className={labelClass}>Leave at</span>
          <input type="time" value={at} onChange={(e) => setAt(e.target.value)} className={fieldClass} />
        </label>
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>Reason</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} className={fieldClass} />
        </label>
        <button type="submit" disabled={busy} className={cn(quietButton, "sm:self-start")}>
          {busy ? "Sending" : "Ask to leave early"}
        </button>
        {msg ? (
          <p role={msg.ok ? "status" : "alert"} className={cn("type-small", msg.ok ? "font-semibold" : "text-status-alert-fg")}>
            {msg.text}
          </p>
        ) : null}
      </form>
    </details>
  );
}
