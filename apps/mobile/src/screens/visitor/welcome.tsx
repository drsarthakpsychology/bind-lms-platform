import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { Check, ChevronDown, MessageCircle, Phone } from "lucide-react-native";
import * as React from "react";
import { openLink } from "@/lib/open";
import { ScrollView, Text, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedReaction, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useReducedMotion, useSharedValue, withSpring, type SharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Meme, Row, RowList, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { MaskLine, Press, Swap, presets } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import { Icon, Person, Sparkle, Star } from "@/visitor/Art";
import { HomeWordsCtx, useHomeWords, useWords } from "@/visitor/home-data";
import { BLUE, Chapter, DigitRoll, INK, LIME, Parallax, Reveal, ScrollStage, useScrollY, bouncy, snappy, useIntro, useIntroSpring } from "@/visitor/motion";
import { Dots, Face, Head, Initials, Pix } from "@/visitor/parts";

const G = layout.gutter;

/** The "Jump to" sheet's places, in page order. */
const JUMPS = [
  { id: "get", name: "What you get" },
  { id: "faculty", name: "Faculty" },
  { id: "week", name: "Your week" },
  { id: "join", name: "Joining" },
] as const;
type JumpId = (typeof JUMPS)[number]["id"];
/** Each place reports where its chapter starts. */
const JumpCtx = React.createContext<(id: JumpId) => (y: number) => void>(() => () => undefined);
const WHITE = "#ffffff";
/** Height of the top bar under the status bar. */
const BAR_H = 48;
const ON_BLUE_MUTED = "rgba(255,255,255,0.82)";

/**
 * Welcome: the app's version of the website homepage. An opening that plays
 * once (the name, the promise, the consultation room), then a story told by
 * scrolling: patients, why VIBHA, the whole plan, what you get, the
 * curriculum, the week, the faculty, how to join. Sign in stays one tap away
 * in the dock at the bottom the whole time; Request an invitation sits just
 * under it.
 */
export function WelcomeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const y = useSharedValue(0);
  const vh = useSharedValue(800);
  const ch = useSharedValue(1);
  const heroH = useSharedValue(600);
  const [dockH, setDockH] = React.useState(132);
  const words = useHomeWords();
  const reduce = useReducedMotion();
  const scroll = React.useRef<React.ComponentRef<typeof Animated.ScrollView>>(null);
  const tops = React.useRef<Partial<Record<JumpId, number>>>({});
  const mark = React.useCallback((id: JumpId) => (top: number) => void (tops.current[id] = top), []);
  const [jumpOpen, setJumpOpen] = React.useState(false);
  const closeJump = React.useCallback(() => setJumpOpen(false), []);
  const jump = (id: JumpId) => {
    setJumpOpen(false);
    const top = tops.current[id];
    // Land just under the top bar.
    if (top !== undefined) scroll.current?.scrollTo({ y: Math.max(0, top - insets.top - 44), animated: !reduce });
  };

  // The top of this screen is always brand blue, so the clock and battery are white here.
  useFocusEffect(
    React.useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle(c.dark ? "light" : "dark");
    }, [c.dark]),
  );

  const onScroll = useAnimatedScrollHandler((e) => {
    y.value = e.contentOffset.y;
  });

  return (
    <HomeWordsCtx.Provider value={words}>
    <View testID="welcome" style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollStage y={y} vh={vh}>
        <JumpCtx.Provider value={mark}>
        <Animated.ScrollView
          ref={scroll}
          testID="welcome-scroll"
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onLayout={(e) => vh.set(e.nativeEvent.layout.height)}
          onContentSizeChange={(_, h) => ch.set(h)}
          contentContainerStyle={{ backgroundColor: c.bg }}
        >
          <Opening topInset={insets.top} onHeight={(h) => heroH.set(h)} />
          <QuickAnswers />
          <Patients />
          <Different />
          <Journey />
          <WhatYouGet />
          <Curriculum />
          <YourWeek />
          <Faculty />
          <Joining />
          <Closing bottom={dockH} />
        </Animated.ScrollView>
        </JumpCtx.Provider>
      </ScrollStage>
      <TopBar y={y} ch={ch} vh={vh} heroH={heroH} topInset={insets.top} onJump={() => setJumpOpen(true)} />
      <Sheet open={jumpOpen} onClose={closeJump} title="Jump to" testID="welcome-jump-sheet">
        <RowList still>
          {JUMPS.map((j) => (
            <Row key={j.id} testID={`welcome-jump-${j.id}`} title={j.name} onPress={() => jump(j.id)} />
          ))}
          <Row testID="welcome-free" title="Free self-checks" meta="Low mood, worry, wellbeing and more, scored on your phone" onPress={() => {
            closeJump();
            router.push("/free");
          }} />
        </RowList>
      </Sheet>
      <Dock onHeight={setDockH} />
    </View>
    </HomeWordsCtx.Provider>
  );
}

/* ================================================================ chrome */

/**
 * A blue band behind the status bar; once the opening has scrolled away a
 * small solid bar slides down from under it with the name, "Jump to" and a
 * lime reading line. It is never see-through, so the sticker rows never show
 * through the name. While hidden it sits above the screen edge, so it takes
 * no taps.
 */
