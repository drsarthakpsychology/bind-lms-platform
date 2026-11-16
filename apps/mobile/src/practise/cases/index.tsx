import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { EmptyState } from "@/ds";
import { caseTool } from "../catalog";
import { GameFrame } from "../frame";
import { DailyCase } from "./daily";
import { DetectiveCase } from "./detective";
import { ToolCaseScreen } from "./tool";

/** Every case tool by its id (/case/:id). */
export function CaseRoute() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const t = caseTool(String(id));
  if (t?.kind === "daily") return <DailyCase />;
  if (t?.kind === "detective") return <DetectiveCase />;
  if (t?.kind === "tool" && t.toolId) return <ToolCaseScreen key={t.toolId} tool={t.toolId} />;
  return (
    <GameFrame title="Case">
      <EmptyState mood="puzzled" title="No case tool by that name" body="Go back to Practise and pick one from the list." />
    </GameFrame>
  );
}
