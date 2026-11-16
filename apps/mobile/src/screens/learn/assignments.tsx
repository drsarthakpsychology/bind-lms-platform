import { router, Stack } from "expo-router";
import { Check, CircleDashed, Clock } from "lucide-react-native";
import * as React from "react";

import type { AssignmentRow, Page } from "@/api/contract";
import { assignmentPageView } from "@/api/adapt-learn";
import { useAssignments } from "@/api/learn";
import { api } from "@/auth";
import { EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen, Section } from "@/ds";
import { MoreButton, useMorePages } from "@/ds/more";
import { space, useTheme } from "@/theme";

/**
 * Assignments: every assignment of your lectures, the ones to hand in first
 * (soonest due date on top), then those waiting for a mark, then the marked
 * ones with the score. A row opens the lecture on its Assignment tab, where
 * it is handed in.
 */

function due(at: string | null, now: number): string | null {
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

export function AssignmentsBody({ items, now }: { items: AssignmentRow[]; now: number }) {
  const c = useTheme();
  const open = (a: AssignmentRow) => router.push(`/lecture/${encodeURIComponent(a.lessonId)}?tab=assignment`);
  const todo = items.filter((a) => a.status === "not_started").sort((a, b) => (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999") || a.week - b.week);
  const waiting = items.filter((a) => a.status === "submitted");
  const marked = items.filter((a) => a.status === "graded");
  const meta = (a: AssignmentRow) => [`Week ${a.week}`, a.lessonTitle, a.status === "not_started" ? due(a.dueAt, now) : null].filter(Boolean).join(" · ");
  if (!items.length) return <EmptyState title="No assignments yet" body="When a lecture has one, it shows here with its due date." testID="assignments-empty" />;
  return (
    <>
      {todo.length ? (
        <Section title="To hand in">
          <RowList>
            {todo.map((a) => (
              <Row key={a.id} testID={`assignment-${a.id}`} title={a.title} meta={meta(a)} icon={<CircleDashed size={20} color={c.muted} />} onPress={() => open(a)} />
            ))}
          </RowList>
        </Section>
      ) : null}
      {waiting.length ? (
        <Section title="Waiting for a mark">
          <RowList>
            {waiting.map((a) => (
              <Row key={a.id} title={a.title} meta={meta(a)} icon={<Clock size={20} color={c.muted} />} trailing="Handed in" onPress={() => open(a)} />
            ))}
          </RowList>
        </Section>
      ) : null}
      {marked.length ? (
        <Section title="Marked">
          <RowList>
            {marked.map((a) => (
              <Row key={a.id} title={a.title} meta={meta(a)} icon={<Check size={20} color={c.ink} />} trailing={a.score !== null ? `${a.score} of 100` : "Marked"} onPress={() => open(a)} />
            ))}
          </RowList>
        </Section>
      ) : null}
    </>
  );
}

/** Every assignment, 100 at a time; "Show older" brings the next 100 into the same sections. */
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
  return (
    <Screen testID="assignments" gap={space[6]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "Assignments" }} />
      <Loaded q={q} what="your assignments" skeleton={<RowsSkeleton rows={4} />}>
        {(d) => <AllAssignments first={d} now={now} />}
      </Loaded>
    </Screen>
  );
}
