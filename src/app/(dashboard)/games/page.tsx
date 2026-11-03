import type { Metadata } from "next";
import { getFeatureStatus, requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { UNITS } from "@/lib/learn/content";
import { LearnHome } from "@/components/learn/learn-home";
import { MODULES } from "@/lib/study";
import { toReviseModule } from "@/lib/revise/plan";
import { loadLearnState, saveLearnState } from "../study/actions";

export const metadata: Metadata = { title: "Games" };

/** /games: one game to play now, then all the games. */
export default async function GamesPage() {
  await requireFeature("learn");
  const [serverState, session, labStatus] = await Promise.all([loadLearnState(), getSession(), getFeatureStatus("lab")]);
  const isAdmin = session.status === "ok" && session.profile.role === "admin";
  // The Lab card shows only once the Lab is unlocked (admins always see it, to preview).
  const showLab = isAdmin || labStatus === "unlocked";
  return <LearnHome units={UNITS} serverState={serverState} save={saveLearnState} showLab={showLab} reviseModules={MODULES.map(toReviseModule)} />;
}
