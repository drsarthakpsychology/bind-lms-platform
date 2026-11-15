import { prepLong } from "@/lib/app-api/prep";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PrepLong } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/long/:subject/:topic: the topic's questions. */
export const GET = appRoute<{ subject: string; topic: string }>({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ params }): Promise<PrepLong> => {
  const r = prepLong("topic", params.subject, params.topic);
  if (!r) throw new ApiFail("not_found");
  return r;
});
