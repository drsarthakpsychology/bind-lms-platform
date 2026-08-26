import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Policy } from "@/lib/policies";

/**
 * The policy sidebar list. A real `<nav>` with the current policy marked
 * `aria-current="page"`; links are ≥44px tap targets and use `--link`
 * (terracotta, ≥5.4:1) for the active state.
 */
export function PolicyNav({
  policies,
  currentSlug,
}: {
  policies: Policy[];
  currentSlug: string;
}) {
  return (
    <nav aria-label="Policies" className="space-y-1">
      <Link
        href="/policies"
        className={cn(
          "flex min-h-11 items-center rounded-md px-3 text-small font-medium transition-colors",
          currentSlug === ""
            ? "bg-primary/15 text-link"
            : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        )}
      >
        All policies
      </Link>
      {policies.map((p) => {
        const active = p.meta.slug === currentSlug;
        return (
          <Link
            key={p.meta.slug}
            href={`/policies/${p.meta.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-md border-l-2 px-3 text-small transition-colors",
              active
                ? "border-link bg-primary/10 font-medium text-link"
                : "border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <span className="line-clamp-2">{p.meta.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
