import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { EMAIL_TEMPLATES } from "@/lib/email/templates";
import { RosterActions } from "./roster-actions";
import { ComposeTab } from "./compose-tab";
import { MailKeys, InboundControls, ClearFailedButton } from "./mail-client";
import { loadOpenFailures } from "@/lib/email/failed";
import { isHiddenAccount, isRobotEmail } from "@/lib/people/hidden";
import { createAdminClient } from "@/lib/supabase/server";
import { personKey } from "@/lib/crm/people";
import { AlertTriangle, ArrowLeft, Inbox, KeyRound, PenSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export type InviteRow = {
  id: string;
  email: string;
  name: string;
  status: "pending" | "sent" | "failed";
  /** When the student finished setting their own password (null = not yet). */
  setup_completed_at: string | null;
  error_reason: string | null;
  sent_at: string | null;
  created_at: string;
  /** The account's lock state (from profiles.status) — used for the LockToggle. */
  lockStatus: "active" | "blocked";
  /** The profile id for the LockToggle (null if no profile row exists). */
  lockUserId: string | null;
};

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "sent", label: "Sent", icon: Send },
  { id: "logins", label: "Logins", icon: KeyRound },
  { id: "failed", label: "Failed", icon: AlertTriangle },
] as const;
type Folder = (typeof FOLDERS)[number]["id"] | "compose";

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

type SentRow = {
  id: string;
  recipient: string;
  name: string | null;
  subject: string;
  template_id: string | null;
  status: string;
  error_reason: string | null;
  sent_at: string | null;
  created_at: string;
  body_text: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
};
type InRow = {
  id: string;
  from_email: string;
  from_name: string | null;
  subject: string | null;
  body_text: string | null;
  received_at: string;
  read_at: string | null;
  archived_at: string | null;
};

function sentStatus(r: SentRow): { label: string; cls: string } {
  if (r.status === "failed") return { label: "Failed", cls: "border-destructive bg-status-alert-bg text-status-alert-fg" };
  if (r.bounced_at) return { label: "Bounced", cls: "border-destructive bg-status-alert-bg text-status-alert-fg" };
  if (r.clicked_at) return { label: "Clicked", cls: "border-foreground bg-primary text-primary-foreground" };
  if (r.opened_at) return { label: "Opened", cls: "border-foreground bg-primary text-primary-foreground" };
  if (r.delivered_at) return { label: "Delivered", cls: "border-foreground bg-card text-link" };
  return { label: "Sent", cls: "border-foreground/30 bg-muted" };
}

/**
 * /admin/emails — Mail, laid out like Gmail: folders on the left, a dense
 * list in the middle, the open email on the right (full screen on phones).
 * Inbox = replies (Resend inbound), Sent = everything we sent with its
 * delivered / opened / bounced status, Logins = account setup links,
 * Failed = sends to retry. Keys: C compose · J/K move · E archive · U back.
 */
