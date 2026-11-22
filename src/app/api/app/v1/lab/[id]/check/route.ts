import { appRoute } from "@/lib/app-api/route";
import { applyCheck, checkSchema, experimentOr404, gradeChecks, LAB_GATE, writeLab, type LabWrite } from "@/lib/app-api/lab";

export const runtime = "nodejs";

/** POST /api/app/v1/lab/:id/check { answers }: the check questions, graded on the server against the website's keys. */
export const POST = appRoute<{ id: string }>({ auth: "bearer", gates: [LAB_GATE] }, async ({ user, params, body, limitWrite }): Promise<LabWrite> => {
  const e = experimentOr404(params.id);
  const input = await body(checkSchema, 2_000);
  await limitWrite(`app:lab:${user.profile.id}`, 30);
  const { right, total } = gradeChecks(e, input.answers);
  return writeLab(e.id, (s, today) => applyCheck(s, e.id, right, total, today));
});
