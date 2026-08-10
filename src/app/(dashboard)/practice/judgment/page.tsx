import { ALL_SEED_SCT_ITEMS } from "@/lib/practice/sct";
import { JudgmentArena } from "./judgment-arena";

export const dynamic = "force-dynamic";

/**
 * /practice/judgment — "5 Judgment Calls", 90 seconds, one screen.
 * The daily habit anchor. After each answer, show the panel's distribution
 * as a bar chart plus a line of expert reasoning.
 */
export default function JudgmentPage() {
  // In this slice, use the seed items. The panel responses are simulated
  // deterministic (from the seed distribution) until the admin panel flow is
  // wired. sct_expert_responses is admin-only RLS regardless.
  const items = ALL_SEED_SCT_ITEMS;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Script concordance</p>
      <h1 className="mt-1 text-h1">5 Judgment Calls</h1>
      <p className="mt-1 text-small text-muted-foreground">
        90 seconds, one screen. New information changes the probability — this becomes…
      </p>

      <div className="mt-6">
        <JudgmentArena items={items.slice(0, 5)} />
      </div>
    </div>
  );
}
