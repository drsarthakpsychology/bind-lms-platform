import { prepSmart } from "@/lib/app-api/prep";
import { appRoute } from "@/lib/app-api/route";
import type { PrepSet } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/smart: Smart practice, picked on the server from weak topics, reviews and missed questions. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user }): Promise<PrepSet> => prepSmart(user.profile));
