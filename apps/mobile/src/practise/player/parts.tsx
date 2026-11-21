import { Check, ChevronDown, ChevronUp, FlaskConical } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { Button, HintBubble, HintText, Label, layerShadow, Stone, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Burst, curves, Enter, Press, springs } from "@/motion";
import { Rich } from "@/study/rich";
import { fonts, layout, space, useTheme } from "@/theme";
import { AnswerRow } from "../parts";
import { BLOCK_LABEL, GRADE_WORD, type ContextBlock, type Grade, type Option, type StepKey } from "./types";

/* ---------------------------------------------------------------- the case */

const WHO = { C: "You", P: "Patient", R: "Relative" } as const;

function Block({ b, opened, onOpen }: { b: ContextBlock; opened: boolean; onOpen: () => void }) {
  const c = useTheme();
  if (b.kind === "dialogue") {
    return (
      <View style={{ gap: space[2] }}>
        <T v="label" tone="muted">
          {BLOCK_LABEL.dialogue}
        </T>
        {b.lines.map(([who, line], k) => (
          <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
            <T v="caption" tone="muted" style={{ width: 56, paddingTop: 5 }}>
              {WHO[who]}
            </T>
            <T v="reading" style={{ flex: 1 }}>
              {line}
            </T>
          </View>
        ))}
      </View>
    );
  }
  if (b.kind === "investigation") {
    if (b.onRequest && !opened) {
      return (
        <Press accessibilityRole="button" accessibilityLabel={`Open the result: ${b.label}`} onPress={onOpen} feel="select" scale={0.98} testID="case-open-test" innerStyle={{ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[3], borderRadius: layout.radius, backgroundColor: c.bg, paddingHorizontal: space[4], paddingVertical: space[3] }}>
          <FlaskConical size={18} color={c.ink} />
          <T v="bodyStrong" style={{ flex: 1 }}>
            {b.label}
          </T>
          <T v="caption" tone="muted">
            Open the result
          </T>
        </Press>
      );
    }
    return (
      <View style={{ gap: space[1] }}>
        <T v="label" tone="muted">{`${BLOCK_LABEL.investigation}: ${b.label}`}</T>
        <Rich text={b.text} v="reading" />
      </View>
    );
  }
  return (
    <View style={{ gap: space[1] }}>
      <T v="label" tone="muted">
        {BLOCK_LABEL[b.kind]}
      </T>
      <Rich text={b.text} v="reading" />
    </View>
  );
}

/**
 * The case, on a stone: short labelled blocks you can scan (where you are,
 * the person, why they came, the story so far, what you see, tests), not a
 * wall of text. A long case can be folded once you have read it, so the
 * question and the answers get the room; tests marked "on request" stay
 * shut until you ask for them. Nothing in here moves: it is reading text.
 */
export function CaseStone({ blocks, title = "The case", foldable = true, startFolded = false, testID = "case" }: { blocks: ContextBlock[]; title?: string; foldable?: boolean; startFolded?: boolean; testID?: string }) {
  const c = useTheme();
  const [folded, setFolded] = React.useState(startFolded);
  const [opened, setOpened] = React.useState<number[]>([]);
  if (!blocks.length) return null;
  const canFold = foldable && blocks.length > 2;
  const shown = folded ? blocks.slice(0, 1) : blocks;
  return (
    <Stone testID={testID} pad={space[4]} style={{ gap: space[4] }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 24 }}>
        <T v="label" style={{ color: c.link }} accessibilityRole="header">
          {title}
        </T>
        {canFold ? (
          <Press accessibilityRole="button" accessibilityLabel={folded ? "Show the whole case" : "Fold the case"} accessibilityState={{ expanded: !folded }} onPress={() => setFolded((f) => !f)} hitSlop={12} scale={0.94} testID="case-fold" innerStyle={{ flexDirection: "row", alignItems: "center", gap: 4, minHeight: 32, paddingLeft: space[3] }}>
            <T v="caption" tone="muted">
              {folded ? "Show all" : "Fold"}
            </T>
            {folded ? <ChevronDown size={16} color={c.muted} /> : <ChevronUp size={16} color={c.muted} />}
          </Press>
        ) : null}
      </View>
      {shown.map((b, k) => (
        <Block key={k} b={b} opened={opened.includes(k)} onOpen={() => setOpened((o) => [...o, k])} />
      ))}
      {folded ? (
        <T v="small" tone="muted">{`${blocks.length - 1} more ${blocks.length - 1 === 1 ? "part" : "parts"} folded away.`}</T>
      ) : null}
    </Stone>
  );
}

