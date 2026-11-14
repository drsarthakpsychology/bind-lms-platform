"use client";

import * as React from "react";
import Link from "next/link";
import { Award, Copy, Download, ExternalLink, Lock, Share2, Clock, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateIST } from "@/lib/format";
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

/** Built from the site address passed by the server: `window` is not there while the page renders on the server. */
function verifyUrl(siteUrl: string, id: string) {
  return `${siteUrl}/verify/${id}`;
}

function linkedInPost(title: string, url: string) {
  return `I'm happy to share that I've earned the "${title}" credential as part of my learning journey with VIBHA School of Psychology.\n\nAnother step forward in developing my understanding of psychology and mental health.\n\n${url}\n\n#Psychology #LearningAndDevelopment #VIBHA`;
}

function ShareRow({ credentialId, title, siteUrl }: { credentialId: string; title: string; siteUrl: string }) {
  const url = verifyUrl(siteUrl, credentialId);
  const text = linkedInPost(title, url);
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold hover:bg-muted pointer-coarse:h-11"
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
        className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold hover:bg-muted pointer-coarse:h-11"
      >
        <Copy className="size-3.5" aria-hidden /> {copied ? "Copied" : "Copy post"}
      </button>
      <a href={url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold hover:bg-muted pointer-coarse:h-11">
        <ExternalLink className="size-3.5" aria-hidden /> Verify
      </a>
    </div>
  );
}

export function AchievementsClient({ earned, progress, rollNumber, siteUrl }: { earned: MyCredential[]; progress: MyProgress[]; rollNumber: string | null; siteUrl: string }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState<string | null>(null);
  const upNext = progress.filter((p) => !p.earned);

  async function download(id: string) {
    if (downloading) return;
    setDownloading(id);
    setMsg(null);
    try {
      const r = await downloadMyCertificate(id);
      if (r.url) {
        // A new tab opened after a wait is often blocked on phones: open it here instead.
        if (!window.open(r.url, "_blank")) window.location.assign(r.url);
      } else setMsg(r.error ?? "Couldn't prepare the download.");
    } catch {
      setMsg("Couldn't prepare the download. Check your connection and try again.");
    } finally {
      setDownloading(null);
    }
  }
  const badges = earned.filter((e) => e.type === "badge");
  const certificates = earned.filter((e) => e.type === "certificate");
  const issued = earned.filter((e) => e.status === "issued").length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="space-y-1">
        <p className="text-eyebrow text-link">Your credentials</p>
        <h1 className="text-h1">My Achievements</h1>
        {rollNumber ? (
          <p className="text-sm font-semibold">Roll number <span className="font-mono">{rollNumber}</span></p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          {issued} issued · {upNext.length} in progress
        </p>
      </header>

      {msg && <p role="alert" className="text-sm font-semibold text-status-alert-fg">{msg}</p>}

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
                    <p className="font-bold leading-tight break-words">{b.title}</p>
                    {b.description ? <p className="text-sm text-muted-foreground">{b.description}</p> : null}
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {b.status === "issued"
                        ? b.issued_at
                          ? `Issued ${formatDateIST(b.issued_at)}`
                          : "Issued"
                        : b.status === "revoked"
                          ? `Revoked${b.revoked_at ? ` ${formatDateIST(b.revoked_at)}` : ""}`
                          : STATUS_LABEL[b.status]}
                    </p>
                    <p className="font-mono text-caption [overflow-wrap:anywhere] text-muted-foreground">{b.credential_id}</p>
                  </div>
                </div>
                {/* Only an issued badge verifies, so only it is offered for sharing. */}
                {b.status === "issued" ? <ShareRow credentialId={b.credential_id} title={b.title} siteUrl={siteUrl} /> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-foreground/50 p-4 text-sm text-muted-foreground">No badges yet: finish modules to earn them.</p>
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
                  <p className="font-bold break-words">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.issued_at ? `Issued ${formatDateIST(c.issued_at)}` : "Pending"}{c.revoked_at ? ` · Revoked ${formatDateIST(c.revoked_at)}` : ""}
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
                    onClick={() => void download(c.credential_id)}
                    disabled={downloading !== null}
                    aria-busy={downloading === c.credential_id || undefined}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold hover:bg-muted disabled:opacity-60 pointer-coarse:h-11"
                  >
                    <Download className="size-3.5" aria-hidden /> {downloading === c.credential_id ? "Preparing…" : "PDF"}
                  </button>
                )}
                {c.status === "issued" ? <ShareRow credentialId={c.credential_id} title={c.title} siteUrl={siteUrl} /> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-foreground/50 p-4 text-sm text-muted-foreground">No certificates yet.</p>
        )}
      </section>

      {/* Progress: what is still to earn (earned badges are listed above). */}
      {upNext.length ? (
        <section aria-labelledby="progress" className="space-y-3">
          <h2 id="progress" className="flex items-center gap-2 text-lg font-bold">
            <Lock className="size-5" aria-hidden /> Up next
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {upNext.map((p) => (
              <li key={p.id} className="flex items-start gap-3 rounded-2xl border-2 border-foreground/30 bg-card/40 p-3 opacity-90">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl border-2 text-lg", TONE[p.tone] ?? TONE.lime)} aria-hidden>
                  {p.icon ?? "🔒"}
                </span>
                <div className="min-w-0">
                  <p className="font-bold leading-tight">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.progress}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Credentials are verified against the live record at the link. Questions? <Link href="/doubts" className="underline underline-offset-4">Ask your admin</Link>.
      </p>
    </div>
  );
}
