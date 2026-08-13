import { createClient } from "@/lib/supabase/server";
import { JournalView } from "./journal-view";

export const dynamic = "force-dynamic";

/**
 * /reflect — Reflective Journal (Part 6.10).
 * OWNER-ONLY RLS. No admin read path. Per-entry sharing, revocable.
 * The weekly Check-in now lives at /record.
 */
export default async function ReflectPage() {
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Reflect</p>
      <h1 className="mt-1 text-h1">Your journal</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Private to you. Faculty cannot read your entries unless you share one.
      </p>

      <div className="mt-6">
        <JournalView
          initialEntries={(entries ?? []).map((e) => ({
            id: e.id,
            content: String(e.content),
            moodTag: (e.mood_tag as string | null) ?? undefined,
            createdAt: e.created_at,
          }))}
        />
      </div>
    </div>
  );
}
