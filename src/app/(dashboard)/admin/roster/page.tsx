import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { RosterActions } from "./roster-actions";

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

/**
 * /admin/roster — the review + share screen for the roster credentials.
 * Import created the accounts (each with an 8-char password) and recorded them
 * here as pending. This is where Kavya sees the whole batch — the password list
 * she shares with each student individually — and where she can download the
 * full list as CSV, email a password, reset one, or lock/unlock access.
 */
export default async function RosterPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("credential_invites")
    .select("id, email, name, status, password, error_reason, sent_at, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Omit<InviteRow, "lockStatus">[];

  // Lock state lives on profiles; join by email so each row shows a real toggle.
  const emails = rows.map((r) => r.email);
  const { data: profs } =
    emails.length > 0
      ? await supabase.from("profiles").select("id, email, status").in("email", emails)
      : { data: [] };
  const lockByEmail = new Map(
    (profs ?? []).map((p) => [p.email as string, { status: p.status as string, id: p.id as string }]),
  );
  const rowsWithLock = rows.map((r) => {
    const prof = lockByEmail.get(r.email);
    return {
      ...r,
      lockStatus: (prof?.status === "blocked" ? "blocked" : "active") as "active" | "blocked",
      lockUserId: prof?.id ?? null,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Roster"
        description="Each student's account + password. Import first, then download the password list and share each one individually."
      />
      <div className="mt-6">
        <RosterActions rows={rowsWithLock} />
      </div>
    </div>
  );
}
