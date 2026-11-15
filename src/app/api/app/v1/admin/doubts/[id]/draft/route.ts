import { draftDoubtAnswer } from "@/app/(dashboard)/admin/inbox/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminDraftResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/doubts/:id/draft: an AI draft for the reply box, never posted (the website's draftDoubtAnswer; super admin only, 30 a minute). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ params }): Promise<AdminDraftResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const r = await draftDoubtAnswer(params.id);
  if (r.error || !r.text) throw new ApiFail(/Super Admin/.test(r.error ?? "") ? "forbidden" : /Too many/.test(r.error ?? "") ? "rate_limited" : /gone/.test(r.error ?? "") ? "not_found" : "unavailable", r.error ?? undefined);
  return { text: r.text };
});
