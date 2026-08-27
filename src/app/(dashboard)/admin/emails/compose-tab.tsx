"use client";

import * as React from "react";
import { Eye, Loader2, MailCheck, PencilLine, Send, Terminal } from "lucide-react";
import { sendCampaignEmail, sendTestCampaignEmail } from "./actions";
import { RecipientPicker } from "./recipient-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { cn } from "@/lib/utils";

export type ComposeTemplate = {
  id: string;
  label: string;
  defaultSubject: string;
  hint: string;
};

/** The starting point for a fully custom (blank) email — a minimal shell the admin edits. */
const BLANK_HTML = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FFF9F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9F0;"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:#ffffff;border:2px solid #1a1a1a;border-radius:10px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#1a1a1a;">Write your email here</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#1a1a1a;">Use inline styles for email-safe rendering.</p>
    </td></tr>
  </table>
</td></tr></table>
</body>
</html>`;

/**
 * The compose tab — ready-made templates or a fully custom HTML email, with a
 * LIVE visual preview (sandboxed iframe, so pasted markup can never run
 * scripts) before anything is sent. "Send test to me" verifies the exact
 * render in the admin's inbox; "Send to N" confirms the recipient list first.
 */
export function ComposeTab({
  adminEmail,
  templates,
}: {
  adminEmail: string;
  templates: ComposeTemplate[];
}) {
  const [templateId, setTemplateId] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [html, setHtml] = React.useState(BLANK_HTML);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [testBusy, setTestBusy] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ ok: boolean; detail: string } | null>(null);
  const [sendBusy, setSendBusy] = React.useState(false);
  const [sendResult, setSendResult] = React.useState<{ ok: boolean; detail: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  // The preview lags a beat behind typing so a long HTML paste doesn't stall
  // the editor (React's useDeferredValue — the textarea stays responsive).
  const previewHtml = React.useDeferredValue(html);

  async function applyTemplate(id: string) {
    setTemplateId(id);
    setSendResult(null);
    if (!id) {
      setSubject("");
      setHtml(BLANK_HTML);
      return;
    }
    const res = await fetch("/api/emails/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: id }),
    }).catch(() => null);
    const data = res?.ok ? ((await res.json()) as { subject?: string; html?: string }) : null;
    if (data?.html) {
      setSubject(data.subject ?? "");
      setHtml(data.html);
    }
  }

  async function runTest() {
    if (testBusy) return;
    setTestBusy(true);
    setTestResult(null);
    const res = await sendTestCampaignEmail({ subject, html });
    setTestBusy(false);
    setTestResult({ ok: res.ok, detail: res.error ?? res.detail });
  }

  async function runSend() {
    if (sendBusy) return;
    setSendBusy(true);
    setSendResult(null);
    const res = await sendCampaignEmail({
      subject,
      html,
      recipientEmails: Array.from(selected),
      templateId: templateId || null,
    });
    setSendBusy(false);
    setConfirmOpen(false);
    setSendResult(
      res.error
        ? { ok: false, detail: res.error }
        : { ok: true, detail: `Sent to ${res.sent}, failed ${res.failed}.` },
    );
    if (res.error === null && res.sent > 0) setSelected(new Set());
  }

  return (
    <div className="space-y-6">
      {/* Template picker */}
      <div className="rounded-md border-2 border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <PencilLine className="size-4 text-link" aria-hidden /> Start from a template
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyTemplate("")}
            className={cn(
              "rounded-md border-2 border-border px-3 py-1.5 text-small font-medium transition-colors",
              templateId === "" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            Blank
          </button>
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              className={cn(
                "rounded-md border-2 border-border px-3 py-1.5 text-small font-medium transition-colors",
                templateId === t.id ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        {templates.find((t) => t.id === templateId)?.hint ? (
          <p className="mt-2 text-caption text-muted-foreground">{templates.find((t) => t.id === templateId)?.hint}</p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="campaign-subject">Subject</Label>
            <Input
              id="campaign-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              placeholder="What this email is about"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="campaign-html" className="flex items-center gap-1.5">
              <Terminal className="size-3.5 text-muted-foreground" aria-hidden />
              Email HTML
            </Label>
            <Textarea
              id="campaign-html"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full rounded-md border-2 border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed"
            />
            <p className="text-caption text-muted-foreground">
              Write it as an HTML email — inline styles only, so it renders the same everywhere.
            </p>
          </div>

          {/* Recipients */}
          <div className="rounded-md border-2 border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-small font-semibold">
              <MailCheck className="size-4 text-link" aria-hidden /> Recipients
            </h3>
            <div className="mt-3">
              <RecipientPicker selected={selected} onChange={setSelected} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" onClick={runTest} disabled={testBusy || !subject.trim() || !html.trim()}>
              {testBusy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              {testBusy ? "Sending…" : "Send test to me"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSendResult(null);
                setConfirmOpen(true);
              }}
              disabled={selected.size === 0 || !subject.trim() || !html.trim()}
            >
              <Send className="size-4" aria-hidden />
              Send to {selected.size}
            </Button>
          </div>
          {testResult ? (
            <Alert variant={testResult.ok ? "warning" : "destructive"}>
              <AlertDescription>{testResult.detail}</AlertDescription>
            </Alert>
          ) : null}
          {sendResult ? (
            <Alert variant={sendResult.ok ? "warning" : "destructive"}>
              <AlertDescription>{sendResult.detail}</AlertDescription>
            </Alert>
          ) : null}
        </div>

        {/* Live preview — the whole point: verify before sending. */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5">
            <Eye className="size-3.5 text-muted-foreground" aria-hidden />
            Live preview
          </Label>
          <div className="overflow-hidden rounded-md border-2 border-border bg-[#FFF9F0]">
            <iframe
              title="Email preview"
              sandbox=""
              srcDoc={previewHtml}
              className="block h-[520px] w-full border-0"
            />
          </div>
          <p className="text-caption text-muted-foreground">
            {adminEmail ? `Test-sends go to ${adminEmail}.` : "Test-send is unavailable (no admin email on file)."}
          </p>
        </div>
      </div>

      {/* Confirm-before-send sheet */}
      <MobileBottomSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Send this email?"
        description={`To ${selected.size} recipient${selected.size === 1 ? "" : "s"} — subject “${subject.trim() || "(no subject)"}”`}
        footer={
          <div className="flex flex-col gap-2">
            <Button type="button" onClick={runSend} disabled={sendBusy} className="w-full">
              {sendBusy && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {sendBusy ? "Sending…" : `Send to ${selected.size} recipient${selected.size === 1 ? "" : "s"}`}
            </Button>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} className="w-full" disabled={sendBusy}>
              Keep editing
            </Button>
          </div>
        }
      >
        <div className="max-h-56 space-y-1 overflow-y-auto">
          {Array.from(selected).sort().slice(0, 50).map((email) => (
            <p key={email} className="truncate text-small text-foreground [overflow-wrap:anywhere]">{email}</p>
          ))}
          {selected.size > 50 ? (
            <p className="text-caption text-muted-foreground">…and {selected.size - 50} more.</p>
          ) : null}
        </div>
      </MobileBottomSheet>
    </div>
  );
}
