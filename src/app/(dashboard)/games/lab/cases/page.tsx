import type { Metadata } from "next";
import { CasebookIndex } from "@/components/casebook/casebook-index";
import { CASEBOOK } from "@/content/casebook";
import { moduleById } from "@/lib/study";
import { loadLearnState, saveLearnState } from "../../../study/actions";
import { requireLab } from "../gate";

export const metadata: Metadata = { title: "Casebook" };

/** /games/lab/cases: the full Casebook library with filters (behind the Lab switch). */
export default async function CasebookPage() {
  await requireLab();
  const moduleTitles = Object.fromEntries([...new Set(CASEBOOK.map((c) => c.module))].map((m) => [m, moduleById(m)?.title ?? m]));
  const serverState = await loadLearnState();
  return <CasebookIndex moduleTitles={moduleTitles} serverState={serverState} save={saveLearnState} />;
}
