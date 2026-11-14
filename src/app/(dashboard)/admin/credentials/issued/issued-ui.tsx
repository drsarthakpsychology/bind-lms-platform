"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Loader2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CertStatus } from "@/lib/certificates/kinds";
import { resendStudioCertificate, revokeStudioCertificate, sendWaitingCertificateEmails } from "../studio/actions";

/** Download, and (Super Admin) correct, resend and revoke for one certificate. */
export function RowActions({ credentialId, name, status, canWrite, canCorrect }: { credentialId: string; name: string; status: CertStatus; canWrite: boolean; canCorrect: boolean }) {
  const router = useRouter();
  const [revoking, setRevoking] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const live = status === "valid" || status === "provisional" || status === "expired";

  async function revoke() {
    setBusy(true);
    const r = await revokeStudioCertificate(credentialId, reason).catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(false);
    if (r.error) return toast.error(r.error);
    setRevoking(false);
    setReason("");
    toast.success("Revoked. The verify page now says so.");
    router.refresh();
  }
  async function resend() {
    const t = toast.loading("Sending again");
    const r = await resendStudioCertificate(credentialId, true).catch(() => ({ error: "Couldn't reach the server.", notified: false, delivery: null }));
    toast.dismiss(t);
    if (r.error) return void toast.error(r.error);
    const d = r.delivery;
    toast.success(d?.emailed.length ? "Sent again: app notification and email." : d?.queued.length ? "App notification sent. The email is waiting for tomorrow's allowance." : d?.failed.length ? `App notification sent. Email failed: ${d.failed[0].reason}` : "App notification sent.");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="outline" size="sm" className="pointer-coarse:h-11">
        <a href={`/api/certificates/${encodeURIComponent(credentialId)}/pdf`} aria-label={`Download the PDF for ${name}`}>
          <Download className="size-4" aria-hidden /> PDF
        </a>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="pointer-coarse:size-11" aria-label={`More for ${name}`}>
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem asChild>
            <Link href={`/verify/${encodeURIComponent(credentialId)}`} target="_blank">Open verify page</Link>
          </DropdownMenuItem>
          {canWrite && live ? (
            <>
              <DropdownMenuItem onSelect={() => void resend()}>Send again</DropdownMenuItem>
              {canCorrect ? (
                <DropdownMenuItem asChild>
                  <Link href={`/admin/credentials/studio?reissue=${encodeURIComponent(credentialId)}`}>Correct and reissue</Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setRevoking(true)}>Revoke</DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={revoking} onOpenChange={(o) => !busy && setRevoking(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke this certificate?</DialogTitle>
            <DialogDescription>{name}. The certificate stays on record and its verify page will say Revoked. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor={`rv-${credentialId}`} className="mb-1.5 block">Reason <span className="font-normal text-muted-foreground">(kept private)</span></Label>
            <Textarea id={`rv-${credentialId}`} rows={3} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={busy} onClick={() => setRevoking(false)}>Keep it</Button>
            <Button type="button" variant="destructive" disabled={busy || !reason.trim()} onClick={() => void revoke()}>
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Emails that went over the daily limit wait in a queue; this sends what today allows. */
export function SendWaiting({ waiting, canWrite, emailOn }: { waiting: number; canWrite: boolean; emailOn: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState<string | null>(null);
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-y border-foreground/10 py-3">
      <p className="min-w-0 text-small">
        <span className="font-semibold tabular-nums">{waiting}</span> certificate email{waiting === 1 ? " is" : "s are"} waiting.
        {note ? <span className="ml-2 text-muted-foreground" role="status">{note}</span> : null}
      </p>
      {canWrite ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="pointer-coarse:h-11"
          disabled={busy || !emailOn}
          onClick={async () => {
            setBusy(true);
            const r = await sendWaitingCertificateEmails().catch(() => ({ error: "Couldn't reach the server.", sent: 0, left: waiting }));
            setBusy(false);
            setNote(r.error ? r.error : r.sent ? `${r.sent} sent${r.left ? `, ${r.left} still waiting` : ""}.` : "Today's email allowance is used up. Try tomorrow.");
            router.refresh();
          }}
        >
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null} Send waiting emails
        </Button>
      ) : null}
    </div>
  );
}
