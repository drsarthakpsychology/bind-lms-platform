"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { issueCertificates, resendCertificate, revokeCertificate, type IssueReport } from "@/lib/certificates/issue";
import type { StudioIssueInput } from "@/lib/certificates/issue-input";
import { drainEmailQueue, type DeliveryReport } from "@/lib/certificates/server";

/**
 * Certificate studio actions. Each one is its own endpoint, so each one
 * checks for the Super Admin itself: a student or a view-only admin calling
 * it directly is refused and nothing is written.
 */
const DENIED = "Only the Super Admin can do this.";

function refresh(ids: string[] = []) {
  revalidatePath("/admin/credentials/issued");
  revalidatePath("/admin/credentials");
  revalidatePath("/achievements");
  for (const id of ids) {
    revalidatePath(`/verify/${id}`);
    revalidatePath(`/achievements/${id}`);
  }
}

/** Issue to one student, several, or a cohort. `replaces` makes it a correction of that certificate. */
export async function issueStudioCertificates(input: StudioIssueInput, replaces?: string | null): Promise<IssueReport> {
  const me = await requireSuperAdmin();
  if (!me) return { error: DENIED, issued: [], skipped: [], delivery: null, batchId: null };
  const report = await issueCertificates(createAdminClient(), { id: me.id, email: me.email }, input, { replaces: replaces || null });
  refresh([...report.issued.map((i) => i.credentialId), ...(replaces ? [replaces] : [])]);
  return report;
}

export async function revokeStudioCertificate(credentialId: string, reason: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: DENIED };
  const r = await revokeCertificate(createAdminClient(), { id: me.id, email: me.email }, credentialId, reason);
  refresh([credentialId]);
  return r;
}

export async function resendStudioCertificate(credentialId: string, alsoEmail: boolean): Promise<{ error: string | null; notified: boolean; delivery: DeliveryReport | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: DENIED, notified: false, delivery: null };
  const r = await resendCertificate(createAdminClient(), { id: me.id, email: me.email }, credentialId, { email: alsoEmail });
  refresh();
  return r;
}

/** "Send waiting emails": what is in the queue, oldest first, up to today's limit. */
export async function sendWaitingCertificateEmails(): Promise<{ error: string | null; sent: number; left: number }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: DENIED, sent: 0, left: 0 };
  const r = await drainEmailQueue(createAdminClient(), me.id);
  refresh();
  return r;
}
