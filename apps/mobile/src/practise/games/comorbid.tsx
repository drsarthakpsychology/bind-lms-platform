import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, motion, space, useTheme } from "@/theme";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen } from "../frame";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import type { CoCard, CoView } from "../types";

const HOW = ["You and Dr Bot each hold a secret diagnosis. Yours is shown to you.", "Play **symptom** cards that belong to your diagnosis to build it. Enough of them, with a core one, and you win.", "Play a **rule-out** on your rival to block them; a **Tests normal** card clears a block on you.", "A card you can't use: swap it for a new one. One move a turn."];
const LEVELS = [
  { id: "1", name: "Gentle bot", line: "Plays slowly" },
  { id: "2", name: "Sharp bot", line: "Blocks when it can" },
];

const KIND_LABEL: Record<CoCard["kind"], string> = { sym: "Symptom", rule: "Rule-out", clear: "Tests normal" };

/** Comorbid: a card duel against the bot. The deck and the rival's diagnosis stay on the server. */
export function ComorbidGame() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [level, setLevel] = React.useState("1");
  const [v, setV] = React.useState<CoView | null>(null);
  const [sel, setSel] = React.useState<string | null>(null);

  const start = async () => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => play<CoView>("comorbid", "deal", Number(level)));
    if (r) {
      setV(r);
      setSel(null);
    }
  };
  const move = async (action: "play" | "swap") => {
    if (!v || !sel) return;
    const r = await mv.run(() => play<CoView>("comorbid", "move", { token: v.token, uid: sel, action }));
    if (!r) return;
    const mine = [...r.log].reverse().find((l) => l.who === "you");
    if (action === "play" && mine) react.answer(mine.ok);
    if (mine && !mine.ok) haptic.warn();
    setV(r);
    setSel(null);
  };

  if (!v) return <StartScreen testID="comorbid-start" title="Comorbid" line="A card duel. Build your diagnosis; block your rival with rule-outs." howTo={HOW} choiceLabel="Rival" choices={LEVELS} choice={level} onChoice={setLevel} onPlay={() => void start()} playLabel="Deal the cards" busy={mv.pending} error={mv.error} />;

  if (v.winner) {
    return (
      <GameFrame testID="game-comorbid" title="Comorbid" thumb={<EndThumb again={() => void start()} againLabel="Deal again" />}>
        <EndPanel kicker={v.winner === "you" ? "You built it" : v.winner === "rival" ? "Dr Bot built it first" : "No winner"} score={`${v.you.built.length}`} scoreOf={`of ${v.you.dx.need}`} outcome={v.winner === "you" ? "won" : v.winner === "rival" ? "lost" : "mixed"} line={`Yours: ${v.you.dx.name}`} stats={[...(v.rivalDx ? [{ label: "Dr Bot had", value: v.rivalDx.name }] : []), ...(v.xp ? [{ label: "XP", value: `+${v.xp}` }] : [])]}>
          <T v="small" tone="muted">
            {v.you.dx.rule}
          </T>
        </EndPanel>
      </GameFrame>
    );
  }

  const card = v.you.hand.find((x) => x.uid === sel);
  const hud = <HudLine left={`Built ${v.you.built.length} of ${v.you.dx.need} · Dr Bot ${v.rival.built.length}`} right={`${v.deck} in the deck`} />;
  return (
    <GameFrame
      testID="game-comorbid"
      title="Comorbid"
      howTo={HOW}
      hud={hud}
      confirmLeave
      thumb={
        <View style={{ flexDirection: "row", gap: space[3] }}>
          <View style={{ flex: 1 }}>
            <Button kind="quiet" label="Swap it" disabled={!sel || mv.pending} onPress={() => void move("swap")} testID="co-swap" />
          </View>
          <View style={{ flex: 1.4 }}>
            <Button label={card ? `Play ${KIND_LABEL[card.kind].toLowerCase()}` : "Pick a card"} disabled={!sel} busy={mv.pending} onPress={() => void move("play")} testID="co-play" />
          </View>
        </View>
      }
    >
      <Story kicker="Your diagnosis">
        <T v="h3">{v.you.dx.name}</T>
        <T v="small" tone="muted">
          {v.you.dx.rule}
        </T>
      </Story>
      <Section title="You have built" quiet>
        <Built items={v.you.built} blocked={v.you.blocked?.label ?? null} empty="Nothing yet" />
      </Section>
      <Section title="Dr Bot has built" quiet>
        <Built items={v.rival.built} blocked={v.rival.blocked?.label ?? null} empty="Nothing yet" />
      </Section>
      <Section title="Your hand">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -layout.gutter }} contentContainerStyle={{ paddingHorizontal: layout.gutter, gap: space[3] }}>
          {v.you.hand.map((h) => {
            const on = h.uid === sel;
            return (
              <Pressable
                key={h.uid}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${KIND_LABEL[h.kind]}: ${h.label}. ${h.line}`}
                onPress={() => {
                  haptic.select();
                  setSel(on ? null : h.uid);
                }}
                testID={`co-card-${h.uid}`}
                style={{ width: 148, minHeight: 180, padding: space[3], gap: space[2], borderRadius: layout.radius, borderWidth: on ? 2.5 : 1.5, borderColor: on ? c.brand : c.cardLine, backgroundColor: h.kind === "rule" ? c.alertBg : h.kind === "clear" ? c.successBg : c.card, transform: [{ translateY: on ? -8 : 0 }] }}
              >
                <T v="caption" tone="muted">
                  {KIND_LABEL[h.kind].toUpperCase()}
                </T>
                <T v="bodyStrong">{h.label}</T>
                <T v="small" tone="muted">
                  {h.line}
                </T>
              </Pressable>
            );
          })}
        </ScrollView>
      </Section>
      <MoveError text={mv.error} />
      {v.log.length ? (
        <Section title="Last moves" quiet>
          <RowList>
            {v.log
              .slice(-4)
              .reverse()
              .map((l, k) => (
                <Animated.View key={`${v.log.length}-${k}`} entering={reduce || k ? undefined : FadeInDown.duration(motion.state)} style={{ paddingVertical: space[2] }}>
                  <T v="small" tone={l.ok ? "ink" : "danger"}>
                    {l.who === "you" ? "You" : "Dr Bot"} {l.text}
                  </T>
                </Animated.View>
              ))}
          </RowList>
        </Section>
      ) : null}
    </GameFrame>
  );
}

function Built({ items, blocked, empty }: { items: { id: string; label: string }[]; blocked: string | null; empty: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {blocked ? (
        <View style={{ paddingHorizontal: space[3], minHeight: 32, justifyContent: "center", borderRadius: 16, backgroundColor: c.alertBg }}>
          <T v="small" tone="alert">
            Blocked: {blocked}
          </T>
        </View>
      ) : null}
      {items.length ? (
        items.map((i) => (
          <View key={i.id} style={{ paddingHorizontal: space[3], minHeight: 32, justifyContent: "center", borderRadius: 16, borderWidth: 1.5, borderColor: c.cardLine }}>
            <T v="small">{i.label}</T>
          </View>
        ))
      ) : (
        <T v="small" tone="muted">
          {empty}
        </T>
      )}
    </View>
  );
}
