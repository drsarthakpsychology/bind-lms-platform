import { router } from "expo-router";
import { ArrowRight, BookOpen, ChevronDown, ClipboardList, Eye, MessageCircle, Phone, Pill, Puzzle, RefreshCw, TriangleAlert, Users } from "lucide-react-native";
import * as React from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Jyo, Label, LAYER_OVERLAP, layerShadow, Row, RowList, Sheet, Stone, T } from "@/ds";
import { openLink } from "@/lib/open";
import { MaskLine, Press, springs, Swap, useMotionTier } from "@/motion";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";
import type { IconName } from "@/visitor/art";
import { HomeWordsCtx, useHomeWords, useWords } from "@/visitor/home-data";
import { useIntro, useIntroSpring } from "@/visitor/motion";

const G = layout.gutter;
/** Height of the top bar under the status bar. */
const BAR_H = 56;
/** How much of the story layer shows above the dock when the screen opens. */
const PEEK = 44;

/** The "Jump to" sheet's places, in page order. */
const JUMPS = [
  { id: "get", name: "What you get" },
  { id: "faculty", name: "Faculty" },
  { id: "week", name: "Your week" },
  { id: "join", name: "Joining" },
] as const;
type JumpId = (typeof JUMPS)[number]["id"];

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
/** The story's own drawing names, as line icons. */
const STEP_ICON: Partial<Record<IconName, IconType>> = { chat: MessageCircle, eye: Eye, alert: TriangleAlert, clipboard: ClipboardList, book: BookOpen, pill: Pill, puzzle: Puzzle, family: Users, loop: RefreshCw };

/** The story scrolls on one stage: where the scroll is, how tall the window is, where the story layer starts. */
type Stage = { y: SharedValue<number>; vh: SharedValue<number>; layerTop: SharedValue<number>; reduce: boolean };
const StageCtx = React.createContext<Stage | null>(null);

/**
 * Welcome, in the Layers look: the homepage story told as an app.
 * The blue field opens with the name, Jyo saying hello and the promise. The
 * soft story layer rises over it and scrolls: patients, why VIBHA, the whole
 * plan, what you get, the curriculum, the week, the faculty, how to join.
 * Sign in is the hero: it sits in the sheet at the bottom the whole time,
 * with Request an invitation just under it.
 */
