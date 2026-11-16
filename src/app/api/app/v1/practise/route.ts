import { practiseHub } from "@/lib/app-api/practise-hub";
import { appRoute } from "@/lib/app-api/route";
import type { PractiseHubData } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/practise: the Practise tab (the website's Practice and Games hubs, Exam Prep and the boards), each tool gated as on the website. */
export const GET = appRoute({ auth: "bearer", gates: { path: "/practise" } }, async ({ user }): Promise<PractiseHubData> => practiseHub(user.profile));
