import { useLocalSearchParams } from "expo-router";
import { ArrowDown, ArrowUp, Check, Minus, Plus } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { play, saveCase, useMove, useTool } from "../api";
import { EndPanel, EndThumb, FrameLoading, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Story, Tile, AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import { ESC_PENALTY_S, ESC_STAGE, type EscDoor, type EscResult, type EscRoomCard } from "../types";

const HOW = ["One patient's case, behind a row of locked doors. Each door is one step: mental state, diagnosis, risk, plan.", "Answer to open the door. A wrong answer adds 20 seconds to your time.", "After two wrong tries a hint appears.", "Your place is saved. Leave and carry on later."];

const clock = () => Date.now();

const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Escape Room, solo: every door checked on the server; answers are positions, never the text. */
export function EscapeGame() {
  const params = useLocalSearchParams<{ item?: string }>();
  const rooms = useTool("escape");
  const mv = useMove();
  const react = useReactions();
  const reduce = useReducedMotion();
  const [pick, setPick] = React.useState<string | null>(params.item ?? null);
  const [res, setRes] = React.useState<EscResult | null>(null);
  const [opened, setOpened] = React.useState<boolean | null>(null);
  const [wrongFlash, setWrongFlash] = React.useState(0);
  const [startAt, setStartAt] = React.useState(0);
  const [now, setNow] = React.useState(0);
  const lib = rooms.data?.cases;
  const saved = new Map((lib?.progress ?? []).filter((r) => r.state).map((r) => [r.item, (r.state as { token?: string }).token]));
  const list = ((rooms.data?.data.rooms as EscRoomCard[] | undefined) ?? []).slice().sort((a, b) => (lib ? lib.items.findIndex((x) => x.id === a.id) - lib.items.findIndex((x) => x.id === b.id) : 0));
  const chosen = pick ?? list[0]?.id ?? null;

  React.useEffect(() => {
    if (!res || res.state.done) return;
    const id = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(id);
  }, [res]);

  const begin = async (id: string) => {
    mv.reset();
    react.reset();
    const tok = saved.get(id);
    const r = await mv.run(() => (tok ? play<EscResult>("escape", "resume", tok) : play<EscResult>("escape", "start", id)));
    if (!r) return;
    setRes(r);
    setOpened(null);
    const t = clock();
    setStartAt(t);
    setNow(t);
  };

  if (!res) {
    if (rooms.isLoading) return <FrameLoading title="Escape Room" />;
    return (
      <StartScreen
        testID="escape-start"
        title="Escape Room"
        line="Open every door of one patient's case. Wrong answers cost time."
        howTo={HOW}
        choiceLabel="Room"
        choices={list.map((r) => ({ id: r.id, name: `${r.title}${saved.has(r.id) ? " · carry on" : ""}`, line: `${r.place}. ${r.doors} doors.` }))}
        choice={chosen ?? undefined}
        onChoice={setPick}
        playLabel={chosen && saved.has(chosen) ? "Carry on" : "Enter the room"}
        onPlay={() => chosen && void begin(chosen)}
        busy={mv.pending}
        error={mv.error}
      />
    );
  }

  const v = res.view;
  const st = res.state;
  if (st.done && opened === null) {
    return (
      <GameFrame testID="game-escape" title={v.title} thumb={<EndThumb again={() => setRes(null)} againLabel="Choose another room" />}>
        <EndPanel kicker="You escaped" score={mmss(res.ms ?? now - startAt)} line={st.wrong ? `${st.wrong} wrong ${st.wrong === 1 ? "try" : "tries"}, ${st.wrong * ESC_PENALTY_S} seconds added.` : "No wrong tries."} outcome={st.wrong <= 1 ? "won" : "mixed"} stats={[{ label: "Doors", value: String(v.doors) }, ...(res.xp ? [{ label: "XP", value: `+${res.xp}` }] : [])]}>
          {v.outro ? <T v="reading">{v.outro}</T> : null}
          <Section title="What each door taught">
            <RowList>
              {v.opened.map((o, k) => (
                <View key={k} style={{ paddingVertical: space[3], gap: 2 }}>
                  <T v="caption" tone="muted">
                    {ESC_STAGE[o.stage].toUpperCase()}
                  </T>
                  <T v="small">{o.why}</T>
                </View>
              ))}
            </RowList>
          </Section>
        </EndPanel>
      </GameFrame>
    );
  }

  const submit = async (raw: string) => {
    const r = await mv.run(() => play<EscResult>("escape", "answer", { token: res.token, stage: st.stage, answer: raw }));
    if (!r) return;
    saveCase("escape", r.state.room, r.state.done ? null : { token: r.token });
    react.answer(!!r.right);
    if (r.right) {
      setOpened(true);
    } else {
      setWrongFlash((n) => n + 1);
    }
    setRes(r);
  };
  const last = opened ? v.opened[v.opened.length - 1] : null;
  const elapsed = (res.ms ?? now - startAt) + (res.ms ? 0 : st.wrong * ESC_PENALTY_S * 1000);
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={Math.min(st.stage, v.doors - 1)} total={v.doors} marks={v.stages.map((_, k) => (k < st.stage ? "ok" : null))} />
      <HudLine left={`Door ${Math.min(st.stage + (opened ? 0 : 1), v.doors)} of ${v.doors}${v.door ? ` · ${ESC_STAGE[v.door.stage]}` : ""}`} right={<T style={{ fontFamily: fonts.pixelDigits, fontSize: 16, lineHeight: 20 }}>{mmss(elapsed)}</T>} />
    </View>
  );
  return (
    <GameFrame testID="game-escape" title={v.title} howTo={HOW} hud={hud} confirmLeave saves thumb={opened ? <Button label={st.done ? "Out of the room" : "Next door"} onPress={() => setOpened(null)} testID="escape-next" /> : undefined}>
      {st.stage === 0 && !opened ? (
        <Story kicker={v.place}>
          <T v="reading">{v.intro}</T>
        </Story>
      ) : null}
      {opened && last ? (
        <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[3] }}>
          <Verdict right title="The door opens" why={`${last.why}\n\n${last.unlock}`} seed={st.stage} />
        </Animated.View>
      ) : v.door ? (
        <Animated.View key={v.door.id} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[4] }}>
          <T v="h3">{v.door.prompt}</T>
          <Door door={v.door} disabled={mv.pending} onSubmit={(raw) => void submit(raw)} />
          {wrongFlash && res.right === false ? <Verdict right={false} title="Still locked" why={`${ESC_PENALTY_S} seconds added.${v.hint ? "" : " Try again."}`} seed={wrongFlash} /> : null}
          {v.hint ? (
            <Story kicker="Hint">
              <T>{v.hint}</T>
            </Story>
          ) : null}
          <MoveError text={mv.error} />
        </Animated.View>
      ) : null}
    </GameFrame>
  );
}

