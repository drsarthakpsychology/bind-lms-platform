import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, Check, Lock } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CheckpointSummary, ModuleDetail, SectionToc } from "@/api/contract";
import { useModule } from "@/api/queries";
import { Button, Loaded, Row, RowList, RowsSkeleton, Screen, Section, Stat, T } from "@/ds";
import { toast } from "@/ds/toast";
import { openTarget } from "@/nav/targets";
import { space, useTheme } from "@/theme";

function sectionMark(s: SectionToc, c: ReturnType<typeof useTheme>) {
  if (s.doneOn) return <Check size={20} color={c.ink} accessibilityLabel="Read" />;
  if (s.isTest) return <T v="small" tone="muted">Test</T>;
  return <T v="small" tone="muted" num>{Math.max(1, Math.round(s.words / 200))} min</T>;
}

const CP_WORD: Record<CheckpointSummary["status"], string> = { early: "Read the sections first", waiting: "Opens after the sections", ready: "Ready", done: "Done" };

export function ModuleBody({ m }: { m: ModuleDetail }) {
  const c = useTheme();
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
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[6], rowGap: space[3] }}>
        <Stat value={`${m.status.readDone}/${m.status.readTotal}`} label="Read" />
        <Stat value={m.status.written ? "Yes" : "No"} label="Written" />
        <Stat value={`${m.status.actsDone}/${m.status.actsTotal}`} label="Practised" />
        <Stat value={m.status.best !== null && m.status.total ? `${m.status.best}/${m.status.total}` : "Not yet"} label="Test" />
      </View>
      {parts.map((p, i) => (
        <Section key={i} title={p.part ?? "Sections"}>
          <RowList>
            {p.items.map((s) => (
              <Row key={s.id} testID={`section-${s.id}`} title={`${s.num} ${s.title}`} meta={s.tag === "extra" ? "Extra reading" : undefined} trailing={sectionMark(s, c)} chevron={false} onPress={() => openSection(s)} />
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
