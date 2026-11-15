"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatBand } from "@/lib/psychopharm/format";
import type { BandView } from "@/lib/psychopharm/store";
import { OnceHint } from "@/components/help/once-hint";
import { useUiV2 } from "@/components/ds/v2";

/**
 * The dose ladder: the single most important component in the tool (D3).
 *
 * One rung per band, real values from the data. Tapping a rung switches the
 * page to that band; the URL changes so it's shareable and survives refresh.
 * Bands are rendered sorted ascending by range_low (nulls last) for display,
 * but the ?band= URL param keeps the ORIGINAL band_order so it stays stable
 * and shareable. Vertical on mobile, horizontal on desktop.
 */
export function DoseLadder({ drug, bands }: { drug: string; bands: BandView[] }) {
  const v2 = useUiV2();
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
        Dose ranges for {drug} aren&apos;t listed yet.
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
      <OnceHint id="meds-dose-ladder" className="text-eyebrow text-muted-foreground">Tap a dose to see what it does</OnceHint>
      <div className="grid gap-2">
        {sorted.map((band) => {
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
                v2
                  ? "flex min-h-12 w-full items-center justify-between gap-2 rounded-[var(--ds-radius)] border-[1.5px] px-4 py-3 text-left outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring"
                  : "flex w-full items-center justify-between gap-2 rounded-md border-2 border-border px-4 py-3 text-left transition",
                v2
                  ? isActive ? "border-foreground bg-[var(--ds-tint)]" : "border-[var(--ds-card-line)] hover:border-foreground"
                  : isActive ? "bg-primary/10 hard-shadow-sm" : "bg-card hover:bg-accent",
              )}
            >
              <span className="font-semibold">{formatBand(band)}</span>
              <span className="text-small text-muted-foreground">{label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-caption text-muted-foreground">
        A drug is not one thing: the same medication at a different dose is doing a different job.
      </p>
    </div>
  );
}