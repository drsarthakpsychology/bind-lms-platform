import { readFlags } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { computePracticeStates, type SurfaceState } from "@/lib/practice/practice-state";
import { lastPracticePlace } from "@/lib/practice/resume";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { PracticeKeyboardNav } from "@/components/practice/keyboard-nav";
import { MAIN_TOOLS, MORE_TOOLS, PracticeHubView, THINK_TOOLS, shownTools } from "@/components/practice/practice-hub";

/**
 * /practice: clinical skills on real cases (plan section 8). The four main
 * skills first (Daily case, AI patient interview, MSE, Formulation), then the
 * smaller tools under two headings. Tools are gated by their feature flag:
 * "off" is hidden, "live" shows locked, "unlocked" opens. Medicines has its
 * own menu item next to Exam Prep.
 */
export default async function PracticeHubPage() {
  const supabase = await createClient();
  const [flags, { data: { user } }] = await Promise.all([readFlags(), supabase.auth.getUser()]);

  const [states, blocked] = user
    ? await Promise.all([computePracticeStates(supabase, user.id), loadMyBlocks(user.id)])
    : [{} as Record<string, SurfaceState>, [] as string[]];
  const isBlocked = (href: string) => Boolean(blockedBy(href, blocked));

  const main = shownTools(MAIN_TOOLS, flags, states, isBlocked);
  const think = shownTools(THINK_TOOLS, flags, states, isBlocked);
  const more = shownTools(MORE_TOOLS, flags, states, isBlocked);
  const open = [...main, ...think, ...more].filter((t) => !t.locked);

  // One quiet link back to the last practice tool used.
  const resume = user ? await lastPracticePlace(user.id, open.map((t) => ({ href: t.href, title: t.title }))) : null;

  return (
    <>
      <PracticeHubView
        main={main}
        think={think}
        more={more}
        resume={resume}
        records={{ passport: flags["skills_passport"] === "unlocked", log: flags["supervision"] === "unlocked" || flags["checkin"] === "unlocked" }}
      />
      <PracticeKeyboardNav links={open.map((t) => ({ href: t.href, title: t.title }))} />
    </>
  );
}
