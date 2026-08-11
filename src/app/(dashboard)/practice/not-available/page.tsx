import Link from "next/link";
import { Clock3 } from "lucide-react";

export const dynamic = "force-dynamic";

/**
 * The honest "not yet available" page (A2 DONE MEANS: flagged-off routes
 * return a proper page, never a 404). Feature flags are checked server-side
 * and direct URLs to flagged-off tools land here until the admin reveals them.
 */
export default async function NotAvailablePage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const { feature } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
      <Clock3 className="mx-auto size-10 text-muted-foreground" aria-hidden />
      <h1 className="mt-4 text-h1">Not unlocked yet</h1>
      <p className="mt-2 text-small text-muted-foreground">
        {feature ? (
          <>
            <span className="font-medium text-foreground">{feature.replace(/_/g, " ")}</span> is
            built and waiting — your faculty reveals tools in stages so the cohort can go deep
            on one thing at a time.
          </>
        ) : (
          "This tool is built and waiting — your faculty reveals tools in stages so the cohort can go deep on one thing at a time."
        )}
      </p>
      <Link
        href="/practice"
        className="mt-6 inline-block rounded-md border-2 border-border bg-primary px-4 py-2 text-small font-semibold text-primary-foreground hard-shadow-sm transition-transform active:translate-y-px"
      >
        Back to practice
      </Link>
    </div>
  );
}