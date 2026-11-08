import { ToolHeader } from "@/components/help/tool-header";
import { LANDMARK_CASES } from "@/lib/landmark/cases";
import { LandmarkReader } from "./landmark-reader";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/landmark: landmark cases (v5 Part 5.2). Original narratives with
 * the 'what held up' framing and quizzes. Ethics failures framed as the
 * primary lesson where they exist.
 */
export default async function LandmarkPage() {
  await requireFeature("landmark");
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <ToolHeader title="Landmark cases" tip={{ id: "landmark", steps: ["Read what was believed, then what held up."] }} />

      <div className="mt-6">
        <LandmarkReader cases={LANDMARK_CASES} />
      </div>
    </div>
  );
}