function TopBar({ y, ch, vh, heroH, topInset, onJump }: { y: SharedValue<number>; ch: SharedValue<number>; vh: SharedValue<number>; heroH: SharedValue<number>; topInset: number; onJump: () => void }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(false);
  const show = useDerivedValue(() => interpolate(y.value, [heroH.value - 120, heroH.value - 60], [0, 1], Extrapolation.CLAMP));
  useAnimatedReaction(
    () => show.value > 0.5,
    (on, was) => {
      if (on !== was) scheduleOnRN(setShown, on);
    },
  );
  const bar = useAnimatedStyle(() => {
    const t = reduce ? (show.value > 0.5 ? 1 : 0) : show.value;
    return { opacity: t > 0 ? 1 : 0, transform: [{ translateY: (1 - t) * -(BAR_H + 3) }] };
  });
  const line = useAnimatedStyle(() => {
    const max = Math.max(1, ch.value - vh.value);
    return { transform: [{ scaleX: interpolate(y.value, [0, max], [0, 1], Extrapolation.CLAMP) }] };
  });
  return (
    <>
      <Animated.View pointerEvents="box-none" importantForAccessibility={shown ? "auto" : "no-hide-descendants"} accessibilityElementsHidden={!shown} style={[{ position: "absolute", top: topInset, left: 0, right: 0, backgroundColor: BLUE }, bar]}>
        <View style={{ height: BAR_H, paddingLeft: G, paddingRight: space[2], flexDirection: "row", alignItems: "center", gap: space[2] }}>
          <Text allowFontScaling={false} style={{ fontFamily: fonts.wordmark, fontSize: 18, color: WHITE, letterSpacing: -0.3 }}>
            VIBHA
          </Text>
          <Text allowFontScaling={false} style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 12, color: ON_BLUE_MUTED }}>
            School of Psychology
          </Text>
          <Press onPress={onJump} testID="welcome-jump" accessibilityRole="button" accessibilityLabel="Jump to a part of this page" feel="select" innerStyle={{ minHeight: layout.target, paddingHorizontal: space[3], flexDirection: "row", alignItems: "center", gap: space[1] }}>
            <Text allowFontScaling={false} style={{ fontFamily: fonts.bold, fontSize: 14, color: WHITE }}>
              Jump to
            </Text>
            <ChevronDown size={18} color={WHITE} strokeWidth={2.4} />
          </Press>
        </View>
        <View style={{ height: 3, backgroundColor: "rgba(255,255,255,0.18)" }}>
          <Animated.View style={[{ flex: 1, backgroundColor: LIME, transformOrigin: "left" }, line]} />
        </View>
      </Animated.View>
      {/* Drawn last: the bar slides out from under it. */}
      <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, height: topInset, backgroundColor: BLUE }} />
    </>
  );
}

/** Sign in, always one tap away. Request an invitation just under it. Slides up as the opening plays. */
function Dock({ onHeight }: { onHeight: (h: number) => void }) {
  const c = useTheme();
  const t = useIntroSpring(500, snappy);
  const anim = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ translateY: (1 - t.value) * 40 }] }));
  return (
    <Animated.View onLayout={(e: LayoutChangeEvent) => onHeight(e.nativeEvent.layout.height)} style={[{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: space[3], paddingBottom: space[3] }, anim]}>
      <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", backgroundColor: c.card, borderRadius: 20, borderWidth: 2, borderColor: c.dark ? "rgba(255,255,255,0.22)" : INK, paddingTop: space[3], paddingHorizontal: space[3], paddingBottom: space[1], shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 }}>
        <Button label="Sign in" onPress={() => router.push("/sign-in")} testID="welcome-sign-in" accessibilityHint="For students with a VIBHA account" />
        <Press onPress={() => router.push("/request")} testID="welcome-request" accessibilityRole="button" accessibilityLabel="New here? Request an invitation" hitSlop={4} feel="tap" innerStyle={{ minHeight: layout.target, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: space[1] }}>
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

function Opening({ topInset, onHeight }: { topInset: number; onHeight: (h: number) => void }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 640);
  // "Psychology." fills the width; the other lines take their size from it.
  const big = Math.min(60, Math.floor((w - G * 2) / 6.3));
  return (
    <Chapter testID="welcome-opening" style={{ backgroundColor: BLUE, paddingTop: topInset + space[5], paddingBottom: space[6], overflow: "hidden" }}>
      <View onLayout={(e) => onHeight(e.nativeEvent.layout.height + e.nativeEvent.layout.y)} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1 }} />
      <Dots />
      <View style={{ paddingHorizontal: G, gap: space[5], width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <Wordmark />
        <Headline big={big} />
        <Lede />
        <Room width={w - G * 2} />
      </View>
      <StickerRows />
    </Chapter>
  );
}

/** V-I-B-H-A drop in one by one and settle with a bounce. */
function Wordmark() {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="VIBHA School of Psychology" style={{ flexDirection: "row", alignItems: "flex-end", gap: space[3] }}>
      <View style={{ flexDirection: "row" }}>
        {"VIBHA".split("").map((ch, i) => (
          <DropLetter key={i} ch={ch} i={i} />
        ))}
      </View>
      <FadeUp delay={420} style={{ paddingBottom: 4 }}>
        <Text allowFontScaling={false} style={{ fontFamily: fonts.semibold, fontSize: 13, color: ON_BLUE_MUTED }}>
          School of Psychology
        </Text>
      </FadeUp>
    </View>
  );
}

function DropLetter({ ch, i }: { ch: string; i: number }) {
  const t = useIntroSpring(60 + i * 70, bouncy);
  const anim = useAnimatedStyle(() => ({ opacity: Math.min(1, t.value * 2), transform: [{ translateY: (1 - t.value) * -36 }, { rotate: `${(1 - t.value) * (i % 2 ? 14 : -14)}deg` }] }));
  return (
    <Animated.Text allowFontScaling={false} style={[{ fontFamily: fonts.wordmark, fontSize: 30, lineHeight: 34, color: WHITE, letterSpacing: -0.5 }, anim]}>
      {ch}
    </Animated.Text>
  );
}