export function WelcomeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const reduce = !!useReducedMotion();
  const y = useSharedValue(0);
  const vh = useSharedValue(height);
  const ch = useSharedValue(1);
  const layerTop = useSharedValue(height);
  const [dockH, setDockH] = React.useState(148);
  const words = useHomeWords();
  const scroll = React.useRef<React.ComponentRef<typeof Animated.ScrollView>>(null);
  const tops = React.useRef<Partial<Record<JumpId, number>>>({});
  const layerY = React.useRef(0);
  const mark = React.useCallback((id: JumpId) => (top: number) => void (tops.current[id] = top), []);
  const [jumpOpen, setJumpOpen] = React.useState(false);
  const closeJump = React.useCallback(() => setJumpOpen(false), []);
  const jump = (id: JumpId) => {
    setJumpOpen(false);
    const top = tops.current[id];
    // Land just under the top bar.
    if (top !== undefined) scroll.current?.scrollTo({ y: Math.max(0, layerY.current + top - BAR_H - space[4]), animated: !reduce });
  };

  // The field is blue in both themes: white clock and battery here.
  useLightStatusBar();

  const onScroll = useAnimatedScrollHandler((e) => {
    y.value = e.contentOffset.y;
  });
  const stage = React.useMemo(() => ({ y, vh, layerTop, reduce }), [y, vh, layerTop, reduce]);
  const barTop = insets.top + BAR_H;
  // The opening fills the window down to the dock, less a strip of the story layer.
  const heroMin = Math.max(420, height - barTop - dockH - PEEK);

  return (
    <HomeWordsCtx.Provider value={words}>
      <StageCtx.Provider value={stage}>
        <View testID="welcome" style={{ flex: 1, backgroundColor: c.field }}>
          <Animated.ScrollView
            ref={scroll}
            testID="welcome-scroll"
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onLayout={(e) => vh.set(e.nativeEvent.layout.height)}
            onContentSizeChange={(_, h) => ch.set(h)}
            contentContainerStyle={{ paddingTop: barTop }}
          >
            <Opening minHeight={heroMin} />
            <View
              testID="welcome-story"
              onLayout={(e) => {
                layerY.current = e.nativeEvent.layout.y;
                layerTop.set(e.nativeEvent.layout.y);
              }}
              style={[{ marginTop: -LAYER_OVERLAP, backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, paddingTop: space[5], paddingBottom: dockH + space[6] }, layerShadow(c)]}
            >
              <View style={{ width: "100%", maxWidth: 640, alignSelf: "center", gap: space[7] }}>
                <QuickAnswers />
                <Patients />
                <Different />
                <Journey />
                <WhatYouGet onTop={mark("get")} />
                <Curriculum />
                <YourWeek onTop={mark("week")} />
                <Faculty onTop={mark("faculty")} />
                <Joining onTop={mark("join")} />
                <Closing />
              </View>
            </View>
          </Animated.ScrollView>
          <TopBar y={y} ch={ch} vh={vh} topInset={insets.top} onJump={() => setJumpOpen(true)} />
          <Sheet open={jumpOpen} onClose={closeJump} title="Jump to" testID="welcome-jump-sheet">
            <RowList still>
              {JUMPS.map((j) => (
                <Row key={j.id} testID={`welcome-jump-${j.id}`} title={j.name} onPress={() => jump(j.id)} />
              ))}
            </RowList>
          </Sheet>
          <Dock onHeight={setDockH} />
        </View>
      </StageCtx.Provider>
    </HomeWordsCtx.Provider>
  );
}

/* ================================================================ chrome */

/**
 * The top of the field: the name (its letters drop in once), "Jump to", and
 * a thin line that fills as the story is read. It is solid, so the story
 * layer slides under it.
 */
function TopBar({ y, ch, vh, topInset, onJump }: { y: SharedValue<number>; ch: SharedValue<number>; vh: SharedValue<number>; topInset: number; onJump: () => void }) {
  const c = useTheme();
  const line = useAnimatedStyle(() => {
    const max = Math.max(1, ch.value - vh.value);
    return { transform: [{ scaleX: interpolate(y.value, [0, max], [0, 1], Extrapolation.CLAMP) }] };
  });
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, paddingTop: topInset, backgroundColor: c.field }}>
      <View style={{ height: BAR_H, paddingLeft: G, paddingRight: space[3], flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <Name />
        <Press onPress={onJump} testID="welcome-jump" accessibilityRole="button" accessibilityLabel="Jump to a part of this page" innerStyle={{ minHeight: 44, paddingLeft: space[4], paddingRight: space[3], borderRadius: 22, backgroundColor: c.fieldTint, flexDirection: "row", alignItems: "center", gap: space[1] }}>
          <T v="small" tone="onField" style={{ fontFamily: fonts.bold }}>
            Jump to
          </T>
          <ChevronDown size={18} color={c.onField} strokeWidth={2.2} />
        </Press>
      </View>
      <View style={{ height: 3, backgroundColor: c.fieldTint }}>
        <Animated.View style={[{ flex: 1, backgroundColor: c.onField, transformOrigin: "left" }, line]} />
      </View>
    </View>
  );
}

/** V-I-B-H-A drop in one by one and settle: the wordmark reveal. */
function Name() {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="VIBHA School of Psychology" style={{ flexDirection: "row" }}>
      {"VIBHA".split("").map((ch, i) => (
        <DropLetter key={i} ch={ch} i={i} />
      ))}
    </View>
  );
}

