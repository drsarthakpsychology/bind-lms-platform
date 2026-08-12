import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { RightsList } from "./rights-list";

export const dynamic = "force-dynamic";

interface RegistryRow {
  id: string;
  title: string;
  authors: string[] | null;
  publisher: string | null;
  category: string;
  layer: string;
  priority: number;
  rights_status: string;
  author_consent: boolean | null;
  unlocks: string | null;
  updated_at: string | null;
}

/**
 * /admin/rights — the Casebook acquisition tracker. One screen shows where
 * every corpus title stands; flipping rights_status to 'licensed' makes the
 * ingester pick the title up on its next pass. Sorted by priority (1 =
 * get this first) then title, server-side.
 */
export default async function AdminRightsPage() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rights_registry")
    .select(
      "id, title, authors, publisher, category, layer, priority, rights_status, author_consent, unlocks, updated_at",
    )
    .order("priority", { ascending: true })
    .order("title", { ascending: true });

  const rows: RegistryRow[] = (data ?? []).map((r) => ({
    id: String(r.id),
    title: String(r.title),
    authors: Array.isArray(r.authors) ? r.authors.map((a) => String(a)) : null,
    publisher: r.publisher != null ? String(r.publisher) : null,
    category: String(r.category),
    layer: String(r.layer),
    priority: Number(r.priority ?? 3),
    rights_status: String(r.rights_status),
    author_consent: r.author_consent ?? null,
    unlocks: r.unlocks != null ? String(r.unlocks) : null,
    updated_at: r.updated_at ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Casebook rights"
        description="The acquisition tracker — where every corpus title stands. Flip a title to licensed and the ingester picks it up on its next pass."
      />
      <div className="mt-6">
        <RightsList rows={rows} loadError={error?.message ?? null} />
      </div>
    </div>
  );
}
