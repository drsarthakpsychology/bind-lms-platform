"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminSectionFor } from "@/components/navigation/nav-config";
import { cn } from "@/lib/utils";

/**
 * The tab strip at the top of each admin place (Content, People, Review,
 * System): the second level of navigation, like Shopify's or Gmail's tabs.
 * Scrolls sideways on phones; the active tab scrolls itself into view.
 */
export function AdminSectionTabs({ v2 = false }: { /** New design: quiet underlined tabs, no eyebrow, hairline edge. */ v2?: boolean }) {
  const pathname = usePathname() ?? "";
  const section = adminSectionFor(pathname);
  const activeRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  if (!section || section.tabs.filter((t) => !t.hidden).length < 2) return null;

  const tabs = section.tabs.filter((t) => !t.hidden);
  const activeHref = [...section.tabs]
    .filter((t) => pathname === t.href || pathname.startsWith(t.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  if (v2) {
    return (
      <nav aria-label={`${section.label} pages`} className="mb-[var(--ds-6)] w-full min-w-0 border-b border-[var(--ds-hairline)]">
        <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const active = t.href === activeHref;
            return (
              <li key={t.href} className="shrink-0">
                <Link
                  ref={active ? activeRef : undefined}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center border-b-2 px-3 type-small font-semibold whitespace-nowrap outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <div className="-mx-4 mb-6 border-b-2 border-foreground/10 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <p className="text-eyebrow pt-1 text-link">{section.label}</p>
      <nav aria-label={`${section.label} pages`}>
        <ul className="-mb-0.5 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const active = t.href === activeHref;
            return (
              <li key={t.href} className="shrink-0">
                <Link
                  ref={active ? activeRef : undefined}
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-12 items-center px-3 text-sm font-bold whitespace-nowrap transition-colors duration-fast",
                    "after:absolute after:inset-x-2 after:bottom-0 after:h-1 after:rounded-full after:transition-colors",
                    active
                      ? "text-foreground after:bg-link"
                      : "text-muted-foreground after:bg-transparent hover:text-foreground hover:after:bg-foreground/20",
                  )}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
