"use client";

import * as React from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

/**
 * Dual-register view: Student (plain) vs Clinician (technical + evidence).
 * Both read the SAME underlying record — only presentation changes. The
 * register mode is lifted up (controlled by the parent) so the band detail
 * panel can show the clinician evidence block when in clinician mode.
 *
 * The dose list itself lives in the DoseLadder (single source of truth); this
 * component renders the mechanism in two registers only.
 */
export function RegisterView({
  plain,
  mechanism,
  source_id,
  source_title,
  mode,
  onModeChange,
}: {
  plain?: string;
  mechanism?: string;
  source_id: string;
  source_title: string;
  mode: "student" | "clinician";
  onModeChange: (m: "student" | "clinician") => void;
}) {
  return (
    <div className="space-y-4">
      <SegmentedControl
        value={mode}
        onValueChange={onModeChange}
        label="Viewing register"
        options={[
          { value: "student", label: "Student view" },
          { value: "clinician", label: "Clinician view" },
        ]}
      />

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
    </div>
  );
}