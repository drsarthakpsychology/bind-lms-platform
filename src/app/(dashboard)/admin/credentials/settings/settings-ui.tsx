"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DefaultSignatory } from "@/lib/certificates/defaults";
import { Block, btn, Facts, link, Notice } from "../../_v2/kit";
import { field, label, RemoveButton } from "../_ui/parts";
import { SendWaiting } from "../issued/issued-ui";
import { saveDefaultSignatories, uploadSignatureImage } from "./actions";

type Sig = { id: string; label: string; url: string | null };

/**
 * Three plain sections: who signs a new certificate, the signature images,
 * and email. View-only admins see the same page without the controls.
 */
export function SettingsV2({ canWrite, signatories, signatures, email }: { canWrite: boolean; signatories: DefaultSignatory[]; signatures: Sig[]; email: { configured: boolean; limit: number; sentToday: number; waiting: number } }) {
  const router = useRouter();
  const [list, setList] = React.useState<DefaultSignatory[]>(signatories);
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState<{ tone: "ok" | "alert"; text: string } | null>(null);
  const left = Math.max(0, email.limit - email.sentToday);

  async function save() {
    setBusy(true);
    const r = await saveDefaultSignatories(list).catch(() => ({ error: "Couldn't reach the server." }));
    setBusy(false);
    setNote(r.error ? { tone: "alert", text: r.error } : { tone: "ok", text: "Saved. New certificates start with these." });
    if (!r.error) router.refresh();
  }

  return (
    <div className="flex min-w-0 flex-col gap-[var(--ds-section)]">
      <Block title="Who signs">
        <p className="max-w-[60ch] type-small text-muted-foreground">Every new certificate starts with these. Each one can still be changed in the studio.</p>
        <ul className="flex flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
          {list.map((s, i) => (
            <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-2 py-3">
              <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                <div>
                  <label htmlFor={`df-n-${i}`} className="sr-only">Signatory {i + 1} name</label>
                  <input id={`df-n-${i}`} className={field} value={s.name} placeholder="Name" maxLength={60} disabled={!canWrite} onChange={(e) => setList((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                </div>
                <div>
                  <label htmlFor={`df-r-${i}`} className="sr-only">Signatory {i + 1} role</label>
                  <input id={`df-r-${i}`} className={field} value={s.role} placeholder="Role" maxLength={60} disabled={!canWrite} onChange={(e) => setList((l) => l.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
                </div>
                {signatures.length ? (
                  <div className="sm:col-span-2">
                    <label htmlFor={`df-i-${i}`} className="sr-only">Signature image for signatory {i + 1}</label>
                    <select id={`df-i-${i}`} className={field} value={s.signatureFrom ?? ""} disabled={!canWrite} onChange={(e) => setList((l) => l.map((x, j) => (j === i ? { ...x, signatureFrom: e.target.value || null } : x)))}>
                      <option value="">No signature image</option>
                      {signatures.map((x) => (
                        <option key={x.id} value={x.id}>{x.label}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
              {canWrite ? <RemoveButton name={`signatory ${i + 1}`} disabled={list.length <= 1} onClick={() => setList((l) => l.filter((_, j) => j !== i))} /> : <span />}
            </li>
          ))}
        </ul>
        {canWrite ? (
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {list.length < 3 ? (
              <button type="button" className={cn(link, "inline-flex min-h-11 items-center gap-1.5 type-small")} onClick={() => setList((l) => [...l, { name: "", role: "", signatureFrom: null }])}>
                <Plus className="size-4" aria-hidden /> Add a signatory
              </button>
            ) : null}
            <button type="button" className={btn.primary} disabled={busy} onClick={() => void save()}>
              {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Save who signs
            </button>
            {note ? (
              <span role="status" className={cn("type-small", note.tone === "alert" ? "font-semibold text-status-alert-fg" : "text-muted-foreground")}>
                {note.text}
              </span>
            ) : null}
          </div>
        ) : null}
      </Block>

      <Block title="Signature images" count={signatures.length}>
        {signatures.length ? (
          <ul className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {signatures.map((s) => (
              <li key={s.id} className="flex min-w-0 items-center gap-3 border-b border-[var(--ds-hairline)] pb-3">
                {s.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.url} alt="" className="h-12 w-28 shrink-0 rounded bg-white object-contain" />
                ) : (
                  <span aria-hidden className="h-12 w-28 shrink-0 rounded bg-[var(--ds-tint)]" />
                )}
                <span className="min-w-0 type-small font-semibold [overflow-wrap:anywhere]">{s.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="type-small text-muted-foreground">None saved yet. Certificates then print the name without a signature.</p>
        )}
        {canWrite ? <NewSignature onDone={() => router.refresh()} /> : null}
      </Block>

      <Block title="Email">
        {!email.configured ? <Notice>Email isn&apos;t set up on this site. Certificates still reach students by the app notification.</Notice> : null}
        <Facts
          items={[
            { label: "Daily allowance", value: `${email.limit} emails` },
            { label: "Sent today", value: String(email.sentToday) },
            { label: "Left today", value: String(left) },
            { label: "Certificate emails waiting", value: String(email.waiting) },
          ]}
        />
        <p className="max-w-[60ch] type-small text-muted-foreground">The allowance is shared by every email VIBHA sends. Emails over it wait and go out oldest first.</p>
        {email.waiting > 0 ? <SendWaiting waiting={email.waiting} canWrite={canWrite} emailOn={email.configured} /> : null}
      </Block>
    </div>
  );
}

function NewSignature({ onDone }: { onDone: () => void }) {
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<{ tone: "ok" | "alert"; text: string } | null>(null);
  const inputId = React.useId();

  async function upload() {
    if (!file) return;
    setBusy(true);
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(new Error("read"));
      r.readAsDataURL(file);
    }).catch(() => "");
    const r = dataUrl ? await uploadSignatureImage(name, dataUrl).catch(() => ({ error: "Couldn't reach the server." })) : { error: "Couldn't read that file." };
    setBusy(false);
    setMsg(r.error ? { tone: "alert", text: r.error } : { tone: "ok", text: "Signature saved." });
    if (!r.error) {
      setName("");
      setFile(null);
      onDone();
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 pt-2">
      <p className="type-small font-semibold">Add a signature image</p>
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <label htmlFor={`${inputId}-n`} className={label}>Whose signature</label>
          <input id={`${inputId}-n`} className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Kavya Bothra" />
        </div>
        <label className={cn(btn.quiet, "cursor-pointer")}>
          <Upload aria-hidden /> {file ? file.name.slice(0, 28) : "Choose a PNG or JPEG"}
          <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <button type="button" className={btn.quiet} disabled={busy || !file || !name.trim()} onClick={() => void upload()}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : null} Save the signature
        </button>
        {msg ? (
          <span role="status" className={cn("type-small", msg.tone === "alert" ? "font-semibold text-status-alert-fg" : "text-muted-foreground")}>
            {msg.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}
