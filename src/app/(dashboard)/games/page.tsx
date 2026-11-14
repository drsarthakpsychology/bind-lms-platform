import type { Metadata } from "next";
import { getFeatureStatus, requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { LearnHome } from "@/components/learn/learn-home";
import { hubNewCases } from "@/lib/cases/hubs";

export const metadata: Metadata = { title: "Games" };

/** /games: only the real games, solo and with others (plan section 8). */
export default async function GamesPage() {
  await requireFeature("learn");
  const [session, labStatus] = await Promise.all([getSession(), getFeatureStatus("lab")]);
  const newCases = await hubNewCases(session.status === "ok" ? session.profile.id : null, "games");
  const isAdmin = session.status === "ok" && session.profile.role === "admin";
  // The Lab link shows only once the Lab is unlocked (admins always see it, to preview).
  const showLab = isAdmin || labStatus === "unlocked";
  return <LearnHome showLab={showLab} newCases={newCases} />;
}
