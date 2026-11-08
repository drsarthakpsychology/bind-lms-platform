import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MEDS, medById } from "@/lib/meds";
import { MedicineView } from "@/components/meds/medicine-view";
import { mechanismOf } from "@/lib/meds/mechanisms";
import { halfLifeOf, medVisuals } from "@/lib/meds/visuals";
import { studyModuleFor } from "@/lib/meds/study-link";
import { moduleById } from "@/lib/study";
import { readFlags } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";

export function generateStaticParams() {
  return MEDS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: medById(id)?.name ?? "Medicine" };
}

/**
 * The Study module that teaches this medicine, when Study is open for this
 * person (switch on, a full account, Study not switched off for them).
 */
async function studyLink(med: Parameters<typeof studyModuleFor>[0]): Promise<{ href: string; title: string } | null> {
  const [flags, session] = await Promise.all([readFlags(), getSession()]);
  if (flags.learn !== "unlocked" || session.status !== "ok" || session.profile.scope === "lectures_only") return null;
  const m = moduleById(studyModuleFor(med)) ?? moduleById("medicine-profiles");
  if (!m) return null;
  const blocked = session.profile.role === "student" ? await loadMyBlocks(session.profile.id) : [];
  return blockedBy(`/study/${m.id}`, blocked) ? null : { href: `/study/${m.id}`, title: m.title };
}

/** One medicine: practical facts first, "How it works" last (#how-it-works). */
export default async function MedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const med = medById(id);
  if (!med) notFound();
  const related = med.related.map(medById).filter((m): m is NonNullable<typeof m> => Boolean(m)).map((m) => ({ id: m.id, name: m.name, cls: m.cls }));
  return <MedicineView med={med} related={related} mech={mechanismOf(med.id)} visuals={medVisuals(med.id)} half={halfLifeOf(med.id)} study={await studyLink(med)} />;
}
