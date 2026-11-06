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
import { issueCustomCertificate, previewCustomCertificate } from "./actions";

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
