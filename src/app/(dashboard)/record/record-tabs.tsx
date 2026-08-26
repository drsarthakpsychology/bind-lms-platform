"use client";

import * as React from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

/**
 * /record — one record-keeping task at a time (T21 progressive forms).
 * The supervision log and the weekly check-in are both "records about your
 * training", but showing both full forms on one scroll forces the user past a
 * long first form to reach the second. A segmented switcher reveals ONE at a
 * time — both stay reachable, neither competes for the viewport.
 */
export function RecordTabs({
  supervision,
  checkin,
  supervisionEnabled = true,
  checkinEnabled = true,
}: {
  supervision: React.ReactNode;
  checkin: React.ReactNode;
  supervisionEnabled?: boolean;
  checkinEnabled?: boolean;
}) {
  // Only show the tab(s) the admin has actually switched on — supervision and
  // check-in are independently toggleable features that share this page.
  const options = [
    ...(supervisionEnabled ? [{ value: "supervision" as const, label: "Supervision log" }] : []),
    ...(checkinEnabled ? [{ value: "checkin" as const, label: "Weekly check-in" }] : []),
  ];
  const defaultTab = supervisionEnabled ? "supervision" : "checkin";
  const [tab, setTab] = React.useState<"supervision" | "checkin">(defaultTab);

  return (
    <div className="space-y-4">
      <SegmentedControl
        value={tab}
        onValueChange={setTab}
        label="What to record"
        options={options}
      />

      {tab === "supervision" && supervisionEnabled ? (
        <section aria-label="Supervision log" className="space-y-3">
          <p className="text-small text-muted-foreground">
            Log real-world contact hours with your supervisor. Tag a competency and the hour
            feeds your Skills Passport; ask for sign-off when ready.
          </p>
          {supervision}
        </section>
      ) : checkinEnabled ? (
        <section aria-label="Weekly check-in" className="space-y-3">
          <p className="text-small text-muted-foreground">
            Thirty seconds. Not clinical, not graded — just a read on the cohort so faculty
            can adjust. Faculty see trends only, never who said what.
          </p>
          {checkin}
        </section>
      ) : null}
    </div>
  );
}
