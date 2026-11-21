import { useLocalSearchParams } from "expo-router";
import { ArrowDown, ArrowUp, Check, Check as CheckIcon, Minus, Play, Plus, X as XIcon } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, EmptyState, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Swap } from "@/motion";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { play, saveCase, useMove, useTool } from "../api";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudBar, HudLine, HudWord, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Story, Tile, AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import { ESC_PENALTY_S, ESC_STAGE, TEAM_LIMITS, type EscDoor, type EscResult, type EscRoomCard, type EscTeamView, type RaceRow, type TeamJoin, type TeamListItem } from "../types";
import { Members, TeamCode, TeamsBlock, usePoll } from "./team";

const HOW = ["One patient's case, behind a row of locked doors. Each door is one step: mental state, diagnosis, risk, plan.", "Answer to open the door. A wrong answer adds 20 seconds to your time.", "After two wrong tries a hint appears.", "Your place is saved. Leave and carry on later."];

const clock = () => Date.now();

/** "4:07". A time the phone cannot work out (an unreadable finish date) shows 0:00, not "NaN:NaN". */
export const mmss = (ms: number) => {
  const s = Number.isFinite(ms) ? Math.max(0, Math.round(ms / 1000)) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** Escape Room, solo: every door checked on the server; answers are positions, never the text. */
export function EscapeGame() {
  const params = useLocalSearchParams<{ item?: string; team?: string }>();
  const rooms = useTool("escape");
  const [team, setTeam] = React.useState<string | null>(params.team ?? null);
  const [teamBusy, setTeamBusy] = React.useState(false);
  const [teamError, setTeamError] = React.useState<string | null>(null);
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

  if (team) {
    return (
      <EscapeTeam
        teamId={team}
        onExit={() => {
          setTeam(null);
          void rooms.refetch();
        }}
      />
    );
  }

  if (!res) {
    if (rooms.isLoading) return <FrameLoading title="Escape Room" />;
    // Offline or a failed answer: say so (it showed a start screen with no rooms and a Play that did nothing).
    if (rooms.isError && !rooms.data) return <FrameError title="Escape Room" error={rooms.error} onRetry={() => void rooms.refetch()} />;
    const teamsOn = !!rooms.data?.data.teamsOn;
    const teams = (rooms.data?.data.teams as TeamListItem[] | undefined) ?? [];
    const createTeam = async () => {
      if (!chosen || teamBusy) return;
      setTeamBusy(true);
      setTeamError(null);
      const r = await play<TeamJoin>("escape", "createTeam", chosen).catch(() => ({ ok: false as const, reason: "Couldn't start a team. Try again." }));
      setTeamBusy(false);
      if (r.ok) {
        haptic.success();
        setTeam(r.teamId);
      } else setTeamError(r.reason);
    };
    const join = async (code: string) => {
      const r = await play<TeamJoin>("escape", "joinTeam", code);
      if (!r.ok) return r.reason;
      haptic.success();
      setTeam(r.teamId);
      return null;
    };
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
        onPlay={() => chosen && void begin(chosen)}
        busy={mv.pending}
        error={mv.error}
        playLabel={chosen && saved.has(chosen) ? "Carry on alone" : "Practise alone"}
        below={<TeamsBlock on={teamsOn} teams={teams} createLabel="Start a team in this room" onCreate={() => void createTeam()} onJoin={join} onOpen={setTeam} busy={teamBusy} error={teamError} teamLine={(t) => `${t.title ?? "Escape Room"} · ${t.status === "lobby" ? "waiting to start" : "inside"}`} />}
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
      <HudLine left={`Door ${Math.min(st.stage + (opened ? 0 : 1), v.doors)} of ${v.doors}${v.door ? ` · ${ESC_STAGE[v.door.stage]}` : ""}`} right={<HudWord accessibilityRole="timer">{mmss(elapsed)}</HudWord>} />
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
        <Swap k={v.door.id} style={{ gap: space[4] }}>
          <T v="h3">{v.door.prompt}</T>
          <Door door={v.door} disabled={mv.pending} onSubmit={(raw) => void submit(raw)} />
          {wrongFlash && res.right === false ? <Verdict right={false} title="Still locked" why={`${ESC_PENALTY_S} seconds added.${v.hint ? "" : " Try again."}`} seed={wrongFlash} /> : null}
          {v.hint ? (
            <Story kicker="Hint">
              <T>{v.hint}</T>
            </Story>
          ) : null}
          <MoveError text={mv.error} />
        </Swap>
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

/* ------------------------------------------------------------------ team */

/** The race this week: finished teams by time, then teams still inside by doors opened. */
function RaceBoard({ rows }: { rows: RaceRow[] }) {
  const c = useTheme();
  if (!rows.length) return null;
  return (
    <Section title="The race this week">
      <View style={{ gap: 0 }} testID="escape-race">
        {rows.map((r, i) => (
          <View key={r.id} accessible accessibilityLabel={`${i + 1}. ${r.name}${r.me ? ", your team" : ""}: ${r.done ? `out in ${mmss(r.ms)}` : `door ${r.stage + 1}`}`} style={{ minHeight: 44, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[2], borderRadius: 8, backgroundColor: r.me ? c.successBg : "transparent" }}>
            <T style={{ fontFamily: fonts.pixelDigits, fontSize: 16, lineHeight: 20, width: 24, color: i < 3 ? c.link : c.muted }} num>
              {String(i + 1)}
            </T>
            <T v="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
              {r.me ? `${r.name} (you)` : r.name}
            </T>
            <T v="small" num tone="muted">
              {r.done ? mmss(r.ms) : `Door ${r.stage + 1}`}
            </T>
          </View>
        ))}
      </View>
    </Section>
  );
}

/**
 * The Escape Room as a team, as the website's TeamRun: a lobby until two have
 * joined and someone starts the clock, then anyone answers any door. The
 * view is polled every 2 seconds and the clock follows the server's.
 */
export function EscapeTeam({ teamId, onExit }: { teamId: string; onExit: () => void }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const react = useReactions();
  const [view, setView] = React.useState<EscTeamView | null>(null);
  const [missing, setMissing] = React.useState(false);
  const [skew, setSkew] = React.useState(0);
  const [now, setNow] = React.useState(0);
  const [feedback, setFeedback] = React.useState<{ stage: number; ok: boolean; by?: string } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState(false);
  const [wrongN, setWrongN] = React.useState(0);
  const shown = React.useRef<EscTeamView | null>(null);
  const apply = (v: EscTeamView | null) => {
    if (!v) {
      setMissing(true);
      return;
    }
    const t = Date.now();
    setMissing(false);
    setSkew(v.now - t);
    setNow(t);
    const old = shown.current;
    if (old && (old.state.stage !== v.state.stage || old.state.done !== v.state.done)) {
      // A teammate opened the door: show what it revealed.
      const last = [...v.state.log].reverse().find((l) => l.ok);
      if (last) setFeedback((f) => f ?? { stage: last.stage, ok: true, by: last.name });
      haptic.success();
    }
    shown.current = v;
    setView(v);
  };
  const live = !view || view.status !== "done";
  usePoll(live, 2000, () => play<EscTeamView | null>("escape", "view", teamId), apply);
  React.useEffect(() => {
    if (!view || view.status !== "playing") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [view]);

  if (missing && !view) {
    return (
      <GameFrame title="Escape Room" testID="escape-team-missing">
        <EmptyState mood="missing" title="Team not found" body="You may not be in this team, or team play is not open yet." action={{ label: "Back to the rooms", onPress: onExit }} />
      </GameFrame>
    );
  }
  if (!view) return <FrameLoading title="Escape Room" />;
  const room = view.view;
  const st = view.state;
  const start = view.startedAt ? Date.parse(view.startedAt) : 0;
  const end = view.finishedAt ? Date.parse(view.finishedAt) : now + skew;
  const ms = start ? Math.max(0, end - start) + st.wrong * ESC_PENALTY_S * 1000 : 0;
  const header = (
    <View style={{ gap: space[3] }}>
      <TeamCode code={view.code} name={view.name} message={`Join my VIBHA escape room (${room.title}).`} />
      <Members members={view.members} max={TEAM_LIMITS.escape.max} />
    </View>
  );

  if (view.status === "lobby") {
    const enough = view.members.length >= TEAM_LIMITS.escape.min;
    return (
      <GameFrame testID="escape-lobby" title={room.title} thumb={<Button label="Start the clock" icon={<Play size={18} color={c.onPrimary} />} disabled={!enough} busy={busy} onPress={async () => { if (busy) return; setBusy(true); setLost(false); const v = await play<EscTeamView | null>("escape", "startTeam", teamId).catch(() => undefined); setBusy(false); if (v === undefined) { setLost(true); haptic.warn(); } else apply(v); }} testID="escape-start-team" />}>
        {header}
        {lost ? <MoveError text="Connection lost. The clock did not start. Try again." /> : null}
        <Story kicker={room.place}>
          <T v="reading">{room.intro}</T>
        </Story>
        <T v="small" tone="muted" accessibilityLiveRegion="polite">
          {enough ? "Everyone in? Any of you can start the clock." : `Need at least ${TEAM_LIMITS.escape.min} players. Share the code.`}
        </T>
        <RaceBoard rows={view.race} />
      </GameFrame>
    );
  }

  const showOpened = feedback?.ok && feedback.stage < (st.done ? room.doors : st.stage);
  if (st.done && !showOpened) {
    return (
      <GameFrame testID="escape-team-end" title={room.title} thumb={<EndThumb again={onExit} againLabel="Back to the rooms" />}>
        <EndPanel kicker="Your team escaped" score={mmss(ms)} line={st.wrong ? `${st.wrong} wrong ${st.wrong === 1 ? "try" : "tries"}, ${st.wrong * ESC_PENALTY_S} seconds added.` : "No wrong tries."} outcome={st.wrong <= 1 ? "won" : "mixed"} stats={[{ label: "Doors", value: String(room.doors) }, ...(view.xp ? [{ label: "XP each", value: `+${view.xp}` }] : [])]}>
          <T v="bodyStrong">{`${view.name}: ${view.members.map((x) => x.name).join(", ")}`}</T>
          {room.outro ? <T v="reading">{room.outro}</T> : null}
          <RaceBoard rows={view.race} />
        </EndPanel>
      </GameFrame>
    );
  }

  const stage = showOpened ? feedback!.stage : st.stage;
  const openedDoor = showOpened ? room.opened[stage] : null;
  const submit = async (raw: string) => {
    if (busy) return;
    setBusy(true);
    const r = await play<{ view: EscTeamView | null; ok: boolean }>("escape", "answerTeam", { teamId, stage: st.stage, answer: raw }).catch(() => null);
    setBusy(false);
    // No connection is not a wrong answer: no penalty shown, no sticker.
    setLost(r === null);
    if (!r) return;
    if (!r.view?.state.done) react.answer(r.ok);
    if (!r.ok) setWrongN((n) => n + 1);
    setFeedback({ stage: st.stage, ok: r.ok, by: r.ok ? "You" : undefined });
    if (r.view) {
      setSkew(r.view.now - Date.now());
      shown.current = r.view;
      setView(r.view);
    }
  };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={Math.min(st.stage, room.doors - 1)} total={room.doors} marks={room.stages.map((_, k) => (k < st.stage ? "ok" : null))} />
      <HudLine left={`Door ${Math.min(stage + 1, room.doors)} of ${room.doors}${room.door ? ` · ${ESC_STAGE[room.door.stage]}` : ""}`} right={<HudWord accessibilityRole="timer">{mmss(ms)}</HudWord>} />
    </View>
  );
  return (
    <GameFrame testID="escape-team" title={room.title} howTo={HOW} hud={hud} confirmLeave saves thumb={openedDoor ? <Button label={st.done ? "Out!" : "Next door"} onPress={() => setFeedback(null)} testID="escape-next" /> : undefined}>
      {header}
      {openedDoor ? (
        <Animated.View entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[3] }}>
          <Verdict right title={feedback?.by && feedback.by !== "You" ? `${feedback.by} opened the door` : "The door opens"} why={`${openedDoor.why}\n\n${openedDoor.unlock}`} seed={stage} />
        </Animated.View>
      ) : room.door ? (
        <Swap k={`${room.door.id}-${st.stage}`} style={{ gap: space[4] }}>
          <T v="h3">{room.door.prompt}</T>
          <Door door={room.door} disabled={busy} onSubmit={(raw) => void submit(raw)} />
          {lost ? <MoveError text="Connection lost. Your answer was not sent. Try again." /> : feedback && !feedback.ok ? <Verdict right={false} title="Still locked" why={`Not that. +${ESC_PENALTY_S} seconds for the team. Try again.`} seed={wrongN} /> : null}
          {room.hint ? (
            <Story kicker="Hint">
              <T>{room.hint}</T>
            </Story>
          ) : null}
        </Swap>
      ) : null}
      {st.log.length ? (
        <View style={{ gap: space[1] }} accessibilityLabel="Recent tries">
          {st.log.slice(-4).reverse().map((l, i) => (
            <View key={`${l.at}-${i}`} style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
              {l.ok ? <CheckIcon size={14} color={c.muted} /> : <XIcon size={14} color={c.muted} />}
              <T v="caption" tone="muted">{`${l.name} ${l.ok ? "opened" : "tried"} door ${l.stage + 1}`}</T>
            </View>
          ))}
        </View>
      ) : null}
      <RaceBoard rows={view.race} />
    </GameFrame>
  );
}
