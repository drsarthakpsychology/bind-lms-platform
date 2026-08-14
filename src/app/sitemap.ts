import type { MetadataRoute } from "next";

// The production custom domain. NEXT_PUBLIC_APP_URL must be set to this in
// Vercel (not the internal bind-lms-platform.vercel.app hostname), so search
// engines index the real URLs. The fallback is correct for local/dev.
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

/** The two public URLs. The LMS routes are noindexed and disallowed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/waitlist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
