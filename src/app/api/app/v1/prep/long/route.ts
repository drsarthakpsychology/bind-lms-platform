import { prepLong } from "@/lib/app-api/prep";
import { appRoute } from "@/lib/app-api/route";
import type { PrepLong } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/long: long answers by subject. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async (): Promise<PrepLong> => prepLong("home")!);
