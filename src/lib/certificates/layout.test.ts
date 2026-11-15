import { describe, expect, it } from "vitest";
import { layoutCertificate, PAGE, shortVerify, type CertificateDoc, type Op } from "./layout";
import { cleanText, drawable, fitSize, measure, placePath, wrap } from "./text";

const doc: CertificateDoc = {
  kind: "completion",
  recipientName: "Aanya Raghavendran",
  title: "Foundations of Clinical Psychology",
  citation: "For completing all twelve modules.",
  issuedOn: "2026-11-14",
  signatories: [{ name: "Kavya Bothra", role: "COO" }, { name: "Dr. Sarthak Dave", role: "MBBS, MD (Psychiatry)" }],
  credentialId: "VIBHA-7K3M-9Q2P-XW4T",
  verifyUrl: "https://vibhapsychology.com/verify/VIBHA-7K3M-9Q2P-XW4T",
};

/** Every coordinate in a path, as [x, y] pairs (absolute M L Q C; H and V handled). */
function bounds(ops: Op[], role?: string) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const op of ops) {
    if (op.k !== "path" || (role && op.role !== role)) continue;
    const tokens = op.d.match(/[MLHVQCZA]|-?\d+(?:\.\d+)?/g) ?? [];
    let cmd = "", axis = 0;
    for (const t of tokens) {
      if (/[A-Z]/.test(t)) { cmd = t; axis = 0; continue; }
      if (cmd === "A") continue;
      const v = Number(t);
      const isX = cmd === "H" ? true : cmd === "V" ? false : axis === 0;
      if (cmd !== "H" && cmd !== "V") axis = 1 - axis;
      if (isX) { minX = Math.min(minX, v); maxX = Math.max(maxX, v); } else { minY = Math.min(minY, v); maxY = Math.max(maxY, v); }
    }
  }
  return { minX, maxX, minY, maxY };
}

describe("layoutCertificate", () => {
  it("is A4 landscape and keeps everything on the page", () => {
    const l = layoutCertificate(doc);
    expect([l.w, l.h]).toEqual([842, 595]);
    const b = bounds(l.ops);
    expect(b.minX).toBeGreaterThanOrEqual(0);
    expect(b.maxX).toBeLessThanOrEqual(PAGE.w);
    expect(b.minY).toBeGreaterThanOrEqual(0);
    expect(b.maxY).toBeLessThanOrEqual(PAGE.h);
  });
  it("shrinks a long name onto one line inside the margins", () => {
    const l = layoutCertificate({ ...doc, recipientName: "Mohammed Siddiqui Venkataraman Iyer" });
    expect(l.ops.filter((o) => o.k === "path" && o.role === "name")).toHaveLength(1);
    expect(bounds(l.ops, "name").maxX).toBeLessThanOrEqual(790);
  });
  it("gives a very long name two lines, still inside the margins and above the signatures", () => {
    const l = layoutCertificate({ ...doc, recipientName: "Venkata Subramaniam Ananthapadmanabhan Krishnamoorthy Iyer", citation: "A long line of praise for careful clinical work. ".repeat(30) });
    expect(l.ops.filter((o) => o.k === "path" && o.role === "name")).toHaveLength(2);
    expect(bounds(l.ops, "name").maxX).toBeLessThanOrEqual(790);
    expect(bounds(l.ops, "citation").maxY).toBeLessThan(PAGE.h - 92 - 40);
  });
  it("never lets a long citation run into the signatures", () => {
    const l = layoutCertificate({ ...doc, citation: "A long line of praise for careful clinical work. ".repeat(30) });
    const b = bounds(l.ops, "citation");
    expect(b.maxY).toBeLessThan(PAGE.h - 92 - 40);
    expect(b.maxX).toBeLessThanOrEqual(790);
  });
  it("marks a provisional certificate, and only that kind", () => {
    const p = layoutCertificate({ ...doc, kind: "provisional", expiresOn: "2026-12-31" });
    expect(p.ops.some((o) => o.k === "path" && o.role === "provisional")).toBe(true);
    expect(layoutCertificate(doc).ops.some((o) => o.k === "path" && o.role === "provisional")).toBe(false);
    expect(p.ops.some((o) => o.k === "text" && o.value === "31 December 2026")).toBe(true);
  });
  it("carries the QR code, the ID and searchable text", () => {
    const l = layoutCertificate(doc);
    expect(l.ops.some((o) => o.k === "path" && o.role === "qr" && o.d.length > 500)).toBe(true);
    const texts = l.ops.filter((o) => o.k === "text").map((o) => (o.k === "text" ? o.value : ""));
    expect(texts).toContain("VIBHA-7K3M-9Q2P-XW4T");
    expect(texts).toContain("Aanya Raghavendran");
    expect(texts).toContain("vibhapsychology.com/verify");
  });
  it("draws up to three signatories", () => {
    const three = layoutCertificate({ ...doc, signatories: [...doc.signatories, { name: "Priya Shah", role: "Lead" }, { name: "Extra", role: "X" }] });
    expect(three.ops.filter((o) => o.k === "path" && o.role === "signatory")).toHaveLength(3);
  });
  it("uses the default wording of each kind", () => {
    expect(layoutCertificate({ ...doc, kind: "recognition" }).title).toMatch(/^Special Recognition/);
    expect(layoutCertificate({ ...doc, heading: "Certificate of Merit" }).title).toMatch(/^Certificate of Merit/);
  });
});

describe("text helpers", () => {
  it("removes long dashes and odd spaces", () => {
    expect(cleanText(" A \u2014 B \u2013 C\u00a0 D ")).toBe("A - B - C D");
  });
  it("keeps accents the font has and drops what it cannot draw", () => {
    expect(drawable("José आन्या", "serifDisplay")).toBe("José ");
    expect(drawable("Łukasz", "sans")).toBe("ukasz");
  });
  it("measures, wraps and fits", () => {
    expect(measure("AAAA", "sans", 10)).toBeCloseTo(measure("AA", "sans", 10) * 2, 5);
    const lines = wrap("one two three four five six seven eight nine ten", "serif", 12, 120);
    expect(lines.length).toBeGreaterThan(1);
    for (const l of lines) expect(measure(l, "serif", 12)).toBeLessThanOrEqual(120);
    expect(fitSize("A very long name indeed, far too long", "serifDisplay", 50, 200, 20)).toBeLessThan(50);
  });
  it("moves a glyph path into place", () => {
    expect(placePath("M0 0L100 -200H50V10Z", 10, 20, 0.5)).toBe("M10 20L60 -80H35V25Z");
  });
  it("reads the short verify address", () => {
    expect(shortVerify("https://www.vibhapsychology.com/verify/VIBHA-1")).toEqual({ host: "vibhapsychology.com/verify", id: "VIBHA-1" });
  });
});
