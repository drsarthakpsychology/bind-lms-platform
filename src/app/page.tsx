import { LandingPage } from "@/components/landing/landing-page";
import { ReturningStudentRedirect } from "@/components/landing/returning-student-redirect";

/**
 * Public front door — the highest-traffic route. Statically rendered with a
 * one-hour ISR revalidate so it's CDN-cacheable (the previous version read
 * cookies() via getSession, which opts the route out of caching entirely).
 * Returning students are bounced to /dashboard client-side after hydration;
 * auth on every protected route still lives in the route-group layouts and
 * middleware, so removing the server-side gate here can't weaken protection.
 */
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <ReturningStudentRedirect />
      <LandingPage />
    </>
  );
}
