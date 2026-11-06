"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, Loader2, ShieldOff, Stamp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCredentialDownload, revokeCredential } from "../achievements/actions";
import { issueCertificateToAnyone, issueCustomCertificate, previewCertificateToAnyone, previewCustomCertificate } from "./actions";

/** Download / revoke for one credential. */
export function CredentialActions({ credentialId, revoked, hasPdf, canWrite }: { credentialId: string; revoked: boolean; hasPdf: boolean; canWrite: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState<string | null>(null);
  return (
    <span className="flex flex-wrap gap-2">
      {hasPdf ? (
        <Button
          size="sm"
          variant="outline"
          disabled={Boolean(busy)}
          onClick={async () => {
            setBusy("dl");
            const r = await getCredentialDownload(credentialId);
            setBusy(null);
            if (r.url) window.open(r.url, "_blank", "noopener");
            else toast.error(r.error ?? "No file.");
          }}
        >
          {busy === "dl" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Download className="size-4" aria-hidden />} PDF
        </Button>
      ) : null}
      {canWrite && !revoked ? (
        <Button
          size="sm"
          variant="outline"
          disabled={Boolean(busy)}
          onClick={async () => {
            const reason = window.prompt("Why is this being revoked? (the student's verify page will say it was revoked)");
            if (!reason?.trim()) return;
            setBusy("rv");
            const r = await revokeCredential(credentialId, reason);
            setBusy(null);
            if (r.error) toast.error(r.error);
            else {
              toast.success("Revoked.");
              router.refresh();
            }
          }}
        >
          {busy === "rv" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ShieldOff className="size-4" aria-hidden />} Revoke
        </Button>
      ) : null}
    </span>
  );
}

/** Design and issue a certificate for one student, with a live PDF preview. */
export function IssueCertificateForm({ userId, defaultName, signatures }: { userId: string; defaultName: string; signatures: { id: string; label: string }[] }) {
  const router = useRouter();
  const [name, setName] = React.useState(defaultName);
  const [heading, setHeading] = React.useState("Certificate of Completion");
  const [lead, setLead] = React.useState("has successfully completed");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(() => new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10));
  const [sig, setSig] = React.useState(signatures[0]?.id ?? "");
  const [email, setEmail] = React.useState(true);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<"preview" | "issue" | null>(null);

  const input = { userId, studentName: name, title, heading, lead, description, issuedOn: date, signatureFrom: sig || null };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="space-y-1.5"><Label htmlFor="c-name">Name to print</Label><Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="c-heading">Heading</Label><Input id="c-heading" value={heading} onChange={(e) => setHeading(e.target.value)} maxLength={60} /></div>
          <div className="space-y-1.5"><Label htmlFor="c-lead">Line under the name</Label><Input id="c-lead" value={lead} onChange={(e) => setLead(e.target.value)} maxLength={60} /></div>
        </div>
        <div className="space-y-1.5"><Label htmlFor="c-title">Title (what it is for)</Label><Input id="c-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Clinical Interviewing & MSE — Module 1" /></div>
        <div className="space-y-1.5"><Label htmlFor="c-desc">Description (optional, up to 3 lines)</Label><Textarea id="c-desc" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} rows={3} placeholder="e.g. 24 hours of supervised training, 6 case formulations and a viva." /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="c-date">Issue date</Label><Input id="c-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label htmlFor="c-sig">Signature</Label>
            <select id="c-sig" value={sig} onChange={(e) => setSig(e.target.value)} className="h-10 w-full rounded-md border-2 border-input bg-background px-3 text-sm">
              <option value="">No signature</option>
              {signatures.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={email} onChange={(e) => setEmail(e.target.checked)} /> Also email it to the student (they always get a notification)</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={Boolean(busy)}
            onClick={async () => {
              setBusy("preview");
              const r = await previewCustomCertificate(input);
              setBusy(null);
              if (r.error) toast.error(r.error);
              else setPreview(r.dataUrl ?? null);
            }}
          >
            {busy === "preview" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Eye className="size-4" aria-hidden />} Preview
          </Button>
          <Button
            disabled={Boolean(busy) || !title.trim() || !name.trim()}
            onClick={async () => {
              if (!window.confirm(`Issue "${title}" to ${name}? It gets a public verify page.`)) return;
              setBusy("issue");
              const r = await issueCustomCertificate({ ...input, email });
              setBusy(null);
              if (r.error) toast.error(r.error);
              else {
                toast.success(`Issued · ${r.credentialId}`);
                setTitle("");
                setDescription("");
                setPreview(null);
                router.refresh();
              }
            }}
          >
            {busy === "issue" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Stamp className="size-4" aria-hidden />} Issue certificate
          </Button>
        </div>
      </div>
      <div className="min-h-64 overflow-hidden rounded-2xl border-2 border-foreground bg-muted">
        {preview ? (
          <iframe title="Certificate preview" src={preview} className="block h-[28rem] w-full border-0" />
        ) : (
          <p className="grid h-full min-h-64 place-items-center p-6 text-center text-sm text-muted-foreground">Press Preview to see the certificate.</p>
        )}
      </div>
    </div>
  );
}

