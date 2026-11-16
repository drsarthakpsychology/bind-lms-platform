import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, Check, Circle, Lock } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CheckpointSummary, ModuleDetail, ModuleStatus, SectionToc } from "@/api/contract";
import { keys, useModule } from "@/api/queries";
import { Button, Loaded, Row, RowList, RowsSkeleton, Screen, Section, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { openTarget } from "@/nav/targets";
import { saveLearn, withActivity, withWritten } from "@/study/state";
import { space, useTheme } from "@/theme";

function sectionMark(s: SectionToc, c: ReturnType<typeof useTheme>) {
  if (s.doneOn) return <Check size={20} color={c.ink} accessibilityLabel="Read" />;
  if (s.isTest) return <T v="small" tone="muted">Test</T>;
  return <T v="small" tone="muted" num>{Math.max(1, Math.round(s.words / 200))} min</T>;
}

/** The module's four steps in plain words: "Read: 1 of 4", "Written: not yet", with a tick when done. */
export function moduleStatusLines(st: ModuleStatus): { label: string; value: string; done: boolean }[] {
  const lines = [
    { label: "Read", value: st.readTotal && st.readDone >= st.readTotal ? "all done" : `${st.readDone} of ${st.readTotal}`, done: st.readTotal > 0 && st.readDone >= st.readTotal },
    { label: "Written", value: st.written ? "done" : "not yet", done: st.written },
  ];
  if (st.actsTotal > 0) lines.push({ label: "Practised", value: st.actsDone >= st.actsTotal ? "all done" : st.actsDone ? `${st.actsDone} of ${st.actsTotal}` : "not yet", done: st.actsDone >= st.actsTotal });
  lines.push({ label: "Test", value: st.best !== null && st.total ? `best ${st.best} of ${st.total}` : "not yet", done: st.tested });
  return lines;
}

const CP_WORD: Record<CheckpointSummary["status"], string> = { early: "Read the sections first", waiting: "Opens after the sections", ready: "Ready", done: "Done" };

export function ModuleBody({ m }: { m: ModuleDetail }) {
  const c = useTheme();
  const qc = useQueryClient();
  const [writing, setWriting] = React.useState(false);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: keys.module(m.id) });
    void qc.invalidateQueries({ queryKey: keys.study });
  };
  const wrote = async () => {
    setWriting(true);
    await saveLearn(qc, (st, today) => withWritten(st, m.id, today));
    setWriting(false);
    haptic.success();
    refresh();
  };
  const parts: { part: string | null; items: SectionToc[] }[] = [];
  for (const s of m.sections) {
    const last = parts[parts.length - 1];
    if (last && last.part === s.part) last.items.push(s);
    else parts.push({ part: s.part, items: [s] });
  }
  const openSection = (s: SectionToc) => router.push(s.isTest ? `/study/${encodeURIComponent(m.id)}/test` : `/study/${encodeURIComponent(m.id)}/${encodeURIComponent(s.id)}`);
  return (
    <>
      <View style={{ gap: space[2] }}>
        <T v="small" tone="muted">
          Module {m.num} · {m.when}
        </T>
        <T v="h1">{m.title}</T>
        <T tone="muted">{m.tagline}</T>
      </View>
      {m.next.kind !== "done" ? (
        <View style={{ gap: space[3] }}>
          <T v="bodyStrong">{m.next.label}</T>
          <Button label={m.next.kind === "test" || m.next.kind === "retest" ? "Take the test" : m.next.kind === "checkpoint" ? "Open the checkpoint" : "Carry on"} icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => openTarget(m.next.target)} testID="module-next" />
        </View>
      ) : null}
      <View style={{ gap: space[1] }} testID="module-status">
        {moduleStatusLines(m.status).map((l) => (
          <View key={l.label} style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            {l.done ? <Check size={18} color={c.ink} /> : <Circle size={18} color={c.muted} />}
            <T num>
              <T v="bodyStrong">{l.label}:</T> {l.value}
            </T>
          </View>
        ))}
      </View>
      {parts.map((p, i) => (
        <Section key={i} title={p.part ?? "Sections"}>
          <RowList>
            {p.items.map((s) => (
              <Row key={s.id} testID={`section-${s.id}`} title={`${s.num} ${s.title}`} meta={s.levelCheck ? "Optional self-check" : s.tag === "extra" ? "Extra reading" : undefined} trailing={sectionMark(s, c)} chevron={false} onPress={() => openSection(s)} />
            ))}
          </RowList>
        </Section>
      ))}
      {m.checkpoints.length ? (
        <Section title="Checkpoints">
          <RowList>
            {m.checkpoints.map((cp) => (
              <Row
                key={cp.n}
                testID={`checkpoint-${cp.n}`}
                title={cp.title}
                meta={cp.best !== null && cp.total ? `Best ${cp.best} of ${cp.total}` : CP_WORD[cp.status]}
                trailing={cp.status === "done" ? <Check size={20} color={c.ink} /> : cp.status === "ready" ? undefined : <Lock size={18} color={c.muted} />}
                onPress={cp.status === "ready" || cp.status === "done" ? () => router.push(`/study/${encodeURIComponent(m.id)}/checkpoint/${cp.n}`) : () => toast.show("Read the sections it covers first.")}
              />
            ))}
          </RowList>
        </Section>
      ) : null}
      {m.activities.length ? (
        <Section title="Practise this module">
          <RowList>
            {m.activities.map((a) => (
              <Row key={a.id} testID={`activity-${a.id}`} title={a.title} meta={a.why || undefined} trailing={a.doneOn ? <Check size={20} color={c.ink} accessibilityLabel="Done" /> : undefined} onPress={() => {
                  void saveLearn(qc, (st, today) => withActivity(st, m.id, a.id, today)).then(refresh);
                  openTarget(a.target);
                }} />
            ))}
          </RowList>
        </Section>
      ) : null}
      {m.writeTask ? (
        <Section title="Write it out" action={<T v="small" tone="muted">On paper, from memory</T>}>
          <View style={{ gap: space[2] }}>
            <T v="reading">{m.writeTask}</T>
            {m.status.written ? (
              <T v="small" tone="muted">
                Done
              </T>
            ) : (
              <Button kind="quiet" label="I have done this on paper" busy={writing} onPress={() => void wrote()} testID="module-written" />
            )}
          </View>
        </Section>
      ) : null}
      {m.noteId ? (
        <RowList>
          <Row testID="module-note" title="One-page note for this module" meta="Read it before the test" onPress={() => router.push(`/notes/${encodeURIComponent(m.noteId!)}`)} />
        </RowList>
      ) : null}
      {m.outcomes.length ? (
        <Section title="By the end you can">
          <View style={{ gap: space[2] }}>
            {m.outcomes.map((o, i) => (
              <View key={i} style={{ flexDirection: "row", gap: space[3] }}>
                <T tone="muted">•</T>
                <T style={{ flex: 1 }}>{o}</T>
              </View>
            ))}
          </View>
        </Section>
      ) : null}
      {m.nextModule ? (
        <RowList>
          <Row title={`Next module: ${m.nextModule.title}`} meta={`Module ${m.nextModule.num}`} onPress={() => router.push(`/study/${encodeURIComponent(m.nextModule!.id)}`)} />
        </RowList>
      ) : null}
    </>
  );
}

export function ModuleScreen() {
  const { moduleId = "" } = useLocalSearchParams<{ moduleId: string }>();
  const q = useModule(String(moduleId));
  return (
    <Screen testID="module" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="this module" skeleton={<RowsSkeleton rows={6} />}>
        {(m) => <ModuleBody m={m} />}
      </Loaded>
    </Screen>
  );
}
