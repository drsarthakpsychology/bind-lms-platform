import { router, Stack } from "expo-router";
import { Check, Clock, NotebookPen } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type { AssignmentRow, Page } from "@/api/contract";
import { assignmentPageView } from "@/api/adapt-learn";
import { useAssignments } from "@/api/learn";
import { api } from "@/auth";
import { Jyo, Label, QuietEmpty, Screen, Stone, T } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { Enter, StaggerList } from "@/motion";
import { space, useTheme } from "@/theme";
import { Fetched, Group, Pill, Tile, TilesSkeleton } from "./parts";

/**
 * Assignments: the ones to hand in first, each on its own stone with the due
 * date (soonest on top), then those waiting for a mark, then the marked ones
 * with the score. A stone opens the assignment's own page, where it is
 * handed in.
 */

/** "Due today", "Due 24 Nov", "Was due 12 Nov"; null with no due date. */
export function dueWord(at: string | null, now: number): string | null {
  if (!at) return null;
  const t = Date.parse(at);
  if (!Number.isFinite(t)) return null;
  const days = Math.round((t - now) / 86_400_000);
  const date = new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  if (days < 0) return `Was due ${date}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due ${date}`;
}

const openAssignment = (a: AssignmentRow) => router.push(`/assignment/${encodeURIComponent(a.lessonId)}`);

export function AssignmentsBody({ items, now }: { items: AssignmentRow[]; now: number }) {
  const c = useTheme();
  const todo = items.filter((a) => a.status === "not_started").sort((a, b) => (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999") || a.week - b.week);
  const waiting = items.filter((a) => a.status === "submitted");
  const marked = items.filter((a) => a.status === "graded");
  const meta = (a: AssignmentRow) => [`Week ${a.week}`, a.lessonTitle].filter(Boolean).join(" · ");
  if (!items.length) return <QuietEmpty testID="assignments-empty" art={<Jyo pose="resting" size={64} />} title="No assignments yet" body="When a lecture has one, it shows here with its due date." />;
  return (
    <>
      {todo.length ? (
        <Enter i={0}>
          <Group>
            <Label>To hand in</Label>
            <StaggerList style={{ gap: space[2] }}>
              {todo.map((a) => {
                const due = dueWord(a.dueAt, now);
                const late = !!due && due.startsWith("Was");
                return (
                  <Stone key={a.id} testID={`assignment-${a.id}`} accessibilityLabel={`${a.title}. ${meta(a)}${due ? `. ${due}` : ""}. Open to hand in`} onPress={() => openAssignment(a)}>
                    <View style={{ gap: space[3] }}>
                      <View style={{ gap: 2 }}>
                        <T v="h3">{a.title}</T>
                        <T v="small" tone="muted" num>
                          {meta(a)}
                        </T>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }}>
                        {due ? <Pill tone={late || due === "Due today" ? "warm" : "stone"} icon={<Clock size={12} color={c.ink} />}>{due}</Pill> : <Pill>No due date</Pill>}
                        <T v="small" tone="link">
                          Hand in
                        </T>
                      </View>
                    </View>
                  </Stone>
                );
              })}
            </StaggerList>
          </Group>
        </Enter>
      ) : null}
      {waiting.length ? (
        <Enter i={1}>
          <Group>
            <Label>Waiting for a mark</Label>
            <StaggerList style={{ gap: space[2] }}>
              {waiting.map((a) => (
                <Tile key={a.id} testID={`assignment-${a.id}`} icon={NotebookPen} title={a.title} meta={meta(a)} trailing={<Pill>Handed in</Pill>} plain onPress={() => openAssignment(a)} />
              ))}
            </StaggerList>
          </Group>
        </Enter>
      ) : null}
      {marked.length ? (
        <Enter i={2}>
          <Group>
            <Label>Marked</Label>
            <StaggerList style={{ gap: space[2] }}>
              {marked.map((a) => (
                <Tile key={a.id} testID={`assignment-${a.id}`} icon={Check} title={a.title} meta={meta(a)} trailing={<Pill tone="ink">{a.score !== null ? `${a.score} of 100` : "Marked"}</Pill>} plain onPress={() => openAssignment(a)} />
              ))}
            </StaggerList>
          </Group>
        </Enter>
      ) : null}
    </>
  );
}

/** Every assignment, 100 at a time; "Show older" brings the next 100 into the same groups. */
function AllAssignments({ first, now }: { first: Page<AssignmentRow>; now: number }) {
  const m = useMorePages(first, async (cursor) => assignmentPageView(await api.get<unknown>("/assignments", { query: { limit: 100, cursor } })));
  return (
    <>
      <AssignmentsBody items={m.items} now={now} />
      <MoreButton more={m.more} busy={m.busy} error={m.error} onPress={() => void m.loadMore()} testID="assignments-more" />
    </>
  );
}

export function AssignmentsScreen() {
  const q = useAssignments();
  const [now] = React.useState(() => Date.now());
  const todo = (q.data?.items ?? []).filter((a) => a.status === "not_started").length;
  return (
    <Screen testID="assignments" title="Assignments" lead={q.data ? (todo ? `${todo} to hand in` : q.data.items.length ? "All handed in" : undefined) : undefined} gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Fetched q={q} what="your assignments" skeleton={<TilesSkeleton card rows={3} />}>
        {(d) => <AllAssignments first={d} now={now} />}
      </Fetched>
    </Screen>
  );
}
