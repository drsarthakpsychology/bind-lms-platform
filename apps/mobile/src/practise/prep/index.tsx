import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, Bookmark, RotateCcw, Sparkles } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Hero, LoadError, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section } from "@/ds";
import { hrefFor } from "@/nav/targets";
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

/** Exam Prep (GET /prep): where you were, subjects, then smart practice, saved and wrong. */
export function PrepHome() {
  const c = useTheme();
  const q = useRead<Home>("/prep");
  const d = q.data;
  const resume = d?.resume ? hrefFor(d.resume.target) ?? `/prep/set?subject=${enc(d.resume.subject)}&topic=${enc(d.resume.topic)}&set=${d.resume.set}` : null;
  return (
    <Screen testID="prep" title="Exam Prep" lead="Questions by subject and topic, one at a time. Nothing here counts towards your marks." onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError ? (
        <LoadError what="Exam Prep" onRetry={() => void q.refetch()} />
      ) : !d ? (
        <RowsSkeleton rows={5} />
      ) : (
        <Stagger gap={space[6]}>
          {d.resume && resume ? <Hero context={`Carry on · ${d.resume.subjectTitle}`} title={d.resume.topicTitle} meta={`Set ${d.resume.set} of ${d.resume.sets}`} action={{ label: "Carry on", onPress: () => router.push(resume), testID: "prep-resume" }} /> : null}
          <Section title="Subjects">
            <RowList>
              {d.subjects.map((s) => (
                <Row key={s.id} testID={`prep-${s.id}`} title={s.title} meta={statLine(s.stats)} below={bar(s.stats)} trailing={s.stats.total && s.stats.answered >= s.stats.total ? <Tag tag="done" /> : undefined} onPress={() => router.push(`/prep/${enc(s.id)}`)} />
              ))}
            </RowList>
          </Section>
          <Section title="More practice">
            <RowList>
              <Row testID="prep-smart" title="Smart practice" meta="A set picked from what you need most" icon={<Sparkles size={20} color={c.muted} />} onPress={() => router.push("/prep/set?list=smart")} />
              {d.wrong ? <Row testID="prep-wrong" title="Practise again" meta="Questions you got wrong" icon={<RotateCcw size={20} color={c.muted} />} onPress={() => router.push("/prep/set?list=wrong")} /> : null}
              {d.canSave && d.saved ? <Row testID="prep-saved" title="Saved questions" meta="The ones you bookmarked" icon={<Bookmark size={20} color={c.muted} />} onPress={() => router.push("/prep/set?list=saved")} /> : null}
              <Row testID="prep-long" title="Long answers" meta="Exam questions with a model answer" icon={<BookOpen size={20} color={c.muted} />} onPress={() => router.push("/prep/long")} />
              {d.more
                .filter((r) => r.id !== "long")
                .map((r) => (
                  <Row key={r.id} testID={`prep-more-${r.id}`} title={r.title} meta={r.meta ?? undefined} onPress={() => (r.id === "mock" ? router.push("/prep/mock") : openRow(r))} />
                ))}
            </RowList>
          </Section>
        </Stagger>
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
    <Screen testID="prep-subject" title={d?.title ?? " "} lead={d ? statLine(d.stats) : undefined}>
      {q.isError ? (
        <LoadError what="this subject" onRetry={() => void q.refetch()} />
      ) : !d ? (
        <RowsSkeleton rows={6} />
      ) : (
        <Stagger>
          <RowList>
            {d.topics.map((t) => (
              <Row key={t.id} testID={`prep-topic-${t.id}`} title={t.title} meta={statLine(t.stats)} below={bar(t.stats)} trailing={t.stats.total && t.stats.answered >= t.stats.total ? <Tag tag="done" /> : undefined} onPress={() => router.push(`/prep/set?subject=${enc(subject)}&topic=${enc(t.id)}`)} />
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
