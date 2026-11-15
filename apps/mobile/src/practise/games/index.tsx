import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { EmptyState } from "@/ds";
import { GameFrame } from "../frame";
import { BlitzGame } from "./blitz";
import { ComorbidGame } from "./comorbid";
import { DuelGame } from "./duel";
import { EscapeGame } from "./escape";
import { MatchGame } from "./match";
import { MseGame } from "./mse";
import { RxGame } from "./rx";
import { SortGame } from "./sort";
import { WardGame } from "./ward";

/** Every game by its id (/game/:id). Quickfire is now Blitz, the website's fast-facts game. */
export const GAMES: Record<string, React.ComponentType> = {
  blitz: BlitzGame,
  quickfire: BlitzGame,
  sort: SortGame,
  mse: MseGame,
  ward: WardGame,
  rx: RxGame,
  duel: DuelGame,
  escape: EscapeGame,
  comorbid: ComorbidGame,
  match: MatchGame,
};

export function GameRoute() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const G = GAMES[String(id)];
  if (G) return <G />;
  return (
    <GameFrame title="Game">
      <EmptyState mood="puzzled" title="No game by that name" body="Go back to Practise and pick one from the list." />
    </GameFrame>
  );
}
