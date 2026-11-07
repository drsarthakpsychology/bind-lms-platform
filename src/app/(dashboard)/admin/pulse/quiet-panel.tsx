"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Mail, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  DEFAULT_NUDGE_MESSAGE,
  DEFAULT_NUDGE_SUBJECT,
  MAX_BULK_RECIPIENTS,
  QUIET_DAY_OPTIONS,
  personalise,
  selectQuietStudents,
  type NudgeRow,
  type NudgeStudent,
} from "@/lib/nudge/select";

type Cohort = { id: string; name: string };
type Result = {
  sent: number;
  failed: Array<{ id: string; name: string; reason: string }>;
  skipped: number;
  notConfigured: boolean;
  error?: string;
};

const DAY_OPTIONS = QUIET_DAY_OPTIONS.map((d) => ({ value: String(d), label: `${d} days` }));
const ticked = (rows: NudgeRow[]) => new Set(rows.filter((r) => r.preselected).map((r) => r.id));

/**
 * "Email students who've gone quiet": the main thing on Progress. Opens with
 * the quiet students already ticked; the admin ticks/unticks, edits the note,
 * checks the preview, and sends one email per student.
 */
export function QuietPanel({
  students,
  cohorts,
  initialCohort,
  initialDays,
  todayIso,
  emailReady,
  sendUrl = "/api/admin/nudge/bulk",
}: {
  students: NudgeStudent[];
  cohorts: Cohort[];
  initialCohort: string;
  initialDays: number;
  todayIso: string;
  emailReady: boolean;
  sendUrl?: string;
}) {
  const pathname = usePathname();
  const today = React.useMemo(() => new Date(todayIso), [todayIso]);
  const [cohort, setCohort] = React.useState(initialCohort);
  const [days, setDays] = React.useState(initialDays);
  const rowsFor = React.useCallback(
    (c: string, d: number) => selectQuietStudents(students, { cohort: c, days: d, today }),
    [students, today],
  );
  const rows = React.useMemo(() => rowsFor(cohort, days), [rowsFor, cohort, days]);
  const [picked, setPicked] = React.useState<Set<string>>(() => ticked(rowsFor(initialCohort, initialDays)));
  const [emailed, setEmailed] = React.useState<Set<string>>(new Set());
  const [subject, setSubject] = React.useState(DEFAULT_NUDGE_SUBJECT);
  const [message, setMessage] = React.useState(DEFAULT_NUDGE_MESSAGE);
  const [confirming, setConfirming] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);

  const cohortName = (id: string) => cohorts.find((c) => c.id === id)?.name ?? "No cohort";
  const groupLabel = cohort === "all" ? "All cohorts" : cohortName(cohort);
  const count = rows.filter((r) => picked.has(r.id)).length;
  const preview = rows.find((r) => picked.has(r.id)) ?? rows[0] ?? null;
  const tooMany = count > MAX_BULK_RECIPIENTS;

  function changeFilter(nextCohort: string, nextDays: number) {
    setCohort(nextCohort);
    setDays(nextDays);
    setPicked(ticked(rowsFor(nextCohort, nextDays)));
    setResult(null);
    const q = new URLSearchParams(window.location.search);
    if (nextCohort === "all") q.delete("cohort");
    else q.set("cohort", nextCohort);
    q.set("days", String(nextDays));
    window.history.replaceState(null, "", `${pathname}?${q.toString()}`);
  }

  function toggle(id: string) {
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function send() {
    const ids = rows.filter((r) => picked.has(r.id)).map((r) => r.id);
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(sendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: ids, subject, message }),
      });
      const j = (await res.json().catch(() => null)) as (Result & { sentIds?: string[] }) | null;
      if (!res.ok || !j) {
        setResult({ sent: 0, failed: [], skipped: 0, notConfigured: false, error: j?.error ?? "Something went wrong. Nothing was sent." });
      } else {
        const sentIds = new Set(j.sentIds ?? []);
        setEmailed((e) => new Set([...e, ...sentIds]));
        setPicked((p) => new Set([...p].filter((id) => !sentIds.has(id))));
        setResult(j);
      }
    } catch {
      setResult({ sent: 0, failed: [], skipped: 0, notConfigured: false, error: "Couldn't reach the server. Nothing was sent." });
    } finally {
      setSending(false);
      setConfirming(false);
    }
  }

  return (
    <section
      aria-labelledby="quiet-title"
      className="min-w-0 rounded-[10px] border-2 border-foreground bg-card p-4 hard-shadow-md sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="quiet-title" className="flex items-center gap-2 text-h3 font-bold tracking-tight">
            <Mail className="size-5 shrink-0" aria-hidden /> Email students who&apos;ve gone quiet
          </h2>
          <p className="mt-1 text-small text-muted-foreground">
            Ticked: never started, or nothing on VIBHA for {days}+ days.
          </p>
        </div>
        <p
          className="inline-flex max-w-full items-center gap-2 rounded-full border-2 border-foreground bg-background px-3 py-1 text-small font-semibold"
          aria-live="polite"
        >
          <span className="size-2 shrink-0 rounded-full bg-primary ring-1 ring-foreground" aria-hidden />
          <span className="truncate">Sending to: {groupLabel}</span>
        </p>
      </div>

      {/* filters */}
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor="quiet-cohort" className="text-caption font-semibold">
            Cohort
          </label>
          <select
            id="quiet-cohort"
            value={cohort}
            onChange={(e) => changeFilter(e.target.value, days)}
            className="h-11 max-w-full rounded-md border-2 border-input bg-background px-3 text-small text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60"
          >
            <option value="all">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-caption font-semibold">
            Quiet for
          </span>
          <SegmentedControl
            label="Quiet for"
            value={String(days)}
            onValueChange={(v) => changeFilter(cohort, Number(v))}
            options={DAY_OPTIONS}
          />
        </div>
      </div>

      {/* list */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-small">
          <span className="text-numeric font-bold">{count}</span>
          <span className="text-muted-foreground"> of {rows.length} ticked</span>
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setPicked(new Set(rows.map((r) => r.id)))} disabled={!rows.length}>
            Select all
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setPicked(new Set())} disabled={!count}>
            Select none
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-3 rounded-md border-2 border-border bg-background p-4 text-small text-muted-foreground">
          No students in {groupLabel}.
        </p>
      ) : (
        <ul className="mt-3 max-h-[28rem] divide-y-2 divide-line overflow-y-auto rounded-md border-2 border-border bg-background">
          {rows.map((r) => {
            const on = picked.has(r.id);
            const cohortText = r.cohortIds.length ? r.cohortIds.map(cohortName).join(", ") : "No cohort";
            return (
              <li key={r.id}>
                <label className={cn("flex min-h-14 cursor-pointer items-start gap-3 px-3 py-2.5", on && "bg-muted")}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(r.id)}
                    className="mt-0.5 size-5 shrink-0 accent-foreground"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-semibold">{r.name}</span>
                      <span className="min-w-0 truncate text-caption text-muted-foreground">{r.email}</span>
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-muted-foreground">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-semibold",
                          r.neverStarted
                            ? "bg-status-alert-bg text-status-alert-fg"
                            : r.preselected
                              ? "bg-status-pending-bg text-status-pending-fg"
                              : "bg-status-success-bg text-status-success-fg",
                        )}
                      >
                        {r.neverStarted ? "Never started" : r.inactiveDays === 0 ? "Active today" : `Quiet ${r.inactiveDays} day${r.inactiveDays === 1 ? "" : "s"}`}
                      </span>
                      <span>{cohortText}</span>
                      {emailed.has(r.id) ? <span className="font-semibold text-foreground">Emailed</span> : null}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-caption text-muted-foreground">
                    <span className="block text-numeric text-small font-bold text-foreground">{r.hours.toFixed(1)} h</span>
                    so far
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {/* message */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="quiet-subject" className="text-caption font-semibold">
              Subject
            </label>
            <Input id="quiet-subject" value={subject} maxLength={200} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="quiet-message" className="text-caption font-semibold">
              Message
            </label>
            <Textarea id="quiet-message" rows={11} value={message} maxLength={5000} onChange={(e) => setMessage(e.target.value)} />
            <p className="text-caption text-muted-foreground">{"{name}"} becomes each student&apos;s first name.</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-caption font-semibold">Preview</p>
          <div className="mt-1 rounded-md border-2 border-border bg-background p-3 text-small">
            {preview ? (
              <>
                <p className="truncate text-caption text-muted-foreground">To: {preview.email}</p>
                <p className="mt-1 font-semibold">{personalise(subject, preview.name)}</p>
                <p className="mt-2 whitespace-pre-wrap break-words">{personalise(message, preview.name)}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Tick a student to see their email.</p>
            )}
          </div>
        </div>
      </div>

      {/* send */}
      <div className="mt-6 flex flex-col gap-3 border-t-2 border-border pt-4">
        {!emailReady ? (
          <p role="status" className="flex items-start gap-2 rounded-md border-2 border-foreground bg-status-pending-bg p-3 text-small text-status-pending-fg">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Email isn&apos;t set up yet (no Resend key), so nothing can be sent.
          </p>
        ) : null}
        {tooMany ? (
          <p role="status" className="text-small text-status-alert-fg">
            {MAX_BULK_RECIPIENTS} at a time at most. Untick some or pick one cohort.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={() => setConfirming(true)}
            disabled={!emailReady || !count || tooMany || sending || !subject.trim() || !message.trim()}
          >
            <Mail aria-hidden /> Email {count} student{count === 1 ? "" : "s"}
          </Button>
          <p className="text-caption text-muted-foreground">One email each. Nobody sees the others.</p>
        </div>
        <div aria-live="polite">{result ? <ResultNote result={result} /> : null}</div>
      </div>

      <Dialog open={confirming} onOpenChange={(o) => !sending && setConfirming(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Email {count} student{count === 1 ? "" : "s"}?
            </DialogTitle>
            <DialogDescription>
              Cohort: <strong className="text-foreground">{groupLabel}</strong>. Each one gets their own email: &ldquo;
              {subject}&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={sending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={() => void send()} disabled={sending}>
              {sending ? "Sending…" : `Send ${count} email${count === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ResultNote({ result }: { result: Result }) {
  if (result.error) return <p className="text-small font-semibold text-status-alert-fg">{result.error}</p>;
  if (result.notConfigured) {
    return <p className="text-small font-semibold text-status-pending-fg">Email isn&apos;t set up yet, so nothing was sent.</p>;
  }
  return (
    <div className="space-y-2">
      <p className="rounded-md border-2 border-foreground bg-status-success-bg p-3 text-small font-semibold text-status-success-fg">
        Sent {result.sent} email{result.sent === 1 ? "" : "s"}.
        {result.skipped ? ` Skipped ${result.skipped} (blocked or test account).` : ""}
      </p>
      {result.failed.length ? (
        <div className="rounded-md border-2 border-foreground bg-status-alert-bg p-3 text-small text-status-alert-fg">
          <p className="font-semibold">{result.failed.length} didn&apos;t go:</p>
          <ul className="mt-1 list-disc pl-5">
            {result.failed.map((f) => (
              <li key={f.id}>
                {f.name}: {f.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
