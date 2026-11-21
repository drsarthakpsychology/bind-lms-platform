import { useQueryClient } from "@tanstack/react-query";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ArrowRight, Check, Dumbbell, NotebookText, PenLine, Target } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { CheckpointSummary, ModuleDetail, ModuleStatus, SectionToc } from "@/api/contract";
import { go } from "@/api/prefetch";
import { keys, useModule } from "@/api/queries";
import { Button, FieldProgress, Label, Screen, Stone, T, TabRow } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { Enter, StaggerList, Swap } from "@/motion";
import { openTarget } from "@/nav/targets";
import { Fetched, Group, Pill, StateMark, Tile, TilesSkeleton } from "@/screens/learn/parts";
import { saveLearn, withActivity, withWritten } from "@/study/state";
import { space, useTheme } from "@/theme";

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

type Tab = "read" | "do" | "about";

/** The four steps as small stones in a row: a tick or an open ring, the step, where it stands. */
function Steps({ st }: { st: ModuleStatus }) {
  const c = useTheme();
  return (
    <View testID="module-status" style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {moduleStatusLines(st).map((l) => (
        <View key={l.label} accessible accessibilityLabel={`${l.label}: ${l.value}`} style={{ flexBasis: "47%", flexGrow: 1, backgroundColor: c.card, borderRadius: 18, paddingVertical: space[3], paddingHorizontal: space[3] + 2, flexDirection: "row", alignItems: "center", gap: space[2] + 2 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: l.done ? c.ink : "transparent", borderWidth: l.done ? 0 : 2, borderColor: c.fieldLine, alignItems: "center", justifyContent: "center" }}>{l.done ? <Check size={14} color={c.bg} strokeWidth={3} /> : null}</View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <T v="bodyStrong">{l.label}</T>
            <T v="caption" tone="muted" num>
              {l.value}
            </T>
          </View>
        </View>
      ))}
    </View>
  );
}

