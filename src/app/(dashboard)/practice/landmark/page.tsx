import { ToolHeader } from "@/components/help/tool-header";
import { HowToStart } from "@/components/help/how-to";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { LandmarkReader } from "./landmark-reader";
import { requireFeature } from "@/lib/flags";
import { caseContext } from "@/lib/cases/server";
import { BackPill } from "@/components/study/back";

export const dynamic = "force-dynamic";

/**
 * /practice/landmark: landmark cases (v5 Part 5.2). Original narratives with
 * the 'what held up' framing and quizzes. Ethics failures framed as the
 * primary lesson where they exist.
 */
export default async function LandmarkPage() {
  await requireFeature("landmark");
  // Fresh-case order (src/lib/cases/fresh.ts): the case left open first, new this week, new, read ones last.
  const ctx = await caseContext("landmark", LANDMARK_CASES.map((c) => c.id), "landmark");
  return (
    <div className="mx-auto max-w-3xl">
      <BackPill className="mb-4" />
      <ToolHeader title="Landmark cases" tip={{ id: "landmark", steps: ["Read what was believed, then what held up."] }} />

      <div className="mt-6">
        <HowToStart id="landmark">
          <LandmarkReader cases={LANDMARK_CASES} ctx={ctx} />
        </HowToStart>
      </div>
    </div>
  );
}
