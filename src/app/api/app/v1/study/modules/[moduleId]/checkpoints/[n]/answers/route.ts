import { saveLearnState } from "@/app/(dashboard)/study/actions";
import { asContractState, myLearnState } from "@/lib/app-api/learn-state";
import { findCheckpoint, findModule, gradeCheckpoint } from "@/lib/app-api/study";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { picksSchema } from "@/lib/app-api/schemas";
import type { CheckpointResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** POST /api/app/v1/study/modules/:moduleId/checkpoints/:n/answers: graded here, from the picks only. */
export const POST = appRoute<{ moduleId: string; n: string }>({ auth: "bearer", gates: GATES.study }, async ({ user, params, body, limitWrite }): Promise<CheckpointResult> => {
  const { picks } = await body(picksSchema, 64_000);
  await limitWrite(`app:grade:${user.profile.id}`, 30);
  const m = findModule(params.moduleId);
  const cp = m && findCheckpoint(m, params.n);
  if (!m || !cp) throw new ApiFail("not_found");
  const r = await gradeCheckpoint(user.profile.id, m, cp, picks, await myLearnState(), saveLearnState);
  const { saved: _saved, ...result } = r;
  void _saved;
  return { ...result, state: asContractState(await myLearnState()) };
});
