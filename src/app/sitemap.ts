import { CANONICAL_ORIGIN } from "@/lib/seo/canonical-host";
import type { MetadataRoute } from "next";
import { getPolicies } from "@/lib/policies";
import { CALM_TOOLS } from "@/lib/free/calm";
import { INSTRUMENTS } from "@/lib/free/tests";

// The production custom domain. NEXT_PUBLIC_APP_URL must be set to this in
// Vercel (not the internal bind-lms-platform.vercel.app hostname), so search
// engines index the real URLs. The fallback is correct for local/dev.
// Always the real address, so a preview or the old Vercel address can never
// list itself.
const siteUrl = CANONICAL_ORIGIN;

/**
 * Dates the public pages last changed in a way that matters to a reader.
 * Update the matching date when you change a page's words; a date that
 * changes on every request tells search engines nothing.
 */
const UPDATED = {
  home: "2026-11-22",
  internship: "2026-11-22",
  waitlist: "2026-11-22",
  free: "2026-11-22",
  deleteAccount: "2026-10-01",
} as const;

function day(raw: string, fallback: string): Date {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date(fallback) : d;
}

/**
 * The public URLs. The LMS routes are noindexed and disallowed; the policy
 * pages are indexable and their slugs are read from content/policies so the
 * sitemap never drifts from the files on disk.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const policies = getPolicies();
  const newestPolicy = policies
    .map((p) => day(p.meta.lastUpdated, UPDATED.home))
    .reduce((a, b) => (b > a ? b : a), new Date("2026-08-26"));
  return [
    { url: `${siteUrl}/`, lastModified: day(UPDATED.home, UPDATED.home), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/psychology-internship`, lastModified: day(UPDATED.internship, UPDATED.home), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/waitlist`, lastModified: day(UPDATED.waitlist, UPDATED.home), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/free`, lastModified: day(UPDATED.free, UPDATED.home), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/free/help`, lastModified: day(UPDATED.free, UPDATED.home), changeFrequency: "yearly", priority: 0.6 },
    ...INSTRUMENTS.map((i) => ({ url: `${siteUrl}/free/tests/${i.id}`, lastModified: day(UPDATED.free, UPDATED.home), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...CALM_TOOLS.map((c) => ({ url: `${siteUrl}/free/calm/${c.id}`, lastModified: day(UPDATED.free, UPDATED.home), changeFrequency: "yearly" as const, priority: 0.5 })),
    { url: `${siteUrl}/policies`, lastModified: newestPolicy, changeFrequency: "monthly", priority: 0.5 },
    ...policies.map((p) => ({
      url: `${siteUrl}/policies/${p.meta.slug}`,
      lastModified: day(p.meta.lastUpdated, "2026-08-26"),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    { url: `${siteUrl}/delete-account`, lastModified: day(UPDATED.deleteAccount, UPDATED.home), changeFrequency: "yearly", priority: 0.3 },
  ];
}
