import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { IdiomsAdmin, type IdiomRow } from "./idioms-admin";

export const dynamic = "force-dynamic";

/**
 * /admin/idioms — the Idiom Bank review queue (v5 Part 1 governance).
 * 65 phrases are seeded; the decode drill shows approved ones only. Approve
 * here and a phrase surfaces to students the next time the drill loads.
 */
export default async function AdminIdiomsPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("idioms")
    .select("id, phrase, transliteration, trap, approved, created_at")
    .order("approved", { ascending: true })
    .order("phrase", { ascending: true });

  const rows: IdiomRow[] = (data ?? []).map((i) => ({
    id: i.id,
    phrase: String(i.phrase ?? ""),
    transliteration: (i.transliteration as string | null) ?? undefined,
    trap: String(i.trap ?? ""),
    approved: Boolean(i.approved),
    createdAt: i.created_at as string,
  }));

  const approved = rows.filter((r) => r.approved).length;
  const queued = rows.length - approved;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Idiom bank review"
        description={`${rows.length} phrases · ${approved} approved (visible to students) · ${queued} queued. The Decoder shows approved idioms only.`}
      />
      <div className="mt-6">
        <IdiomsAdmin idioms={rows} />
      </div>
    </div>
  );
}
