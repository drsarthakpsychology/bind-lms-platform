import { STATIC_ENTRIES, medicinePaletteEntries, modulePaletteEntries, referencePaletteEntries, visibleEntries, type PaletteEntry } from "@/lib/search/palette";
import { MODULES } from "@/lib/study";
import { MEDS } from "@/lib/meds";
import { blockedBy } from "@/lib/access/features";
import { lectureOnlyAllowed } from "@/lib/auth/scope";
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
export async function PaletteHost({ isAdmin = false, flags = {}, blocked = [], scope = "full" }: { isAdmin?: boolean; flags?: Record<string, string>; blocked?: string[]; scope?: "full" | "lectures_only" }) {
  const studentEntries: PaletteEntry[] = isAdmin ? await studentPaletteEntries() : [];

  let referenceEntries: PaletteEntry[] = [];
  try {
    referenceEntries = referencePaletteEntries(referenceIndex({ full: false }));
  } catch {
    referenceEntries = []; // search still works without the Quick Reference
  }

  const reference = flags.learn === "unlocked" ? referenceEntries : [];
  // Study modules and medicines: what the top bar promises ("lectures, topics, medicines").
  const topics = [...modulePaletteEntries(MODULES), ...medicinePaletteEntries(MEDS)];
  // A lecture-only account is offered only what it can open (otherwise every
  // pick of Practice, Medicines or a module sent them silently back home).
  const allowed = !isAdmin && scope === "lectures_only" ? lectureOnlyAllowed : undefined;
  const entries = visibleEntries([...STATIC_ENTRIES, ...topics, ...studentEntries, ...reference], { flags, isAdmin, allowed, blocked: (href) => Boolean(blockedBy(href, blocked)) });
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
