import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { quickLibrary } from "@/lib/quick-notes/library";
import type { QuickType } from "@/lib/quick-notes/view-types";
import { QuickNotesLibrary } from "@/components/quick-notes/library";
import { BackLink, PageFrame } from "@/components/ds";
import { UiV2 } from "@/components/ds/v2";

export const metadata: Metadata = { title: "Quick Notes" };

/**
 * /study/notes: Quick Notes, the one library of criteria, comparisons,
 * medicines, therapies, theories, assessment and words. The old Quick
 * reference (/study/reference) sends its visitors here.
 */
export default async function QuickNotesPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; kind?: string }> }) {
  await requireFeature("learn");
  const [sp, session] = await Promise.all([searchParams, getSession()]);
  const lib = quickLibrary();
  const asked = sp.type ?? (sp.kind === "disorder" ? "criteria" : sp.kind === "medicine" ? "pharm" : sp.kind);
  const type = lib.types.some((t) => t.id === asked) ? (asked as QuickType) : "all";
  return (
    <UiV2 on>
      <PageFrame width="reading">
        <header className="flex min-w-0 flex-col gap-1">
          <BackLink href="/study">Study</BackLink>
          <h1 className="type-h1">Quick Notes</h1>
          <p className="type-small text-muted-foreground">Criteria, comparisons, medicines, therapies and words, in one place.</p>
        </header>
        <QuickNotesLibrary lib={lib} owner={session.status === "ok" ? session.profile.id : null} initialQuery={(sp.q ?? "").slice(0, 80)} initialType={type} />
      </PageFrame>
    </UiV2>
  );
}
