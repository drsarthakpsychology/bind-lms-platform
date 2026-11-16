import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

import { Button, EmptyState, ProgressLine, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Swap } from "@/motion";
import { space, useTheme } from "@/theme";
import { play, saveCase, useMove, useTool } from "../api";
import { EndPanel, EndThumb, FrameLoading, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Story, AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import { TEAM_LIMITS, WARD_KIND, WARD_QUALITY, WARD_VAR, type TeamJoin, type TeamListItem, type WardCampaign, type WardEnd, type WardReveal, type WardSolo, type WardTeamView, type WardVars } from "../types";
import { Members, TeamCode, TeamsBlock, usePoll } from "./team";

const HOW = ["One patient over several sessions. Read what happens, then make the call.", "Each choice moves five dials: risk, trust, insight, family support and sticking with care.", "After each call you see how strong it was and what the strongest call would have been.", "Your place is saved after every call. The ending depends on your choices."];

/** The five dials: a thin line each; risk is better low. */
function Dials({ vars, before }: { vars: WardVars; before?: WardVars }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2] }} accessibilityLabel="Dials">
      {(Object.keys(WARD_VAR) as (keyof WardVars)[]).map((k) => {
        const d = before ? vars[k] - before[k] : 0;
        const better = k === "risk" ? d < 0 : d > 0;
        return (
          <View key={k} style={{ flexDirection: "row", alignItems: "center", gap: space[3] }} accessible accessibilityLabel={`${WARD_VAR[k]} ${vars[k]}${d ? `, ${d > 0 ? "up" : "down"} ${Math.abs(d)}` : ""}`}>
            <T v="small" tone="muted" style={{ width: 112 }} numberOfLines={1}>
              {WARD_VAR[k]}
            </T>
            <View style={{ flex: 1 }}>
              <ProgressLine value={vars[k]} height={4} />
            </View>
            <T v="small" num style={{ width: 40, textAlign: "right", color: d ? (better ? c.ink : c.danger) : c.muted }}>
              {d ? `${d > 0 ? "+" : ""}${d}` : String(vars[k])}
            </T>
          </View>
        );
      })}
    </View>
  );
}

const verdictOf = (r: WardReveal) => ({ right: r.q === "best", partial: r.q === "ok", title: WARD_QUALITY[r.q] });

