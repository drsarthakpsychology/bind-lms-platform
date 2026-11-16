import { router } from "expo-router";
import { ExternalLink, Lock, Trophy } from "lucide-react-native";
import * as React from "react";
import { Linking, Pressable, View } from "react-native";

import { EmptyState, Hero, LoadError, Row, RowList, Screen, Section, Skeleton, T } from "@/ds";
import { toast } from "@/ds/toast";
import { config } from "@/lib/config";
import { recentPractise, recentPrep } from "@/lib/recent";
import { hrefFor } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { space, useTheme } from "@/theme";
import { useRead } from "./api";
import { type Icon } from "./catalog";
import type { PractiseHubData, PractiseRow, PrepHome, PrepSubject } from "./contract";
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
  recentPractise.add(r.id);
  const own = APP[r.id];
  if (r.play === "native" && own) {
    router.push(own.href);
    return;
  }
  const href = r.play === "native" ? hrefFor(r.target) : null;
  if (href) router.push(href);
  else void Linking.openURL(`${config.site}${r.target.web}`).catch(() => toast.show("That didn't open. Try again."));
}

/** At most this many rows per group on the hub; the rest is one tap away. */
const PER_GROUP = 4;
const busy = (r: PractiseRow) => r.trailing === "In progress" || r.trailing === "Due";

/**
 * Up to four rows for a hub group: half-done or due first, then what this
 * phone has never opened (new to you), then the rest, each in the server's
 * order. Locked rows go last.
 */
export function pickRows(rows: PractiseRow[], opened: string[], skip: Set<string> = new Set(), n = PER_GROUP): PractiseRow[] {
  const rank = (r: PractiseRow) => (r.locked ? 3 : busy(r) ? 0 : opened.includes(r.id) ? 2 : 1);
  return rows
    .filter((r) => !skip.has(r.id))
    .map((r, i) => ({ r, i }))
    .sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i)
    .slice(0, n)
    .map((x) => x.r);
}

export function PractiseRows({ rows, testPrefix = "practise" }: { rows: PractiseRow[]; testPrefix?: string }) {
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
        return <Row key={r.id} testID={`${testPrefix}-${r.id}`} title={r.title} meta={r.meta ?? undefined} icon={own ? <EntryIcon icon={own.icon} color={c.muted} /> : r.kind === "board" ? <Trophy size={20} color={c.muted} /> : undefined} trailing={trailing} onPress={() => openRow(r)} />;
      })}
    </RowList>
  );
}

function SeeAll({ onPress, testID, label = "See all" }: { onPress: () => void; testID: string; label?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" testID={testID} hitSlop={12} style={{ minHeight: 44, justifyContent: "center", paddingLeft: space[2] }}>
      <T v="small" tone="link">
        {label}
      </T>
    </Pressable>
  );
}

const pctRight = (s: PrepSubject) => (s.stats.answered ? s.stats.right / s.stats.answered : null);

/** Exam Prep on the hub: the subject you were on first, then your weakest, then ones not started. */
function PrepRows({ home, fallback }: { home: PrepHome | undefined; fallback: PractiseRow[] }) {
  const c = useTheme();
  const opened = recentPrep.use();
  if (!home || !home.subjects.length) return <PractiseRows rows={fallback.slice(0, PER_GROUP)} />;
  const last = home.resume?.subject ?? opened[0] ?? null;
  const left = home.subjects.filter((s) => !(s.stats.total && s.stats.answered >= s.stats.total));
  const order = [...left].sort((a, b) => {
    if (a.id === last) return -1;
    if (b.id === last) return 1;
    const pa = pctRight(a);
    const pb = pctRight(b);
    if (pa !== null && pb !== null) return pa - pb;
    return pa !== null ? -1 : pb !== null ? 1 : 0;
  });
  const resume = home.resume ? hrefFor(home.resume.target) ?? `/prep/set?subject=${encodeURIComponent(home.resume.subject)}&topic=${encodeURIComponent(home.resume.topic)}&set=${home.resume.set}` : null;
  return (
    <RowList>
      {order.slice(0, PER_GROUP).map((s) => {
        const carry = home.resume && s.id === home.resume.subject && resume;
        const p = pctRight(s);
        const meta = carry ? `Carry on: ${home.resume!.topicTitle}` : p !== null ? `${Math.round(p * 100)}% right so far` : "Not started";
        return (
          <Row
            key={s.id}
            testID={`hub-prep-${s.id}`}
            title={s.title}
            meta={meta}
            icon={<EntryIcon icon="list" color={c.muted} />}
            onPress={() => {
              recentPrep.add(s.id);
              router.push(carry && resume ? resume : `/prep/${encodeURIComponent(s.id)}`);
            }}
          />
        );
      })}
    </RowList>
  );
}

/**
 * Practise: one thing for today, what you left half way (two at most), then
 * four short groups (Cases, Games, Exam Prep, Boards) of up to four rows
 * picked by what is half done or new to you. Every group's full list is
 * behind See all.
 */
