import { router, useLocalSearchParams } from "expo-router";
import { BookOpen } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, EmptyState, LoadError, ProgressLine, Row, RowList, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
import { space, useTheme } from "@/theme";
import { isSoon, usePlayQuery } from "../api";
import { Tag } from "../parts";
import type { PrepSubjects, PrepTopicRow, PrepTopics } from "../types";

function Soon() {
  return <EmptyState mood="sleepy" title="Coming in the next update" body="Exam Prep is ready on the website and arrives in the app soon." testID="soon" />;
}

/** Exam Prep: subjects, each with how much is answered. */
export function PrepHome() {
  const c = useTheme();
  const q = usePlayQuery<PrepSubjects>([], "prep", "subjects");
  return (
    <Screen testID="prep" title="Exam Prep" lead="Questions by subject and topic, one at a time. Nothing here counts towards your marks." onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError ? (
        isSoon(q.error) ? <Soon /> : <LoadError what="Exam Prep" onRetry={() => void q.refetch()} />
      ) : !q.data ? (
        <RowsSkeleton rows={4} />
      ) : (
        <>
          <Section title="Subjects">
            <RowList>
              {q.data.subjects.map((s) => (
                <Row key={s.id} testID={`prep-${s.id}`} title={s.title} meta={s.answered ? `${s.answered} of ${s.questions} answered · ${Math.round((s.right / Math.max(1, s.answered)) * 100)}% right` : `${s.questions} questions`} below={s.answered ? <View style={{ marginTop: space[2] }}><ProgressLine value={(s.answered / Math.max(1, s.questions)) * 100} height={3} /></View> : undefined} onPress={() => router.push(`/prep/${encodeURIComponent(s.id)}`)} />
              ))}
            </RowList>
          </Section>
          <RowList>
            <Row testID="prep-long" title="Long answers" meta={`${q.data.long} exam questions with a model answer`} icon={<BookOpen size={20} color={c.muted} />} onPress={() => router.push("/prep/long")} />
          </RowList>
        </>
      )}
    </Screen>
  );
}

/** One subject: its topics; a topic opens the set picker. */
export function PrepSubject() {
  const { subject = "" } = useLocalSearchParams<{ subject: string }>();
  const q = usePlayQuery<PrepTopics>([subject], "prep", "topics", subject);
  const [topic, setTopic] = React.useState<PrepTopicRow | null>(null);
  const openSet = (t: PrepTopicRow, n: number) => {
    setTopic(null);
    router.push(`/prep/set?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(t.id)}&set=${n}`);
  };
  return (
    <Screen testID="prep-subject" title={q.data?.subject.title ?? " "} lead={q.data ? `${q.data.topics.length} topics` : undefined}>
      {q.isError ? (
        isSoon(q.error) ? <Soon /> : <LoadError what="this subject" onRetry={() => void q.refetch()} />
      ) : !q.data ? (
        <RowsSkeleton rows={6} />
      ) : (
        <RowList>
          {q.data.topics.map((t) => (
            <Row key={t.id} testID={`prep-topic-${t.id}`} title={t.title} meta={`${t.questions} questions · ${t.sets.length} ${t.sets.length === 1 ? "set" : "sets"}`} trailing={t.answered >= t.questions && t.questions ? <Tag tag="done" /> : t.answered ? `${t.answered}/${t.questions}` : undefined} onPress={() => (t.sets.length === 1 ? openSet(t, 0) : setTopic(t))} />
          ))}
        </RowList>
      )}
      <Sheet open={!!topic} onClose={() => setTopic(null)} title={topic?.title} testID="set-picker">
        {topic ? (
          <View style={{ gap: space[3] }}>
            <T v="small" tone="muted">
              Pick a set. Each is a few questions, one at a time.
            </T>
            <RowList>
              {topic.sets.map((s) => (
                <Row key={s.n} testID={`set-${s.n}`} title={`Set ${s.n + 1}`} meta={`${s.questions} questions`} trailing={s.done ? `${s.right}/${s.questions}` : undefined} onPress={() => openSet(topic, s.n)} />
              ))}
            </RowList>
            <Button kind="quiet" label="Start the first set not done" onPress={() => openSet(topic, topic.sets.find((s) => !s.done)?.n ?? 0)} testID="set-next" />
          </View>
        ) : null}
      </Sheet>
    </Screen>
  );
}
