import { appRoute } from "@/lib/app-api/route";
import { LAB_GATE, labHome, type LabHome } from "@/lib/app-api/lab";
import { myLearnState } from "@/lib/app-api/learn-state";

export const runtime = "nodejs";

/** GET /api/app/v1/lab: every experiment (no educator notes), what the runners need, and what this student has run. Behind the Lab switch. */
export const GET = appRoute({ auth: "bearer", gates: [LAB_GATE] }, async (): Promise<LabHome> => labHome(await myLearnState()));
