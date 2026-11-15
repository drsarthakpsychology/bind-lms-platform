import { z } from "zod";
import { saveLearnState } from "@/app/(dashboard)/study/actions";
import { istToday, type LearnState as WebLearnState } from "@/lib/learn/engine";
import { asContractState, myLearnState } from "@/lib/app-api/learn-state";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { LearnStateResult, SaveLearnStateResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/study/state */
export const GET = appRoute({ auth: "bearer", gates: GATES.study }, async (): Promise<LearnStateResult> => ({ state: asContractState(await myLearnState()), today: istToday() }));

const schema = z.object({ state: z.record(z.string(), z.unknown()) });

/**
 * PUT /api/app/v1/study/state: the website's saveLearnState (points clamped,
 * merged with the stored copy so marks never go backwards, server-graded
 * tests kept), then the stored result.
 */
export const PUT = appRoute({ auth: "bearer", gates: GATES.study }, async ({ user, body, limitWrite }): Promise<SaveLearnStateResult> => {
  const input = await body(schema, 220_000);
  await limitWrite(`app:learn:${user.profile.id}`, 120);
  const r = await saveLearnState(input.state as unknown as WebLearnState);
  if (!r.ok) throw new ApiFail(r.retry === false ? "too_large" : "server_error", r.retry === false ? undefined : "Couldn't save. It will be sent again.");
  return { state: asContractState(await myLearnState()), clamped: Boolean(r.clamped) };
});
