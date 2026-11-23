"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Loader2, Monitor, Smartphone, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { cleanEmail, MERGE_FIELDS, mergeVars, planPersonal, renderMerge, unknownFields, PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import type { PersonalReport } from "@/lib/email/personal";
import { byteSize, cleanDesignedHtml, designedToText, DESIGNED_LIMITS, fillDesigned, previewDocument, unknownDesignedFields, type DesignedInput } from "@/lib/email/designed-html";
import { btn, Notice } from "../_v2/kit";
import { sendDesignedTest } from "./email-actions";

export type ComposeRecipient = { key: string; name: string; email: string | null };
export type Allowance = { configured: boolean; limit: number; left: number };
export type ComposeMode = "plain" | "designed";

const MODES: Array<{ id: ComposeMode; label: string }> = [
  { id: "plain", label: "Plain email" },
  { id: "designed", label: "Designed email (HTML)" },
];
const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;

const field = "h-11 w-full min-w-0 rounded-md border border-[var(--ds-card-line)] bg-background px-3 type-small text-foreground outline-none transition-colors duration-[var(--ds-state)] hover:border-foreground/50 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Write one email to a group, with merge fields ({first_name}) and a preview
 * for each person. Shows how many go now and how many wait for tomorrow's
 * allowance before anything is sent, then what happened.
 */
