import { ArrowRight, Flame as FlameIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { ModuleSummary, StudyHome } from "@/api/contract";
import { go } from "@/api/prefetch";
import { Jyo, Label, QuietEmpty, Stone, T } from "@/ds";
import { Enter, ProgressRing, StaggerList } from "@/motion";
import { openTarget } from "@/nav/targets";
import { streakLine } from "@/screens/home/home";
import { Group, Pill, StateMark } from "@/screens/learn/parts";
import { space, useTheme } from "@/theme";

export function moduleMeta(m: ModuleSummary): string {
  if (m.status.complete) return `Complete${m.status.best !== null && m.status.total ? ` · Test ${m.status.best} of ${m.status.total}` : ""}`;
  if (m.status.readDone) return `${m.status.readDone} of ${m.status.readTotal} sections read · ${m.when}`;
  return `${m.when} · About ${Math.round(m.minutes / 5) * 5} min`;
}

/** One module on a stone: its ring (or a tick when complete), number, title and where it stands. */
function ModuleCard({ m }: { m: ModuleSummary }) {
  const c = useTheme();
  const started = m.status.readDone > 0 || m.status.pct > 0;
  return (
    <Stone testID={`module-${m.id}`} quiet={!started && !m.status.complete} pad={space[3] + 2} accessibilityLabel={`Module ${m.num}. ${m.title}. ${moduleMeta(m)}`} onPress={() => go(`/study/${encodeURIComponent(m.id)}`)}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        {m.status.complete ? (
          <StateMark state="done" size={44} />
        ) : (
          <ProgressRing pct={m.status.pct} size={44} stroke={4} delay={200} color={c.dark ? c.lime : c.brand} track={c.hairline} label={`${m.status.pct}% done`}>
            <T v="caption" num maxFontSizeMultiplier={1.2}>
              {m.num}
            </T>
          </ProgressRing>
        )}
        <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
          <T v="bodyStrong">{m.title}</T>
          <T v="small" tone="muted" num>
            {moduleMeta(m)}
          </T>
        </View>
        {m.status.complete && m.status.best !== null && m.status.total ? <Pill tone="ink">{`${m.status.best}/${m.status.total}`}</Pill> : <ArrowRight size={18} color={c.faint} />}
      </View>
    </Stone>
  );
}

export function StudyHomeBody({ d, after }: { d: StudyHome; /** Shown under the one thing to carry on with (the Study tab puts Your map here). */ after?: React.ReactNode }) {
  const c = useTheme();
  const now = d.modules.filter((m) => !m.status.complete && m.status.readDone > 0);
  const later = d.modules.filter((m) => !m.status.complete && m.status.readDone === 0);
  const done = d.modules.filter((m) => m.status.complete);
  const streak = streakLine(d.goal.streak);
  const shelf = (title: string, items: ModuleSummary[], i: number) =>
    items.length ? (
      <Enter i={i}>
        <Group>
          <Label>{title}</Label>
          <StaggerList style={{ gap: space[2] }}>
            {items.map((m) => (
              <ModuleCard key={m.id} m={m} />
            ))}
          </StaggerList>
        </Group>
      </Enter>
    ) : null;
  if (!d.modules.length) return <QuietEmpty testID="study-empty" art={<Jyo pose="resting" size={64} />} title="Modules open soon" body="Your first module opens here when your course starts." />;
  const test = d.next.kind === "test" || d.next.kind === "retest";
  return (
    <>
      {d.next.kind !== "done" ? (
        <Enter i={0}>
          <Group>
            <Label>{test ? "Ready for the test" : "Carry on reading"}</Label>
            <Stone testID="study-continue" accessibilityLabel={`${test ? "Take the test" : "Carry on"}: ${d.next.label}`} onPress={() => openTarget(d.next.target)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={22} color={c.onLime} strokeWidth={2.6} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <T v="h2">{d.next.label}</T>
                  <T v="small" tone="muted" num>
                    {d.goal.points} of {d.goal.goal} points today
                  </T>
                </View>
              </View>
            </Stone>
          </Group>
        </Enter>
      ) : (
        <QuietEmpty testID="study-all-done" art={<Jyo pose="wellDone" size={64} />} title="Every module done" body="Re-tests appear here when they are due." />
      )}
      {streak ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: space[1] }}>
          <FlameIcon size={16} color={c.areas.practise.deep} fill={c.areas.practise.wash} />
          <T v="small" tone="muted" num>
            {streak}
          </T>
        </View>
      ) : null}
      {after}
      {shelf("Reading now", now, 1)}
      {shelf("Coming up", later, 2)}
      {shelf("Done", done, 3)}
    </>
  );
}
