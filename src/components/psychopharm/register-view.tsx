"use client";

import * as React from "react";
import { Points } from "./points";

/** How the medicine works: plain words for students, mechanism for clinicians. */
export function RegisterView({ plain, mechanism, clinician = false }: { plain?: string; mechanism?: string; clinician?: boolean }) {
  const text = clinician ? (mechanism ?? plain) : (plain ?? mechanism);
  return (
    <section className="space-y-3">
      <h2 className="text-h2">{clinician ? "Mechanism of action" : "What it does in the brain"}</h2>
      {text ? <Points text={text} /> : <p className="text-small text-muted-foreground">Not listed yet.</p>}
    </section>
  );
}
