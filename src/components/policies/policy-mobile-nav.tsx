"use client";

import { useRouter } from "next/navigation";
import type { Policy } from "@/lib/policies";

/**
 * Mobile (<768px) policy jumper — a `<select>` pinned above the content so a
 * phone user can move between policies without scrolling back to the top.
 * A plain, familiar control (44px target), no accordion state to manage.
 */
export function PolicyMobileNav({
  policies,
  currentSlug,
}: {
  policies: Policy[];
  currentSlug: string;
}) {
  const router = useRouter();
  return (
    <label className="mb-4 block md:hidden print:hidden">
      <span className="text-eyebrow text-link">All policies</span>
      <select
        value={currentSlug}
        onChange={(e) => router.push(`/policies/${e.target.value}`)}
        className="mt-1 min-h-11 w-full rounded-md border-2 border-foreground bg-card px-3 text-small text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
      >
        <option value="" disabled>
          Choose a policy…
        </option>
        {policies.map((p) => (
          <option key={p.meta.slug} value={p.meta.slug}>
            {p.meta.title}
          </option>
        ))}
      </select>
    </label>
  );
}
