import Link from "next/link";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { Rule } from "@/components/landing/landing-primitives";
import { PolicyNav } from "./policy-nav";
import { PolicyToc } from "./policy-toc";
import { PolicyStrip } from "./policy-strip";
import { PolicyMobileNav } from "./policy-mobile-nav";
import type { Heading, Policy } from "@/lib/policies";

/**
 * The shared chrome for every policy page: desktop sticky sidebar (policy list
 * + "on this page"), tablet scroll-strip, mobile `<select>` jumper, a "Last
 * updated" line, and a back-to-top affordance. Content is capped at ~68ch so
 * legal copy never runs the full window width. Body text inherits the site
 * token scale (16px/1.6).
 */
export function PolicyLayout({
  policies,
  current,
  headings,
  children,
}: {
  policies: Policy[];
  current: Policy;
  headings: Heading[];
  children: React.ReactNode;
}) {
  return (
    <main className="rail min-w-0 w-full flex-1 py-8 sm:py-12">
      {/* Slim top bar — policy pages are hit directly from links/emails, so a
          visitor always has a way back to the site. */}
      <div className="mb-8 flex min-w-0 items-center justify-between border-b-2 border-border pb-4 print:hidden">
        <Link href="/" aria-label="VIBHA School of Psychology — home">
          <VibhaWordmark size={28} />
        </Link>
        <nav
          aria-label="Site"
          className="flex items-center gap-5 text-caption text-muted-foreground"
        >
          <Link
            href="/login"
            className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/waitlist"
            className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
          >
            Join waitlist
          </Link>
        </nav>
      </div>

      <div className="lg:grid lg:min-w-0 lg:grid-cols-[16rem_1fr] lg:gap-12">
        {/* Desktop sidebar — sticky below the top chrome. */}
        <aside className="hidden lg:block print:hidden" aria-label="Policy navigation">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] space-y-6 overflow-y-auto pb-8">
            <PolicyNav policies={policies} currentSlug={current.meta.slug} />
            <PolicyToc headings={headings} />
          </div>
        </aside>

        {/* Tablet scroll-strip (768–1023px). */}
        <PolicyStrip policies={policies} currentSlug={current.meta.slug} />

        <article
          id="policies-top"
          className="min-w-0 max-w-[68ch] scroll-mt-28"
        >
          <header className="space-y-3">
            <p className="text-eyebrow text-link">
              <Link
                href="/policies"
                className="transition-colors hover:text-foreground"
              >
                Policies
              </Link>
            </p>
            <h1 className="text-h1 text-foreground">{current.meta.title}</h1>
            <p className="text-caption text-muted-foreground">
              Last updated: {current.meta.lastUpdated}
            </p>
            <Rule className="pt-1" />
          </header>

          {/* Mobile jumper — pinned above the content (<768px). */}
          <PolicyMobileNav
            policies={policies}
            currentSlug={current.meta.slug}
          />

          <div className="pb-16">{children}</div>

          <a
            href="#policies-top"
            className="mt-4 inline-flex min-h-11 items-center rounded-md border-2 border-border bg-card px-4 text-small font-medium text-foreground transition-transform active:translate-y-px print:hidden"
          >
            ↑ Back to top
          </a>
        </article>
      </div>
    </main>
  );
}
