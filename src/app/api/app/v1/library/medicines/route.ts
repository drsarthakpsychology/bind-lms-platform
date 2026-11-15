import { medicineList } from "@/lib/app-api/library";
import { appRoute } from "@/lib/app-api/route";
import type { MedicineList } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/library/medicines?q=&group= : every medicine profile (or the matches), for the list and instant search on the phone. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/practice/medicines" } }, async ({ query }): Promise<MedicineList> => medicineList(query.get("q"), query.get("group") ?? query.get("class")));
