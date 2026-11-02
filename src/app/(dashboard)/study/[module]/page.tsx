import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { MODULES, liteModule, moduleById } from "@/lib/study";
import { ModuleView } from "@/components/study/course";
import { loadLearnState, saveLearnState } from "../actions";

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module } = await params;
  return { title: moduleById(module)?.title ?? "Study" };
}

/** /study/[module]: the four steps of one module, with one clear next step. */
export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  await requireFeature("learn");
  const { module } = await params;
  const m = moduleById(module);
  if (!m) notFound();
  const i = MODULES.indexOf(m);
  const nm = MODULES[i + 1];
  const serverState = await loadLearnState();
  return <ModuleView module={liteModule(m)} nextModule={nm ? { id: nm.id, title: nm.title, num: nm.num } : undefined} serverState={serverState} save={saveLearnState} />;
}