function FadeUp({ delay, children, style }: { delay: number; children: React.ReactNode; style?: object }) {
  const t = useIntro(delay, 600);
  const anim = useAnimatedStyle(() => ({ opacity: t.value, transform: [{ translateY: (1 - t.value) * 14 }] }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

/** Each line rises out of its own mask; then a lime marker sweeps behind "Practise it." */
function Headline({ big }: { big: number }) {
  const { HERO } = useWords();
  const small = Math.round(big * 0.56);
  const sweep = useIntro(980, 520);
  const marker = useAnimatedStyle(() => ({ transform: [{ scaleX: sweep.value }] }));
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={HERO.lines.join(" ")} style={{ gap: 2 }}>
      <MaskLine delay={380} h={Math.round(small * 1.15)}>
        <Text allowFontScaling={false} style={{ fontFamily: fonts.h1, fontSize: small, lineHeight: Math.round(small * 1.15), color: WHITE }}>
          {HERO.lines[0]}
        </Text>
      </MaskLine>
      <MaskLine delay={500} h={Math.round(big * 1.06)}>
        <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.display, fontSize: big, lineHeight: Math.round(big * 1.06), letterSpacing: -big * 0.03, color: WHITE }}>
          {HERO.lines[1]}
        </Text>
      </MaskLine>
      <MaskLine delay={640} h={Math.round(big * 1.12)}>
        <View style={{ alignSelf: "flex-start", paddingHorizontal: 8, marginLeft: -8 }}>
          <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: big * 0.12, bottom: big * 0.04, backgroundColor: LIME, borderRadius: 6, transformOrigin: "left" }, marker]} />
          <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.display, fontSize: big, lineHeight: Math.round(big * 1.12), letterSpacing: -big * 0.03, color: INK }}>
            {HERO.lines[2]}
          </Text>
        </View>
      </MaskLine>
    </View>
  );
}

function Lede() {
  const { HERO } = useWords();
  return (
    <FadeUp delay={860}>
      <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: fonts.body, fontSize: 17, lineHeight: 27, color: ON_BLUE_MUTED, maxWidth: 520 }}>
        {HERO.lede}
      </Text>
    </FadeUp>
  );
}

/** The consultation room from the website: a window with a student, the doctor and a patient, and a speech bubble. */
function Room({ width }: { width: number }) {
  const box = useIntroSpring(700, { damping: 16, stiffness: 140, mass: 0.8 });
  const boxAnim = useAnimatedStyle(() => ({ opacity: Math.min(1, box.value * 1.6), transform: [{ translateY: (1 - box.value) * 40 }, { rotate: `${(1 - box.value) * -5}deg` }, { scale: 0.92 + box.value * 0.08 }] }));
  const star = useIntroSpring(1100, bouncy);
  const starAnim = useAnimatedStyle(() => ({ opacity: Math.min(1, star.value * 2), transform: [{ scale: 0.5 + star.value * 0.5 }, { rotate: `${(1 - star.value) * -120}deg` }] }));
  const h = Math.round(Math.min(260, width * 0.66));
  const p = Math.round(h * 0.56);
  return (
    <View style={{ marginTop: space[3] }}>
      <Animated.View style={[{ borderRadius: 16, borderWidth: 2.5, borderColor: INK, backgroundColor: "#e8edff", overflow: "hidden", shadowColor: INK, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 5, height: 5 }, elevation: 0 }, boxAnim]}>
        <View style={{ height: 34, backgroundColor: WHITE, borderBottomWidth: 2.5, borderColor: INK, flexDirection: "row", alignItems: "center", paddingHorizontal: space[3], gap: 6 }}>
          {[LIME, BLUE, WHITE].map((f, i) => (
            <View key={i} style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: f, borderWidth: 2, borderColor: INK }} />
          ))}
          <Pix color={INK} size={12} style={{ marginLeft: space[2] }}>
            Consultation room
          </Pix>
        </View>
        <View style={{ height: h }}>
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h * 0.22, backgroundColor: LIME, borderTopWidth: 2.5, borderColor: INK }} />
          <PopPerson who="curly" delay={1000} w={p} style={{ position: "absolute", left: "2%", bottom: 0 }} />
          <PopPerson who="doctor" delay={1120} w={p * 1.08} style={{ position: "absolute", left: "33%", bottom: 0 }} />
          <PopPerson who="patient" flip delay={1240} w={p} style={{ position: "absolute", right: "2%", bottom: 0 }} />
          <Bubble />
        </View>
      </Animated.View>
      <Parallax speed={-0.25} spin={40} style={{ position: "absolute", right: -14, top: -40 }}>
        <Animated.View style={starAnim}>
          <Star size={76} fill={LIME} />
        </Animated.View>
      </Parallax>
      <Parallax speed={-0.45} style={{ position: "absolute", left: -10, bottom: -24 }}>
        <Sparkle size={34} fill={WHITE} />
      </Parallax>
    </View>
  );
}

function PopPerson({ who, delay, w, flip, style }: { who: Parameters<typeof Person>[0]["who"]; delay: number; w: number; flip?: boolean; style: object }) {
  const t = useIntroSpring(delay, bouncy);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - t.value) * w }] }));
  return (
    <Animated.View style={[style, anim]}>
      <Person who={who} width={w} flip={flip} />
    </Animated.View>
  );
}

function Bubble() {
  const { HERO } = useWords();
  const t = useIntroSpring(1500, bouncy);
  const anim = useAnimatedStyle(() => ({ opacity: Math.min(1, t.value * 2), transform: [{ scale: 0.6 + t.value * 0.4 }] }));
  return (
    <Animated.View style={[{ position: "absolute", top: space[3], left: space[3], transformOrigin: "bottom left", backgroundColor: WHITE, borderWidth: 2.5, borderColor: INK, borderRadius: 14, borderBottomLeftRadius: 2, paddingHorizontal: space[3], paddingVertical: space[2] }, anim]}>
      <Text allowFontScaling={false} style={{ fontFamily: fonts.bold, fontSize: 14, color: INK }}>
        {HERO.bubble}
      </Text>
    </Animated.View>
  );
}

