import { prepMocks } from "@/lib/app-api/prep";
import { appRoute } from "@/lib/app-api/route";
import type { PrepMocks } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/mock: the timed papers and the student's past attempts (start and hand in through POST /play/prep/mockStart and mockSubmit). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user }): Promise<PrepMocks> => prepMocks(user.profile));
