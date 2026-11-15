import { router } from "expo-router";
import * as React from "react";
import { useQueries } from "@tanstack/react-query";

import { Chips, EmptyState, Row, RowList, RowsSkeleton, Screen, Section } from "@/ds";
import { useTheme } from "@/theme";
import { play } from "../api";
import { CASE_TOOLS } from "../catalog";
import { EntryIcon } from "../icons";
import { Tag } from "../parts";
import type { CaseMark, ToolList } from "../types";

const TOOLS = CASE_TOOLS.filter((t) => t.kind === "tool");
type Filter = "all" | "started" | "new" | "week" | "done";

/**
 * Every case in one list, by tool, each with one tag: Carry on, New, This
 * week or Done. Half-finished cases come first.
 */
export function CaseLibrary() {
  const c = useTheme();
  const [filter, setFilter] = React.useState<Filter>("all");
  const qs = useQueries({ queries: TOOLS.map((t) => ({ queryKey: ["play", "tool", "list", t.toolId], queryFn: () => play<ToolList>("tool", "list", t.toolId) })) });
  const loading = qs.some((q) => q.isLoading);
  const rows = TOOLS.flatMap((t, i) => (qs[i]?.data?.items ?? []).map((it) => ({ ...it, tool: t })));
  const shown = rows.filter((r) => filter === "all" || r.mark === filter);
  const carry = rows.filter((r) => r.mark === "started");
  const open = (toolHref: string, id: string) => router.push(`${toolHref}?item=${encodeURIComponent(id)}`);
  const count = (m: CaseMark) => rows.filter((r) => r.mark === m).length;
  return (
    <Screen testID="case-library" title="All cases" lead={loading ? undefined : `${rows.length} cases · ${count("done")} done · ${count("new")} new`}>
      <Chips
        scroll
        label="Show"
        value={filter}
        onChange={setFilter}
        options={[
          { id: "all", name: "All" },
          { id: "started", name: `Carry on${carry.length ? ` ${carry.length}` : ""}` },
          { id: "new", name: "New" },
          { id: "week", name: "This week" },
          { id: "done", name: "Done" },
        ]}
      />
      {loading ? <RowsSkeleton rows={8} /> : null}
      {!loading && filter === "all" && carry.length ? (
        <Section title="Carry on">
          <RowList>
            {carry.map((r) => (
              <Row key={`${r.tool.id}-${r.id}`} title={r.title} meta={r.tool.title} icon={<EntryIcon icon={r.tool.icon} color={c.muted} />} trailing={<Tag tag="started" />} onPress={() => open(r.tool.href, r.id)} />
            ))}
          </RowList>
        </Section>
      ) : null}
      {!loading
        ? TOOLS.map((t) => {
            const mine = shown.filter((r) => r.tool.id === t.id);
            if (!mine.length) return null;
            return (
              <Section key={t.id} title={t.title}>
                <RowList>
                  {mine.map((r) => (
                    <Row key={r.id} testID={`library-${t.id}-${r.id}`} title={r.title} meta={r.line ?? undefined} trailing={<Tag tag={r.mark} />} onPress={() => open(t.href, r.id)} />
                  ))}
                </RowList>
              </Section>
            );
          })
        : null}
      {!loading && !shown.length ? <EmptyState mood="sleepy" title={filter === "done" ? "Nothing done yet" : "Nothing here"} body={filter === "started" ? "Cases you leave half way show up here." : "Try another filter."} /> : null}
    </Screen>
  );
}
