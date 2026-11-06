"use client";

import * as React from "react";
import { Check, Copy, Link2, Loader2, RefreshCw, Search, Send, X } from "lucide-react";
import { sendCredentialEmailsAction, sendTestEmailAction, resetCredentialAction } from "../students/bulk-import";
import type { InviteRow } from "@/lib/people/logins-data";
import { LockToggle } from "@/components/admin/lock-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  // Fixed locale + timezone so the server render and client hydration agree.
  return new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

type Stage = "not-sent" | "sent" | "failed" | "set-up";
function stageOf(r: InviteRow): Stage {
  if (r.setup_completed_at) return "set-up";
  if (r.status === "failed") return "failed";
  if (r.status === "sent") return "sent";
  return "not-sent";
}
const STAGE_LABEL: Record<Stage, string> = {
  "not-sent": "Not sent",
  sent: "Link sent",
  failed: "Failed",
  "set-up": "Set up",
};
const STAGE_CLASS: Record<Stage, string> = {
  "not-sent": "border-foreground/30 bg-muted text-foreground",
  sent: "border-foreground bg-card text-link",
  failed: "border-destructive bg-status-alert-bg text-status-alert-fg",
  "set-up": "border-foreground bg-primary text-primary-foreground",
};

/**
 * Logins — who has been sent their setup link and who has finished setting
 * their own password. No password is ever shown here (none is stored): each
 * row can email a fresh one-time link or copy one to share on WhatsApp.
 */
