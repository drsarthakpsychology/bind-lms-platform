import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull, reflectionSchema } from "@/lib/clinic/schemas";
import { getMyReflections, saveReflection } from "@/lib/clinic/reflections";
import type { ClinicMyReflections, ClinicReflectionSaved } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/reflections: my reflections and the replies, newest day first. */
export const GET = appRoute({ auth: "bearer" }, async ({ user, query }): Promise<ClinicMyReflections> => getMyReflections(clinicDb(), user.profile.id, idOrNull(query.get("cohort"))));

/** PUT /api/app/v1/clinic/reflections { assignmentId, saw?, learned?, ask? }: write or change mine for an OPD day. */
export const PUT = appRoute({ auth: "bearer" }, async ({ user, body, limitWrite }): Promise<ClinicReflectionSaved> => {
  const b = await body(reflectionSchema, 8192);
  await limitWrite(`app:clinic:${user.profile.id}`, 30);
  return saveReflection(clinicDb(), user.profile.id, b, Date.now());
});
