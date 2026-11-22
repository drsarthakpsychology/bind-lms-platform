import { router, useLocalSearchParams } from "expo-router";
import { RotateCcw, X } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";

import type { MapPractice, MapQuestion } from "@/api/contract";
import { answerMap, mapWallKeys, useMapRound } from "@/api/map-wall";
import { BlueField, Button, FieldProgress, Layer, OptionList, QuietEmpty, ResultSheet, RoundButton, Skeleton, Stone, StillTrying, T } from "@/ds";
import { reasonOf } from "@/api/errors";
import { Pill } from "@/screens/learn/parts";
import { EndReaction, ReactionLayer, useReactions } from "@/ds/reactions";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { useHardwareBack } from "@/nav/back";
import { settingsStore } from "@/lib/settings";
import { Confetti, Enter, ProgressRing, RollingNumber, Swap } from "@/motion";
import { fonts, layout, space, useLightStatusBar, useTheme } from "@/theme";

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
  const order = React.useMemo(() => (q.kind === "mcq" ? seededOrder(q.options.length, q.id) : []), [q]);
  // The kit's answer list works on positions: map them to and from the question's own values.
  const values: (number | boolean)[] = q.kind === "mcq" ? order : [true, false];
  const at = (v: Pick) => (v === null ? null : values.indexOf(v));
  const pos = at(picked);
  return (
    <View style={{ gap: space[4] }}>
      {q.kind === "mcq" && q.vignette ? (
        <Stone pad={space[3] + 2}>
          <T v="small">{q.vignette}</T>
        </Stone>
      ) : null}
      {q.kind === "tf" ? <Pill>True or false?</Pill> : null}
      <T v="h2" accessibilityRole="header">
        {q.text}
      </T>
      <OptionList testID="map-option" options={q.kind === "mcq" ? order.map((idx) => q.options[idx]!) : ["True", "False"]} picked={pos !== null && pos >= 0 ? pos : null} checked={checked} answer={values.indexOf(q.answer)} onPick={(k) => onPick(values[k]!)} />
    </View>
  );
}

