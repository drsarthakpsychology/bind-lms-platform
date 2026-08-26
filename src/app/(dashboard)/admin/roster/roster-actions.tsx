"use client";

import * as React from "react";
import { Check, Copy, Download, Eye, EyeOff, KeyRound, Loader2, Mail, RefreshCw, Send } from "lucide-react";
import { sendCredentialEmailsAction, sendTestEmailAction, resetCredentialAction } from "../students/bulk-import";
import type { InviteRow } from "./page";
import { LockToggle } from "@/components/admin/lock-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  // Fixed locale + timezone so the server render and client hydration agree
  // (the default locale/timezone differ between Vercel=UTC and the admin's
  // browser, which caused a React hydration mismatch on this page).
  return new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Build a download-ready CSV of the password list and trigger the download. */
function downloadCsv(rows: InviteRow[]) {
  const esc = (v: string) => (v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v);
  const header = "Name,Email,Password,Status";
  const body = rows
    .map((r) => `${esc(r.name)},${esc(r.email)},${esc(r.password ?? "")},${r.status}`)
    .join("\n");
  const blob = new Blob([`${header}\n${body}\n`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vibha-roster-passwords.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function RosterActions({ rows }: { rows: InviteRow[] }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Password reveal + copy.
  const [revealed, setRevealed] = React.useState<Set<string>>(new Set());
  const [copied, setCopied] = React.useState<string | null>(null);
  const [resetBusy, setResetBusy] = React.useState<string | null>(null);

  // Test email.
  const [testEmail, setTestEmail] = React.useState("");
  const [testBusy, setTestBusy] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ ok: boolean; detail: string } | null>(null);

  // Local copy so send/reset reconcile rows in place (no full page reload after
  // a slow Resend loop). The server action also revalidates /admin/roster, so
  // the next full navigation shows server-authoritative rows.
  const [localRows, setLocalRows] = React.useState<InviteRow[]>(rows);
  const [sendingEmails, setSendingEmails] = React.useState<Set<string>>(new Set());

  const pending = localRows.filter((r) => r.status === "pending");
  const failed = localRows.filter((r) => r.status === "failed");
  // Everything not yet sent can be batch-selected ("Select all").
  const selectableRows = localRows.filter((r) => r.status !== "sent");
  const allSelected = selectableRows.length > 0 && selectableRows.every((r) => selected.has(r.email));

  function toggle(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) selectableRows.forEach((r) => next.delete(r.email));
      else selectableRows.forEach((r) => next.add(r.email));
      return next;
    });
  }

  async function runSend(emails: string[], label: string) {
    setBusy(true);
    setFeedback(null);
    setSendingEmails(new Set(emails));
    const res = await sendCredentialEmailsAction(emails);
    setSendingEmails(new Set());
    setBusy(false);
    if (res.error) {
      setFeedback(res.error);
      return;
    }
    setFeedback(`${label}: sent ${res.sent}, failed ${res.failed}.`);
    setSelected(new Set());
    // Reconcile each row from the server's per-email result — no full reload.
    // "failed" always comes from the server result, never assumed.
    if (res.results?.length) {
      setLocalRows((prev) => prev.map((r) => {
        const hit = res.results.find((x) => x.email === r.email);
        if (!hit) return r;
        return {
          ...r,
          status: hit.ok ? "sent" : "failed",
          error_reason: hit.ok ? null : (hit.reason ?? null),
          sent_at: hit.ok ? new Date().toISOString() : null,
        };
      }));
    }
  }

  async function runTest() {
    setTestBusy(true);
    setTestResult(null);
    const res = await sendTestEmailAction(testEmail);
    setTestBusy(false);
    setTestResult({ ok: res.ok, detail: res.error ?? res.detail });
  }

  async function runReset(email: string) {
    setResetBusy(email);
    setFeedback(null);
    const res = await resetCredentialAction(email);
    setResetBusy(null);
    if (res.error || !res.password) {
      setFeedback(res.error ?? "Could not reset the password.");
      return;
    }
    setFeedback(`New password for ${email}: ${res.password}`);
    setRevealed((prev) => new Set(prev).add(email));
    setLocalRows((prev) =>
      prev.map((r) => (r.email === email ? { ...r, password: res.password ?? "", status: "pending", sent_at: null } : r)),
    );
  }

  async function copyPassword(email: string, password: string) {
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      /* clipboard may be blocked; the reveal still works */
    }
    setCopied(email);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Test email */}
      <div className="rounded-md border-2 border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Mail className="size-4 text-link" aria-hidden /> Send a test email
        </h2>
        <p className="mt-1 text-small text-muted-foreground">
          Sends the real credential email (marked <span className="font-semibold">[TEST]</span>) with a real 8-char password to any
          address, through the same Resend path the real send uses. Test as often as you like — it never reaches a student.
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <div className="min-w-64 flex-1 space-y-1.5">
            <Label htmlFor="test-email">To</Label>
            <Input
              id="test-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button type="button" onClick={runTest} disabled={testBusy || !testEmail.trim()}>
            {testBusy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {testBusy ? "Sending…" : "Send test email"}
          </Button>
        </div>
        {testResult && (
          <Alert variant={testResult.ok ? "warning" : "destructive"} className="mt-3">
            <AlertDescription>{testResult.detail}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Send + download controls */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1.5 text-small text-foreground">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            disabled={selectableRows.length === 0}
            aria-label="Select all pending"
            className="size-4 accent-primary"
          />
          Select all
        </label>
        <Button type="button" variant="secondary" onClick={() => runSend(pending.map((r) => r.email), "Send all pending")} disabled={busy || pending.length === 0}>
          <Send className="size-4" aria-hidden /> Send all pending ({pending.length})
        </Button>
        <Button type="button" variant="secondary" onClick={() => runSend(failed.map((r) => r.email), "Retry failed")} disabled={busy || failed.length === 0}>
          <RefreshCw className="size-4" aria-hidden /> Retry failed ({failed.length})
        </Button>
        <Button type="button" onClick={() => runSend(Array.from(selected), "Send selected")} disabled={busy || selected.size === 0}>
          Send selected ({selected.size})
        </Button>
        <Button type="button" variant="outline" onClick={() => downloadCsv(localRows)} disabled={localRows.length === 0}>
          <Download className="size-4" aria-hidden /> Download password list (CSV)
        </Button>
      </div>
      {feedback && (
        <Alert variant="warning">
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}

      {/* The batch */}
      {localRows.length === 0 ? (
        <p className="text-small text-muted-foreground">
          No imported accounts yet. Upload the roster CSV from /admin/tools → Import students first.
        </p>
      ) : (
        <ul className="space-y-2">
          {localRows.map((r) => {
            const isRevealed = revealed.has(r.email);
            const password = r.password ?? "";
            const sending = sendingEmails.has(r.email);
            return (
              <li
                key={r.id}
                className={cn(
                  "flex flex-wrap items-center gap-3 rounded-md border-2 border-border bg-card px-3 py-2",
                  r.status === "sent" && "opacity-80",
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.has(r.email)}
                  onChange={() => toggle(r.email)}
                  disabled={r.status === "sent" || sending}
                  aria-label={`Select ${r.email}`}
                  className="size-4 accent-primary"
                />
                <div className="min-w-0 flex-1 basis-40">
                  <p className="truncate text-small font-medium [overflow-wrap:anywhere]">{r.name}</p>
                  <p className="truncate text-caption text-muted-foreground">{r.email}</p>
                </div>

                {/* The password — the whole point of this screen. */}
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex min-w-24 items-center rounded border border-border bg-muted px-2 py-1 font-mono text-small">
                    <KeyRound className="mr-1.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    {password ? (isRevealed ? password : "•".repeat(password.length)) : "—"}
                  </span>
                  {password && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setRevealed((prev) => {
                            const next = new Set(prev);
                            if (next.has(r.email)) next.delete(r.email);
                            else next.add(r.email);
                            return next;
                          })
                        }
                        aria-label={isRevealed ? "Hide password" : "Show password"}
                        className="inline-flex size-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {isRevealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyPassword(r.email, password)}
                        aria-label="Copy password"
                        className="inline-flex size-8 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {copied === r.email ? <Check className="size-4 text-status-success-fg" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => runReset(r.email)}
                        disabled={resetBusy === r.email}
                        title="Generate a new password"
                      >
                        {resetBusy === r.email ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <RefreshCw className="size-3.5" aria-hidden />}
                        Reset
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() => runSend([r.email], "Email")}
                        disabled={busy || sending}
                        title="Email this student their password (manual send)"
                      >
                        {sending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Mail className="size-3.5" aria-hidden />}
                        {sending ? "Sending…" : "Email"}
                      </Button>
                    </>
                  )}
                </div>

                {r.lockUserId && <LockToggle userId={r.lockUserId} status={r.lockStatus} />}

                <Badge
                  variant={r.status === "sent" ? "published" : r.status === "failed" ? "destructive" : "pending"}
                >
                  {r.status}
                </Badge>
                <span className="hidden text-caption text-muted-foreground sm:block">{fmtDate(r.sent_at ?? r.created_at)}</span>
                {r.status === "failed" && (
                  <span className="hidden max-w-40 truncate text-caption text-status-alert-fg md:block" title={r.error_reason ?? ""}>
                    {r.error_reason}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
