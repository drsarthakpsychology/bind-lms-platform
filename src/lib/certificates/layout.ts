import QRCode from "qrcode";
import { type CertKind, KIND_DEFAULTS, longDate } from "./kinds";
import { cleanText, drawable, fitSize, measure, textPath, wrap, type FontKey } from "./text";

/**
 * The certificate layout engine. One function turns the certificate's data
 * into a list of drawing operations on an A4 landscape page (842 x 595 pt,
 * origin top left, y down). The browser preview (svg.tsx) and the PDF
 * (pdf.ts) both draw this list, so what the admin sees is what the student
 * downloads.
 */

export const PAGE = { w: 842, h: 595 } as const;

export const COLORS = {
  ink: "#111111",
  blue: "#1d44d8",
  lime: "#cdf24b",
  muted: "#4d4d4d",
  soft: "#8a8a8a",
  hair: "#d9d9d9",
  white: "#ffffff",
  paper: "#ffffff",
} as const;

export type Signatory = { name: string; role: string; /** Key into the images passed to the renderer. */ signature?: string | null };

export type CertificateDoc = {
  kind: CertKind;
  /** Small line at the top, e.g. "Certificate of Completion". */
  heading?: string | null;
  /** Line above the name. */
  lead?: string | null;
  recipientName: string;
  /** Line between the name and the title. */
  connector?: string | null;
  title: string;
  /** The citation or description paragraph. */
  citation?: string | null;
  course?: string | null;
  module?: string | null;
  /** yyyy-mm-dd */
  issuedOn: string;
  /** yyyy-mm-dd, the last day it is valid. */
  expiresOn?: string | null;
  signatories: Signatory[];
  credentialId: string;
  /** Full verify address the QR code opens. */
  verifyUrl: string;
};

export type Op =
  | { k: "rect"; x: number; y: number; w: number; h: number; fill?: string; stroke?: string; sw?: number }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; sw: number }
  | { k: "path"; d: string; fill: string; role?: string }
  /** An open stroked path with round caps and joins (the brand mark). */
  | { k: "stroke"; d: string; stroke: string; sw: number }
  | { k: "image"; x: number; y: number; w: number; h: number; key: string }
  /** Invisible text over drawn words so the PDF can be searched and copied. */
  | { k: "text"; x: number; y: number; size: number; value: string };

export type Layout = { w: number; h: number; ops: Op[]; title: string };

const SPINE_W = 214;
const LEFT = SPINE_W + 58; // 272
const RIGHT = PAGE.w - 58; // 784
const MAIN_W = RIGHT - LEFT; // 512

type TextOpts = { font: FontKey; size: number; x: number; y: number; color: string; tracking?: number; align?: "left" | "right"; role?: string; searchable?: boolean };

function text(ops: Op[], raw: string, o: TextOpts): number {
  const value = drawable(raw, o.font);
  if (!value) return 0;
  const w = measure(value, o.font, o.size, o.tracking ?? 0);
  const x = o.align === "right" ? o.x - w : o.x;
  const d = textPath(value, o.font, o.size, x, o.y, o.tracking ?? 0);
  if (d) ops.push({ k: "path", d, fill: o.color, role: o.role });
  if (o.searchable) ops.push({ k: "text", x, y: o.y, size: o.size, value });
  return w;
}

/** Short address printed under the QR code, e.g. "vibhapsychology.com/verify". */
export function shortVerify(verifyUrl: string): { host: string; id: string } {
  const m = /^https?:\/\/([^/]+)(\/verify)\/(.+)$/.exec(verifyUrl);
  if (!m) return { host: verifyUrl, id: "" };
  return { host: `${m[1].replace(/^www\./, "")}${m[2]}`, id: decodeURIComponent(m[3]) };
}

