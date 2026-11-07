import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { appUrl as liveAppUrl, cleanAppUrl } from "@/lib/app-url";

export type CredentialPdfData = {
  studentName: string;
  title: string; // achievement / course title
  issuedAt: string; // ISO date
  credentialId: string;
  /** Optional authorised signature PNG bytes. */
  signaturePng?: Buffer | null;
  /** Permanent institutional roll number (optional). */
  rollNumber?: string | null;
  /** Line under the name (default "has successfully completed"). */
  lead?: string | null;
  /** Optional short description under the title (custom certificates). */
  description?: string | null;
  /** Big heading (default "Certificate of Completion"). */
  heading?: string | null;
  /** Printed signatory under the signature line (custom certificates), e.g. Kavya Bothra, COO. */
  signatory?: { name: string; role: string } | null;
};

/** Split text into lines that fit `maxWidth` at `size`. */
function wrap(text: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** pdf-lib's standard fonts can't draw characters outside WinAnsi; swap the common ones. */
function winAnsi(s: string): string {
  return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/…/g, "...").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
}

/**
 * Generate an official certificate PDF. The verification QR points at the
 * permanent public page. If a signature asset is present it is embedded; a
 * certificate is never generated without one (the caller enforces that).
 */
export async function generateCredentialPdf(data: CredentialPdfData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({ x: 40, y: 40, width: 762, height: 515, borderColor: rgb(0.25, 0.25, 0.28), borderWidth: 2 });

  // Every line is centred, so names and titles of any length sit right.
  const W = 842;
  const centre = (text: string, y: number, size: number, f: typeof font, color = rgb(0.1, 0.1, 0.1)) => {
    const t = winAnsi(text);
    let sz = size;
    while (sz > 8 && f.widthOfTextAtSize(t, sz) > 700) sz -= 1;
    page.drawText(t, { x: (W - f.widthOfTextAtSize(t, sz)) / 2, y, size: sz, font: f, color });
  };
  const grey = rgb(0.45, 0.45, 0.45);
  centre("VIBHA School of Psychology", 505, 15, bold, rgb(0.15, 0.15, 0.18));
  centre(data.heading || "Certificate of Completion", 468, 26, bold);
  centre("This certifies that", 410, 13, font, grey);
  centre(data.studentName, 362, 30, bold);
  centre(data.lead || "has successfully completed", 318, 13, font, grey);
  centre(data.title, 282, 18, bold);
  let y = 256;
  if (data.description) {
    // Kept narrower than the page so it never runs under the QR code; a
    // longer paragraph steps down in size (up to 7 lines at 9pt, ~650 chars).
    const text = winAnsi(data.description);
    const steps = [
      { size: 11, gap: 14, max: 5 },
      { size: 10, gap: 12.5, max: 6 },
      { size: 9, gap: 11.5, max: 7 },
    ];
    let pick = steps[steps.length - 1];
    let lines = wrap(text, font, pick.size, 480);
    for (const st of steps) {
      const l = wrap(text, font, st.size, 480);
      if (l.length <= st.max) {
        pick = st;
        lines = l;
        break;
      }
    }
    for (const line of lines.slice(0, pick.max)) {
      centre(line, y, pick.size, font, rgb(0.3, 0.3, 0.3));
      y -= pick.gap;
    }
  }
  centre(`Issued ${data.issuedAt}`, 172, 11, font, grey);
  centre(`Credential ID ${data.credentialId}`, 150, 9, font, grey);
  if (data.rollNumber) centre(`Roll Number ${data.rollNumber}`, 130, 9, font, grey);

  // Signature block (bottom-left).
  if (data.signatory) {
    // Named signatory: optional signature image above a line, then name + role.
    if (data.signaturePng) {
      try {
        const sig = await doc.embedPng(data.signaturePng);
        page.drawImage(sig, { x: 90, y: 112, width: 150, height: 50 });
      } catch {
        /* corrupt signature asset: render without it */
      }
    }
    page.drawLine({ start: { x: 90, y: 108 }, end: { x: 260, y: 108 }, thickness: 1, color: rgb(0.25, 0.25, 0.28) });
    page.drawText(winAnsi(data.signatory.name), { x: 90, y: 92, size: 12, font: bold, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(winAnsi(`${data.signatory.role}, VIBHA School of Psychology`), { x: 90, y: 77, size: 9, font, color: grey });
  } else if (data.signaturePng) {
    // Only when an authorised asset is present.
    try {
      const sig = await doc.embedPng(data.signaturePng);
      page.drawImage(sig, { x: 90, y: 90, width: 160, height: 60 });
      page.drawText("Authorised signature", { x: 90, y: 70, size: 9, font, color: rgb(0.45, 0.45, 0.45) });
    } catch {
      /* corrupt signature asset: render without it */
    }
  }

  // QR → permanent verification URL.
  const base = cleanAppUrl(process.env.NEXT_PUBLIC_SITE_URL, liveAppUrl());
  const verifyUrl = `${base}/verify/${data.credentialId}`;
  const qrPng = await QRCode.toBuffer(verifyUrl, { width: 160, margin: 1 });
  const qrImg = await doc.embedPng(qrPng);
  page.drawImage(qrImg, { x: 670, y: 80, width: 115, height: 115 });
  page.drawText("Verify", { x: 713, y: 66, size: 9, font: bold, color: rgb(0.3, 0.3, 0.3) });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
