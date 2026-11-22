import { prepInterview } from "@/lib/app-api/prep";
import { appRoute } from "@/lib/app-api/route";
import type { PrepInterview } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/interview: a fresh five-question panel (the website's pickPanel). Check, feedback and save go through POST /play/prep/interviewReveal, interviewFeedback, interviewSave. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user }): Promise<PrepInterview> => prepInterview(user.profile));
