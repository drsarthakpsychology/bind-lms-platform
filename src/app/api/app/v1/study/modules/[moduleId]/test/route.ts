import { saveLearnState, submitModuleTest } from "@/app/(dashboard)/study/actions";
import { istToday, recordTest } from "@/lib/learn/engine";
import { recordHistory } from "@/lib/history/server";
import { myLearnState } from "@/lib/app-api/learn-state";
import { findModule, moduleTestReview, testResult } from "@/lib/app-api/study";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import { picksSchema } from "@/lib/app-api/schemas";
import type { ModuleTestResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/**
 * POST /api/app/v1/study/modules/:moduleId/test: the website's
 * submitModuleTest grades the picks and stores the result. The points for the
 * attempt (which the website's browser adds itself) are added through
 * saveLearnState, which clamps them and keeps the server-graded result.
 */
export const POST = appRoute<{ moduleId: string }>({ auth: "bearer", gates: GATES.study }, async ({ user, params, body, limitWrite }): Promise<ModuleTestResult> => {
  const { picks } = await body(picksSchema, 64_000);
  await limitWrite(`app:grade:${user.profile.id}`, 30);
  const m = findModule(params.moduleId);
  const { section, review } = m ? moduleTestReview(m, picks) : { section: null, review: [] };
  if (!m || !section) throw new ApiFail("not_found");
  const before = await myLearnState();
  const r = await submitModuleTest(m.id, picks);
  if (!r.ok || r.total === undefined || r.right === undefined) throw new ApiFail("server_error", "Couldn't grade the test. Try again.");
  // The answer history the website's test runner keeps ("module-test"), then the attempt's points.
  await recordHistory(user.profile.id, "module-test", review.map((q) => ({ item: q.key, correct: q.correct })));
  await saveLearnState(recordTest(before, m.id, r.right, r.total, istToday()));
  return testResult(m, r.right, r.total, review, await myLearnState());
});