/** Two rows of stickers that slide sideways as you scroll, in opposite directions. */
function StickerRows() {
  return (
    <View style={{ marginTop: space[6], gap: space[2] }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <StickerRow dir={-1} fill={LIME} fg={INK} />
      <StickerRow dir={1} fill={INK} fg={WHITE} />
    </View>
  );
}

function StickerRow({ dir, fill, fg }: { dir: 1 | -1; fill: string; fg: string }) {
  const { STICKERS } = useWords();
  const items = dir < 0 ? STICKERS : [...STICKERS].reverse();
  return (
    <View style={{ height: 40 }}>
      <SlideX dir={dir}>
        {[...items, ...items].map((s, i) => (
          <View key={i} style={{ height: 36, paddingHorizontal: space[3], borderRadius: 18, borderWidth: 2, borderColor: INK, backgroundColor: fill, justifyContent: "center", transform: [{ rotate: `${i % 3 === 0 ? -2 : i % 3 === 1 ? 1.5 : 0}deg` }] }}>
            <Text allowFontScaling={false} style={{ fontFamily: fonts.bold, fontSize: 14, color: fg }}>
              {s}
            </Text>
          </View>
        ))}
      </SlideX>
    </View>
  );
}

function SlideX({ dir, children }: { dir: 1 | -1; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ctx = useScrollY();
  const anim = useAnimatedStyle(() => ({ transform: [{ translateX: reduce ? 0 : (dir < 0 ? 0 : -600) + dir * ctx.value * 0.6 }] }));
  return <Animated.View style={[{ flexDirection: "row", gap: space[2], paddingLeft: G, width: 3000 }, anim]}>{children}</Animated.View>;
}

/* ============================================================ the story */

function QuickAnswers() {
  const { QUICK_ANSWERS } = useWords();
  const c = useTheme();
  return (
    <Chapter style={{ paddingHorizontal: G, paddingTop: space[7], paddingBottom: space[5], width: "100%", maxWidth: 640, alignSelf: "center", gap: space[3] }}>
      <Reveal kind="fade">
        <Pix color={c.link}>Quick answers</Pix>
      </Reveal>
      {QUICK_ANSWERS.map((x, i) => (
        <Reveal key={x.q} lag={i * 18}>
          <View style={{ paddingVertical: space[3], borderTopWidth: i ? 1 : 0, borderColor: c.hairline, gap: 2 }}>
            <T v="h3">{x.q}</T>
            <T tone="muted">{x.a}</T>
          </View>
        </Reveal>
      ))}
    </Chapter>
  );
}

function Patients() {
  const { PATIENTS } = useWords();
  return (
    <Chapter style={{ backgroundColor: BLUE, paddingTop: space[7], paddingBottom: space[7], overflow: "hidden" }}>
      <Dots />
      <Parallax speed={-0.18} spin={25} style={{ position: "absolute", right: -30, top: space[6] }}>
        <Star size={120} fill={LIME} />
      </Parallax>
      <Parallax speed={-0.12} style={{ position: "absolute", right: 0, top: space[6] + 8 }}>
        <Person who="doctor2" width={96} />
      </Parallax>
      <View style={{ paddingHorizontal: G, gap: space[6], width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <View style={{ paddingRight: 96 }}>
          <Head tag={PATIENTS.tag} title={PATIENTS.title} accent={PATIENTS.accent} sub={PATIENTS.sub} ink={WHITE} accentColor={LIME} muted={ON_BLUE_MUTED} />
        </View>
        <View style={{ gap: space[5] }}>
          {PATIENTS.steps.map((s, i) => (
            <Reveal key={s.title} kind={i % 2 ? "right" : "left"} lag={20}>
              <View style={{ flexDirection: "row", gap: space[4] }}>
                <Text allowFontScaling={false} style={{ fontFamily: fonts.pixelDigits, fontSize: 28, lineHeight: 34, color: LIME, width: 34 }}>
                  {i + 1}
                </Text>
                <View style={{ flex: 1, gap: space[2] }}>
                  <T v="h3" style={{ color: WHITE }}>
                    {s.title}
                  </T>
                  <T style={{ color: ON_BLUE_MUTED }}>{s.text}</T>
                  <View style={{ flexDirection: "row", marginTop: space[1] }}>
                    {s.heads.map((h, k) => (
                      <Face key={k} who={h} size={40} ring={INK} bg={h === "patient" ? LIME : h === "doctor" ? WHITE : "#e8edff"} style={{ marginLeft: k ? -10 : 0 }} />
                    ))}
                  </View>
                </View>
              </View>
            </Reveal>
          ))}
        </View>
      </View>
    </Chapter>
  );
}

function Different() {
  const { DIFFERENT } = useWords();
  const c = useTheme();
  return (
    <Chapter style={{ paddingHorizontal: G, paddingTop: space[7], paddingBottom: space[7], width: "100%", maxWidth: 640, alignSelf: "center", gap: space[6] }}>
      <Head tag={DIFFERENT.tag} title={DIFFERENT.title} accent={DIFFERENT.accent} sub={DIFFERENT.sub} ink={c.ink} accentColor={c.link} muted={c.muted} />
      <View>
        <View style={{ flexDirection: "row", paddingBottom: space[2] }}>
          <Pix color={c.muted} style={{ flex: 1 }}>
            In most college courses
          </Pix>
          <Pix color={c.link} style={{ flex: 1 }}>
            At VIBHA
          </Pix>
        </View>
        {DIFFERENT.rows.map((r, i) => (
          <Reveal key={r.vibha} lag={i * 6} style={{ flexDirection: "row", gap: space[3], paddingVertical: space[3], borderTopWidth: 1, borderColor: c.hairline }}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <T v="small" tone="muted" style={{ textDecorationLine: "line-through", textDecorationColor: c.danger }}>
                {r.college}
              </T>
            </View>
            <View style={{ flex: 1, flexDirection: "row", gap: space[2] }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: LIME, borderWidth: 1.5, borderColor: INK, alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                <Check size={12} color={INK} strokeWidth={3.5} />
              </View>
              <T v="small" style={{ flex: 1, fontFamily: fonts.semibold }}>
                {r.vibha}
              </T>
            </View>
          </Reveal>
        ))}
      </View>
      <Reveal kind="scale">
        <T v="h2" style={{ fontSize: 24, lineHeight: 32 }}>
          {DIFFERENT.manifesto}
        </T>
      </Reveal>
    </Chapter>
  );
}

function Journey() {
  const { JOURNEY } = useWords();
  const c = useTheme();
  const bg = c.dark ? "#161616" : INK;
  return (
    <Chapter style={{ backgroundColor: bg, paddingTop: space[7], paddingBottom: space[7] }}>
      <View style={{ paddingHorizontal: G, gap: space[6], width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <Head tag={JOURNEY.tag} title={JOURNEY.title} accent={JOURNEY.accent} ink={WHITE} accentColor={LIME} muted="rgba(255,255,255,0.75)" />
        <Reveal kind="scale">
          <View style={{ borderRadius: 14, borderWidth: 2, borderColor: LIME, padding: space[4], gap: space[2], flexDirection: "row", alignItems: "center" }}>
            <Face who="patient" size={52} ring={LIME} bg={LIME} />
            <View style={{ flex: 1, gap: 2 }}>
              <Pix color={LIME}>{JOURNEY.disorder}</Pix>
              <T style={{ color: WHITE }}>{JOURNEY.patient}</T>
            </View>
          </View>
        </Reveal>
        <View>
          {JOURNEY.steps.map((s, i) => (
            <Reveal key={s.k} kind="left" style={{ flexDirection: "row", gap: space[4], paddingBottom: i === JOURNEY.steps.length - 1 ? 0 : space[5] }}>
              <View style={{ alignItems: "center", width: 44 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: WHITE, borderWidth: 2, borderColor: LIME, alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={26} fill={i % 2 ? LIME : "#ffffff"} />
                </View>
                {i < JOURNEY.steps.length - 1 ? <View style={{ flex: 1, width: 2, marginTop: space[1], marginBottom: -space[5] + space[1], backgroundColor: "rgba(205,242,75,0.45)" }} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2, paddingTop: 2 }}>
                <Pix color={LIME}>{`${i + 1}  ${s.k}`}</Pix>
                <T v="h3" style={{ color: WHITE }}>
                  {s.title}
                </T>
                <T v="small" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {s.text}
                </T>
              </View>
            </Reveal>
          ))}
        </View>
        <Reveal kind="fade">
          <T v="bodyStrong" style={{ color: LIME }}>
            {JOURNEY.foot}
          </T>
        </Reveal>
      </View>
    </Chapter>
  );
}

function WhatYouGet() {
  const { GET } = useWords();
  const mark = React.useContext(JumpCtx);
  return (
    <Chapter onTop={mark("get")} style={{ backgroundColor: LIME, paddingTop: space[7], paddingBottom: space[7], overflow: "hidden" }}>
      <Dots color="rgba(17,17,17,0.10)" gap={14} />
      <View style={{ paddingHorizontal: G, gap: space[6], width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <Head tag={GET.tag} title={GET.title} accent={GET.accent} ink={INK} accentColor={BLUE} muted="#2a2a2a" tagColor={INK} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", rowGap: space[5] }}>
          {GET.stats.map((s, i) => (
            <View key={i} style={{ width: "50%", paddingRight: space[3], gap: space[1] }}>
              <DigitRoll value={s.n} color={i % 3 === 1 ? BLUE : INK} size={40} lag={240 + Math.floor(i / 2) * 90 + (i % 2) * 20} />
              <View style={{ height: 2, width: 28, backgroundColor: INK }} />
              <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: INK }}>
                {s.t}
              </Text>
            </View>
          ))}
        </View>
        <Reveal kind="scale">
          <View style={{ backgroundColor: WHITE, borderRadius: 16, borderWidth: 2.5, borderColor: INK, padding: space[5], paddingRight: 108, minHeight: 150, gap: space[2], shadowColor: INK, shadowOpacity: 1, shadowRadius: 0, shadowOffset: { width: 5, height: 5 } }}>
            <Pix color={BLUE}>Your certificate</Pix>
            <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: INK }}>
              {GET.certificate}
            </Text>
            <Parallax speed={0} spin={70} style={{ position: "absolute", right: -24, top: -30 }}>
              <Star size={128} fill={BLUE} points={16} inner={68} />
            </Parallax>
            <View pointerEvents="none" style={{ position: "absolute", right: -24, top: -30, width: 128, height: 128, alignItems: "center", justifyContent: "center" }}>
              <Text allowFontScaling={false} style={{ fontFamily: fonts.pixel, fontSize: 8, lineHeight: 11, color: WHITE, textAlign: "center" }}>
                {"SIGNED\nBY A\nPSYCHIATRIST"}
              </Text>
            </View>
          </View>
        </Reveal>
      </View>
    </Chapter>
  );
}

function Curriculum() {
  const { DISCIPLINES } = useWords();
  const { width } = useWindowDimensions();
  const card = Math.min(300, Math.round(width * 0.74));
  return (
    <Chapter style={{ backgroundColor: BLUE, paddingTop: space[7], paddingBottom: space[7], overflow: "hidden" }}>
      <Dots />
      <View style={{ paddingHorizontal: G, width: "100%", maxWidth: 640, alignSelf: "center", paddingRight: 90 }}>
        <Head tag={DISCIPLINES.tag} title={DISCIPLINES.title} accent={DISCIPLINES.accent} sub={DISCIPLINES.sub} ink={WHITE} accentColor={LIME} muted={ON_BLUE_MUTED} />
      </View>
      <Parallax speed={-0.15} style={{ position: "absolute", right: 6, top: space[7] }}>
        <Person who="cap" width={86} />
      </Parallax>
      <Reveal kind="right" style={{ marginTop: space[6] }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={card + space[3]}
          snapToAlignment="start"
          onMomentumScrollEnd={() => haptic.select()}
          contentContainerStyle={{ paddingHorizontal: G, gap: space[3] }}
          accessibilityLabel="Seven disciplines"
        >
          {DISCIPLINES.items.map((d, i) => (
            <View key={d.name} style={{ width: card, minHeight: 200, backgroundColor: WHITE, borderRadius: 16, borderWidth: 2.5, borderColor: INK, overflow: "hidden" }}>
              <View style={{ backgroundColor: i % 2 ? INK : LIME, paddingHorizontal: space[4], paddingVertical: space[3], borderBottomWidth: 2.5, borderColor: INK, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text allowFontScaling={false} style={{ fontFamily: fonts.pixelDigits, fontSize: 22, color: i % 2 ? LIME : INK }}>
                  {String(i + 1).padStart(2, "0")}
                </Text>
                <Pix color={i % 2 ? WHITE : INK} size={12}>
                  {`${i + 1} of ${DISCIPLINES.items.length}`}
                </Pix>
              </View>
              <View style={{ padding: space[4], gap: space[2] }}>
                <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.h1, fontSize: 22, lineHeight: 27, color: INK }}>
                  {d.name}
                </Text>
                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: "#333333" }}>
                  {d.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Reveal>
    </Chapter>
  );
}

function YourWeek() {
  const { WEEK } = useWords();
  const c = useTheme();
  const [weekend, setWeekend] = React.useState(false);
  const reduce = useReducedMotion();
  const [segW, setSegW] = React.useState(0);
  const thumb = useSharedValue(0);
  const thumbAnim = useAnimatedStyle(() => ({ transform: [{ translateX: thumb.value * (segW / 2) }] }));
  const pick = (v: boolean) => {
    if (v === weekend) return;
    haptic.select();
    setWeekend(v);
    thumb.set(reduce ? (v ? 1 : 0) : withSpring(v ? 1 : 0, snappy));
  };
  const day = weekend ? WEEK.weekend : WEEK.weekday;
  const mark = React.useContext(JumpCtx);
  return (
    <Chapter onTop={mark("week")} style={{ paddingHorizontal: G, paddingTop: space[7], paddingBottom: space[7], width: "100%", maxWidth: 640, alignSelf: "center", gap: space[6] }}>
      <Head tag={WEEK.tag} title={WEEK.title} accent={WEEK.accent} sub={WEEK.sub} ink={c.ink} accentColor={c.link} muted={c.muted} />
      <View style={{ flexDirection: "row", gap: 6 }}>
        {WEEK.days.map((d, i) => (
          <Reveal key={d.d} kind="scale" lag={i * 8} style={{ flex: 1 }}>
            <View style={{ alignItems: "center", gap: space[2], paddingVertical: space[3], borderRadius: 12, borderWidth: 2, borderColor: c.dark ? "rgba(255,255,255,0.3)" : INK, backgroundColor: d.live ? LIME : c.card }}>
              <Text allowFontScaling={false} style={{ fontFamily: fonts.bold, fontSize: 13, color: d.live ? INK : c.ink }}>
                {d.d}
              </Text>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: d.live ? INK : BLUE }} />
            </View>
          </Reveal>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: space[4] }}>
        <Legend dot={BLUE} label="Patient batch" />
        <Legend dot={LIME} label="Live discussion" ring />
      </View>
      <View>
        <View accessibilityRole="tablist" onLayout={(e) => setSegW(e.nativeEvent.layout.width - 8)} style={{ flexDirection: "row", padding: 4, borderRadius: 14, backgroundColor: c.tint }}>
          {segW > 0 ? <Animated.View style={[{ position: "absolute", top: 4, left: 4, bottom: 4, width: segW / 2, borderRadius: 10, backgroundColor: c.card, borderWidth: 1.5, borderColor: c.cardLine }, thumbAnim]} /> : null}
          {[false, true].map((v) => (
            <Press key={String(v)} accessibilityRole="tab" accessibilityState={{ selected: weekend === v }} onPress={() => pick(v)} feel="none" style={{ flex: 1 }} innerStyle={{ minHeight: 44, alignItems: "center", justifyContent: "center" }} testID={v ? "week-weekend" : "week-weekday"}>
              <T v="bodyStrong" tone={weekend === v ? "ink" : "muted"}>
                {v ? "Weekend" : "Weekday"}
              </T>
            </Press>
          ))}
        </View>
        {/* Swap: the old day fades out while the new one rises, so the area never blinks. */}
        <Swap k={weekend ? "weekend" : "weekday"} dir={weekend ? 1 : -1}>
          <View style={{ paddingTop: space[5], gap: space[1] }}>
            <Animated.View entering={reduce ? undefined : presets.rise(0)}>
              <Pix color={c.link}>{day.tag}</Pix>
              <T v="h2">{day.title}</T>
              <T tone="muted">{day.sub}</T>
            </Animated.View>
            <View style={{ paddingTop: space[3] }}>
              {day.steps.map((s, i) => (
                <Animated.View key={s} entering={reduce ? undefined : presets.rise(60 + i * 40)} style={{ flexDirection: "row", gap: space[3], paddingVertical: space[2], alignItems: "center" }}>
                  <Text allowFontScaling={false} style={{ fontFamily: fonts.pixelDigits, fontSize: 16, color: c.link, width: 22 }}>
                    {i + 1}
                  </Text>
                  <T style={{ flex: 1 }}>{s}</T>
                </Animated.View>
              ))}
            </View>
          </View>
        </Swap>
      </View>
    </Chapter>
  );
}

function Legend({ dot, label, ring }: { dot: string; label: string; ring?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: dot, borderWidth: ring ? 1.5 : 0, borderColor: INK }} />
      <T v="small" tone="muted">
        {label}
      </T>
    </View>
  );
}

function Faculty() {
  const { FACULTY } = useWords();
  const c = useTheme();
  const mark = React.useContext(JumpCtx);
  return (
    <Chapter onTop={mark("faculty")} style={{ paddingTop: space[7], paddingBottom: space[7], borderTopWidth: 1, borderColor: c.hairline }}>
      <View style={{ paddingHorizontal: G, width: "100%", maxWidth: 640, alignSelf: "center", gap: space[6] }}>
        <View style={{ paddingRight: 100 }}>
          <Head tag={FACULTY.tag} title={FACULTY.title} accent={FACULTY.accent} sub={FACULTY.sub} ink={c.ink} accentColor={c.link} muted={c.muted} />
        </View>
        <Reveal kind="scale">
          <View style={{ backgroundColor: BLUE, borderRadius: 18, borderWidth: 2.5, borderColor: INK, padding: space[5], gap: space[3], overflow: "hidden" }}>
            <Dots />
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
              <Initials text={FACULTY.lead.initials} size={64} bg={LIME} fg={INK} ring={INK} />
              <View style={{ flex: 1 }}>
                <Pix color={LIME}>{FACULTY.lead.role}</Pix>
              </View>
            </View>
            <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.h1, fontSize: 22, lineHeight: 28, color: WHITE }}>
              {FACULTY.lead.name}
            </Text>
            <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: ON_BLUE_MUTED }}>
              {FACULTY.lead.text}
            </Text>
          </View>
        </Reveal>
        <View>
          {FACULTY.people.map((f, i) => (
            <Reveal key={f.name} lag={i * 8} style={{ flexDirection: "row", alignItems: "center", gap: space[4], paddingVertical: space[3], borderTopWidth: i ? 1 : 0, borderColor: c.hairline }}>
              <Initials text={f.initials} bg={i < 4 ? LIME : i < 6 ? INK : WHITE} fg={i >= 4 && i < 6 ? WHITE : INK} ring={c.dark ? "rgba(255,255,255,0.4)" : INK} />
              <View style={{ flex: 1 }}>
                <T v="bodyStrong">{f.name}</T>
                <T v="small" tone="muted">
                  {f.role}
                </T>
              </View>
            </Reveal>
          ))}
        </View>
        <Reveal kind="fade">
          <T tone="muted">{FACULTY.note}</T>
        </Reveal>
        <Reveal style={{ gap: space[2] }}>
          <Pix color={c.link}>Run by</Pix>
          {FACULTY.runBy.map((r) => (
            <View key={r.name}>
              <T v="bodyStrong">{r.name}</T>
              <T v="small" tone="muted">
                {r.role}
              </T>
            </View>
          ))}
        </Reveal>
      </View>
      <Parallax speed={-0.1} spin={20} style={{ position: "absolute", right: -20, top: space[6] }}>
        <Star size={118} fill={BLUE} />
      </Parallax>
      <Parallax speed={-0.06} style={{ position: "absolute", right: 4, top: space[6] + 10 }}>
        <Person who="doctor3" width={92} />
      </Parallax>
    </Chapter>
  );
}

function Joining() {
  const { CLOSING, JOIN } = useWords();
  const mark = React.useContext(JumpCtx);
  return (
    <Chapter onTop={mark("join")} style={{ backgroundColor: LIME, paddingTop: space[7], paddingBottom: space[7], overflow: "hidden" }}>
      <Dots color="rgba(17,17,17,0.10)" gap={14} />
      <View style={{ paddingHorizontal: G, gap: space[6], width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <Head tag={JOIN.tag} title={JOIN.title} accent={JOIN.accent} sub={JOIN.sub} ink={INK} accentColor={BLUE} muted="#2a2a2a" tagColor={INK} />
        <View style={{ gap: space[3] }}>
          <Pix color={INK}>{JOIN.whoLabel}</Pix>
          {JOIN.who.map((w, i) => (
            <Reveal key={w.title} kind={i % 2 ? "right" : "left"} style={{ flexDirection: "row", alignItems: "center", gap: space[3], backgroundColor: WHITE, borderRadius: 14, borderWidth: 2, borderColor: INK, paddingRight: space[4], overflow: "hidden" }}>
              <View style={{ width: 72, height: 76, backgroundColor: i % 2 ? BLUE : "#e8edff", borderRightWidth: 2, borderColor: INK, alignItems: "center", overflow: "hidden" }}>
                <Person who={w.who} width={74} style={{ marginTop: 8 }} />
              </View>
              <View style={{ flex: 1, paddingVertical: space[3] }}>
                <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.bold, fontSize: 16, lineHeight: 21, color: INK }}>
                  {w.title}
                </Text>
                <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: "#333333" }}>
                  {w.text}
                </Text>
              </View>
            </Reveal>
          ))}
        </View>
        <Reveal style={{ gap: space[3] }}>
          <Pix color={INK}>Your fee depends on</Pix>
          {JOIN.dependsOn.map((x, i) => (
            <View key={x} style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
                <Text allowFontScaling={false} style={{ fontFamily: fonts.pixelDigits, fontSize: 14, color: LIME }}>
                  {i + 1}
                </Text>
              </View>
              <Text maxFontSizeMultiplier={1.5} style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: INK }}>
                {x}
              </Text>
            </View>
          ))}
          <Pix color={INK} style={{ marginTop: space[3] }}>
            Ways to pay
          </Pix>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
            {JOIN.pay.map((x) => (
              <View key={x} style={{ borderRadius: 18, borderWidth: 2, borderColor: INK, backgroundColor: WHITE, paddingHorizontal: space[3], paddingVertical: 6 }}>
                <Text maxFontSizeMultiplier={1.4} style={{ fontFamily: fonts.semibold, fontSize: 14, color: INK }}>
                  {x}
                </Text>
              </View>
            ))}
          </View>
        </Reveal>
        <Reveal kind="scale">
          <View style={{ backgroundColor: INK, borderRadius: 18, padding: space[5], gap: space[4] }}>
            <Pix color={LIME}>How to join</Pix>
            {JOIN.steps.map((s, i) => (
              <View key={s.title} style={{ flexDirection: "row", gap: space[3] }}>
                <Text allowFontScaling={false} style={{ fontFamily: fonts.pixelDigits, fontSize: 24, lineHeight: 28, color: LIME, width: 26 }}>
                  {i + 1}
                </Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: WHITE }}>
                    {s.title}
                  </Text>
                  <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: "rgba(255,255,255,0.78)" }}>
                    {s.text}
                  </Text>
                </View>
              </View>
            ))}
            <View style={{ flexDirection: "row", gap: space[2], flexWrap: "wrap" }}>
              <Pill label="Call us" icon={<Phone size={16} color={INK} />} onPress={() => void openLink(CLOSING.phoneHref)} testID="welcome-call" />
              <Pill label="WhatsApp" icon={<MessageCircle size={16} color={INK} />} onPress={() => void openLink(CLOSING.whatsappHref)} testID="welcome-whatsapp" />
            </View>
          </View>
        </Reveal>
      </View>
    </Chapter>
  );
}

