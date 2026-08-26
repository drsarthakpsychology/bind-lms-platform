import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Policy } from "@/lib/policies";

/**
 * Tablet (768–1023px) navigation — the sidebar collapses to a horizontal
 * scroll strip of policy pills above the content (single-column layout).
 */
export function PolicyStrip({
  policies,
  currentSlug,
}: {
  policies: Policy[];
  currentSlug: string;
}) {
  return (
    <nav
      aria-label="Policies"
      className="mb-6 hidden -mx-1 overflow-x-auto overscroll-x-contain px-1 md:block lg:hidden print:hidden"
    >
      <ul className="flex min-w-max items-center gap-2 pb-1">
        {policies.map((p) => {
          const active = p.meta.slug === currentSlug;
          return (
            <li key={p.meta.slug}>
              <Link
                href={`/policies/${p.meta.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center whitespace-nowrap rounded-md border-2 px-3 text-small transition-colors",
                  active
                    ? "border-foreground bg-primary text-primary-foreground hard-shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {p.meta.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
