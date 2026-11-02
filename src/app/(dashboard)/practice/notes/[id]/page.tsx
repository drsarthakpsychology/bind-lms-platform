import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireFeature } from "@/lib/flags";
import { NOTES, noteById } from "@/lib/learn/notes";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { NoteView } from "@/components/learn/note-view";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: noteById(id)?.title ?? "Notes" };
}

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  await requireFeature("learn");
  const { id } = await params;
  const i = NOTES.findIndex((n) => n.id === id);
  if (i < 0) notFound();
  return <NoteView note={NOTES[i]} prev={NOTES[i - 1]} next={NOTES[i + 1]} scenarioCount={SCENARIOS.filter((s) => s.noteId === id).length} />;
}
