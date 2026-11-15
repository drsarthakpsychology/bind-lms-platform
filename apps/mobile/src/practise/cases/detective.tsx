import * as React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, OptionRow, T } from "@/ds";
import { motion, space } from "@/theme";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Tag } from "../parts";
import { useReactions } from "../reactions";
import { DET_CLUES, DET_POINTS, DET_WRONG, type DetDeal, type DetFamily } from "../types";

const HOW = ["Name the disorder or the medicine from clues. The first clue is the hardest.", "A right answer on clue one is 40 points, then 30, 20, 10.", "A wrong answer costs 5 points and opens the next clue.", "Cases you have never done come first; New and This week say which."];
const FAMILIES: { id: DetFamily; name: string; line: string }[] = [
  { id: "mixed", name: "Mixed", line: "Medicines and disorders" },
  { id: "drug", name: "Medicines", line: "Name the medicine" },
  { id: "disorder", name: "Disorders", line: "Name the disorder" },
];

/** Clinic detective: clues one at a time; the answer and the unopened clues stay on the server. */
export function DetectiveCase() {
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [family, setFamily] = React.useState<DetFamily>("mixed");
  const [deal, setDeal] = React.useState<DetDeal | null>(null);
  const [r, setR] = React.useState(0);
  const [clues, setClues] = React.useState<string[]>([]);
  const [wrong, setWrong] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<{ right: boolean; answer: string | null } | null>(null);
  const [score, setScore] = React.useState(0);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [all, setAll] = React.useState<string[] | null>(null);
  const [over, setOver] = React.useState(false);

  const start = async () => {
    mv.reset();
    react.reset();
    const d = await mv.run(() => play<DetDeal>("detective", "deal", family, []));
    if (!d) return;
    setDeal(d);
    setR(0);
    setClues([d.rounds[0]!.clue]);
    setWrong([]);
    setResult(null);
    setScore(0);
    setMarks([]);
    setAll(null);
    setOver(false);
  };
  if (!deal) return <StartScreen testID="detective-start" title="Clinic detective" line="Name the disorder or medicine from clues, in as few as you can." howTo={HOW} choiceLabel="Cases" choices={FAMILIES} choice={family} onChoice={setFamily} onPlay={() => void start()} busy={mv.pending} error={mv.error} />;

  const round = deal.rounds[r];
  if (over || !round) {
    const right = marks.filter((m) => m === "ok").length;
    return (
      <GameFrame testID="case-detective" title="Clinic detective" thumb={<EndThumb again={() => void start()} />}>
        <EndPanel score={String(score)} line={deal.recycled ? "You've done every case. These were the hardest ones again." : `${right} of ${marks.length} named`} right={right} total={Math.max(1, marks.length)} stats={[{ label: "Named", value: `${right}/${marks.length}` }]} />
      </GameFrame>
    );
  }

  const guess = async (g: string) => {
    if (result || mv.pending) return;
    const final = clues.length >= DET_CLUES;
    const res = await mv.run(() => play<{ ok: true; right: boolean; answer: string | null }>("detective", "guess", deal.token, r, g, final));
    if (!res) return;
    react.answer(res.right);
    if (res.right) {
      setScore((s) => s + DET_POINTS[clues.length - 1]!);
      setResult(res);
      setMarks((m) => [...m, "ok"]);
      return;
    }
    setScore((s) => Math.max(0, s - DET_WRONG));
    setWrong((w) => [...w, g]);
    if (final) {
      setResult(res);
      setMarks((m) => [...m, "miss"]);
      return;
    }
    const n = await mv.run(() => play<{ ok: true; clue: string }>("detective", "clue", deal.token, r, clues.length));
    if (n) setClues((cl) => [...cl, n.clue]);
  };
  const showAll = async () => {
    const res = await mv.run(() => play<{ ok: true; clues: string[] }>("detective", "clues", deal.token, r));
    if (res) setAll(res.clues);
  };
  const next = () => {
    const n = r + 1;
    if (n >= deal.rounds.length) {
      setOver(true);
      return;
    }
    setR(n);
    setClues([deal.rounds[n]!.clue]);
    setWrong([]);
    setResult(null);
    setAll(null);
  };
  const mark = deal.marks[r];
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={r} total={deal.rounds.length} marks={marks} />
      <HudLine left={`Case ${r + 1} of ${deal.rounds.length} · clue ${clues.length} of ${DET_CLUES}`} right={result ? undefined : `${DET_POINTS[clues.length - 1]} to win`} />
    </View>
  );
  return (
    <GameFrame testID="case-detective" title="Clinic detective" howTo={HOW} score={String(score)} hud={hud} confirmLeave thumb={result ? <Button label={r + 1 >= deal.rounds.length ? "See my score" : "Next case"} onPress={next} testID="detective-next" /> : undefined}>
      {mark === "new" || mark === "week" ? (
        <View style={{ flexDirection: "row" }}>
          <Tag tag={mark} />
        </View>
      ) : null}
      <View style={{ gap: space[3] }}>
        {(all ?? clues).map((cl, k) => (
          <Animated.View key={k} entering={reduce || k === 0 ? undefined : FadeInDown.duration(motion.state)} style={{ flexDirection: "row", gap: space[3], opacity: all && k >= clues.length ? 0.6 : 1 }}>
            <T v="score" style={{ width: 20 }} num>
              {k + 1}
            </T>
            <T v="reading" style={{ flex: 1 }}>
              {cl}
            </T>
          </Animated.View>
        ))}
      </View>
      <View style={{ gap: space[3] }}>
        {round.options.map((o, j) => (
          <OptionRow key={o} index={j} text={o} testID={`detective-option-${j}`} disabled={!!result || wrong.includes(o) || mv.pending} state={result ? (o === result.answer ? "right" : wrong.includes(o) ? "wrong" : "dim") : wrong.includes(o) ? "wrong" : "idle"} onPress={() => void guess(o)} />
        ))}
      </View>
      <MoveError text={mv.error} />
      {result ? <Verdict right={result.right} title={result.right ? `+${DET_POINTS[clues.length - 1]} on clue ${clues.length}` : `It was ${result.answer}`} why={null} seed={r} /> : null}
      {result && !all && clues.length < DET_CLUES ? <Button kind="text" label="Show the other clues" onPress={() => void showAll()} testID="detective-all" /> : null}
    </GameFrame>
  );
}