/* ------------------------------------------------------------ the question */

/**
 * The question in the title face, with the hint bulb beside it when the step
 * has hints. Hints are the student's choice and come one at a time (up to
 * three): a direction, what to weigh, then a narrowing. None names the answer.
 */
export function QuestionHead({ prompt, hints, used, onHint, locked, kicker }: { prompt: string; hints: string[]; /** How many hints are showing. */ used: number; /** Ask for the next hint. */ onHint: () => void; /** The step is answered: hints already shown stay, no new ones. */ locked?: boolean; kicker?: string }) {
  const [open, setOpen] = React.useState(false);
  const has = hints.length > 0;
  const toggle = () => {
    if (!open && used === 0) onHint();
    setOpen((o) => !o);
  };
  return (
    <View style={{ gap: space[3] }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space[3] }}>
        <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
          {kicker ? (
            <T v="label" tone="muted">
              {kicker}
            </T>
          ) : null}
          <Rich text={prompt} v="h2" accessibilityRole="header" testID="player-prompt" />
        </View>
        {has ? <HintBubble open={open} onToggle={toggle} /> : null}
      </View>
      {has && open ? (
        <View style={{ gap: space[2] }} testID="player-hints">
          {hints.slice(0, Math.max(1, used)).map((h, k) => (
            <HintText key={k} testID={`hint-${k + 1}`}>
              <T v="caption" tone="muted">{`Hint ${k + 1} of ${hints.length}  `}</T>
              {h}
            </HintText>
          ))}
          {used < hints.length && !locked ? (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }}>
              <T v="caption" tone="muted" style={{ flex: 1 }}>
                Each hint lowers what this step can score.
              </T>
              <Button kind="quiet" small full={false} label={`Hint ${used + 1}`} onPress={onHint} testID="hint-more" />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------- the options */

/**
 * The answers: 4 to 6 stone pills (fewer still draw). Choose one (it turns
 * ink), or for "tick all that fit" choose several; nothing is sent until
 * Check. With `answerKey` the step is over: the best one is lime with "Correct
 * answer", your wrong pick is warm with "Your answer", and every option
 * carries its own reason. `tried` are wrong picks from an earlier try: they
 * are dimmed and cannot be picked again.
 */
export function Options({ options, picked, onPick, answerKey, tried = [], disabled, testPrefix = "player-option" }: { options: Option[]; picked: string[]; onPick: (id: string) => void; answerKey?: StepKey | null; tried?: string[]; disabled?: boolean; testPrefix?: string }) {
  return (
    <View accessibilityRole="radiogroup" style={{ gap: space[2] }} testID="player-options">
      {options.map((o, j) => {
        const mine = picked.includes(o.id);
        const k = answerKey?.options[o.id];
        const state = k ? (k.grade === "best" ? "right" : mine ? "wrong" : "idle") : tried.includes(o.id) ? "dim" : mine ? "picked" : "idle";
        const note = k ? [k.grade !== "best" && mine && k.grade !== "poor" ? GRADE_WORD[k.grade] + "." : null, k.consequence, k.feedback].filter(Boolean).join(" ") : null;
        return <AnswerRow key={o.id} index={j} text={o.text} testID={`${testPrefix}-${j}`} state={state} note={note || null} disabled={!!answerKey || disabled || tried.includes(o.id)} onPress={() => onPick(o.id)} />;
      })}
    </View>
  );
}

/* ---------------------------------------------------------------- feedback */

function Part({ label, children, i }: { label: string; children: React.ReactNode; i: number }) {
  return (
    <Enter i={i} style={{ gap: space[1] }}>
      <Label>{label}</Label>
      <Stone pad={space[4]} style={{ gap: space[2] }}>
        {children}
      </Stone>
    </Enter>
  );
}

/** A grade in words on a small patch: lime for best, warm for harmful, stone between. */
export function GradeChip({ grade }: { grade: Grade }) {
  const c = useTheme();
  const bg = grade === "best" ? c.lime : grade === "harmful" ? c.missBg : c.card;
  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: bg, borderRadius: 999, paddingVertical: 6, paddingHorizontal: space[3] }}>
      <T v="caption" style={{ color: grade === "best" ? c.onLime : c.ink, fontFamily: fonts.bold }}>
        {GRADE_WORD[grade]}
      </T>
    </View>
  );
}

