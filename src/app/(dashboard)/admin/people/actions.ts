"use server";

import { appUrl as liveAppUrl } from "@/lib/app-url";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { deriveName, generateCredential, issueSetupLink } from "@/lib/auth/roster";
import { STAGE_LABEL, isStage } from "@/lib/crm/people";

type Result = { error: string | null };
const clean = (email: string) => email.trim().toLowerCase();
const ok = (email: string): Result => {
  revalidatePath("/admin/people");
  revalidatePath("/admin");
  void email;
  return { error: null };
};

/** Move someone to a pipeline stage (and log it on their timeline). */
export async function setStage(email: string, stage: string): Promise<Result> {
  const admin0 = await requireSuperAdmin();
  if (!admin0) return { error: "Not authorized." };
  if (!isStage(stage)) return { error: "Unknown stage." };
  const admin = createAdminClient();
  const e = clean(email);
  const { error } = await admin.from("crm_contacts").upsert({ email: e, stage, updated_at: new Date().toISOString() }, { onConflict: "email" });
  if (error) return { error: "Couldn't save the stage." };
  await admin.from("crm_activities").insert({ email: e, kind: "stage", body: `Moved to ${STAGE_LABEL[stage]}`, created_by: admin0.id });
  return ok(e);
}

/** Set (or clear, with an empty date) the next follow-up. */
export async function setFollowUp(email: string, date: string): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const admin = createAdminClient();
  const at = date ? new Date(`${date}T09:00:00+05:30`).toISOString() : null;
  const { error } = await admin.from("crm_contacts").upsert({ email: clean(email), next_follow_up_at: at, updated_at: new Date().toISOString() }, { onConflict: "email" });
  if (error) return { error: "Couldn't save the follow-up." };
  return ok(email);
}

/** Log a call, WhatsApp, meeting or note. Contacting someone new moves them to "Contacted". */
export async function logActivity(email: string, kind: string, body: string): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  if (!["note", "call", "whatsapp", "email", "meeting"].includes(kind)) return { error: "Unknown activity." };
  const text = body.trim().slice(0, 4000);
  const admin = createAdminClient();
  const e = clean(email);
  const { error } = await admin.from("crm_activities").insert({ email: e, kind, body: text || null, created_by: me.id });
  if (error) return { error: "Couldn't save that." };
  if (kind !== "note") {
    const { data: c } = await admin.from("crm_contacts").select("stage").eq("email", e).maybeSingle();
    if (!c || c.stage === "new") {
      await admin.from("crm_contacts").upsert({ email: e, stage: "contacted", updated_at: new Date().toISOString() }, { onConflict: "email" });
    }
  }
  return ok(e);
}

/** Turn an enquiry into a student account and return a one-time setup link. */
export async function convertToStudent(email: string, name: string): Promise<{ error: string | null; setupUrl: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized.", setupUrl: null };
  const e = clean(email);
  const admin = createAdminClient();
  const { data: existing } = await admin.from("profiles").select("id").eq("email", e).maybeSingle();
  if (!existing) {
    const { data: created, error } = await admin.auth.admin.createUser({ email: e, password: generateCredential(), email_confirm: true });
    if (error || !created.user) return { error: error?.message ?? "Couldn't create the account.", setupUrl: null };
    await admin.from("profiles").update({ scope: "full" }).eq("id", created.user.id);
  }
  await admin
    .from("credential_invites")
    .upsert({ email: e, name: name.trim() || deriveName(e), status: "pending", error_reason: null, sent_at: null }, { onConflict: "email" });
  await admin.from("crm_contacts").upsert({ email: e, stage: "joined", updated_at: new Date().toISOString() }, { onConflict: "email" });
  await admin.from("crm_activities").insert({ email: e, kind: "stage", body: "Became a student", created_by: me.id });
  const appUrl = liveAppUrl();
  const setupUrl = await issueSetupLink(admin, e, appUrl, me.id);
  revalidatePath("/admin/students");
  revalidatePath("/admin/emails");
  ok(e);
  return { error: null, setupUrl };
}
