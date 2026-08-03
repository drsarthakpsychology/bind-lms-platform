"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatBand } from "@/lib/psychopharm/format";
import type { BandView } from "@/lib/psychopharm/store";

/**
 * The dose ladder — the single most important component in the tool (D3).
 *
 * One rung per band, real values from the data. Tapping a rung switches the
 * page to that band; the URL changes so it's shareable and survives refresh.
 * Bands are rendered sorted ascending by range_low (nulls last) for display,
 * but the ?band= URL param keeps the ORIGINAL band_order so it stays stable
 * and shareable. Vertical on mobile, horizontal on desktop.
 */
export function DoseLadder({ drug, bands }: { drug: string; bands: BandView[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = Number(searchParams?.get("band") ?? (bands.length ? 1 : 0));

  function select(originalOrder: number) {
    const params = new URLSearchParams(searchParams ?? new URLSearchParams());
    params.set("band", String(originalOrder));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (!bands.length) {
    return (
      <p className="text-small text-muted-foreground">
        Our sources don&apos;t describe dose ranges for {drug} yet.
      </p>
    );
  }

  // Sort a COPY ascending by range_low (nulls last); the original array keeps
  // band_order identity for the URL and observation-prompt linkage.
  const sorted = [...bands].sort((a, b) => {
    const al = a.low ?? Number.POSITIVE_INFINITY;
    const bl = b.low ?? Number.POSITIVE_INFINITY;
    return al - bl;
  });

  return (
    <div className="space-y-3">
      <p className="text-eyebrow text-muted-foreground">Tap a dose to see what it does</p>
      <div className="grid gap-2">
        {sorted.map((band, idx) => {
          const originalOrder = bands.indexOf(band) + 1;
          const isActive = originalOrder === active;
          const label = band.band_label || "band";
          return (
            <button
              key={originalOrder}
              type="button"
              onClick={() => select(originalOrder)}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md border-2 border-border px-4 py-3 text-left transition",
                isActive ? "bg-primary/10 hard-shadow-sm" : "bg-card hover:bg-accent",
              )}
            >
              <span className="font-semibold">{formatBand(band)}</span>
              <span className="text-small text-muted-foreground">{label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-caption text-muted-foreground">
        A drug is not one thing — the same medication at a different dose is doing a different job.
      </p>
    </div>
  );
}