"use client";

import * as React from "react";
import { layoutCertificate, type CertificateDoc } from "@/lib/certificates/layout";
import { CertificateSvg } from "@/lib/certificates/svg";

/**
 * The live certificate: the same layout and drawing the PDF uses, so what is
 * on screen is what the student downloads. Loaded on its own (the letter
 * shapes are a big file) so the rest of the studio opens fast.
 */
export default function StudioPreview({ doc, images }: { doc: CertificateDoc; images?: Record<string, string | null> }) {
  const layout = React.useMemo(() => layoutCertificate(doc), [doc]);
  return <CertificateSvg layout={layout} images={images} label={`Certificate preview for ${doc.recipientName || "the student"}`} />;
}
