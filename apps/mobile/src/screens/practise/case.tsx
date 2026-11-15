import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { useCase } from "@/api/queries";
import { Button, EmptyState, OptionRow, Skeleton, T, VerdictBand } from "@/ds";
import { GameFrame } from "@/practise/frame";
import { Rich } from "@/study/rich";
import { space } from "@/theme";

/** A patient case in steps: read, choose, see why, carry on. */
export function CaseScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useCase(String(id));
  const [step, setStep] = React.useState(0);
  const [pick, setPick] = React.useState<number | null>(null);
  const cs = q.data;
  if (!cs) {
    return (
      <GameFrame title="Case">
        {q.isError ? <EmptyState mood="sleepy" title="Coming in the next update" body="This case is ready on the website and arrives in the app soon." /> : <View style={{ gap: space[3] }}><Skeleton w="70%" h={26} /><Skeleton h={16} /><Skeleton w="85%" h={16} /></View>}
      </GameFrame>
    );
  }
  const s = cs.steps[step];
  const end = !s;
  const chosen = s && pick !== null ? s.choices[pick] : null;
  const best = s ? s.choices.findIndex((x) => x.verdict === "best") : -1;
  return (
    <GameFrame
      testID="case"
      title={cs.patient}
      howTo="Read the case, then choose what you would do at each step. There is a best choice, an acceptable one and one that could harm."
      score={`${Math.min(step + 1, cs.steps.length)}/${cs.steps.length}`}
      thumb={end ? <Button label="Try it again" onPress={() => { setStep(0); setPick(null); }} /> : <Button label={step === cs.steps.length - 1 ? "Finish the case" : "Next step"} disabled={pick === null} onPress={() => { setStep(step + 1); setPick(null); }} testID="case-next" />}
    >
      {step === 0 && !end ? (
        <View style={{ gap: space[2] }}>
          <T v="h2">{cs.title}</T>
          <Rich text={cs.presenting} v="reading" />
        </View>
      ) : null}
      {end ? (
        <View style={{ gap: space[3] }}>
          <T v="h2">What to take away</T>
          <Rich text={cs.takeaway} v="reading" />
        </View>
      ) : (
        <>
          <Rich text={s.ask} v="h3" />
          <View style={{ gap: space[3] }}>
            {s.choices.map((ch, j) => (
              <OptionRow key={j} index={j} text={ch.label} disabled={pick !== null} state={pick === null ? "idle" : j === best ? "right" : j === pick ? "wrong" : "dim"} onPress={() => setPick(j)} testID={`case-option-${j}`} />
            ))}
          </View>
          {chosen ? <VerdictBand right={chosen.verdict === "best"} title={chosen.verdict === "best" ? "Best choice" : chosen.verdict === "ok" ? "Acceptable, not best" : "This could harm"} why={chosen.why} seed={step} /> : null}
        </>
      )}
    </GameFrame>
  );
}
