import { appRoute } from "@/lib/app-api/route";
import { applyReflect, experimentOr404, LAB_GATE, writeLab, type LabWrite } from "@/lib/app-api/lab";

export const runtime = "nodejs";

/** POST /api/app/v1/lab/:id/reflect: the student wrote a reflection (the text stays on the phone, as on the website). */
export const POST = appRoute<{ id: string }>({ auth: "bearer", gates: [LAB_GATE] }, async ({ user, params, limitWrite }): Promise<LabWrite> => {
  const e = experimentOr404(params.id);
  await limitWrite(`app:lab:${user.profile.id}`, 30);
  return writeLab(e.id, (s, today) => applyReflect(s, e.id, today));
});
