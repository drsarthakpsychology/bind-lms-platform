import { ToolHeader } from "@/components/help/tool-header";
import { getLibraryDocs, filterLibrary, filterLibraryByTag, LIBRARY_FILTERS } from "@/lib/corpus/library";
import { LibraryList } from "./library-list";
import Link from "next/link";
import { requireFeature } from "@/lib/flags";
import { BackPill } from "@/components/study/back";

export const dynamic = "force-dynamic";

/**
 * /practice/library: Case Library, a browsable index of the normalised
 * open-access PMC corpus (Part 4.4). Read-only, no AI. Search by title or
 * opening text; click to expand the abstract.
 */
export default async function LibraryPage(props: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  await requireFeature("case_library");
  const sp = await props.searchParams;
  const query = sp.q ?? "";
  const tag = sp.tag ?? "";
  const all = await getLibraryDocs();
  const searched = filterLibrary(all, query);
  const filtered = tag ? filterLibraryByTag(searched, tag) : searched;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BackPill className="mb-4" />
      <ToolHeader title="Case library" tip={{ id: "case-library", steps: ["Search by title or opening words."] }} />

      <div className="mt-6">
        {/* Filter chips: one swipeable line so they never cost vertical space on a phone. */}
        <div className="mb-4 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LIBRARY_FILTERS.map((f) => {
            const active = tag === f.key;
            return (
              <Link
                key={f.key}
                href={active ? "/practice/library" : `/practice/library?tag=${f.key}`}
                className={`shrink-0 rounded-full border-2 px-3 py-1.5 text-caption font-medium transition-colors ${active ? "border-primary bg-primary/10 text-link" : "border-border text-muted-foreground hover:bg-secondary"}`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <LibraryList
          docs={filtered.slice(0, 50).map((d) => ({
            id: d.hash,
            title: d.title,
            sourceUrl: d.source_url,
            licence: d.licence,
            abstract: d.content,
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
