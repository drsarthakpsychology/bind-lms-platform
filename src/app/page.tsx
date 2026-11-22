import { HomePage } from "@/components/home/home-page";
import { ReturningStudentRedirect } from "@/components/landing/returning-student-redirect";
import { LEGAL } from "@/lib/legal-constants";
import { BRAND } from "@/lib/brand";
import { CANONICAL_ORIGIN } from "@/lib/seo/canonical-host";
import type { Metadata } from "next";

const HOME_TITLE = "VIBHA School of Psychology: Practical Training and Internship";
const HOME_DESCRIPTION =
  "Practical psychology training and supervised internship in Ahmedabad and online. Interview real patients under psychiatrists' supervision, write treatment plans and earn internship hours.";

/**
 * Public front door: the highest-traffic route. Statically rendered with a
 * one-hour ISR revalidate so it's CDN-cacheable (the previous version read
 * cookies() via getSession, which opts the route out of caching entirely).
 * Returning students are bounced to /dashboard client-side after hydration;
 * auth on every protected route still lives in the route-group layouts and
 * middleware, so removing the server-side gate here can't weaken protection.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: HOME_TITLE, description: HOME_DESCRIPTION, url: "/" },
  twitter: { title: HOME_TITLE, description: HOME_DESCRIPTION },
};

/** Structured data for the site root: the school, and the site itself. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${CANONICAL_ORIGIN}/#organization`,
  name: BRAND.name,
  alternateName: BRAND.shortName,
  description: HOME_DESCRIPTION,
  url: `${CANONICAL_ORIGIN}/`,
  logo: `${CANONICAL_ORIGIN}/brand/vibha-512.png`,
  image: `${CANONICAL_ORIGIN}/opengraph-image.png`,
  email: LEGAL.contactEmail,
  telephone: LEGAL.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "M-2, Mahakant Complex, Opposite V.S. Hospital, Ellisbridge, Paldi",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380006",
    addressCountry: "IN",
  },
  parentOrganization: BRAND.parent ? { "@type": "Organization", name: BRAND.parent } : undefined,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${CANONICAL_ORIGIN}/#website`,
  name: BRAND.name,
  alternateName: BRAND.shortName,
  url: `${CANONICAL_ORIGIN}/`,
  inLanguage: "en-IN",
  publisher: { "@id": `${CANONICAL_ORIGIN}/#organization` },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <ReturningStudentRedirect />
      <HomePage />
    </>
  );
}
