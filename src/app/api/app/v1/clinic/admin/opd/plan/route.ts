import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull } from "@/lib/clinic/schemas";
import { discardDraft, getPlan } from "@/lib/clinic/admin";
import type { ClinicPlan } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/opd/plan?cohort=&state=draft|published: the calendar (day x batch with names). */
export const GET = appRoute({ auth: "admin" }, async ({ query }): Promise<ClinicPlan> => {
  const state = query.get("state");
  return getPlan(clinicDb(), idOrNull(query.get("cohort")), state === "draft" || state === "published" ? state : null, Date.now());
});

/** DELETE /api/app/v1/clinic/admin/opd/plan?cohort=: throw the draft away. */
export const DELETE = appRoute({ auth: "superAdmin" }, async ({ user, query, limitWrite }) => {
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return discardDraft(clinicDb(), idOrNull(query.get("cohort")));
});
