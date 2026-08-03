"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { BandView } from "@/lib/psychopharm/store";

/**
 * Dual-register toggle (part of a page directive): Student View (plain,
 * beginner) vs Clinician View (technical + evidence). Both read the SAME
 * underlying record — only presentation changes, never the evidence.
 */
export function RegisterView({
  generic,
  plain,
  mechanism,
  bands,
  source_id,
  source_title,
}: {
  generic: string;
  plain?: string;
  mechanism?: string;
  bands: BandView[];
  source_id: string;
  source_title: string;
}) {
  const [mode, setMode] = React.useState<"student" | "clinician">("student");

  return (
    <div className="space-y-4">
      {/* Register switch */}
      <div className="inline-flex rounded-md border-2 border-border p-0.5">
        {(["student", "clinician"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "rounded px-3 py-1 text-sm",
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "student" ? "Student view" : "Clinician view"}
          </button>
        ))}
      </div>

      <p className="text-caption text-muted-foreground">
        {mode === "student"
          ? "Plain language, for first contact with a drug."
          : `Clinical register with source evidence. Source: ${source_title} (${source_id}).`}
      </p>

      {/* What it does — two registers */}
      <section>
        <h2 className="text-h2">What it does in the brain</h2>
        {mode === "student" ? (
          plain ? <p className="text-small">{plain}</p> : <p className="text-small text-muted-foreground">{mechanism}</p>
        ) : (
          mechanism ? (
            <>
              <p className="text-small">{mechanism}</p>
              <p className="mt-1 text-caption text-muted-foreground">Source: {source_title}</p>
            </>
          ) : (
            <p className="text-small text-muted-foreground">Not covered in our sources.</p>
          )
        )}
      </section>

      {/* Dose ladder — same bands, clinician adds evidence */}
      <section>
        <h2 className="text-h2">Dose bands</h2>
        <div className="space-y-2">
          {bands.map((b, i) => (
            <div key={i} className="rounded-md border-2 border-border p-3">
              <p className="text-small font-medium">
                {b.low != null || b.high != null ? `${b.low ?? "–"}–${b.high ?? "–"} ${b.unit}` : b.band_label}
                {b.band_type ? <span className="ml-2 text-caption uppercase text-muted-foreground">{b.band_type}</span> : null}
              </p>
              <p className="text-small">{b.band_label}</p>
              {mode === "clinician" && b.evidence ? (
                <div className="mt-1 text-caption text-muted-foreground">
                  <p className="italic">“{b.evidence.quote?.slice(0, 110)}…”</p>
                  <p>
                    {b.evidence.strength && `Strength ${b.evidence.strength} · `}
                    {b.evidence.confidence && `Confidence ${b.evidence.confidence}`}
                    {b.evidence.guideline && ` · ${b.evidence.guideline}`}
                    {b.evidence.source_id && ` · ${b.evidence.source_id} p${b.evidence.page_ref}`}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}