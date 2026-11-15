import { router } from "expo-router";
import { ExternalLink, Lock, Trophy } from "lucide-react-native";
import * as React from "react";
import { Linking, View } from "react-native";

import { EmptyState, Hero, LoadError, Row, RowList, Screen, Section, Skeleton, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { hrefFor } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";
import { useRead } from "./api";
import { type Icon } from "./catalog";
import type { PractiseHubData, PractiseRow } from "./contract";
import { Stagger } from "./fx";
import { EntryIcon } from "./icons";

/** The server's row id to the app screen and its icon. */
const APP: Record<string, { href: string; icon: Icon }> = {
  daily: { href: "/case/daily", icon: "sun" },
  detective: { href: "/case/detective", icon: "search" },
  wwyd: { href: "/case/wwyd", icon: "chat" },
  "two-minute": { href: "/case/two-minute", icon: "clock" },
  terms: { href: "/case/say-it", icon: "words" },
  judgment: { href: "/case/judgment", icon: "gauge" },
  ethics: { href: "/case/ethics", icon: "scale" },
  "out-of-depth": { href: "/case/out-of-depth", icon: "alert" },
  landmark: { href: "/case/landmark", icon: "cap" },
  osce: { href: "/case/osce", icon: "timer" },
  mse: { href: "/case/mse-trainer", icon: "brain" },
  formulation: { href: "/case/formulation", icon: "wand" },
  "weak-spots": { href: "/case/weak-spots", icon: "target" },
  blitz: { href: "/game/blitz", icon: "timer" },
  sort: { href: "/game/sort", icon: "grid" },
  "mse-lab": { href: "/game/mse", icon: "scan" },
  ward: { href: "/game/ward", icon: "hospital" },
  rx: { href: "/game/rx", icon: "pill" },
  duel: { href: "/game/duel", icon: "swords" },
  escape: { href: "/game/escape", icon: "door" },
  comorbid: { href: "/game/comorbid", icon: "layers" },
  prep: { href: "/prep", icon: "list" },
  league: { href: "/game/leaderboard?board=league", icon: "trophy" },
  quiz: { href: "/game/leaderboard?board=quiz", icon: "trophy" },
  overall: { href: "/game/leaderboard?board=overall", icon: "trophy" },
};

/** Where a row opens: the app's own screen, or the website for the few parts that need voice or live peers. */
export function openRow(r: PractiseRow): void {
  if (r.locked) {
    toast.show("This opens soon.");
    return;
  }
  const own = APP[r.id];
  if (r.play === "native" && own) {
    router.push(own.href);
    return;
  }
  const href = r.play === "native" ? hrefFor(r.target) : null;
  if (href) router.push(href);
  else void Linking.openURL(`${config.site}${r.target.web}`).catch(() => toast.show("That didn't open. Try again."));
}

function Rows({ rows }: { rows: PractiseRow[] }) {
  const c = useTheme();
  return (
    <RowList>
      {rows.map((r) => {
        const own = APP[r.id];
        const trailing = r.locked ? <Lock size={16} color={c.muted} /> : r.play === "web" ? <ExternalLink size={16} color={c.muted} /> : r.trailing ? (
          <T v="caption" tone="link">
            {r.trailing}
          </T>
        ) : undefined;
        return <Row key={r.id} testID={`practise-${r.id}`} title={r.title} meta={r.meta ?? undefined} icon={own ? <EntryIcon icon={own.icon} color={c.muted} /> : r.kind === "board" ? <Trophy size={20} color={c.muted} /> : undefined} trailing={trailing} onPress={() => openRow(r)} />;
      })}
    </RowList>
  );
}

/**
 * Practise: one thing to start (carry on where you were, or today's case),
 * then the website's groups as quiet rows, in the server's order and with
 * the server's locks. A row carries at most one small word on the right.
 */
export function PractiseHub() {
  const q = useRead<PractiseHubData>("/practise");
  const s = q.data;
  const daily = s?.cases.find((r) => r.id === "daily" && !r.locked);
  const resume = s?.resume ? hrefFor(s.resume.target) : null;
  const hero = !s ? null : s.resume && resume ? (
    <Hero context="Carry on" title={s.resume.title} meta="Pick up where you left off." action={{ label: "Carry on", onPress: () => router.push(resume), testID: "hub-carry-on" }} />
  ) : daily ? (
    <Hero context="Daily case" title={daily.trailing === "Done today" ? "Today's patient is solved" : "Today's patient"} meta={daily.trailing === "Done today" ? "A new one comes at midnight." : "Name the diagnosis in as few clues as you can."} action={{ label: daily.trailing === "Done today" ? "Play a practice case" : "Open today's case", onPress: () => router.push(daily.trailing === "Done today" ? "/case/daily?mode=practice" : "/case/daily"), testID: "hub-daily" }} />
  ) : null;
  const cases = s?.cases.filter((r) => r.id !== "daily") ?? [];
  return (
    <Screen tab top={<TabTop />} title="Practise" testID="practise" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError ? (
        <LoadError what="Practise" onRetry={() => void q.refetch()} />
      ) : q.isLoading || !s ? (
        <View style={{ gap: space[3] }} testID="practise-loading">
          <Skeleton w="40%" h={14} />
          <Skeleton w="80%" h={34} />
          <Skeleton h={52} r={12} />
        </View>
      ) : (
        <Stagger gap={space[6]}>
          {hero}
          {cases.length ? (
            <Section
              title="Cases"
              action={
                <T v="small" tone="link" onPress={() => router.push("/case/library")} accessibilityRole="link" testID="hub-library" suppressHighlighting>
                  {s.newCases.practice ?? "All cases"}
                </T>
              }
            >
              <Rows rows={cases} />
            </Section>
          ) : null}
          {s.games.length ? (
            <Section title="Games" action={s.newCases.games ? <T v="small" tone="muted">{s.newCases.games}</T> : undefined}>
              <Rows rows={s.games} />
            </Section>
          ) : null}
          {s.prep.length ? (
            <Section title="Exam Prep">
              <Rows rows={s.prep} />
            </Section>
          ) : null}
          {s.boards.length ? (
            <Section title="Boards">
              <Rows rows={s.boards} />
            </Section>
          ) : null}
          {!cases.length && !s.games.length && !s.prep.length ? <EmptyState mood="sleepy" title="Practise opens soon" body="Your cases and games show up here once they open." /> : null}
        </Stagger>
      )}
    </Screen>
  );
}
