import { router } from "expo-router";
import * as React from "react";
import { useQueries } from "@tanstack/react-query";

import { Chips, EmptyState, Row, RowList, RowsSkeleton, Screen, Section } from "@/ds";
import { useTheme } from "@/theme";
import { api } from "@/auth";
import { CASE_TOOLS } from "../catalog";
import type { CaseMark, PractiseTool } from "../contract";
import { API_TOOL, arrange, buildDefs } from "../tools/engine";
import { EntryIcon } from "../icons";
import { Tag } from "../parts";

/** The tools with a case library (Done, New, This week). */
const TOOLS = CASE_TOOLS.filter((t) => t.kind === "tool" && t.toolId && ["wwyd", "two-minute", "landmark", "osce", "formulation"].includes(t.toolId));
type Filter = "all" | "started" | "new" | "week" | "done";

/**
 * Every case in one list, by tool, each with one tag: Carry on, New, This
 * week or Done. Half-finished cases come first.
 */
export function CaseLibrary() {
  const c = useTheme();
  const [filter, setFilter] = React.useState<Filter>("all");
  const qs = useQueries({ queries: TOOLS.map((t) => ({ queryKey: ["practise", "tool", API_TOOL[t.toolId!]], queryFn: () => api.get<PractiseTool>(`/practise/tools/${API_TOOL[t.toolId!]}`), staleTime: 30_000 })) });
  const loading = qs.some((q) => q.isLoading);
  const rows = TOOLS.flatMap((t, i) => {
    const d = qs[i]?.data;
    if (!d) return [];
    return arrange(buildDefs(t.toolId!, d.data), d.cases).map(({ def, mark }) => ({ id: def.id, title: def.title, line: def.line, mark: (mark ?? "new") as CaseMark, tool: t }));
  });
  const shown = rows.filter((r) => filter === "all" || r.mark === filter);
  const carry = rows.filter((r) => r.mark === "started");
  const open = (toolHref: string, id: string) => router.push(`${toolHref}?item=${encodeURIComponent(id)}`);
  return (
    <Screen testID="case-library" title="All cases" lead="Every case, with what you have done and what is new.">
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
