import { referenceHome } from "@/lib/app-api/library";
import { appRoute } from "@/lib/app-api/route";
import type { ReferenceHome } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/library/reference : the psychopharmacology reference (every medicine, and grouped by receptor). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/tools/psychopharm" } }, async (): Promise<ReferenceHome> => referenceHome());
