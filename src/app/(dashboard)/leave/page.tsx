import type { Metadata } from "next";

import { PageFrame } from "@/components/ds";
import { LeavePanel } from "@/components/clinic/leave-panel";
import { addDays } from "@/components/clinic/format";
import type { ClinicMySession } from "@/lib/clinic/types";
import { cancelLeave, loadMyLeave, loadWeek, requestEarly, requestLeave } from "../_clinic/bridge";
import { ClinicNotReady } from "../_clinic/not-ready";

export const metadata: Metadata = { title: "Leave" };
export const dynamic = "force-dynamic";

/** Leaves left, ask for leave or to leave early, and my requests. */
export default async function LeavePage() {
  const [leave, w1] = await Promise.all([loadMyLeave(), loadWeek()]);
  if (!leave.ok) {
    return (
      <PageFrame title="Leave">
        <ClinicNotReady error={leave.error} />
      </PageFrame>
    );
  }
  // The next four weeks of sessions to pick from.
  const more = w1.ok ? await Promise.all([1, 2, 3].map((i) => loadWeek(addDays(w1.data.from, 7 * i)))) : [];
  const upcoming: ClinicMySession[] = [w1, ...more].flatMap((w) => (w.ok ? w.data.days.flatMap((d) => d.sessions) : []));
  return (
    <PageFrame title="Leave">
      <LeavePanel data={leave.data} upcoming={upcoming} actions={{ request: requestLeave, early: requestEarly, cancel: cancelLeave }} />
    </PageFrame>
  );
}
