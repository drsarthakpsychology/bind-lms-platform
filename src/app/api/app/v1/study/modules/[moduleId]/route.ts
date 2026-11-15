import { myLearnState } from "@/lib/app-api/learn-state";
import { findModule, moduleDetail } from "@/lib/app-api/study";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { ModuleDetail } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/modules/:moduleId */
export const GET = appRoute<{ moduleId: string }>({ auth: "bearer", gates: GATES.study }, async ({ params }): Promise<ModuleDetail> => {
  const m = findModule(params.moduleId);
  if (!m) throw new ApiFail("not_found");
  return moduleDetail(m, await myLearnState());
});