/** One door: pick one, tick all, put in order, or a number. */
function Door({ door, disabled, onSubmit }: { door: EscDoor; disabled: boolean; onSubmit: (raw: string) => void }) {
  const c = useTheme();
  const [multi, setMulti] = React.useState<number[]>([]);
  const [order, setOrder] = React.useState<number[]>(() => (door.kind === "order" ? door.items.map((_, i) => i) : []));
  const [num, setNum] = React.useState(door.kind === "number" ? Math.round((door.min + door.max) / 2) : 0);
  if (door.kind === "pick") return <View style={{ gap: space[3] }}>{door.options.map((o, j) => <AnswerRow key={j} index={j} text={o} disabled={disabled} testID={`escape-option-${j}`} onPress={() => onSubmit(String(j))} />)}</View>;
  if (door.kind === "multi")
    return (
      <View style={{ gap: space[3] }}>
        <T v="small" tone="muted">
          Tick every one that fits.
        </T>
        {door.options.map((o, j) => (
          <Tile key={j} testID={`escape-tick-${j}`} state={multi.includes(j) ? "on" : "idle"} disabled={disabled} accessibilityLabel={`${o}${multi.includes(j) ? ", ticked" : ""}`} onPress={() => setMulti((m) => (m.includes(j) ? m.filter((x) => x !== j) : [...m, j]))}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
              <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: c.ink, backgroundColor: multi.includes(j) ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>{multi.includes(j) ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
              <T style={{ flex: 1 }}>{o}</T>
            </View>
          </Tile>
        ))}
        <Button label="Try this door" disabled={disabled || !multi.length} onPress={() => onSubmit([...multi].sort((a, b) => a - b).join(","))} testID="escape-submit" />
      </View>
    );
  if (door.kind === "order") {
    const move = (k: number, d: -1 | 1) => {
      const j = k + d;
      if (j < 0 || j >= order.length) return;
      haptic.select();
      const next = [...order];
      [next[k], next[j]] = [next[j]!, next[k]!];
      setOrder(next);
    };
    return (
      <View style={{ gap: space[2] }}>
        <T v="small" tone="muted">
          Put them in order, first at the top.
        </T>
        {order.map((pos, k) => (
          <View key={pos} style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.row, paddingLeft: space[4], borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card }}>
            <T v="score" style={{ width: 18 }} num>
              {k + 1}
            </T>
            <T style={{ flex: 1, paddingVertical: space[2] }}>{door.items[pos]}</T>
            <Pressable accessibilityRole="button" accessibilityLabel={`Move ${door.items[pos]} up`} disabled={k === 0} onPress={() => move(k, -1)} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center", opacity: k === 0 ? 0.3 : 1 }}>
              <ArrowUp size={20} color={c.ink} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={`Move ${door.items[pos]} down`} disabled={k === order.length - 1} onPress={() => move(k, 1)} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center", opacity: k === order.length - 1 ? 0.3 : 1 }}>
              <ArrowDown size={20} color={c.ink} />
            </Pressable>
          </View>
        ))}
        <Button label="Try this order" disabled={disabled} onPress={() => onSubmit(order.join(","))} testID="escape-submit" style={{ marginTop: space[2] }} />
      </View>
    );
  }
  const step = (d: number) => {
    haptic.select();
    setNum((n) => Math.max(door.min, Math.min(door.max, n + d)));
  };
  return (
    <View style={{ gap: space[4], alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[5] }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Less" onPress={() => step(-1)} style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: c.cardLine, alignItems: "center", justifyContent: "center" }} testID="escape-minus">
          <Minus size={22} color={c.ink} />
        </Pressable>
        <T style={{ fontFamily: fonts.pixelDigits, fontSize: 44, lineHeight: 52, minWidth: 96, textAlign: "center", color: c.ink }} num accessibilityLiveRegion="polite">
          {num}
        </T>
        <Pressable accessibilityRole="button" accessibilityLabel="More" onPress={() => step(1)} style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: c.cardLine, alignItems: "center", justifyContent: "center" }} testID="escape-plus">
          <Plus size={22} color={c.ink} />
        </Pressable>
      </View>
      {door.unit ? (
        <T v="small" tone="muted">
          {door.unit}
        </T>
      ) : null}
      <Button label="Try this number" disabled={disabled} onPress={() => onSubmit(String(num))} testID="escape-submit" />
    </View>
  );
}
