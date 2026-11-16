import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadHiddenIds } from "@/lib/people/hidden-ids";

/**
 * Supervision sign-offs: the entries students asked to be signed, and the
 * Super Admin's sign or reject. Shared by /admin/supervision, its
 * /api/admin/supervision-signoff route and the app's /admin/review/signoffs.
 */
export type SignOffEntry = {
  id: string;
  userId: string;
  studentEmail: string;
  studentName: string | null;
  activity: string;
  hours: number;
  date: string;
  supervisorName: string | null;
  competencyId: string | null;
  signoffStatus: string;
};

/** Requested entries, newest first, test accounts left out. */
export async function loadSignOffRequests(admin: SupabaseClient): Promise<SignOffEntry[]> {
  const [{ data: requested }, { data: profiles }, hidden] = await Promise.all([
    admin
      .from("supervision_entries")
      .select("id, user_id, activity, hours, date, supervisor_name, competency_id, signoff_status")
      .eq("signoff_status", "requested")
      .order("date", { ascending: false })
      .limit(100),
    admin.from("profiles").select("id, email, name").limit(5000),
    loadHiddenIds(),
  ]);
  const by = new Map((profiles ?? []).map((p) => [String(p.id), p]));
  return (requested ?? [])
    .filter((e) => !hidden.has(e.user_id as string))
    .map((e) => {
      const p = by.get(String(e.user_id));
      return {
        id: String(e.id),
        userId: String(e.user_id),
        studentEmail: (p?.email as string | undefined) ?? "student",
        studentName: (p?.name as string | null | undefined) ?? null,
        activity: String(e.activity ?? ""),
        hours: Number(e.hours ?? 0),
        date: String(e.date ?? ""),
        supervisorName: (e.supervisor_name as string | null) ?? null,
        competencyId: (e.competency_id as string | null) ?? null,
        signoffStatus: String(e.signoff_status ?? "requested"),
      };
    });
}

export type SignOffDecision = "signed" | "rejected";

/** Sign or reject one requested entry. The caller checks the Super Admin. */
export async function decideSignOff(admin: SupabaseClient, entryId: string, action: SignOffDecision): Promise<{ ok: true; status: SignOffDecision } | { ok: false; why: "not_found" | "not_requested" | "failed"; message: string }> {
  const { data: entry } = await admin.from("supervision_entries").select("id, signoff_status, user_id").eq("id", entryId).maybeSingle();
  if (!entry) return { ok: false, why: "not_found", message: "not found" };
  if (entry.signoff_status !== "requested") return { ok: false, why: "not_requested", message: "entry not awaiting sign-off" };
  const { error } = await admin.from("supervision_entries").update({ signoff_status: action }).eq("id", entryId);
  if (error) return { ok: false, why: "failed", message: error.message };
  return { ok: true, status: action };
}
