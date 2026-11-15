import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MseLadderContent } from "@/app/(dashboard)/practice/mse/mse-ladder";
import type { MseStimulus } from "@/lib/practice/mse";
import { FULL_MSE_STIMULI, type FullMseStimulus } from "@/lib/mse/mse4-stimuli";
import { OBSERVE_STIMULI } from "@/lib/practice/mse-observe-stimuli";
import { caseContext } from "@/lib/cases/server";
import { arrangeCases } from "@/lib/cases/fresh";
import { fromRows, seededRng } from "@/lib/history/order";
import { SMALL_THINGS, smallItem } from "@/lib/mse/small-things";
import { cleanDeep, cleanStudentText } from "@/lib/ai/student-text";

/*
 * The MSE trainer's first screen (moved out of src/app/(dashboard)/practice/mse/page.tsx
 * so the mobile app gets the same content): the published stimuli shaped
 * per level, then each case library in fresh-case order.
 */

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

/** Everything the MSE ladder opens with, for the signed-in viewer. */
export async function loadMseLadderContent(): Promise<MseLadderContent> {
  const supabase = await createClient();
  const { data: dbRows } = await supabase
    .from("mse_stimuli")
    .select("id, slug, content, domain, expert_coding, title")
    .eq("status", "published");

  const shaped = shapeContent((dbRows ?? []) as unknown as MseStimuliRow[]);
  // Answer history (src/lib/history): Levels 1 and 4 open on a case not seen
  // yet, then missed ones, right ones last. Picked here so the first screen
  // is the same on the server and in the browser.
  // Fresh cases (src/lib/cases/fresh.ts): new this week, new, done last, so
  // Next never reaches a done case while a new one is left. The small things
  // walk resumes at the moment it was left.
  const observe = shaped.observe ?? OBSERVE_STIMULI;
  const fullMse = shaped.fullMse ?? FULL_MSE_STIMULI;
  const smallIds = SMALL_THINGS.map((x) => smallItem(x.id));
  const ctx = await caseContext("mse-trainer", [...observe.map((x) => x.id), ...fullMse.map((x) => x.id), ...smallIds], "mse-small");
  const history = fromRows(ctx.history);
  const rng = seededRng(ctx.now);
  const opts = { history, now: ctx.now, student: ctx.student, rng };
  const obs = arrangeCases(observe, (x) => x.id, opts);
  const full = arrangeCases(fullMse, (x) => x.id, opts);
  const small = arrangeCases(SMALL_THINGS, (x) => smallItem(x.id), { history, now: ctx.now, student: ctx.student });
  const at = (ctx.progress.rows.find((r) => r.item === "walk")?.state as { at?: string } | null)?.at;
  const smallOrder = small.list.map((x) => x.item.id);
  const content: MseLadderContent = {
    ...shaped,
    observe: obs.list.map((x) => x.item),
    observeFresh: obs.recycled ? 0 : obs.fresh,
    fullMse: full.list.map((x) => x.item),
    fullFresh: full.recycled ? 0 : full.fresh,
    small: { order: smallOrder, start: Math.max(0, at ? smallOrder.indexOf(at) : 0), fresh: small.recycled ? 0 : small.fresh },
  };

  return content;
}
