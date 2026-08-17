import { LandingPage } from "@/components/landing/landing-page";
import { ReturningStudentRedirect } from "@/components/landing/returning-student-redirect";
import { LEGAL } from "@/lib/legal-constants";
import { BRAND } from "@/lib/brand";

/**
 * Public front door — the highest-traffic route. Statically rendered with a
 * one-hour ISR revalidate so it's CDN-cacheable (the previous version read
 * cookies() via getSession, which opts the route out of caching entirely).
 * Returning students are bounced to /dashboard client-side after hydration;
 * auth on every protected route still lives in the route-group layouts and
 * middleware, so removing the server-side gate here can't weaken protection.
 */
export const revalidate = 3600;

/** Organization structured data — the site root only (legal name, contact). */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: LEGAL.operatingName,
  description: BRAND.description,
  url: "/",
  email: LEGAL.contactEmail,
  telephone: LEGAL.phone,
  address: LEGAL.registeredAddress.startsWith("[")
    ? undefined
    : { "@type": "PostalAddress", streetAddress: LEGAL.registeredAddress },
  parentOrganization: BRAND.parent ? { "@type": "Organization", name: BRAND.parent } : undefined,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <ReturningStudentRedirect />
      <LandingPage />
    </>
  );
}