/**
 * After the answer, under the options (which now each carry their own
 * reason): why the best answer is right, the concept by name, the clinical
 * point, and the errors people often make here. Each part is a labelled
 * stone so it can be scanned; parts a case does not have are left out.
 */
export function Feedback({ answerKey, testID = "player-feedback" }: { answerKey: StepKey; testID?: string }) {
  const e = answerKey.explanation;
  let i = 0;
  const any = e.whyCorrect || e.concept || e.implication || e.commonErrors?.length || e.more;
  if (!any) return null;
  return (
    <View style={{ gap: space[4] }} testID={testID}>
      {e.whyCorrect ? (
        <Part label="Why this is right" i={i++}>
          <Rich text={e.whyCorrect} v="reading" />
        </Part>
      ) : null}
      {e.concept || e.theory ? (
        <Part label="The concept" i={i++}>
          {e.concept ? <T v="bodyStrong">{e.concept}</T> : null}
          {e.theory ? <Rich text={e.theory} v="body" /> : null}
        </Part>
      ) : null}
      {e.implication ? (
        <Part label="The clinical point" i={i++}>
          <Rich text={e.implication} v="body" />
        </Part>
      ) : null}
      {e.commonErrors?.length ? (
        <Part label="Common errors" i={i++}>
          {e.commonErrors.map((x, k) => (
            <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
              <T v="body" tone="muted">
                {k + 1}.
              </T>
              <Rich text={x} v="body" style={{ flex: 1 }} />
            </View>
          ))}
        </Part>
      ) : null}
      {e.more ? (
        <Part label={e.more.label} i={i++}>
          <Rich text={e.more.text} v="body" />
        </Part>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------- the verdict */

export type SheetTone = "right" | "wrong" | "partial";

/**
 * The verdict rising from the bottom after Check. It is the kit's ResultSheet
 * with two things a case needs: a second, quieter action ("See why", "Show
 * the answer") and a middle tone for an acceptable choice. The haptic fires
 * once as it lands; `win` adds sparks for a real win only. With Reduce Motion
 * it appears in place.
 */
export function VerdictSheet({ open, tone, title, why, action, secondary, win, testID = "verdict" }: { open: boolean; tone: SheetTone; title: string; why?: string | null; action: { label: string; onPress: () => void; testID?: string }; secondary?: { label: string; onPress: () => void; testID?: string } | null; win?: boolean; testID?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const v = useSharedValue(open ? 1 : 0);
  const [shown, setShown] = React.useState(open);
  if (open && !shown) setShown(true);
  if (!open && shown && reduce) setShown(false);
  React.useEffect(() => {
    if (open) {
      if (tone === "right") haptic.success();
      else haptic.warn();
      v.set(reduce ? 1 : withSpring(1, springs.sheet));
    } else {
      v.set(
        reduce
          ? 0
          : withTiming(0, { duration: 220, easing: curves.out }, (done) => {
              if (done) scheduleOnRN(setShown, false);
            }),
      );
    }
  }, [open, tone, reduce, v]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: `${(1 - v.value) * 105}%` }] }));
  const [fire, setFire] = React.useState(0);
  React.useEffect(() => {
    if (!open || tone !== "right" || !win) return;
    const id = setTimeout(() => setFire((n) => n + 1), 320);
    return () => clearTimeout(id);
  }, [open, tone, win]);
  if (!shown) return null;
  return (
    <Animated.View testID={testID} accessibilityLiveRegion="polite" accessibilityViewIsModal style={[{ position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: tone === "wrong" ? c.missBg : c.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: space[5], paddingHorizontal: layout.gutter, paddingBottom: insets.bottom + space[4], gap: space[2], ...layerShadow(c) }, style]}>
      <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
          {tone === "right" ? (
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
              <Check size={16} color={c.onLime} strokeWidth={3} />
              {win ? <Burst fire={fire} reach={38} /> : null}
            </View>
          ) : null}
          <T v="h2" style={{ flex: 1 }} accessibilityRole="header">
            {title}
          </T>
        </View>
        {why ? <Rich text={why} v="small" numberOfLines={4} /> : null}
        <Button kind="ink" label={action.label} onPress={action.onPress} style={{ marginTop: space[2] }} testID={action.testID ?? `${testID}-next`} />
        {secondary ? <Button kind="text" label={secondary.label} onPress={secondary.onPress} testID={secondary.testID ?? `${testID}-more`} /> : null}
      </View>
    </Animated.View>
  );
}
