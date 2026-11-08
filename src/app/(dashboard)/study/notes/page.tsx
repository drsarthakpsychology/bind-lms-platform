import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireFeature } from "@/lib/flags";
import { NOTES, WEEK_BLOCKS } from "@/lib/learn/notes";
import { Chai } from "@/components/learn/chai";
import { NotesIndex, type NoteBlock } from "@/components/learn/notes-index";
import { loadLearnState, saveLearnState } from "../actions";

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
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link href="/study" className="inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 py-1.5 text-sm font-semibold">
        <ArrowLeft className="size-4" aria-hidden /> Study
      </Link>
      <header className="flex items-center gap-4">
        <Chai mood="happy" size={88} className="shrink-0" />
        <div>
          <h1 className="text-h1">One-page summaries</h1>
        </div>
      </header>
      <NotesIndex blocks={blocks} serverState={serverState} save={saveLearnState} />
    </div>
  );
}
