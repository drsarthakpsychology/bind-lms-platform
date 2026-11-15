import * as React from "react";
import { View } from "react-native";

import { haptic } from "@/lib/haptics";
import { space } from "@/theme";
import { T } from "@/ds";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen } from "../frame";
import { Tile } from "../parts";
import { useReactions } from "../reactions";
import type { MatchDeal, MatchPick } from "../types";

const HOW = ["Tap a word, then tap what it means.", "Each pair is checked as you go. Clear the board in as few tries as you can."];

/** Match the term: pairs checked on the server, one tap at a time. */
export function MatchGame() {
  const mv = useMove();
  const react = useReactions();
  const [deal, setDeal] = React.useState<MatchDeal | null>(null);
  const [token, setToken] = React.useState("");
  const [left, setLeft] = React.useState<number | null>(null);
  const [done, setDone] = React.useState<number[]>([]);
  const [usedRights, setUsedRights] = React.useState<number[]>([]);
  const [wrong, setWrong] = React.useState<number | null>(null);
  const [tries, setTries] = React.useState(0);
  const [end, setEnd] = React.useState<MatchPick | null>(null);

  const start = async () => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => play<MatchDeal>("match", "deal"));
    if (!r) return;
    setDeal(r);
    setToken(r.token);
    setLeft(null);
    setDone([]);
    setUsedRights([]);
    setTries(0);
    setEnd(null);
  };
  if (!deal) return <StartScreen testID="match-start" title="Match the term" line="Pair each word with its meaning." howTo={HOW} onPlay={() => void start()} busy={mv.pending} error={mv.error} />;
  if (end) {
    return (
      <GameFrame testID="game-match" title="Match the term" thumb={<EndThumb again={() => void start()} />}>
        <EndPanel kicker="Board cleared" score={String(end.tries)} scoreOf="tries" line={`${deal.lefts.length} pairs`} right={deal.lefts.length} total={end.tries} stats={end.xp ? [{ label: "XP", value: `+${end.xp}` }] : undefined} />
      </GameFrame>
    );
  }
  const tapRight = async (r: number) => {
    if (left === null || mv.pending) return;
    const l = left;
    const res = await mv.run(() => play<MatchPick>("match", "pick", { token, left: l, right: r }));
    if (!res) return;
    setToken(res.token);
    setTries(res.tries);
    react.answer(res.right);
    if (res.right) {
      haptic.success();
      setDone(res.done);
      setUsedRights((u) => [...u, r]);
      setLeft(null);
      if (res.cleared) setEnd(res);
    } else {
      haptic.warn();
      setWrong(r);
      setTimeout(() => setWrong(null), 600);
    }
  };
  return (
    <GameFrame testID="game-match" title="Match the term" howTo={HOW} score={`${done.length}/${deal.lefts.length}`} hud={<HudLine left={left === null ? "Tap a word." : "Now tap what it means."} right={`${tries} tries`} />} confirmLeave={tries > 0}>
      <T v="small" tone="muted">
        {deal.title}
      </T>
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <View style={{ flex: 1, gap: space[2] }}>
          {deal.lefts.map((t, i) => (
            <Tile key={i} text={t} testID={`match-left-${i}`} state={done.includes(i) ? "gone" : left === i ? "on" : "idle"} disabled={done.includes(i)} onPress={() => setLeft(i)} />
          ))}
        </View>
        <View style={{ flex: 1.4, gap: space[2] }}>
          {deal.rights.map((t, r) => (
            <Tile key={r} testID={`match-right-${r}`} state={usedRights.includes(r) ? "gone" : wrong === r ? "wrong" : "idle"} disabled={usedRights.includes(r)} onPress={() => void tapRight(r)} accessibilityLabel={t}>
              <T v="small">{t}</T>
            </Tile>
          ))}
        </View>
      </View>
      <MoveError text={mv.error} />
    </GameFrame>
  );
}
