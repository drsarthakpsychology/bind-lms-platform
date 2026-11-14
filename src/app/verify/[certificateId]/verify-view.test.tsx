import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { certStatus, expiryInstant } from "@/lib/certificates/kinds";
import { VerifyNotFound, VerifyView, type VerifyFacts } from "./verify-view";

const facts = (o: Partial<VerifyFacts>): VerifyFacts => ({
  status: "valid",
  name: "Aanya Rao",
  title: "Foundations of Clinical Psychology",
  what: "Certificate",
  paragraph: "For finishing the programme.",
  credentialId: "VIBHA-7K3M-9Q2P-XW4T",
  issuedOn: "2026-11-14",
  expiresOn: null,
  revokedOn: null,
  replacedBy: null,
  ...o,
});
const html = (f: VerifyFacts) => renderToStaticMarkup(<VerifyView facts={f} />);

describe("/verify states", () => {
  it("valid", () => {
    const h = html(facts({}));
    expect(h).toContain('data-status="valid"');
    expect(h).toContain("Verified");
    expect(h).toContain("14 November 2026");
    expect(h).toContain("VIBHA-7K3M-9Q2P-XW4T");
    expect(h).toContain("For finishing the programme.");
  });
  it("provisional until a date", () => {
    const h = html(facts({ status: "provisional", what: "Provisional certificate", expiresOn: "2026-12-31" }));
    expect(h).toContain("Provisional");
    expect(h).toContain("It is valid until 31 December 2026.");
    expect(h).toContain("Valid until");
    expect(h).not.toContain("Verified");
  });
  it("expired, worked out from the date alone", () => {
    const row = { status: "issued", kind: "provisional", expires_at: new Date(expiryInstant("2026-12-31")).toISOString() };
    const status = certStatus(row, new Date("2027-01-01T00:00:00+05:30"));
    const h = html(facts({ status, expiresOn: "2026-12-31" }));
    expect(h).toContain('data-status="expired"');
    expect(h).toContain("ran out on 31 December 2026");
    expect(h).toContain("Ran out");
    expect(h).not.toContain("Verified");
  });
  it("revoked: says so, hides the paragraph and never shows the reason", () => {
    const h = html(facts({ status: "revoked", revokedOn: "2026-11-20" }));
    expect(h).toContain("Revoked");
    expect(h).toContain("withdrew this certificate on 20 November 2026");
    expect(h).not.toContain("For finishing the programme.");
    expect(h).not.toContain("Verified");
  });
  it("revoked and replaced links to the new certificate", () => {
    const h = html(facts({ status: "revoked", revokedOn: "2026-11-20", replacedBy: "VIBHA-AAAA-BBBB-CCCC" }));
    expect(h).toContain('href="/verify/VIBHA-AAAA-BBBB-CCCC"');
  });
  it("not issued and not found", () => {
    expect(html(facts({ status: "not_issued", issuedOn: null }))).toContain("has not been issued yet");
    expect(renderToStaticMarkup(<VerifyNotFound />)).toContain("can&#x27;t find this certificate");
  });
  it("shows the certificate image only when one is passed", () => {
    expect(renderToStaticMarkup(<VerifyView facts={facts({})} certificate={<svg data-cert />} />)).toContain("data-cert");
    expect(html(facts({}))).not.toContain("data-cert");
  });
});
