import type { Metadata } from "next";
import { getFeatureStatus, requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { MODULES } from "@/lib/study";
import { toReviseModule } from "@/lib/revise/plan";
import { ReviseHome } from "@/components/revise/revise-home";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "Revise" };

/** /games/revise: what to revisit today, from every schedule in one list. */
export default async function RevisePage() {
  await requireFeature("learn");
  const [serverState, session, labStatus] = await Promise.all([loadLearnState(), getSession(), getFeatureStatus("lab")]);
  const isAdmin = session.status === "ok" && session.profile.role === "admin";
  // Lab re-checks are listed only when the Lab is open (same rule as the Lab card on /games).
  const lab = isAdmin || labStatus === "unlocked";
  return <ReviseHome modules={MODULES.map(toReviseModule)} serverState={serverState} save={saveLearnState} lab={lab} />;
}
