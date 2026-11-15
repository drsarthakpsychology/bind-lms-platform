import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { readFlags } from "@/lib/flags";
import { uiV2For } from "@/lib/ui/v2";
import { AdminPage } from "../_v2/kit";
import { PageHeader } from "@/components/design-system/page-header";
import { CardsAdmin, type CardRow } from "./cards-admin";

export const dynamic = "force-dynamic";

/**
 * /admin/cards: the Rounds review queue (Part 6.5 follow-through).
 * Cards auto-drafted from lesson transcripts (scripts/draft-cards-from-lessons.ts)
 * land here as source='ai_generated', status='draft'. Faculty review:
 * approve (published) or reject (archived), edit the text, or delete.
 * Students only ever see published + approved cards.
 */
export default async function AdminCardsPage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const admin = createAdminClient();
  const { data } = await admin
    .from("cards")
    .select("id, front, back, source, status, approved, lesson_id, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(500);

  const rows: CardRow[] = (data ?? []).map((c) => ({
    id: c.id,
    front: String(c.front ?? ""),
    back: String(c.back ?? ""),
    source: c.source as CardRow["source"],
    status: c.status as CardRow["status"],
    approved: Boolean(c.approved),
    sortOrder: Number(c.sort_order ?? 0),
    createdAt: c.created_at as string,
  }));

  const drafts = rows.filter((r) => r.status === "draft").length;
  const published = rows.filter((r) => r.status === "published").length;

  if (uiV2For(await readFlags(), me.role)) {
    return (
      <AdminPage width="default" title="Study cards" lead={`The Rounds queue. ${drafts} draft${drafts === 1 ? "" : "s"} waiting for review · ${published} published. Approve and students see it.`}>
        <CardsAdmin v2 cards={rows} />
      </AdminPage>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Study cards"
        description={`The Rounds queue. ${drafts} draft${drafts === 1 ? "" : "s"} awaiting review · ${published} published. Approve → students see it and Rounds schedules it.`}
      />
      <div className="mt-6">
        <CardsAdmin cards={rows} />
      </div>
    </div>
  );
}
