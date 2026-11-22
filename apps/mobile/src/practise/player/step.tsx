import * as React from "react";
import { View } from "react-native";

import { Button, T } from "@/ds";
import { space } from "@/theme";
import { Feedback, Options, QuestionHead, VerdictSheet, type SheetTone } from "./parts";
import { bestOf, scoreStep, type Step, type StepKey } from "./types";

export type StepResult = { picked: string[]; key: StepKey; /** 0 to 1, after hints and tries. */ score: number; /** Right on the first try. */ firstRight: boolean; tries: number; hints: number; /** best, acceptable, or not. */ outcome: "right" | "partial" | "wrong" };

type Sheet = { tone: SheetTone; title: string; why: string | null; final: boolean };

const RIGHT = ["Yes, that fits", "That's it", "Spot on", "Exactly"];

/**
 * One question, played the same way everywhere: choose, then press Check.
 *
 *   choose   the options are stone pills; your pick turns ink; Check wakes up
 *   check    the verdict rises from the bottom
 *            right       "Yes, that fits" and why; Next, or See why
 *            acceptable  "Acceptable, not best"; the same two doors
 *            wrong       with a try left: "Not quite", Try it again (the wrong
 *                        pick dims), or Show the answer
 *                        with none left: what was wrong with it; Next, or See why
 *   review   the options stay, each with its own reason; under them why the
 *            best is right, the concept, the clinical point, common errors
 *
 * The caller gives `check` (the phone's own key today, the server later) and
 * hears `onDone` once, when the step is settled. Returns the three pieces the
 * shell needs: the body for the layer, the pinned button, and the sheet.
 */
export function useStepPlay({ step, check, onDone, onNext, nextLabel = "Next", retry = true, win, kicker, seed = 0, resetKey, ids: tid = {} }: { step: Step; /** Grade the pick. Null means it did not go through (no connection): nothing is counted. */ check: (picked: string[]) => Promise<StepKey | null> | StepKey | null; onDone?: (r: StepResult) => void; onNext: () => void; nextLabel?: string; /** Allow one more try after a wrong pick (never when fewer than four options are left). */ retry?: boolean; /** Sparks on the verdict when right: only for a real win (the last step of a case). */ win?: boolean; kicker?: string; seed?: number; /** A new value starts the step afresh (the next question in the same screen). */ resetKey?: string | number; /** testIDs the screen has always used: options are `${option}-0`..., the next button `next`. */ ids?: { option?: string; next?: string } }) {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [tried, setTried] = React.useState<string[]>([]);
  const [hints, setHints] = React.useState(0);
  const [tries, setTries] = React.useState(0);
  const [key, setKey] = React.useState<StepKey | null>(null);
  const [held, setHeld] = React.useState<StepKey | null>(null);
  const [sheet, setSheet] = React.useState<Sheet | null>(null);
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [was, setWas] = React.useState(resetKey);
  if (was !== resetKey) {
    setWas(resetKey);
    setPicked([]);
    setTried([]);
    setHints(0);
    setTries(0);
    setKey(null);
    setHeld(null);
    setSheet(null);
    setOpen(false);
    setBusy(false);
  }
  const multi = step.kind === "multi";
  const optIds = step.options.map((o) => o.id);

  const pick = (id: string) => {
    if (key || busy) return;
    setPicked((p) => (multi ? (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]) : [id]));
  };

  const settle = (k: StepKey, mine: string[], n: number, outcome: StepResult["outcome"]) => {
    setKey(k);
    onDone?.({ picked: mine, key: k, score: scoreStep(k, mine, optIds, hints, n), firstRight: outcome === "right" && n === 1, tries: n, hints, outcome });
  };

  const runCheck = async () => {
    if (!picked.length || busy || key) return;
    setBusy(true);
    let k: StepKey | null = null;
    try {
      k = await check(picked);
    } finally {
      setBusy(false);
    }
    if (!k) return;
    const n = tries + 1;
    setTries(n);
    const best = bestOf(k);
    const allRight = multi ? best.length === picked.length && best.every((b) => picked.includes(b)) : best.includes(picked[0]!);
    const mine = k.options[picked[0]!];
    const e = k.explanation;
    if (allRight) {
      setSheet({ tone: "right", title: RIGHT[seed % RIGHT.length]!, why: e.whyCorrect || mine?.feedback || null, final: true });
      settle(k, picked, n, "right");
    } else if (!multi && mine?.grade === "acceptable") {
      setSheet({ tone: "partial", title: "Acceptable, not best", why: mine.consequence || mine.feedback || e.whyCorrect || null, final: true });
      settle(k, picked, n, "partial");
    } else if (retry && n < 2 && optIds.length - tried.length >= 4) {
      setHeld(k);
      setSheet({ tone: "wrong", title: "Not quite", why: step.hints.length > hints ? "Have one more go. The hint beside the question may help." : "Read the case once more, then have one more go.", final: false });
    } else {
      setSheet({ tone: "wrong", title: mine?.grade === "harmful" ? "This could harm" : multi ? "Not all of them" : "Not this one", why: mine?.consequence || mine?.feedback || e.whyCorrect || null, final: true });
      settle(k, picked, n, "wrong");
    }
    setOpen(true);
  };

  const tryAgain = () => {
    setTried((t) => [...t, ...picked]);
    setPicked([]);
    setHeld(null);
    setOpen(false);
  };
  const showAnswer = () => {
    if (held) settle(held, picked, tries, "wrong");
    setHeld(null);
    setOpen(false);
  };

  const body = (
    <View style={{ gap: space[4] }}>
      <QuestionHead prompt={step.prompt} hints={step.hints} used={hints} onHint={() => setHints((h) => Math.min(step.hints.length, h + 1))} locked={!!key} kicker={kicker ?? (multi ? "Tick all that fit" : undefined)} />
      <Options options={step.options} picked={picked} onPick={pick} answerKey={key} tried={tried} disabled={busy} testPrefix={tid.option} />
      {tried.length && !key ? (
        <T v="small" tone="muted" accessibilityLiveRegion="polite">
          One more try. The dimmed answer is out.
        </T>
      ) : null}
      {key ? <Feedback answerKey={key} /> : null}
    </View>
  );
  const thumb = key ? open ? null : <Button label={nextLabel} onPress={onNext} testID={tid.next ?? "player-next"} /> : <Button label={multi ? "Check my ticks" : "Check"} disabled={!picked.length} busy={busy} onPress={() => void runCheck()} testID="player-check" />;
  const over = sheet ? (
    <VerdictSheet
      open={open}
      tone={sheet.tone}
      title={sheet.title}
      why={sheet.why}
      win={win && sheet.tone === "right"}
      action={sheet.final ? { label: nextLabel, onPress: onNext, testID: tid.next ?? "player-next" } : { label: "Try it again", onPress: tryAgain, testID: "player-retry" }}
      secondary={sheet.final ? { label: "See why, option by option", onPress: () => setOpen(false), testID: "player-why" } : { label: "Show the answer", onPress: showAnswer, testID: "player-reveal" }}
    />
  ) : null;
  return { body, thumb, over, answered: !!key, hints, tries };
}
