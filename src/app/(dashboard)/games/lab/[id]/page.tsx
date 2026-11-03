import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperimentView } from "@/components/lab/experiment-view";
import { experimentById } from "@/lib/lab/experiments";
import { moduleById } from "@/lib/study";
import { loadLearnState, saveLearnState } from "../../../study/actions";
import { requireLab } from "../gate";

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ recheck?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return { title: experimentById(id)?.title ?? "Lab" };
}

/** /games/lab/[id]: do it, see your data, why, check, reflect. */
export default async function ExperimentPage({ params, searchParams }: Params) {
  const { isAdmin } = await requireLab();
  const { id } = await params;
  const { recheck } = await searchParams;
  const exp = experimentById(id);
  if (!exp) notFound();
  const moduleTitles = Object.fromEntries(exp.related.map((m) => [m, moduleById(m)?.title ?? m]));
  const serverState = await loadLearnState();
  return <ExperimentView exp={exp} moduleTitles={moduleTitles} serverState={serverState} save={saveLearnState} recheck={recheck === "1"} isAdmin={isAdmin} />;
}