export function EmailCompose({
  open,
  onOpenChange,
  recipients,
  allowance,
  extraFields = [],
  extraVars = {},
  onSend,
  title,
  defaultSubject = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: ComposeRecipient[];
  allowance: Allowance;
  /** More merge fields for this place (e.g. the form's name). */
  extraFields?: Array<{ key: string; label: string }>;
  extraVars?: Record<string, string>;
  /** `designed` is set when the admin sends a designed (HTML) email; the server cleans it again. */
  onSend: (subject: string, body: string, designed?: DesignedInput) => Promise<PersonalReport>;
  title?: string;
  defaultSubject?: string;
}) {
  const [mode, setMode] = React.useState<ComposeMode>("plain");
  const [subject, setSubject] = React.useState(defaultSubject);
  const [body, setBody] = React.useState("Hi {first_name},\n\n");
  const [html, setHtml] = React.useState("");
  const [text, setText] = React.useState("");
  const [view, setView] = React.useState<"phone" | "desktop">("phone");
  const [confirming, setConfirming] = React.useState(false);
  const [test, setTest] = React.useState<{ busy: boolean; note: string | null; bad: boolean }>({ busy: false, note: null, bad: false });
  const [fileNote, setFileNote] = React.useState<string | null>(null);
  const htmlRef = React.useRef<HTMLTextAreaElement>(null);
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [showing, setShowing] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [report, setReport] = React.useState<PersonalReport | null>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const focus = React.useRef<"subject" | "body" | "html" | "text">("body");
  const subjectRef = React.useRef<HTMLInputElement>(null);

  const plan = planPersonal(recipients, { limit: allowance.limit, sentToday: allowance.limit - allowance.left });
  const sendable = [...plan.send, ...plan.queue];
  const who = sendable[Math.min(showing, Math.max(0, sendable.length - 1))] ?? null;
  const vars = who ? { ...mergeVars(who), ...extraVars } : null;
  const fields = [...MERGE_FIELDS, ...extraFields];
  const designed = mode === "designed";
  const cleaned = designed ? cleanDesignedHtml(html) : null;
  const unknown = designed
    ? unknownDesignedFields(`${subject} ${html} ${text}`, fields.map((f) => f.key))
    : unknownFields(`${subject} ${body}`, fields.map((f) => f.key));
  const ready = designed
    ? Boolean(subject.trim() && cleaned && !cleaned.error && sendable.length > 0 && allowance.configured)
    : Boolean(subject.trim() && body.trim() && sendable.length > 0 && allowance.configured);
  // Shown only inside the sandboxed frame below, never in this page.
  const preview = designed && cleaned && !cleaned.error && vars ? previewDocument(fillDesigned(cleaned.html, vars, "html")) : "";
  const payload = (): DesignedInput => ({ html: cleaned?.html ?? "", text: text.trim() || null });

  function insert(key: string) {
    const token = designed ? `{{${key}}}` : `{${key}}`;
    const at = focus.current;
    const el = at === "subject" ? subjectRef.current : at === "html" ? htmlRef.current : at === "text" ? textRef.current : bodyRef.current;
    const value = at === "subject" ? subject : at === "html" ? html : at === "text" ? text : body;
    const set = at === "subject" ? setSubject : at === "html" ? setHtml : at === "text" ? setText : setBody;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    set(value.slice(0, start) + token + value.slice(end));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + token.length, start + token.length);
    });
  }

  async function pickFile(file: File | undefined) {
    if (!file) return;
    if (!/\.html?$/i.test(file.name) && file.type !== "text/html") {
      setFileNote("Pick a .html file.");
      return;
    }
    if (file.size > DESIGNED_LIMITS.bytes) {
      setFileNote(`That file is ${kb(file.size)}. The most is ${kb(DESIGNED_LIMITS.bytes)}.`);
      return;
    }
    setHtml(await file.text());
    setFileNote(`Loaded ${file.name}.`);
  }

  async function sendTest() {
    setTest({ busy: true, note: null, bad: false });
    const r = await sendDesignedTest({ subject, designed: payload(), sample: who ? { name: who.name, email: who.email } : undefined }).catch(() => ({ error: "Couldn't reach the server.", to: null }));
    setTest({ busy: false, note: r.error ?? `Test sent to ${r.to}.`, bad: Boolean(r.error) });
  }

  async function send() {
    setBusy(true);
    setConfirming(false);
    const r = await onSend(subject, body, designed ? payload() : undefined).catch(() => ({ error: "Couldn't reach the server. Look in Messages, Sent before trying again.", sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false }) as PersonalReport);
    setBusy(false);
    setReport(r);
  }

  function close(o: boolean) {
    if (busy) return;
    onOpenChange(o);
    if (!o && report && !report.error) {
      setReport(null);
      setSubject(defaultSubject);
      setBody("Hi {first_name},\n\n");
      setHtml("");
      setText("");
      setMode("plain");
      setShowing(0);
      setTest({ busy: false, note: null, bad: false });
    }
    if (!o) setConfirming(false);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className={cn("max-h-[92dvh] overflow-y-auto", designed ? "sm:max-w-5xl" : "sm:max-w-3xl")}>
        <DialogHeader>
          <DialogTitle>{report && !report.error ? "What happened" : (title ?? `Email ${plan.send.length + plan.queue.length} ${plan.send.length + plan.queue.length === 1 ? "person" : "people"}`)}</DialogTitle>
          <DialogDescription>
            {report && !report.error
              ? `${report.sent.length} sent${report.queued.length ? `, ${report.queued.length} waiting for tomorrow` : ""}.`
              : !allowance.configured
                ? "Email isn't set up on this site."
                : plan.queue.length
                  ? `${plan.send.length} go now. ${plan.queue.length} wait for tomorrow's allowance.`
                  : `${allowance.left} emails left today.`}
          </DialogDescription>
        </DialogHeader>

        {report && !report.error ? (
          <ReportView report={report} />
        ) : (
          // A desktop-width preview needs the whole window, so it moves under the form.
          <div className={cn("grid min-w-0 gap-5", designed && view === "desktop" ? "" : "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]")}>
            <div className="flex min-w-0 flex-col gap-4">
              {report?.error ? <Notice tone="alert">{report.error}</Notice> : null}
              <div role="radiogroup" aria-label="Kind of email" className="grid min-w-0 grid-cols-2 gap-1 rounded-md border border-[var(--ds-card-line)] p-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={mode === m.id}
                    onClick={() => {
                      setMode(m.id);
                      setConfirming(false);
                      focus.current = m.id === "designed" ? "html" : "body";
                    }}
                    className={cn(
                      "flex min-h-11 min-w-0 items-center justify-center rounded-[5px] px-2 text-center type-small font-semibold transition-colors duration-[var(--ds-state)] lg:min-h-9",
                      mode === m.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="cm-subject" className="mb-1.5 block type-small font-semibold">Subject</label>
                <input
                  id="cm-subject"
                  ref={subjectRef}
                  className={field}
                  value={subject}
                  maxLength={PERSONAL_LIMITS.subject}
                  onFocus={() => (focus.current = "subject")}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              {designed ? (
                <>
                  <div>
                    <div className="mb-1.5 flex min-w-0 flex-wrap items-center justify-between gap-2">
                      <label htmlFor="cm-html" className="type-small font-semibold">HTML</label>
                      <button type="button" className={btn.quiet} onClick={() => fileRef.current?.click()}>
                        <Upload aria-hidden /> Upload .html file
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".html,.htm,text/html"
                        className="sr-only"
                        tabIndex={-1}
                        aria-label="Upload .html file"
                        onChange={(e) => {
                          void pickFile(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </div>
                    <textarea
                      id="cm-html"
                      ref={htmlRef}
                      rows={10}
                      spellCheck={false}
                      placeholder="Paste the HTML here"
                      className={cn(field, "h-auto min-h-56 py-2 font-mono text-[13px] leading-snug")}
                      value={html}
                      onFocus={() => (focus.current = "html")}
                      onChange={(e) => setHtml(e.target.value)}
                    />
                    <p className="mt-1.5 type-caption text-muted-foreground type-num">
                      {html ? `${kb(byteSize(html))} of ${kb(DESIGNED_LIMITS.bytes)}` : `Up to ${kb(DESIGNED_LIMITS.bytes)}`}
                      {fileNote ? ` · ${fileNote}` : ""}
                    </p>
                  </div>
                  {html && cleaned?.error ? <Notice tone="alert">{cleaned.error}</Notice> : null}
                  {cleaned && !cleaned.error && cleaned.removed.length ? (
                    <Notice>
                      <span>
                        Taken out before sending: {cleaned.removed.map((r) => r.label).join(", ")}.
                      </span>
                    </Notice>
                  ) : null}
                  <div>
                    <label htmlFor="cm-text" className="mb-1.5 block type-small font-semibold">Plain-text version (optional)</label>
                    <textarea
                      id="cm-text"
                      ref={textRef}
                      rows={4}
                      placeholder={cleaned && !cleaned.error ? designedToText(cleaned.html).slice(0, 400) : "Left empty, it is made from the design."}
                      className={cn(field, "h-auto min-h-28 py-2 leading-normal")}
                      value={text}
                      maxLength={DESIGNED_LIMITS.text}
                      onFocus={() => (focus.current = "text")}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <p className="mt-1.5 type-caption text-muted-foreground">Left empty, it is made from the design.</p>
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="cm-body" className="mb-1.5 block type-small font-semibold">Email</label>
                  <textarea
                    id="cm-body"
                    ref={bodyRef}
                    rows={9}
                    className={cn(field, "h-auto min-h-48 py-2 leading-normal")}
                    value={body}
                    maxLength={PERSONAL_LIMITS.body}
                    onFocus={() => (focus.current = "body")}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              )}
              <div>
                <p className="mb-1.5 type-small font-semibold">Add a merge field</p>
                <div className="flex min-w-0 flex-wrap gap-2">
                  {fields.map((f) => (
                    <button key={f.key} type="button" className={btn.quiet} onMouseDown={(e) => e.preventDefault()} onClick={() => insert(f.key)}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              {unknown.length ? (
                <Notice>
                  {unknown.map((u) => (designed ? `{{${u}}}` : `{${u}}`)).join(", ")} {unknown.length === 1 ? "is" : "are"} not a merge field and will be sent as typed.
                </Notice>
              ) : null}
            </div>

            <section aria-label="Preview" className="flex min-w-0 flex-col gap-2">
              <div className="flex min-h-11 items-center justify-between gap-2">
                <p className="min-w-0 type-small font-semibold [overflow-wrap:anywhere]">{who ? `To ${who.name || who.email}` : "Nobody with an email"}</p>
                {sendable.length > 1 ? (
                  <span className="flex shrink-0 items-center gap-1">
                    <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label="Previous person" onClick={() => setShowing((i) => (i - 1 + sendable.length) % sendable.length)}>
                      <ChevronLeft aria-hidden />
                    </button>
                    <span className="type-caption text-muted-foreground type-num">
                      {Math.min(showing, sendable.length - 1) + 1} / {sendable.length}
                    </span>
                    <button type="button" className={cn(btn.ghost, "w-11 px-0 lg:w-9")} aria-label="Next person" onClick={() => setShowing((i) => (i + 1) % sendable.length)}>
                      <ChevronRight aria-hidden />
                    </button>
                  </span>
                ) : null}
              </div>
              {designed ? (
                <>
                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 flex-1 type-small font-semibold [overflow-wrap:anywhere]">{vars ? fillDesigned(subject, vars, "text") || "No subject yet" : subject || "No subject yet"}</p>
                    <div role="radiogroup" aria-label="Preview width" className="flex shrink-0 gap-1 rounded-md border border-[var(--ds-card-line)] p-1">
                      {([["phone", "Phone", Smartphone], ["desktop", "Desktop", Monitor]] as const).map(([id, label, Icon]) => (
                        <button
                          key={id}
                          type="button"
                          role="radio"
                          aria-checked={view === id}
                          onClick={() => setView(id)}
                          className={cn(
                            "inline-flex min-h-11 items-center gap-1.5 rounded-[5px] px-2.5 type-caption font-semibold transition-colors duration-[var(--ds-state)] lg:min-h-8 [&_svg]:size-4",
                            view === id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-[var(--ds-tint)] hover:text-foreground",
                          )}
                        >
                          <Icon aria-hidden /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0 overflow-x-auto rounded-md bg-[var(--ds-tint)] p-2">
                    {preview ? (
                      <iframe
                        title="Email preview"
                        sandbox=""
                        referrerPolicy="no-referrer"
                        srcDoc={preview}
                        className={cn("mx-auto block h-[34rem] rounded-[4px] border border-[var(--ds-card-line)] bg-white", view === "phone" ? "w-full max-w-[375px]" : "w-full min-w-[640px]")}
                      />
                    ) : (
                      <p className="flex h-40 items-center justify-center px-4 text-center type-small text-muted-foreground">The design shows here.</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="min-w-0 rounded-md bg-[var(--ds-tint)] p-4">
                  <p className="type-small font-semibold [overflow-wrap:anywhere]">{vars ? renderMerge(subject, vars) || "No subject yet" : subject}</p>
                  <p className="mt-3 type-small whitespace-pre-wrap [overflow-wrap:anywhere]">{vars ? renderMerge(body, vars) : body}</p>
                </div>
              )}
              <ul className="flex flex-col gap-1 type-caption text-muted-foreground">
                {plan.noEmail.length ? <li>{plan.noEmail.length} without an email address: skipped.</li> : null}
                {plan.duplicates ? <li>{plan.duplicates} picked twice: emailed once.</li> : null}
              </ul>
            </section>
          </div>
        )}

        <DialogFooter>
          {report && !report.error ? (
            <button type="button" className={btn.primary} onClick={() => close(false)}>Done</button>
          ) : (
            confirming ? (
              <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end" role="group" aria-label="Check before sending">
                <p className="min-w-0 type-small font-semibold sm:mr-auto" role="status">
                  Send this designed email to {sendable.length} {sendable.length === 1 ? "person" : "people"}?
                  {plan.queue.length ? ` ${plan.send.length} go now, ${plan.queue.length} wait for tomorrow.` : ""}
                </p>
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" className={btn.quiet} onClick={() => setConfirming(false)}>Back</button>
                  <button type="button" className={btn.primary} onClick={() => void send()}>Yes, send to {sendable.length}</button>
                </div>
              </div>
            ) : (
              <div className="flex w-full min-w-0 flex-col gap-2">
                {designed && test.note ? (
                  <p role="status" className={cn("type-small [overflow-wrap:anywhere] sm:text-right", test.bad ? "text-status-alert-fg" : "text-muted-foreground")}>{test.note}</p>
                ) : null}
                <div className="flex flex-wrap justify-end gap-2">
                  <button type="button" className={btn.quiet} disabled={busy} onClick={() => close(false)}>Cancel</button>
                  {designed ? (
                    <button type="button" className={btn.quiet} disabled={!ready || busy || test.busy} onClick={() => void sendTest()}>
                      {test.busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
                      {test.busy ? "Sending test" : "Send a test to me"}
                    </button>
                  ) : null}
                  <button type="button" className={btn.primary} disabled={!ready || busy} onClick={() => (designed ? setConfirming(true) : void send())}>
                    {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
                    {busy ? "Sending" : `Send to ${sendable.length}`}
                  </button>
                </div>
              </div>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReportView({ report }: { report: PersonalReport }) {
  const rows: Array<{ label: string; names: string[]; note?: string }> = [];
  if (report.sent.length) rows.push({ label: "Sent", names: report.sent });
  if (report.queued.length) rows.push({ label: "Waiting", names: report.queued, note: "They go out with Send waiting emails once today's allowance is back." });
  if (report.failed.length) rows.push({ label: "Failed", names: report.failed.map((f) => `${f.name} (${f.reason})`) });
  if (report.noEmail.length) rows.push({ label: "No email", names: report.noEmail });
  return (
    <div className="flex min-w-0 flex-col gap-3" role="status">
      {report.queueFailed ? <Notice tone="alert">The emails over today&apos;s allowance could not be kept. Send them again tomorrow.</Notice> : null}
      <dl className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
        {rows.map((r) => (
          <div key={r.label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
            <dt className="type-small font-semibold">
              {r.label} <span className="type-num text-muted-foreground">{r.names.length}</span>
            </dt>
            <dd className="min-w-0 type-small">
              <span className="[overflow-wrap:anywhere]">{r.names.join(", ")}</span>
              {r.note ? <span className="mt-1 block text-muted-foreground">{r.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Whether a row can be emailed at all. */
export const canEmail = (email: string | null | undefined) => Boolean(cleanEmail(email));
