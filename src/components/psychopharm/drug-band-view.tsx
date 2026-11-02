"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { BandDetail } from "./band-detail";
import { RegisterView } from "./register-view";
import { ObserverNotes } from "./observer-notes";
import { OnsetTimeline } from "./onset-timeline";
import type { BandView } from "@/lib/psychopharm/store";
import { Points } from "./points";
import { useExplainView, ViewToggle } from "@/components/learn/view-toggle";

/**
 * The drug page's dynamic body. Reads ?band= so tapping a dose-ladder rung
 * actually switches the page to that band's specific content (D3). Wrapped in
 * Suspense by the server page because useSearchParams requires it.
 *
 * Student view = plain words and what to notice; Clinician view = mechanism,
 * dosing logic, monitoring, interactions. Content is shown as short bullet
 * points, never with book or page references.
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
  const view = useExplainView();
  const clinician = view === "clinician";
  const activeBand = Number(searchParams?.get("band") ?? (bands.length ? 1 : 0));
  const current = bands[activeBand - 1];
  void sourceTitle;
  void onsetKbPage;
  void halfLifePage;

  const labelSections = clinician
    ? [
        { label: "Contraindications", value: contraindications },
        { label: "Interactions", value: interactions },
        { label: "Monitoring", value: monitoring },
        { label: "Overdose", value: overdose },
        { label: "Special populations", value: special_populations },
        { label: "Counselling the patient", value: patient_counseling },
      ]
    : [
        { label: "What to tell the client", value: patient_counseling },
        { label: "Who needs extra care", value: special_populations },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-3">
        <p className="text-small font-semibold">
          {clinician ? "Clinician view: mechanism, dosing logic, monitoring and interactions." : "Student view: plain words, what to notice and what to ask."}
        </p>
        <ViewToggle />
      </div>

      {/* The selected band, first below the ladder. */}
      <BandDetail band={current} register={view} />

      <RegisterView plain={plain} mechanism={mechanism} clinician={clinician} />

      <OnsetTimeline
        onsetTime={onsetTime}
        onsetKb={onsetKb}
        halfLife={halfLife}
        bandOnset={current?.onset}
        register={view}
      />

      <section className="space-y-3">
        <h2 className="text-h2">Commonly used for</h2>
        {common_uses ? <Points text={common_uses} /> : <p className="text-small text-muted-foreground">Not listed yet.</p>}
      </section>

      {dose_range ? (
        <p className="rounded-xl border-2 border-dashed border-foreground/30 px-3 py-2 text-caption text-muted-foreground">
          Doses vary from person to person. The prescriber chooses the dose for each patient, and that is the number that matters.
        </p>
      ) : null}

      {side_effects_common ? (
        <section className="space-y-3">
          <h2 className="text-h2">{clinician ? "Adverse effects" : "What to watch for"}</h2>
          <Points text={side_effects_common} />
          {side_effects_serious ? (
            <div className="rounded-2xl border-2 border-destructive bg-status-alert-bg p-3 text-status-alert-fg">
              <p className="text-caption font-bold uppercase">{clinician ? "Serious / rare" : "Rare but serious: tell the psychiatrist the same day"}</p>
              <Points text={side_effects_serious} className="mt-1" />
            </div>
          ) : null}
        </section>
      ) : null}

      {labelSections.map(({ label, value }) =>
        value ? (
          <details key={label} className="group rounded-2xl border-2 border-foreground bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
              <h2 className="text-h3">{label}</h2>
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180" aria-hidden />
            </summary>
            <div className="border-t-2 border-foreground/10 px-4 py-3">
              <Points text={value} max={14} />
            </div>
          </details>
        ) : null,
      )}

      <details className="group rounded-2xl border-2 border-foreground bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
          <h2 className="text-h3">In session: what to notice, red flags</h2>
          <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-fast ease-snappy group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t-2 border-foreground/10 px-4 py-3">
          <ObserverNotes drugClass={drugClass} />
        </div>
      </details>
    </div>
  );
}
