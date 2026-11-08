import type { Metadata } from "next";
import { NotFoundState } from "@/components/design-system/not-found-state";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/**
 * Any address that matches no page (a mistyped or old link). One way on:
 * Home, which sends each person to their own start (student Home, Admin, or
 * the public homepage when signed out).
 */
export default function NotFound() {
  return <NotFoundState className="min-h-screen" />;
}
