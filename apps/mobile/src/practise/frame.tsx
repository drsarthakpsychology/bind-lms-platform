import { router } from "expo-router";
import { CircleHelp, X } from "lucide-react-native";
import * as React from "react";
import { BackHandler, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, EmptyState, Sheet, Skeleton, T, VerdictBand } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { ApiFailure } from "@/api/errors";
import { isSoon } from "./api";
import { Confetti, RollingNumber } from "@/motion";
import { Bump, Rise } from "./fx";
import { moodForScore, reactions, StickerLayer } from "./reactions";

/**
 * The one frame every game and practice tool sits in. Four parts, always in
 * the same places, so a student learns them once:
 *
 *   top      close (asks first while a round runs), the name, How to play
 *   HUD      the score in the pixel font, and the game's own line (time,
 *            lives, door n of m) right under the top
 *   play     the one question or board, scrolling if it must
 *   thumb    the one action, pinned low where the thumb is
 *
 * The verdict band rises under the answer; the end screen is the same frame
 * with a sticker, the score and Play again. How to play is a sheet; its Play
 * button closes it and starts.
 */

export function leave(): void {
  if (router.canGoBack()) router.back();
  else router.replace("/practise");
}

export type FrameProps = {
  title: string;
  /** Plain steps, one per line. Shown in a sheet. */
  howTo?: string[];
  /** The score, drawn in the pixel font. */
  score?: string;
  scoreLabel?: string;
  /** Under the top: a time line, lives, "Door 2 of 5". */
  hud?: React.ReactNode;
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
};

export function GameFrame({ title, howTo, score, scoreLabel = "Score", hud, children, thumb, testID, confirmLeave, saves, hideHowTo, fixed }: FrameProps) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [help, setHelp] = React.useState(false);
  const [asking, setAsking] = React.useState(false);
  const close = React.useCallback(() => {
    if (confirmLeave) setAsking(true);
    else leave();
  }, [confirmLeave]);
  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, [close]);
  React.useEffect(() => () => reactions.dismiss(), []);
  const closeHelp = React.useCallback(() => setHelp(false), []);
  const closeAsk = React.useCallback(() => setAsking(false), []);
  const body = <View style={{ gap: space[5], width: "100%", maxWidth: layout.readingWidth, alignSelf: "center" }}>{children}</View>;
  return (
    <View testID={testID} style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ backgroundColor: c.bg }}>
        <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: space[1], gap: space[1] }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} hitSlop={4} style={({ pressed }) => ({ width: layout.target, height: layout.target, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? c.tint : "transparent" })} testID="game-close">
            <X size={24} color={c.ink} />
          </Pressable>
          <T v="bodyStrong" numberOfLines={2} style={{ flex: 1, minWidth: 0 }}>
            {title}
          </T>
          {score !== undefined ? (
            <View accessible accessibilityLabel={`${scoreLabel} ${score}`} style={{ paddingHorizontal: space[2], alignItems: "flex-end" }}>
              <Bump value={score}>
                <T style={{ fontFamily: fonts.pixelDigits, fontSize: 22, lineHeight: 28, color: c.ink }} num maxFontSizeMultiplier={1.2} testID="game-score">
                  {score}
                </T>
              </Bump>
            </View>
          ) : null}
          {howTo?.length && !hideHowTo ? (
            <Pressable accessibilityRole="button" accessibilityLabel="How to play" onPress={() => setHelp(true)} hitSlop={4} style={({ pressed }) => ({ width: layout.target, height: layout.target, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? c.tint : "transparent" })} testID="game-help">
              <CircleHelp size={22} color={c.ink} />
            </Pressable>
          ) : null}
        </View>
        {hud ? <View style={{ paddingHorizontal: layout.gutter, paddingBottom: space[3], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>{hud}</View> : null}
      </View>
      {fixed ? (
        <View style={{ flex: 1, paddingHorizontal: layout.gutter, paddingTop: space[3] }}>{body}</View>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: space[6] }}>
          {body}
        </ScrollView>
      )}
      {thumb ? (
        <View style={{ borderTopWidth: 1, borderColor: c.hairline, backgroundColor: c.bg, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3] }}>
          <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>{thumb}</View>
        </View>
      ) : null}
      <StickerLayer />
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
  );
}

