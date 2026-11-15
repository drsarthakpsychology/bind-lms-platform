import { prepSubject } from "@/lib/app-api/prep";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { PrepSubjectDetail } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/prep/subjects/:subject: the subject's topics with how far the student is. */
export const GET = appRoute<{ subject: string }>({ auth: "bearer", gates: { path: "/prep", flag: "learn" } }, async ({ user, params }): Promise<PrepSubjectDetail> => {
  const r = await prepSubject(user.profile, params.subject);
  if (!r) throw new ApiFail("not_found");
  return r;
});
