import { getLibraryDocs, filterLibrary } from "@/lib/corpus/library";
import { LibraryList } from "./library-list";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/library — Case Library, a browsable index of the normalised
 * open-access PMC corpus (Part 4.4). Read-only, no AI. Search by title or
 * opening text; click to expand the abstract.
 */
export default async function LibraryPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireFeature("case_library");
  const sp = await props.searchParams;
  const query = sp.q ?? "";
  const all = getLibraryDocs();
  const filtered = filterLibrary(all, query);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Case library</p>
      <h1 className="mt-1 text-h1">Browse the corpus</h1>
      <p className="mt-1 text-small text-muted-foreground">
        {all.length} open-access case reports from PMC (Europe PMC OA, CC-BY etc.). Search by
        title or opening text. The library surfaces what faculty should know is in scope.
     </p>

      <div className="mt-6">
        <LibraryList
          docs={filtered.slice(0, 50).map((d) => ({
            id: d.hash,
            title: d.title,
            sourceUrl: d.source_url,
            licence: d.licence,
            snippet: d.content.slice(0, 240),
            fetchedAt: d.fetched_at,
          }))}
          totalCount={all.length}
          query={query}
          shown={Math.min(50, filtered.length)}
        />
     </div>
   </div>
  );
}
