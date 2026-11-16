import type { Metadata } from "next";

import { PageFrame } from "@/components/ds";
import { OpdPanel } from "@/components/clinic/opd-panel";
import { chooseBatch, loadMyOpd, sendCaseLog } from "../_clinic/bridge";
import { ClinicNotReady } from "../_clinic/not-ready";

export const metadata: Metadata = { title: "OPD cases" };
export const dynamic = "force-dynamic";

/** OPD: my batch, cases done of my total, my OPD days and the case count after each. */
export default async function OpdPage() {
  const res = await loadMyOpd();
  return (
    <PageFrame title="OPD cases">
      {res.ok ? <OpdPanel data={res.data} actions={{ chooseBatch, log: sendCaseLog }} /> : <ClinicNotReady error={res.error} />}
    </PageFrame>
  );
}
