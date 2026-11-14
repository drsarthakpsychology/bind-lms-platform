import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadRoster } from "@/lib/people/roster-data";
import { dailyEmailLimit } from "@/lib/certificates/email-plan";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { istDay } from "@/lib/certificates/kinds";
import { emailConfigured, emailsSentToday, loadCredential, recordKind, recordSignatories, recordTitle, signatureOptions, siteBase, studioMeta, studioReady } from "@/lib/certificates/server";
import { Studio, type StudioSeed } from "./studio";

export const metadata: Metadata = { title: "Certificate studio" };
export const dynamic = "force-dynamic";
// A whole cohort is one request: PDFs, notices and paced emails.
export const maxDuration = 300;

/**
 * Admin → Credentials → Certificate studio. Pick a type, the people, the
 * wording; see the certificate as the student will; issue and send. Any
 * admin can open it; only the Super Admin gets the Issue button.
 */
export default async function CertificateStudioPage({ searchParams }: { searchParams: Promise<{ reissue?: string; student?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const sp = await searchParams;
  const admin = createAdminClient();
  const [roster, ready, courses, signatures, sentToday] = await Promise.all([
    loadRoster(),
    studioReady(admin),
    admin.from("courses").select("id, title").order("title").limit(200),
    signatureOptions(admin).catch(() => []),
    emailConfigured() ? emailsSentToday(admin).catch(() => 0) : Promise.resolve(0),
  ]);

  let seed: StudioSeed | null = null;
  if (sp.reissue) {
    const old = await loadCredential(admin, normaliseCertificateId(sp.reissue));
    if (old && old.type === "certificate" && old.user_id && old.status === "issued" && !old.revoked_at) {
      const meta = studioMeta(old);
      const w = { ...(meta?.wording ?? {}), ...(old.wording ?? {}) };
      seed = {
        replaces: old.credential_id,
        kind: recordKind(old),
        title: recordTitle(old),
        heading: w.heading ?? "",
        lead: w.lead ?? "",
        connector: w.connector ?? "",
        citation: old.reason ?? "",
        courseLabel: old.course_label ?? meta?.course_label ?? "",
        moduleLabel: old.module_label ?? meta?.module_label ?? "",
        issuedOn: istDay(old.issued_at ?? old.created_at),
        expiresOn: old.expires_at ? istDay(old.expires_at) : "",
        signatories: recordSignatories(old).map((s) => ({ name: s.name, role: s.role, signatureFrom: s.signatureFrom ?? null })),
        recipient: { userId: old.user_id, name: old.student_name },
      };
    }
  } else if (sp.student) {
    const s = roster.rows.find((r) => r.id === sp.student);
    if (s) seed = { recipient: { userId: s.id, name: s.name } };
  }

  const counts = new Map<string, number>();
  for (const r of roster.rows) for (const c of r.cohorts) counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
  const limit = dailyEmailLimit();

  return (
    <Studio
      canWrite={isSuperAdmin(me)}
      ready={ready}
      today={istDay(new Date())}
      siteUrl={siteBase()}
      students={roster.rows.map((r) => ({ id: r.id, name: r.name, email: r.email, roll: r.roll, cohortIds: r.cohorts.map((c) => c.id) }))}
      cohorts={roster.cohorts.map((c) => ({ id: c.id, name: c.name, count: counts.get(c.id) ?? 0 }))}
      courses={(courses.data ?? []).map((c) => ({ id: c.id as string, title: c.title as string }))}
      signatures={signatures}
      email={{ configured: emailConfigured(), remaining: Math.max(0, limit - sentToday), limit }}
      seed={seed}
    />
  );
}