/** How to play: numbered steps, and Play closes it. */
export function HowToSheet({ open, onClose, steps, onPlay }: { open: boolean; onClose: () => void; steps: string[]; onPlay?: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="How to play" testID="howto">
      <View style={{ gap: space[3] }}>
        {steps.map((s, i) => (
          <View key={i} style={{ flexDirection: "row", gap: space[3] }}>
            <T v="score" style={{ width: 20 }} num>
              {i + 1}
            </T>
            <Rich text={s} style={{ flex: 1 }} />
          </View>
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

export type Choice<V extends string> = { id: V; name: string; line?: string };

/**
 * The start of every game: what it is in one line, a choice when the game
 * has one (level, room, mode), How to play, and one Play button.
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
  testID?: string;
}) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [help, setHelp] = React.useState(false);
  return (
    <GameFrame title="" testID={testID ?? "start"} thumb={<Button label={playLabel} onPress={onPlay} busy={busy} testID="start-play" />}>
      <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.page)} style={{ gap: space[3], paddingTop: space[4] }}>
        <T v="display">{title}</T>
        <T tone="muted" style={{ maxWidth: 460 }}>
          {line}
        </T>
        {note ? (
          <T v="small" num style={{ fontFamily: fonts.pixelDigits, color: c.link, letterSpacing: 0.5 }}>
            {note}
          </T>
        ) : null}
      </Animated.View>
      {choices?.length ? (
        <View style={{ gap: space[2] }} accessibilityRole="radiogroup" accessibilityLabel={choiceLabel}>
          <T v="caption" tone="muted">
            {choiceLabel.toUpperCase()}
          </T>
          {choices.map((o) => {
            const on = o.id === choice;
            return (
              <Pressable
                key={o.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={o.line ? `${o.name}. ${o.line}` : o.name}
                onPress={() => {
                  haptic.select();
                  onChoice?.(o.id);
                }}
                testID={`choice-${o.id}`}
                style={({ pressed }) => ({ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: layout.radius, borderWidth: on ? 2 : 1.5, borderColor: on ? c.ink : c.cardLine, backgroundColor: pressed ? c.tint : on ? c.card : "transparent" })}
              >
                <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: on ? c.ink : c.cardLine, alignItems: "center", justifyContent: "center" }}>{on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.brand }} /> : null}</View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <T v="bodyStrong">{o.name}</T>
                  {o.line ? (
                    <T v="small" tone="muted">
                      {o.line}
                    </T>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}
      <Button kind="text" label="How to play" onPress={() => setHelp(true)} testID="start-howto" />
      {error ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
      {below}
      <HowToSheet open={help} onClose={() => setHelp(false)} steps={howTo} onPlay={onPlay} />
    </GameFrame>
  );
}

/* --------------------------------------------------------------- HUD parts */

/** Lives as small squares (filled = left). */
export function Lives({ left, total }: { left: number; total: number }) {
  const c = useTheme();
  return (
    <View accessible accessibilityLabel={`${left} of ${total} lives left`} style={{ flexDirection: "row", gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={{ width: 12, height: 12, borderRadius: 3, borderWidth: 1.5, borderColor: c.ink, backgroundColor: i < left ? c.brand : "transparent" }} />
      ))}
    </View>
  );
}

/** Steps as a strip of short bars: done, current, still to come. */
export function StepStrip({ at, total, marks }: { at: number; total: number; marks?: ("ok" | "miss" | null)[] }) {
  const c = useTheme();
  return (
    <View accessible accessibilityLabel={`Step ${Math.min(at + 1, total)} of ${total}`} style={{ flexDirection: "row", gap: 4 }}>
      {Array.from({ length: total }, (_, i) => {
        const m = marks?.[i];
        const bg = m === "ok" ? (c.dark ? c.primary : c.ink) : m === "miss" ? c.danger : i === at ? c.brand : c.hairline;
        return <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: bg }} />;
      })}
    </View>
  );
}

/** A line under the HUD: "Question 3 · 41s". */
export function HudLine({ left, right }: { left: string; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], marginTop: space[2] }}>
      <T v="small" tone="muted" num style={{ flex: 1 }}>
        {left}
      </T>
      {typeof right === "string" ? (
        <T v="small" tone="muted" num>
          {right}
        </T>
      ) : (
        right
      )}
    </View>
  );
}

/* ---------------------------------------------------------------- verdict */

/** The verdict band, with an optional "learn this" row under the why. */
export function Verdict({ right, title, why, seed, learn, partial }: { right: boolean; title?: string; why?: string | null; seed?: number; learn?: { label: string; onPress: () => void } | null; partial?: boolean }) {
  return (
    <View style={{ gap: space[2] }}>
      <Rise>
        <VerdictBand right={right} title={title ?? (partial ? "Partly right." : undefined)} why={why} seed={seed} />
      </Rise>
      {learn ? <Button kind="text" label={learn.label} onPress={learn.onPress} testID="verdict-learn" /> : null}
    </View>
  );
}

