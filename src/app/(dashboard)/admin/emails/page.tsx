import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import { EMAIL_TEMPLATES } from "@/lib/email/templates";
import { PageHeader } from "@/components/design-system/page-header";
import { RosterActions } from "./roster-actions";
import { ComposeTab } from "./compose-tab";
import { SentTab } from "./sent-tab";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export type InviteRow = {
  id: string;
  email: string;
  name: string;
  status: "pending" | "sent" | "failed";
  password: string | null;
  error_reason: string | null;
  sent_at: string | null;
  created_at: string;
  /** The account's lock state (from profiles.status) — used for the LockToggle. */
  lockStatus: "active" | "blocked";
  /** The profile id for the LockToggle (null if no profile row exists). */
  lockUserId: string | null;
};

const TABS = [
  { id: "credentials", label: "Credentials" },
  { id: "compose", label: "Compose" },
  { id: "sent", label: "Sent" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * /admin/emails — the email control center (the reworked roster hub).
 * Three URL-addressable tabs:
 *   credentials — select people, send login credentials in a ready-made email
 *                 (the roster: import → send / reset / CSV, unchanged).
 *   compose     — ready-made templates or a fully custom HTML email, with a
 *                 live visual preview before anything is sent.
 *   sent        — the unified send history (credentials + campaigns).
 */
export default async function EmailsHubPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: TabId = rawTab === "compose" || rawTab === "sent" ? rawTab : "credentials";

  const supabase = await createClient();
  const adminProfile = await requireAdmin();

  // Credentials tab data — the roster fetch (moved verbatim from /admin/roster).
  let credentialsRows: InviteRow[] = [];
  if (tab === "credentials") {
    const { data } = await supabase
      .from("credential_invites")
      .select("id, email, name, status, password, error_reason, sent_at, created_at")
      .order("created_at", { ascending: false });
    const rows = (data ?? []) as Omit<InviteRow, "lockStatus" | "lockUserId">[];
    const emails = rows.map((r) => r.email);
    const { data: profs } =
      emails.length > 0
        ? await supabase.from("profiles").select("id, email, status").in("email", emails)
        : { data: [] };
    const lockByEmail = new Map(
      (profs ?? []).map((p) => [p.email as string, { status: p.status as string, id: p.id as string }]),
    );
    credentialsRows = rows.map((r) => {
      const prof = lockByEmail.get(r.email);
      return {
        ...r,
        lockStatus: (prof?.status === "blocked" ? "blocked" : "active") as "active" | "blocked",
        lockUserId: prof?.id ?? null,
      };
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Email control center"
        description="Share login credentials, compose a ready-made or custom email, preview it exactly as it will look, and send — to one person or many."
      />

      {/* Tab nav */}
      <nav aria-label="Email areas" className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Link
              key={t.id}
              href={`/admin/emails?tab=${t.id}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md border-2 border-border px-4 py-2 text-small font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground hard-shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        {tab === "credentials" ? (
          <>
            <p className="mb-4 text-small text-muted-foreground">
              Each student&apos;s account + password. Import first from{" "}
              <Link href="/admin/students" className="font-medium text-link underline underline-offset-2">
                Students
              </Link>
              , then select people and send them their login — or download the whole list as CSV.
            </p>
            <RosterActions rows={credentialsRows} />
          </>
        ) : tab === "compose" ? (
          <ComposeTab
            adminEmail={adminProfile?.email ?? ""}
            templates={EMAIL_TEMPLATES.map((t) => ({
              id: t.id,
              label: t.label,
              defaultSubject: t.defaultSubject,
              hint: t.hint,
            }))}
          />
        ) : (
          <SentTab />
        )}
      </div>
    </div>
  );
}
