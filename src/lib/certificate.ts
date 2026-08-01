import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  issuedAt: string; // ISO date
  certificateId: string; // unique slug for the verification URL
}

/**
 * Generate a certificate PDF with a QR code that links to a public
 * verification page (/verify/<certificateId>). Returns the PDF bytes.
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Simple elegant frame.
  page.drawRectangle({ x: 40, y: 40, width: 762, height: 515, borderColor: rgb(0.3, 0.3, 0.3), borderWidth: 2 });
  page.drawText("Certificate of Completion", { x: 300, y: 480, size: 28, font: bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("This certifies that", { x: 350, y: 400, size: 14, font, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.studentName, { x: 240, y: 350, size: 32, font: bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`has successfully completed the course`, { x: 280, y: 300, size: 14, font, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.courseTitle, { x: 300, y: 260, size: 20, font: bold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`Issued ${data.issuedAt}`, { x: 360, y: 180, size: 12, font, color: rgb(0.4, 0.4, 0.4) });

  // QR code → verification URL.
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bind-lms-platform.vercel.app";
  const verifyUrl = `${base}/verify/${data.certificateId}`;
  const qrPng = await QRCode.toBuffer(verifyUrl, { width: 160, margin: 1 });
  const qrImg = await doc.embedPng(qrPng);
  page.drawImage(qrImg, { x: 650, y: 90, width: 140, height: 140 });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
