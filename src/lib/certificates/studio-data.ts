import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadRoster } from "@/lib/people/roster-data";
import { dailyEmailLimit } from "./email-plan";
import { istDay } from "./kinds";
import { emailConfigured, emailsSentToday, signatureOptions, siteBase, studioReady } from "./server";

/**
 * What the certificate studio starts with, the same reads as
 * src/app/(dashboard)/admin/credentials/studio/page.tsx: students and
 * cohorts from the roster, courses, saved signatures, and today's email
 * allowance. The mobile app's studio uses it; the website page should switch
 * to it once the certificates rework (branch agent/admincert) lands, so the
 * two stay one. Call it only after the admin check.
 */
export async function loadStudioSetup(admin: SupabaseClient) {
  const [roster, ready, courses, signatures, sentToday] = await Promise.all([
    loadRoster(),
    studioReady(admin),
    admin.from("courses").select("id, title").order("title").limit(200),
    signatureOptions(admin).catch(() => []),
    emailConfigured() ? emailsSentToday(admin).catch(() => 0) : Promise.resolve(0),
  ]);
  const counts = new Map<string, number>();
  for (const r of roster.rows) for (const c of r.cohorts) counts.set(c.id, (counts.get(c.id) ?? 0) + 1);
  const limit = dailyEmailLimit();
  return {
    roster,
    setup: {
      ready,
      today: istDay(new Date()),
      siteUrl: siteBase(),
      students: roster.rows.map((r) => ({ id: r.id, name: r.name, email: r.email, roll: r.roll, cohortIds: r.cohorts.map((c) => c.id) })),
      cohorts: roster.cohorts.map((c) => ({ id: c.id, name: c.name, count: counts.get(c.id) ?? 0 })),
      courses: (courses.data ?? []).map((c) => ({ id: c.id as string, title: c.title as string })),
      signatures,
      email: { configured: emailConfigured(), remaining: Math.max(0, limit - sentToday), limit },
    },
  };
}
