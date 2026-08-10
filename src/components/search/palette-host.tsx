import { getLibraryDocs } from "@/lib/corpus/library";
import { STATIC_ENTRIES, type PaletteEntry } from "@/lib/search/palette";
import { CommandPalette } from "./command-palette";

/**
 * Server-side palette host — merges the static entries with the case-library
 * docs (server read, so the client gets a small plain list, not the JSON
 * blobs), then renders the ⌘K palette.
 */
export async function PaletteHost() {
  const docs = getLibraryDocs();
  const caseEntries: PaletteEntry[] = docs.slice(0, 40).map((d) => ({
    id: `case-${d.hash}`,
    label: d.title.slice(0, 80),
    hint: "PMC case report",
    href: `/practice/library?q=${encodeURIComponent(d.title.split(" ").slice(0, 4).join(" "))}`,
    group: "Cases",
    keywords: d.title.toLowerCase().split(/\s+/).slice(0, 6),
  }));

  return <CommandPalette entries={[...STATIC_ENTRIES, ...caseEntries]} />;
}
