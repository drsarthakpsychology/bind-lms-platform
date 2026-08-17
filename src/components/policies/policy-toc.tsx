import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/policies";

/**
 * "On this page" section-jump list. Rendered in the desktop sidebar below the
 * policy list. Only meaningful when a policy has more than one section, so
 * short policies (cookies, terms-of-use) quietly skip it.
 */
export function PolicyToc({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label="On this page" className="border-t border-border pt-4">
      <p className="text-eyebrow text-link">On this page</p>
      <ul className="mt-3 space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="flex min-h-9 items-center gap-2 rounded-md px-2 text-small text-muted-foreground transition-colors hover:bg-surface-2 hover:text-link"
            >
              <span
                aria-hidden
                className={cn(
                  "size-1 shrink-0 rounded-full",
                  h.level === 3 ? "bg-foreground/40" : "bg-link",
                )}
              />
              <span className="line-clamp-2">{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
