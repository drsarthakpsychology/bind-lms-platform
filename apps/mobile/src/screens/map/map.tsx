import { router, Stack } from "expo-router";
import { AlertTriangle, BookOpen, Check, Repeat2, RotateCcw, Shuffle, Zap } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { MapStateKey, MapTopic, StudyMap } from "@/api/contract";
import { useStudyMap } from "@/api/map-wall";
import { Button, Label, QuietEmpty, Screen, Sheet, Stone, T } from "@/ds";
import { Fetched, Group, Pill, Tile, TilesSkeleton } from "@/screens/learn/parts";
import { openTarget } from "@/nav/targets";
import { Enter, presets, StaggerList } from "@/motion";
import { space, useTheme, type Palette } from "@/theme";
import Animated from "react-native-reanimated";

/**
 * Your map (the website's /study/map): what to practise next, what you mix
 * up, a thin bar summing up every skill, then each topic as a row with one
 * word for where it stands. Tap a topic for its skills one by one.
 */

/** The fill and mark of a state. Colour is never the only sign: each state has its own mark. */
export function stateLook(c: Palette, s: MapStateKey): { bg: string; fg: string; border: string; Icon: typeof Check | null } {
  switch (s) {
    case "mastered":
      return { bg: c.primary, fg: c.onPrimary, border: c.primary, Icon: Check };
    case "learning":
      return { bg: c.accent, fg: c.onAccent, border: c.accent, Icon: null };
    case "shaky":
      return { bg: c.alertBg, fg: c.danger, border: c.danger, Icon: AlertTriangle };
    case "decaying":
      return { bg: c.card, fg: c.ink, border: c.ink, Icon: RotateCcw };
    default:
      return { bg: c.tint, fg: c.muted, border: c.fieldLine, Icon: null };
  }
}

function Square({ state, size = 26, i = 0, empty }: { state: MapStateKey; size?: number; i?: number; empty?: boolean }) {
  const c = useTheme();
  const look = stateLook(c, state);
  const Icon = look.Icon;
  if (empty) return <View style={{ width: size, height: size, borderRadius: 6, borderWidth: 1, borderStyle: "dashed", borderColor: c.hairline }} />;
  return (
    <Animated.View entering={presets.pop(80 + i * 30)} style={{ width: size, height: size, borderRadius: 6, borderWidth: 1.5, borderColor: look.border, backgroundColor: look.bg, alignItems: "center", justifyContent: "center" }}>
      {Icon ? <Icon size={size * 0.55} color={look.fg} strokeWidth={2.5} /> : null}
    </Animated.View>
  );
}

/** One state for a whole topic: the weakest that needs work wins, so the word says what to do. */
export function topicState(t: MapTopic): MapStateKey {
  const live = t.cells.filter((x) => x.hasItems).map((x) => x.state);
  if (!live.length || live.every((s) => s === "new")) return "new";
  if (live.includes("shaky")) return "shaky";
  if (live.includes("decaying")) return "decaying";
  if (live.every((s) => s === "mastered")) return "mastered";
  return "learning";
}

function TopicRow({ t, label, onOpen }: { t: MapTopic; label: (s: MapStateKey) => string; onOpen: () => void }) {
  const state = topicState(t);
  return <Tile testID={`map-topic-${t.id}`} title={t.title} meta={label(state)} lead={<Square state={state} size={26} />} onPress={onOpen} accessibilityLabel={`${t.title}, ${label(state)}. Open its skills`} />;
}

/**
 * The whole map at a glance: one thin bar split by how many skills are in
 * each state, with the words underneath. Replaces the grid of tiny squares.
 */
export function MapSummary({ m }: { m: StudyMap }) {
  const c = useTheme();
  const cells = m.topics.flatMap((t) => t.cells.filter((x) => x.hasItems));
  const order: MapStateKey[] = ["mastered", "learning", "decaying", "shaky", "new"];
  const parts = order.map((k) => ({ k, n: cells.filter((x) => x.state === k).length, label: m.states.find((x) => x.key === k)?.label ?? k })).filter((x) => x.n > 0);
  if (!parts.length) return null;
  return (
    <View testID="map-summary" accessible accessibilityLabel={`Your skills: ${parts.map((p) => `${p.label} ${p.n}`).join(", ")}`} style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden", gap: 2 }}>
        {parts.map((p) => {
          const look = stateLook(c, p.k);
          return <View key={p.k} style={{ flex: p.n, backgroundColor: look.bg, borderWidth: p.k === "new" || p.k === "decaying" ? 1 : 0, borderColor: look.border }} />;
        })}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[4], rowGap: space[1] }}>
        {parts.map((p) => (
          <View key={p.k} style={{ flexDirection: "row", alignItems: "center", gap: space[2], maxWidth: "100%" }}>
            <Square state={p.k} size={14} />
            <T v="caption" tone="muted" style={{ flexShrink: 1 }}>
              {p.label}
            </T>
          </View>
        ))}
      </View>
    </View>
  );
}

