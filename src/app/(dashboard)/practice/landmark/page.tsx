import { ToolHeader } from "@/components/help/tool-header";
import { HowToStart } from "@/components/help/how-to";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { LandmarkReader } from "./landmark-reader";
import { requireFeature } from "@/lib/flags";
import { orderForViewer } from "@/lib/history/viewer";
import { BackPill } from "@/components/study/back";

export const dynamic = "force-dynamic";

/**
 * /practice/landmark: landmark cases (v5 Part 5.2). Original narratives with
 * the 'what held up' framing and quizzes. Ethics failures framed as the
 * primary lesson where they exist.
 */
export default async function LandmarkPage() {
  await requireFeature("landmark");
  // Answer history (src/lib/history): cases not read yet first, the oldest read last.
  const ids = await orderForViewer("landmark", LANDMARK_CASES.map((c) => c.id));
  const cases = ids.flatMap((id) => LANDMARK_CASES.filter((c) => c.id === id).slice(0, 1));
  return (
    <div className="mx-auto max-w-3xl">
      <BackPill className="mb-4" />
      <ToolHeader title="Landmark cases" tip={{ id: "landmark", steps: ["Read what was believed, then what held up."] }} />

      <div className="mt-6">
        <HowToStart id="landmark">
          <LandmarkReader cases={cases.length ? cases : LANDMARK_CASES} />
        </HowToStart>
      </div>
    </div>
  );
}
