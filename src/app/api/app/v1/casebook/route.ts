import { appRoute } from "@/lib/app-api/route";
import { casebookHome, LAB_GATE, type CasebookHome } from "@/lib/app-api/lab";
import { myLearnState } from "@/lib/app-api/learn-state";

export const runtime = "nodejs";

/** GET /api/app/v1/casebook: every Casebook activity (no source or review notes), module names, and this student's scores with the next round's level. Behind the Lab switch. */
export const GET = appRoute({ auth: "bearer", gates: [LAB_GATE] }, async (): Promise<CasebookHome> => casebookHome(await myLearnState()));
