import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, X } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/server";
import { sanitizeRich, textToHtml } from "@/lib/email/rich-html";
import { formatRelativeTime } from "@/lib/format";
import { RefreshShell } from "@/components/navigation/refresh-shell";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";

export const dynamic = "force-dynamic";

/**
 * One notification, opened full screen. Opening marks it read; Close goes
 * back to the list. Only the owner can open it (checked here, not by URL).
 */
export default async function NotificationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);
  const { id } = await params;
  const admin = createAdminClient();
  const { data: n } = await admin.from("notifications").select("*").eq("id", id).maybeSingle();
  if (!n || (n.user_id !== session.profile.id && session.profile.role !== "admin")) notFound();

  const justRead = n.user_id === session.profile.id && !n.read_at;
  if (justRead) {
    const now = new Date().toISOString();
    const r = await admin.from("notifications").update({ read_at: now, opened_at: now }).eq("id", id);
    if (r.error) await admin.from("notifications").update({ read_at: now }).eq("id", id);
  }
  const html = sanitizeRich((n.body_html as string | null) ?? textToHtml(String(n.body ?? "")));

  return (
    <div className="mx-auto max-w-2xl">
      {/* The bell count is in the layout: redraw it now this one is read. */}
      <RefreshShell when={justRead} />
      <article className="rounded-2xl border-2 border-foreground bg-card p-5 hard-shadow-sm sm:p-7">
        <header className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground">
            <Bell className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-caption text-muted-foreground">From the VIBHA team · {formatRelativeTime(String(n.created_at))}</p>
            <h1 className="text-h2 font-bold break-words">{String(n.title)}</h1>
          </div>
          <Link href="/notifications" aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-foreground bg-background hover:bg-accent">
            <X className="size-5" aria-hidden />
          </Link>
        </header>
        <div
          className="mt-5 text-base leading-relaxed break-words [&_a]:font-bold [&_a]:text-link [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-foreground [&_blockquote]:pl-3 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:font-bold [&_hr]:my-4 [&_hr]:border-t-2 [&_hr]:border-foreground [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <footer className="mt-6 flex justify-end">
          <Link href="/notifications" className="inline-flex h-11 items-center rounded-full border-2 border-foreground bg-primary px-5 text-sm font-bold text-primary-foreground">
            Close
          </Link>
        </footer>
      </article>
    </div>
  );
}
