"use client";

import * as React from "react";
import { Loader2, Mail, Send, RefreshCw } from "lucide-react";
import { sendCredentialEmailsAction, sendTestEmailAction } from "../students/bulk-import";
import type { InviteRow } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function RosterActions({ rows }: { rows: InviteRow[] }) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  // Test email.
  const [testEmail, setTestEmail] = React.useState("");
  const [testBusy, setTestBusy] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ ok: boolean; detail: string } | null>(null);

  const pending = rows.filter((r) => r.status === "pending");
  const failed = rows.filter((r) => r.status === "failed");

  function toggle(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  }

  async function runSend(emails: string[], label: string) {
    setBusy(true);
    setFeedback(null);
    const res = await sendCredentialEmailsAction(emails);
    setBusy(false);
    if (res.error) {
      setFeedback(res.error);
    } else {
      setFeedback(`${label}: sent ${res.sent}, failed ${res.failed}.`);
      setSelected(new Set());
    }
    // Re-fetch to reflect the new statuses.
    window.location.reload();
  }

  async function runTest() {
    setTestBusy(true);
    setTestResult(null);
    const res = await sendTestEmailAction(testEmail);
    setTestBusy(false);
    setTestResult({ ok: res.ok, detail: res.error ?? res.detail });
  }

  return (
    <div className="space-y-6">
      {/* Test email */}
      <div className="rounded-md border-2 border-border bg-card p-5">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <Mail className="size-4 text-link" aria-hidden /> Send a test email
        </h2>
        <p className="mt-1 text-small text-muted-foreground">
          Sends the real credential email (marked <span className="font-semibold">[TEST]</span>) to any address,
          through the same Resend path the real send uses. Test as often as you like — it never reaches a student.
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

      {/* Send controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" onClick={() => runSend(pending.map((r) => r.email), "Send all pending")} disabled={busy || pending.length === 0}>
          <Send className="size-4" aria-hidden /> Send all pending ({pending.length})
        </Button>
        <Button type="button" variant="secondary" onClick={() => runSend(failed.map((r) => r.email), "Retry failed")} disabled={busy || failed.length === 0}>
          <RefreshCw className="size-4" aria-hidden /> Retry failed ({failed.length})
        </Button>
        <Button type="button" onClick={() => runSend(Array.from(selected), "Send selected")} disabled={busy || selected.size === 0}>
          Send selected ({selected.size})
        </Button>
      </div>
      {feedback && (
        <Alert variant="warning">
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}

      {/* The batch */}
      {rows.length === 0 ? (
        <p className="text-small text-muted-foreground">
          No imported accounts yet. Upload the roster CSV from /admin/tools → Import students first.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className={cn(
                "flex items-center gap-3 rounded-md border-2 border-border bg-card px-3 py-2",
                r.status === "sent" && "opacity-70",
              )}
            >
              <input
                type="checkbox"
                checked={selected.has(r.email)}
                onChange={() => toggle(r.email)}
                disabled={r.status === "sent"}
                aria-label={`Select ${r.email}`}
                className="size-4 accent-primary"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-small font-medium [overflow-wrap:anywhere]">{r.name}</p>
                <p className="truncate text-caption text-muted-foreground">{r.email}</p>
              </div>
              <Badge
                variant={r.status === "sent" ? "published" : r.status === "failed" ? "destructive" : "pending"}
              >
                {r.status}
              </Badge>
              <span className="hidden text-caption text-muted-foreground sm:block">{fmtDate(r.sent_at ?? r.created_at)}</span>
              {r.status === "failed" && (
                <>
                  <span className="hidden max-w-40 truncate text-caption text-status-alert-fg md:block" title={r.error_reason ?? ""}>
                    {r.error_reason}
                  </span>
                  <Button type="button" variant="ghost" size="xs" onClick={() => runSend([r.email], "Retry")} disabled={busy}>
                    Retry
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
