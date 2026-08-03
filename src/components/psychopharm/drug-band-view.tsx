"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { BandDetail } from "./band-detail";
import { RegisterView } from "./register-view";
import { ObserverNotes } from "./observer-notes";
import type { BandView } from "@/lib/psychopharm/store";

/**
 * The drug page's dynamic body. Reads ?band= so tapping a dose-ladder rung
 * actually switches the page to that band's specific content (D3). Wrapped in
 * Suspense by the server page because useSearchParams requires it.
 *
 * Register mode (student|clinician) is lifted here so both the band detail
 * (clinician evidence) and the mechanism register share one toggle.
 */
export function DrugBandView({
  generic,
  class: drugClass,
  plain,
  mechanism,
  common_uses,
  dose_range,
  side_effects_common,
  side_effects_serious,
  bands,
}: {
  generic: string;
  class?: string;
  plain?: string;
  mechanism?: string;
  common_uses?: string;
  dose_range?: string;
  side_effects_common?: string;
  side_effects_serious?: string;
  bands: BandView[];
}) {
  const searchParams = useSearchParams();
  const activeBand = Number(searchParams?.get("band") ?? (bands.length ? 1 : 0));
  const current = bands[activeBand - 1];
  const [mode, setMode] = React.useState<"student" | "clinician">("student");

  return (
    <div className="space-y-6">
      {/* The selected band, first below the ladder. */}
      <BandDetail band={current} register={mode} />

      <RegisterView
        plain={plain}
        mechanism={mechanism}
        source_id=""
        source_title=""
        mode={mode}
        onModeChange={setMode}
      />

      <section className="space-y-4 pb-4">
        <h2 className="text-h2">Commonly used in</h2>
        {common_uses ? <p className="text-small">{common_uses}</p> : (
          <p className="text-small text-muted-foreground">Not covered in our sources.</p>
        )}
      </section>

      {dose_range ? (
        <p className="text-caption text-muted-foreground">
          This is what the books describe. Your client&apos;s prescriber chose their dose for reasons specific to them, and that is the number that matters.
        </p>
      ) : null}

      {side_effects_common ? (
        <section className="space-y-4 pb-4">
          <h2 className="text-h2">What to watch for</h2>
          <p className="text-small">{side_effects_common}</p>
          {side_effects_serious ? (
            <p className="text-small">
              <span className="font-semibold">More serious (rare): </span>
              {side_effects_serious}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Phase 2 observer layer */}
      <ObserverNotes drugClass={drugClass} />
    </div>
  );
}