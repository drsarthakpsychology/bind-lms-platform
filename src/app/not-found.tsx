import type { Metadata } from "next";
import { NotFoundState } from "@/components/design-system/not-found-state";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/**
 * Any address that matches no page (a mistyped or old link). The site header
 * stays so people know where they landed, then one way on: Home, which sends
 * each person to their own start (student Home, Admin, or the public homepage
 * when signed out).
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <NotFoundState className="flex-1 py-16" />
    </div>
  );
}
