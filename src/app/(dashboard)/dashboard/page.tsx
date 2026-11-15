import * as React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getSession } from "@/lib/auth/session";
import { isAdminLike } from "@/lib/auth/guards";
import { VIEW_MODE_COOKIE } from "../view-mode-constants";

import { readFlags } from "@/lib/flags";
import { loadHomeModel } from "@/lib/home/model";
import { LEGAL } from "@/lib/legal-constants";
import { HomeV2, HomeV2Skeleton } from "./home-v2";
import { uiV2For } from "@/lib/ui/v2";
import { HomeBody } from "./home-view";
import { RefreshOnSave } from "@/components/save/refresh-on-save";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";

/**
 * Home (plan section 8): one Continue card, today's goal, and the three
 * strongest and three weakest topics. Nothing else competes. Everything that
 * used to live here is one tap away in the menu: this week's lectures and
 * assignments in Lectures, practice tools in Practice, level and rank in
 * Leaderboard, help in Doubts.
 */
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ off?: string }> }) {
  const session = await getSession();
  // ?off=1: the layout sent the student here from a section switched off for them.
  const sectionOff = (await searchParams).off === "1";
  if (session.status !== "ok") return leaveWithoutSession(session);
  // New design (ui_v2): its own loading shape (hero and three rows) while the data comes.
  if (uiV2For(await readFlags(), session.profile.role)) {
    return (
      <React.Suspense fallback={<HomeV2Skeleton />}>
        <HomeData v2 sectionOff={sectionOff} />
      </React.Suspense>
    );
  }
  return <HomeData v2={false} />;
}

async function HomeData({ v2, sectionOff = false }: { v2: boolean; sectionOff?: boolean }) {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);
  const { profile } = session;

  const cookieStore = await cookies();
  const viewingAsStudent = cookieStore.get(VIEW_MODE_COOKIE)?.value === "student";
  // Both admin roles start on the admin side (the shell already shows them the admin menu).
  if (isAdminLike(profile) && !viewingAsStudent) redirect("/admin");

  // An admin previewing the student side sees a full student's Home (the
  // roster is full, and the shell shows the full menu), and every published
  // course, like the Lectures page shows them.
  const preview = profile.role === "admin" && viewingAsStudent;
  // The same model the mobile app's Home is built from (src/lib/home/model.ts).
  const { step, goal, quests, strengths, studyOpen, progress, dateLine, welcomeBack, allDone, upNext } = await loadHomeModel(profile, { preview });

  if (v2) {
    return (
      <>
        <RefreshOnSave kinds={["learn", "complete", "progress"]} />
        <HomeV2
          adminPreview={viewingAsStudent && profile.role === "admin"}
          welcomeBack={welcomeBack}
          dateLine={dateLine}
          step={step}
          progress={progress}
          allDone={allDone}
          goal={goal}
          quests={quests}
          upNext={upNext}
          sectionOff={sectionOff}
        />
      </>
    );
  }

  return (
    <>
    {/* A mark made just before coming here may still be saving: show it once it lands. */}
    <RefreshOnSave kinds={["learn", "complete", "progress"]} />
    <HomeBody
      adminPreview={viewingAsStudent && profile.role === "admin"}
      welcomeBack={welcomeBack}
      step={step}
      goal={goal}
      quests={quests}
      strengths={studyOpen ? strengths : null}
      whatsappHref={`https://wa.me/${LEGAL.phone.replace(/[^\d]/g, "")}`}
    />
    </>
  );
}
