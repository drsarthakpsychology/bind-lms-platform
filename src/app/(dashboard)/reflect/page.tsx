import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/motion/reveal";
import { JournalView } from "./journal-view";
import { requireFeature } from "@/lib/flags";
import { PageHeader } from "@/components/design-system/page-header";

export const dynamic = "force-dynamic";

/**
 * /reflect: Reflective Journal (Part 6.10).
 * OWNER-ONLY RLS. No admin read path. Per-entry sharing, revocable.
 * The weekly Check-in now lives at /record.
 */
export default async function ReflectPage() {
  await requireFeature("journal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, content, mood_tag, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-3xl">
      <Reveal delay={0.05}>
        <PageHeader title="Your journal" description="Private to you unless you share an entry." className="pb-0" />
      </Reveal>

      <Reveal delay={0.15} className="mt-6">
        <JournalView
          initialEntries={(entries ?? []).map((e) => ({
            id: e.id,
            content: String(e.content),
            moodTag: (e.mood_tag as string | null) ?? undefined,
            createdAt: e.created_at,
          }))}
        />
      </Reveal>
    </div>
  );
}