export function RoundRunner({ round, onAgain, onDone }: { round: MapPractice; onAgain: () => void; onDone: () => void }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  useLightStatusBar();
  const readAs = settingsStore.use((s) => s.readAs);
  const qc = useQueryClient();
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<Pick>(null);
  const [checked, setChecked] = React.useState(false);
  const [right, setRight] = React.useState(0);
  const startedAt = React.useRef(0);
  const unsaved = React.useRef(0);
  const scroll = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const react = useReactions();
  const total = round.questions.length;
  const done = i >= total;
  const q = round.questions[i];

  React.useEffect(() => {
    startedAt.current = Date.now();
  }, [i]);

  useHardwareBack(() => {
    onDone();
    return true;
  });

  const check = (p: Pick = picked) => {
    if (!q || p === null || checked) return;
    const ok = p === q.answer;
    setPicked(p);
    setChecked(true);
    react.answer(ok, {}, false);
    if (ok) setRight((r) => r + 1);
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
  };

  const allRight = done && total > 0 && right === total;
  const pct = Math.round((right / Math.max(1, total)) * 100);
  const ok = !!q && picked === q.answer;
  const why = q ? (readAs === "clinician" ? q.clinician || q.student : q.student || q.clinician) : null;

  return (
    <View testID="map-round" style={{ flex: 1, backgroundColor: c.field }}>
      <BlueField style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
          <RoundButton onField label="Close" onPress={onDone} testID="map-round-close">
            <X size={20} color={c.onField} />
          </RoundButton>
          <View style={{ flex: 1 }}>{done ? <T v="small" tone="onFieldMuted" numberOfLines={1}>{round.title}</T> : <FieldProgress done={i + (checked ? 1 : 0)} total={Math.max(1, total)} label={`${Math.min(i + 1, total)} of ${total}`} />}</View>
        </View>
        {done ? (
          <Enter testID="map-round-done">
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4], paddingBottom: space[2] }}>
              <ProgressRing pct={pct} size={84} stroke={8} delay={250} color={c.lime} track={c.fieldTint} label={`${pct}%`}>
                <T v="bodyStrong" tone="onField" num>
                  {pct}%
                </T>
              </ProgressRing>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "baseline" }} accessible accessibilityLabel={`${right} of ${total} right`}>
                  <RollingNumber value={right} tone="onField" style={{ fontFamily: fonts.big, fontSize: 46, lineHeight: 48, letterSpacing: -1 }} />
                  <T tone="onFieldMuted" num maxFontSizeMultiplier={1.2} style={{ fontFamily: fonts.big, fontSize: 24, lineHeight: 30 }}>
                    {` of ${total}`}
                  </T>
                </View>
                <T v="h3" tone="onField">
                  {allRight ? "Every one right" : pct >= 70 ? "A good round" : "Worth another round"}
                </T>
              </View>
            </View>
          </Enter>
        ) : (
          <T v="small" tone="onFieldMuted" numberOfLines={1}>
            {round.topic ? `Fix it · ${q?.label ?? round.title}` : `Mixed practice · ${q?.label ?? ""}`}
          </T>
        )}
      </BlueField>
      <Layer style={{ paddingHorizontal: 0, paddingTop: 0, gap: 0 }}>
        <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: layout.gutter, paddingTop: space[5], paddingBottom: checked && !done ? 220 : space[5], gap: space[4], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
          {done ? (
            <Stone>
              <T v="h3">{round.saving ? "Your map is updated" : "Staff answers are not saved"}</T>
              <T v="small" tone="muted" style={{ paddingTop: space[1] }}>
                {round.saving ? "The next round adapts to these answers." : "This is how a round looks to a student."}
              </T>
            </Stone>
          ) : q ? (
            <Swap k={q.id} dir={1} testID={`map-q-${i}`}>
              <Question q={q} picked={picked} checked={checked} onPick={(p) => (q.kind === "tf" ? check(p) : setPicked(p))} />
            </Swap>
          ) : null}
        </ScrollView>
        <View style={{ paddingHorizontal: layout.gutter, paddingTop: space[2], paddingBottom: insets.bottom + space[3], gap: space[1], backgroundColor: c.bg }}>
          {done ? (
            <>
              <Button label="Another round" icon={<RotateCcw size={20} color={c.onPrimary} />} onPress={onAgain} testID="map-round-again" />
              <Button kind="text" full label="Back to your map" onPress={onDone} testID="map-round-back" />
            </>
          ) : q?.kind === "mcq" ? (
            <Button label="Check" disabled={picked === null || checked} onPress={() => check()} testID="map-check" />
          ) : (
            <T v="small" tone="muted" center style={{ minHeight: layout.primary, textAlignVertical: "center", paddingTop: space[3] }}>
              Tap True or False.
            </T>
          )}
        </View>
        <ResultSheet testID="verdict" open={checked && !done} right={ok} title={ok ? "Yes, that fits" : "Not quite"} why={why} action={{ label: i + 1 === total ? "See how you did" : "Next", onPress: next }} />
      </Layer>
      {allRight ? <Confetti fire={1} /> : null}
      {done ? <EndReaction right={right} total={total} /> : null}
      <ReactionLayer />
    </View>
  );
}

/** Waiting for a round, an empty round, or a failed load: the same field and layer, with a way out. */
function RoundWait({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const c = useTheme();
  useLightStatusBar();
  return (
    <View testID="map-round-wait" style={{ flex: 1, backgroundColor: c.field }}>
      <BlueField>
        <RoundButton onField label="Close" onPress={onClose} testID="map-round-close">
          <X size={20} color={c.onField} />
        </RoundButton>
      </BlueField>
      <Layer>{children}</Layer>
    </View>
  );
}

export function MapPracticeScreen() {
  const p = useLocalSearchParams<{ topic?: string }>();
  const topic = typeof p.topic === "string" && p.topic ? p.topic : null;
  const [n, setN] = React.useState(0);
  const q = useMapRound(topic, n);
  const done = React.useCallback(() => (router.canGoBack() ? router.back() : router.replace("/map")), []);
  if (q.data && q.data.questions.length) return <RoundRunner key={`${q.data.round}:${n}`} round={q.data} onAgain={() => setN((x) => x + 1)} onDone={done} />;
  return (
    <RoundWait onClose={done}>
      {q.isError ? (
        <QuietEmpty testID="load-error" title="Could not load this round" body={reasonOf(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />
      ) : q.data ? (
        <QuietEmpty testID="map-round-empty" title="No questions for this yet" body="New questions for this topic are on their way. Try mixed practice." action={{ label: "Back to your map", onPress: done }} />
      ) : (
        <View style={{ gap: space[3] }} testID="map-round-skeleton">
          <Skeleton w="90%" h={26} />
          <Skeleton w="60%" h={26} />
          {[0, 1, 2, 3].map((k) => (
            <Skeleton key={k} h={52} r={layout.radius} />
          ))}
          <StillTrying failed={q.failureCount > 0} />
        </View>
      )}
    </RoundWait>
  );
}
