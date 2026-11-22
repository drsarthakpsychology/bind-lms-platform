"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ProgressLine, fieldClass, labelClass, primaryButton, quietButton, textButton } from "@/components/ds/parts";
import type { ClinicBatch, ClinicBatchBody, ClinicCaseLogBody, ClinicMyOpd, ClinicVisit } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { BATCH_LABEL, cases, dayLong, timeRange } from "./format";
import type { Res } from "./result";
import { StatusText } from "./sessions";

/**
 * OPD cases: the batch (picked once), cases done of the total, the OPD days,
 * and the case count after each visit (0 allowed, or "I was absent").
 */

export type OpdActions = {
  chooseBatch: (body: ClinicBatchBody) => Promise<Res<unknown>>;
  log: (body: ClinicCaseLogBody) => Promise<Res<unknown>>;
};

const VISIT: Record<ClinicVisit["state"], { text: string; tone: "ok" | "warn" | "alert" | "info" | "quiet" }> = {
  upcoming: { text: "Coming up", tone: "quiet" },
  today: { text: "Today", tone: "info" },
  due: { text: "Case count due", tone: "warn" },
  done: { text: "Sent", tone: "ok" },
  absent: { text: "Absent, counted as a leave", tone: "alert" },
  missed: { text: "Missed, counted as a leave", tone: "alert" },
  on_leave: { text: "On leave", tone: "quiet" },
};

/** Visits that take a case count now: today's, and past ones with none yet. */
export function needsLog(v: ClinicVisit): boolean {
  return v.state === "today" || v.state === "due";
}

