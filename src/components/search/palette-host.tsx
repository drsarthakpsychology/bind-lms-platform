import { STATIC_ENTRIES, referencePaletteEntries, visibleEntries, type PaletteEntry } from "@/lib/search/palette";
import { blockedBy } from "@/lib/access/features";
import { referenceIndex } from "@/lib/reference/data";
import { CommandPalette } from "./command-palette";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Server-side palette host: merges the static entries with the Quick
 * Reference (and, for admins, the student list), then renders the ⌘K
 * palette. The raw journal-article Case library is not searched: it stays
 * off (Practice tools review, Nov 2026), and reading its 37 MB file on every
 * page was the palette's biggest cost.
 */
/** Admins also get every student (name, roll number, email): type to jump to their profile. */
export async function PaletteHost({ isAdmin = false, flags = {}, blocked = [] }: { isAdmin?: boolean; flags?: Record<string, string>; blocked?: string[] }) {
  const studentEntries: PaletteEntry[] = isAdmin ? await studentPaletteEntries() : [];

  let referenceEntries: PaletteEntry[] = [];
  try {
    referenceEntries = referencePaletteEntries(referenceIndex({ full: false }));
  } catch {
    referenceEntries = []; // search still works without the Quick Reference
  }

  const reference = flags.learn === "unlocked" ? referenceEntries : [];
  const entries = visibleEntries([...STATIC_ENTRIES, ...studentEntries, ...reference], { flags, isAdmin, blocked: (href) => Boolean(blockedBy(href, blocked)) });
  return <CommandPalette entries={entries} />;
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
