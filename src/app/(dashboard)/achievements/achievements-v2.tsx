"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronRight, Copy, Download, ExternalLink, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateIST } from "@/lib/format";
import { MemeArt } from "@/components/reactions/graphics";
import { PageFrame, Section, EmptyLine, quietButton, StatusWord, textButton } from "@/components/ds";
import { MobileBottomSheet } from "@/components/mobile/mobile-bottom-sheet";
import { downloadMyCertificate, type MyCredential, type MyProgress } from "./actions";

/** Soft tile colours for a badge's icon. No border: the tile is the only colour on the row. */
const TONE: Record<string, string> = {
  lime: "bg-lime-200",
  blue: "bg-sky-200",
  ink: "bg-slate-200",
  gold: "bg-amber-200",
  rose: "bg-rose-200",
};

const STATUS_LABEL: Record<MyCredential["status"], string> = {
  draft: "Waiting for approval",
  approved: "Approved",
  issued: "Issued",
  revoked: "Revoked",
};

function statusLine(c: MyCredential) {
  if (c.status === "issued") return c.issued_at ? `Issued ${formatDateIST(c.issued_at)}` : "Issued";
  if (c.status === "revoked") return `Revoked${c.revoked_at ? ` ${formatDateIST(c.revoked_at)}` : ""}`;
  return STATUS_LABEL[c.status];
}

function verifyUrl(siteUrl: string, id: string) {
  return `${siteUrl}/verify/${id}`;
}

function linkedInPost(title: string, url: string) {
  return `I'm happy to share that I've earned the "${title}" credential as part of my learning journey with VIBHA School of Psychology.\n\nAnother step forward in developing my understanding of psychology and mental health.\n\n${url}\n\n#Psychology #LearningAndDevelopment #VIBHA`;
}

/** Share on LinkedIn, copy the post, open the public verify page. Only for issued credentials. */
function ShareActions({ credentialId, title, siteUrl }: { credentialId: string; title: string; siteUrl: string }) {
  const minor = cn(textButton, "px-2");
  const url = verifyUrl(siteUrl, credentialId);
  const [copied, setCopied] = React.useState(false);
  return (
    <>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={quietButton}>
        <Share2 aria-hidden /> Share on LinkedIn
      </a>
      <button
        type="button"
        className={minor}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(linkedInPost(title, url));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />} {copied ? "Copied" : "Copy post"}
      </button>
      <a href={url} target="_blank" rel="noreferrer" className={minor}>
        <ExternalLink aria-hidden /> Verify
      </a>
    </>
  );
}

/**
 * Certificates and badges (new design). Certificates lead as a plain list,
 * each with Download and Share. Badges are a quiet grid; a badge opens a
 * sheet with its details and share. What is still to earn is a list of rows.
 * Same data and the same download action as before.
 */
