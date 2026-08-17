import type { MetadataRoute } from "next";
import { getPolicies } from "@/lib/policies";

// The production custom domain. NEXT_PUBLIC_APP_URL must be set to this in
// Vercel (not the internal bind-lms-platform.vercel.app hostname), so search
// engines index the real URLs. The fallback is correct for local/dev.
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

/**
 * The public URLs. The LMS routes are noindexed and disallowed; the policy
 * pages are indexable and their slugs are read from content/policies so the
 * sitemap never drifts from the files on disk.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/waitlist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/policies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...getPolicies().map((p) => ({
      url: `${siteUrl}/policies/${p.meta.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
