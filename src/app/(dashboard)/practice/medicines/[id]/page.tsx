import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEDS, medById } from "@/lib/meds";
import { MedicineView } from "@/components/meds/medicine-view";
import { MedicinePage as MedicinePageV2 } from "@/components/play/medicine-page";
import { uiV2 } from "@/lib/ui/v2-server";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { halfLifeOf, medVisuals } from "@/lib/meds/visuals";
import { medicineStudyLink } from "@/lib/meds/study-access";

export function generateStaticParams() {
  return MEDS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: medById(id)?.name ?? "Medicine" };
}

/** (src/lib/meds/study-access.ts, shared with the mobile app.) */
async function studyLink(med: Parameters<typeof medicineStudyLink>[0]): Promise<{ href: string; title: string } | null> {
  const link = await medicineStudyLink(med);
  return link ? { href: link.href, title: link.title } : null;
}

/** One medicine: practical facts first, "How it works" last (#how-it-works). */
export default async function MedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const med = medById(id);
  if (!med) notFound();
  const related = med.related.map(medById).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
  if (await uiV2()) return <MedicinePageV2 med={med} related={related} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} half={halfLifeOf(med.id)} study={await studyLink(med)} />;
  return <MedicineView med={med} related={related} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} half={halfLifeOf(med.id)} study={await studyLink(med)} />;
}
