import { ToolHeader } from "@/components/help/tool-header";
import { createClient } from "@/lib/supabase/server";
import { MseLadder, type MseLadderContent } from "./mse-ladder";
import type { MseStimulus } from "@/lib/practice/mse";
import { FULL_MSE_STIMULI, type FullMseStimulus } from "@/lib/mse/mse4-stimuli";
import { OBSERVE_STIMULI } from "@/lib/practice/mse-observe-stimuli";
import { order } from "@/lib/history/server";
import { viewerId } from "@/lib/history/viewer";
import { requireFeature } from "@/lib/flags";
import { cleanDeep, cleanStudentText } from "@/lib/ai/student-text";

export const dynamic = "force-dynamic";

interface MseStimuliRow {
  id: string;
  slug: string;
  content: string;
  domain: string;
  expert_coding: unknown;
  title: string | null;
}

/** Shape a jsonb expert_coding row into the level-typed forms the ladder scores. */
function shapeContent(rows: MseStimuliRow[]): MseLadderContent {
  const observe: Array<{ id: string; content: string; why?: string }> = [];
  const domain: MseStimulus[] = [];
  const fullMse: FullMseStimulus[] = [];

  for (const raw of rows) {
    // Older stimuli rows still carry dashes; students never see them.
    const row = { ...raw, content: cleanStudentText(raw.content), title: raw.title ? cleanStudentText(raw.title) : raw.title, expert_coding: cleanDeep(raw.expert_coding) };
    const coding = (row.expert_coding ?? {}) as { expertTags?: string[]; amberTags?: string[]; why?: string; expert?: FullMseStimulus["expert"]; amber?: FullMseStimulus["amber"] };
    if (row.slug.startsWith("obs-")) {
      observe.push({ id: row.slug, content: row.content, why: coding.why });
    } else if (row.slug.startsWith("mse-")) {
      domain.push({
        id: row.slug,
        content: row.content,
        domain: row.domain as MseStimulus["domain"],
        expertTags: coding.expertTags ?? [],
        amberTags: coding.amberTags ?? [],
        why: coding.why,
      });
    } else if (row.slug.startsWith("mse4-")) {
      fullMse.push({
        id: row.slug,
        title: row.title ?? row.slug,
        context: row.content,
        expert: coding.expert ?? ({} as FullMseStimulus["expert"]),
        amber: coding.amber ?? {},
      });
    }
  }

  return {
    observe: observe.length ? observe : undefined,
    domain: domain.length ? domain : undefined,
    fullMse: fullMse.length ? fullMse : undefined,
  };
}

/**
 * /practice/mse: MSE Trainer rebuilt (v5 Part 2).
 * A ladder of five levels, unlocked in order:
 *   1 Observe → 2 Domain by domain → 3 Confusable pairs → 4 Full MSE
 *   under time → 5 MSE from live interview (your own Consulting Room).
 * Levels 1/2/4 read their stimuli from the live mse_stimuli table (content
 * wiring); the static banks are the fallback when the DB is empty.
 */
export default async function MsePage() {
  await requireFeature("mse");
  const supabase = await createClient();
  const { data: dbRows } = await supabase
    .from("mse_stimuli")
    .select("id, slug, content, domain, expert_coding, title")
    .eq("status", "published");

  const shaped = shapeContent((dbRows ?? []) as unknown as MseStimuliRow[]);
  // Answer history (src/lib/history): Levels 1 and 4 open on a case not seen
  // yet, then missed ones, right ones last. Picked here so the first screen
  // is the same on the server and in the browser.
  const viewer = await viewerId();
  const observe = shaped.observe ?? OBSERVE_STIMULI;
  const fullMse = shaped.fullMse ?? FULL_MSE_STIMULI;
  const [obsOrder, fullOrder] = await Promise.all([
    order(viewer, "mse-trainer", observe.map((x) => x.id)),
    order(viewer, "mse-trainer", fullMse.map((x) => x.id)),
  ]);
  const byOrder = <T extends { id: string }>(list: T[], ids: string[]) => ids.flatMap((id) => list.filter((x) => x.id === id).slice(0, 1));
  const content: MseLadderContent = { ...shaped, observe: byOrder(observe, obsOrder), fullMse: byOrder(fullMse, fullOrder) };

  return (
    <div className="mx-auto max-w-3xl">
      <ToolHeader title="Mental state exam" tip={{ id: "mse-trainer", steps: ["Write what you can see and hear, not what you conclude."] }} />
      <div className="mt-6">
        <MseLadder content={content} />
      </div>
    </div>
  );
}
