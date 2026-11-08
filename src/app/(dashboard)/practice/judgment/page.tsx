import { ToolHeader } from "@/components/help/tool-header";
import { ALL_SEED_SCT_ITEMS } from "@/lib/practice/sct";
import { JudgmentArena } from "./judgment-arena";
import { requireFeature } from "@/lib/flags";
import { BackPill } from "@/components/study/back";

export const dynamic = "force-dynamic";

/**
 * /practice/judgment: "5 Judgment Calls", 90 seconds, one screen.
 * The daily habit anchor. After each answer, show the panel's distribution
 * as a bar chart plus a line of expert reasoning.
 */
export default async function JudgmentPage() {
  await requireFeature("judgment");
  // In this slice, use the seed items. The panel responses are simulated
  // deterministic (from the seed distribution) until the admin panel flow is
  // wired. sct_expert_responses is admin-only RLS regardless.
  const items = ALL_SEED_SCT_ITEMS;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BackPill className="mb-4" />
      <ToolHeader title="Judgment calls" tip={{ id: "judgment", steps: ["Say whether each new fact makes the diagnosis more or less likely."] }} />

      <div className="mt-6">
        <JudgmentArena items={items.slice(0, 5)} />
      </div>
    </div>
  );
}
