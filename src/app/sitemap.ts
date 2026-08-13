import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhaschoolofpsychology.in";

/** The two public URLs. The LMS routes are noindexed and disallowed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/enquire`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
