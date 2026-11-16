import type * as React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin, isSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { loadRoster } from "@/lib/people/roster-data";
import { dailyEmailLimit } from "@/lib/certificates/email-plan";
import { normaliseCertificateId } from "@/lib/certificates/id";
import { istDay } from "@/lib/certificates/kinds";
import { SIGNATORIES_KEY, startingSignatories } from "@/lib/certificates/defaults";
import { emailConfigured, emailsSentToday, loadCredential, recordKind, recordSignatories, recordTitle, signatureOptions, siteBase, studioMeta, studioReady } from "@/lib/certificates/server";
import { AdminPage } from "../../_v2/kit";
import { ChoiceLinks } from "../_ui/parts";
import { Studio, type StudioSeed } from "./studio";
import { BadgeIssue, type BadgeOption } from "./badge-issue";
import { AnyoneIssue } from "./anyone-issue";

export const metadata: Metadata = { title: "Issue" };
export const dynamic = "force-dynamic";
// A whole cohort is one request: PDFs, notices and paced emails.
export const maxDuration = 300;

type What = "certificate" | "badge" | "anyone";
const TITLES: Record<What, string> = { certificate: "Issue a certificate", badge: "Give a badge", anyone: "Certificate without an account" };

/**
 * Certificates, Issue. One place to issue anything: a certificate in the
 * studio (one student, several or a cohort, with the live certificate beside
 * the form), a badge, or a certificate for someone without an account. Any
 * admin can open it; only the Super Admin gets the Issue buttons.
 */
export default async function IssuePage({ searchParams }: { searchParams: Promise<{ what?: string; reissue?: string; student?: string; badge?: string }> }) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const sp = await searchParams;
  const what: What = sp.reissue ? "certificate" : sp.what === "badge" || sp.what === "anyone" ? sp.what : "certificate";
  const canWrite = isSuperAdmin(me);
  const admin = createAdminClient();
  const today = istDay(new Date());

  const [roster, signatures] = await Promise.all([loadRoster(), signatureOptions(admin).catch(() => [])]);
  const counts = new Map<string, number>();
  for (const r of roster.rows) for (const c of r.cohorts) counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
  const students = roster.rows.map((r) => ({ id: r.id, name: r.name, email: r.email, roll: r.roll, cohortIds: r.cohorts.map((c) => c.id) }));
  const cohorts = roster.cohorts.map((c) => ({ id: c.id, name: c.name, count: counts.get(c.id) ?? 0 }));

  const q = (extra: Record<string, string>) => {
    const p = new URLSearchParams(extra);
    if (sp.student) p.set("student", sp.student);
    const s = p.toString();
    return `/admin/credentials/studio${s ? `?${s}` : ""}`;
  };
  const switcher = sp.reissue ? null : (
    <ChoiceLinks
      label="What to issue"
      current={what}
      options={[
        { id: "certificate", label: "Certificate", href: q({}) },
        { id: "badge", label: "Badge", href: q({ what: "badge" }) },
        { id: "anyone", label: "No account", href: q({ what: "anyone" }) },
      ]}
    />
  );

  let body: React.ReactNode;
  if (what === "badge") {
    const [{ data: list }, { data: given }] = await Promise.all([
      admin.from("achievements").select("id, title, icon, description, enabled").eq("type", "badge").order("title"),
      admin.from("credentials").select("achievement_id").eq("type", "badge").neq("status", "revoked").limit(20000),
    ]);
    const n = new Map<string, number>();
    for (const g of given ?? []) n.set(g.achievement_id as string, (n.get(g.achievement_id as string) ?? 0) + 1);
    const badges: BadgeOption[] = (list ?? []).map((b) => ({ id: b.id as string, title: b.title as string, icon: (b.icon as string | null) ?? null, description: (b.description as string | null) ?? null, enabled: Boolean(b.enabled), issued: n.get(b.id as string) ?? 0 }));
    const start = sp.student ? students.filter((s) => s.id === sp.student) : [];
    body = <BadgeIssue key={start.map((s) => s.id).join()} canWrite={canWrite} badges={badges} students={students} cohorts={cohorts} initialBadge={sp.badge ?? null} initialPicked={start} />;
  } else if (what === "anyone") {
    body = <AnyoneIssue canWrite={canWrite} today={today} signatures={signatures.map((s) => ({ id: s.id, label: s.label }))} />;
  } else {
    const [ready, courses, sentToday, saved] = await Promise.all([
      studioReady(admin),
      admin.from("courses").select("id, title").order("title").limit(200),
      emailConfigured() ? emailsSentToday(admin).catch(() => 0) : Promise.resolve(0),
      admin.from("admin_settings").select("value").eq("key", SIGNATORIES_KEY).maybeSingle(),
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
    const limit = dailyEmailLimit();
    body = (
      <Studio
        canWrite={canWrite}
        ready={ready}
        today={today}
        siteUrl={siteBase()}
        students={students}
        cohorts={cohorts}
        courses={(courses.data ?? []).map((c) => ({ id: c.id as string, title: c.title as string }))}
        signatures={signatures}
        email={{ configured: emailConfigured(), remaining: Math.max(0, limit - sentToday), limit }}
        seed={seed}
        defaultSignatories={startingSignatories(saved.error ? null : saved.data?.value)}
      />
    );
  }

  return (
    <AdminPage title={sp.reissue ? "Correct a certificate" : TITLES[what]} actions={switcher}>
      {body}
    </AdminPage>
  );
}
