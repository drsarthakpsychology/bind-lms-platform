import { describe, expect, it } from "vitest";

import {
  MATERIAL_FORMATS,
  hasFormatRenderer,
  materialRenderers,
  SUBMISSION_TYPES,
} from "./registry";

describe("media registry — the invariant that stops list-with-holes", () => {
  it("every accepted material format has a working renderer for its kind", () => {
    for (const spec of Object.values(MATERIAL_FORMATS)) {
      if (spec.accepted) {
        expect(
          hasFormatRenderer(spec.ext),
          `${spec.ext} is accepted but has no renderer`,
        ).toBe(true);
      }
    }
  });

  it("every accepted format's kind has a renderer registered", () => {
    for (const spec of Object.values(MATERIAL_FORMATS)) {
      if (spec.accepted) {
        expect(
          materialRenderers[spec.kind],
          `${spec.ext} is accepted but kind "${spec.kind}" has no renderer`,
        ).toBe(true);
      }
    }
  });

  it("no rejected format is accepted, and every rejected format explains why", () => {
    for (const spec of Object.values(MATERIAL_FORMATS)) {
      if (!spec.accepted) {
        expect(
          spec.rejectionReason,
          `${spec.ext} is rejected but has no rejectionReason`,
        ).toBeTruthy();
        expect(
          hasFormatRenderer(spec.ext),
          `${spec.ext} is rejected but has a renderer — reconsider the rejection`,
        ).toBe(false);
      }
    }
  });

  it("pptx and .ppt are both rejected (no browser renderer)", () => {
    expect(MATERIAL_FORMATS.pptx.accepted).toBe(false);
    expect(hasFormatRenderer("pptx")).toBe(false);
    expect(MATERIAL_FORMATS.ppt.accepted).toBe(false);
    expect(MATERIAL_FORMATS.ppt.rejectionReason).toBeTruthy();
    expect(MATERIAL_FORMATS.pptx.rejectionReason).toBeTruthy();
  });

  it("every accepted submission type is a working student path", () => {
    for (const [type, spec] of Object.entries(SUBMISSION_TYPES)) {
      expect(spec.accepted, `submission type "${type}" must be accepted or removed`).toBe(true);
      expect(spec.label).toBeTruthy();
    }
  });
});
