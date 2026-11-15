import { prepTopicSet } from "@/lib/app-api/prep";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PrepSet } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/subjects/:subject/topics/:topic?set=N: a set of questions (no answers; grade with POST /play/prep/check). */
export const GET = appRoute<{ subject: string; topic: string }>({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user, params, query }): Promise<PrepSet> => {
  const n = Number(query.get("set"));
  const r = await prepTopicSet(user.profile, params.subject, params.topic.slice(0, 80), Number.isInteger(n) && n > 0 ? n : null);
  if (!r) throw new ApiFail("not_found");
  return r;
});
