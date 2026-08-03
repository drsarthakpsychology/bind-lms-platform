"use client";

import * as React from "react";
import { formatBand, formatDoseAndFrequency } from "@/lib/psychopharm/format";
import type { BandView } from "@/lib/psychopharm/store";

/**
 * The currently selected band's detail — the first thing below the ladder.
 * Tapping a rung in the ladder changes the active band, which changes this
 * panel. Renders only what the data actually has; never pads.
 */
export function BandDetail({
  band,
  register,
}: {
  band?: BandView;
  register: "student" | "clinician";
}) {
  if (!band) return null;

  const hasContent =
    band.primary_purpose ||
    band.why_this_dose ||
    (band.side_effects ?? []).length ||
    (band.observation_prompts ?? []).length ||
    (band.population_notes ?? []).length ||
    band.what_changes_going_up ||
    band.what_changes_going_down;

  return (
    <section className="space-y-4 rounded-md border-2 border-border p-4">
      <header>
        <h2 className="text-h1 text-base">{formatDoseAndFrequency(band)}</h2>
        <p className="text-caption uppercase text-muted-foreground">{band.band_label}</p>
        {band.band_type ? (
          <p className="text-caption text-muted-foreground">{band.band_type}</p>
        ) : null}
      </header>

      {!hasContent ? (
        <p className="text-small text-muted-foreground">
          Our sources describe this range but not what changes across it.
        </p>
      ) : null}

      {band.primary_purpose ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">What this dose is for</p>
          <p className="text-small">{band.primary_purpose}</p>
        </div>
      ) : null}

      {band.why_this_dose ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Why this range</p>
          <p className="text-small">{band.why_this_dose}</p>
        </div>
      ) : null}

      {band.what_changes_going_up ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Going up from here</p>
          <p className="text-small">{band.what_changes_going_up}</p>
        </div>
      ) : null}

      {band.what_changes_going_down ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Going down from here</p>
          <p className="text-small">{band.what_changes_going_down}</p>
        </div>
      ) : null}

      {band.onset ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Onset at this dose</p>
          <p className="text-small">{band.onset.value}</p>
        </div>
      ) : null}

      {band.side_effects && band.side_effects.length ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Side effects at this dose</p>
          {band.side_effects.map((s, i) => (
            <div key={i} className="mt-1">
              <p className="text-small font-medium capitalize">{s.label.replace("_", " ")}</p>
              <ul className="list-disc pl-5 text-small">
                {s.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
              {s.time_course ? <p className="text-caption text-muted-foreground">{s.time_course}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {band.population_notes && band.population_notes.length ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">Special notes</p>
          <ul className="list-disc pl-5 text-small">
            {band.population_notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {band.observation_prompts && band.observation_prompts.length ? (
        <div>
          <p className="text-caption font-semibold uppercase text-muted-foreground">
            At this dose, ask specifically about
          </p>
          <ul className="list-disc pl-5 text-small">
            {band.observation_prompts.map((p, i) => (
              <li key={i}>
                <span className="font-medium">{p.prompt}</span>
                {p.rationale ? <span className="text-muted-foreground"> — {p.rationale}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {register === "clinician" && band.evidence ? (
        <div className="rounded-md border-2 border-dashed border-border p-3 text-caption text-muted-foreground">
          <p className="italic">“{band.evidence.quote?.slice(0, 140)}…”</p>
          <p>
            {band.evidence.strength && `Strength ${band.evidence.strength} · `}
            {band.evidence.confidence && `Confidence ${band.evidence.confidence}`}
            {band.evidence.guideline && ` · ${band.evidence.guideline}`}
            {band.evidence.source_id && ` · ${band.evidence.source_id} p${band.evidence.page_ref}`}
          </p>
        </div>
      ) : null}
    </section>
  );
}