function TopicSheet({ t, m, onClose }: { t: MapTopic | null; m: StudyMap; onClose: () => void }) {
  const c = useTheme();
  const label = (s: MapStateKey) => m.states.find((x) => x.key === s)?.label ?? s;
  return (
    <Sheet open={t !== null} onClose={onClose} title={t?.title} testID="map-topic-sheet">
      {t ? (
        <View style={{ gap: space[4] }}>
          <View style={{ gap: space[2] }}>
            {t.cells
              .filter((cell) => cell.hasItems)
              .map((cell) => (
                <Tile key={cell.skill} lead={<Square state={cell.state} size={24} />} title={cell.label} meta={label(cell.state)} trailing={cell.p !== null ? `${Math.round(cell.p * 100)}%` : undefined} />
              ))}
          </View>
          <Button
            label="Practise this topic"
            icon={<Zap size={20} color={c.onPrimary} />}
            onPress={() => {
              onClose();
              router.push({ pathname: "/map/practice", params: { topic: t.id } });
            }}
            testID="map-topic-practise"
          />
          {t.studyTarget ? (
            <Button
              kind="quiet"
              label="Read the module"
              icon={<BookOpen size={20} color={c.ink} />}
              onPress={() => {
                onClose();
                openTarget(t.studyTarget!);
              }}
            />
          ) : null}
        </View>
      ) : null}
    </Sheet>
  );
}

export function MapBody({ m }: { m: StudyMap }) {
  const c = useTheme();
  const [open, setOpen] = React.useState<MapTopic | null>(null);
  const label = (s: MapStateKey) => m.states.find((x) => x.key === s)?.label ?? s;
  const practise = (topic?: string | null) => router.push(topic ? { pathname: "/map/practice", params: { topic } } : "/map/practice");
  return (
    <>
      {!m.learner ? (
        <Stone quiet>
          <T v="small">Staff accounts have no map of their own. This is how a student sees it.</T>
        </Stone>
      ) : null}
      <Enter i={0}>
        <Group>
          <Label>Picked for you</Label>
          <Stone testID="map-practise" accessibilityLabel="Start mixed practice" onPress={() => practise()}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
                <Shuffle size={22} color={c.onLime} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <T v="h2">Mixed practice</T>
                <T v="small" tone="muted">
                  {m.due ? `${m.due === 1 ? "A review is" : "Reviews are"} due. They are mixed into this round.` : "A short round from everything you have learned."}
                </T>
              </View>
            </View>
          </Stone>
        </Group>
      </Enter>

      <Enter i={1}>
        <Group>
          <Label>Fix it</Label>
          {m.weak.length ? (
            <StaggerList style={{ gap: space[2] }}>
              {m.weak.map((w) => (
                <Tile key={w.skill} testID={`map-weak-${w.skill}`} lead={<Square state={w.state} size={26} />} title={w.label} meta={label(w.state)} onPress={() => practise(w.topic)} accessibilityLabel={`${w.label}, ${label(w.state)}. Quick quiz`} />
              ))}
            </StaggerList>
          ) : (
            <QuietEmpty testID="map-weak-empty" title="Nothing to fix yet" body="Answer a few practice questions and your weak spots show up here." />
          )}
        </Group>
      </Enter>

      {m.mixUps.length ? (
        <Enter i={2}>
          <Group>
            <Label>Mix-ups</Label>
            <StaggerList style={{ gap: space[2] }}>
              {m.mixUps.map((x) => (
                <Tile key={`${x.a}|${x.b}`} icon={Repeat2} title={`${x.a} and ${x.b}`} meta={x.topicTitle ? `You mix these up. Practise ${x.topicTitle}.` : "You mix these up."} onPress={x.topic ? () => practise(x.topic) : undefined} />
              ))}
            </StaggerList>
          </Group>
        </Enter>
      ) : null}

      <Enter i={3}>
        <Group>
          <Label>Topics</Label>
          {!m.calibrated ? (
            <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
              Your chances show after a few more answers.
            </T>
          ) : null}
          <Stone>
            <MapSummary m={m} />
          </Stone>
          <StaggerList style={{ gap: space[2] }}>
            {m.topics.map((t) => (
              <TopicRow key={t.id} t={t} label={label} onOpen={() => setOpen(t)} />
            ))}
          </StaggerList>
        </Group>
      </Enter>
      <TopicSheet t={open} m={m} onClose={() => setOpen(null)} />
    </>
  );
}

export function MapScreen() {
  const q = useStudyMap();
  return (
    <Screen testID="map" title="Your map" lead="Every topic and how well you know it" onRefresh={() => void q.refetch()} refreshing={q.isRefetching} gap={space[5]}>
      <Stack.Screen options={{ title: "" }} />
      <Fetched q={q} what="your map" skeleton={<TilesSkeleton card rows={5} />}>
        {(m) => <MapBody m={m} />}
      </Fetched>
    </Screen>
  );
}
