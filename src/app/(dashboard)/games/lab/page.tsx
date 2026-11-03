import type { Metadata } from "next";
import { LabHome } from "@/components/lab/lab-home";
import { loadLearnState, saveLearnState } from "../../study/actions";
import { requireLab } from "./gate";

export const metadata: Metadata = { title: "Psychology Lab" };

/** /games/lab: classic experiments the student runs on themselves. */
export default async function LabPage() {
  await requireLab();
  const serverState = await loadLearnState();
  return <LabHome serverState={serverState} save={saveLearnState} />;
}
