import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, Check, Hand, Phone, Shuffle, StretchVertical, Wind } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Field, Label, Layer, pebbleShape, QuietEmpty, Row, RowList, Stone, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { BackBar, EntryCard, IconPatch, leave, OwnHeader, Page, PlayShell, type IconType } from "@/lab/shell";
import { curves, Enter, GrowIn, Press, Swap } from "@/motion";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";
import { BreathingScreen, BreathPebble } from "./breath";
import { CALM_TOOLS, CRISIS, MUSCLE_GROUPS, RELEASE_SECS, SENSES, TENSE_SECS, type CalmId } from "./data";

const ICON: Record<CalmId, IconType> = { breathing: Wind, grounding: Hand, muscles: StretchVertical, worry: Shuffle };

/** One line to a person, on every calm and self-check screen. Opens the phone's dialler. */
export function HelpLine({ urgent }: { urgent?: boolean }) {
  const c = useTheme();
  return (
    <RowList bare>
      <Row testID="help-line" title={urgent ? "Please talk to someone today" : "Need to talk to someone right now?"} meta={`Call ${CRISIS.name} on ${CRISIS.number}. Free, private, day and night. In danger, call ${CRISIS.emergency}.`} icon={<Phone size={20} color={urgent ? c.danger : c.ink} />} accessibilityLabel={`Call ${CRISIS.name} on ${CRISIS.number}`} onPress={() => void Linking.openURL(CRISIS.href).catch(() => undefined)} chevron={false} />
    </RowList>
  );
}

/** Calm: the short exercises. Breathing first, as the one to reach for. */
export function CalmHomeScreen() {
  const c = useTheme();
  const first = CALM_TOOLS[0]!;
  return (
    <Page testID="calm-home" home="/home" title="Calm" lead="Short exercises for a hard moment. Nothing is saved." area="me">
      <Enter i={0}>
        <Stone testID="calm-breathing-card" accessibilityLabel={`${first.title}. ${first.minutes}`} grow={() => router.push("/calm/breathing")} pad={space[5]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
            <View style={[{ width: 76, height: 76, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }, pebbleShape(2), { borderTopLeftRadius: 36, borderTopRightRadius: 41, borderBottomRightRadius: 35, borderBottomLeftRadius: 40 }]}>
              <Wind size={28} color={c.onLime} strokeWidth={1.9} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
              <T v="h2">{first.title}</T>
              <T v="small" tone="muted">
                {first.text}
              </T>
            </View>
          </View>
        </Stone>
      </Enter>
      <Enter i={1}>
        <View style={{ gap: space[2] }}>
          <Label>More ways to settle</Label>
          <View style={{ gap: space[3] }}>
            {CALM_TOOLS.slice(1).map((t) => (
              <EntryCard key={t.id} testID={`calm-${t.id}-card`} icon={ICON[t.id]} area="me" title={t.title} meta={`${t.minutes} · ${t.text}`} href={`/calm/${t.id}`} />
            ))}
          </View>
        </View>
      </Enter>
      <Enter i={2}>
        <HelpLine />
      </Enter>
    </Page>
  );
}

/** /calm/:id */
export function CalmToolScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  if (id === "breathing") return <BreathingScreen />;
  if (id === "grounding") return <GroundingScreen />;
  if (id === "muscles") return <MusclesScreen />;
  if (id === "worry") return <WorryScreen />;
  return (
    <Page testID="calm-missing" home="/calm" title="Calm">
      <QuietEmpty title="That exercise is not here" body="Choose one from the list." action={{ label: "All calm exercises", onPress: () => router.replace("/calm") }} />
    </Page>
  );
}

function Why({ id }: { id: CalmId }) {
  const tool = CALM_TOOLS.find((t) => t.id === id)!;
  return (
    <View style={{ gap: space[1] }}>
      <Label>Why this helps</Label>
      <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
        {tool.why}
      </T>
    </View>
  );
}

/** One thing noticed: a pebble that fills when tapped. */
function NoticeDot({ i, on, onPress }: { i: number; on: boolean; onPress: () => void }) {
  const c = useTheme();
  return (
    <Press testID={`notice-${i}`} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`Thing ${i + 1}${on ? ", noticed" : ""}`} feel="select" onPress={onPress} scale={0.88} squish innerStyle={[{ width: 52, height: 52, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.ink : c.card }, pebbleShape(i)]}>
      {on ? <Check size={20} color={c.bg} strokeWidth={2.6} /> : null}
    </Press>
  );
}