export function AchievementsV2({ earned, progress, rollNumber, siteUrl }: { earned: MyCredential[]; progress: MyProgress[]; rollNumber: string | null; siteUrl: string }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState<string | null>(null);
  const [openBadge, setOpenBadge] = React.useState<MyCredential | null>(null);
  const upNext = progress.filter((p) => !p.earned);
  const badges = earned.filter((e) => e.type === "badge");
  const certificates = earned.filter((e) => e.type === "certificate");

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

  return (
    <PageFrame
      title="Certificates and badges"
      lead={
        rollNumber ? (
          <>
            Roll number <span className="type-num font-semibold text-foreground">{rollNumber}</span>
          </>
        ) : undefined
      }
    >
      <Section id="certificates" title="Certificates">
        {msg ? (
          <p role="alert" className="type-small font-semibold text-status-alert-fg">
            {msg}
          </p>
        ) : null}
        {certificates.length ? (
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {certificates.map((c) => (
              <li key={c.credential_id} className="flex min-w-0 flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between md:gap-6">
                <div className="min-w-0">
                  <Link
                    href={`/achievements/${encodeURIComponent(c.credential_id)}`}
                    className="-mx-2 inline-flex min-h-11 max-w-full items-center gap-1 rounded-lg px-2 type-body font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="min-w-0 [overflow-wrap:anywhere]">{c.title}</span>
                    <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                  </Link>
                  <p className="type-small text-muted-foreground">
                    {c.status === "revoked" ? <StatusWord tone="alert">{statusLine(c)}</StatusWord> : statusLine(c)}
                  </p>
                </div>
                {c.status === "issued" ? (
                  <div className="flex min-w-0 flex-wrap gap-2 md:shrink-0 md:justify-end">
                    <button type="button" onClick={() => void download(c.credential_id)} disabled={downloading !== null} aria-busy={downloading === c.credential_id || undefined} className={quietButton}>
                      <Download aria-hidden /> {downloading === c.credential_id ? "Preparing…" : "Download PDF"}
                    </button>
                    <ShareActions credentialId={c.credential_id} title={c.title} siteUrl={siteUrl} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine art={<MemeArt sticker="flower-cat" size={72} />} title="No certificates yet">Pass every module test and your course certificate shows here, ready to download and share.</EmptyLine>
        )}
      </Section>

      <Section id="badges" title="Badges">
        {badges.length ? (
          <ul className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {badges.map((b) => (
              <li key={b.credential_id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setOpenBadge(b)}
                  aria-haspopup="dialog"
                  className="group/badge flex w-full min-w-0 cursor-pointer flex-col items-start gap-2 rounded-[var(--ds-radius)] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-16 place-items-center rounded-2xl text-3xl transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/badge:-translate-y-0.5 motion-reduce:group-hover/badge:translate-y-0",
                      TONE[b.tone] ?? TONE.lime,
                      b.status !== "issued" && "opacity-50",
                    )}
                  >
                    {b.icon ?? "🎓"}
                  </span>
                  <span className="min-w-0 max-w-full">
                    <span className="block type-small font-semibold text-foreground [overflow-wrap:anywhere]">{b.title}</span>
                    <span className="block type-caption text-muted-foreground">{statusLine(b)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyLine title="No badges yet">Finish a module to earn your first one.</EmptyLine>
        )}
      </Section>

      {upNext.length ? (
        <Section id="next" title="Still to earn">
          <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]">
            {upNext.map((p) => (
              <li key={p.id} className="flex min-h-14 min-w-0 items-center gap-4 py-2">
                <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-lg opacity-60 grayscale", TONE[p.tone] ?? TONE.lime)}>
                  {p.icon ?? "🔒"}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="type-body font-semibold [overflow-wrap:anywhere]">{p.title}</span>
                  <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{p.progress}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <MobileBottomSheet
        open={openBadge != null}
        onOpenChange={(o) => {
          if (!o) setOpenBadge(null);
        }}
        title={openBadge?.title}
        description={openBadge ? statusLine(openBadge) : undefined}
        className="mx-auto max-w-xl"
      >
        {openBadge ? (
          <div className="flex min-w-0 flex-col gap-4">
            {openBadge.description ? <p className="type-body [overflow-wrap:anywhere]">{openBadge.description}</p> : null}
            <p className="type-caption text-muted-foreground [overflow-wrap:anywhere]">
              Credential <span className="type-num">{openBadge.credential_id}</span>
            </p>
            {/* Only an issued badge verifies, so only it is offered for sharing. */}
            {openBadge.status === "issued" ? (
              <div className="flex min-w-0 flex-wrap gap-2">
                <ShareActions credentialId={openBadge.credential_id} title={openBadge.title} siteUrl={siteUrl} />
              </div>
            ) : null}
          </div>
        ) : null}
      </MobileBottomSheet>

      <div className="flex min-w-0 flex-col items-start">
        <p className="max-w-[60ch] type-small text-muted-foreground">Anyone with a credential&apos;s link can check it against our record.</p>
        <Link href="/doubts" className={textButton}>
          Ask us about a credential
        </Link>
      </div>
    </PageFrame>
  );
}
