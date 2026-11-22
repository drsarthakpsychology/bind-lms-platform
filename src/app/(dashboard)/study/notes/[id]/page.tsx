import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { getSession } from "@/lib/auth/session";
import { NOTES, noteById } from "@/lib/learn/notes";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { QUICK_NOTES, TYPE_LABEL, quickNoteById } from "@/lib/quick-notes";
import { quickNoteView } from "@/lib/quick-notes/view";
import { NoteView } from "@/components/learn/note-view";
import { QuickNotePage } from "@/components/quick-notes/note";
import { loadLearnState, saveLearnState } from "../../actions";
import { uiV2 } from "@/lib/ui/v2-server";
import { UiV2 } from "@/components/ds/v2";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: quickNoteById(id)?.title ?? noteById(id)?.title ?? "Quick Notes" };
}

/** /study/notes/<id>: a typed Quick Note (criteria-adhd, pharm-lithium ...) or a one-page summary (depression ...). */
export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  await requireFeature("learn");
  const { id } = await params;
  const quick = quickNoteById(id);
  if (quick) {
    const session = await getSession();
    return (
      <UiV2 on>
        <QuickNotePage v={quickNoteView(quick)} owner={session.status === "ok" ? session.profile.id : null} />
      </UiV2>
    );
  }
  const i = NOTES.findIndex((n) => n.id === id);
  if (i < 0) notFound();
  const serverState = await loadLearnState();
  return (
    <UiV2 on={await uiV2()}>
      <NoteView
        note={NOTES[i]}
        prev={NOTES[i - 1]}
        next={NOTES[i + 1]}
        scenarioCount={SCENARIOS.filter((s) => s.noteId === id).length}
        serverState={serverState}
        save={saveLearnState}
        position={{ index: i, total: NOTES.length }}
        quick={QUICK_NOTES.filter((q) => q.links.summaryId === id).map((q) => ({ id: q.id, title: q.title, typeLabel: TYPE_LABEL[q.type] }))}
      />
    </UiV2>
  );
}