export function PractiseHub() {
  const q = useRead<PractiseHubData>("/practise");
  const prep = useRead<PrepHome>("/prep");
  const opened = recentPractise.use();
  const s = q.data;
  const daily = s?.cases.find((r) => r.id === "daily" && !r.locked);
  const solved = daily?.trailing === "Done today";
  const resume = s?.resume ? hrefFor(s.resume.target) : null;
  const hero = !s ? null : daily ? (
    <Hero context="Today" title={solved ? "Today's patient is solved" : "Today's patient"} meta={solved ? "A new one comes at midnight." : "Name the diagnosis in as few clues as you can."} action={{ label: solved ? "Play a practice case" : "Open today's case", onPress: () => router.push(solved ? "/case/daily?mode=practice" : "/case/daily"), testID: "hub-daily" }} />
  ) : s.resume && resume ? (
    <Hero context="Carry on" title={s.resume.title} meta="Pick up where you left off." action={{ label: "Carry on", onPress: () => router.push(resume), testID: "hub-carry-on" }} />
  ) : null;

  // Pick up again: the last tool (when it is not already the hero) and what is half done, two at most.
  const all = s ? [...s.cases, ...s.games] : [];
  const lastRow = s?.resume ? all.find((r) => r.title === s.resume!.title) : undefined;
  const pick: { key: string; title: string; meta: string; open: () => void; icon?: Icon }[] = [];
  if (daily && s?.resume && resume) pick.push({ key: lastRow?.id ?? "resume", title: s.resume.title, meta: "Where you left off", open: () => router.push(resume), icon: lastRow ? APP[lastRow.id]?.icon : undefined });
  for (const r of all) {
    if (pick.length >= 2) break;
    if (r.id === "daily" || r.locked || r.trailing !== "In progress" || pick.some((p) => p.key === r.id)) continue;
    pick.push({ key: r.id, title: r.title, meta: "Half way", open: () => openRow(r), icon: APP[r.id]?.icon });
  }
  const shown = new Set(["daily", ...pick.map((p) => p.key)]);
  const cases = s ? pickRows(s.cases, opened, shown) : [];
  const games = s ? pickRows(s.games, opened, shown) : [];
  const c = useTheme();
  return (
    <Screen tab top={<TabTop />} title="Practise" testID="practise" onRefresh={() => void Promise.all([q.refetch(), prep.refetch()])} refreshing={q.isRefetching}>
      {q.isError ? (
        <LoadError error={q.error} what="Practise" onRetry={() => void q.refetch()} />
      ) : q.isLoading || !s ? (
        <View style={{ gap: space[3] }} testID="practise-loading">
          <Skeleton w="40%" h={14} />
          <Skeleton w="80%" h={34} />
          <Skeleton h={52} r={12} />
        </View>
      ) : (
        <Stagger gap={space[6]}>
          {hero}
          {pick.length ? (
            <Section title="Pick up again">
              <RowList>
                {pick.map((p) => (
                  <Row key={p.key} testID={`hub-pick-${p.key}`} title={p.title} meta={p.meta} icon={p.icon ? <EntryIcon icon={p.icon} color={c.muted} /> : undefined} onPress={p.open} />
                ))}
              </RowList>
            </Section>
          ) : null}
          {cases.length ? (
            <Section title="Cases" action={<SeeAll testID="hub-all-cases" onPress={() => router.push("/practise/cases")} />}>
              <PractiseRows rows={cases} />
            </Section>
          ) : null}
          {games.length ? (
            <Section title="Games" action={<SeeAll testID="hub-all-games" onPress={() => router.push("/practise/games")} />}>
              <PractiseRows rows={games} />
            </Section>
          ) : null}
          {s.prep.length ? (
            <Section title="Exam Prep" action={<SeeAll testID="hub-all-prep" onPress={() => router.push("/prep")} />}>
              <PrepRows home={prep.data} fallback={s.prep} />
            </Section>
          ) : null}
          {s.boards.length ? (
            <Section title="Boards" action={s.boards.length > PER_GROUP ? <SeeAll testID="hub-all-boards" onPress={() => router.push("/practise/boards")} /> : undefined}>
              <PractiseRows rows={s.boards.slice(0, PER_GROUP)} />
            </Section>
          ) : null}
          {!s.cases.length && !s.games.length && !s.prep.length ? <EmptyState mood="soon" title="Practise opens soon" body="Your cases and games show up here once they open." /> : null}
        </Stagger>
      )}
    </Screen>
  );
}

const GROUPS = { cases: "Cases", games: "Games", boards: "Boards" } as const;

/** See all: one group's full list, in the server's order. Cases end with every case in one list. */
export function PractiseGroup({ group }: { group: string }) {
  const q = useRead<PractiseHubData>("/practise");
  const s = q.data;
  const key = (group in GROUPS ? group : "cases") as keyof typeof GROUPS;
  const rows = s ? s[key] : [];
  return (
    <Screen testID={`practise-all-${key}`} title={GROUPS[key]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError ? (
        <LoadError error={q.error} what={GROUPS[key]} onRetry={() => void q.refetch()} />
      ) : !s ? (
        <View style={{ gap: space[3] }}>
          <Skeleton h={52} r={12} />
          <Skeleton h={52} r={12} />
          <Skeleton h={52} r={12} />
        </View>
      ) : (
        <Stagger gap={space[6]}>
          <PractiseRows rows={rows} testPrefix="all" />
          {key === "cases" ? (
            <RowList>
              <Row testID="hub-library" title="Every case in one list" meta="What you have done and what is new" onPress={() => router.push("/case/library")} />
            </RowList>
          ) : null}
        </Stagger>
      )}
    </Screen>
  );
}