/** 5-4-3-2-1 grounding: one sense at a time; tap a pebble for each thing you notice. */
export function GroundingScreen() {
  const [step, setStep] = React.useState(0);
  const [seen, setSeen] = React.useState<number[]>([]);
  const done = step >= SENSES.length;
  const sense = SENSES[Math.min(step, SENSES.length - 1)]!;
  const next = () => {
    setSeen([]);
    setStep((s) => s + 1);
  };
  return (
    <PlayShell
      testID="calm-grounding"
      done={Math.min(step, SENSES.length)}
      total={SENSES.length}
      onClose={() => leave("/calm")}
      footer={done ? <Button kind="quiet" label="Back to calm" testID="grounding-done" onPress={() => leave("/calm")} /> : <Button label={step === SENSES.length - 1 ? "Finish" : "Next"} testID="grounding-next" onPress={next} />}
    >
      <Swap k={step} dir={1}>
        {done ? (
          <View style={{ gap: space[3], paddingTop: space[5] }}>
            <T v="h1">You are here, in this room, right now.</T>
            <T tone="muted">Take one slow breath before you carry on.</T>
          </View>
        ) : (
          <View style={{ gap: space[5] }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[3] }}>
              <T num maxFontSizeMultiplier={1.15} style={{ fontFamily: fonts.big, fontSize: 72, lineHeight: 72, letterSpacing: -2 }}>
                {sense.n}
              </T>
              <T v="h2" style={{ paddingBottom: space[2] }}>
                {sense.n === 1 ? "thing" : "things"} you can {sense.verb}
              </T>
            </View>
            <T v="reading">{sense.prompt}</T>
            <View style={{ gap: space[2] }}>
              <Label>Tap one for each</Label>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
                {Array.from({ length: sense.n }, (_, i) => (
                  <NoticeDot key={i} i={i} on={seen.includes(i)} onPress={() => setSeen((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))} />
                ))}
              </View>
            </View>
          </View>
        )}
      </Swap>
      {done ? null : <Why id="grounding" />}
    </PlayShell>
  );
}

/** Muscle relaxation: tense for five seconds, release for fifteen, twelve muscle groups. The pebble squeezes and lets go with you. */
export function MusclesScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = !!useReducedMotion();
  useLightStatusBar(true);
  const per = TENSE_SECS + RELEASE_SECS;
  const total = MUSCLE_GROUPS.length * per;
  const [state, setState] = React.useState<"ready" | "running" | "done">("ready");
  const [t, setT] = React.useState(0);
  const p = useSharedValue(0.3);
  React.useEffect(() => {
    if (state !== "running") return;
    const start = Date.now();
    const id = setInterval(() => {
      const now = Math.floor((Date.now() - start) / 1000);
      if (now >= total) setState("done");
      else setT((old) => (old === now ? old : now));
    }, 250);
    return () => clearInterval(id);
  }, [state, total]);
  const g = Math.min(MUSCLE_GROUPS.length - 1, Math.floor(t / per));
  const within = t - g * per;
  const tense = within < TENSE_SECS;
  const [name, how] = MUSCLE_GROUPS[g]!;
  React.useEffect(() => {
    if (reduce) return;
    if (state !== "running") p.set(withTiming(0.3, { duration: 600, easing: curves.out }));
    // Tense: the pebble tightens quickly. Release: it opens slowly for the whole fifteen seconds.
    else if (tense) {
      haptic.select();
      p.set(withTiming(0, { duration: 900, easing: curves.out }));
    } else p.set(withTiming(1, { duration: RELEASE_SECS * 1000, easing: Easing.out(Easing.quad) }));
  }, [state, tense, g, reduce, p]);
  const left = tense ? TENSE_SECS - within : per - within;
  return (
    <GrowIn style={{ backgroundColor: c.field }}>
      <OwnHeader />
      <View testID="calm-muscles" style={{ flex: 1, paddingTop: insets.top }}>
        <BackBar home="/calm" />
        <View style={{ flex: 1, minHeight: 280, alignItems: "center", justifyContent: "center", gap: space[2], paddingBottom: space[5] }}>
          <BreathPebble p={p} live={state === "running" && tense} word={state === "running" ? (tense ? "Tense" : "Release") : state === "done" ? "Well done" : "Ready"} count={state === "running" ? left : null} size={208} />
          <T v="small" tone="onFieldMuted" num>
            {state === "running" ? `${g + 1} of ${MUSCLE_GROUPS.length}` : state === "done" ? "Let your whole body rest for a moment." : "Sit or lie down somewhere comfortable."}
          </T>
        </View>
        <Layer style={{ flex: 0, marginTop: 0, paddingBottom: insets.bottom + space[4], gap: space[4] }}>
          {state === "running" ? (
            <>
              <View accessibilityLiveRegion="polite" style={{ gap: space[1], minHeight: 84 }}>
                <T v="h2">{name}</T>
                <T tone="muted">{tense ? how : "Let go. Notice the difference."}</T>
              </View>
              <Button kind="quiet" label="Stop" testID="muscles-stop" onPress={() => setState("ready")} />
            </>
          ) : (
            <>
              <Why id="muscles" />
              <Button
                label={state === "done" ? "Go again" : "Start"}
                testID="muscles-start"
                onPress={() => {
                  setT(0);
                  setState("running");
                }}
              />
            </>
          )}
        </Layer>
      </View>
    </GrowIn>
  );
}

