import { router } from "expo-router";
import { Check, CircleHelp, X } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlueField, Button, Label, Layer, LAYER_OVERLAP, pebbleShape, ProgressLine, QuietEmpty, RoundButton, Sheet, Skeleton, Stone, T } from "@/ds";
import { useKeyboardPad } from "@/ds/keyboard-pad";
import { haptic } from "@/lib/haptics";
import { settingsStore } from "@/lib/settings";
import { useHardwareBack } from "@/nav/back";
import { useSeen } from "@/lib/once";
import { streakMoment } from "@/moments/host";
import { Rich } from "@/study/rich";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";
import { ApiFailure } from "@/api/errors";
import { isSoon } from "./api";
import { SoonState } from "./soon";
import { beats, Confetti, curves, dur, PixelBurst, presets, Press, ProgressRing, RollingNumber, scaled, springs, staggerDelay, useCelebrate, useMotionTier } from "@/motion";
import { MaskUp, PixelLoader, useSlow } from "@/moments/parts";
import { emblemOn, useGameAccent } from "./accents";
import { ALL_ENTRIES, type Icon } from "./catalog";
import { EntryIcon } from "./icons";
import { Bump } from "./fx";
import { moodForScore, reactions, StickerLayer } from "./reactions";
import { SETTLE_MS } from "@/ds/reactions";
import { QuestMoment } from "./quest";

export function leave(): void {
  if (router.canGoBack()) router.back();
  else router.replace("/practise");
}

/** The frame's screen-wide effects and its field slot, for parts deep in the scroll (confetti must cover the screen; a result's big number sits on the field). */
const FrameFx = React.createContext<{ confetti: () => void; setHero: (n: React.ReactNode) => void }>({ confetti: () => undefined, setHero: () => undefined });

/** True for parts drawn on the blue field (the HUD): they use white and lime instead of ink. */
const OnField = React.createContext(false);
export const useOnField = () => React.useContext(OnField);

export type FrameProps = {
  title: string;
  /** Plain steps, one per line. Shown in a sheet. */
  howTo?: string[];
  /** The score, on the field. */
  score?: string;
  scoreLabel?: string;
  /** Under the top, on the field: a time line, lives, "Door 2 of 5". Short. */
  hud?: React.ReactNode;
  /** On the field under the top row: a start screen's title block. */
  head?: React.ReactNode;
  children: React.ReactNode;
  /** The one action, pinned at the bottom. */
  thumb?: React.ReactNode;
  testID?: string;
  /** A round is running: closing asks first. */
  confirmLeave?: boolean;
  /** "Progress is saved" instead of "not saved" when the case keeps its place. */
  saves?: boolean;
  /** Hide How to play while a clock runs that cannot pause. */
  hideHowTo?: boolean;
  /** No scroll container (a drag board manages its own space). */
  fixed?: boolean;
  /** Drawn over everything, last (a result sheet that rises from the bottom). */
  over?: React.ReactNode;
};

/**
 * The one shell every game and practice tool sits in, in the Layers look.
 * Four parts, always in the same places, so a student learns them once:
 *
 *   field    close (asks first while a round runs), the name, the score,
 *            How to play; under them the game's own short line (time, lives,
 *            "Door 2 of 5"). On a result the big number sits here.
 *   layer    the one question or board, rising over the field, scrolling
 *            if it must
 *   thumb    the one action, pinned low where the thumb is
 *   over     a result sheet that rises from the bottom
 *
 * How to play and Leave are sheets you can drag down.
 */
