import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { RosterActions } from "./roster-actions";

export const dynamic = "force-dynamic";

export type InviteRow = {
  id: string;
  email: string;
  name: string;
  status: "pending" | "sent" | "failed";
  error_reason: string | null;
  sent_at: string | null;
  created_at: string;
};

/**
 * /admin/roster — the review + send screen for the roster credential emails.
 * Import created the accounts and recorded them here as pending; this is where
 * Kavya sees the full batch before anything goes out, sends (all or selected),
 * and retries failures per-row.
 */
export default async function RosterPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("credential_invites")
    .select("id, email, name, status, error_reason, sent_at, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as InviteRow[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Roster"
        description="Imported accounts, waiting to be emailed. Import first, review here, then send."
      />
      <div className="mt-6">
        <RosterActions rows={rows} />
      </div>
    </div>
  );
}
