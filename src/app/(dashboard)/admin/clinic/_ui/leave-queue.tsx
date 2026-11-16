"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { LEAVE_STATUS_LABEL, clock, dayShort, instantClock, leaves } from "@/components/clinic/format";
import type { Res } from "@/components/clinic/result";
import type { ClinicLeaveDecisionBody, ClinicLeaveQueue } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { Empty, Rows, RowItem, Status, Tag, btn, control } from "../../_v2/kit";

type Req = ClinicLeaveQueue["requests"][number];

const TONE = { pending: "warn", approved: "ok", rejected: "alert", cancelled: "quiet" } as const;

/** What a request asks for, in a few words. */
export function askLine(r: Pick<Req, "kind" | "cost" | "leaveAt">): string {
  if (r.kind === "early") return `Leave early${r.leaveAt ? ` at ${r.leaveAt.includes("T") ? instantClock(r.leaveAt) : clock(r.leaveAt)}` : ""}`;
  if (r.kind === "missed") return "Missed OPD day";
  return r.cost === 1 ? "1 session" : `${r.cost} sessions`;
}

export function LeaveQueue({ data, decide, canWrite }: { data: ClinicLeaveQueue; decide: (id: string, body: ClinicLeaveDecisionBody) => Promise<Res<unknown>>; canWrite: boolean }) {
  if (!data.requests.length) return <Empty>Nothing waiting.</Empty>;
  return (
    <Rows label="Leave requests">
      {data.requests.map((r) => (
        <RequestItem key={r.id} r={r} decide={decide} canWrite={canWrite} />
      ))}
    </Rows>
  );
}

function RequestItem({ r, decide, canWrite }: { r: Req; decide: (id: string, body: ClinicLeaveDecisionBody) => Promise<Res<unknown>>; canWrite: boolean }) {
  const router = useRouter();
  const [note, setNote] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  async function go(decision: ClinicLeaveDecisionBody["decision"]) {
    setBusy(true);
    setErr(null);
    const x = await decide(r.id, { decision, note: note.trim() || undefined }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!x.ok) setErr(x.error);
    else router.refresh();
  }
  const over = r.kind !== "early" && (r.overLimit || r.overLimitNow);
  return (
    <RowItem>
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="min-w-0">
          <span className="type-body font-semibold [overflow-wrap:anywhere]">{r.name ?? "Student"}</span>
          {r.roll ? <span className="ml-2 type-small text-muted-foreground">{r.roll}</span> : null}
        </span>
        <span className="flex flex-wrap items-center gap-2">
          {over ? <Tag tone="warn">Over the limit</Tag> : null}
          <Status tone={TONE[r.status]}>{LEAVE_STATUS_LABEL[r.status]}</Status>
        </span>
      </div>
      <p className="type-small">
        <span className="font-semibold">{askLine(r)}</span>
        <span className="text-muted-foreground">
          {" "}
          · {leaves(r.balance.left)} left of {r.balance.allowance}
          {r.balance.pending ? `, ${r.balance.pending} waiting` : ""}
        </span>
      </p>
      <ul className="flex min-w-0 flex-col type-small text-muted-foreground">
        {r.sessions.map((s) => (
          <li key={s.id} className="[overflow-wrap:anywhere]">
            {dayShort(s.date)}, {clock(s.start)}, {s.title}
          </li>
        ))}
      </ul>
      {r.reason ? <p className="max-w-[65ch] type-small [overflow-wrap:anywhere]">{r.reason}</p> : null}
      {r.decisionNote ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">Note: {r.decisionNote}</p> : null}
      {canWrite && r.status === "pending" ? (
        <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center">
          <input aria-label={`Note for ${r.name ?? "this student"}`} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} className={cn(control, "md:w-72")} />
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => go("approve")} className={btn.ink}>
              Approve
            </button>
            <button type="button" disabled={busy} onClick={() => go("reject")} className={btn.danger}>
              Reject
            </button>
          </div>
        </div>
      ) : null}
      {err ? (
        <p role="alert" className="type-small text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </RowItem>
  );
}
