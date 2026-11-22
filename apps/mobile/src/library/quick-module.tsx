import { NotebookText } from "lucide-react-native";
import * as React from "react";

import { go } from "@/api/prefetch";
import { Label } from "@/ds";
import { Group, Tile } from "@/screens/learn/parts";
import { quickForModule, useQuickLibrary } from "./quick-notes";

const TAG: Record<string, string> = { criteria: "Criteria", distinction: "Compare", differential: "Differential", pharm: "Medicines", therapy: "Therapy", theory: "Theory", assessment: "Assessment" };

/** A study module's Quick Notes: each note links back here, so the module links to them too. Nothing while loading or when there are none. */
export function ModuleQuickNotes({ moduleId }: { moduleId: string }) {
  const lib = useQuickLibrary();
  const items = quickForModule(lib.data, moduleId);
  if (!items.length) return null;
  return (
    <Group>
      <Label>Quick Notes</Label>
      {items.map((i) => (
        <Tile key={i.key} testID={`module-qn-${i.key}`} icon={NotebookText} title={i.title} meta={TAG[i.type] ?? "Quick Note"} onPress={() => go(i.app)} />
      ))}
    </Group>
  );
}

/** On a one-page summary: the typed Quick Notes on the same topic (criteria, comparisons, medicine tables). */
export function SummaryQuickNotes({ summaryId }: { summaryId: string }) {
  const lib = useQuickLibrary();
  const items = (lib.data?.items ?? []).filter((i) => i.summaryId === summaryId);
  if (!items.length) return null;
  return (
    <Group>
      <Label>Quick Notes on this topic</Label>
      {items.map((i) => (
        <Tile key={i.key} testID={`note-qn-${i.key}`} icon={NotebookText} title={i.title} meta={TAG[i.type] ?? "Quick Note"} onPress={() => go(i.app)} />
      ))}
    </Group>
  );
}