/* ------------------------------------------------------------- end screen */

/**
 * The end of a round: a sticker (when reactions are on), the score big in the
 * pixel font, a line, small numbers in a row, then whatever the game wants to
 * look back on. The frame's thumb holds Play again.
 */
export function EndPanel({ kicker = "Round over", score, scoreOf, line, stats, right, total, outcome, children }: { kicker?: string; score: string; scoreOf?: string; line?: string; stats?: { label: string; value: string }[]; right?: number; total?: number; outcome?: "won" | "lost" | "mixed"; children?: React.ReactNode }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const fired = React.useRef(false);
  const m = /^([^0-9-]*)(-?\d+)(\D*)$/.exec(score);
  const num = m ? { pre: m[1] ?? "", n: Number(m[2]), post: m[3] ?? "" } : null;
  const won = outcome ? outcome === "won" : (total ?? 0) > 0 && (right ?? 0) / (total ?? 1) >= 0.6;
  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    haptic.success();
    const mood = outcome ? (outcome === "won" ? "streak" : outcome === "lost" ? "wrong" : "near") : moodForScore(right ?? 0, total ?? 0);
    reactions.show(mood, (right ?? 0) + (total ?? 0));
  }, [outcome, right, total]);
  return (
    <Animated.View entering={reduce ? undefined : FadeInDown.duration(motion.fill)} style={{ gap: space[5], paddingTop: space[4] }} testID="game-over">
      <Confetti fire={won ? 1 : 0} />
      <View style={{ gap: space[2] }}>
        <T v="caption" tone="muted">
          {kicker.toUpperCase()}
        </T>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[2] }}>
          {num ? (
            <View style={{ flexDirection: "row", alignItems: "flex-end" }} testID="end-score" accessible accessibilityLabel={score}>
              {num.pre ? <T style={{ fontFamily: fonts.pixelDigits, fontSize: 64, lineHeight: 72, color: c.ink }}>{num.pre}</T> : null}
              <RollingNumber value={num.n} style={{ fontFamily: fonts.pixelDigits, fontSize: 64, lineHeight: 72, color: c.ink }} />
              {num.post ? <T style={{ fontFamily: fonts.pixelDigits, fontSize: 64, lineHeight: 72, color: c.ink }}>{num.post}</T> : null}
            </View>
          ) : (
            <T style={{ fontFamily: fonts.pixelDigits, fontSize: 64, lineHeight: 72, color: c.ink }} num maxFontSizeMultiplier={1.15} testID="end-score">
              {score}
            </T>
          )}
          {scoreOf ? (
            <T v="h3" tone="muted" num>
              {scoreOf}
            </T>
          ) : null}
        </View>
        {line ? <T v="h3">{line}</T> : null}
      </View>
      {stats?.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[3], borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: space[3] }}>
          {stats.map((s, i) => (
            <Animated.View key={s.label} entering={reduce ? undefined : FadeInDown.duration(260).delay(500 + i * 80)} accessible accessibilityLabel={`${s.label}: ${s.value}`}>
              <T v="score" num>
                {s.value}
              </T>
              <T v="caption" tone="muted">
                {s.label}
              </T>
            </Animated.View>
          ))}
        </View>
      ) : null}
      {children}
    </Animated.View>
  );
}

/** The two end buttons: Play again (primary) and back to Practise. */
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

/** While the first move loads, and when it cannot. */
export function FrameLoading({ title }: { title: string }) {
  return (
    <GameFrame title={title} testID="frame-loading">
      <View style={{ gap: space[3] }} accessibilityRole="progressbar" accessibilityLabel="Loading">
        <Skeleton w="70%" h={26} />
        <Skeleton h={16} />
        <Skeleton w="85%" h={16} />
        {[0, 1, 2, 3].map((k) => (
          <Skeleton key={k} h={56} r={12} />
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

export function FrameError({ title, error, onRetry }: { title: string; error: unknown; onRetry: () => void }) {
  return (
    <GameFrame title={title} testID="frame-error">
      {isSoon(error) ? (
        <EmptyState mood="sleepy" title="Coming in the next update" body="This is ready on the website and arrives in the app soon." testID="soon" />
      ) : (
        <EmptyState mood="puzzled" title="That didn't load" body={loadLine(error)} action={{ label: "Try again", onPress: onRetry }} testID="load-error" />
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
