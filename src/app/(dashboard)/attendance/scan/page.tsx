import type { Metadata } from "next";

import { PageFrame } from "@/components/ds";
import { ScanPanel } from "@/components/clinic/scan-panel";
import { scanConfirm, scanIdentify } from "../../_clinic/bridge";

export const metadata: Metadata = { title: "Scan attendance" };

/** Scan the class QR code or type its code, then choose Mark IN or Mark OUT and confirm. */
export default function ScanPage() {
  return (
    <PageFrame title="Scan attendance" width="reading">
      <ScanPanel identify={scanIdentify} confirm={scanConfirm} />
    </PageFrame>
  );
}
