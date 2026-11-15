import { prepHome } from "@/lib/app-api/prep";
import { appRoute } from "@/lib/app-api/route";
import type { PrepHome } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep: Exam Prep's first screen (pick up where you left off, the subjects, the other ways to practise). */
export const GET = appRoute({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user }): Promise<PrepHome> => prepHome(user.profile));
