import { describe, expect, it } from "vitest";
import { newCertificateId, normaliseCertificateId, STUDIO_ID_RE } from "./id";

describe("certificate IDs", () => {
  it("are VIBHA-XXXX-XXXX-XXXX with no letters that are misread", () => {
    const ids = Array.from({ length: 200 }, () => newCertificateId());
    for (const id of ids) {
      expect(id).toMatch(STUDIO_ID_RE);
      expect(id.slice(6)).not.toMatch(/[ILOU]/);
    }
    expect(new Set(ids).size).toBe(200);
  });
  it("tidies a hand-typed ID", () => {
    expect(normaliseCertificateId(" vibha-7k3m 9q2p-xw4t ")).toBe("VIBHA-7K3M-9Q2P-XW4T");
    expect(normaliseCertificateId("VIBHA7K3M9Q2PXW4T")).toBe("VIBHA-7K3M-9Q2P-XW4T");
    expect(normaliseCertificateId("VIBHA-OIL0-0000-0000")).toBe("VIBHA-0110-0000-0000");
  });
  it("leaves older long IDs and anything else alone", () => {
    const old = "a".repeat(64);
    expect(normaliseCertificateId(old)).toBe(old);
    expect(normaliseCertificateId("PREVIEW")).toBe("PREVIEW");
    expect(normaliseCertificateId("VIBHA-123")).toBe("VIBHA-123");
  });
});
