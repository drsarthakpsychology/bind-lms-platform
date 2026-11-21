import { Check, X } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, HintText, Label, OptionList, ResultSheet, Stone, T } from "@/ds";
import { Enter, ProgressRing, RollingNumber, StaggerList, Swap } from "@/motion";
import { space, useTheme } from "@/theme";
import { leave, PlayShell } from "./shell";

/** One question in a run: something to read, a question, up to five answers. */
export type Step = {
  id: string;
  /** The patient's words, a vignette, a headline: shown on a stone above the question. Never animated. */
  context?: string;
  /** A small word over the context ("Ward round", "Headline"). */
  contextLabel?: string;
  prompt: string;
  options: string[];
  answer: number;
  /** Why the right answer is right. */
  why?: string;
  /** What happens for each option (ethics, best response): shown instead of `why` for the one chosen. */
  notes?: string[];
  /** Read after the result, on the layer ("What the law says"). */
  more?: { label: string; text: string };
};

export type RunResult = { id: string; picked: number; right: boolean };

/**
 * The question screen recipe (docs/DESIGN.md), shared by Ethics, the Casebook
 * and the Lab's checks: close and progress on the field, the reading and the
 * question on the layer, choose then Check, the result rises, then Next. At
 * the end a short summary with what to look at again. `calm` is for cases and
 * anything clinical: no sparks, ever.
 */
export function QuestionRun({ steps, title, calm, home, onDone, doneLabel = "Done", takeaway, testID = "run", rightTitle = "Yes, that fits", wrongTitle = "Not quite" }: { steps: Step[]; title: string; calm?: boolean; home?: string; onDone?: (r: RunResult[]) => void; doneLabel?: string; takeaway?: string; testID?: string; rightTitle?: string; wrongTitle?: string }) {
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [sheet, setSheet] = React.useState(false);
  const [results, setResults] = React.useState<RunResult[]>([]);
  const [round, setRound] = React.useState(0);
  const step = steps[i];
  const finished = i >= steps.length;
  const close = () => leave(home);

  if (finished || !step) {
    return (
      <Summary
        title={title}
        steps={steps}
        results={results}
        takeaway={takeaway}
        doneLabel={doneLabel}
        onClose={close}
        onAgain={() => {
          setResults([]);
          setPicked(null);
          setChecked(false);
          setI(0);
          setRound((r) => r + 1);
        }}
      />
    );
  }

  const right = picked === step.answer;
  const last = i === steps.length - 1;
  const check = () => {
    if (picked === null) return;
    setChecked(true);
    setSheet(true);
  };
  const next = () => {
    const all = [...results, { id: step.id, picked: picked ?? -1, right }];
    setResults(all);
    setSheet(false);
    setChecked(false);
    setPicked(null);
    setI(i + 1);
    if (last) onDone?.(all);
  };
  const why = picked !== null && step.notes?.[picked] ? step.notes[picked] : step.why;
  const score = results.filter((r) => r.right).length + (right ? 1 : 0);
  // After the result, a step with more to read (the law) keeps the page open: the sheet steps aside for it.
  const reading = checked && !sheet;
  return (
    <PlayShell
      testID={testID}
      title={title}
      done={i + (checked ? 1 : 0)}
      total={steps.length}
      onClose={close}
      footer={reading ? <Button kind="ink" label={last ? "Finish" : "Next"} testID="run-next" onPress={next} /> : <Button label="Check" testID="run-check" disabled={picked === null || checked} onPress={check} />}
      over={
        <ResultSheet
          open={sheet}
          right={right}
          win={!calm && last && right && score / steps.length >= 0.8}
          title={right ? rightTitle : wrongTitle}
          why={why}
          action={step.more ? { label: step.more.label, onPress: () => setSheet(false) } : { label: last ? "Finish" : "Next", onPress: next }}
        />
      }
    >
      <Swap k={`${round}-${i}`} dir={1} style={{ gap: space[4] }}>
        {step.context ? (
          <View style={{ gap: space[2] }}>
            {step.contextLabel ? <Label>{step.contextLabel}</Label> : null}
            <Stone>
              <T v="reading">{step.context}</T>
            </Stone>
          </View>
        ) : null}
        <T v="h2" accessibilityRole="header">
          {step.prompt}
        </T>
        <OptionList testID="run-options" options={step.options} picked={picked} onPick={setPicked} checked={checked} answer={step.answer} />
        {reading && step.more ? (
          <View style={{ gap: space[2] }}>
            <Label>{step.more.label}</Label>
            <HintText testID="run-more">{step.more.text}</HintText>
            {why ? (
              <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
                {why}
              </T>
            ) : null}
          </View>
        ) : null}
      </Swap>
    </PlayShell>
  );
}

function Summary({ title, steps, results, takeaway, doneLabel, onClose, onAgain }: { title: string; steps: Step[]; results: RunResult[]; takeaway?: string; doneLabel: string; onClose: () => void; onAgain: () => void }) {
  const c = useTheme();
  const got = results.filter((r) => r.right).length;
  const total = Math.max(1, steps.length);
  const pct = Math.round((got / total) * 100);
  const missed = steps.filter((s) => results.find((r) => r.id === s.id && !r.right));
  return (
    <PlayShell
      testID="run-summary"
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button label={doneLabel} testID="run-done" onPress={onClose} />
          <Button kind="quiet" label="Go again" testID="run-again" onPress={onAgain} />
        </>
      }
    >
      <Enter i={0}>
        <Stone pad={space[5]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
            <ProgressRing pct={pct} size={72} stroke={7} label={`${pct} percent right`}>
              <T v="caption" num>{`${pct}%`}</T>
            </ProgressRing>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[1] }}>
                <RollingNumber value={got} v="display" testID="run-score" />
                <T tone="muted" num>{`of ${steps.length} right`}</T>
              </View>
              <T v="small" tone="muted">
                {pct === 100 ? "All of them. Solid." : pct >= 60 ? "Most of them. Look at the ones below." : "A good one to come back to."}
              </T>
            </View>
          </View>
        </Stone>
      </Enter>
      {takeaway ? (
        <Enter i={1}>
          <View style={{ gap: space[2] }}>
            <Label>Take with you</Label>
            <T v="reading" style={{ paddingHorizontal: space[1] }}>
              {takeaway}
            </T>
          </View>
        </Enter>
      ) : null}
      {missed.length ? (
        <View style={{ gap: space[2] }}>
          <Label>Look at these again</Label>
          <StaggerList style={{ gap: space[2] }}>
            {missed.map((s) => (
              <Stone key={s.id}>
                <View style={{ gap: space[2] }}>
                  <View style={{ flexDirection: "row", gap: space[2] }}>
                    <X size={18} color={c.muted} style={{ marginTop: 3 }} />
                    <T v="bodyStrong" style={{ flex: 1 }}>
                      {s.context && s.context.length < 140 ? s.context : s.prompt}
                    </T>
                  </View>
                  <View style={{ flexDirection: "row", gap: space[2] }}>
                    <Check size={18} color={c.ink} style={{ marginTop: 3 }} />
                    <T style={{ flex: 1 }}>{s.options[s.answer]}</T>
                  </View>
                  {s.why ? (
                    <T v="small" tone="muted">
                      {s.why}
                    </T>
                  ) : null}
                </View>
              </Stone>
            ))}
          </StaggerList>
        </View>
      ) : null}
    </PlayShell>
  );
}
