"use client";

import * as React from "react";

import { fieldClass, labelClass, primaryButton, quietButton, textButton } from "@/components/ds/parts";
import { hasContactDetails, NO_NAMES, REFLECTION_MAX, REFLECTION_PARTS, type ReflectionPart } from "@/lib/clinic/reflect-text";
import type { ClinicReflection, ClinicReflectionBody, ClinicReflectionSaved } from "@/lib/clinic/types";
import { cn } from "@/lib/utils";
import { BATCH_LABEL, dayLong } from "./format";
import type { Res } from "./result";

/**
 * Case reflection after an OPD visit: what I saw, what I learned, what I want
 * to ask. A few lines, all optional (at least one). The form reminds the
 * student to leave out anything that tells who the patient is; the server
 * takes out phone numbers and emails.
 */

export type SaveReflection = (body: ClinicReflectionBody) => Promise<Res<ClinicReflectionSaved>>;

const when = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

/** The three parts as read back (only the ones written), then the reply. */
export function ReflectionView({ r, className }: { r: Pick<ClinicReflection, "saw" | "learned" | "ask" | "reply">; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <dl className="flex min-w-0 flex-col gap-2">
        {REFLECTION_PARTS.map((p) =>
          r[p.key] ? (
            <div key={p.key} className="flex min-w-0 flex-col gap-0.5">
              <dt className="type-caption font-semibold text-muted-foreground">{p.label}</dt>
              <dd className="type-body whitespace-pre-line [overflow-wrap:anywhere]">{r[p.key]}</dd>
            </div>
          ) : null,
        )}
      </dl>
      {r.reply ? (
        <div className="flex min-w-0 flex-col gap-0.5 border-l-[3px] border-[var(--link)] pl-3" data-testid="reflection-reply">
          <span className="type-caption font-semibold text-muted-foreground">
            Reply{r.reply.by ? ` from ${r.reply.by}` : ""}, {when(r.reply.at)}
          </span>
          <p className="type-body whitespace-pre-line [overflow-wrap:anywhere]">{r.reply.text}</p>
        </div>
      ) : null}
    </div>
  );
}

export function ReflectionForm({
  assignmentId,
  initial,
  save,
  onDone,
  onCancel,
}: {
  assignmentId: string;
  initial?: Pick<ClinicReflection, "saw" | "learned" | "ask"> | null;
  save: SaveReflection;
  onDone: (saved: ClinicReflectionSaved) => void;
  onCancel?: () => void;
}) {
  const [v, setV] = React.useState<Record<ReflectionPart, string>>({ saw: initial?.saw ?? "", learned: initial?.learned ?? "", ask: initial?.ask ?? "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const empty = !v.saw.trim() && !v.learned.trim() && !v.ask.trim();
  const contact = REFLECTION_PARTS.some((p) => hasContactDetails(v[p.key]));
  const noteId = `refl-note-${assignmentId}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (empty) return setErr("Write at least one line.");
    setBusy(true);
    setErr(null);
    const res = await save({ assignmentId, saw: v.saw, learned: v.learned, ask: v.ask }).catch(() => ({ ok: false as const, error: "Could not reach the server." }));
    setBusy(false);
    if (!res.ok) setErr(res.error);
    else onDone(res.data);
  }

  return (
    <form onSubmit={submit} className="flex min-w-0 flex-col gap-3" aria-label="Reflection" data-testid={`reflection-form-${assignmentId}`}>
      <p id={noteId} className="type-small text-muted-foreground">
        {NO_NAMES}
      </p>
      {REFLECTION_PARTS.map((p) => (
        <label key={p.key} className="flex min-w-0 flex-col gap-1.5">
          <span className={labelClass}>{p.label}</span>
          <textarea
            name={p.key}
            value={v[p.key]}
            onChange={(e) => setV((x) => ({ ...x, [p.key]: e.target.value }))}
            rows={2}
            maxLength={REFLECTION_MAX}
            aria-describedby={noteId}
            className={cn(fieldClass, "min-h-20 resize-y")}
          />
        </label>
      ))}
      {contact ? (
        <p role="status" className="type-small font-semibold text-status-pending-fg">
          Phone numbers and emails come out when you save.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? "Saving" : "Save reflection"}
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

/** Under a visit with its case count sent: the reflection (or a way to write one). */
export function ReflectionBlock({ assignmentId, reflection, save, onSaved }: { assignmentId: string; reflection: ClinicReflection | null; save: SaveReflection; onSaved: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  if (open) {
    return (
      <ReflectionForm
        assignmentId={assignmentId}
        initial={reflection}
        save={save}
        onCancel={() => setOpen(false)}
        onDone={(s) => {
          setOpen(false);
          setMsg(s.removed ? "Saved. We took out a phone number or email." : "Saved.");
          onSaved();
        }}
      />
    );
  }
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {reflection ? <ReflectionView r={reflection} /> : null}
      <button type="button" className={cn(textButton, "self-start")} onClick={() => {
          setMsg(null);
          setOpen(true);
        }}>
        {reflection ? "Change reflection" : "Add a reflection"}
      </button>
      {msg ? (
        <p role="status" className="type-small font-semibold">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

/** Every reflection I wrote, newest day first, with the replies. */
export function ReflectionHistory({ reflections, save, onSaved }: { reflections: ClinicReflection[]; save: SaveReflection; onSaved: () => void }) {
  if (!reflections.length) {
    return <p className="border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground">No reflections yet. After an OPD visit, send the case count, then add a few lines.</p>;
  }
  return (
    <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
      {reflections.map((r) => (
        <li key={r.id} className="flex min-w-0 flex-col gap-3 py-4">
          <span className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-4">
            <span className="type-body font-semibold">{dayLong(r.date)}</span>
            <span className="type-small text-muted-foreground">{BATCH_LABEL[r.batch]}</span>
          </span>
          <ReflectionBlock assignmentId={r.assignmentId} reflection={r} save={save} onSaved={onSaved} />
        </li>
      ))}
    </ul>
  );
}
