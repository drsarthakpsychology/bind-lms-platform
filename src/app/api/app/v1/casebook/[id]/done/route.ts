import { caseKey } from "@/content/casebook";
import { appRoute } from "@/lib/app-api/route";
import { applyCaseDone, caseDoneSchema, caseOr404, LAB_GATE, writeLab, type LabWrite } from "@/lib/app-api/lab";

export const runtime = "nodejs";

/** POST /api/app/v1/casebook/:id/done { right, total }: one finished play, checked against the case's size; the round level is the server's. */
export const POST = appRoute<{ id: string }>({ auth: "bearer", gates: [LAB_GATE] }, async ({ user, params, body, limitWrite }): Promise<LabWrite> => {
  const c = caseOr404(params.id);
  const input = await body(caseDoneSchema, 500);
  await limitWrite(`app:lab:${user.profile.id}`, 30);
  return writeLab(caseKey(c.id), (s, today) => applyCaseDone(s, c, input.right, input.total, today));
});
