import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { QuickNoteScreen } from "@/library/quick-note";
import { isQuickId } from "@/library/quick-notes";
import { NoteScreen } from "@/screens/notes/notes";

/** /notes/<id>: a typed Quick Note (criteria-adhd, pharm-lithium ...) or a one-page summary (depression ...). */
export default function NoteRoute() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  return isQuickId(String(id)) ? <QuickNoteScreen id={String(id)} /> : <NoteScreen />;
}
