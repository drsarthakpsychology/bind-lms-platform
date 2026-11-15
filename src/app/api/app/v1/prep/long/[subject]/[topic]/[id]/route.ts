import { prepLong } from "@/lib/app-api/prep";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PrepLong } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/long/:subject/:topic/:id: one long answer: the question, the points, the model answer, as the website shows it. */
export const GET = appRoute<{ subject: string; topic: string; id: string }>({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ params }): Promise<PrepLong> => {
  const r = prepLong("question", params.subject, params.topic, params.id);
  if (!r) throw new ApiFail("not_found");
  return r;
});