function DropLetter({ ch, i }: { ch: string; i: number }) {
  const c = useTheme();
  const t = useIntroSpring(60 + i * 70, springs.bouncy);
  const anim = useAnimatedStyle(() => ({ opacity: Math.min(1, t.value * 2), transform: [{ translateY: (1 - t.value) * -28 }, { rotate: `${(1 - t.value) * (i % 2 ? 12 : -12)}deg` }] }));
  return (
    <Animated.Text allowFontScaling={false} style={[{ fontFamily: fonts.wordmark, fontSize: 26, lineHeight: 30, color: c.onField, letterSpacing: -0.4 }, anim]}>
      {ch}
    </Animated.Text>
  );
}

/** Sign in, always one tap away, on a sheet that rises as the opening plays. Request an invitation just under it. */
function Dock({ onHeight }: { onHeight: (h: number) => void }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const t = useIntroSpring(520, springs.sheet);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - t.value) * 180 }] }));
  return (
    <Animated.View onLayout={(e) => onHeight(e.nativeEvent.layout.height)} style={[{ position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: c.raised, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, paddingTop: space[4], paddingHorizontal: G, paddingBottom: Math.max(insets.bottom, space[2]) + space[1] }, layerShadow(c), anim]}>
      <View style={{ width: "100%", maxWidth: 480, alignSelf: "center" }}>
        <Button label="Sign in" onPress={() => router.push("/sign-in")} testID="welcome-sign-in" accessibilityHint="For students with a VIBHA account" />
        <Press onPress={() => router.push("/request")} testID="welcome-request" accessibilityRole="button" accessibilityLabel="New here? Request an invitation" hitSlop={4} innerStyle={{ minHeight: layout.target, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: space[1] }}>
          <T v="small" tone="muted">
            New here?
          </T>
          <T v="button" tone="link">
            Request an invitation
          </T>
        </Press>
      </View>
    </Animated.View>
  );
}

/* =============================================================== opening */

function Opening({ minHeight }: { minHeight: number }) {
  const { width } = useWindowDimensions();
  const { STICKERS } = useWords();
  const c = useTheme();
  const w = Math.min(width, 640);
  // "Psychology." fills most of the width; the first line takes its size from it.
  const big = Math.min(56, Math.floor((w - G * 2) / 6.4));
  return (
    <View testID="welcome-opening" style={{ minHeight: minHeight + LAYER_OVERLAP, paddingTop: space[4], paddingBottom: space[5] + LAYER_OVERLAP, justifyContent: "space-between", gap: space[5] }}>
      <View style={{ paddingHorizontal: G, gap: space[5], width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <Hello />
        <Headline big={big} />
        <Lede />
      </View>
      {/* What the sixteen weeks hold, as a row you can flick through. */}
      <FadeUp delay={1000}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: G, gap: space[2] }} accessibilityLabel={`In the programme: ${STICKERS.join(", ")}`}>
          {STICKERS.map((s) => (
            <View key={s} style={{ minHeight: 36, paddingHorizontal: space[4], borderRadius: 18, backgroundColor: c.fieldTint, justifyContent: "center" }}>
              <T v="small" tone="onField">
                {s}
              </T>
            </View>
          ))}
        </ScrollView>
      </FadeUp>
    </View>
  );
}

/** Jyo arrives with a small bounce and says the school's line. */
function Hello() {
  const c = useTheme();
  const { HERO } = useWords();
  const pop = useIntroSpring(260, springs.bouncy);
  const jyo = useAnimatedStyle(() => ({ opacity: Math.min(1, pop.value * 2), transform: [{ scale: 0.9 + pop.value * 0.1 }, { translateY: (1 - pop.value) * 14 }] }));
  const say = useIntroSpring(700, springs.bouncy);
  const bubble = useAnimatedStyle(() => ({ opacity: Math.min(1, say.value * 2), transform: [{ scale: 0.92 + say.value * 0.08 }, { translateX: (1 - say.value) * -8 }] }));
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
      <Animated.View style={jyo}>
        <Jyo pose="hello" size={88} label="Jyo, a small clay lamp, says hello" />
      </Animated.View>
      <Animated.View style={[{ backgroundColor: c.fieldTint, borderRadius: layout.radius, borderBottomLeftRadius: 6, paddingHorizontal: space[4], paddingVertical: space[3], transformOrigin: "left", flexShrink: 1 }, bubble]}>
        <T v="bodyStrong" tone="onField">
          {HERO.bubble}
        </T>
      </Animated.View>
    </View>
  );
}

