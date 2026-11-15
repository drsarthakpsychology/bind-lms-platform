"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { btn, Notice } from "../../_v2/kit";
import { issueCertificateToAnyone, previewCertificateToAnyone } from "../actions";
import { area, field, label, Step } from "../_ui/parts";

/**
 * A certificate for someone without an account (a volunteer, a guest
 * speaker). Same actions as before: they get the certificate as a PDF by
 * email and a public verify page; no login. If the email belongs to a
 * student, it also shows on their Achievements page.
 */
export function AnyoneIssue({ canWrite, today, signatures }: { canWrite: boolean; today: string; signatures: { id: string; label: string }[] }) {
  const [name, setName] = React.useState("");
  const [emailAddr, setEmailAddr] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [heading, setHeading] = React.useState("Certificate of Appreciation");
  const [lead, setLead] = React.useState("is recognised for");
  const [title, setTitle] = React.useState("");
  const [paragraph, setParagraph] = React.useState("");
  const [date, setDate] = React.useState(today);
  const [sig, setSig] = React.useState("");
  const [sendIt, setSendIt] = React.useState(true);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<"preview" | "issue" | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const [msg, setMsg] = React.useState<{ tone: "ok" | "alert"; text: string; id?: string } | null>(null);

  const input = { name, email: emailAddr, phone, title, paragraph, heading, lead, issuedOn: date, signatureFrom: sig || null };
  const ready = Boolean(name.trim() && emailAddr.trim() && title.trim() && paragraph.trim());

  React.useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  async function makePreview(open: boolean) {
    setBusy("preview");
    const r = await previewCertificateToAnyone(input).catch(() => ({ error: "Couldn't reach the server.", dataUrl: undefined }));
    setBusy(null);
    if (r.error || !r.dataUrl) return setMsg({ tone: "alert", text: r.error ?? "No preview." });
    const bytes = Uint8Array.from(atob(r.dataUrl.split(",")[1] ?? ""), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    setPreview(url);
    if (open) window.open(url, "_blank", "noopener");
  }

  async function issue() {
    setBusy("issue");
    const r = await issueCertificateToAnyone({ ...input, email_it: sendIt }).catch(() => ({ error: "Couldn't reach the server. Look in Issued before trying again.", credentialId: undefined, linkedStudent: null, emailNote: null }));
    setBusy(null);
    setConfirm(false);
    if (r.error) return setMsg({ tone: "alert", text: r.error });
    setMsg({
      tone: "ok",
      id: r.credentialId,
      text: `Issued to ${name}.${r.linkedStudent ? ` Also on ${r.linkedStudent}'s Achievements.` : ""}${r.emailNote ? ` Email not sent: ${r.emailNote}` : sendIt ? " Emailed with the PDF." : ""}`,
    });
    setName("");
    setEmailAddr("");
    setPhone("");
    setTitle("");
    setParagraph("");
    setPreview(null);
  }

  return (
    <div className="grid min-w-0 gap-[var(--ds-7)] lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:gap-14">
      <div className="flex min-w-0 flex-col gap-[var(--ds-7)]">
        {msg ? (
          msg.tone === "alert" ? (
            <Notice tone="alert">{msg.text}</Notice>
          ) : (
            <p role="status" className="type-small font-semibold [overflow-wrap:anywhere]">
              {msg.text}{" "}
              {msg.id ? (
                <Link href={`/verify/${msg.id}`} target="_blank" className="text-link underline underline-offset-4">
                  Open its verify page
                </Link>
              ) : null}
            </p>
          )
        ) : null}

        <section aria-labelledby="an-who" className="flex flex-col gap-4">
          <Step n={1} id="an-who">Who</Step>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="an-name" className={label}>Name to print</label>
              <input id="an-name" className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="off" placeholder="Asha Mehta" />
            </div>
            <div>
              <label htmlFor="an-email" className={label}>Email</label>
              <input id="an-email" className={field} type="email" inputMode="email" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} maxLength={120} autoComplete="off" placeholder="asha@gmail.com" />
            </div>
          </div>
          <div>
            <label htmlFor="an-phone" className={label}>Phone <span className="font-normal text-muted-foreground">(optional, kept private)</span></label>
            <input id="an-phone" className={field} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={24} autoComplete="off" placeholder="+91 98765 43210" />
          </div>
        </section>

        <section aria-labelledby="an-words" className="flex flex-col gap-4">
          <Step n={2} id="an-words">Wording</Step>
          <div>
            <label htmlFor="an-title" className={label}>Title</label>
            <input id="an-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Volunteer, Cohort 1 launch" />
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label htmlFor="an-para" className="type-small font-semibold">What they did</label>
              <span className="type-caption text-muted-foreground type-num">{paragraph.length} / 600</span>
            </div>
            <textarea id="an-para" rows={5} className={area} value={paragraph} onChange={(e) => setParagraph(e.target.value)} maxLength={600} placeholder="Ran registration for 120 students over three days." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="an-heading" className={label}>Heading</label>
              <input id="an-heading" className={field} value={heading} onChange={(e) => setHeading(e.target.value)} maxLength={60} />
            </div>
            <div>
              <label htmlFor="an-lead" className={label}>Line under the name</label>
              <input id="an-lead" className={field} value={lead} onChange={(e) => setLead(e.target.value)} maxLength={60} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="an-date" className={label}>Issue date</label>
              <input id="an-date" type="date" className={field} value={date} onChange={(e) => setDate(e.target.value || today)} />
            </div>
            <div>
              <label htmlFor="an-sig" className={label}>Signature image</label>
              <select id="an-sig" className={field} value={sig} onChange={(e) => setSig(e.target.value)}>
                <option value="">None (name only)</option>
                {signatures.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section aria-labelledby="an-send" className="flex flex-col gap-4">
          <Step n={3} id="an-send">Send</Step>
          <label className="flex min-h-11 items-center gap-3 type-small">
            <input type="checkbox" className="size-5 shrink-0 accent-[var(--link)]" checked={sendIt} onChange={(e) => setSendIt(e.target.checked)} />
            Email it to them with the PDF
          </label>
          {canWrite ? (
            <button type="button" className={cn(btn.primary, "w-full lg:h-11")} disabled={!ready || Boolean(busy)} onClick={() => setConfirm(true)}>
              Issue the certificate
            </button>
          ) : (
            <p className="type-small text-muted-foreground">Only the Super Admin can issue certificates.</p>
          )}
          {canWrite && !ready ? <p className="type-caption text-muted-foreground">Fill in the name, email, title and what they did.</p> : null}
        </section>
      </div>

      <aside aria-label="Certificate preview" className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-[calc(var(--top-h,3.5rem)+1.5rem)]">
        {preview ? (
          <iframe title="Certificate preview" src={preview} className="hidden aspect-[842/595] w-full rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-white lg:block" />
        ) : (
          <div className="hidden aspect-[842/595] w-full place-items-center rounded-[var(--ds-radius)] bg-[var(--ds-tint)] px-6 text-center type-small text-muted-foreground lg:grid">The preview shows here.</div>
        )}
        <div className="flex flex-wrap gap-2">
          {canWrite ? (
            <>
              <button type="button" className={cn(btn.quiet, "hidden lg:inline-flex")} disabled={Boolean(busy)} onClick={() => void makePreview(false)}>
                {busy === "preview" ? <Loader2 className="animate-spin" aria-hidden /> : <Eye aria-hidden />} Preview
              </button>
              <button type="button" className={btn.quiet} disabled={Boolean(busy)} onClick={() => void makePreview(true)}>
                {busy === "preview" ? <Loader2 className="animate-spin" aria-hidden /> : <ExternalLink aria-hidden />} Open the preview
              </button>
            </>
          ) : null}
        </div>
        <p className="type-caption text-muted-foreground">They get the certificate only, no login.</p>
      </aside>

      <Dialog open={confirm} onOpenChange={(o) => !busy && setConfirm(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue this certificate?</DialogTitle>
            <DialogDescription>
              {title} for {name}
              {sendIt ? `, emailed to ${emailAddr}` : ""}. It gets a public verify page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button" className={btn.quiet} disabled={Boolean(busy)} onClick={() => setConfirm(false)}>Not yet</button>
            <button type="button" className={btn.primary} disabled={Boolean(busy)} onClick={() => void issue()}>
              {busy === "issue" ? <Loader2 className="animate-spin" aria-hidden /> : null} Issue
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
