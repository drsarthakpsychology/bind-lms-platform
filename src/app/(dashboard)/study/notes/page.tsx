import type { Metadata } from "next";
import Link from "next/link";
import { requireFeature } from "@/lib/flags";
import { NOTES, WEEK_BLOCKS } from "@/lib/learn/notes";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { Chai } from "@/components/learn/chai";
import { NotesIndex, type NoteBlock } from "@/components/learn/notes-index";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "Notes" };

/** /study/notes — visual study notes for everything taught, by week. */
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
      meta: `${n.sections.length} sections${n.terms?.length ? ` · ${n.terms.length} terms` : ""} · quiz`,
    })),
  })).filter((b) => b.notes.length);
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6">
      <header className="flex items-center gap-4">
        <Chai mood="happy" size={88} className="shrink-0" />
        <div>
          <p className="text-eyebrow text-link">Notes</p>
          <h1 className="text-h1">Everything we&apos;ve taught, in points</h1>
          <p className="text-sm text-muted-foreground">
            {NOTES.length} notes, from the basics to every DSM-5-TR chapter. How it works: open a note, read the points, then take its quiz. Switch to Clinician view for the clinical wording.
          </p>
        </div>
      </header>
      <div className="flex flex-wrap gap-2">
        <Link href="/study/scenarios" className="rounded-full border-2 border-foreground bg-brand px-4 py-2 text-sm font-black text-brand-foreground">
          🎬 What would you do? ({SCENARIOS.length} cases)
        </Link>
        <Link href="/study/terms" className="rounded-full border-2 border-foreground bg-primary px-4 py-2 text-sm font-black text-primary-foreground">
          🗣️ Say it clinically
        </Link>
        <Link href="/study/progress" className="rounded-full border-2 border-foreground bg-card px-4 py-2 text-sm font-black">
          🏆 Leaderboard
        </Link>
      </div>
      <NotesIndex blocks={blocks} serverState={serverState} save={saveLearnState} />
    </div>
  );
}
