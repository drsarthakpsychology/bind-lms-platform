import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Mail, MessageCircleQuestion, ShieldAlert } from "lucide-react";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { PageHeader } from "@/components/design-system/page-header";
import { EmptyState } from "@/components/design-system/empty-state";
import { StatusPill } from "@/components/mobile/status-pill";
import { InlineReply } from "@/components/admin/inbox-reply";
import { agoLabel } from "@/lib/analytics/timeline";
import { loadInbox, loadLoginPeople, type InboxThread } from "./data";
import { LoginFinder } from "./login-finder";
import { LoginQuick } from "../students/login-quick";

export const metadata: Metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

const REASON: Record<InboxThread["need"]["reason"], { label: string; tone: "warning" | "scripted" | "neutral" }> = {
  concern: { label: "Private concern", tone: "warning" },
  unanswered: { label: "No answer yet", tone: "scripted" },
  "student-replied": { label: "Student wrote back", tone: "scripted" },
};

/**
 * Admin Inbox (DI §C-6): everything waiting on a reply, in one list. Doubts
 * and private concerns nobody has answered (or where the student wrote back),
 * then unread email replies. Reply in place; the thread link is there for the
 * full conversation.
 */
export default async function AdminInboxPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const canWrite = isSuperAdmin(me);
  const [{ ready, threads, emails }, people] = await Promise.all([loadInbox(), canWrite ? loadLoginPeople() : Promise.resolve([])]);
  const total = threads.length + emails.length;
  // Email replies from a student's own address get the login shortcut too.
  const studentByEmail = new Map(people.map((p) => [p.email.toLowerCase(), p]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Communicate"
        title="Inbox"
        description={total ? `${total} waiting for a reply. Oldest first.` : "Nothing is waiting for a reply."}
        actions={
          <Link href="/admin/doubts?view=all" className="inline-flex min-h-10 items-center rounded-md border-2 border-foreground bg-card px-3.5 text-sm font-bold pointer-coarse:min-h-11">
            All doubts
          </Link>
        }
      />

      {canWrite ? <LoginFinder people={people} /> : null}

      {!ready ? (
        <p className="rounded-xl border-2 border-foreground bg-card p-4 text-sm">The doubts board isn&apos;t switched on yet (database step 2026_11_access_doubts.sql). Email replies still show below.</p>
      ) : null}

      <section aria-labelledby="inbox-doubts" className="space-y-3">
        <h2 id="inbox-doubts" className="flex items-center gap-2 text-h3 font-semibold">
          <MessageCircleQuestion className="size-5 text-link" aria-hidden /> Doubts and concerns
          <span className="font-normal tabular-nums text-muted-foreground">({threads.length})</span>
        </h2>
        {threads.length ? (
          <ul className="space-y-3">
            {threads.map((t) => (
              <li key={t.id} className="rounded-xl border-2 border-foreground bg-card p-4">
                <div className="flex items-start gap-3">
                  {t.kind === "complaint" ? (
                    <ShieldAlert className="mt-0.5 size-5 shrink-0 text-status-alert-fg" aria-hidden />
                  ) : (
                    <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-link" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/doubts/${t.id}`} className="font-semibold break-words hover:underline">
                        {t.title}
                      </Link>
                      <StatusPill tone={REASON[t.need.reason].tone} label={REASON[t.need.reason].label} />
                    </div>
                    <p className="text-caption text-muted-foreground">
                      <Link href={`/admin/students/${t.authorId}`} className="font-medium text-foreground hover:underline">
                        {t.author}
                      </Link>
                      {" · "}
                      {t.kind === "complaint" ? "Only you and the student see this" : (t.cohortName ?? "No cohort")}
                      {" · "}
                      {agoLabel(t.need.lastAt)}
                    </p>
                    {t.body ? <p className="line-clamp-3 text-small whitespace-pre-line break-words">{t.body}</p> : null}
                    {t.followUp ? (
                      <blockquote className="mt-2 border-l-4 border-link pl-3 text-small break-words">
                        <span className="block text-caption font-medium text-muted-foreground">Their latest message</span>
                        <span className="line-clamp-4 whitespace-pre-line">{t.followUp}</span>
                      </blockquote>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-start gap-2 sm:pl-8">
                  <div className="min-w-0 flex-1">
                    <InlineReply target="doubt" id={t.id} label={`Reply to ${t.author}`} canWrite={canWrite} />
                  </div>
                  <Link href={`/doubts/${t.id}`} className="inline-flex h-9 items-center rounded-md px-3 text-sm font-bold text-link hover:underline pointer-coarse:min-h-11">
                    Open thread
                  </Link>
                  {canWrite && t.authorEmail ? <LoginQuick email={t.authorEmail} name={t.author} /> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState row icon={<Inbox className="size-4" />} title="No doubts waiting" description="Every doubt has an answer." />
        )}
      </section>

      <section aria-labelledby="inbox-emails" className="space-y-3">
        <h2 id="inbox-emails" className="flex items-center gap-2 text-h3 font-semibold">
          <Mail className="size-5 text-link" aria-hidden /> Email replies
          <span className="font-normal tabular-nums text-muted-foreground">({emails.length})</span>
        </h2>
        {emails.length ? (
          <ul className="space-y-3">
            {emails.map((m) => (
              <li key={m.id} className="rounded-xl border-2 border-foreground bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="min-w-0 font-semibold break-words">{m.subject}</p>
                  <p className="text-caption text-muted-foreground">{agoLabel(m.receivedAt)}</p>
                </div>
                <p className="text-caption break-all text-muted-foreground">
                  {m.fromName ? `${m.fromName} · ` : ""}
                  {m.fromEmail}
                </p>
                {m.body ? <p className="mt-1 line-clamp-4 text-small whitespace-pre-line break-words">{m.body}</p> : null}
                <div className="mt-3 flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <InlineReply target="email" id={m.id} label={`Reply to ${m.fromName ?? m.fromEmail}`} canWrite={canWrite} />
                  </div>
                  <Link href={`/admin/emails?folder=inbox&id=${m.id}`} className="inline-flex h-9 items-center rounded-md px-3 text-sm font-bold text-link hover:underline pointer-coarse:min-h-11">
                    Open in Messages
                  </Link>
                  {canWrite && studentByEmail.has(m.fromEmail.toLowerCase()) ? (
                    <LoginQuick email={studentByEmail.get(m.fromEmail.toLowerCase())!.email} name={studentByEmail.get(m.fromEmail.toLowerCase())!.name} />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState row icon={<Mail className="size-4" />} title="No unread email replies" />
        )}
      </section>
    </div>
  );
}
