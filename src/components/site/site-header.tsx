import Link from "next/link";
import { VibhaWordmark } from "@/components/brand/vibha-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * The quiet top bar for public pages outside the homepage (invitation form,
 * policies, account notices, certificate checks, not found): the wordmark
 * home on the left, an optional link or two and the theme switch on the right.
 * No full menu: these pages each have one job, so the bar never competes with
 * it. Same height and gutters as the footer's rail so the edges line up.
 */
export function SiteHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <header className={cn("border-b-2 border-foreground bg-background", className)}>
      <div className="rail flex h-16 items-center justify-between gap-3">
        <Link href="/go/home" aria-label="VIBHA home" className="-ml-1 flex min-h-11 items-center rounded-md px-1">
          <VibhaWordmark size={30} />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** A plain text link for the header's right side, 44px tall to tap. */
export function SiteHeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center rounded-md px-2.5 text-small font-semibold text-foreground underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}
