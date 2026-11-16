import { Check, CircleDashed, LogIn, Share2, Users } from "lucide-react-native";
import * as React from "react";
import { AppState, Share, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import { Button, Field, Row, RowList, Section, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { presets, Stamp } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import type { TeamListItem } from "../types";

/**
 * Team pieces shared by Ward Week and the Escape Room, as on the website
 * (src/lib/games-sims/ui/team.tsx): the join box, the team code with a share
 * button, the member list (an icon and a word for each status, never colour
 * alone), and the poll that keeps every phone on the same page. The website
 * polls too (no live socket), so the app reads the same view on the same beat.
 */

/** Turns a typed code into the website's form (normaliseCode: letters and digits, upper case). */
export const normaliseCode = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

/**
 * Poll `load` every `ms` while `on` and the app is in front; once at once.
 * The result is handed to `apply` from the timer, never during render.
 */
export function usePoll<T>(on: boolean, ms: number, load: () => Promise<T>, apply: (v: T) => void) {
  const ref = React.useRef({ load, apply });
  React.useEffect(() => {
    ref.current = { load, apply };
  });
  React.useEffect(() => {
    if (!on) return;
    let alive = true;
    let busy = false;
    const tick = () => {
      if (busy || AppState.currentState === "background") return;
      busy = true;
      ref.current
        .load()
        .then((v) => alive && ref.current.apply(v))
        .catch(() => undefined)
        .finally(() => {
          busy = false;
        });
    };
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, ms);
    const sub = AppState.addEventListener("change", (s) => s === "active" && tick());
    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(id);
      sub.remove();
    };
  }, [on, ms]);
}

/** The team's name and its code, big, with Share. The code stamps in the first time. */
export function TeamCode({ code, name, message }: { code: string; name: string; message: string }) {
  const c = useTheme();
  const share = () => {
    haptic.tap();
    void Share.share({ message: `${message} Code: ${code}` }).catch(() => undefined);
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], flexWrap: "wrap" }} testID="team-code">
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], flexShrink: 1 }}>
        <Users size={18} color={c.ink} />
        <T v="bodyStrong" numberOfLines={1}>
          {name}
        </T>
      </View>
      <Stamp rotate={-2}>
        <View accessible accessibilityLabel={`Team code ${code.split("").join(" ")}`} style={{ paddingHorizontal: space[3], paddingVertical: space[1], borderRadius: 8, borderWidth: 2, borderColor: c.ink, backgroundColor: c.primary }}>
          <T style={{ fontFamily: fonts.pixelDigits, fontSize: 20, lineHeight: 26, letterSpacing: 3, color: c.onPrimary }}>{code}</T>
        </View>
      </Stamp>
      <Button kind="text" full={false} label="Share the code" icon={<Share2 size={16} color={c.link} />} onPress={share} testID="team-share" />
    </View>
  );
}

export type MemberLine = { name: string; me: boolean; done?: boolean; doneWord?: string; waitWord?: string };

/** Who is in the team; each member's status in a word with an icon. New members pop in. */
export function Members({ members, max }: { members: MemberLine[]; max: number }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  return (
    <View style={{ gap: space[2] }} testID="team-members">
      <T v="caption" tone="muted" num>{`TEAM ${members.length}/${max}`}</T>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {members.map((m, i) => (
          <Animated.View key={`${m.name}-${i}`} entering={reduce ? undefined : presets.pop(i * 40)} layout={reduce ? undefined : presets.layout()} accessible accessibilityLabel={`${m.name}${m.me ? ", you" : ""}${m.done === undefined ? "" : m.done ? `, ${m.doneWord ?? "done"}` : `, ${m.waitWord ?? "waiting"}`}`} style={{ flexDirection: "row", alignItems: "center", gap: space[1], minHeight: 32, paddingHorizontal: space[3], borderRadius: 16, borderWidth: 1.5, borderColor: m.me ? c.ink : c.cardLine, backgroundColor: m.done ? c.successBg : c.card }}>
            <T v="small" style={{ fontFamily: fonts.semibold }}>
              {m.me ? `${m.name} (you)` : m.name}
            </T>
            {m.done === undefined ? null : m.done ? (
              <>
                <Check size={14} color={c.successFg} strokeWidth={3} />
                <T v="caption" style={{ color: c.successFg }}>
                  {m.doneWord ?? "Done"}
                </T>
              </>
            ) : (
              <>
                <CircleDashed size={14} color={c.muted} />
                <T v="caption" tone="muted">
                  {m.waitWord ?? "Waiting"}
                </T>
              </>
            )}
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

/** Type a classmate's code and join. */
export function JoinBox({ onJoin, label }: { onJoin: (code: string) => Promise<string | null>; label: string }) {
  const c = useTheme();
  const [code, setCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const go = async () => {
    const k = normaliseCode(code);
    if (k.length < 4) {
      setErr("Type the code your classmate shared.");
      haptic.warn();
      return;
    }
    setBusy(true);
    setErr(null);
    const problem = await onJoin(k).catch(() => "Couldn't join. Try again.");
    setBusy(false);
    if (problem) {
      setErr(problem);
      haptic.warn();
    }
  };
  return (
    <View style={{ gap: space[2] }}>
      <Field label={label} value={code} onChangeText={(v) => setCode(normaliseCode(v))} placeholder="Code, like K7RQ2" autoCapitalize="characters" autoCorrect={false} maxLength={8} error={err} returnKeyType="go" onSubmitEditing={() => void go()} testID="team-join-code" />
      <Button kind="quiet" label="Join" icon={<LogIn size={18} color={c.ink} />} busy={busy} onPress={() => void go()} testID="team-join" />
    </View>
  );
}

/** Under a start screen: start a team, join one, and the teams you are in. */
export function TeamsBlock({ on, teams, createLabel, onCreate, onJoin, onOpen, teamLine, busy, error }: { on: boolean; teams: TeamListItem[]; createLabel: string; onCreate: () => void; onJoin: (code: string) => Promise<string | null>; onOpen: (id: string) => void; teamLine: (t: TeamListItem) => string; busy: boolean; error: string | null }) {
  const c = useTheme();
  if (!on) {
    return (
      <T v="small" tone="muted">
        Team play is not open yet. Play solo for now.
      </T>
    );
  }
  return (
    <Section title="Team mode">
      <View style={{ gap: space[4], borderWidth: 1.5, borderColor: c.cardLine, borderRadius: layout.radius, padding: space[4] }}>
        <Button kind="quiet" label={createLabel} icon={<Users size={18} color={c.ink} />} busy={busy} onPress={onCreate} testID="team-create" />
        {error ? (
          <T v="small" tone="danger" accessibilityLiveRegion="polite">
            {error}
          </T>
        ) : null}
        <JoinBox onJoin={onJoin} label="Got a code from a classmate?" />
      </View>
      {teams.length ? (
        <RowList>
          {teams.map((t) => (
            <Row key={t.id} title={t.name} meta={teamLine(t)} icon={<Users size={20} color={c.muted} />} onPress={() => onOpen(t.id)} testID={`team-open-${t.id}`} />
          ))}
        </RowList>
      ) : null}
    </Section>
  );
}
