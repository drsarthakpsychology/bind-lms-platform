import { getLibraryDocs } from "@/lib/corpus/library";
import { STATIC_ENTRIES, type PaletteEntry } from "@/lib/search/palette";
import { CommandPalette } from "./command-palette";
import { loadRoster } from "@/lib/people/roster-data";

/**
 * Server-side palette host — merges the static entries with the case-library
 * docs (server read, so the client gets a small plain list, not the JSON
 * blobs), then renders the ⌘K palette.
 */
/** Admins also get every student (name, roll number, email) — type to jump to their profile. */
export async function PaletteHost({ isAdmin = false }: { isAdmin?: boolean }) {
  const docs = await getLibraryDocs();
  const caseEntries: PaletteEntry[] = docs.slice(0, 40).map((d) => ({
    id: `case-${d.hash}`,
    label: d.title.slice(0, 80),
    hint: "PMC case report",
    href: `/practice/library?q=${encodeURIComponent(d.title.split(" ").slice(0, 4).join(" "))}`,
    group: "Cases",
    keywords: d.title.toLowerCase().split(/\s+/).slice(0, 6),
  }));

  const studentEntries: PaletteEntry[] = isAdmin
    ? (await loadRoster()).rows.map((r) => ({
        id: `st-${r.id}`,
        label: r.name,
        hint: `${r.roll ?? "No roll no."} · ${r.email}`,
        href: `/admin/students/${r.id}`,
        group: "Admin" as const,
        keywords: [r.email, r.roll ?? "", r.mobile ?? "", "student"].filter(Boolean).map((k) => k.toLowerCase()),
      }))
    : [];

  return <CommandPalette entries={[...STATIC_ENTRIES, ...studentEntries, ...caseEntries]} />;
}
