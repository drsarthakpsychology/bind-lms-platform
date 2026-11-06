"use server";

import { requireSession } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { evaluate } from "@/lib/achievements/engine";
import { loadEvalCtx } from "@/lib/achievements/server";
import { credentialDownloadUrl } from "@/lib/achievements/storage";
import type { AchievementRequirement } from "@/lib/achievements/rules";
import { ownsCredential, selectOwnedCredentials } from "@/lib/achievements/owned";

export type MyCredential = {
  credential_id: string;
  type: "badge" | "certificate";
  status: "draft" | "approved" | "issued" | "revoked";
  title: string;
  description: string | null;
  icon: string | null;
  tone: string;
  issued_at: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
};

export type MyProgress = {
  id: string;
  type: "badge" | "certificate";
  title: string;
  description: string | null;
  icon: string | null;
  tone: string;
  earned: boolean;
  status: string;
  progress: string;
};

/**
 * The student's own credentials + progress toward every enabled badge. Reads
 * via the service role (never trusts client state); only this student's rows
 * are returned.
 */
export async function loadMyAchievements(): Promise<{ earned: MyCredential[]; progress: MyProgress[] }> {
  const me = await requireSession();
  if (!me) return { earned: [], progress: [] };
  const admin = createAdminClient();

  const [{ data: creds }, { data: achievements }, ctx] = await Promise.all([
    // Their own, plus custom certificates sent to their email address.
    selectOwnedCredentials(admin, "credential_id, type, status, issued_at, revoked_at, revoke_reason, reason, achievements(title, description, icon, tone)", me.id, me.email),
    admin.from("achievements").select("id, type, title, description, icon, tone, requirements, enabled").eq("enabled", true),
    loadEvalCtx(admin, me.id),
  ]);

  const earned: MyCredential[] = (creds ?? []).map((c) => {
    const a = (Array.isArray(c.achievements) ? c.achievements[0] : c.achievements) as Record<string, unknown> | null;
    return {
      credential_id: c.credential_id as string,
      type: c.type as MyCredential["type"],
      status: c.status as MyCredential["status"],
      title: (a?.title as string) ?? "",
      description: (a?.description as string) ?? (c.type === "certificate" ? ((c.reason as string) ?? null) : null),
      icon: (a?.icon as string) ?? null,
      tone: (a?.tone as string) ?? "lime",
      issued_at: (c.issued_at as string) ?? null,
      revoked_at: (c.revoked_at as string) ?? null,
      revoke_reason: (c.revoke_reason as string) ?? null,
    };
  });

  const earnedTitles = new Set(earned.filter((e) => e.type === "badge").map((e) => e.title));
  const progress: MyProgress[] = (achievements ?? [])
    .filter((a) => a.type === "badge")
    .map((a) => {
      const r = evaluate((a.requirements ?? {}) as AchievementRequirement, ctx);
      return {
        id: a.id as string,
        type: "badge",
        title: a.title as string,
        description: (a.description as string) ?? null,
        icon: (a.icon as string) ?? null,
        tone: (a.tone as string) ?? "lime",
        earned: earnedTitles.has(a.title as string),
        status: earnedTitles.has(a.title as string) ? "earned" : "locked",
        progress: r.reason,
      };
    });

  return { earned, progress };
}

/** Signed download URL for the student's OWN issued certificate PDF. */
export async function downloadMyCertificate(credentialId: string): Promise<{ url: string | null; error: string | null }> {
  const me = await requireSession();
  if (!me) return { url: null, error: "Not signed in." };
  const admin = createAdminClient();
  // Try with recipient_email (email-linked certificates); older databases lack the column.
  let { data, error } = await admin
    .from("credentials")
    .select("pdf_storage_path, status, user_id, recipient_email")
    .eq("credential_id", credentialId)
    .maybeSingle();
  if (error) ({ data, error } = await admin.from("credentials").select("pdf_storage_path, status, user_id").eq("credential_id", credentialId).maybeSingle());
  if (!data || !ownsCredential(data as { user_id?: unknown; recipient_email?: unknown }, me.id, me.email)) return { url: null, error: "Not found." };
  if (data.status !== "issued" || !data.pdf_storage_path) return { url: null, error: "Certificate not yet issued." };
  const url = await credentialDownloadUrl(data.pdf_storage_path as string, 60 * 15);
  return { url, error: null };
}
