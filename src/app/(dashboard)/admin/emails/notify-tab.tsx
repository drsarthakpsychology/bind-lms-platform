"use client";

import * as React from "react";
import { Bell, Loader2, Mail, Send } from "lucide-react";
import { RichEditor } from "@/components/admin/rich-editor";
import { RecipientPicker } from "./recipient-picker";
import { sendNotificationAction } from "./notify-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeRich } from "@/lib/email/rich-html";
import type { NotifyBatch } from "@/lib/notify/send";
import { cn } from "@/lib/utils";

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * Messages → Notifications. Write a short note like a chat, or format it, pick
 * students (or a whole cohort), and it lands on their bell. Tick "Also email
 * it" to send the same message by email. Below: what was sent and how many
 * opened it.
 */
export function NotifyTab({ batches, ready, canWrite, initialTo = [] }: { batches: NotifyBatch[]; ready: boolean; canWrite: boolean; initialTo?: string[] }) {
  const [title, setTitle] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [key, setKey] = React.useState(0);
  const [alsoEmail, setAlsoEmail] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set(initialTo));
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; text: string } | null>(null);
  const hasText = html.replace(/<[^>]*>/g, "").trim().length > 0;
  const preview = React.useDeferredValue(sanitizeRich(html));

  async function send() {
    if (busy) return;
    setBusy(true);
    setResult(null);
    const r = await sendNotificationAction({ recipientEmails: [...selected], title, html, alsoEmail });
    setBusy(false);
    if (r.error) setResult({ ok: false, text: r.error });
    else {
      setResult({ ok: true, text: `Sent to ${r.created} student${r.created === 1 ? "" : "s"}.${alsoEmail ? ` Emailed ${r.emailed}${r.emailFailed ? `, ${r.emailFailed} emails failed (see Failed)` : ""}.` : ""}` });
      setTitle("");
      setHtml("");
      setKey((k) => k + 1);
      setSelected(new Set());
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-h1">Notifications</h1>
        <p className="mt-1 text-small text-muted-foreground">A message on the student&apos;s bell inside VIBHA. They open it, read it and close it; you see how many opened it.</p>
      </header>
      {!ready ? (
        <p role="alert" className="rounded-xl border-2 border-destructive bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">
          One database step is needed before students can receive these: run <code>2026_11_admin_redesign.sql</code> in Supabase → SQL Editor.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <div className="min-w-0 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="notify-title">Title</Label>
            <Input id="notify-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} placeholder="e.g. Live session moved to 7 pm today" />
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-semibold">Message</span>
            <RichEditor key={key} onChange={setHtml} minHeight="9rem" placeholder="Type it like a chat. Use the buttons for bold, lists or links." ariaLabel="Notification message" />
          </div>
          <label className="flex items-start gap-2 rounded-xl border-2 border-foreground/15 bg-card p-3 text-sm">
            <input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={alsoEmail} onChange={(e) => setAlsoEmail(e.target.checked)} />
            <span>
              <span className="flex items-center gap-1.5 font-bold"><Mail className="size-4" aria-hidden /> Also email it</span>
              <span className="text-caption text-muted-foreground">Same message by email, with a link back to it. Counts toward the daily email limit.</span>
            </span>
          </label>
          <div className="rounded-xl border-2 border-foreground/15 bg-card p-4">
            <h2 className="mb-3 text-small font-bold">Who gets it</h2>
            <RecipientPicker selected={selected} onChange={setSelected} />
          </div>
          {canWrite ? (
            <Button onClick={send} disabled={busy || !title.trim() || !hasText || selected.size === 0}>
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
              Send to {selected.size}
            </Button>
          ) : (
            <p className="text-caption text-muted-foreground">View Admins can read but not send.</p>
          )}
          {result ? (
            <p role="status" className={cn("rounded-xl border-2 p-3 text-sm font-semibold", result.ok ? "border-foreground bg-status-success-bg" : "border-destructive bg-status-alert-bg text-status-alert-fg")}>{result.text}</p>
          ) : null}
        </div>

        <aside className="space-y-2">
          <span className="text-sm font-semibold">What the student sees</span>
          <div className="rounded-2xl border-2 border-foreground bg-card p-4 hard-shadow-sm">
            <p className="flex items-center gap-2 text-caption font-bold text-link"><Bell className="size-4" aria-hidden /> VIBHA · now</p>
            <p className="mt-1 font-bold break-words">{title || "Your title"}</p>
            {preview ? (
              <div className="mt-2 text-sm leading-relaxed break-words [&_a]:font-bold [&_a]:text-link [&_a]:underline [&_h2]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: preview }} />
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Your message…</p>
            )}
          </div>
        </aside>
      </div>

      <section aria-label="Sent notifications" className="space-y-2">
        <h2 className="text-h3 font-bold">Sent</h2>
        {batches.length ? (
          <ul className="divide-y-2 divide-foreground/10 overflow-hidden rounded-2xl border-2 border-foreground bg-card">
            {batches.map((b) => (
              <li key={b.batchId} className="flex items-center gap-3 px-4 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{b.title}</span>
                  <span className="block text-caption text-muted-foreground">{when(b.sentAt)} · {b.type === "nudge" ? "Nudge" : "Message"}</span>
                </span>
                <span className="text-right text-sm tabular-nums">
                  <span className="block font-bold">{b.opened}/{b.total}</span>
                  <span className="block text-caption text-muted-foreground">opened</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-5 text-sm text-muted-foreground">Nothing sent yet.</p>
        )}
      </section>
    </div>
  );
}
