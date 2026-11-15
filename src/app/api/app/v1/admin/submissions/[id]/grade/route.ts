import { z } from "zod";
import { returnFeedback } from "@/app/(dashboard)/admin/submissions/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { ReviewResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

const schema = z.object({ feedback: z.string().max(20_000), score: z.number().min(0).max(1000).nullable() });

/** POST /api/app/v1/admin/submissions/:id/grade: feedback and an optional score; the student sees Graded (the website's returnFeedback; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, body, limitWrite }): Promise<ReviewResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  const { feedback, score } = await body(schema, 64_000);
  await limitWrite(`app:review:${user.profile.id}`, 120);
  const r = await returnFeedback(params.id, feedback, score);
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "server_error", r.error);
  return { status: "returned" };
});
