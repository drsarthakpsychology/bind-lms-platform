import { prepMockResult } from "@/lib/app-api/prep-mock";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PrepMockResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/mock/result/:id: one of the student's own saved mocks, with the full review (the website's /prep/mock/result/:id). */
export const GET = appRoute<{ id: string }>({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user, params }): Promise<PrepMockResult> => {
  const r = await prepMockResult(user.profile.id, params.id);
  if (!r) throw new ApiFail("not_found");
  return r;
});