function FadeUp({ delay, children, style }: { delay: number; children: React.ReactNode; style?: object }) {
  const t = useIntro(delay, 600);
  const anim = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ translateY: (1 - t.value) * 14 }] }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

/** The promise: each line rises out of its own mask, one after another. */
function Headline({ big }: { big: number }) {
  const c = useTheme();
  const { HERO } = useWords();
  const small = Math.round(big * 0.54);
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={HERO.lines.join(" ")} style={{ gap: 2 }}>
      <MaskLine delay={380} h={Math.round(small * 1.2)}>
        <Text allowFontScaling={false} style={{ fontFamily: fonts.display, fontSize: small, lineHeight: Math.round(small * 1.2), color: c.onFieldMuted }}>
          {HERO.lines[0]}
        </Text>
      </MaskLine>
      <MaskLine delay={500} h={Math.round(big * 1.08)}>
        <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.display, fontSize: big, lineHeight: Math.round(big * 1.08), letterSpacing: -big * 0.025, color: c.onField }}>
          {HERO.lines[1]}
        </Text>
      </MaskLine>
      <MaskLine delay={640} h={Math.round(big * 1.12)}>
        <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.display, fontSize: big, lineHeight: Math.round(big * 1.12), letterSpacing: -big * 0.025, color: c.onField }}>
          {HERO.lines[2]}
        </Text>
      </MaskLine>
    </View>
  );
}

function Lede() {
  const { HERO } = useWords();
  return (
    <FadeUp delay={860}>
      <T tone="onFieldMuted" style={{ maxWidth: 520 }}>
        {HERO.lede}
      </T>
    </FadeUp>
  );
}

/* ============================================================ story parts */

/**
 * A part of the story: it rises a little and fades in as it scrolls into
 * view (UI thread, tied to the scroll). Low-end Android: a fade. Reduce
 * Motion: it is simply there. `onTop` reports where it starts, for "Jump to".
 */
function Part({ children, onTop, testID, bleed }: { children: React.ReactNode; onTop?: (y: number) => void; testID?: string; /** No side margin (it holds a sideways row). */ bleed?: boolean }) {
  const stage = React.useContext(StageCtx);
  const { low } = useMotionTier();
  const local = useSharedValue(0);
  const anim = useAnimatedStyle(() => {
    if (!stage || stage.reduce) return { opacity: 1 };
    const at = stage.layerTop.value + local.value;
    const v = interpolate(stage.y.value + stage.vh.value * 0.94 - at, [0, 150], [0, 1], Extrapolation.CLAMP);
    const e = 1 - Math.pow(1 - v, 3);
    return low ? { opacity: v } : { opacity: v, transform: [{ translateY: (1 - e) * 28 }] };
  });
  return (
    <Animated.View
      testID={testID}
      onLayout={(e) => {
        local.set(e.nativeEvent.layout.y);
        onTop?.(e.nativeEvent.layout.y);
      }}
      style={[{ gap: space[4], paddingHorizontal: bleed ? 0 : G }, anim]}
    >
      {children}
    </Animated.View>
  );
}

