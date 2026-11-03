"use client";

import * as React from "react";
import Link from "next/link";
import { Award, Check, Copy, Download, ExternalLink, Lock, Share2, Clock, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadMyCertificate, type MyCredential, type MyProgress } from "./actions";

const TONE: Record<string, string> = {
  lime: "bg-lime-200 border-lime-800",
  blue: "bg-sky-200 border-sky-800",
  ink: "bg-slate-200 border-slate-800",
  gold: "bg-amber-200 border-amber-800",
  rose: "bg-rose-200 border-rose-800",
};

const STATUS_LABEL: Record<MyCredential["status"], string> = {
  draft: "Pending approval",
  approved: "Approved",
  issued: "Issued",
  revoked: "Revoked",
};

function verifyUrl(id: string) {
  return `${window.location.origin}/verify/${id}`;
}

function linkedInPost(title: string, url: string) {
  return `I'm happy to share that I've earned the "${title}" credential as part of my learning journey with VIBHA School of Psychology.\n\nAnother step forward in developing my understanding of psychology and mental health.\n\n${url}\n\n#Psychology #LearningAndDevelopment #VIBHA`;
}

function ShareRow({ credentialId, title }: { credentialId: string; title: string }) {
  const url = verifyUrl(credentialId);
  const text = linkedInPost(title, url);
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 text-xs font-semibold hover:bg-muted"
      >
        <Share2 className="size-3.5" aria-hidden /> Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard unavailable */
          }
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 text-xs font-semibold hover:bg-muted"
      >
        <Copy className="size-3.5" aria-hidden /> {copied ? "Copied" : "Copy post"}
      </button>
      <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 text-xs font-semibold hover:bg-muted">
        <ExternalLink className="size-3.5" aria-hidden /> Verify
      </a>
    </div>
  );
}

export function AchievementsClient({ earned, progress }: { earned: MyCredential[]; progress: MyProgress[] }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const badges = earned.filter((e) => e.type === "badge");
  const certificates = earned.filter((e) => e.type === "certificate");
  const issued = earned.filter((e) => e.status === "issued").length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6 sm:px-6 lg:py-10">
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Your credentials</p>
        <h1 className="text-h1">My Achievements</h1>
        <p className="text-sm text-muted-foreground">
          {issued} issued · {progress.filter((p) => !p.earned).length} in progress
        </p>
      </header>

      {msg && <p className="text-sm font-semibold">{msg}</p>}

      {/* Badges */}
      <section aria-labelledby="badges" className="space-y-3">
        <h2 id="badges" className="flex items-center gap-2 text-lg font-bold">
          <Award className="size-5" aria-hidden /> Module badges
        </h2>
        {badges.length ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {badges.map((b) => (
              <li key={b.credential_id} className="flex flex-col gap-2 rounded-2xl border-2 border-foreground bg-card p-4">
                <div className="flex items-start gap-3">
                  <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl border-2 text-2xl", TONE[b.tone] ?? TONE.lime)} aria-hidden>
                    {b.icon ?? "🎓"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold leading-tight">{b.title}</p>
                    {b.description ? <p className="text-sm text-muted-foreground">{b.description}</p> : null}
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">Issued {b.issued_at ? new Date(b.issued_at).toLocaleDateString() : "—"}</p>
                    <p className="break-all font-mono text-[0.65rem] text-muted-foreground">{b.credential_id}</p>
                  </div>
                </div>
                <ShareRow credentialId={b.credential_id} title={b.title} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-foreground/50 p-4 text-sm text-muted-foreground">No badges yet — finish modules to earn them.</p>
        )}
      </section>

      {/* Certificates */}
      <section aria-labelledby="certs" className="space-y-3">
        <h2 id="certs" className="flex items-center gap-2 text-lg font-bold">
          <ShieldCheck className="size-5" aria-hidden /> Course certificates
        </h2>
        {certificates.length ? (
          <ul className="space-y-3">
            {certificates.map((c) => (
              <li key={c.credential_id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.issued_at ? `Issued ${new Date(c.issued_at).toLocaleDateString()}` : "Pending"}{c.revoked_at ? ` · Revoked ${new Date(c.revoked_at).toLocaleDateString()}` : ""}
                  </p>
                </div>
                {c.status === "issued" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                    <ShieldCheck className="size-3.5" aria-hidden /> Issued
                  </span>
                ) : c.status === "revoked" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-2.5 py-1 text-xs font-bold">
                    <ShieldX className="size-3.5" aria-hidden /> Revoked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-2.5 py-1 text-xs font-bold">
                    <Clock className="size-3.5" aria-hidden /> {STATUS_LABEL[c.status]}
                  </span>
                )}
                {c.status === "issued" && (
                  <button
                    type="button"
                    onClick={async () => {
                      const r = await downloadMyCertificate(c.credential_id);
                      if (r.url) window.open(r.url, "_blank");
                      else setMsg(r.error ?? "Couldn't prepare the download.");
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-3 text-xs font-semibold hover:bg-muted"
                  >
                    <Download className="size-3.5" aria-hidden /> PDF
                  </button>
                )}
                <ShareRow credentialId={c.credential_id} title={c.title} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-foreground/50 p-4 text-sm text-muted-foreground">No certificates yet.</p>
        )}
      </section>

      {/* Progress */}
      <section aria-labelledby="progress" className="space-y-3">
        <h2 id="progress" className="flex items-center gap-2 text-lg font-bold">
          <Lock className="size-5" aria-hidden /> Up next
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {progress.map((p) => (
            <li key={p.id} className="flex items-start gap-3 rounded-2xl border-2 border-foreground/30 bg-card/40 p-3 opacity-90">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl border-2 text-lg", TONE[p.tone] ?? TONE.lime)} aria-hidden>
                {p.earned ? <Check className="size-4" aria-hidden /> : p.icon ?? "🔒"}
              </span>
              <div className="min-w-0">
                <p className="font-bold leading-tight">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.earned ? "Earned" : p.progress}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-muted-foreground">
        Credentials are verified against the live record at the link. Questions? <Link href="/doubts" className="underline underline-offset-4">Ask your admin</Link>.
      </p>
    </div>
  );
}
