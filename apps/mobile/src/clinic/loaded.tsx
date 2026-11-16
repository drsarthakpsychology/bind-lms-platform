import type { UseQueryResult } from "@tanstack/react-query";
import * as React from "react";

import { Loaded as AdminLoaded } from "@/admin/kit";
import { ApiFailure } from "@/api/errors";
import { EmptyState, Loaded } from "@/ds";

/** The server has the clinic routes but not its tables yet (503 `unavailable` until the setup runs). */
export const notSetUp = (e: unknown) => e instanceof ApiFailure && e.code === "unavailable";

/**
 * Loading to content for every clinic screen, with one more calm state: the
 * clinic is not switched on yet. Never an error with Try again for that.
 */
export function ClinicLoaded<T>({ q, skeleton, what, admin, children }: { q: UseQueryResult<T>; skeleton?: React.ReactNode; what?: string; admin?: boolean; children: (data: T) => React.ReactNode }) {
  if (q.data === undefined && q.isError && notSetUp(q.error))
    return <EmptyState mood="soon" title="Not switched on yet" body={admin ? "Schedule, attendance, leave and OPD start working here once the clinic is set up." : "Your schedule, attendance and OPD days show here once VIBHA switches them on."} testID="clinic-off" />;
  return admin ? (
    <AdminLoaded q={q} skeleton={skeleton} what={what} soon>
      {children}
    </AdminLoaded>
  ) : (
    <Loaded q={q} skeleton={skeleton} what={what} soon>
      {children}
    </Loaded>
  );
}
