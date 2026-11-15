import { myLearnState } from "@/lib/app-api/learn-state";
import { checkpointContent, findCheckpoint, findModule } from "@/lib/app-api/study";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { CheckpointContent } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/modules/:moduleId/checkpoints/:n: this sitting's questions, without answers. */
export const GET = appRoute<{ moduleId: string; n: string }>({ auth: "bearer", gates: GATES.study }, async ({ user, params }): Promise<CheckpointContent> => {
  const m = findModule(params.moduleId);
  const cp = m && findCheckpoint(m, params.n);
  if (!m || !cp) throw new ApiFail("not_found");
  return checkpointContent(user.profile.id, m, cp, await myLearnState());
});
