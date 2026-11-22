import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, Bookmark, RotateCcw, Sparkles, Timer } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { FieldCard, Label, Pebbles, ProgressLine, QuietEmpty, Row, RowList, RowsSkeleton, Screen, StillTrying, Stone, T, type Pebble } from "@/ds";
import { Enter, ProgressRing, StaggerList } from "@/motion";
import { loadLine } from "../frame";
import { recentPrep } from "@/lib/recent";
import { hrefFor } from "@/nav/targets";
import { canGuess, go, prefetchRoute } from "@/api/prefetch";
import { space, useTheme } from "@/theme";
import { useRead } from "../api";
import type { PrepHome as Home, PrepStats, PrepSubjectDetail } from "../contract";
import { Stagger } from "../fx";
import { openRow } from "../hub";
import { Tag } from "../parts";

const enc = encodeURIComponent;
/** "Answered 40 · 72% right", or nothing before the first answer. */
function statLine(s: PrepStats): string | undefined {
  if (!s.answered) return undefined;
  return `${Math.round((s.right / Math.max(1, s.answered)) * 100)}% right of those answered`;
}
const bar = (s: PrepStats) => (s.answered ? <View style={{ marginTop: space[2] }}><ProgressLine value={(s.answered / Math.max(1, s.total)) * 100} height={3} /></View> : undefined);

/** Exam Prep (GET /prep): where you stopped on the field; quick doors; then every subject with how far you are. */
export function PrepHome() {
  const c = useTheme();
  const q = useRead<Home>("/prep");
  const d = q.data;
  const resume = d?.resume ? hrefFor(d.resume.target) ?? `/prep/set?subject=${enc(d.resume.subject)}&topic=${enc(d.resume.topic)}&set=${d.resume.set}` : null;
  // Exam prep open: the set you would carry on with, and a Smart set, start loading (first question at once).
  React.useEffect(() => {
    if (!d || !canGuess()) return;
    prefetchRoute(resume);
    prefetchRoute("/prep/set?list=smart");
  }, [d, resume]);
  const doors: Pebble[] = d
    ? [
        { label: "Smart set", icon: Sparkles, onPress: () => go("/prep/set?list=smart"), testID: "prep-smart", live: !d.resume },
        ...(d.wrong ? [{ label: "Try again", icon: RotateCcw, onPress: () => go("/prep/set?list=wrong"), testID: "prep-wrong" }] : []),
        { label: "Mock tests", icon: Timer, onPress: () => go("/prep/mock"), testID: "prep-more-mock" },
        { label: "Long answers", icon: BookOpen, onPress: () => router.push("/prep/long"), testID: "prep-long" },
      ].slice(0, 4)
    : [];
  return (
    <Screen
      testID="prep"
      area="practise"
      title="Exam prep"
      lead="Questions by subject and topic, one at a time. Nothing here counts towards your marks."
      field={d?.resume && resume ? <FieldCard title={`Carry on: ${d.resume.topicTitle}`} meta={`${d.resume.subjectTitle} · set ${d.resume.set} of ${d.resume.sets}`} action={{ label: "Carry on", onPress: () => go(resume), testID: "prep-resume" }} /> : undefined}
      gap={space[6]}
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
    >
      {q.isError && q.data === undefined ? (
        <QuietEmpty testID="load-error" title="Exam prep didn't load" body={loadLine(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />
      ) : !d ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={5} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : (
        <>
          <Enter i={0}>
            <Pebbles items={doors} />
          </Enter>
          <Enter i={1} style={{ gap: space[2] }}>
            <Label>Subjects</Label>
            <StaggerList style={{ gap: space[2] }}>
              {d.subjects.map((s) => {
                const pct = s.stats.total ? Math.round((s.stats.answered / s.stats.total) * 100) : 0;
                const done = !!s.stats.total && s.stats.answered >= s.stats.total;
                return (
                  <Stone key={s.id} testID={`prep-${s.id}`} accessibilityLabel={`${s.title}. ${statLine(s.stats) ?? "Not started"}`} grow={() => { recentPrep.add(s.id); go(`/prep/${enc(s.id)}`); }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                      <ProgressRing pct={pct} size={44} stroke={5} color={c.dark ? c.lime : c.brand} track={c.hairline} label={`${pct} percent answered`}>
                        {done ? <Tag tag="done" /> : null}
                      </ProgressRing>
                      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                        <T v="bodyStrong">{s.title}</T>
                        <T v="small" tone="muted">
                          {statLine(s.stats) ?? (s.stats.total ? `${s.stats.total} questions` : "Not started")}
                        </T>
                      </View>
                    </View>
                  </Stone>
                );
              })}
            </StaggerList>
          </Enter>
          {(d.canSave && d.saved) || d.more.some((r) => r.id !== "long" && r.id !== "mock") ? (
            <Enter i={2} style={{ gap: space[2] }}>
              <Label>More</Label>
              <RowList>
                {d.canSave && d.saved ? <Row testID="prep-saved" title="Saved questions" meta="The ones you bookmarked" icon={<Bookmark size={20} color={c.muted} />} onPress={() => go("/prep/set?list=saved")} /> : null}
                {d.more
                  .filter((r) => r.id !== "long" && r.id !== "mock")
                  .map((r) => (
                    <Row key={r.id} testID={`prep-more-${r.id}`} title={r.title} meta={r.meta ?? undefined} onPress={() => openRow(r)} />
                  ))}
              </RowList>
            </Enter>
          ) : null}
        </>
      )}
    </Screen>
  );
}

/** One subject (GET /prep/subjects/:subject): its topics; a topic opens its first set not done. */
export function PrepSubject() {
  const { subject = "" } = useLocalSearchParams<{ subject: string }>();
  const q = useRead<PrepSubjectDetail>(`/prep/subjects/${enc(subject)}`);
  const d = q.data;
  return (
    <Screen testID="prep-subject" area="practise" title={d?.title ?? " "} lead={d ? statLine(d.stats) : undefined}>
      {(q.isError && q.data === undefined) ? (
        <QuietEmpty testID="load-error" title="That didn't load" body={loadLine(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />
      ) : !d ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={6} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : (
        <Stagger>
          <RowList>
            {d.topics.map((t) => (
              <Row key={t.id} testID={`prep-topic-${t.id}`} title={t.title} meta={statLine(t.stats)} below={bar(t.stats)} trailing={t.stats.total && t.stats.answered >= t.stats.total ? <Tag tag="done" /> : undefined} onPress={() => go(`/prep/set?subject=${enc(subject)}&topic=${enc(t.id)}`)} />
            ))}
          </RowList>
          {d.long ? (
            <RowList>
              <Row testID="prep-subject-long" title="Long answers" meta="Exam questions with a model answer" onPress={() => router.push(`/prep/long?subject=${enc(subject)}`)} />
            </RowList>
          ) : null}
        </Stagger>
      )}
    </Screen>
  );
}