/** A part's heading: the quiet label, the title, its second half in the accent colour, an optional line. */
function Head({ tag, title, accent, sub, pad }: { tag: string; title: string; accent?: string; sub?: string; /** Add the side margin (inside a bleeding part). */ pad?: boolean }) {
  return (
    <View style={{ gap: space[2], paddingHorizontal: pad ? G : 0 }}>
      <Label>{tag}</Label>
      <View style={{ paddingHorizontal: space[1] }}>
        <T v="h1" accessibilityRole="header">
          {title}
        </T>
        {accent ? (
          <T v="h1" tone="link">
            {accent}
          </T>
        ) : null}
      </View>
      {sub ? (
        <T tone="muted" style={{ paddingHorizontal: space[1], maxWidth: 560 }}>
          {sub}
        </T>
      ) : null}
    </View>
  );
}

/** A numbered step: an ink disc, the title, one quiet line. */
function Step({ n, title, text }: { n: number; title: string; text?: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}>
        <T v="small" tone="onInk" num maxFontSizeMultiplier={1.2}>
          {n}
        </T>
      </View>
      <View style={{ flex: 1, gap: 2, paddingTop: 3 }}>
        <T v="bodyStrong">{title}</T>
        {text ? (
          <T v="small" tone="muted">
            {text}
          </T>
        ) : null}
      </View>
    </View>
  );
}

/** A sideways row of cards that stop one at a time. */
function Cards({ children, width, label }: { children: React.ReactNode; width: number; label: string }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={width + space[3]} snapToAlignment="start" accessibilityLabel={label} contentContainerStyle={{ paddingHorizontal: G, gap: space[3] }}>
      {children}
    </ScrollView>
  );
}

function useCardWidth(): number {
  const { width } = useWindowDimensions();
  return Math.round(Math.min(320, Math.min(width, 640) - G * 2 - 44));
}

function Chip({ children }: { children: string }) {
  const c = useTheme();
  return (
    <View style={{ minHeight: 36, paddingHorizontal: space[4], borderRadius: 18, backgroundColor: c.card, justifyContent: "center" }}>
      <T v="small">{children}</T>
    </View>
  );
}

function Initials({ text, size = 44 }: { text: string; size?: number }) {
  const c = useTheme();
  const a = c.areas.learn;
  return (
    <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
      <Text allowFontScaling={false} style={{ fontFamily: fonts.bold, fontSize: Math.round(size * 0.34), color: a.deep }}>
        {text}
      </Text>
    </View>
  );
}

/* ============================================================== the story */

function QuickAnswers() {
  const c = useTheme();
  const { QUICK_ANSWERS } = useWords();
  return (
    <Part testID="welcome-answers">
      <Label>Quick answers</Label>
      <Stone>
        <View style={{ gap: space[4] }}>
          {QUICK_ANSWERS.map((qa, i) => (
            <View key={qa.q} style={{ gap: 2, paddingTop: i ? space[4] : 0, borderTopWidth: i ? 1 : 0, borderColor: c.hairline }}>
              <T v="bodyStrong">{qa.q}</T>
              <T v="small" tone="muted">
                {qa.a}
              </T>
            </View>
          ))}
        </View>
      </Stone>
    </Part>
  );
}

function Patients() {
  const { PATIENTS } = useWords();
  return (
    <Part testID="welcome-patients">
      <Head tag={PATIENTS.tag} title={PATIENTS.title} accent={PATIENTS.accent} sub={PATIENTS.sub} />
      <Stone>
        <View style={{ gap: space[4] }}>
          {PATIENTS.steps.map((s, i) => (
            <Step key={s.title} n={i + 1} title={s.title} text={s.text} />
          ))}
        </View>
      </Stone>
    </Part>
  );
}

function Different() {
  const c = useTheme();
  const { DIFFERENT } = useWords();
  const w = useCardWidth();
  return (
    <Part testID="welcome-different" bleed>
      <Head pad tag={DIFFERENT.tag} title={DIFFERENT.title} accent={DIFFERENT.accent} sub={DIFFERENT.sub} />
      <Cards width={w} label="College and VIBHA, side by side. Swipe for more.">
        {DIFFERENT.rows.map((r) => (
          <Stone key={r.vibha} style={{ width: w }}>
            <View style={{ gap: space[3], minHeight: 164 }}>
              <View style={{ gap: 2 }}>
                <T v="caption" tone="faint">
                  At college
                </T>
                <T tone="muted">{r.college}</T>
              </View>
              <View style={{ height: 1, backgroundColor: c.hairline }} />
              <View style={{ gap: 2 }}>
                <T v="caption" tone="link">
                  At VIBHA
                </T>
                <T v="h3">{r.vibha}</T>
              </View>
            </View>
          </Stone>
        ))}
      </Cards>
      <T v="h2" style={{ paddingHorizontal: G + space[1] }}>
        {DIFFERENT.manifesto}
      </T>
    </Part>
  );
}

