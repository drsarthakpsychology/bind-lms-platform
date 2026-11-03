import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseView } from "@/components/casebook/case-view";
import { caseById } from "@/content/casebook";
import { moduleById } from "@/lib/study";
import { loadLearnState, saveLearnState } from "../../../../study/actions";
import { requireLab } from "../../gate";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: caseById(id)?.title ?? "Casebook" };
}

/** /games/lab/cases/[id]: a textbook-based clinical game (behind the Lab switch). */
export default async function CasePage({ params }: Params) {
  const { isAdmin } = await requireLab();
  const { id } = await params;
  const activity = caseById(id);
  if (!activity) notFound();
  const serverState = await loadLearnState();
  return <CaseView activity={activity} moduleTitle={moduleById(activity.module)?.title ?? activity.module} serverState={serverState} save={saveLearnState} isAdmin={isAdmin} />;
}