export function GameFrame({ title, howTo, score, scoreLabel = "Score", hud, head, children, thumb, testID, confirmLeave, saves, hideHowTo, fixed, over }: FrameProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  useLightStatusBar(true);
  const [help, setHelp] = React.useState(false);
  const [asking, setAsking] = React.useState(false);
  /** The pinned footer's height, so a reaction sticker sits above its buttons. */
  const [thumbH, setThumbH] = React.useState(0);
  const close = React.useCallback(() => {
    if (confirmLeave) setAsking(true);
    else leave();
  }, [confirmLeave]);
  useHardwareBack(() => {
    close();
    return true;
  });
  React.useEffect(() => () => reactions.dismiss(), []);
  const closeHelp = React.useCallback(() => setHelp(false), []);
  const closeAsk = React.useCallback(() => setAsking(false), []);
  const [confetti, setConfetti] = React.useState(0);
  const [hero, setHero] = React.useState<React.ReactNode>(null);
  const tier = useMotionTier();
  const fx = React.useMemo(() => ({ confetti: () => setConfetti((n) => n + 1), setHero }), []);
  const body = <View style={{ gap: space[5], width: "100%", maxWidth: layout.readingWidth, alignSelf: "center" }}>{children}</View>;
  // Typing an answer: the keyboard must not cover the box or the Check button.
  const { ref: kbRef, pad: kbPad, onLayout: kbLayout } = useKeyboardPad();
  const scoreN = score !== undefined && /^-?\d+$/.test(score) ? Number(score) : null;
  return (
    <FrameFx.Provider value={fx}>
      <View ref={kbRef} onLayout={kbLayout} testID={testID} style={{ flex: 1, backgroundColor: c.field, paddingBottom: kbPad }}>
        <BlueField style={{ gap: space[3], paddingBottom: space[4] + LAYER_OVERLAP }}>
          <View style={{ minHeight: 44, flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <RoundButton onField label="Close" onPress={close} testID="game-close">
              <X size={18} color={c.onField} />
            </RoundButton>
            <T v="bodyStrong" tone="onField" numberOfLines={2} style={{ flex: 1, minWidth: 0 }}>
              {title}
            </T>
            {score !== undefined ? (
              <View accessible accessibilityLabel={`${scoreLabel} ${score}`} style={{ minHeight: 40, paddingHorizontal: space[3], borderRadius: 20, backgroundColor: c.fieldTint, alignItems: "center", justifyContent: "center" }}>
                <Bump value={score}>
                  {scoreN !== null ? (
                    <RollingNumber value={scoreN} v="h3" tone="onField" testID="game-score" />
                  ) : (
                    <T v="h3" tone="onField" num maxFontSizeMultiplier={1.2} testID="game-score">
                      {score}
                    </T>
                  )}
                </Bump>
              </View>
            ) : null}
            {howTo?.length && !hideHowTo ? (
              <RoundButton onField label="How to play" onPress={() => setHelp(true)} testID="game-help">
                <CircleHelp size={18} color={c.onField} />
              </RoundButton>
            ) : null}
          </View>
          {head}
          {hero}
          {hud && !hero ? (
            <OnField.Provider value>
              <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center" }}>{hud}</View>
            </OnField.Provider>
          ) : null}
        </BlueField>
        <Layer style={{ paddingHorizontal: 0, paddingTop: 0, gap: 0 }}>
          <View style={{ flex: 1, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, overflow: "hidden" }}>
            {fixed ? (
              <View style={{ flex: 1, paddingHorizontal: layout.gutter, paddingTop: space[5] }}>{body}</View>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: space[5], paddingBottom: thumb ? space[6] : insets.bottom + space[6] }}>
                {body}
              </ScrollView>
            )}
            {thumb ? (
              <View onLayout={(e) => setThumbH(Math.round(e.nativeEvent.layout.height))} style={{ backgroundColor: c.bg, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: (kbPad ? 0 : insets.bottom) + space[3] }}>
                <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>{thumb}</View>
              </View>
            ) : null}
          </View>
        </Layer>
        <StickerLayer above={thumb ? thumbH || undefined : insets.bottom} />
        {over}
        <Confetti fire={confetti} count={scaled(36, tier)} />
        <HowToSheet open={help} onClose={closeHelp} steps={howTo ?? []} />
        <Sheet open={asking} onClose={closeAsk} title="Leave this round?">
          <View style={{ gap: space[3] }}>
            <T tone="muted">{saves ? "Your place is saved. Carry on later from Practise." : "This round is not saved."}</T>
            <Button
              kind="quiet"
              label="Leave"
              onPress={() => {
                setAsking(false);
                leave();
              }}
              testID="game-leave"
            />
            <Button kind="text" label="Keep playing" onPress={closeAsk} />
          </View>
        </Sheet>
      </View>
    </FrameFx.Provider>
  );
}

