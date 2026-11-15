import { z } from "zod";
import { POST as sctAttempt } from "@/app/api/practice/sct/attempt/route";
import { POST as osceAttempt } from "@/app/api/practice/osce/attempt/route";
import { POST as mseAttempt } from "@/app/api/practice/mse/attempt/route";
import { POST as formulationAttempt } from "@/app/api/practice/formulation/attempt/route";
import { POST as clinicComplete } from "@/app/api/practice/clinic/complete/route";
import { POST as quizAttempt } from "@/app/api/practice/quiz/attempt/route";
import { POST as competency } from "@/app/api/practice/competency/route";
import { forwardJson, type JsonHandler } from "@/lib/app-api/forward";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PractiseRecordKind, PractiseRecordResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** Each record kind and the website route that stores it (its own gate, rate limit and server scoring). */
const ROUTES: Record<PractiseRecordKind, { path: string; run: JsonHandler }> = {
  judgment: { path: "/api/practice/sct/attempt", run: sctAttempt },
  osce: { path: "/api/practice/osce/attempt", run: osceAttempt },
  mse: { path: "/api/practice/mse/attempt", run: mseAttempt },
  formulation: { path: "/api/practice/formulation/attempt", run: formulationAttempt },
  clinic: { path: "/api/practice/clinic/complete", run: clinicComplete as unknown as JsonHandler },
  quiz: { path: "/api/practice/quiz/attempt", run: quizAttempt },
  competency: { path: "/api/practice/competency", run: competency },
};

const body = z.record(z.string(), z.unknown());

/** POST /api/app/v1/practise/records/:kind: a finished practice attempt, stored by the website's own route for it. */
export const POST = appRoute<{ kind: string }>({ auth: "bearer" }, async ({ user, params, body: read, limitWrite }): Promise<PractiseRecordResult> => {
  const route = Object.hasOwn(ROUTES, params.kind) ? ROUTES[params.kind as PractiseRecordKind] : undefined;
  if (!route) throw new ApiFail("not_found");
  const input = await read(body, 128_000);
  await limitWrite(`app:record:${user.profile.id}`, 120);
  return forwardJson(route.run, route.path, input);
});
