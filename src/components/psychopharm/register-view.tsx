"use client";

import * as React from "react";

/**
 * The mechanism register, in plain language for students. The reviewer
 * (clinician) register with source evidence lives in the admin editor only —
 * students don't need the internal dual-register concept.
 */
export function RegisterView({ plain, mechanism }: { plain?: string; mechanism?: string }) {
  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-h2">What it does in the brain</h2>
        {plain ? (
          <p className="text-small">{plain}</p>
        ) : mechanism ? (
          <p className="text-small text-muted-foreground">{mechanism}</p>
        ) : (
          <p className="text-small text-muted-foreground">Not covered in our sources.</p>
        )}
      </section>
    </div>
  );
}
