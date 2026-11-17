import { clinicDb } from "@/lib/clinic/db";
import { appRoute } from "@/lib/app-api/route";
import { idOrNull, sessionSchema } from "@/lib/clinic/schemas";
import { createSession, listSessions } from "@/lib/clinic/admin";
import type { ClinicSession } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/clinic/admin/sessions?cohort=&from=&to=: sessions and day notes (default this week). */
export const GET = appRoute({ auth: "admin" }, async ({ query }) => listSessions(clinicDb(), idOrNull(query.get("cohort")), query.get("from"), query.get("to"), Date.now()));

/** POST /api/app/v1/clinic/admin/sessions: a one-off session (students are told unless notify is false). */
export const POST = appRoute({ auth: "superAdmin", sandbox: true }, async ({ user, body, limitWrite }): Promise<ClinicSession> => {
  const b = await body(sessionSchema, 8192);
  await limitWrite(`app:clinic-admin:${user.profile.id}`, 120);
  return createSession(clinicDb(), b, user.profile.id, Date.now());
});
