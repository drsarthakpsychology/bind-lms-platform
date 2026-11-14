import "server-only";
import { LineCapStyle, PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Layout } from "./layout";

const hex = (c: string) => {
  const n = Number.parseInt(c.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/**
 * Draw a certificate layout into an A4 landscape PDF: the print twin of
 * svg.tsx (same operations, same coordinates). Words are drawn as outlines,
 * with invisible text laid over the name, title, dates and ID so the PDF can
 * still be searched and copied. `images` maps signature keys to PNG bytes.
 */
export async function renderCertificatePdf(layout: Layout, images: Record<string, Uint8Array | Buffer | null | undefined> = {}, meta: { title?: string; subject?: string } = {}): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.setTitle(meta.title ?? layout.title);
  doc.setAuthor("VIBHA School of Psychology");
  doc.setCreator("VIBHA School of Psychology");
  if (meta.subject) doc.setSubject(meta.subject);
  const page = doc.addPage([layout.w, layout.h]);
  const H = layout.h;
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const embedded = new Map<string, Awaited<ReturnType<typeof doc.embedPng>> | null>();

  for (const op of layout.ops) {
    if (op.k === "rect") {
      page.drawRectangle({
        x: op.x,
        y: H - op.y - op.h,
        width: op.w,
        height: op.h,
        ...(op.fill ? { color: hex(op.fill) } : {}),
        ...(op.stroke ? { borderColor: hex(op.stroke), borderWidth: op.sw ?? 1 } : { borderWidth: 0 }),
      });
    } else if (op.k === "line") {
      page.drawLine({ start: { x: op.x1, y: H - op.y1 }, end: { x: op.x2, y: H - op.y2 }, thickness: op.sw, color: hex(op.stroke) });
    } else if (op.k === "path") {
      // pdf-lib reads SVG paths with y down from the given origin.
      page.drawSvgPath(op.d, { x: 0, y: H, color: hex(op.fill), borderWidth: 0 });
    } else if (op.k === "stroke") {
      page.drawSvgPath(op.d, { x: 0, y: H, borderColor: hex(op.stroke), borderWidth: op.sw, borderLineCap: LineCapStyle.Round });
    } else if (op.k === "image") {
      const bytes = images[op.key];
      if (!bytes) continue;
      if (!embedded.has(op.key)) embedded.set(op.key, await doc.embedPng(bytes).catch(() => null));
      const img = embedded.get(op.key);
      if (!img) continue;
      const s = Math.min(op.w / img.width, op.h / img.height);
      page.drawImage(img, { x: op.x, y: H - op.y - op.h, width: img.width * s, height: img.height * s });
    } else if (op.k === "text") {
      const value = op.value.replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
      if (!value) continue;
      page.drawText(value, { x: op.x, y: H - op.y, size: op.size, font: helv, opacity: 0 });
    }
  }
  return Buffer.from(await doc.save());
}