function Journey() {
  const c = useTheme();
  const { JOURNEY } = useWords();
  const w = useCardWidth();
  const a = c.areas.learn;
  return (
    <Part testID="welcome-journey" bleed>
      <Head pad tag={JOURNEY.tag} title={JOURNEY.title} accent={JOURNEY.accent} />
      <View style={{ paddingHorizontal: G }}>
        <Stone quiet>
          <T v="caption" tone="faint">
            {`One patient, start to finish: ${JOURNEY.disorder}`}
          </T>
          <T style={{ marginTop: space[1] }}>{JOURNEY.patient}</T>
        </Stone>
      </View>
      <Cards width={w} label={`The ${JOURNEY.steps.length} steps of the plan. Swipe for more.`}>
        {JOURNEY.steps.map((s, i) => {
          const Icon = STEP_ICON[s.icon] ?? ClipboardList;
          return (
            <Stone key={s.k} style={{ width: w }}>
              <View style={{ gap: space[3], minHeight: 188 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} color={a.deep} strokeWidth={2} />
                  </View>
                  <T v="caption" tone="faint" num>{`${i + 1} of ${JOURNEY.steps.length}`}</T>
                </View>
                <View style={{ gap: 2 }}>
                  <T v="caption" tone="link">
                    {s.k}
                  </T>
                  <T v="h2">{s.title}</T>
                </View>
                <T v="small" tone="muted">
                  {s.text}
                </T>
              </View>
            </Stone>
          );
        })}
      </Cards>
      <T v="small" tone="muted" style={{ paddingHorizontal: G + space[1] }}>
        {JOURNEY.foot}
      </T>
    </Part>
  );
}

function WhatYouGet({ onTop }: { onTop: (y: number) => void }) {
  const { GET } = useWords();
  return (
    <Part testID="welcome-get" onTop={onTop}>
      <Head tag={GET.tag} title={GET.title} accent={GET.accent} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3] }}>
        {GET.stats.map((s) => (
          <Stone key={s.t} style={{ flexGrow: 1, flexBasis: "45%" }}>
            <View accessible accessibilityLabel={`${s.n} ${s.t}`} style={{ gap: space[1], minHeight: 96 }}>
              <T num style={{ fontFamily: fonts.big, fontSize: 38, lineHeight: 42, letterSpacing: -0.8 }} maxFontSizeMultiplier={1.2}>
                {s.n}
              </T>
              <T v="small" tone="muted">
                {s.t}
              </T>
            </View>
          </Stone>
        ))}
      </View>
      <Stone quiet>
        <T v="bodyStrong">A certificate that says what you can do</T>
        <T v="small" tone="muted" style={{ marginTop: space[1] }}>
          {GET.certificate}
        </T>
      </Stone>
    </Part>
  );
}

function Curriculum() {
  const { DISCIPLINES } = useWords();
  return (
    <Part testID="welcome-curriculum">
      <Head tag={DISCIPLINES.tag} title={DISCIPLINES.title} accent={DISCIPLINES.accent} sub={DISCIPLINES.sub} />
      <Stone>
        <View style={{ gap: space[4] }}>
          {DISCIPLINES.items.map((d, i) => (
            <Step key={d.name} n={i + 1} title={d.name} text={d.text} />
          ))}
        </View>
      </Stone>
    </Part>
  );
}