export function RosterActions({ rows }: { rows: InviteRow[] }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [linkBusy, setLinkBusy] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | Stage>("all");
  const [q, setQ] = React.useState("");

  const [testEmail, setTestEmail] = React.useState("");
  const [testBusy, setTestBusy] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ ok: boolean; detail: string } | null>(null);

  const [localRows, setLocalRows] = React.useState<InviteRow[]>(rows);
  const [sendingEmails, setSendingEmails] = React.useState<Set<string>>(new Set());

  const counts = {
    all: localRows.length,
    "not-sent": localRows.filter((r) => stageOf(r) === "not-sent").length,
    sent: localRows.filter((r) => stageOf(r) === "sent").length,
    failed: localRows.filter((r) => stageOf(r) === "failed").length,
    "set-up": localRows.filter((r) => stageOf(r) === "set-up").length,
  };
  const needle = q.trim().toLowerCase();
  const shown = (filter === "all" ? localRows : localRows.filter((r) => stageOf(r) === filter)).filter(
    (r) => !needle || `${r.name ?? ""} ${r.email}`.toLowerCase().includes(needle),
  );
  const selectable = shown.filter((r) => stageOf(r) !== "set-up");
  const allSelected = selectable.length > 0 && selectable.every((r) => selected.has(r.email));

  function toggle(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  async function runSend(emails: string[], label: string) {
    if (emails.length === 0) return;
    setBusy(true);
    setFeedback(null);
    setSendingEmails(new Set(emails));
    const res = await sendCredentialEmailsAction(emails);
    setSendingEmails(new Set());
    setBusy(false);
    if (res.error) {
      setFeedback({ ok: false, text: res.error });
      return;
    }
    setFeedback({ ok: res.failed === 0, text: `${label}: ${res.sent} sent${res.failed ? `, ${res.failed} failed` : ""}.` });
    setSelected(new Set());
    if (res.results?.length) {
      setLocalRows((prev) =>
        prev.map((r) => {
          const hit = res.results.find((x) => x.email === r.email);
          if (!hit) return r;
          return {
            ...r,
            status: hit.ok ? "sent" : "failed",
            error_reason: hit.ok ? null : (hit.reason ?? null),
            sent_at: hit.ok ? new Date().toISOString() : r.sent_at,
          };
        }),
      );
    }
  }

  async function copyLink(email: string) {
    setLinkBusy(email);
    setFeedback(null);
    const res = await resetCredentialAction(email);
    setLinkBusy(null);
    if (res.error || !res.setupUrl) {
      setFeedback({ ok: false, text: res.error ?? "Could not make a setup link." });
      return;
    }
    try {
      await navigator.clipboard.writeText(res.setupUrl);
      setCopied(email);
      window.setTimeout(() => setCopied(null), 2000);
      setFeedback({ ok: true, text: `Setup link for ${email} copied. Paste it into WhatsApp. It works once, for 3 days.` });
    } catch {
      setFeedback({ ok: true, text: `Setup link for ${email}: ${res.setupUrl}` });
    }
  }

  async function runTest() {
    setTestBusy(true);
    setTestResult(null);
    const res = await sendTestEmailAction(testEmail);
    setTestBusy(false);
    setTestResult({ ok: res.ok, detail: res.error ?? res.detail });
  }

  return (
    <div className="space-y-5">
      {/* Summary + bulk actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => runSend(Array.from(selected), "Sent selected")} disabled={busy || selected.size === 0}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Send to selected ({selected.size})
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => runSend(localRows.filter((r) => stageOf(r) === "not-sent").map((r) => r.email), "Sent to everyone not sent yet")}
          disabled={busy || counts["not-sent"] === 0}
        >
          Send to all not sent ({counts["not-sent"]})
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => runSend(localRows.filter((r) => stageOf(r) === "failed").map((r) => r.email), "Retried failed")}
          disabled={busy || counts.failed === 0}
        >
          <RefreshCw aria-hidden /> Retry failed ({counts.failed})
        </Button>
      </div>

      {/* Find someone fast, by name or email */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search logins by name or email"
          autoComplete="off"
          className="h-12 w-full rounded-2xl border-2 border-foreground bg-card pr-11 pl-12 text-base font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        />
        {q ? (
          <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-md hover:bg-muted">
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div role="group" aria-label="Show" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {(["all", "not-sent", "sent", "set-up", "failed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border-2 border-foreground px-3.5 text-sm font-bold transition-[transform,box-shadow] duration-fast hover:-translate-y-px hover:hard-shadow-xs",
              filter === f ? "bg-brand text-brand-foreground" : "bg-card",
            )}
          >
            {f === "all" ? "All" : STAGE_LABEL[f]}
            <span className="font-pix text-[0.65rem] opacity-80">{counts[f]}</span>
          </button>
        ))}
      </div>

      {feedback ? (
        <Alert variant={feedback.ok ? "default" : "destructive"}>
          <AlertDescription className="break-all">{feedback.text}</AlertDescription>
        </Alert>
      ) : null}

      {localRows.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-foreground/30 p-6 text-center text-sm font-semibold text-muted-foreground">
          No students yet. Add them on People → Students, or import a CSV from System → Admin tools.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-card">
          <div className="flex items-center gap-3 border-b-2 border-foreground/10 px-3 py-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() =>
                setSelected((prev) => {
                  const next = new Set(prev);
                  if (allSelected) selectable.forEach((r) => next.delete(r.email));
                  else selectable.forEach((r) => next.add(r.email));
                  return next;
                })
              }
              aria-label="Select all shown"
              className="size-4 accent-[#1d44d8]"
            />
            <span className="text-caption font-semibold text-muted-foreground">{shown.length} shown</span>
          </div>
          {shown.length === 0 && needle ? (
            <p className="p-5 text-sm font-semibold text-muted-foreground">Nobody matches &quot;{q}&quot;. Add them on People → Cohorts.</p>
          ) : null}
          <ul className="divide-y-2 divide-foreground/10">
            {shown.map((r) => {
              const stage = stageOf(r);
              const sending = sendingEmails.has(r.email);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 transition-colors hover:bg-accent">
                  <input
                    type="checkbox"
                    checked={selected.has(r.email)}
                    onChange={() => toggle(r.email)}
                    disabled={stage === "set-up" || sending}
                    aria-label={`Select ${r.email}`}
                    className="size-4 accent-[#1d44d8]"
                  />
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="truncate text-sm font-bold">{r.name}</p>
                    <p className="truncate text-caption text-muted-foreground">{r.email}</p>
                  </div>
                  <span className={cn("inline-flex h-7 items-center rounded-full border-2 px-2.5 text-xs font-bold", STAGE_CLASS[stage])}>
                    {sending ? "Sending…" : STAGE_LABEL[stage]}
                  </span>
                  <span className="w-28 text-caption text-muted-foreground" title={r.error_reason ?? undefined}>
                    {stage === "set-up" ? fmtDate(r.setup_completed_at) : stage === "failed" ? "Didn't send" : fmtDate(r.sent_at)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {stage !== "set-up" ? (
                      <>
                        <Button type="button" size="sm" variant="outline" onClick={() => runSend([r.email], `Sent to ${r.email}`)} disabled={busy || sending}>
                          <Send aria-hidden /> {stage === "not-sent" ? "Send" : "Resend"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => copyLink(r.email)}
                          disabled={linkBusy === r.email}
                          aria-label={`Copy a setup link for ${r.email}`}
                          title="Copy a one-time setup link (to share on WhatsApp)"
                        >
                          {linkBusy === r.email ? <Loader2 className="animate-spin" aria-hidden /> : copied === r.email ? <Check aria-hidden /> : <Copy aria-hidden />}
                          <span className="hidden sm:inline">Copy link</span>
                        </Button>
                      </>
                    ) : (
                      <Button type="button" size="sm" variant="ghost" onClick={() => copyLink(r.email)} disabled={linkBusy === r.email} title="Make a new setup link (if they forgot their password)">
                        <Link2 aria-hidden /> <span className="hidden sm:inline">New link</span>
                      </Button>
                    )}
                    {r.lockUserId ? <LockToggle userId={r.lockUserId} status={r.lockStatus} /> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Test email */}
      <div className="rounded-2xl border-2 border-dashed border-foreground/30 p-4">
        <Label htmlFor="test-email" className="text-sm font-bold">
          Send yourself a test
        </Label>
        <p className="mt-1 text-caption text-muted-foreground">Sends the real setup email, marked [TEST], to any address.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input id="test-email" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="you@example.com" />
          <Button type="button" variant="outline" onClick={runTest} disabled={testBusy || !testEmail}>
            {testBusy ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Send test
          </Button>
        </div>
        {testResult ? (
          <p className={cn("mt-2 text-caption font-semibold", testResult.ok ? "text-foreground" : "text-destructive")}>{testResult.detail}</p>
        ) : null}
      </div>
    </div>
  );
}