/** QR code modules as one path of squares. */
function qrPath(data: string, x: number, y: number, size: number): string {
  const qr = QRCode.create(data, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const cell = size / n;
  let d = "";
  for (let r = 0; r < n; r++) {
    let c = 0;
    while (c < n) {
      if (!qr.modules.get(r, c)) {
        c++;
        continue;
      }
      // Merge a run of dark modules in a row into one rectangle.
      let e = c;
      while (e + 1 < n && qr.modules.get(r, e + 1)) e++;
      const x0 = x + c * cell;
      const y0 = y + r * cell;
      const x1 = x + (e + 1) * cell;
      const y1 = y0 + cell;
      const f = (v: number) => Math.round(v * 100) / 100;
      d += `M${f(x0)} ${f(y0)}H${f(x1)}V${f(y1)}H${f(x0)}Z`;
      c = e + 1;
    }
  }
  return d;
}

/**
 * Lay the certificate out. Long names shrink to fit one line; the title
 * wraps to two lines; the citation steps down in size so the whole page
 * always fits above the signatures.
 */
export function layoutCertificate(input: CertificateDoc): Layout {
  const def = KIND_DEFAULTS[input.kind];
  const ops: Op[] = [];
  const heading = cleanText(input.heading) || def.heading;
  const lead = cleanText(input.lead) || def.lead;
  const connector = cleanText(input.connector) || def.connector;
  const name = cleanText(input.recipientName) || "Recipient name";
  const title = cleanText(input.title) || def.titleHint;
  const citation = cleanText(input.citation);
  const courseLine = [cleanText(input.course), cleanText(input.module)].filter(Boolean).join("  •  ");
  const provisional = input.kind === "provisional";

  // Paper and the brand spine.
  ops.push({ k: "rect", x: 0, y: 0, w: PAGE.w, h: PAGE.h, fill: COLORS.paper });
  ops.push({ k: "rect", x: 0, y: 0, w: SPINE_W, h: PAGE.h, fill: COLORS.blue });
  ops.push({ k: "rect", x: SPINE_W, y: 0, w: 6, h: PAGE.h, fill: COLORS.ink });

  // Wordmark: VIBHA in the heavy wide cut, the school line in the pixel face.
  const SX = 36;
  text(ops, "VIBHA", { font: "wordmark", size: 38, x: SX - 1.5, y: 84, color: COLORS.white, tracking: -0.5, role: "wordmark" });
  text(ops, "SCHOOL OF PSYCHOLOGY", { font: "pixel", size: 7.2, x: SX, y: 100, color: COLORS.lime, tracking: 0.55 });

  // The VIBHA mark (the observation eye), large and quiet in the spine.
  const mk = 3.2;
  const mx = (SPINE_W - 40 * mk) / 2;
  const my = 196;
  const P = (x: number, y: number) => `${Math.round((mx + x * mk) * 100) / 100} ${Math.round((my + y * mk) * 100) / 100}`;
  ops.push({ k: "stroke", d: `M${P(8, 8)}L${P(20, 34)}M${P(20, 34)}L${P(32, 8)}`, stroke: "#3a5ce4", sw: 5 * mk });
  const [ccx, ccy] = [mx + 20 * mk, my + 17 * mk];
  const disc = (r: number) => `M${ccx - r} ${ccy}A${r} ${r} 0 1 0 ${ccx + r} ${ccy}A${r} ${r} 0 1 0 ${ccx - r} ${ccy}Z`;
  // A ring of spine blue separates the pupil from the V, as the ink ring does in the logo.
  ops.push({ k: "path", d: disc(7 * mk), fill: COLORS.blue });
  ops.push({ k: "path", d: disc(4.6 * mk), fill: "#3a5ce4" });

  // Kind marker in the spine.
  ops.push({ k: "rect", x: SX, y: 150, w: 10, h: 10, fill: COLORS.lime });
  text(ops, def.label.toUpperCase(), { font: "pixel", size: 7.2, x: SX + 18, y: 158.5, color: COLORS.white, tracking: 0.55 });

  // Verification: QR on a white tile, the short address and the ID.
  const qrSize = 104;
  const qrX = SX;
  const qrY = PAGE.h - 56 - 62 - qrSize;
  ops.push({ k: "rect", x: qrX - 8, y: qrY - 8, w: qrSize + 16, h: qrSize + 16, fill: COLORS.white });
  ops.push({ k: "path", d: qrPath(input.verifyUrl, qrX, qrY, qrSize), fill: COLORS.ink, role: "qr" });
  const sv = shortVerify(input.verifyUrl);
  text(ops, "VERIFY THIS CERTIFICATE", { font: "pixel", size: 6.6, x: SX, y: qrY + qrSize + 30, color: COLORS.lime, tracking: 0.5 });
  text(ops, sv.host, { font: "sans", size: 8.6, x: SX, y: qrY + qrSize + 44, color: COLORS.white, searchable: true });
  const idSize = fitSize(input.credentialId, "sansBold", 9.4, SPINE_W - SX - 16, 6);
  text(ops, input.credentialId, { font: "sansBold", size: idSize, x: SX, y: qrY + qrSize + 58, color: COLORS.white, tracking: 0.3, searchable: true, role: "id" });

  // Main column.
  let y = 78;
  text(ops, heading.toUpperCase(), { font: "pixel", size: 8.4, x: LEFT, y, color: COLORS.blue, tracking: 0.8, role: "heading" });
  if (provisional) {
    const label = input.expiresOn ? `PROVISIONAL  •  VALID UNTIL ${longDate(input.expiresOn).toUpperCase()}` : "PROVISIONAL";
    const lw = measure(drawable(label, "pixel"), "pixel", 7, 0.7);
    const bx = RIGHT - lw - 20;
    ops.push({ k: "rect", x: bx, y: y - 15, w: lw + 20, h: 22, fill: COLORS.lime, stroke: COLORS.ink, sw: 1.2 });
    text(ops, label, { font: "pixel", size: 7, x: bx + 10, y: y + 0.5, color: COLORS.ink, tracking: 0.7, role: "provisional" });
  }

  y = 152;
  text(ops, lead, { font: "serifItalic", size: 14, x: LEFT, y, color: COLORS.muted });

  // The name: the focal point. One line, shrinking for long names; a very long
  // name takes two lines rather than becoming small.
  const nameText = drawable(name, "serifDisplay");
  let nameSize = fitSize(nameText, "serifDisplay", 50, MAIN_W, 27);
  let nameLines = [nameText];
  if (measure(nameText, "serifDisplay", nameSize) > MAIN_W) {
    nameSize = 32;
    nameLines = wrap(nameText, "serifDisplay", nameSize, MAIN_W);
    while ((nameLines.length > 2 || nameLines.some((l) => measure(l, "serifDisplay", nameSize) > MAIN_W)) && nameSize > 12) {
      nameSize -= 1;
      nameLines = wrap(nameText, "serifDisplay", nameSize, MAIN_W);
    }
  }
  y += 18 + nameSize * 0.92;
  nameLines.forEach((line, i) => {
    if (i > 0) y += nameSize * 1.12;
    text(ops, line, { font: "serifDisplay", size: nameSize, x: LEFT - nameSize * 0.02, y, color: COLORS.ink, searchable: true, role: "name" });
  });

  // The closed measure: an ink rule ending in a lime square.
  y += 18;
  ops.push({ k: "line", x1: LEFT, y1: y, x2: RIGHT - 9, y2: y, stroke: COLORS.ink, sw: 1.4 });
  ops.push({ k: "rect", x: RIGHT - 9, y: y - 4.5, w: 9, h: 9, fill: COLORS.lime, stroke: COLORS.ink, sw: 1.2 });

  y += 34;
  text(ops, connector, { font: "serifItalic", size: 13, x: LEFT, y, color: COLORS.muted });

  const titleText = drawable(title, "sansBold");
  let titleSize = 23;
  let titleLines = wrap(titleText, "sansBold", titleSize, MAIN_W);
  while (titleLines.length > 2 && titleSize > 15) {
    titleSize -= 1;
    titleLines = wrap(titleText, "sansBold", titleSize, MAIN_W);
  }
  y += 8;
  for (const line of titleLines.slice(0, 2)) {
    y += titleSize * 1.2;
    text(ops, line, { font: "sansBold", size: titleSize, x: LEFT, y, color: COLORS.ink, searchable: true, role: "title" });
  }
  if (courseLine) {
    y += 18;
    text(ops, courseLine, { font: "sans", size: 10, x: LEFT, y, color: COLORS.muted, role: "course" });
  }

  // Citation: steps down so the page always fits above the signatures.
  const SIG_LINE = PAGE.h - 92;
  if (citation) {
    const room = SIG_LINE - 58 - (y + 14);
    const steps = [
      { size: 12, gap: 17.5 },
      { size: 11, gap: 16 },
      { size: 10, gap: 14.5 },
      { size: 9, gap: 13 },
    ];
    let pick = steps[steps.length - 1];
    let lines = wrap(drawable(citation, "serif"), "serif", pick.size, Math.min(MAIN_W, 470));
    for (const st of steps) {
      const l = wrap(drawable(citation, "serif"), "serif", st.size, Math.min(MAIN_W, 470));
      if (l.length * st.gap <= room) {
        pick = st;
        lines = l;
        break;
      }
    }
    const max = Math.max(1, Math.floor(room / pick.gap));
    y += 14;
    lines.slice(0, max).forEach((line, i) => {
      y += pick.gap;
      const last = i === max - 1 && lines.length > max;
      text(ops, last ? `${line.replace(/\s+\S*$/, "")}...` : line, { font: "serif", size: pick.size, x: LEFT, y, color: "#2b2b2b", role: "citation" });
    });
  }

  // Signatures, left to right, each over a rule with name and role.
  const sigs = input.signatories.filter((s) => cleanText(s.name)).slice(0, 3);
  const colW = sigs.length >= 3 ? 150 : 172;
  const gapX = 24;
  sigs.forEach((s, i) => {
    const x = LEFT + i * (colW + gapX);
    if (s.signature) ops.push({ k: "image", x, y: SIG_LINE - 46, w: 132, h: 42, key: s.signature });
    ops.push({ k: "line", x1: x, y1: SIG_LINE, x2: x + colW, y2: SIG_LINE, stroke: COLORS.ink, sw: 0.9 });
    const nm = drawable(cleanText(s.name), "sansBold");
    text(ops, nm, { font: "sansBold", size: fitSize(nm, "sansBold", 10.5, colW, 7.5), x, y: SIG_LINE + 16, color: COLORS.ink, role: "signatory" });
    const rl = drawable(cleanText(s.role), "sans");
    if (rl) text(ops, rl, { font: "sans", size: fitSize(rl, "sans", 8.6, colW, 6.5), x, y: SIG_LINE + 29, color: COLORS.muted });
  });

  // Dates, right aligned on the signature line.
  const dates: Array<[string, string]> = [["ISSUED", longDate(input.issuedOn)]];
  if (input.expiresOn) dates.push([provisional ? "PROVISIONAL UNTIL" : "VALID UNTIL", longDate(input.expiresOn)]);
  const dateTop = sigs.length >= 3 ? SIG_LINE + 52 : SIG_LINE - (dates.length - 1) * 30;
  // With three signatories the right edge is taken: dates go under them, in a row.
  if (sigs.length >= 3) {
    let dx = LEFT;
    for (const [label, value] of dates) {
      const w1 = text(ops, `${label}  `, { font: "pixel", size: 6.4, x: dx, y: dateTop, color: COLORS.soft, tracking: 0.7 });
      const w2 = text(ops, value, { font: "sansBold", size: 8.6, x: dx + w1, y: dateTop, color: COLORS.ink, searchable: true });
      dx += w1 + w2 + 24;
    }
  } else {
    dates.forEach(([label, value], i) => {
      const yy = dateTop + i * 30;
      text(ops, label, { font: "pixel", size: 6.4, x: RIGHT, y: yy + 2, color: COLORS.soft, tracking: 0.7, align: "right" });
      text(ops, value, { font: "sansBold", size: 10.5, x: RIGHT, y: yy + 16, color: COLORS.ink, align: "right", searchable: true, role: "date" });
    });
  }

  return { w: PAGE.w, h: PAGE.h, ops, title: `${heading}: ${name}` };
}
