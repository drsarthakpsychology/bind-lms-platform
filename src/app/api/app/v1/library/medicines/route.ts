import { GROUPS, MEDS, medIndex } from "@/lib/meds";
import { appRoute } from "@/lib/app-api/route";
import type { MedicineList } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/library/medicines: every medicine profile, for the list and instant search on the phone. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/practice/medicines" } }, async (): Promise<MedicineList> => ({
  v: 1,
  groups: [...GROUPS],
  rows: medIndex().map((r) => {
    // The usual dose (the one the medicine page opens on), as the website list's third column.
    const m = MEDS.find((x) => x.id === r.id);
    return { ...r, dose: m?.doses[m.defaultDose]?.amount ?? "" };
  }),
}));