type WorryStage = "write" | "sort" | "plan" | "planned" | "letgo";

/** The worry floats up and fades when it is let go. With Reduce Motion it simply fades. */
function FloatAway({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(0);
  React.useEffect(() => {
    v.set(withDelay(500, withTiming(1, { duration: reduce ? 400 : 2600, easing: Easing.out(Easing.quad) })));
  }, [reduce, v]);
  const style = useAnimatedStyle(() => ({ opacity: 1 - v.value, transform: [{ translateY: reduce ? 0 : -70 * v.value }, { scale: 1 - 0.12 * v.value }] }));
  return (
    <Animated.View style={style} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Stone>
        <T>{text}</T>
      </Stone>
    </Animated.View>
  );
}

/** Worry sorter: write it, decide if you can act, then one small step or let it go. Kept only on this screen. */
export function WorryScreen() {
  const [stage, setStage] = React.useState<WorryStage>("write");
  const [worry, setWorry] = React.useState("");
  const [step, setStep] = React.useState("");
  const [when, setWhen] = React.useState("");
  const reset = () => {
    setWorry("");
    setStep("");
    setWhen("");
    setStage("write");
  };
  const footer =
    stage === "write" ? (
      <Button label="Next" testID="worry-next" disabled={worry.trim().length < 3} onPress={() => setStage("sort")} />
    ) : stage === "sort" ? (
      <>
        <Button label="Yes, there is something I can do" testID="worry-yes" onPress={() => setStage("plan")} />
        <Button kind="quiet" label="No, it is out of my hands" testID="worry-no" onPress={() => setStage("letgo")} />
      </>
    ) : stage === "plan" ? (
      <Button label="Save my step" testID="worry-plan" disabled={step.trim().length < 3} onPress={() => setStage("planned")} />
    ) : (
      <>
        <Button kind="quiet" label="Sort another worry" testID="worry-again" onPress={reset} />
        <Button kind="text" label="Back to calm" onPress={() => leave("/calm")} />
      </>
    );
  const order: WorryStage[] = ["write", "sort", "plan", "planned"];
  return (
    <PlayShell testID="calm-worry" done={stage === "letgo" ? 3 : order.indexOf(stage)} total={3} onClose={() => leave("/calm")} footer={footer}>
      <Swap k={stage} dir={1}>
        {stage === "write" ? (
          <View style={{ gap: space[4] }}>
            <T v="h1">What is on your mind?</T>
            <Field label="Write one worry" area value={worry} onChangeText={setWorry} placeholder="I am not ready for Monday" maxLength={300} testID="worry-input" />
            <T v="small" tone="muted">
              This stays on this screen. It is not saved or sent.
            </T>
          </View>
        ) : stage === "sort" ? (
          <View style={{ gap: space[4] }}>
            <Stone>
              <T>{worry.trim()}</T>
            </Stone>
            <T v="h1">Can you do something about it?</T>
            <T tone="muted">Even one small thing, today or this week.</T>
          </View>
        ) : stage === "plan" ? (
          <View style={{ gap: space[4] }}>
            <T v="h1">One small step</T>
            <Field label="What will you do" value={step} onChangeText={setStep} placeholder="Revise chapter 3 for 30 minutes" maxLength={160} testID="worry-step" />
            <Field label="When" value={when} onChangeText={setWhen} placeholder="Tomorrow at 7 am" maxLength={80} testID="worry-when" />
          </View>
        ) : stage === "planned" ? (
          <View style={{ gap: space[4] }}>
            <T v="h1">That is your plan</T>
            <Stone>
              <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
                <IconPatch icon={ArrowRight} area="me" size={40} />
                <View style={{ flex: 1, gap: 2 }}>
                  <T v="bodyStrong">{step.trim()}</T>
                  {when.trim() ? (
                    <T v="small" tone="muted">
                      {when.trim()}
                    </T>
                  ) : null}
                </View>
              </View>
            </Stone>
            <T tone="muted">The worry has a job now. Until then, you can put it down.</T>
          </View>
        ) : (
          <View style={{ gap: space[4] }}>
            <T v="h1">Let this one go</T>
            <FloatAway text={worry.trim()} />
            <T tone="muted" style={{ maxWidth: layout.readingWidth }}>
              This one is outside your control right now. Worrying more will not change it. Bring your attention back to what is in front of you.
            </T>
          </View>
        )}
      </Swap>
      {stage === "write" ? <Why id="worry" /> : null}
    </PlayShell>
  );
}