/** One numbered rule: the number in a small accent patch, the words beside it. */
function Rule({ n, text }: { n: number; text: string }) {
  const a = useGameAccent();
  return (
    <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: a.wash, alignItems: "center", justifyContent: "center", marginTop: 1 }}>
        <T v="caption" num style={{ color: a.deep, fontFamily: fonts.bold }}>
          {n}
        </T>
      </View>
      <Rich text={text} style={{ flex: 1 }} />
    </View>
  );
}

/** How to play: numbered steps, and Play closes it. */
export function HowToSheet({ open, onClose, steps, onPlay }: { open: boolean; onClose: () => void; steps: string[]; onPlay?: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="How to play" testID="howto">
      <View style={{ gap: space[3] }}>
        {steps.map((s, i) => (
          <Rule key={i} n={i + 1} text={s} />
        ))}
        <Button
          label={onPlay ? "Play" : "Got it"}
          kind={onPlay ? "primary" : "quiet"}
          style={{ marginTop: space[2] }}
          onPress={() => {
            onClose();
            onPlay?.();
          }}
          testID="howto-play"
        />
      </View>
    </Sheet>
  );
}

/* ------------------------------------------------------------ start screen */

/**
 * A game's intro, under 500ms: its emblem pops on the field, the title rises
 * out of its mask, the line fades up and the choices rise in 40ms apart.
 * Play works from the first frame.
 */
export const INTRO_AT = { title: 80, line: 200, chips: 240 } as const;

/** The game's emblem: a hand-shaped pebble in the game's own colour, with its icon. */
export function Emblem({ icon, size = 64, onField, i = 0 }: { icon: Icon; size?: number; /** Sits on the blue field: a pastel patch in both themes. */ onField?: boolean; /** Which pebble shape (0 to 3). */ i?: number }) {
  const c = useTheme();
  const a = useGameAccent();
  const reduce = useReducedMotion();
  const col = onField ? emblemOn(c.dark, a) : { bg: a.wash, fg: a.deep };
  const k = size / 60;
  const shape = pebbleShape(i);
  const scaledShape = { borderTopLeftRadius: (shape.borderTopLeftRadius as number) * k, borderTopRightRadius: (shape.borderTopRightRadius as number) * k, borderBottomRightRadius: (shape.borderBottomRightRadius as number) * k, borderBottomLeftRadius: (shape.borderBottomLeftRadius as number) * k };
  return (
    <Animated.View entering={reduce ? undefined : presets.pop(60)} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[{ width: size, height: size, alignItems: "center", justifyContent: "center", backgroundColor: col.bg }, scaledShape]}>
      <EntryIcon icon={icon} size={Math.round(size * 0.44)} color={col.fg} />
    </Animated.View>
  );
}

export type Choice<V extends string> = { id: V; name: string; line?: string };

/**
 * The start of every game: its emblem and name on the field, what it is in
 * one line, a choice when the game has one (level, room, mode), the rules,
 * and one lime Play button.
 */
