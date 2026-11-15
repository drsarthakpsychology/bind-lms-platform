import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { usePrepSet } from "@/api/queries";
import { Button, EmptyState, OptionRow, Skeleton, T, VerdictBand } from "@/ds";
import { GameFrame } from "@/practise/frame";
import { Rich } from "@/study/rich";
import { space } from "@/theme";

/** One Exam Prep set: one question per screen, answer, see why, next. */
export function PrepSetScreen() {
  const { subject = "" } = useLocalSearchParams<{ subject: string }>();
  const q = usePrepSet(String(subject));
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState<number | null>(null);
  const [right, setRight] = React.useState(0);
  const set = q.data;
  if (!set) {
    return (
      <GameFrame title="Exam Prep">
        {q.isError ? <EmptyState mood="sleepy" title="Coming in the next update" body="Exam Prep is ready on the website and arrives in the app soon." /> : <View style={{ gap: space[3] }}><Skeleton w="80%" h={26} />{[0, 1, 2, 3].map((k) => <Skeleton key={k} h={56} r={12} />)}</View>}
      </GameFrame>
    );
  }
  const m = set.questions[i];
  return (
    <GameFrame
      testID="prep-set"
      title={set.title}
      score={`${right}/${set.questions.length}`}
      confirmLeave={!!m && i > 0}
      thumb={m ? <Button label={i === set.questions.length - 1 ? "Finish" : "Next"} disabled={pick === null} onPress={() => { setI(i + 1); setPick(null); }} testID="prep-next" /> : <Button label="Start again" onPress={() => { setI(0); setRight(0); setPick(null); }} />}
    >
      {m ? (
        <>
          <T v="small" tone="muted" num>
            {i + 1} of {set.questions.length}
          </T>
          <Rich text={m.q} v="h2" />
          <View style={{ gap: space[3] }}>
            {m.options.map((o, j) => (
              <OptionRow key={j} index={j} text={o} disabled={pick !== null} state={pick === null ? "idle" : j === m.answer ? "right" : j === pick ? "wrong" : "dim"} onPress={() => { setPick(j); if (j === m.answer) setRight((r) => r + 1); }} />
            ))}
          </View>
          {pick !== null ? <VerdictBand right={pick === m.answer} why={m.why} seed={i} /> : null}
        </>
      ) : (
        <VerdictBand right={right / set.questions.length >= 0.7} title={`${right} of ${set.questions.length} right`} why="Questions you missed come back first next time." />
      )}
    </GameFrame>
  );
}