/** Ward Week: one patient, your choices change the ending. Dealt and scored on the server. */
export function WardGame() {
  const params = useLocalSearchParams<{ item?: string; team?: string }>();
  const list = useTool("ward");
  const mv = useMove();
  const react = useReactions();
  const [pick, setPick] = React.useState<string | null>(params.item ?? null);
  const [solo, setSolo] = React.useState<WardSolo | null>(null);
  const [reveal, setReveal] = React.useState<WardReveal | null>(null);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [campaign, setCampaign] = React.useState<string | null>(null);
  const [team, setTeam] = React.useState<string | null>(params.team ?? null);
  const [teamBusy, setTeamBusy] = React.useState(false);
  const [teamError, setTeamError] = React.useState<string | null>(null);
  const lib = list.data?.cases;
  const saved = new Map((lib?.progress ?? []).filter((r) => r.state).map((r) => [r.item, (r.state as { token?: string }).token]));
  const savedIds = new Set(saved.keys());
  const marksBy = new Map((lib?.items ?? []).map((x) => [x.id, x.mark]));
  const campaigns = ((list.data?.data.campaigns as WardCampaign[] | undefined) ?? []).slice().sort((a, b) => (lib ? lib.items.findIndex((x) => x.id === a.id) - lib.items.findIndex((x) => x.id === b.id) : 0));
  const chosen = pick ?? campaigns[0]?.id ?? null;

  const begin = async (id: string, resume: boolean) => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => (resume ? play<WardSolo>("ward", "resume", saved.get(id) ? { token: saved.get(id) } : { campaign: id }) : play<WardSolo>("ward", "start", id)));
    if (!r) return;
    setSolo(r);
    setReveal(null);
    setMarks([]);
    setCampaign(id);
  };

  if (team) {
    return (
      <WardTeam
        teamId={team}
        onExit={() => {
          setTeam(null);
          void list.refetch();
        }}
      />
    );
  }

  if (!solo) {
    if (list.isLoading) return <FrameLoading title="Ward Week" />;
    const teamsOn = !!list.data?.data.teamsOn;
    const teams = (list.data?.data.teams as TeamListItem[] | undefined) ?? [];
    const createTeam = async () => {
      if (!chosen || teamBusy) return;
      setTeamBusy(true);
      setTeamError(null);
      const r = await play<{ ok: true; teamId: string } | { ok: false; reason: string }>("ward", "createTeam", chosen).catch(() => ({ ok: false as const, reason: "Couldn't start a team. Try again." }));
      setTeamBusy(false);
      if (r.ok) {
        haptic.success();
        setTeam(r.teamId);
      } else setTeamError(r.reason);
    };
    const join = async (code: string) => {
      const r = await play<TeamJoin>("ward", "joinTeam", code);
      if (!r.ok) return r.reason;
      haptic.success();
      setTeam(r.teamId);
      return null;
    };
    const resume = chosen ? savedIds.has(chosen) : false;
    return (
      <StartScreen
        testID="ward-start"
        title="Ward Week"
        line="One patient. Your choices change the ending."
        howTo={HOW}
        choiceLabel="Patient"
        choices={campaigns.map((c) => ({ id: c.id, name: `${c.title}${savedIds.has(c.id) ? " · carry on" : marksBy.get(c.id) === "done" ? " · done" : marksBy.get(c.id) === "week" ? " · new this week" : ""}`, line: `${c.patient}. ${c.place}. ${c.sessions} sessions.` }))}
        choice={chosen ?? undefined}
        onChoice={setPick}
        playLabel={resume ? "Carry on" : "Start"}
        onPlay={() => chosen && void begin(chosen, resume)}
        busy={mv.pending}
        error={mv.error ?? (list.isError ? "The patients did not load. Try again." : null)}
        below={<TeamsBlock on={teamsOn} teams={teams} createLabel={`Start a team of ${TEAM_LIMITS.ward.max} with this patient`} onCreate={() => void createTeam()} onJoin={join} onOpen={setTeam} busy={teamBusy} error={teamError} teamLine={(t) => `${campaigns.find((c) => c.id === t.campaign)?.title ?? "Ward Week"} · ${t.status === "done" ? "finished" : "voting"}`} />}
      />
    );
  }

  const s = solo.scene;
  if (solo.end && !reveal) {
    const e = solo.end;
    const strong = e.log.filter((l) => l.q === "best").length;
    return (
      <GameFrame testID="game-ward" title={s.title} thumb={<EndThumb again={() => setSolo(null)} againLabel="Choose another patient" />}>
        <EndPanel kicker="The ending" score={String(e.score)} scoreOf="/100" line={e.title} right={strong} total={Math.max(1, e.log.length)} stats={[{ label: "Strong calls", value: `${strong}/${e.log.length}` }, ...(solo.xp ? [{ label: "XP", value: `+${solo.xp}` }] : [])]}>
          <T v="reading">{e.text}</T>
          <Dials vars={e.vars} />
          <Section title="Every call">
            <RowList>
              {e.log.map((l, k) => (
                <View key={k} style={{ paddingVertical: space[3], gap: 2 }}>
                  <T v="caption" tone="muted">
                    {`SESSION ${l.chapter + 1} · ${WARD_KIND[l.kind].toUpperCase()} · ${WARD_QUALITY[l.q].toUpperCase()}`}
                  </T>
                  <T v="bodyStrong">{l.text}</T>
                  {l.best ? (
                    <T v="small" tone="muted">
                      Strongest: {l.best}
                    </T>
                  ) : null}
                </View>
              ))}
            </RowList>
          </Section>
        </EndPanel>
      </GameFrame>
    );
  }

  const choose = async (option: string) => {
    if (reveal || mv.pending) return;
    const r = await mv.run(() => play<WardSolo>("ward", "pick", { token: solo.token, option }));
    if (!r) return;
    // Keep the place on the server, as the website does (saveCaseProgress("ward", campaign, { token })).
    if (campaign) saveCase("ward", campaign, r.end ? null : { token: r.token });
    if (r.reveal) {
      setReveal(r.reveal);
      setMarks((m) => [...m, r.reveal!.q === "best" ? "ok" : r.reveal!.q === "ok" ? null : "miss"]);
      react.answer(r.reveal.q === "best");
    }
    setSolo(r);
  };
  const next = () => setReveal(null);
  const shown = reveal ? { chapterTitle: reveal.chapterTitle, beats: reveal.beats } : { chapterTitle: s.chapterTitle, beats: s.beats };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={s.chapter} total={s.sessions} />
      <HudLine left={`Session ${(reveal?.chapter ?? s.chapter) + 1} of ${s.sessions} · ${s.patient}`} right={marks.length ? `${marks.filter((m) => m === "ok").length} strong` : undefined} />
    </View>
  );
  return (
    <GameFrame testID="game-ward" title={s.title} howTo={HOW} hud={hud} confirmLeave saves thumb={reveal ? <Button label={solo.end ? "See the ending" : "Next"} onPress={next} testID="ward-next" /> : undefined}>
      <Swap k={`${s.step}-${!!reveal}`} style={{ gap: space[5] }}>
        <T v="h2">{shown.chapterTitle}</T>
        <Story>
          {shown.beats.map((b, k) => (
            <T key={k} v="reading">
              {b}
            </T>
          ))}
        </Story>
        {reveal ? (
          <View style={{ gap: space[4] }}>
            <View style={{ gap: space[1] }}>
              <T v="caption" tone="muted">
                {`YOUR CALL · ${WARD_KIND[reveal.kind].toUpperCase()}`}
              </T>
              <T v="bodyStrong">{reveal.text}</T>
            </View>
            <Verdict {...verdictOf(reveal)} why={`${reveal.why}${reveal.best ? `\n\nStrongest call: ${reveal.best.text} ${reveal.best.why}` : ""}`} seed={s.step} />
            <Dials vars={reveal.after} before={reveal.before} />
          </View>
        ) : s.decision ? (
          <View style={{ gap: space[3] }}>
            <T v="caption" tone="muted">
              {WARD_KIND[s.decision.kind].toUpperCase()}
            </T>
            <T v="h3">{s.decision.prompt}</T>
            {s.decision.options.map((o, j) => (
              <AnswerRow key={o.id} index={j} text={o.text} testID={`ward-option-${j}`} disabled={mv.pending} onPress={() => void choose(o.id)} />
            ))}
            <Dials vars={s.vars} />
          </View>
        ) : null}
        <MoveError text={mv.error} />
      </Swap>
    </GameFrame>
  );
}

