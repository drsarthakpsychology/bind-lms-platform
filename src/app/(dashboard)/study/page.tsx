import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { MODULES, liteModule } from "@/lib/study";
import { StudyHome } from "@/components/study/course";
import { loadLearnState, saveLearnState } from "./actions";
import { studyOwner } from "./owner";
import { uiV2 } from "@/lib/ui/v2-server";
import { UiV2 } from "@/components/ds/v2";
import { StudyHomeV2 } from "@/components/study/course-v2";

export const metadata: Metadata = { title: "Study" };

/** /study: the course. One "Continue" button and the modules in order. */
export default async function StudyPage() {
  await requireFeature("learn");
  const [serverState, { owner }, v2] = await Promise.all([loadLearnState(), studyOwner(), uiV2()]);
  if (v2) {
    return (
      <UiV2 on>
        <StudyHomeV2 modules={MODULES.map(liteModule)} serverState={serverState} save={saveLearnState} owner={owner} />
      </UiV2>
    );
  }
  return <StudyHome modules={MODULES.map(liteModule)} serverState={serverState} save={saveLearnState} owner={owner} />;
}
