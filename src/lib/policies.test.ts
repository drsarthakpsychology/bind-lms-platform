import { describe, expect, it, vi } from "vitest";

// policies.ts reads the filesystem via a server-only module — the guard throws
// outside React server; intercept it (the content access is what we test).
vi.mock("server-only", () => ({}));

import { LEGAL } from "./legal-constants";
import { cleanHeadingText, getPolicies, getPolicy, headingSlug } from "./policies";

const ROUTE_SLUGS = [
  "terms",
  "refund",
  "fees",
  "examination",
  "certificate",
  "privacy",
  "cookies",
  "delivery",
  "code-of-conduct",
  "confidentiality",
  "attendance",
  "grievance",
  "disclaimer",
  "terms-of-use",
];

describe("headingSlug — the anchor rule (`/policies/refund#2-3-the-only-exception`)", () => {
  it("turns a dotted clause number into a hyphenated id", () => {
    expect(headingSlug("2.3 The only exception")).toBe("2-3-the-only-exception");
  });

  it("strips em-dashes and punctuation, collapses whitespace", () => {
    expect(headingSlug("What the certificate is — and what it is not")).toBe(
      "what-the-certificate-is-and-what-it-is-not",
    );
    expect(headingSlug("Why we process your data, and on what basis")).toBe(
      "why-we-process-your-data-and-on-what-basis",
    );
  });

  it("cleans inline markdown before slugging", () => {
    expect(cleanHeadingText("**1.7 Intellectual property**")).toBe("1.7 Intellectual property");
    expect(cleanHeadingText("[Terms](/policies/terms)")).toBe("Terms");
  });
});

describe("policies content access", () => {
  it("loads all 14 policies with the brief's slugs, sorted by order", () => {
    const all = getPolicies();
    expect(all.map((p) => p.meta.slug)).toEqual(ROUTE_SLUGS);
    expect(all.map((p) => p.meta.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it("returns null for an unknown slug (caller notFound())", () => {
    expect(getPolicy("nope")).toBeNull();
  });

  it("preserves the verbatim clause heading and substitutes placeholders", () => {
    const refund = getPolicy("refund");
    expect(refund).not.toBeNull();
    expect(refund!.body).toContain("## 2.3 The only exception");
    // lastUpdated resolves through legal-constants (currently the TODO token).
    expect(refund!.meta.lastUpdated).toBe(LEGAL.effectiveDate);
  });

  it("resolves the address placeholder where the copy carries it", () => {
    // terms (1.1 + 1.17) and grievance (12.4) both name the registered address.
    expect(getPolicy("terms")!.body).toContain(LEGAL.registeredAddress);
    expect(getPolicy("grievance")!.body).toContain(LEGAL.registeredAddress);
    // Still the TODO token — visibly unresolved, never a fabricated value.
    expect(LEGAL.registeredAddress).toBe("[REGISTERED_ADDRESS]");
  });

  it("extracts the on-this-page headings with matching anchor ids", () => {
    const terms = getPolicy("terms");
    const twoDotThree = terms!.headings.find((h) => h.id === "2-3-the-only-exception");
    // The first three headings are 1.1/1.2/1.3; the rest follow in order.
    expect(terms!.headings[0]).toMatchObject({ id: "1-1-about-these-terms", level: 2 });
    expect(twoDotThree).toBeUndefined(); // refund has 2.3, terms does not
    const refund = getPolicy("refund");
    expect(refund!.headings.some((h) => h.id === "2-3-the-only-exception")).toBe(true);
  });

  it("privacy and cookie policies carry their tables into the body", () => {
    expect(getPolicy("privacy")!.body).toContain("| Purpose | Examples |");
    expect(getPolicy("cookies")!.body).toContain("| Strictly necessary |");
  });
});
