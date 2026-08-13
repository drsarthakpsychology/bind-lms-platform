import { createClient } from "@/lib/supabase/server";
import { MseLadder, type MseLadderContent } from "./mse-ladder";
import type { MseStimulus } from "@/lib/practice/mse";
import type { FullMseStimulus } from "@/lib/mse/mse4-stimuli";

export const dynamic = "force-dynamic";

interface MseStimuliRow {
  id: string;
  slug: string;
  content: string;
  domain: string;
  expert_coding: unknown;
}

/** Shape a jsonb expert_coding row into the level-typed forms the ladder scores. */
function shapeContent(rows: MseStimuliRow[]): MseLadderContent {
  const observe: Array<{ id: string; content: string }> = [];
  const domain: MseStimulus[] = [];
  const fullMse: FullMseStimulus[] = [];

  for (const row of rows) {
    const coding = (row.expert_coding ?? {}) as { expertTags?: string[]; amberTags?: string[]; expert?: FullMseStimulus["expert"]; amber?: FullMseStimulus["amber"] };
    if (row.slug.startsWith("obs-")) {
      observe.push({ id: row.slug, content: row.content });
    } else if (row.slug.startsWith("mse-")) {
      domain.push({
        id: row.slug,
        content: row.content,
        domain: row.domain as MseStimulus["domain"],
        expertTags: coding.expertTags ?? [],
        amberTags: coding.amberTags ?? [],
      });
    } else if (row.slug.startsWith("mse4-")) {
      fullMse.push({
        id: row.slug,
        title: row.slug,
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
 * /practice/mse — MSE Trainer rebuilt (v5 Part 2).
 * A ladder of five levels, unlocked in order:
 *   1 Observe → 2 Domain by domain → 3 Confusable pairs → 4 Full MSE
 *   under time → 5 MSE from live interview (your own Consulting Room).
 * Levels 1/2/4 read their stimuli from the live mse_stimuli table (content
 * wiring); the static banks are the fallback when the DB is empty.
 */
export default async function MsePage() {
  const supabase = await createClient();
  const { data: dbRows } = await supabase
    .from("mse_stimuli")
    .select("id, slug, content, domain, expert_coding")
    .eq("status", "published");

  const content = shapeContent((dbRows ?? []) as unknown as MseStimuliRow[]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">MSE Trainer · the ladder</p>
      <h1 className="mt-1 text-h1">Mental Status Exam</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Novices write &quot;patient was depressed.&quot; That is a conclusion, not an
        observation. The MSE is a description of what you can see and hear right
        now — and the whole skill is holding the line between the two. Five
        levels, taken in order.
      </p>
      <div className="mt-6">
        <MseLadder content={content} />
      </div>
    </div>
  );
}