function YourWeek({ onTop }: { onTop: (y: number) => void }) {
  const c = useTheme();
  const { WEEK } = useWords();
  const reduce = useReducedMotion();
  const [weekend, setWeekend] = React.useState(false);
  const [w, setW] = React.useState(0);
  const x = useSharedValue(0);
  const pick = (v: boolean) => {
    setWeekend(v);
    const to = v ? w / 2 : 0;
    x.set(reduce ? to : withSpring(to, springs.snappy));
  };
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const day = weekend ? WEEK.weekend : WEEK.weekday;
  return (
    <Part testID="welcome-week" onTop={onTop}>
      <Head tag={WEEK.tag} title={WEEK.title} accent={WEEK.accent} sub={WEEK.sub} />
      {/* The week at a glance: the days of the kind you picked are ink. */}
      <View accessible accessibilityLabel={weekend ? "Saturday and Sunday: live discussions" : "Monday to Friday: patient batches"} style={{ flexDirection: "row", gap: space[1] }}>
        {WEEK.days.map((d) => {
          const on = d.live === weekend;
          return (
            <View key={d.d} style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: on ? c.ink : c.card, alignItems: "center", justifyContent: "center" }}>
              <T v="caption" tone={on ? "onInk" : "muted"} maxFontSizeMultiplier={1.1}>
                {d.d}
              </T>
            </View>
          );
        })}
      </View>
      <View accessibilityRole="tablist" onLayout={(e) => setW(e.nativeEvent.layout.width - 8)} style={{ flexDirection: "row", backgroundColor: c.card, borderRadius: 26, padding: 4 }}>
        {w > 0 ? <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 4, top: 4, bottom: 4, width: w / 2, borderRadius: 22, backgroundColor: c.raised }, pill]} /> : null}
        {[false, true].map((v) => (
          <Press key={String(v)} accessibilityRole="tab" accessibilityState={{ selected: weekend === v }} onPress={() => pick(v)} feel="none" style={{ flex: 1 }} innerStyle={{ minHeight: 44, alignItems: "center", justifyContent: "center" }} testID={v ? "week-weekend" : "week-weekday"}>
            <T v="small" tone={weekend === v ? "ink" : "muted"} style={{ fontFamily: fonts.bold }}>
              {v ? "A weekend" : "A weekday"}
            </T>
          </Press>
        ))}
      </View>
      <Swap k={weekend ? "we" : "wd"} dir={weekend ? 1 : -1}>
        <Stone>
          <View style={{ gap: space[4] }}>
            <View style={{ gap: 2 }}>
              <T v="caption" tone="link">
                {day.tag}
              </T>
              <T v="h2">{day.title}</T>
              <T v="small" tone="muted">
                {day.sub}
              </T>
            </View>
            {day.steps.map((s, i) => (
              <Step key={s} n={i + 1} title={s} />
            ))}
          </View>
        </Stone>
      </Swap>
    </Part>
  );
}

function Faculty({ onTop }: { onTop: (y: number) => void }) {
  const c = useTheme();
  const { FACULTY } = useWords();
  return (
    <Part testID="welcome-faculty" onTop={onTop}>
      <Head tag={FACULTY.tag} title={FACULTY.title} accent={FACULTY.accent} sub={FACULTY.sub} />
      <Stone>
        <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
          <Initials text={FACULTY.lead.initials} size={56} />
          <View style={{ flex: 1, gap: 2 }}>
            <T v="caption" tone="link">
              {FACULTY.lead.role}
            </T>
            <T v="h3">{FACULTY.lead.name}</T>
            <T v="small" tone="muted">
              {FACULTY.lead.text}
            </T>
          </View>
        </View>
      </Stone>
      <Stone>
        <View style={{ gap: space[3] }}>
          {FACULTY.people.map((p, i) => (
            <View key={`${p.name}${i}`} style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
              <Initials text={p.initials} size={40} />
              <View style={{ flex: 1 }}>
                <T v="bodyStrong">{p.name}</T>
                <T v="small" tone="muted">
                  {p.role}
                </T>
              </View>
            </View>
          ))}
        </View>
      </Stone>
      <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
        {FACULTY.note}
      </T>
      <View style={{ gap: space[2] }}>
        <Label>Run by</Label>
        <Stone quiet>
          <View style={{ gap: space[3] }}>
            {FACULTY.runBy.map((p, i) => (
              <View key={p.name} style={{ paddingTop: i ? space[3] : 0, borderTopWidth: i ? 1 : 0, borderColor: c.hairline }}>
                <T v="bodyStrong">{p.name}</T>
                <T v="small" tone="muted">
                  {p.role}
                </T>
              </View>
            ))}
          </View>
        </Stone>
      </View>
    </Part>
  );
}

