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
};

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

  page.drawText("VIBHA School of Psychology", { x: 280, y: 505, size: 15, font: bold, color: rgb(0.15, 0.15, 0.18) });
  page.drawText("Certificate of Completion", { x: 300, y: 470, size: 26, font: bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("This certifies that", { x: 360, y: 405, size: 13, font, color: rgb(0.45, 0.45, 0.45) });
  page.drawText(data.studentName, { x: 240, y: 355, size: 30, font: bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("has successfully completed", { x: 315, y: 305, size: 13, font, color: rgb(0.45, 0.45, 0.45) });
  page.drawText(data.title, { x: 300, y: 265, size: 18, font: bold, color: rgb(0.1, 0.1, 0.1) });

  page.drawText(`Issued ${data.issuedAt}`, { x: 365, y: 180, size: 11, font, color: rgb(0.45, 0.45, 0.45) });
  page.drawText(`Credential ID ${data.credentialId}`, { x: 320, y: 150, size: 9, font, color: rgb(0.45, 0.45, 0.45) });

  // Signature block (bottom-left) — only when an authorised asset is present.
  if (data.signaturePng) {
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
  page.drawImage(qrImg, { x: 650, y: 90, width: 140, height: 140 });
  page.drawText("Verify", { x: 695, y: 72, size: 9, font: bold, color: rgb(0.3, 0.3, 0.3) });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
