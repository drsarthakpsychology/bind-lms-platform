import * as React from "react";
import Link from "next/link";
import { Clock, HelpCircle, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { longDate, type CertStatus } from "@/lib/certificates/kinds";

/**
 * What the public verify page shows for one credential. Only public fields:
 * never an email, a phone number or the reason for a revoke.
 */
export type VerifyFacts = {
  status: CertStatus;
  name: string;
  title: string;
  /** "Certificate", "Provisional certificate", "Badge"... */
  what: string;
  paragraph: string | null;
  credentialId: string;
  /** yyyy-mm-dd */
  issuedOn: string | null;
  expiresOn: string | null;
  revokedOn: string | null;
  replacedBy: string | null;
};

const HEAD: Record<CertStatus, { word: string; Icon: typeof ShieldCheck; tone: string }> = {
  valid: { word: "Verified", Icon: ShieldCheck, tone: "bg-primary text-primary-foreground" },
  provisional: { word: "Provisional", Icon: Clock, tone: "bg-brand text-brand-foreground" },
  expired: { word: "Expired", Icon: ShieldAlert, tone: "bg-muted text-foreground" },
  revoked: { word: "Revoked", Icon: ShieldX, tone: "bg-status-alert-bg text-status-alert-fg" },
  not_issued: { word: "Not issued", Icon: HelpCircle, tone: "bg-muted text-foreground" },
};

export function verifySentence(f: VerifyFacts): string {
  switch (f.status) {
    case "valid":
      return f.expiresOn ? `This is a real ${f.what.toLowerCase()} from VIBHA School of Psychology, valid until ${longDate(f.expiresOn)}.` : `This is a real ${f.what.toLowerCase()} from VIBHA School of Psychology.`;
    case "provisional":
      return f.expiresOn ? `This is a real provisional certificate from VIBHA School of Psychology. It is valid until ${longDate(f.expiresOn)}.` : "This is a real provisional certificate from VIBHA School of Psychology.";
    case "expired":
      return f.expiresOn ? `This certificate was real, and it ran out on ${longDate(f.expiresOn)}. It is no longer valid.` : "This certificate has run out. It is no longer valid.";
    case "revoked":
      return f.revokedOn ? `VIBHA School of Psychology withdrew this certificate on ${longDate(f.revokedOn)}. It is not valid.` : "VIBHA School of Psychology withdrew this certificate. It is not valid.";
    default:
      return "This certificate has not been issued yet.";
  }
}

export function VerifyView({ facts, certificate }: { facts: VerifyFacts; certificate?: React.ReactNode }) {
  const h = HEAD[facts.status];
  const rows: Array<[string, React.ReactNode]> = [];
  if (facts.issuedOn && facts.status !== "not_issued") rows.push(["Issued", longDate(facts.issuedOn)]);
  if (facts.expiresOn) rows.push([facts.status === "expired" ? "Ran out" : "Valid until", longDate(facts.expiresOn)]);
  if (facts.revokedOn && facts.status === "revoked") rows.push(["Revoked", longDate(facts.revokedOn)]);
  if (facts.replacedBy) rows.push(["Replaced by", <Link key="r" href={`/verify/${encodeURIComponent(facts.replacedBy)}`} className="font-semibold text-link underline underline-offset-4">{facts.replacedBy}</Link>]);
  rows.push(["Issued by", "VIBHA School of Psychology"]);
  rows.push(["Certificate ID", <span key="id" className="font-mono [overflow-wrap:anywhere]">{facts.credentialId}</span>]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-16" data-status={facts.status}>
      <div className={certificate ? "grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-14" : "mx-auto max-w-xl"}>
        <div className="min-w-0">
          <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-small font-bold ${h.tone}`}>
            <h.Icon className="size-4" aria-hidden /> {h.word}
          </p>
          <h1 className="mt-5 text-h1 [overflow-wrap:anywhere]">{facts.name}</h1>
          <p className="mt-2 text-h3 font-semibold [overflow-wrap:anywhere]">{facts.title}</p>
          <p className="mt-4 max-w-[60ch] text-body text-muted-foreground">{verifySentence(facts)}</p>
          {facts.paragraph && facts.status !== "revoked" ? <p className="mt-4 max-w-[60ch] border-l-2 border-foreground/20 pl-4 text-small leading-relaxed">{facts.paragraph}</p> : null}
          <dl className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 py-3 text-small">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="min-w-0 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        {certificate ? <div className="min-w-0 overflow-hidden rounded-xl border-[1.5px] border-foreground/25 bg-white">{certificate}</div> : null}
      </div>
    </div>
  );
}

export function VerifyNotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-10 sm:py-16" data-status="not_found">
      <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-small font-bold">
        <HelpCircle className="size-4" aria-hidden /> Not found
      </p>
      <h1 className="mt-5 text-h1">We can&apos;t find this certificate</h1>
      <p className="mt-4 max-w-[60ch] text-body text-muted-foreground">Check that the link or the ID was copied in full. If it was, the certificate was not issued by VIBHA School of Psychology.</p>
    </div>
  );
}
