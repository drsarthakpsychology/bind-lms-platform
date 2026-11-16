import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, RotateCcw, X } from "lucide-react-native";
import * as React from "react";
import { BackHandler, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";

import type { MapPractice, MapQuestion } from "@/api/contract";
import { answerMap, mapWallKeys, useMapRound } from "@/api/map-wall";
import { Button, EmptyState, LoadError, OptionRow, ProgressLine, Skeleton, T, VerdictBand, type OptionState } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { settingsStore } from "@/lib/settings";
import { Burst, Confetti, RollingNumber, Swap } from "@/motion";
import { fonts, layout, motion, space, useTheme } from "@/theme";

/**
 * A practice round from your map (the website's /study/map/practice): one
 * question at a time, an answer is checked at once with why, and every
 * answer is sent to the server, which grades it again and updates the map.
 */

/** The same order every time for a question (the website seeds by question id), so a retry never reshuffles. */
export function seededOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

type Pick = number | boolean | null;

function Question({ q, picked, checked, onPick }: { q: MapQuestion; picked: Pick; checked: boolean; onPick: (p: number | boolean) => void }) {
  const c = useTheme();
  const order = React.useMemo(() => (q.kind === "mcq" ? seededOrder(q.options.length, q.id) : []), [q]);
  const stateOf = (value: number | boolean): OptionState => (checked ? (value === q.answer ? "right" : picked === value ? "wrong" : "dim") : picked === value ? "picked" : "idle");
  return (
    <View style={{ gap: space[5] }}>
      {q.kind === "mcq" && q.vignette ? (
        <View style={{ borderRadius: layout.radius, borderWidth: 1, borderStyle: "dashed", borderColor: c.cardLine, backgroundColor: c.tint, padding: space[4] }}>
          <T v="small">{q.vignette}</T>
        </View>
      ) : null}
      {q.kind === "tf" ? (
        <T v="caption" tone="link">
          TRUE OR FALSE?
        </T>
      ) : null}
      <T v="h2" accessibilityRole="header">
        {q.text}
      </T>
      <View style={{ gap: space[3] }} accessibilityRole="radiogroup">
        {q.kind === "mcq"
          ? order.map((idx, k) => <OptionRow key={idx} index={k} text={q.options[idx]!} testID={`map-option-${k}`} state={stateOf(idx)} disabled={checked} onPress={() => onPick(idx)} />)
          : [true, false].map((v, k) => <OptionRow key={String(v)} index={k} text={v ? "True" : "False"} testID={`map-option-${k}`} state={stateOf(v)} disabled={checked} onPress={() => onPick(v)} />)}
      </View>
    </View>
  );
}

function RoundSkeleton() {
  return (
    <View style={{ gap: space[4] }} testID="map-round-skeleton">
      <Skeleton w="90%" h={26} />
      <Skeleton w="60%" h={26} />
      {[0, 1, 2, 3].map((k) => (
        <Skeleton key={k} h={56} r={12} />
      ))}
    </View>
  );
}

export function RoundRunner({ round, onAgain, onDone }: { round: MapPractice; onAgain: () => void; onDone: () => void }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const readAs = settingsStore.use((s) => s.readAs);
  const qc = useQueryClient();
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<Pick>(null);
  const [checked, setChecked] = React.useState(false);
  const [right, setRight] = React.useState(0);
  const [spark, setSpark] = React.useState(0);
  const startedAt = React.useRef(0);
  const unsaved = React.useRef(0);
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const total = round.questions.length;
  const done = i >= total;
  const q = round.questions[i];

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, [i]);

  React.useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onDone();
      return true;
    });
    return () => sub.remove();
  }, [onDone]);

  const check = (p: Pick = picked) => {
    if (!q || p === null || checked) return;
    const ok = p === q.answer;
    setPicked(p);
    setChecked(true);
    if (ok) {
      setRight((r) => r + 1);
      setSpark((n) => n + 1);
    }
    const ms = Math.max(0, Math.min(3_600_000, Date.now() - startedAt.current));
    // The server grades again and updates the map. One quiet retry, then a single line.
    const send = () => answerMap({ item: q.id, choice: p, ms });
    void send()
      .catch(() => send())
      .then(() => void qc.invalidateQueries({ queryKey: mapWallKeys.map }))
      .catch(() => {
        unsaved.current += 1;
        if (unsaved.current === 1) toast.show("Couldn't save that answer. Your map updates when you are back online.");
      });
  };

  const next = () => {
    setI((n) => n + 1);
    setPicked(null);
    setChecked(false);
    scroll.current?.scrollTo({ y: 0, animated: false });
    if (i + 1 >= total && right === total) haptic.success();
  };

  const allRight = done && total > 0 && right === total;

  return (
    <View testID="map-round" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: space[1] }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onDone} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} testID="map-round-close">
          <X size={24} color={c.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <ProgressLine value={total ? ((i + (checked ? 1 : 0)) / total) * 100 : 0} height={6} label={round.title} />
        </View>
        <T v="small" tone="muted" style={{ paddingRight: space[3] }} numberOfLines={1}>
          {done ? "Done" : round.topic ? "Fix it" : "Mixed"}
        </T>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: layout.gutter, gap: space[5], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
        {done ? (
          <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.page)} style={{ gap: space[5] }} testID="map-round-done">
            <T v="small" tone="muted">
              {round.title}
            </T>
            <View style={{ alignSelf: "flex-start" }}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }} accessible accessibilityLabel={`${right} of ${total} right`}>
                <RollingNumber value={right} v="h1" style={{ fontFamily: fonts.pixelDigits, fontSize: 56, lineHeight: 64 }} />
                <T style={{ fontFamily: fonts.pixelDigits, fontSize: 56, lineHeight: 64 }}>/{total}</T>
              </View>
              <Burst fire={allRight ? 1 : 0} reach={60} />
            </View>
            <VerdictBand right={right / Math.max(1, total) >= 0.7} title={allRight ? "Every one right." : right / Math.max(1, total) >= 0.7 ? "A good round." : "Worth another round."} why={round.saving ? "Your map is updated. The next round adapts to these answers." : "Staff answers are not saved."} />
          </Animated.View>
        ) : q ? (
          <Swap k={q.id} style={{ gap: space[5] }} testID={`map-q-${i}`}>
            <T v="caption" tone="muted">
              {q.label}
            </T>
            <Question q={q} picked={picked} checked={checked} onPick={(p) => (q.kind === "tf" ? check(p) : setPicked(p))} />
            {checked ? (
              <View>
                <VerdictBand right={picked === q.answer} why={readAs === "clinician" ? q.clinician || q.student : q.student || q.clinician} seed={i} />
                <View style={{ position: "absolute", top: 14, left: 14 }} pointerEvents="none">
                  <Burst fire={picked === q.answer ? spark : 0} reach={26} count={8} />
                </View>
              </View>
            ) : null}
          </Swap>
        ) : null}
      </ScrollView>
      <View style={{ borderTopWidth: 1, borderColor: c.hairline, paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3], gap: space[2] }}>
        {done ? (
          <>
            <Button label="Another round" icon={<RotateCcw size={20} color={c.onPrimary} />} onPress={onAgain} testID="map-round-again" />
            <Button kind="text" full label="Back to your map" onPress={onDone} testID="map-round-back" />
          </>
        ) : checked ? (
          <Button label={i + 1 === total ? "See how you did" : "Next"} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={next} testID="map-next" />
        ) : q?.kind === "mcq" ? (
          <Button label={picked === null ? "Pick an answer" : "Check"} disabled={picked === null} onPress={() => check()} testID="map-check" />
        ) : (
          <T v="small" tone="muted" center>
            Tap True or False.
          </T>
        )}
      </View>
      {allRight ? <Confetti fire={1} /> : null}
    </View>
  );
}

export function MapPracticeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const p = useLocalSearchParams<{ topic?: string }>();
  const topic = typeof p.topic === "string" && p.topic ? p.topic : null;
  const [n, setN] = React.useState(0);
  const q = useMapRound(topic, n);
  const done = React.useCallback(() => (router.canGoBack() ? router.back() : router.replace("/map")), []);
  if (q.data && q.data.questions.length) return <RoundRunner key={`${q.data.round}:${n}`} round={q.data} onAgain={() => setN((x) => x + 1)} onDone={done} />;
  return (
    <View testID="map-round-wait" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 72, paddingHorizontal: layout.gutter }}>
      {q.isError ? (
        <LoadError what="this round" error={q.error} onRetry={() => void q.refetch()} />
      ) : q.data ? (
        <EmptyState title="No questions for this yet" body="New questions for this topic are on their way. Try mixed practice." action={{ label: "Back to your map", onPress: done }} testID="map-round-empty" />
      ) : (
        <RoundSkeleton />
      )}
    </View>
  );
}