export function ModuleBody({ m }: { m: ModuleDetail }) {
  const c = useTheme();
  const qc = useQueryClient();
  const [writing, setWriting] = React.useState(false);
  const [tab, setTab] = React.useState<Tab>("read");
  const [dir, setDir] = React.useState<1 | -1>(1);
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
  const nextId = "sectionId" in m.next ? m.next.sectionId : null;
  const openSection = (s: SectionToc) => go(s.isTest ? `/study/${encodeURIComponent(m.id)}/test` : `/study/${encodeURIComponent(m.id)}/${encodeURIComponent(s.id)}`);
  const todo = m.activities.filter((a) => !a.doneOn).length + (m.writeTask && !m.status.written ? 1 : 0);
  const tabs: { id: Tab; name: string }[] = [
    { id: "read", name: "Read" },
    ...(m.activities.length || m.writeTask ? [{ id: "do" as Tab, name: todo ? `Do · ${todo}` : "Do" }] : []),
    { id: "about", name: "About" },
  ];
  const word = m.next.kind === "test" || m.next.kind === "retest" ? "Take the test" : m.next.kind === "checkpoint" ? "Open the checkpoint" : "Carry on";
  return (
    <>
      {m.next.kind !== "done" ? (
        <Enter i={0}>
          <Group>
            <Label>{word}</Label>
            <Stone testID="module-next" accessibilityLabel={`${word}: ${m.next.label}`} onPress={() => openTarget(m.next.target)}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={20} color={c.onLime} strokeWidth={2.6} />
                </View>
                <T v="h3" style={{ flex: 1 }}>
                  {m.next.label}
                </T>
              </View>
            </Stone>
          </Group>
        </Enter>
      ) : null}
      <Enter i={1}>
        <Steps st={m.status} />
      </Enter>
      <TabRow
        tabs={tabs}
        value={tab}
        onChange={(t) => {
          setDir(tabs.findIndex((x) => x.id === t) >= tabs.findIndex((x) => x.id === tab) ? 1 : -1);
          setTab(t);
        }}
      />
      <Swap k={tab} dir={dir} style={{ gap: space[5] }} testID="module-tab-body">
        {tab === "read" ? (
          <>
            {parts.map((p, i) => (
              <Group key={i}>
                <Label>{p.part ?? "Sections"}</Label>
                <StaggerList style={{ gap: space[2] }}>
                  {p.items.map((s) => (
                    <Tile
                      key={s.id}
                      testID={`section-${s.id}`}
                      title={s.title}
                      accessibilityLabel={`${s.num} ${s.title}${s.doneOn ? ". Read" : ""}`}
                      meta={[s.isTest ? "Module test" : `${Math.max(1, Math.round(s.words / 200))} min read`, s.levelCheck ? "Optional self-check" : s.tag === "extra" ? "Extra reading" : null].filter(Boolean).join(" · ")}
                      lead={<StateMark state={s.doneOn ? "done" : "todo"} n={s.isTest ? "T" : s.num} size={40} />}
                      trailing={s.id === nextId && !s.doneOn ? <Pill tone="ink">Next</Pill> : undefined}
                      plain
                      onPress={() => openSection(s)}
                    />
                  ))}
                </StaggerList>
              </Group>
            ))}
            {m.checkpoints.length ? (
              <Group>
                <Label>Checkpoints</Label>
                <StaggerList style={{ gap: space[2] }}>
                  {m.checkpoints.map((cp) => {
                    const open = cp.status === "ready" || cp.status === "done";
                    return (
                      <Tile
                        key={cp.n}
                        testID={`checkpoint-${cp.n}`}
                        title={cp.title}
                        meta={open ? (cp.status === "done" ? "Done. Tap to try again" : "Ready") : CP_WORD[cp.status]}
                        lead={open ? <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}><Target size={18} color={c.ink} /></View> : <StateMark state="locked" size={40} />}
                        trailing={cp.best !== null && cp.total ? <Pill tone="ink">{`${cp.best} of ${cp.total}`}</Pill> : undefined}
                        quiet={!open}
                        plain
                        onPress={open ? () => router.push(`/study/${encodeURIComponent(m.id)}/checkpoint/${cp.n}`) : () => toast.show("Read the sections it covers first.")}
                      />
                    );
                  })}
                </StaggerList>
              </Group>
            ) : null}
          </>
        ) : null}
        {tab === "do" ? (
          <>
            {m.activities.length ? (
              <Group>
                <Label>Practise this module</Label>
                <StaggerList style={{ gap: space[2] }}>
                  {m.activities.map((a) => (
                    <Tile
                      key={a.id}
                      testID={`activity-${a.id}`}
                      icon={a.doneOn ? undefined : Dumbbell}
                      lead={a.doneOn ? <StateMark state="done" /> : undefined}
                      title={a.title}
                      meta={a.why || undefined}
                      onPress={() => {
                        void saveLearn(qc, (st, today) => withActivity(st, m.id, a.id, today)).then(refresh);
                        openTarget(a.target);
                      }}
                    />
                  ))}
                </StaggerList>
              </Group>
            ) : null}
            {m.writeTask ? (
              <Group>
                <Label action={<T v="caption" tone="muted">On paper, from memory</T>}>Write it out</Label>
                <Stone>
                  <View style={{ gap: space[3] }}>
                    <View style={{ flexDirection: "row", gap: space[3] }}>
                      <PenLine size={20} color={c.ink} style={{ marginTop: 4 }} />
                      <T v="reading" style={{ flex: 1 }}>
                        {m.writeTask}
                      </T>
                    </View>
                    {m.status.written ? <Pill tone="ink" icon={<Check size={12} color={c.bg} strokeWidth={3} />}>Done</Pill> : <Button kind="ink" label="I have done this on paper" busy={writing} onPress={() => void wrote()} testID="module-written" />}
                  </View>
                </Stone>
              </Group>
            ) : null}
          </>
        ) : null}
        {tab === "about" ? (
          <>
            {m.tagline ? <T v="reading">{m.tagline}</T> : null}
            {m.outcomes.length ? (
              <Group>
                <Label>By the end you can</Label>
                <Stone>
                  <View style={{ gap: space[3] }}>
                    {m.outcomes.map((o, i) => (
                      <View key={i} style={{ flexDirection: "row", gap: space[3] }}>
                        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c.bg, alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                          <T v="caption" num>
                            {i + 1}
                          </T>
                        </View>
                        <T style={{ flex: 1 }}>{o}</T>
                      </View>
                    ))}
                  </View>
                </Stone>
              </Group>
            ) : null}
            {m.noteId ? <Tile testID="module-note" icon={NotebookText} title="One-page note for this module" meta="Read it before the test" onPress={() => go(`/notes/${encodeURIComponent(m.noteId!)}`)} /> : null}
          </>
        ) : null}
      </Swap>
      {m.nextModule ? (
        <Group>
          <Label>Next module</Label>
          <Tile testID="module-next-module" quiet title={m.nextModule.title} meta={`Module ${m.nextModule.num}`} lead={<StateMark state="todo" n={m.nextModule.num} />} onPress={() => router.replace(`/study/${encodeURIComponent(m.nextModule!.id)}`)} />
        </Group>
      ) : null}
    </>
  );
}

export function ModuleScreen() {
  const { moduleId = "" } = useLocalSearchParams<{ moduleId: string }>();
  const q = useModule(String(moduleId));
  const m = q.data;
  return (
    <Screen testID="module" title={m?.title} lead={m ? `Module ${m.num} · ${m.when}` : undefined} field={m ? <FieldProgress done={m.status.pct} total={100} label={`${m.status.pct}% done`} /> : undefined} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Fetched q={q} what="this module" skeleton={<TilesSkeleton card rows={5} />}>
        {(x) => <ModuleBody m={x} />}
      </Fetched>
    </Screen>
  );
}