export default async function MailPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string; tab?: string; id?: string; to?: string; q?: string }>;
}) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const adminProfile = await requireAdmin();
  if (!adminProfile) redirect("/dashboard");
  const sp = await searchParams;
  const legacy = sp.tab === "credentials" ? "logins" : sp.tab === "compose" ? "compose" : sp.tab === "sent" ? "sent" : undefined;
  const raw = sp.folder ?? legacy ?? "inbox";
  const folder: Folder = (["inbox", "sent", "logins", "failed", "compose"] as const).includes(raw as Folder) ? (raw as Folder) : "inbox";
  const q = (sp.q ?? "").trim().toLowerCase().slice(0, 100);

  const supabase = await createClient();
  const admin = createAdminClient();
  const [{ count: unread }, failures] = await Promise.all([
    admin.from("email_inbound").select("id", { count: "exact", head: true }).is("read_at", null).is("archived_at", null),
    loadOpenFailures<SentRow>(admin),
  ]);
  const failedCount = failures.length;

  let credentialsRows: InviteRow[] = [];
  if (folder === "logins") {
    const { data } = await supabase
      .from("credential_invites")
      .select("id, email, name, status, setup_completed_at, error_reason, sent_at, created_at")
      .order("created_at", { ascending: false });
    const rows = ((data ?? []) as Omit<InviteRow, "lockStatus" | "lockUserId">[]).filter((r) => !isRobotEmail(r.email));
    const emails = rows.map((r) => r.email);
    const { data: profs } = emails.length > 0 ? await supabase.from("profiles").select("id, email, status").in("email", emails) : { data: [] };
    const lockByEmail = new Map((profs ?? []).map((p) => [p.email as string, { status: p.status as string, id: p.id as string }]));
    credentialsRows = rows.map((r) => {
      const prof = lockByEmail.get(r.email);
      return { ...r, lockStatus: (prof?.status === "blocked" ? "blocked" : "active") as "active" | "blocked", lockUserId: prof?.id ?? null };
    });
    // Every real student appears, even one added without a login invite yet.
    const have = new Set(rows.map((r) => r.email.toLowerCase()));
    const { data: others } = await admin.from("profiles").select("id, email, name, status, is_test, created_at, active_session_token").eq("role", "student").limit(5000);
    for (const p of others ?? []) {
      const email = String(p.email ?? "");
      if (!email || have.has(email.toLowerCase()) || isHiddenAccount(p)) continue;
      credentialsRows.push({
        id: `p-${p.id}`,
        email,
        name: (p.name as string | null) || email.split("@")[0],
        status: "pending",
        // Already signing in = their account works, so it counts as set up.
        setup_completed_at: p.active_session_token ? ((p.created_at as string) ?? null) : null,
        error_reason: null,
        sent_at: null,
        created_at: (p.created_at as string) ?? new Date(0).toISOString(),
        lockStatus: p.status === "blocked" ? "blocked" : "active",
        lockUserId: p.id as string,
      });
    }
  }

  let sent: SentRow[] = [];
  if (folder === "sent" || folder === "failed") {
    let rows: SentRow[] = failures;
    if (folder === "sent") {
      const { data } = await admin
        .from("email_sends")
        .select("id, recipient, name, subject, template_id, status, error_reason, sent_at, created_at, body_text, delivered_at, opened_at, clicked_at, bounced_at")
        .eq("status", "sent")
        .order("created_at", { ascending: false })
        .limit(300);
      rows = (data ?? []) as SentRow[];
    }
    sent = rows.filter((r) => !q || `${r.recipient} ${r.name ?? ""} ${r.subject}`.toLowerCase().includes(q));
  }

  let inbox: InRow[] = [];
  if (folder === "inbox") {
    const { data } = await admin
      .from("email_inbound")
      .select("id, from_email, from_name, subject, body_text, received_at, read_at, archived_at")
      .is("archived_at", null)
      .order("received_at", { ascending: false })
      .limit(300);
    inbox = ((data ?? []) as InRow[]).filter((r) => !q || `${r.from_email} ${r.from_name ?? ""} ${r.subject ?? ""}`.toLowerCase().includes(q));
  }

  const openSent = sp.id && (folder === "sent" || folder === "failed") ? sent.find((r) => r.id === sp.id) : undefined;
  let openIn: InRow | undefined;
  if (sp.id && folder === "inbox") {
    openIn = inbox.find((r) => r.id === sp.id);
    if (!openIn) {
      const { data } = await admin.from("email_inbound").select("id, from_email, from_name, subject, body_text, received_at, read_at, archived_at").eq("id", sp.id).maybeSingle();
      openIn = (data as InRow) ?? undefined;
    }
  }
  const reading = Boolean(openSent || openIn);
  const listFolder = folder === "inbox" || folder === "sent" || folder === "failed";

  const counts: Record<string, number | null> = { inbox: unread ?? 0, failed: failedCount };

  return (
    <div className="-mx-4 -my-6 pb-24 sm:-mx-6 lg:-mx-10 lg:-my-8 lg:pb-0">
      <MailKeys folder={folder === "compose" ? "inbox" : folder} />
      <div className="grid min-h-[calc(100dvh-4rem)] grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr] lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:grid-rows-1">
        {/* Folder rail (a chip row on phones) */}
        <nav aria-label="Mail folders" className="border-b-2 border-foreground/10 bg-card p-3 lg:border-r-2 lg:border-b-0 lg:border-foreground lg:p-4">
          <Link
            href="/admin/emails?folder=compose"
            className="mb-3 hidden h-12 items-center justify-center gap-2 rounded-2xl border-2 border-foreground bg-primary text-sm font-bold text-primary-foreground hard-shadow-sm transition-transform hover:-translate-y-0.5 lg:flex"
          >
            <PenSquare className="size-4" aria-hidden /> Compose
            <kbd className="rounded border border-current px-1 font-mono text-[0.65rem]">C</kbd>
          </Link>
          <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col">
            {FOLDERS.map((f) => {
              const Icon = f.icon;
              const active = folder === f.id;
              const n = counts[f.id];
              return (
                <li key={f.id} className="shrink-0">
                  <Link
                    href={`/admin/emails?folder=${f.id}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-full px-3 text-sm font-bold transition-colors lg:gap-3 lg:px-4",
                      active ? "bg-brand text-brand-foreground" : "hover:bg-accent",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {f.label}
                    {n ? <span className="ml-auto font-pix text-[0.65rem]">{n}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {folder === "compose" ? (
            <div className="p-4 sm:p-6">
              <h1 className="mb-4 text-h1">New email</h1>
              <ComposeTab
                adminEmail={adminProfile?.email ?? ""}
                initialTo={sp.to ? [sp.to] : []}
                templates={EMAIL_TEMPLATES.map((t) => ({ id: t.id, label: t.label, defaultSubject: t.defaultSubject, hint: t.hint }))}
              />
            </div>
          ) : folder === "logins" ? (
            <div className="p-4 sm:p-6">
              <h1 className="text-h1">Logins</h1>
              <p className="mt-1 mb-5 text-small text-muted-foreground">
                Who has their setup link, and who has set their own password. Nobody&apos;s password is stored or shown anywhere.
              </p>
              <RosterActions rows={credentialsRows} />
            </div>
          ) : listFolder ? (
            <div className="grid min-h-full grid-cols-[minmax(0,1fr)] content-start xl:content-stretch xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
              {/* List */}
              <section aria-label={folder} className={cn("min-w-0 border-foreground/10 xl:border-r-2", reading && "hidden xl:block")}>
                <form className="flex items-center gap-2 border-b-2 border-foreground/10 p-3" action="/admin/emails">
                  <input type="hidden" name="folder" value={folder} />
                  <h1 className="sr-only">{folder === "inbox" ? "Inbox" : folder === "sent" ? "Sent" : "Failed"}</h1>
                  <input
                    name="q"
                    defaultValue={q}
                    type="search"
                    placeholder={`Search ${folder}`}
                    className="h-10 w-full rounded-full border-2 border-foreground bg-background px-4 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  />
                </form>
                {folder === "failed" && failedCount > 0 ? (
                  <div className="flex items-center justify-between gap-3 border-b-2 border-foreground/10 px-4 py-2.5">
                    <p className="text-caption text-muted-foreground">Dealt with these? Clear them so the count goes away. Nothing is deleted.</p>
                    <ClearFailedButton count={failedCount} />
                  </div>
                ) : null}
                {folder === "inbox" ? (
                  inbox.length === 0 ? (
                    <p className="p-6 text-sm font-semibold text-muted-foreground">
                      No replies yet. When someone replies to an email you sent, it lands here.
                    </p>
                  ) : (
                    <ul className="divide-y divide-foreground/10">
                      {inbox.map((r) => (
                        <li key={r.id}>
                          <Link
                            data-mail-row
                            href={`/admin/emails?folder=inbox&id=${r.id}`}
                            aria-current={openIn?.id === r.id ? "true" : undefined}
                            className={cn("block px-4 py-3 transition-colors hover:bg-accent aria-[current=true]:bg-status-success-bg", !r.read_at && "bg-card")}
                          >
                            <span className="flex items-baseline justify-between gap-2">
                              <span className={cn("truncate text-sm", r.read_at ? "font-semibold" : "font-black")}>{r.from_name || r.from_email}</span>
                              <span className="shrink-0 text-caption text-muted-foreground">{when(r.received_at)}</span>
                            </span>
                            <span className={cn("block truncate text-sm", !r.read_at && "font-bold")}>{r.subject ?? "(no subject)"}</span>
                            <span className="block truncate text-caption text-muted-foreground">{r.body_text?.slice(0, 120)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )
                ) : sent.length === 0 ? (
                  <p className="p-6 text-sm font-semibold text-muted-foreground">{folder === "failed" ? "Nothing failed. Good." : "Nothing sent yet."}</p>
                ) : (
                  <ul className="divide-y divide-foreground/10">
                    {sent.map((r) => {
                      const st = sentStatus(r);
                      return (
                        <li key={r.id}>
                          <Link
                            data-mail-row
                            href={`/admin/emails?folder=${folder}&id=${r.id}`}
                            aria-current={openSent?.id === r.id ? "true" : undefined}
                            className="block px-4 py-3 transition-colors hover:bg-accent aria-[current=true]:bg-status-success-bg"
                          >
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="truncate text-sm font-bold">{r.name || r.recipient}</span>
                              <span className="shrink-0 text-caption text-muted-foreground">{when(r.sent_at ?? r.created_at)}</span>
                            </span>
                            <span className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm">{r.subject}</span>
                              <span className={cn("inline-flex h-5 shrink-0 items-center rounded-full border-2 px-1.5 text-[0.65rem] font-bold", st.cls)}>{st.label}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {/* Reading pane */}
              <section aria-label="Email" className={cn("min-w-0 p-4 sm:p-6", !reading && "hidden xl:block")}>
                {openIn ? (
                  <article className="space-y-5">
                    <Link href="/admin/emails?folder=inbox" className="inline-flex items-center gap-1.5 text-sm font-bold xl:hidden">
                      <ArrowLeft className="size-4" aria-hidden /> Inbox
                    </Link>
                    <h2 className="text-h1 break-words">{openIn.subject ?? "(no subject)"}</h2>
                    <p className="text-sm">
                      <span className="font-bold">{openIn.from_name ?? openIn.from_email}</span>{" "}
                      <span className="text-muted-foreground">&lt;{openIn.from_email}&gt; · {when(openIn.received_at)}</span>{" "}
                      <Link href={`/admin/people/${personKey(openIn.from_email)}`} className="font-bold text-link underline-offset-4 hover:underline">Open in People</Link>
                    </p>
                    <div className="rounded-2xl border-2 border-foreground/15 bg-card p-5 text-sm whitespace-pre-line break-words">{openIn.body_text ?? "(No text version — open it in Resend.)"}</div>
                    <InboundControls id={openIn.id} archived={Boolean(openIn.archived_at)} unread={!openIn.read_at} />
                  </article>
                ) : openSent ? (
                  <article className="space-y-5">
                    <Link href={`/admin/emails?folder=${folder}`} className="inline-flex items-center gap-1.5 text-sm font-bold xl:hidden">
                      <ArrowLeft className="size-4" aria-hidden /> {folder === "failed" ? "Failed" : "Sent"}
                    </Link>
                    <h2 className="text-h1 break-words">{openSent.subject}</h2>
                    <p className="text-sm">
                      To <span className="font-bold">{openSent.name ?? openSent.recipient}</span>{" "}
                      <span className="text-muted-foreground">&lt;{openSent.recipient}&gt;</span>{" "}
                      <Link href={`/admin/people/${personKey(openSent.recipient)}`} className="font-bold text-link underline-offset-4 hover:underline">Open in People</Link>
                    </p>
                    <ol className="grid gap-2 sm:grid-cols-4">
                      {[
                        ["Sent", openSent.sent_at],
                        ["Delivered", openSent.delivered_at],
                        ["Opened", openSent.opened_at],
                        [openSent.bounced_at ? "Bounced" : "Clicked", openSent.bounced_at ?? openSent.clicked_at],
                      ].map(([k, v]) => (
                        <li key={k} className={cn("rounded-xl border-2 px-3 py-2", v ? "border-foreground bg-card" : "border-dashed border-foreground/25 text-muted-foreground")}>
                          <span className="block text-eyebrow">{k}</span>
                          <span className="block text-sm font-bold">{v ? when(v) : "Not yet"}</span>
                        </li>
                      ))}
                    </ol>
                    {openSent.error_reason ? <p className="rounded-xl border-2 border-destructive bg-status-alert-bg p-3 text-sm font-semibold text-status-alert-fg">{openSent.error_reason}</p> : null}
                    <div className="rounded-2xl border-2 border-foreground/15 bg-card p-5 text-sm whitespace-pre-line break-words">
                      {openSent.body_text ?? (openSent.template_id === "credential" ? "Account setup email (the link is secret, so its text isn't kept)." : "No copy of this email was kept.")}
                    </div>
                  </article>
                ) : (
                  <div className="flex h-full min-h-64 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                    <Inbox className="size-10" aria-hidden />
                    <p className="text-sm font-semibold">Pick an email to read it.</p>
                    <p className="text-caption">J / K to move · C to compose</p>
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </div>

      {/* Compose button on phones (Gmail's floating pencil) */}
      {folder !== "compose" && !reading ? (
        <Link
          href="/admin/emails?folder=compose"
          aria-label="Compose"
          className="fixed right-4 bottom-[calc(var(--nav-h)+1rem)] z-30 flex h-14 items-center gap-2 rounded-2xl border-2 border-foreground bg-primary px-5 font-bold text-primary-foreground hard-shadow-md lg:hidden"
        >
          <PenSquare className="size-5" aria-hidden /> Compose
        </Link>
      ) : null}
    </div>
  );
}
