import Link from "next/link";
import { PersonLinks } from "@/components/admin/person-links";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/server";
import { emailFromKey, loadPeople, loadTimeline, STAGE_LABEL } from "@/lib/crm/people";
import { PersonActions } from "./person-actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * A person's record (the Attio / HubSpot contact page): details and stage on
 * the left, the whole history — enquiry, emails sent / opened / replied,
 * calls, WhatsApps, notes, account setup — on the right, newest first.
 */
export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const { id } = await params;
  const email = emailFromKey(id);
  if (!email) notFound();
  const admin = createAdminClient();
  const [people, timeline] = await Promise.all([loadPeople(admin), loadTimeline(admin, email)]);
  const p = people.find((x) => x.email === email.toLowerCase());
  if (!p) notFound();
  const wa = p.phone ? `https://wa.me/${p.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}` : null;
  const follow = p.followUpAt ? new Date(p.followUpAt).toISOString().slice(0, 10) : "";

  return (
    <div className="space-y-6">
      <Link href="/admin/people" className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 border-foreground bg-card px-4 text-sm font-bold">
        <ChevronLeft className="size-4" aria-hidden /> Pipeline
      </Link>
      <PersonLinks userId={p.studentId} email={p.email} here="people" />

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-2xl border-2 border-foreground bg-card p-5 hard-shadow-sm">
            <div className="flex items-center gap-3">
              <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary font-pix text-lg text-primary-foreground">
                {p.name[0]?.toUpperCase() ?? "?"}
              </span>
              <div className="min-w-0">
                <h1 className="text-h2 break-words">{p.name}</h1>
                <p className="text-caption font-semibold text-muted-foreground">
                  {p.isStudent ? "Student" : "Enquiry"} · {STAGE_LABEL[p.stage]}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <a href={`/admin/emails?folder=compose&to=${encodeURIComponent(p.email)}`} className="flex flex-col items-center gap-1 rounded-xl border-2 border-foreground py-2 text-caption font-bold hover:bg-primary">
                <Mail className="size-5" aria-hidden /> Email
              </a>
              <a href={wa ?? undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!wa} className={cn("flex flex-col items-center gap-1 rounded-xl border-2 border-foreground py-2 text-caption font-bold hover:bg-primary", !wa && "pointer-events-none opacity-40")}>
                <MessageCircle className="size-5" aria-hidden /> WhatsApp
              </a>
              <a href={p.phone ? `tel:${p.phone}` : undefined} aria-disabled={!p.phone} className={cn("flex flex-col items-center gap-1 rounded-xl border-2 border-foreground py-2 text-caption font-bold hover:bg-primary", !p.phone && "pointer-events-none opacity-40")}>
                <Phone className="size-5" aria-hidden /> Call
              </a>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Email", p.email],
                ["Phone", p.phone ?? "—"],
                ["Source", p.source ?? (p.isStudent ? "Added as a student" : "—")],
                ["Enquired", p.enquiredAt ? when(p.enquiredAt) : "—"],
                ["Emails sent", `${p.emailsSent}${p.opened ? " · opened" : ""}${p.replied ? " · replied" : ""}`],
                ...(p.isStudent ? [["Login", p.setupDone ? "Set up" : p.inviteSentAt ? "Link sent, not set up" : "Not sent yet"], ["Signed in", p.signedIn ? "Yes" : "No"]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-foreground/10 pb-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="min-w-0 truncate text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <PersonActions email={p.email} name={p.name} stage={p.stage} followUp={follow} isStudent={p.isStudent} />
        </aside>

        <section aria-label="Timeline" className="space-y-3">
          <h2 className="text-h2">Timeline</h2>
          {timeline.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-foreground/30 p-6 text-sm font-semibold text-muted-foreground">
              Nothing yet. Log a call or WhatsApp, or send an email.
            </p>
          ) : (
            <ol className="relative space-y-3 border-l-2 border-foreground/15 pl-5">
              {timeline.map((t, i) => (
                <li key={`${t.at}-${i}`} className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-3 -left-[1.72rem] size-3.5 rounded-full border-2 border-foreground",
                      t.tone === "blue" ? "bg-brand" : t.tone === "red" ? "bg-destructive" : t.tone === "ink" ? "bg-[#111111]" : "bg-primary",
                    )}
                  />
                  <div className="rounded-xl border-2 border-foreground/15 bg-card px-4 py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-bold break-words">{t.title}</p>
                      <time className="text-caption text-muted-foreground" dateTime={t.at}>{when(t.at)}</time>
                    </div>
                    {t.body ? <p className="mt-1 text-sm whitespace-pre-line break-words text-foreground/85">{t.body}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
