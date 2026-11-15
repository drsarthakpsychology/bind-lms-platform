import * as React from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";

import { Button, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { layout, motion, space, useTheme } from "@/theme";
import { play, useMove } from "../api";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen } from "../frame";
import appData from "../data/app-data.json";
import { Press } from "../fx";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import type { CoCard, CoView } from "../types";

const HOW = ["You and Dr Bot each hold a secret diagnosis. Yours is shown to you.", "Play **symptom** cards that belong to your diagnosis to build it. Enough of them, with a core one, and you win.", "Play a **rule-out** on your rival to block them; a **Tests normal** card clears a block on you.", "A card you can't use: swap it for a new one. One move a turn."];
const LEVELS = [
  { id: "1", name: "Gentle bot", line: "Plays slowly" },
  { id: "2", name: "Sharp bot", line: "Blocks when it can" },
  { id: "3", name: "Expert bot", line: "Rarely wastes a turn" },
];

/* The cards' words (src/lib/games-sims/comorbid/cards.ts, copied into data/app-data.json). */
type Named = { id: string; label: string; line: string };
const CO = appData.COMORBID as { SYMPTOMS: Named[]; RULEOUTS: Named[]; CLEAR: Named; DIAGNOSES: { id: string; name: string; short: string; need: number; rule: string }[] };
const named = (kind: CoCard["kind"], id: string): Named => (kind === "clear" ? CO.CLEAR : (kind === "rule" ? CO.RULEOUTS : CO.SYMPTOMS).find((x) => x.id === id) ?? { id, label: id, line: "" });

/** The server's game (comorbid.state: the shared rules replayed from the seed and the moves). */
type Card = { uid: string; kind: CoCard["kind"]; id: string };
type Seat = { name: string; dx: string; hand: Card[]; built: string[]; blocked: string | null };
type Game = { seed: string; seats: [Seat, Seat]; deck: Card[]; turn: 0 | 1; log: { seat: 0 | 1; card: Card; action: "play" | "swap"; ok: boolean; reason: string }[]; winner: 0 | 1 | "draw" | null };
type Move = { uid: string; action: "play" | "swap" };

/** What the student sees of a game: their own hand and diagnosis, the rival's table, never the rival's hand. */
function toView(g: Game, xp?: number): CoView {
  const dx = (id: string) => CO.DIAGNOSES.find((d) => d.id === id);
  const me = g.seats[0];
  const rival = g.seats[1];
  const mine = dx(me.dx);
  const built = (ids: string[]) => ids.map((id) => ({ id, label: named("sym", id).label }));
  const block = (id: string | null) => (id ? { id, label: named("rule", id).label } : null);
  const over = g.winner !== null;
  return {
    ok: true,
    token: g.seed,
    you: { dx: { id: me.dx, name: mine?.name ?? me.dx, rule: mine?.rule ?? "", need: mine?.need ?? 0 }, hand: me.hand.map((h) => ({ ...h, label: named(h.kind, h.id).label, line: named(h.kind, h.id).line })), built: built(me.built), blocked: block(me.blocked) },
    rival: { name: "Dr Bot", built: built(rival.built), blocked: block(rival.blocked), hand: rival.hand.length },
    turn: g.turn === 0 ? "you" : "rival",
    deck: g.deck.length,
    log: g.log.map((l) => ({ who: l.seat === 0 ? "you" : "rival", text: l.reason, ok: l.ok })),
    winner: g.winner === null ? null : g.winner === "draw" ? "draw" : g.winner === 0 ? "you" : "rival",
    rivalDx: over ? { id: rival.dx, name: dx(rival.dx)?.name ?? rival.dx } : null,
    ...(xp !== undefined ? { xp } : {}),
  };
}
const newSeed = () => `co${Math.floor(Math.random() * 1e12).toString(36)}`;

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
  const run = React.useRef<{ seed: string; level: 1 | 2 | 3; moves: Move[] } | null>(null);
  const ask = (r: { seed: string; level: 1 | 2 | 3; moves: Move[] }) => play<{ ok: boolean; game?: Game; error?: string }>("comorbid", "state", { seed: r.seed, mode: "bot", level: r.level, moves: r.moves });

  const start = async () => {
    mv.reset();
    react.reset();
    const r = { seed: newSeed(), level: Number(level) as 1 | 2 | 3, moves: [] as Move[] };
    const res = await mv.run(() => ask(r));
    if (res?.game) {
      run.current = r;
      setV(toView(res.game));
      setSel(null);
    }
  };
  const move = async (action: "play" | "swap") => {
    const cur = run.current;
    if (!v || !sel || !cur) return;
    const next = { ...cur, moves: [...cur.moves, { uid: sel, action }] };
    const res = await mv.run(() => ask(next));
    if (!res?.game) return;
    run.current = next;
    let view = toView(res.game);
    const mine = [...view.log].reverse().find((l) => l.who === "you");
    if (action === "play" && mine) react.answer(mine.ok);
    if (view.winner) {
      // The server replays and grades every move; the phone never sends a score.
      const fin = await play<{ ok: boolean; xp: number }>("comorbid", "finish", { seed: next.seed, mode: "bot", level: next.level, moves: next.moves }).catch(() => null);
      view = toView(res.game, fin?.xp);
    }
    setV(view);
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
              <Press
                key={h.uid}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${KIND_LABEL[h.kind]}: ${h.label}. ${h.line}`}
                onPress={() => {
                  haptic.select();
                  setSel(on ? null : h.uid);
                }}
                testID={`co-card-${h.uid}`}
                style={{ width: 148, minHeight: 180, padding: space[3], gap: space[2], borderRadius: layout.radius, borderWidth: on ? 2.5 : 1.5, borderColor: on ? c.brand : c.cardLine, backgroundColor: h.kind === "rule" ? c.alertBg : h.kind === "clear" ? c.successBg : c.card, top: on ? -8 : 0 }}
              >
                <T v="caption" tone="muted">
                  {KIND_LABEL[h.kind].toUpperCase()}
                </T>
                <T v="bodyStrong">{h.label}</T>
                <T v="small" tone="muted">
                  {h.line}
                </T>
              </Press>
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
