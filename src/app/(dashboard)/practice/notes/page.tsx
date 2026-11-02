import type { Metadata } from "next";
import Link from "next/link";
import { requireFeature } from "@/lib/flags";
import { NOTES, WEEK_BLOCKS } from "@/lib/learn/notes";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { Chai } from "@/components/learn/chai";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Notes" };

const TONES = ["bg-primary text-primary-foreground", "bg-brand text-brand-foreground", "bg-foreground text-background", "bg-card"];

/** /practice/notes — visual study notes for everything taught, by week. */
export default async function NotesPage() {
  await requireFeature("learn");
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6">
      <header className="flex items-center gap-4">
        <Chai mood="happy" size={88} className="shrink-0" />
        <div>
          <p className="text-eyebrow text-link">Notes</p>
          <h1 className="text-h1">Everything we&apos;ve taught, in points</h1>
          <p className="text-sm text-muted-foreground">
            {NOTES.length} visual notes by week. Switch to Clinician view on any note for the clinical wording. Every note ends with a quiz.
          </p>
        </div>
      </header>
      <div className="flex flex-wrap gap-2">
        <Link href="/practice/learn/scenarios" className="rounded-full border-2 border-foreground bg-brand px-4 py-2 text-sm font-black text-brand-foreground">
          🎬 What would you do? ({SCENARIOS.length} cases)
        </Link>
        <Link href="/practice/learn/terms" className="rounded-full border-2 border-foreground bg-primary px-4 py-2 text-sm font-black text-primary-foreground">
          🗣️ Say it clinically
        </Link>
        <Link href="/practice/learn/progress" className="rounded-full border-2 border-foreground bg-card px-4 py-2 text-sm font-black">
          🏆 Leaderboard
        </Link>
      </div>
      {WEEK_BLOCKS.map((block, b) => {
        const notes = NOTES.filter((n) => n.block === b);
        if (!notes.length) return null;
        return (
          <section key={block}>
            <h2 className="font-pix text-xs uppercase text-link">{block}</h2>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((n, k) => (
                <li key={n.id}>
                  <Link
                    href={`/practice/notes/${n.id}`}
                    className={cn("group flex h-full flex-col gap-2 rounded-3xl border-2 border-foreground p-4 hard-shadow-sm transition-transform hover:-translate-y-1 hover:rotate-[-0.6deg] active:translate-y-0.5", TONES[(b + k) % TONES.length])}
                  >
                    <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>
                      {n.emoji}
                    </span>
                    <span className="text-lg font-black leading-tight">{n.title}</span>
                    <span className="text-sm opacity-90">{n.tagline}</span>
                    <span className="mt-auto pt-1 text-xs font-bold opacity-80">
                      {n.sections.length} sections{n.terms?.length ? ` · ${n.terms.length} terms` : ""} · quiz →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
