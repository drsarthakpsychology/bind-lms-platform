import { medById } from "@/lib/meds";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { halfLifeOf, medVisuals } from "@/lib/meds/visuals";
import { medicineStudyLink } from "@/lib/meds/study-access";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { toAppTarget } from "@/lib/app-api/target";
import type { MedicinePage } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/library/medicines/:medId: the whole medicine page as data (the same objects the website page draws). */
export const GET = appRoute<{ medId: string }>({ auth: "bearer", gates: { path: "/practice/medicines" } }, async ({ params }): Promise<MedicinePage> => {
  const med = medById(params.medId);
  if (!med) throw new ApiFail("not_found");
  const related = med.related.map(medById).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
  const study = await medicineStudyLink(med);
  return {
    v: 1,
    med: med as unknown as MedicinePage["med"],
    related,
    mechanism: (mechanismOf(med.id) ?? null) as unknown as MedicinePage["mechanism"],
    visuals: (medVisuals(med.id) ?? null) as unknown as MedicinePage["visuals"],
    halfLife: (halfLifeOf(med.id) ?? null) as unknown as MedicinePage["halfLife"],
    study: study ? { moduleId: study.moduleId, title: study.title, target: toAppTarget(study.href) } : null,
  };
});