export function OpdPanel({ data, actions }: { data: ClinicMyOpd; actions: OpdActions }) {
  const router = useRouter();
  const q = data.quota;
  const pct = q.total ? (q.done / q.total) * 100 : 0;
  const now = data.visits.filter(needsLog);
  const later = data.visits.filter((v) => v.state === "upcoming");
  const past = data.visits.filter((v) => !needsLog(v) && v.state !== "upcoming");
  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <div className="flex min-w-0 flex-col gap-3">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="type-display type-num">{q.done}</span>
          <span className="type-h3 text-muted-foreground type-num">of {q.total} cases</span>
        </p>
        <ProgressLine pct={pct} label={`${q.done} of ${q.total} cases done`} />
        <p className="type-small text-muted-foreground type-num">
          {q.pending ? `${cases(q.pending)} to go` : "All cases done"}
          {q.extras.length ? `, including ${cases(q.extras.reduce((n, e) => n + e.count, 0))} added` : ""}. About {cases(data.casesPerVisit)} a visit.
        </p>
      </div>

      <BatchChoice batch={data.batch} canChoose={data.canChooseBatch} choose={actions.chooseBatch} onDone={() => router.refresh()} />

      {now.length ? (
        <section aria-labelledby="opd-now" className="flex min-w-0 flex-col gap-2">
          <h2 id="opd-now" className="type-h3">
            Case count
          </h2>
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {now.map((v) => (
              <VisitRow key={v.assignmentId} v={v} log={actions.log} onDone={() => router.refresh()} open />
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="opd-next" className="flex min-w-0 flex-col gap-2">
        <h2 id="opd-next" className="type-h3">
          My OPD days
        </h2>
        {later.length ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {later.map((v) => (
              <VisitRow key={v.assignmentId} v={v} log={actions.log} onDone={() => router.refresh()} />
            ))}
          </ul>
        ) : (
          <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">{data.batch ? "No OPD days given yet." : "Pick a batch first. The admin then gives you OPD days."}</p>
        )}
      </section>

      {past.length ? (
        <section aria-labelledby="opd-past" className="flex min-w-0 flex-col gap-2">
          <h2 id="opd-past" className="type-h3">
            Done
          </h2>
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {past.map((v) => (
              <VisitRow key={v.assignmentId} v={v} log={actions.log} onDone={() => router.refresh()} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function BatchChoice({ batch, canChoose, choose, onDone }: { batch: ClinicBatch | null; canChoose: boolean; choose: OpdActions["chooseBatch"]; onDone: () => void }) {
  const [pick, setPick] = React.useState<ClinicBatch | null>(batch);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  if (!canChoose) {
    return (
      <p className="type-body">
        Batch: <span className="font-semibold">{batch ? BATCH_LABEL[batch] : "not set"}</span>
        <span className="block type-small text-muted-foreground">To change it, ask the admin.</span>
      </p>
    );
  }
  return (
    <section aria-labelledby="opd-batch" className="flex min-w-0 flex-col gap-3">
      <h2 id="opd-batch" className="type-h3">
        Your batch
      </h2>
      <p className="type-small text-muted-foreground">You pick once. After that only the admin can change it.</p>
      <div role="radiogroup" aria-labelledby="opd-batch" className="grid min-w-0 grid-cols-2 gap-2 sm:flex">
        {(["morning", "evening"] as const).map((b) => (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={pick === b}
            onClick={() => setPick(b)}
            className={cn(
              "ds-press inline-flex min-h-12 items-center justify-center rounded-[var(--ds-radius)] border-[1.5px] px-6 type-body font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
              pick === b ? "border-foreground bg-foreground text-background" : "border-[var(--ds-card-line)] hover:border-foreground",
            )}
          >
            {BATCH_LABEL[b]}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!pick || busy}
        className={cn(primaryButton, "sm:self-start")}
        onClick={async () => {
          if (!pick) return;
          setBusy(true);
          const res = await choose({ batch: pick }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
          setBusy(false);
          if (!res.ok) setErr(res.error);
          else onDone();
        }}
      >
        {busy ? "Saving" : "Save batch"}
      </button>
      {err ? (
        <p role="alert" className="type-small text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </section>
  );
}

function VisitRow({ v, log, onDone, open = false }: { v: ClinicVisit; log: OpdActions["log"]; onDone: () => void; open?: boolean }) {
  const [editing, setEditing] = React.useState(open);
  const st = VISIT[v.state];
  const canEdit = v.state === "done" || v.state === "absent";
  return (
    <li className="flex min-w-0 flex-col gap-2 py-3">
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="flex min-w-0 flex-col">
          <span className="type-body font-semibold">{dayLong(v.date)}</span>
          <span className="type-small text-muted-foreground type-num">
            {BATCH_LABEL[v.batch]}
            {v.start ? `, ${timeRange(v.start, v.end)}` : ""}
          </span>
        </span>
        <StatusText tone={st.tone}>{v.log && !v.log.absent ? `${cases(v.log.cases)}` : st.text}</StatusText>
      </div>
      {v.log?.note ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{v.log.note}</p> : null}
      {editing ? (
        <LogForm v={v} log={log} onDone={() => { setEditing(open); onDone(); }} onCancel={open ? undefined : () => setEditing(false)} />
      ) : canEdit ? (
        <button type="button" className={cn(textButton, "self-start")} onClick={() => setEditing(true)}>
          Change
        </button>
      ) : null}
    </li>
  );
}

function LogForm({ v, log, onDone, onCancel }: { v: ClinicVisit; log: OpdActions["log"]; onDone: () => void; onCancel?: () => void }) {
  const [n, setN] = React.useState(v.log?.cases ?? 0);
  const [absent, setAbsent] = React.useState(v.log?.absent ?? false);
  const [note, setNote] = React.useState(v.log?.note ?? "");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await log({ assignmentId: v.assignmentId, cases: absent ? 0 : n, absent, note: note.trim() || undefined }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!res.ok) setErr(res.error);
    else onDone();
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-col gap-3">
      <div className={cn("flex min-w-0 items-center gap-3", absent && "opacity-50")}>
        <span id={`n-${v.assignmentId}`} className={labelClass}>
          Cases taken
        </span>
        <div role="group" aria-labelledby={`n-${v.assignmentId}`} className="flex items-center gap-1">
          <button type="button" aria-label="One less" disabled={absent || n <= 0} onClick={() => setN((x) => Math.max(0, x - 1))} className={cn(quietButton, "size-11 px-0 text-lg")}>
            −
          </button>
          <output aria-live="polite" className="w-10 text-center type-h3 type-num">
            {n}
          </output>
          <button type="button" aria-label="One more" disabled={absent || n >= 20} onClick={() => setN((x) => Math.min(20, x + 1))} className={cn(quietButton, "size-11 px-0 text-lg")}>
            +
          </button>
        </div>
      </div>
      <label className="flex min-h-11 w-fit cursor-pointer items-center gap-3">
        <input type="checkbox" checked={absent} onChange={(e) => setAbsent(e.target.checked)} className="size-5 accent-[var(--link)]" />
        <span className="type-body">I was absent</span>
      </label>
      <label className="flex min-w-0 flex-col gap-1.5">
        <span className={labelClass}>Note</span>
        <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={140} className={fieldClass} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? "Saving" : "Send"}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className={quietButton}>
            Cancel
          </button>
        ) : null}
      </div>
      {err ? (
        <p role="alert" className="type-small text-status-alert-fg">
          {err}
        </p>
      ) : null}
    </form>
  );
}