function Pill({ label, icon, onPress, testID }: { label: string; icon: React.ReactNode; onPress: () => void; testID: string }) {
  return (
    <Press onPress={onPress} testID={testID} accessibilityRole="button" accessibilityLabel={label} feel="tap" innerStyle={{ minHeight: 44, paddingHorizontal: space[4], borderRadius: 22, backgroundColor: WHITE, flexDirection: "row", alignItems: "center", gap: space[2] }}>
      {icon}
      <Text allowFontScaling={false} style={{ fontFamily: fonts.bold, fontSize: 15, color: INK }}>
        {label}
      </Text>
    </Press>
  );
}

function Closing({ bottom }: { bottom: number }) {
  const { CLOSING } = useWords();
  const { width } = useWindowDimensions();
  const size = Math.min(52, Math.floor((Math.min(width, 640) - G * 2) / 9.2));
  const cast = ["bun", "doctor3", "psych", "cap"] as const;
  const p = Math.min(84, Math.floor((Math.min(width, 640) - G * 2 - 90) / 4));
  return (
    <Chapter style={{ backgroundColor: BLUE, paddingTop: space[7], paddingBottom: bottom, overflow: "hidden" }}>
      <Dots />
      <View style={{ paddingHorizontal: G, width: "100%", maxWidth: 640, alignSelf: "center", gap: space[2] }}>
        <Reveal kind="left">
          <Text allowFontScaling={false} style={{ fontFamily: fonts.display, fontSize: size, lineHeight: size * 1.1, letterSpacing: -size * 0.03, color: WHITE }}>
            {CLOSING.a}
          </Text>
        </Reveal>
        <Reveal kind="right" lag={20}>
          <Text allowFontScaling={false} style={{ fontFamily: fonts.display, fontSize: size, lineHeight: size * 1.1, letterSpacing: -size * 0.03, color: LIME }}>
            {CLOSING.b}
          </Text>
        </Reveal>
        <Reveal style={{ marginTop: space[5], gap: space[1] }}>
          <Pix color={LIME}>Enquiries</Pix>
          <Text accessibilityRole="link" onPress={() => void openLink(CLOSING.phoneHref)} maxFontSizeMultiplier={1.3} style={{ fontFamily: fonts.h1, fontSize: 24, lineHeight: 30, color: WHITE }}>
            {CLOSING.phone}
          </Text>
          <Text maxFontSizeMultiplier={1.5} style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: ON_BLUE_MUTED }}>
            {CLOSING.address}
          </Text>
        </Reveal>
      </View>
      <View style={{ marginTop: space[6], height: p * 1.16 + 10, flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 2 }}>
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, backgroundColor: LIME, borderTopWidth: 2.5, borderColor: INK }} />
        {cast.map((who, i) => (
          <Reveal key={who} kind="up" lag={i * 14} span={120}>
            <Person who={who} width={p} flip={i % 2 === 1} />
          </Reveal>
        ))}
        <Reveal kind="scale" lag={70} span={120} style={{ marginBottom: 8 }}>
          <Meme mood="hello" size={84} delay={0} always tilt={-6} bg={LIME} line={INK} />
        </Reveal>
      </View>
    </Chapter>
  );
}