/* ------------------------------------------------------------------ team */

/** Results each phone has already looked at, per team (the website keeps this in the browser). */
const SEEN = new Map<string, number>();

/** The end of a story: the same for solo and team. */
function WardEnding({ title, end, xp, teamLine, again, againLabel }: { title: string; end: WardEnd; xp: number | null; teamLine?: string; again: () => void; againLabel: string }) {
  const strong = end.log.filter((l) => l.q === "best").length;
  return (
    <GameFrame testID="game-ward" title={title} thumb={<EndThumb again={again} againLabel={againLabel} />}>
      <EndPanel kicker="The ending" score={String(end.score)} scoreOf="/100" line={end.title} right={strong} total={Math.max(1, end.log.length)} stats={[{ label: "Strong calls", value: `${strong}/${end.log.length}` }, ...(xp ? [{ label: "XP", value: `+${xp}` }] : [])]}>
        {teamLine ? <T v="bodyStrong">{teamLine}</T> : null}
        <T v="reading">{end.text}</T>
        <Dials vars={end.vars} />
      </EndPanel>
    </GameFrame>
  );
}

/**
 * Ward Week as a team, as the website's TeamPlay: everyone votes on each
 * call; matching votes from most of the team move the story on, and each
 * vote is graded for the one who gave it. The view is polled every 4 seconds.
 */
