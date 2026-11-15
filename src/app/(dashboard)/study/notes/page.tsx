import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { NOTES, WEEK_BLOCKS } from "@/lib/learn/notes";
import { NotesIndex, type NoteBlock } from "@/components/learn/notes-index";
import { loadLearnState, saveLearnState } from "../actions";
import { PageHeader } from "@/components/design-system/page-header";
import { backLinkClass } from "@/components/design-system/back-link";
import { uiV2 } from "@/lib/ui/v2-server";
import { UiV2 } from "@/components/ds/v2";
import { BackLink, PageFrame } from "@/components/ds";

export const metadata: Metadata = { title: "One-page summaries" };

/** /study/notes: visual study notes for everything taught, by week. */
export default async function NotesPage() {
  await requireFeature("learn");
  const serverState = await loadLearnState();
  // Send only what the cards need, not the full note text.
  const blocks: NoteBlock[] = WEEK_BLOCKS.map((title, b) => ({
    title,
    notes: NOTES.filter((n) => n.block === b).map((n) => ({
      id: n.id,
      title: n.title,
      emoji: n.emoji,
      tagline: n.tagline,
      meta: n.terms?.length ? "Summary, terms and quiz" : "Summary and quiz",
    })),
  })).filter((b) => b.notes.length);
  if (await uiV2()) {
    return (
      <UiV2 on>
        <PageFrame width="reading">
          <header className="flex min-w-0 flex-col gap-1">
            <BackLink href="/study">Study</BackLink>
            <h1 className="type-h1">One-page summaries</h1>
          </header>
          <NotesIndex blocks={blocks} serverState={serverState} save={saveLearnState} />
        </PageFrame>
      </UiV2>
    );
  }
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link href="/study" className={backLinkClass}>
        <ArrowLeft className="size-4" aria-hidden /> Back to Study
      </Link>
      <PageHeader eyebrow="Study" title="One-page summaries" className="pb-0" />
      <NotesIndex blocks={blocks} serverState={serverState} save={saveLearnState} />
    </div>
  );
}
