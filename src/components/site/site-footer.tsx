import Link from "next/link";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { BRAND } from "@/lib/brand";

/**
 * The shared site footer, extracted from the landing page and rendered on every
 * public page (landing, waitlist, login, expired, verify, and all /policies).
 * Adds the Legal column the compliance wiring needs — Terms, Privacy, Refund,
 * Grievance and Disclaimer are reachable from every page, and the payment
 * gateway / consumer-e-commerce rules expect refund + grievance links visible.
 *
 * Cookie note is the document-only posture (PostHog is not configured; only
 * strictly necessary auth cookies + the Vercel analytics beacon run) — the
 * Cookie Policy page states the reality.
 */

const LEGAL_LINKS = [
  { label: "Terms", href: "/policies/terms" },
  { label: "Privacy", href: "/policies/privacy" },
  { label: "Refund", href: "/policies/refund" },
  { label: "Grievance", href: "/policies/grievance" },
  { label: "Disclaimer", href: "/policies/disclaimer" },
  { label: "All policies", href: "/policies" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative border-t-2 border-foreground bg-surface-2 print:hidden">
      <div className="rail flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <VibhaWordmark size={32} />
          <nav
            className="flex flex-wrap items-center gap-5 text-caption text-muted-foreground"
            aria-label="Footer"
          >
            <Link
              href="#about"
              className="transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-foreground"
            >
              About
            </Link>
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
          <p className="text-caption text-muted-foreground">
            © 2026 {BRAND.name}
          </p>
        </div>

        <div className="border-t border-foreground/15 pt-5">
          <p className="text-eyebrow text-link">Legal</p>
          <nav aria-label="Legal" className="mt-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-8 items-center text-caption text-muted-foreground transition-[color,translate] duration-base ease-snappy hover:-translate-x-0.5 hover:text-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-3 max-w-xl text-caption text-muted-foreground">
            Cookies: only what’s needed to run the site — see the{" "}
            <Link
              href="/policies/cookies"
              className="text-link underline underline-offset-4 hover:text-foreground"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
