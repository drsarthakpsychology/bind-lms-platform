import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEDS, medById } from "@/lib/meds";
import { MedicineView } from "@/components/meds/medicine-view";
import { mechanismOf } from "@/lib/meds/mechanisms";

export function generateStaticParams() {
  return MEDS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: medById(id)?.name ?? "Medicine" };
}

/** One medicine: dose chips, student or clinician view. */
export default async function MedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const med = medById(id);
  if (!med) notFound();
  const related = med.related.map(medById).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
  return <MedicineView med={med} related={related} mech={mechanismOf(med.id)} />;
}