export function StartScreen<V extends string>({
  title,
  line,
  howTo,
  choices,
  choice,
  onChoice,
  choiceLabel = "Choose",
  onPlay,
  playLabel = "Play",
  busy,
  error,
  note,
  below,
  icon,
  testID,
}: {
  title: string;
  line: string;
  howTo: string[];
  choices?: Choice<V>[];
  choice?: V;
  onChoice?: (v: V) => void;
  choiceLabel?: string;
  onPlay: () => void;
  playLabel?: string;
  busy?: boolean;
  error?: string | null;
  /** A quiet fact under the line: "Your best: 240". */
  note?: string | null;
  below?: React.ReactNode;
  /** The game's icon; found from the catalog by title when not given. */
  icon?: Icon;
  testID?: string;
}) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [help, setHelp] = React.useState(false);
  const mark = icon ?? ALL_ENTRIES.find((e) => e.title === title)?.icon;
  // The rules show in the empty middle until the first Play on this phone; after that, one link.
  const rules = useSeen(`howto.${testID ?? title}`);
  const play = () => {
    rules.mark();
    onPlay();
  };
  const summary = !rules.seen && howTo.length ? howTo.slice(0, 3) : null;
  const head = (
    <View style={{ gap: space[3], paddingTop: space[2] }}>
      {mark ? <Emblem icon={mark} onField /> : null}
      <View style={{ gap: space[1] }}>
        <MaskUp delay={INTRO_AT.title}>
          <T v={title.length > 18 ? "h1" : "display"} tone="onField" accessibilityRole="header">
            {title}
          </T>
        </MaskUp>
        <Animated.View entering={reduce ? undefined : presets.fade(INTRO_AT.line)}>
          <T v="small" tone="onFieldMuted" style={{ maxWidth: 460 }}>
            {line}
          </T>
        </Animated.View>
      </View>
      {note ? (
        <View style={{ alignSelf: "flex-start", backgroundColor: c.fieldTint, borderRadius: 999, paddingVertical: 6, paddingHorizontal: space[3] }}>
          <T v="caption" tone="onField" num style={{ fontFamily: fonts.bold }}>
            {note}
          </T>
        </View>
      ) : null}
    </View>
  );
  return (
    <GameFrame title="" head={head} testID={testID ?? "start"} thumb={<Button label={playLabel} onPress={play} busy={busy} testID="start-play" />}>
      {choices?.length ? (
        <View style={{ gap: space[2] }} accessibilityRole="radiogroup" accessibilityLabel={choiceLabel}>
          <Label>{choiceLabel}</Label>
          {choices.map((o, i) => {
            const on = o.id === choice;
            return (
              <Animated.View key={o.id} entering={reduce ? undefined : presets.rise(staggerDelay(i, INTRO_AT.chips))}>
                <Press
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={o.line ? `${o.name}. ${o.line}` : o.name}
                  feel="select"
                  onPress={() => onChoice?.(o.id)}
                  testID={`choice-${o.id}`}
                  scale={0.98}
                  innerStyle={{ minHeight: layout.row, justifyContent: "center", paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: layout.radius, backgroundColor: on ? c.ink : c.card }}
                >
                  <T v="bodyStrong" style={{ color: on ? c.bg : c.ink }}>
                    {o.name}
                  </T>
                  {o.line ? (
                    <T v="small" style={{ color: on ? c.bg : c.muted, opacity: on ? 0.8 : 1 }}>
                      {o.line}
                    </T>
                  ) : null}
                </Press>
              </Animated.View>
            );
          })}
        </View>
      ) : null}
      {summary ? (
        <View style={{ gap: space[2] }} testID="start-rules">
          <Label>How to play</Label>
          <Stone>
            <View style={{ gap: space[3] }}>
              {summary.map((s, i) => (
                <Rule key={i} n={i + 1} text={s} />
              ))}
            </View>
          </Stone>
        </View>
      ) : null}
      {!summary || howTo.length > 3 ? <Button kind="quiet" label={summary ? "All the rules" : "How to play"} onPress={() => setHelp(true)} testID="start-howto" /> : null}
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
      {below}
      <HowToSheet open={help} onClose={() => setHelp(false)} steps={howTo} onPlay={play} />
    </GameFrame>
  );
}

/* --------------------------------------------------------------- HUD parts */

/** Lives as small dots (filled = left). */
export function Lives({ left, total }: { left: number; total: number }) {
  const c = useTheme();
  const on = useOnField();
  return (
    <View accessible accessibilityLabel={`${left} of ${total} lives left`} style={{ flexDirection: "row", gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: i < left ? (on ? c.lime : c.ink) : on ? c.fieldTint : c.hairline }} />
      ))}
    </View>
  );
}

/** Steps as a strip of short bars: done, current, still to come. */
export function StepStrip({ at, total, marks }: { at: number; total: number; marks?: ("ok" | "miss" | null)[] }) {
  const c = useTheme();
  const on = useOnField();
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={`Step ${Math.min(at + 1, total)} of ${total}`} style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: total }, (_, i) => {
        const m = marks?.[i];
        const bg = on ? (m === "ok" ? c.lime : m === "miss" ? c.missBg : i === at ? c.onField : c.fieldTint) : m === "ok" ? (c.dark ? c.primary : c.ink) : m === "miss" ? c.danger : i === at ? c.accent : c.fieldLine;
        return <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: bg }} />;
      })}
    </View>
  );
}

