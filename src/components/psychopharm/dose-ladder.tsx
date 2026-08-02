"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { BandView } from "@/lib/psychopharm/store";

/**
 * The dose ladder — the single most important component in the tool (D3).
 *
 * One rung per band, real values from the data. Tapping a rung switches the
 * page to that band; the URL changes so it's shareable and survives refresh.
 * Bands the sources don't describe would render as gaps (honest, G3).
 * Vertical on mobile, horizontal on desktop.
 */
export function DoseLadder({ drug, bands }: { drug: string; bands: BandView[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = Number(searchParams?.get("band") ?? (bands.length ? 1 : 0));

  function select(band: BandView) {
    // band_order is 1-indexed in the data; URL band= matches it.
    const params = new URLSearchParams(searchParams ?? new URLSearchParams());
    params.set("band", String(bandOrderOf(band, bands)));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (!bands.length) {
    return (
      <p className="text-small text-muted-foreground">
        Our sources don&apos;t describe dose ranges for {drug} yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-eyebrow text-muted-foreground">Tap a dose to see what it does</p>
      <div className="grid gap-2">
        {bands.map((band, idx) => {
          const order = idx + 1;
          const isActive = order === active;
          const label = band.band_label || "band";
          return (
            <button
              key={idx}
              type="button"
              onClick={() => select(band)}
              aria-pressed={isActive}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md border-2 border-border px-4 py-3 text-left transition",
                isActive ? "bg-primary/10 hard-shadow-sm" : "bg-card hover:bg-accent",
              )}
            >
              <span className="font-semibold">
                {band.low != null || band.high != null
                  ? `${band.low ?? "–"}–${band.high ?? "–"} ${band.unit}`
                  : "not specified"}
              </span>
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

function bandOrderOf(band: BandView, all: BandView[]): number {
  // order = index+1, matching the band_order in the data.
  return all.indexOf(band) + 1;
}