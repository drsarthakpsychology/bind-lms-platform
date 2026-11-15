import { approveSubmission } from "@/app/(dashboard)/admin/submissions/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { ReviewResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/submissions/:id/approve (the website's approveSubmission; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<ReviewResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:review:${user.profile.id}`, 120);
  const r = await approveSubmission(params.id);
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "server_error", r.error);
  return { status: "approved" };
});
