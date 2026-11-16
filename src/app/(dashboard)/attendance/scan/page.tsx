import type { Metadata } from "next";

import { PageFrame } from "@/components/ds";
import { ScanPanel } from "@/components/clinic/scan-panel";
import { scan } from "../../_clinic/bridge";

export const metadata: Metadata = { title: "Scan attendance" };

/** Scan the class QR code (in on arrival, out when leaving), or type its code. */
export default function ScanPage() {
  return (
    <PageFrame title="Scan attendance" width="reading">
      <ScanPanel scan={scan} />
    </PageFrame>
  );
}