/** A line under the HUD: "Question 3 · 41s". */
export function HudLine({ left, right }: { left: string; right?: React.ReactNode }) {
  const on = useOnField();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], marginTop: space[2] }}>
      <T v="small" tone={on ? "onFieldMuted" : "muted"} num style={{ flex: 1 }}>
        {left}
      </T>
      {typeof right === "string" ? (
        <T v="small" tone={on ? "onField" : "muted"} num style={{ fontFamily: fonts.bold }}>
          {right}
        </T>
      ) : (
        right
      )}
    </View>
  );
}

/** A clock bar for the field: lime on a soft track. */
export function HudBar({ value, label }: { value: number; label?: string }) {
  const c = useTheme();
  const on = useOnField();
  return <ProgressLine value={value} height={6} label={label} color={on ? c.lime : undefined} track={on ? c.fieldTint : undefined} />;
}

/** A small strong word for the HUD's right side (a timer, a multiplier). */
export function HudWord({ children, testID, accessibilityRole }: { children: React.ReactNode; testID?: string; accessibilityRole?: "timer" | "text" }) {
  const on = useOnField();
  return (
    <T v="small" tone={on ? "onField" : "ink"} num testID={testID} accessibilityRole={accessibilityRole} style={{ fontFamily: fonts.bold }}>
      {children}
    </T>
  );
}

/* ---------------------------------------------------------------- verdict */

const REACT_RIGHT = ["Nice.", "Spot on.", "That's it.", "Exactly."];
const REACT_WRONG = ["Not quite.", "Close, but no.", "Let's see why."];

/**
 * The verdict under an answer: a stone bubble with a lime tick when right,
 * a warm one when not, the word for it and why. It rises into place; the
 * haptic (success or warn) fires once. An optional "learn this" link follows.
 */
