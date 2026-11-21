import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { QuietEmpty } from "@/ds";
import { accentFor, AccentProvider } from "../accents";
import { caseTool } from "../catalog";
import { GameFrame } from "../frame";
import { DailyCase } from "./daily";
import { DetectiveCase } from "./detective";
import { ToolCaseScreen } from "./tool";
import { RichCaseScreen } from "../player/rich";

/** Every case tool by its id (/case/:id). */
export function CaseRoute() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const t = caseTool(String(id));
  // The full case player, on the design sample for now (src/practise/player/mock.ts).
  if (id === "full")
    return (
      <AccentProvider value={accentFor("rich")}>
        <RichCaseScreen />
      </AccentProvider>
    );
  const screen = t?.kind === "daily" ? <DailyCase /> : t?.kind === "detective" ? <DetectiveCase /> : t?.kind === "tool" && t.toolId ? <ToolCaseScreen key={t.toolId} tool={t.toolId} /> : null;
  if (screen) return <AccentProvider value={accentFor(String(id))}>{screen}</AccentProvider>;
  return (
    <GameFrame title="Case">
      <QuietEmpty title="No case tool by that name" body="Go back to Practise and pick one from the list." />
    </GameFrame>
  );
}
