import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Phone, RotateCcw } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, EmptyState, OptionRow, ProgressLine, Row, RowList, Screen, Section, T, Tint } from "@/ds";
import { haptic } from "@/lib/haptics";
import { openLink } from "@/lib/open";
import { motion, space, useTheme } from "@/theme";
import { INSTRUMENTS, TRAITS, getInstrument, scoreInstrument, type Instrument, type Result } from "./tests";

/** The website's crisis line (src/components/free/free-shell.tsx). */
export const CRISIS = { name: "Tele-MANAS", number: "14416", tel: "tel:14416", alt: "1-800-891-4416", altTel: "tel:18008914416", emergency: "112" } as const;

/** Help right now: on every free screen, red after a risk answer. */
export function CrisisLine({ urgent = false }: { urgent?: boolean }) {
  const c = useTheme();
  return (
    <Tint style={urgent ? { backgroundColor: c.alertBg } : undefined}>
      <View style={{ gap: space[2] }} testID={urgent ? "crisis-urgent" : "crisis"}>
        <T v="bodyStrong" tone={urgent ? "alert" : "ink"}>
          {urgent ? "Please talk to someone today." : "Need to talk to someone right now?"}
        </T>
        <T v="small" tone={urgent ? "alert" : "muted"}>
          {`${CRISIS.name} is free, confidential and open all day and night, in many Indian languages. If you or someone else is in danger now, call ${CRISIS.emergency}.`}
        </T>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          <Button kind="quiet" label={`Call ${CRISIS.number}`} icon={<Phone size={16} color={c.ink} />} onPress={() => void openLink(CRISIS.tel)} testID="crisis-call" />
          <Button kind="quiet" label={`Call ${CRISIS.emergency}`} onPress={() => void openLink(`tel:${CRISIS.emergency}`)} testID="crisis-112" />
        </View>
      </View>
    </Tint>
  );
}

/** Free self-checks, as the website's /free: no account, scored on the phone, nothing kept. */
export function FreeHome() {
  return (
    <Screen title="Free self-checks" lead="The questionnaires psychologists use, scored on your phone. Nothing you answer is kept." testID="free">
      <RowList>
        {INSTRUMENTS.map((i) => (
          <Row key={i.id} testID={`free-${i.id}`} title={i.short} meta={`${i.name} · ${i.measures} · ${i.minutes} min`} onPress={() => router.push(`/free/${encodeURIComponent(i.id)}`)} />
        ))}
      </RowList>
      <Section title="Calm">
        <RowList>
          <Row testID="free-breathing" title="Guided breathing" meta="Box breathing, 4-7-8 or slow breathing" onPress={() => router.push("/free/calm")} />
        </RowList>
      </Section>
      <CrisisLine />
    </Screen>
  );
}

/** One self-check: one question at a time, then the result. */
export function FreeTestScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const inst = getInstrument(String(id));
  if (!inst) {
    return (
      <Screen title="Free self-checks" testID="free-missing">
        <EmptyState mood="missing" title="That self-check is not here" action={{ label: "All self-checks", onPress: () => router.replace("/free") }} />
      </Screen>
    );
  }
  return <Runner key={inst.id} inst={inst} />;
}

function Runner({ inst }: { inst: Instrument }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [extra, setExtra] = React.useState<number | null>(null);
  const [askExtra, setAskExtra] = React.useState(false);
  const i = answers.length;
  const finished = i >= inst.items.length && !(askExtra && extra === null);
  const result: Result | null = finished ? scoreInstrument(inst, answers) : null;

  const pick = (v: number) => {
    haptic.select();
    const next = [...answers, v];
    setAnswers(next);
    if (next.length >= inst.items.length && inst.extra && next.some((x) => x > 0)) setAskExtra(true);
  };
  const restart = () => {
    setAnswers([]);
    setExtra(null);
    setAskExtra(false);
  };

  if (askExtra && extra === null && inst.extra) {
    return (
      <Screen title={inst.short} testID="free-extra">
        <T v="h3">{inst.extra.text}</T>
        <View style={{ gap: space[2] }}>
          {inst.extra.options.map((o, k) => (
            <OptionRow key={o} index={k} text={o} onPress={() => setExtra(k)} testID={`free-extra-${k}`} />
          ))}
        </View>
      </Screen>
    );
  }

  if (result) return <ResultView inst={inst} result={result} extra={extra} onRestart={restart} />;

  const item = inst.items[i]!;
  return (
    <Screen title={inst.short} testID="free-question">
      <ProgressLine value={(i / inst.items.length) * 100} height={4} label={`Question ${i + 1}`} />
      <T v="small" tone="muted">
        {inst.stem}
      </T>
      <Animated.View key={i} entering={reduce ? undefined : FadeInDown.duration(motion.fill)} style={{ gap: space[4] }}>
        <T v="h3" testID="free-item">
          {item.text}
        </T>
        <View style={{ gap: space[2] }}>
          {inst.options.map((o, k) => (
            <OptionRow key={o.label} index={k} text={o.label} onPress={() => pick(o.value)} testID={`free-option-${k}`} />
          ))}
        </View>
      </Animated.View>
      {i > 0 ? <Button kind="text" label="Back" icon={<ArrowLeft size={18} color={c.link} />} onPress={() => setAnswers(answers.slice(0, -1))} testID="free-back" /> : null}
    </Screen>
  );
}