/**
 * "For anyone": a certificate for someone who may not be a student (a
 * volunteer, a guest speaker). They get the certificate only, no account.
 */
export function AnyoneCertificateForm({ signatures }: { signatures: { id: string; label: string }[] }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [emailAddr, setEmailAddr] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [heading, setHeading] = React.useState("Certificate of Appreciation");
  const [lead, setLead] = React.useState("is recognised for");
  const [title, setTitle] = React.useState("");
  const [paragraph, setParagraph] = React.useState("");
  const [date, setDate] = React.useState(() => new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10));
  const [sig, setSig] = React.useState("");
  const [sendIt, setSendIt] = React.useState(true);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<"preview" | "issue" | null>(null);

  const input = { name, email: emailAddr, phone, title, paragraph, heading, lead, issuedOn: date, signatureFrom: sig || null };
  const ready = Boolean(name.trim() && emailAddr.trim() && title.trim() && paragraph.trim());
  const btn = "h-11 rounded-md px-4";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="a-name">Name to print</Label><Input id="a-name" className="h-11" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="off" placeholder="e.g. Asha Mehta" /></div>
          <div className="space-y-1.5"><Label htmlFor="a-email">Email</Label><Input id="a-email" className="h-11" type="email" inputMode="email" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} maxLength={120} autoComplete="off" placeholder="asha@gmail.com" /></div>
        </div>
        <div className="space-y-1.5"><Label htmlFor="a-phone">Phone (optional, kept private)</Label><Input id="a-phone" className="h-11" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={24} autoComplete="off" placeholder="+91 98765 43210" /></div>
        <div className="space-y-1.5"><Label htmlFor="a-title">Title (what it is for)</Label><Input id="a-title" className="h-11" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Volunteer, Cohort 1 launch" /></div>
        <div className="space-y-1.5">
          <Label htmlFor="a-para">What they did</Label>
          <Textarea id="a-para" value={paragraph} onChange={(e) => setParagraph(e.target.value)} maxLength={600} rows={5} placeholder="e.g. Ran registration for 120 students over three days and helped every new student get set up." aria-describedby="a-para-help" />
          <p id="a-para-help" className="text-caption text-muted-foreground">Printed on the certificate and shown on its public check page. {paragraph.length}/600</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="a-heading">Heading</Label><Input id="a-heading" className="h-11" value={heading} onChange={(e) => setHeading(e.target.value)} maxLength={60} /></div>
          <div className="space-y-1.5"><Label htmlFor="a-lead">Line under the name</Label><Input id="a-lead" className="h-11" value={lead} onChange={(e) => setLead(e.target.value)} maxLength={60} /></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="a-date">Issue date</Label><Input id="a-date" className="h-11" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label htmlFor="a-sig">Signature image</Label>
            <select id="a-sig" value={sig} onChange={(e) => setSig(e.target.value)} className="h-11 w-full rounded-md border-2 border-input bg-background px-3 text-sm">
              <option value="">None (name only)</option>
              {signatures.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <p className="text-caption text-muted-foreground">Signed: Kavya Bothra, COO. They get the certificate only, no login. If the email belongs to a student, it also shows on their Achievements page.</p>
        <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" className="size-5 accent-primary" checked={sendIt} onChange={(e) => setSendIt(e.target.checked)} /> Email it to them (PDF + LinkedIn &quot;Add to profile&quot; link)</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            className={btn}
            disabled={Boolean(busy)}
            onClick={async () => {
              setBusy("preview");
              const r = await previewCertificateToAnyone(input);
              setBusy(null);
              if (r.error) toast.error(r.error);
              else setPreview(r.dataUrl ?? null);
            }}
          >
            {busy === "preview" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Eye className="size-4" aria-hidden />} Preview
          </Button>
          <Button
            className={btn}
            disabled={Boolean(busy) || !ready}
            onClick={async () => {
              if (!window.confirm(`Issue "${title}" to ${name}${sendIt ? ` and email it to ${emailAddr}` : ""}? It gets a public check page.`)) return;
              setBusy("issue");
              const r = await issueCertificateToAnyone({ ...input, email_it: sendIt });
              setBusy(null);
              if (r.error) {
                toast.error(r.error);
                return;
              }
              toast.success(r.linkedStudent ? `Issued. Also added to ${r.linkedStudent}'s Achievements.` : "Issued.");
              if (r.emailNote) toast.warning(`Email not sent: ${r.emailNote}`);
              setName("");
              setEmailAddr("");
              setPhone("");
              setTitle("");
              setParagraph("");
              setPreview(null);
              router.refresh();
            }}
          >
            {busy === "issue" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Stamp className="size-4" aria-hidden />} Issue certificate
          </Button>
        </div>
        {!ready ? <p className="text-caption text-muted-foreground">Fill in name, email, title and what they did to issue.</p> : null}
      </div>
      <div className="min-h-64 overflow-hidden rounded-md border-2 border-foreground bg-muted">
        {preview ? (
          <iframe title="Certificate preview" src={preview} className="block h-[28rem] w-full border-0" />
        ) : (
          <p className="grid h-full min-h-64 place-items-center p-6 text-center text-sm text-muted-foreground">Press Preview to see the certificate.</p>
        )}
      </div>
    </div>
  );
}
