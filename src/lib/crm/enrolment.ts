import type { SupabaseClient } from "@supabase/supabase-js";
import { pageAll } from "@/lib/db/counts";

/**
 * Who is "enrolled" when the owner picks people to email: a student account
 * that is in at least one cohort (profiles + cohort_members), or a person
 * marked paid in the pipeline (crm_contacts.paid_at). Everyone else who
 * filled a form or enquired is "not enrolled yet". The pipeline stage alone
 * (e.g. "Joined" typed by hand) does not count.
 */

export type EnrolFilter = "" | "not_enrolled" | "enrolled";

export const ENROL_OPTIONS: Array<{ v: EnrolFilter; l: string }> = [
  { v: "", l: "Enrolled or not" },
  { v: "not_enrolled", l: "Not enrolled yet" },
  { v: "enrolled", l: "Enrolled" },
];

export const isEnrolFilter = (v: unknown): v is EnrolFilter => v === "" || v === "not_enrolled" || v === "enrolled";

/** Enrolled from what the pipeline already knows about a person. */
export function isEnrolled(p: { isStudent: boolean; cohorts: ReadonlyArray<unknown>; paidAt: string | null }): boolean {
  return (p.isStudent && (p.cohorts ?? []).length > 0) || Boolean(p.paidAt);
}

/** Whether someone passes the filter. */
export function keepEnrol(enrolled: boolean, filter: EnrolFilter | null | undefined): boolean {
  if (filter === "not_enrolled") return !enrolled;
  if (filter === "enrolled") return enrolled;
  return true;
}

/** Every enrolled email (lower case), read on the server. */
export async function enrolledEmails(admin: SupabaseClient): Promise<Set<string>> {
  const out = new Set<string>();
  const members = (await pageAll<{ user_id: string }>(() => admin.from("cohort_members").select("user_id").order("user_id") as never)) ?? [];
  const ids = [...new Set(members.map((m) => String(m.user_id)))];
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await admin.from("profiles").select("email, role").in("id", ids.slice(i, i + 200));
    for (const p of data ?? []) if (p.email && p.role === "student") out.add(String(p.email).trim().toLowerCase());
  }
  const paid = await pageAll<{ email: string; paid_at: string | null }>(() => admin.from("crm_contacts").select("email, paid_at").not("paid_at", "is", null).order("email") as never);
  // Before the payment database step there is no paid_at column: nobody is marked paid yet.
  for (const c of paid ?? []) if (c.email && c.paid_at) out.add(String(c.email).trim().toLowerCase());
  return out;
}
