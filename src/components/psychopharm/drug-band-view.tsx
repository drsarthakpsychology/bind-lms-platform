"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { BandDetail } from "./band-detail";
import { RegisterView } from "./register-view";
import { ObserverNotes } from "./observer-notes";
import { OnsetTimeline } from "./onset-timeline";
import type { BandView } from "@/lib/psychopharm/store";

/**
 * The drug page's dynamic body. Reads ?band= so tapping a dose-ladder rung
 * actually switches the page to that band's specific content (D3). Wrapped in
 * Suspense by the server page because useSearchParams requires it.
 *
 * Register mode (student|clinician) is lifted here so the band detail, onset
 * timeline, and mechanism register share one toggle.
 */
export function DrugBandView({
  class: drugClass,
  plain,
  mechanism,
  common_uses,
  dose_range,
  side_effects_common,
  side_effects_serious,
  bands,
  onsetTime,
  onsetKb,
  onsetKbPage,
  halfLife,
  halfLifePage,
  sourceTitle,
  contraindications,
  interactions,
  monitoring,
  overdose,
  special_populations,
  patient_counseling,
}: {
  class?: string;
  plain?: string;
  mechanism?: string;
  common_uses?: string;
  dose_range?: string;
  side_effects_common?: string;
  side_effects_serious?: string;
  bands: BandView[];
  onsetTime?: { value: string; source_id: string; page_ref: string };
  onsetKb?: string;
  onsetKbPage?: string;
  halfLife?: string;
  halfLifePage?: string;
  sourceTitle?: string;
  contraindications?: string;
  interactions?: string;
  monitoring?: string;
  overdose?: string;
  special_populations?: string;
  patient_counseling?: string;
}) {
  const searchParams = useSearchParams();
  const activeBand = Number(searchParams?.get("band") ?? (bands.length ? 1 : 0));
  const current = bands[activeBand - 1];
  const [mode, setMode] = React.useState<"student" | "clinician">("student");

  return (
    <div className="space-y-6">
      {/* The selected band, first below the ladder. */}
      <BandDetail band={current} register={mode} />

      {/* Onset + half-life — second question anyone asks. */}
      <OnsetTimeline
        onsetTime={onsetTime}
        onsetKb={onsetKb}
        onsetKbPage={onsetKbPage}
        halfLife={halfLife}
        halfLifePage={halfLifePage}
        bandOnset={current?.onset}
        register={mode}
        sourceTitle={sourceTitle ?? ""}
      />

      <RegisterView
        plain={plain}
        mechanism={mechanism}
        source_id=""
        source_title={sourceTitle ?? ""}
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

      {/* FDA full-label sections (verbatim reference text). Collapsed so the
          band's clinical summary dominates and the page isn't one long scroll
          on a phone; each section is one tap to expand (T32). */}
      {[
        { label: "Contraindications", value: contraindications },
        { label: "Interactions", value: interactions },
        { label: "Monitoring", value: monitoring },
        { label: "Overdose", value: overdose },
        { label: "Special populations", value: special_populations },
        { label: "Patient counseling", value: patient_counseling },
      ].map(({ label, value }) =>
        value ? (
          <details key={label} className="group rounded-md border-2 border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <h2 className="text-h2">{label}</h2>
              <ChevronDown
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="border-t border-border px-4 py-3 text-small">{value}</p>
          </details>
        ) : null,
      )}

      {/* Phase 2 observer layer */}
      <ObserverNotes drugClass={drugClass} />
    </div>
  );
}