export function WardTeam({ teamId, onExit }: { teamId: string; onExit: () => void }) {
  const react = useReactions();
  const [view, setView] = React.useState<WardTeamView | null>(null);
  const [missing, setMissing] = React.useState(false);
  const [seen, setSeen] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [lost, setLost] = React.useState(false);
  const apply = (v: WardTeamView | null) => {
    if (!v) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setView(v);
    setSeen((s) => (s === null ? Math.min(SEEN.get(teamId) ?? v.reveals.length, v.reveals.length) : s));
  };
  usePoll(!view?.scene.done, 4000, () => play<WardTeamView | null>("ward", "teamView", teamId), apply);

  if (missing && !view) {
    return (
      <GameFrame title="Ward Week" testID="ward-team-missing">
        <EmptyState mood="puzzled" title="Team not found" body="You may not be in this team, or team play is not open yet." action={{ label: "Back to Ward Week", onPress: onExit }} />
      </GameFrame>
    );
  }
  if (!view || seen === null) return <FrameLoading title="Ward Week" />;
  const scene = view.scene;
  const pending = seen < view.reveals.length ? view.reveals[seen]! : null;
  const markSeen = () => {
    const n = seen + 1;
    setSeen(n);
    SEEN.set(teamId, n);
  };
  const teamLine = `${view.name}: ${view.members.map((x) => x.name).join(", ")}`;
  if (scene.done && !pending && view.end) return <WardEnding title={scene.title} end={view.end} xp={view.xp} teamLine={teamLine} again={onExit} againLabel="Back to Ward Week" />;

  const need = Math.floor(Math.max(TEAM_LIMITS.ward.min, view.members.length) / 2) + 1;
  const nextLabel = seen + 1 < view.reveals.length ? "Next result" : scene.done ? "See the ending" : pending && scene.chapter !== pending.chapter ? "Next session" : "Next call";
  const vote = async (choice: string) => {
    if (busy || view.myVote) return;
    setBusy(true);
    haptic.tap();
    const v = await play<WardTeamView | null>("ward", "vote", { teamId, step: scene.step, choice }).catch(() => undefined);
    setBusy(false);
    setLost(v === undefined);
    if (v) {
      apply(v);
      react.answer(true);
    }
  };
  const header = (
    <View style={{ gap: space[3] }}>
      <TeamCode code={view.code} name={view.name} message={`Join my Ward Week team on VIBHA (${scene.title}).`} />
      <Members members={view.members.map((x) => ({ name: x.name, me: x.me, done: x.voted, doneWord: "Voted", waitWord: "Not yet" }))} max={TEAM_LIMITS.ward.max} />
    </View>
  );
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={scene.chapter} total={scene.sessions} />
      <HudLine left={`Session ${(pending?.chapter ?? scene.chapter) + 1} of ${scene.sessions} · ${scene.patient}`} right={`${view.votes}/${view.members.length} voted`} />
    </View>
  );
  return (
    <GameFrame testID="ward-team" title={scene.title} howTo={HOW} hud={hud} saves confirmLeave thumb={pending ? <Button label={nextLabel} onPress={markSeen} testID="ward-next" /> : undefined}>
      {header}
      <Swap k={`${scene.step}-${seen}`} style={{ gap: space[5] }}>
        <T v="h2">{pending ? pending.chapterTitle : scene.chapterTitle}</T>
        <Story>
          {(pending ? pending.beats : scene.beats).map((b, k) => (
            <T key={k} v="reading">
              {b}
            </T>
          ))}
        </Story>
        {pending ? (
          <View style={{ gap: space[4] }}>
            <View style={{ gap: space[1] }}>
              <T v="caption" tone="muted">
                {`THE TEAM'S CALL · ${WARD_KIND[pending.kind].toUpperCase()}`}
              </T>
              <T v="bodyStrong">{pending.text}</T>
              <T v="small" tone="link">
                {`The team chose ${pending.letter}${pending.voters ? ` (${pending.voters} vote${pending.voters === 1 ? "" : "s"} in)` : ""}.`}
              </T>
            </View>
            <Verdict {...verdictOf(pending)} why={`${pending.why}${pending.best ? `\n\nStrongest call: ${pending.best.text} ${pending.best.why}` : ""}`} seed={seen} />
            <Dials vars={pending.after} before={pending.before} />
          </View>
        ) : scene.decision ? (
          <View style={{ gap: space[3] }}>
            <T v="caption" tone="muted">
              {WARD_KIND[scene.decision.kind].toUpperCase()}
            </T>
            <T v="h3">{scene.decision.prompt}</T>
            {scene.decision.options.map((o, j) => (
              <AnswerRow key={o.id} index={j} text={view.myVote === o.id ? `${o.text}  (your vote)` : o.text} testID={`ward-vote-${j}`} disabled={busy || !!view.myVote} state={view.myVote === o.id ? "picked" : view.myVote ? "dim" : "idle"} onPress={() => void vote(o.id)} />
            ))}
            {view.myVote ? (
              <T v="small" tone="muted" accessibilityLiveRegion="polite" testID="ward-waiting">
                {`Vote in. ${view.votes} of ${view.members.length} voted; ${need} matching votes move the story on. Come back any time.`}
              </T>
            ) : (
              <T v="small" tone="muted">
                {"Your own vote is graded for you. The team's choice decides the story."}
              </T>
            )}
            {lost ? <MoveError text="Connection lost. Your vote was not sent. Try again." /> : null}
            <Dials vars={scene.vars} />
          </View>
        ) : null}
      </Swap>
    </GameFrame>
  );
}