export function Verdict({ right, title, why, seed = 0, learn, partial }: { right: boolean; title?: string; why?: string | null; seed?: number; learn?: { label: string; onPress: () => void } | null; partial?: boolean }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const funny = settingsStore.use((s) => s.reactions);
  React.useEffect(() => {
    if (right) haptic.success();
    else haptic.warn();
  }, [right, seed]);
  const pool = right ? REACT_RIGHT : REACT_WRONG;
  const head = title ?? (partial ? "Partly right." : funny ? pool[seed % pool.length]! : right ? "Right." : "Not this one.");
  return (
    <View style={{ gap: space[2] }}>
      <Animated.View testID="verdict" entering={reduce ? undefined : presets.verdict()} accessibilityLiveRegion="polite" accessibilityRole="alert" style={{ backgroundColor: right ? c.card : c.missBg, borderRadius: layout.radiusLg, padding: space[4], gap: space[1] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
          {right ? (
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
              <Check size={16} color={c.onLime} strokeWidth={3} />
            </View>
          ) : null}
          <T v="h2" style={{ flex: 1 }}>
            {head}
          </T>
        </View>
        {why ? <Rich text={why} v="small" /> : null}
      </Animated.View>
      {learn ? <Button kind="text" label={learn.label} onPress={learn.onPress} testID="verdict-learn" /> : null}
    </View>
  );
}

/* ------------------------------------------------------------- end screen */

/**
 * The end of a round, in one order ("the case closes"):
 *     0ms  the result rises on the field; the score's digits roll in and
 *          the ring draws
 *   280ms  won: a success haptic; lost: a warning haptic and a 2px dip;
 *          in between: a tap
 *   320ms  won: a pixel burst behind the score (confetti too for a
 *          perfect round or a new personal best, on the whole screen)
 *   640ms  the reaction sticker and its line slap in (src/ds/reactions)
 *   900ms  the small numbers rise in on the layer, 60ms apart
 * Timed by the kit's useCelebrate and `beats`. Play again works from 0ms.
 * Reduce Motion: it fades in, the haptic still plays, no particles.
 */
export const END_AT = { land: beats.haptic, sticker: beats.sticker, stats: beats.stats, statStep: 60 } as const;

export function EndPanel({ kicker = "Round over", score, scoreOf, line, stats, right, total, outcome, best, quiet, children }: { kicker?: string; /** A clinical case: no sticker and no confetti (docs/DESIGN.md, case player). */ quiet?: boolean; score: string; scoreOf?: string; line?: string; stats?: { label: string; value: string }[]; right?: number; total?: number; outcome?: "won" | "lost" | "mixed"; /** A new personal best: confetti. */ best?: boolean; children?: React.ReactNode }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const fx = React.useContext(FrameFx);
  const m = /^([^0-9-]*)(-?\d+)(\D*)$/.exec(score);
  const num = m ? { pre: m[1] ?? "", n: Number(m[2]), post: m[3] ?? "" } : null;
  const ratio = (total ?? 0) > 0 ? (right ?? 0) / (total ?? 1) : null;
  const result = outcome ?? (ratio === null ? "mixed" : ratio >= 0.6 ? "won" : ratio >= 0.35 ? "mixed" : "lost");
  const perfect = ratio === 1 && result === "won";
  const mood = outcome ? (outcome === "won" ? "streak" : outcome === "lost" ? "wrong" : "near") : moodForScore(right ?? 0, total ?? 0);
  const [burst, setBurst] = React.useState(0);
  const dip = useSharedValue(0);
  const celebrate = useCelebrate();
  React.useEffect(() => {
    reactions.dismiss();
    const won = result === "won";
    // One order for every win (the kit's beats): the score rolls, then the haptic, then particles, then the sticker.
    celebrate([
      { at: beats.haptic, run: won ? () => (haptic.success(), streakMoment.done()) : result === "lost" ? haptic.warn : haptic.tap },
      ...(won ? [{ at: beats.particles, motion: true, run: () => (setBurst(1), !quiet && (perfect || best) ? fx.confetti() : undefined) }] : []),
      ...(result === "lost" ? [{ at: beats.haptic, motion: true, run: () => dip.set(withSequence(withTiming(2, { duration: dur.micro, easing: curves.out }), withSpring(0, springs.smooth))) }] : []),
      // The shared reaction layer waits SETTLE_MS itself, so ask early enough to land on the beat.
      ...(quiet ? [] : [{ at: Math.max(0, beats.sticker - SETTLE_MS), run: () => reactions.show(mood) }]),
    ]);
    // Once per panel: a new round mounts a new panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dipStyle = useAnimatedStyle(() => ({ transform: [{ translateY: dip.value }] }));
  const big = { fontFamily: fonts.big, fontSize: 46, lineHeight: 50, letterSpacing: -1.2, color: c.onField };
  const hero = (
    <Animated.View entering={reduce ? presets.fade() : presets.rise()} style={{ flexDirection: "row", alignItems: "center", gap: space[4], paddingTop: space[1] }} testID="game-over">
      <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
        <T v="label" tone="onFieldMuted">
          {kicker}
        </T>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
          <Animated.View style={dipStyle}>
            {result === "won" ? <PixelBurst fire={burst} reach={56} /> : null}
            {num ? (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }} testID="end-score" accessible accessibilityLabel={score}>
                {num.pre ? <T style={big}>{num.pre}</T> : null}
                <RollingNumber value={num.n} style={big} />
                {num.post ? <T style={big}>{num.post}</T> : null}
              </View>
            ) : (
              <T style={big} num maxFontSizeMultiplier={1.15} testID="end-score">
                {score}
              </T>
            )}
          </Animated.View>
          {scoreOf ? (
            <T v="h3" tone="onFieldMuted" num>
              {scoreOf}
            </T>
          ) : null}
        </View>
        {line ? (
          <T v="h3" tone="onField">
            {line}
          </T>
        ) : null}
      </View>
      {ratio !== null && (total ?? 0) > 1 ? <ProgressRing pct={Math.round(ratio * 100)} size={64} stroke={7} color={c.lime} track={c.fieldTint} label={`${Math.round(ratio * 100)} percent right`} /> : null}
    </Animated.View>
  );
  // The big number belongs on the field: hand it to the frame, take it back on the way out.
  React.useLayoutEffect(() => {
    fx.setHero(hero);
    // The hero is rebuilt from these; a new object every render would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, scoreOf, line, kicker, burst, c.dark]);
  React.useLayoutEffect(() => () => fx.setHero(null), [fx]);
  return (
    <View style={{ gap: space[5] }}>
      {stats?.length ? (
        <View style={{ flexDirection: "row", gap: space[2] }}>
          {stats.map((s, i) => {
            // Points landing: the XP chip is ink (the lime one is Play again), and its number rolls up.
            const xp = s.label === "XP" ? /^\+(\d+)$/.exec(s.value) : null;
            return (
              <Animated.View key={s.label} entering={reduce ? undefined : presets.rise(END_AT.stats + i * END_AT.statStep)} accessible accessibilityLabel={`${s.label}: ${s.value}`} testID={xp ? "end-xp" : undefined} style={{ flex: 1, backgroundColor: xp ? c.ink : c.card, borderRadius: layout.radius, paddingVertical: space[3], paddingHorizontal: space[3], gap: 2 }}>
                {xp ? (
                  <RollingNumber value={Number(xp[1])} prefix="+" v="h2" style={{ color: c.bg }} />
                ) : (
                  <T v="h2" num numberOfLines={1} adjustsFontSizeToFit>
                    {s.value}
                  </T>
                )}
                <T v="caption" style={{ color: xp ? c.bg : c.muted }}>
                  {s.label}
                </T>
              </Animated.View>
            );
          })}
        </View>
      ) : null}
      <QuestMoment />
      {children}
    </View>
  );
}

/** The two end buttons: Play again (lime) and back to Practise. */
export function EndThumb({ again, againLabel = "Play again", extra }: { again: () => void; againLabel?: string; extra?: { label: string; onPress: () => void } }) {
  return (
    <>
      <Button label={againLabel} onPress={again} testID="game-again" />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button kind="text" label="Back to Practise" onPress={leave} testID="game-done" />
        {extra ? <Button kind="text" label={extra.label} onPress={extra.onPress} /> : null}
      </View>
    </>
  );
}

/* ------------------------------------------------------------ load states */

/** While the first move loads, and when it cannot. A wait over a second adds the pixel loader. */
export function FrameLoading({ title }: { title: string }) {
  const slow = useSlow(true, 1000);
  return (
    <GameFrame title={title} testID="frame-loading">
      <View style={{ gap: space[3] }} accessibilityRole="progressbar" accessibilityLabel="Loading">
        {slow ? <PixelLoader label="Setting up the round" /> : null}
        <Skeleton w="70%" h={26} />
        <Skeleton h={16} />
        <Skeleton w="85%" h={16} />
        {[0, 1, 2, 3].map((k) => (
          <Skeleton key={k} h={52} r={18} />
        ))}
      </View>
    </GameFrame>
  );
}

/** Only blame the internet when the phone really could not reach the server. */
export function loadLine(error: unknown): string {
  if (!(error instanceof ApiFailure) || error.code === "network") return "Check your internet and try again.";
  if (error.code === "server_error") return "Something went wrong on our side. Try again in a minute.";
  return error.message || "That didn't work. Try again.";
}

export function FrameError({ title, error, onRetry, web = "/practice" }: { title: string; error: unknown; onRetry: () => void; /** The same page on the website, for a part the app does not have yet. */ web?: string }) {
  return (
    <GameFrame title={title} testID="frame-error">
      {isSoon(error) ? (
        <SoonState web={web} />
      ) : (
        <QuietEmpty title="That didn't load" body={loadLine(error)} action={{ label: "Try again", onPress: onRetry }} testID="load-error" />
      )}
    </GameFrame>
  );
}

/** A small inline error line under the answers (a lost connection). */
export function MoveError({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <T v="small" tone="danger" accessibilityLiveRegion="polite" testID="move-error">
      {text}
    </T>
  );
}
