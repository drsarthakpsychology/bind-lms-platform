import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { MODULES, liteModule, moduleById } from "@/lib/study";
import { ModuleView } from "@/components/study/course";
import { EXPERIMENTS } from "@/lib/lab/experiments";
import { loadLearnState, saveLearnState } from "../actions";
import { labOpen, studyOwner } from "../owner";

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
  const [serverState, { owner, isAdmin }] = await Promise.all([loadLearnState(), studyOwner()]);
  const lab = await labOpen(isAdmin);
  // Only what the cards need; nothing is sent when the Lab is closed.
  const labLinks = lab ? EXPERIMENTS.filter((x) => x.related.includes(m.id)).map((x) => ({ id: x.id, title: x.title, hook: x.hook, minutes: x.minutes })) : [];
  return (
    <ModuleView
      module={liteModule(m)}
      nextModule={nm ? { id: nm.id, title: nm.title, num: nm.num } : undefined}
      serverState={serverState}
      save={saveLearnState}
      owner={owner}
      labOpen={lab}
      labLinks={labLinks}
    />
  );
}
