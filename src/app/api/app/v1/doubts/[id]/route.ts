import { doubtThread } from "@/lib/app-api/doubts";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { DoubtThread } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/doubts/:id */
export const GET = appRoute<{ id: string }>({ auth: "bearer", gates: GATES.doubts }, async ({ user, params }): Promise<DoubtThread> => doubtThread(user.profile, params.id));
