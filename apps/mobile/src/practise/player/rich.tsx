import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Label, Stone, T } from "@/ds";
import { Swap } from "@/motion";
import { space } from "@/theme";
import { EndPanel, EndThumb, GameFrame, HudLine, StepStrip } from "../frame";
import { useReactions } from "../reactions";
import { sampleCase } from "./mock";
import { CaseStone, GradeChip } from "./parts";
import { useStepPlay, type StepResult } from "./step";
import type { KeyedCase } from "./types";

const HOW = ["Read the case. It is in short parts so you can scan it; fold it when you are done.", "Choose an answer, then press **Check**. Nothing counts until you do.", "Stuck? The bulb gives up to three hints. Each one lowers what the step can score.", "After the answer you see why it is right, why each other option is not, the concept and the clinical point."];
const LEVEL = ["", "Basics", "Apply", "Case", "Decision", "Advanced"];
const ROLE: Record<KeyedCase["role"], string> = { "trainee-psychologist": "You are the psychology trainee", psychologist: "You are the psychologist", "team-member": "You are on the team" };

/**
 * The full case player (/case/full): a whole case in the rich shape, step by
 * step. The case sits on a stone you can fold; new information arrives before
 * a later step; each step is choose, Check, verdict, then the full feedback.
 * Never Jyo and never sparks inside the case: the one small celebration is on
 * the last verdict and the result.
 *
 * Today it plays the design sample in ./mock.ts. See docs/CONNECT-bpractise.md.
 */
export function RichCaseScreen() {
  const { item } = useLocalSearchParams<{ item?: string }>();
  const [nonce, setNonce] = React.useState(0);
  const cs = sampleCase(item ?? null);
  return <RichRun key={`${cs.id}-${nonce}`} cs={cs} again={() => setNonce((n) => n + 1)} />;
}

function RichRun({ cs, again }: { cs: KeyedCase; again: () => void }) {
  const react = useReactions();
  const [at, setAt] = React.useState(0);
  const [results, setResults] = React.useState<StepResult[]>([]);
  const total = cs.steps.length;
  const done = at >= total;
  const step = cs.steps[Math.min(at, total - 1)]!;
  const player = useStepPlay({
    step,
    resetKey: `${cs.id}-${at}`,
    seed: at,
    nextLabel: at + 1 < total ? "Next" : "Finish the case",
    win: at + 1 >= total,
    check: () => cs.keys[step.id] ?? null,
    onDone: (r) => {
      setResults((x) => [...x, r]);
      react.answer(r.outcome === "right");
    },
    onNext: () => setAt((a) => a + 1),
  });
  if (done) {
    const pct = results.length ? Math.round((results.reduce((a, r) => a + r.score, 0) / results.length) * 100) : 0;
    const hints = results.reduce((a, r) => a + r.hints, 0);
    return (
      <GameFrame testID="rich-end" title={cs.title} thumb={<EndThumb again={again} againLabel="Do it again" extra={cs.links?.quickNote ? { label: "Read the note", onPress: () => router.push(`/notes/${cs.links!.quickNote}`) } : undefined} />}>
        <EndPanel kicker="Case done" score={`${pct}%`} right={pct} total={100} line={pct >= 85 ? "Clear reasoning." : pct >= 60 ? "Mostly there." : "Worth another look."} stats={[{ label: "Steps", value: String(total) }, { label: "First try", value: `${results.filter((r) => r.firstRight).length}/${total}` }, { label: "Hints", value: String(hints) }]}>
          <View style={{ gap: space[2] }}>
            <Label>What this case was about</Label>
            <Stone>
              <T v="reading">{cs.objective}</T>
            </Stone>
          </View>
          <View style={{ gap: space[2] }}>
            <Label>Your calls</Label>
            {cs.steps.map((s, k) => {
              const r = results[k];
              const g = r ? cs.keys[s.id]?.options[r.picked[0] ?? ""]?.grade : undefined;
              return (
                <Stone key={s.id} style={{ gap: space[2] }}>
                  <T v="small" tone="muted">
                    {s.prompt}
                  </T>
                  <T v="bodyStrong">{s.options.find((o) => o.id === r?.picked[0])?.text ?? "Not answered"}</T>
                  {g ? <GradeChip grade={g} /> : null}
                </Stone>
              );
            })}
          </View>
        </EndPanel>
      </GameFrame>
    );
  }
  const marks = results.map((r) => (r.outcome === "right" ? ("ok" as const) : r.outcome === "wrong" ? ("miss" as const) : null));
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={at} total={total} marks={marks} />
      <HudLine left={`${LEVEL[cs.level]} · ${ROLE[cs.role]}`} right={`Step ${at + 1} of ${total}`} />
    </View>
  );
  return (
    <GameFrame testID="rich-run" title={cs.title} howTo={HOW} hud={hud} confirmLeave={at > 0 || player.tries > 0} thumb={player.thumb} over={player.over}>
      <CaseStone key={`case-${at > 0}`} blocks={cs.context} startFolded={at > 0} />
      <Swap k={at} dir={1} style={{ gap: space[5] }}>
        {step.reveal?.length ? <CaseStone blocks={step.reveal} title="New information" foldable={false} testID="case-new" /> : null}
        {player.body}
      </Swap>
    </GameFrame>
  );
}
