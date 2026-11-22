import { appRoute } from "@/lib/app-api/route";
import { applyRun, experimentOr404, LAB_GATE, runSchema, writeLab, type LabWrite } from "@/lib/app-api/lab";

export const runtime = "nodejs";

/** POST /api/app/v1/lab/:id/run { numbers }: one finished run, recorded on the server (the website's recordLabRun). */
export const POST = appRoute<{ id: string }>({ auth: "bearer", gates: [LAB_GATE] }, async ({ user, params, body, limitWrite }): Promise<LabWrite> => {
  const e = experimentOr404(params.id);
  const input = await body(runSchema, 4_000);
  await limitWrite(`app:lab:${user.profile.id}`, 30);
  return writeLab(e.id, (s, today) => applyRun(s, e.id, input.numbers, today));
});