function nextSteps(inst: Instrument, r: Result): string[] {
  if (r.kind === "total" || r.kind === "who5") {
    if (r.band.tone === "ok") return ["Keep doing what works for you: sleep, movement, people you trust.", "Check in again any time things change."];
    if (r.band.tone === "mild") return ["Take this again in two weeks.", "Tell someone you trust how you've been feeling.", "If it's getting worse or not easing, talk to a professional."];
    return ["Book a consultation with a clinical psychologist or psychiatrist. Show them this result.", `${CRISIS.name} (${CRISIS.number}) can talk it through with you today and point you to help nearby. It's free.`, "You don't need to wait until it gets worse. Help works best early."];
  }
  if (r.kind === "asrs") {
    return r.positive
      ? ["Ask a psychiatrist or clinical psychologist for a full ADHD assessment.", "Low mood, anxiety, poor sleep and thyroid problems can look like ADHD, so a proper assessment checks for these too."]
      : ["If focus is still a struggle, sleep, stress and mood are worth checking first.", "The low mood and worry checks here take a few minutes each."];
  }
  void inst;
  return ["Personality is fairly stable but not fixed. It shifts slowly with age and experience."];
}

function ResultView({ inst, result, extra, onRestart }: { inst: Instrument; result: Result; extra: number | null; onRestart: () => void }) {
  const urgent = result.flags.includes("self-harm");
  const steps = nextSteps(inst, result);
  return (
    <Screen
      title="Your result"
      testID="free-result"
      footer={
        <View style={{ gap: space[2] }}>
          <Button label="All self-checks" onPress={() => (router.canGoBack() ? router.back() : router.replace("/free"))} testID="free-all" />
          <Button kind="quiet" label="Take it again" icon={<RotateCcw size={18} />} onPress={onRestart} testID="free-again" />
        </View>
      }
    >
      {urgent ? <CrisisLine urgent /> : null}
      {result.kind === "total" || result.kind === "who5" ? (
        <Section title={`Your ${inst.name} score`}>
          <T v="display" num testID="free-score">{`${result.score} / ${result.max}`}</T>
          <T v="h3" testID="free-band">
            {result.band.label}
          </T>
          <ProgressLine value={(result.score / Math.max(1, result.max)) * 100} height={6} />
          <T>{result.band.advice}</T>
          {result.kind === "who5" ? (
            <T v="small" tone="muted">
              Higher is better.
            </T>
          ) : inst.id !== "self-esteem" ? (
            <T v="small" tone="muted">
              Higher scores mean more symptoms.
            </T>
          ) : null}
        </Section>
      ) : result.kind === "asrs" ? (
        <Section title="Adult ADHD screener">
          <T v="h3" testID="free-band">
            {result.positive ? "Screen positive" : "Screen negative"}
          </T>
          <T>
            {result.positive
              ? "Most of your answers fell in the range that is consistent with adult ADHD. A full assessment by a psychiatrist or clinical psychologist is worth it."
              : "This screener doesn't point to adult ADHD, but if attention problems are affecting your life, it's still worth talking to someone."}
          </T>
        </Section>
      ) : (
        <Section title="Your Big Five profile">
          <T v="small" tone="muted">
            There is no good or bad profile. Every trait has strengths at both ends.
          </T>
          {result.traits.map((t) => (
            <View key={t.key} style={{ gap: space[1] }} testID={`free-trait-${t.key}`}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <T v="bodyStrong">{TRAITS[t.key].name}</T>
                <T v="small" tone="muted">
                  {t.level}
                </T>
              </View>
              <ProgressLine value={((t.score - 4) / 16) * 100} height={4} />
              <T v="small">{t.level === "high" ? TRAITS[t.key].high : t.level === "low" ? TRAITS[t.key].low : TRAITS[t.key].mid}</T>
            </View>
          ))}
        </Section>
      )}
      {urgent ? (
        <Section title="About one of your answers">
          <T>{`You said you've had thoughts of being better off dead or of hurting yourself. Whatever your total, that matters. Please tell someone you trust today, and call ${CRISIS.name} on ${CRISIS.number}. If you might act on these thoughts, call ${CRISIS.emergency} or go to the nearest hospital emergency.`}</T>
        </Section>
      ) : null}
      <Section title="What to do next">
        {steps.map((s) => (
          <T key={s}>{`· ${s}`}</T>
        ))}
        {extra !== null && inst.extra ? <T v="small" tone="muted">{`You said these problems made life "${inst.extra.options[extra]!.toLowerCase()}".`}</T> : null}
      </Section>
      <T v="small" tone="muted">
        A questionnaire can't diagnose anything. Only a qualified professional who talks with you can. Results can also change from week to week.
      </T>
      {!urgent ? <CrisisLine /> : null}
    </Screen>
  );
}
