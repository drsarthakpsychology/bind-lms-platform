import { getLibraryDocs } from "@/lib/corpus/library";
import { STATIC_ENTRIES, referencePaletteEntries, type PaletteEntry } from "@/lib/search/palette";
import { referenceIndex } from "@/lib/reference/data";
import { CommandPalette } from "./command-palette";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Server-side palette host: merges the static entries with the case-library
 * docs (server read, so the client gets a small plain list, not the JSON
 * blobs), then renders the ⌘K palette.
 */
/** Admins also get every student (name, roll number, email): type to jump to their profile. */
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

  const studentEntries: PaletteEntry[] = isAdmin ? await studentPaletteEntries() : [];

  let referenceEntries: PaletteEntry[] = [];
  try {
    referenceEntries = referencePaletteEntries(referenceIndex({ full: false }));
  } catch {
    referenceEntries = []; // search still works without the Quick Reference
  }

  return <CommandPalette entries={[...STATIC_ENTRIES, ...studentEntries, ...referenceEntries, ...caseEntries]} />;
}

/**
 * One light query (5 columns), NOT loadRoster(), which runs ~10 queries plus
 * the activity rollup and made every admin page load wait on it.
 */
async function studentPaletteEntries(): Promise<PaletteEntry[]> {
  try {
    const { data } = await createAdminClient()
      .from("profiles")
      .select("id, email, name, roll_number, mobile_number")
      .eq("role", "student")
      .limit(5000);
    return (data ?? []).map((p) => {
      const email = String(p.email ?? "");
      const roll = (p.roll_number as string | null) ?? null;
      const mobile = (p.mobile_number as string | null) ?? null;
      return {
        id: `st-${p.id}`,
        label: String(p.name ?? "").trim() || email.split("@")[0],
        hint: `${roll ?? "No roll no."} · ${email}`,
        href: `/admin/students/${p.id}`,
        group: "Admin" as const,
        keywords: [email, roll ?? "", mobile ?? "", "student"].filter(Boolean).map((k) => k.toLowerCase()),
      };
    });
  } catch {
    return []; // search still works without the student list
  }
}
