import { z } from "zod";
import { answerPractice } from "@/app/(dashboard)/study/map/actions";
import { appRoute, GATES } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { bankItem } from "@/lib/learn/model/topics";
import type { MapAnswerResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({
  item: z.string().min(1).max(20),
  choice: z.union([z.number().int().min(0).max(10), z.boolean(), z.literal("skip")]),
  ms: z.number().int().min(0).max(3_600_000).optional(),
});

/** POST /api/app/v1/study/map/practice/answers: one answer, graded on the server and saved to your map (the website's answerPractice). Staff answers are graded, not saved. */
export const POST = appRoute({ auth: "bearer", gates: GATES.studyMap }, async ({ user, body, limitWrite }): Promise<MapAnswerResult> => {
  const input = await body(schema, 2_000);
  await limitWrite(`app:mapanswer:${user.profile.id}`, 120);
  if (!bankItem(input.item)) throw new ApiFail("not_found", "That question is not in the bank.");
  return answerPractice(input);
});