function Joining({ onTop }: { onTop: (y: number) => void }) {
  const c = useTheme();
  const { JOIN, CLOSING } = useWords();
  return (
    <Part testID="welcome-join" onTop={onTop}>
      <Head tag={JOIN.tag} title={JOIN.title} accent={JOIN.accent} sub={JOIN.sub} />
      <View style={{ gap: space[2] }}>
        <Label>Who it is for</Label>
        <Stone>
          <View style={{ gap: space[4] }}>
            {JOIN.who.map((p, i) => (
              <View key={p.title} style={{ gap: 2, paddingTop: i ? space[4] : 0, borderTopWidth: i ? 1 : 0, borderColor: c.hairline }}>
                <T v="bodyStrong">{p.title}</T>
                <T v="small" tone="muted">
                  {p.text}
                </T>
              </View>
            ))}
          </View>
        </Stone>
        <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
          {JOIN.whoLabel}
        </T>
      </View>
      <View style={{ gap: space[2] }}>
        <Label>Your fee depends on</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {JOIN.dependsOn.map((d) => (
            <Chip key={d}>{d}</Chip>
          ))}
        </View>
      </View>
      <View style={{ gap: space[2] }}>
        <Label>Ways to pay</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {JOIN.pay.map((d) => (
            <Chip key={d}>{d}</Chip>
          ))}
        </View>
      </View>
      <View style={{ gap: space[2] }}>
        <Label>Three steps</Label>
        <Stone>
          <View style={{ gap: space[4] }}>
            {JOIN.steps.map((s, i) => (
              <Step key={s.title} n={i + 1} title={s.title} text={s.text} />
            ))}
          </View>
        </Stone>
      </View>
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <View style={{ flex: 1 }}>
          <Button kind="quiet" label="Call us" icon={<Phone size={18} color={c.ink} strokeWidth={2} />} onPress={() => void openLink(CLOSING.phoneHref)} testID="welcome-call" accessibilityHint={CLOSING.phone} />
        </View>
        <View style={{ flex: 1 }}>
          <Button kind="quiet" label="WhatsApp" icon={<MessageCircle size={18} color={c.ink} strokeWidth={2} />} onPress={() => void openLink(CLOSING.whatsappHref)} testID="welcome-whatsapp" />
        </View>
      </View>
      <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
        {CLOSING.address}
      </T>
    </Part>
  );
}

/** The last word, and the way in for someone new. */
function Closing() {
  const c = useTheme();
  const { CLOSING } = useWords();
  return (
    <Part testID="welcome-closing">
      <View style={{ paddingHorizontal: space[1] }}>
        <T v="display" tone="muted">
          {CLOSING.a}
        </T>
        <T v="display">{CLOSING.b}</T>
      </View>
      <Stone onPress={() => router.push("/request")} accessibilityLabel="Request an invitation" testID="welcome-closing-request">
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <View style={{ flex: 1, gap: 2 }}>
            <T v="h3">Request an invitation</T>
            <T v="small" tone="muted">
              A short form. We read every request ourselves.
            </T>
          </View>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={20} color={c.bg} strokeWidth={2.2} />
          </View>
        </View>
      </Stone>
    </Part>
  );
}
