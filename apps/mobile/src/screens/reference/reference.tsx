import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowRight, Search, TriangleAlert } from "lucide-react-native";
import * as React from "react";
import { Pressable, TextInput, View } from "react-native";

import type { RefEntry, RefIndexItem, RefKind } from "@/api/adapt-learn";
import { useTerm, useTerms } from "@/api/learn";
import { Button, Chips, EmptyState, Loaded, LoadError, Row, RowList, RowsSkeleton, Screen, Section, Sheet, Skeleton, T, Tint, useProgressive } from "@/ds";
import { Enter, Press, Reveal } from "@/motion";
import { Rich } from "@/study/rich";
import { layout, space, type as scale, useTheme } from "@/theme";

/**
 * Quick reference: the website's A to Z of disorders, medicines and terms
 * (/study/reference). Search first, one row of kind chips, then the rows.
 * The whole index is a few hundred short rows, so it is searched on the
 * phone as you type.
 */

const KIND_WORD: Record<RefKind, string> = { disorder: "Disorder", medicine: "Medicine", term: "Term" };
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Rows that match the words, best first: the name, then a name it also goes by, then the summary. */
export function searchRefs(items: RefIndexItem[], words: string, kind: RefKind | "all" = "all"): RefIndexItem[] {
  const q = norm(words);
  const pool = kind === "all" ? items : items.filter((r) => r.kind === kind);
  if (!q) return pool;
  const scored: { r: RefIndexItem; s: number }[] = [];
  for (const r of pool) {
    const label = norm(r.label);
    const aliases = r.aliases.map(norm);
    let s = 0;
    if (label === q || aliases.includes(q)) s = 4;
    else if (label.startsWith(q) || aliases.some((a) => a.startsWith(q))) s = 3;
    else if (label.includes(q) || aliases.some((a) => a.includes(q))) s = 2;
    else if (norm(r.summary).includes(q)) s = 1;
    if (s) scored.push({ r, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.r.label.localeCompare(b.r.label)).map((x) => x.r);
}

/** The entry a glossary word in the text points at, if the index has it. */
export function findRef(items: RefIndexItem[], word: string): RefIndexItem | null {
  const hits = searchRefs(items, word);
  const best = hits[0];
  return best && norm(best.label) === norm(word) ? best : best && best.aliases.map(norm).includes(norm(word)) ? best : (hits.length === 1 ? best : null) ?? null;
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.primary, borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, paddingHorizontal: space[4] }}>
      <Search size={18} color={c.muted} />
      <TextInput
        testID="reference-search"
        value={value}
        onChangeText={onChange}
        placeholder="Search a disorder, medicine or word"
        placeholderTextColor={c.muted}
        accessibilityLabel="Search the Quick reference"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        maxFontSizeMultiplier={1.4}
        style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]}
      />
    </View>
  );
}

export function ReferenceScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = React.useState(typeof params.q === "string" ? params.q : "");
  const [kind, setKind] = React.useState<RefKind | "all">("all");
  const query = useTerms();
  return (
    <Screen testID="reference" gap={space[5]} onRefresh={() => void query.refetch()} refreshing={query.isRefetching}>
      <Stack.Screen options={{ title: "Quick reference" }} />
      <SearchBox value={q} onChange={setQ} />
      <Chips
        scroll
        label="Show"
        options={[
          { id: "all", name: "All" },
          { id: "disorder", name: "Disorders" },
          { id: "medicine", name: "Medicines" },
          { id: "term", name: "Terms" },
        ]}
        value={kind}
        onChange={setKind}
      />
      <Loaded q={query} soon what="the Quick reference" skeleton={<RowsSkeleton rows={8} />}>
        {(d) => {
          const rows = searchRefs(d.items, q, kind);
          if (!rows.length) return <EmptyState mood="missing" title="Nothing by that name" body="Try a shorter word, or the everyday word for it." testID="reference-empty" />;
          // Searching: one plain list, best match first. Browsing: grouped by letter.
          if (q.trim())
            return (
              <RowList still>
                {rows.slice(0, 60).map((r) => (
                  <Row key={r.slug} testID={`ref-${r.slug}`} title={r.label} meta={`${KIND_WORD[r.kind]} · ${r.summary}`} onPress={() => router.push(`/reference/${encodeURIComponent(r.slug)}`)} />
                ))}
              </RowList>
            );
          return <AToZ key={kind} rows={rows} kind={kind} />;
        }}
      </Loaded>
    </Screen>
  );
}

/** Browsing: every entry by letter, drawn a part at a time (the full list is long). */
function AToZ({ rows, kind }: { rows: RefIndexItem[]; kind: string }) {
  const sorted = React.useMemo(() => [...rows].sort((a, b) => a.label.localeCompare(b.label)), [rows]);
  const shown = useProgressive(sorted.length);
  const letters: { letter: string; items: RefIndexItem[] }[] = [];
  for (const r of sorted.slice(0, shown)) {
    const L = /[a-z]/i.test(r.letter) ? r.letter.toUpperCase() : "#";
    const last = letters[letters.length - 1];
    if (last && last.letter === L) last.items.push(r);
    else letters.push({ letter: L, items: [r] });
  }
  return (
    <>
      {letters.map((g) => (
        <Section key={g.letter} title={g.letter} quiet>
          <RowList>
            {g.items.map((r) => (
              <Row key={r.slug} testID={`ref-${r.slug}`} title={r.label} meta={kind === "all" ? `${KIND_WORD[r.kind]} · ${r.summary}` : r.summary} onPress={() => router.push(`/reference/${encodeURIComponent(r.slug)}`)} />
            ))}
          </RowList>
        </Section>
      ))}
    </>
  );
}

/* --------------------------------------------------------------- entry */

function Points({ items }: { items: string[] }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2] }}>
      {items.map((x, i) => (
        <View key={i} style={{ flexDirection: "row", gap: space[3] }}>
          <View style={{ width: 6, height: 6, marginTop: 10, borderRadius: 1, backgroundColor: c.ink }} />
          <Rich text={x} style={{ flex: 1 }} />
        </View>
      ))}
    </View>
  );
}

function Block({ title, children, alert }: { title: string; children: React.ReactNode; alert?: boolean }) {
  const c = useTheme();
  return (
    <Section title={title} action={alert ? <TriangleAlert size={18} color={c.link} /> : undefined}>
      {children}
    </Section>
  );
}

function Pills({ items, onPress }: { items: { key: string; label: string }[]; onPress?: (key: string) => void }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {items.map((x) =>
        onPress ? (
          <Press key={x.key} onPress={() => onPress(x.key)} accessibilityRole="link" style={{ maxWidth: "100%" }} innerStyle={{ minHeight: layout.target, justifyContent: "center", paddingHorizontal: space[4], paddingVertical: space[2], borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card }}>
            <T v="small">{x.label}</T>
          </Press>
        ) : (
          <View key={x.key} style={{ maxWidth: "100%", paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: layout.radius, backgroundColor: c.tint }}>
            <T v="small">“{x.label}”</T>
          </View>
        ),
      )}
    </View>
  );
}

export function EntryBody({ e, labelOf, onOpen }: { e: RefEntry; labelOf: (slug: string) => string | null; onOpen: (path: string) => void }) {
  const c = useTheme();
  const sub = e.kind === "disorder" ? [e.chapter, ...e.aka].filter(Boolean).join(" · ") : e.kind === "medicine" ? e.cls : (e.area ?? "");
  const lead = e.kind === "disorder" ? e.core : e.kind === "medicine" ? (e.plain ?? e.cls) : e.means;
  return (
    <>
      <Enter i={0} style={{ gap: space[2] }}>
        <T v="caption" tone="muted">
          {KIND_WORD[e.kind].toUpperCase()}
        </T>
        <T v="h1">{e.label}</T>
        {sub ? (
          <T v="small" tone="muted">
            {sub}
          </T>
        ) : null}
      </Enter>
      <Enter i={1}>
        <Tint>
          <Rich text={lead} v="reading" />
        </Tint>
      </Enter>
      {e.kind === "disorder" ? (
        <>
          {e.duration ? (
            <T v="bodyStrong">
              How long: <T>{e.duration}</T>
            </T>
          ) : null}
          {e.features.length ? (
            <Block title="Core features">
              <Points items={e.features} />
            </Block>
          ) : null}
          {e.criteria.length ? (
            <Block title="Key criteria">
              <Points items={e.criteria} />
            </Block>
          ) : null}
          {e.lookAlikes.length ? (
            <Block title="Look-alikes" alert>
              <RowList>
                {e.lookAlikes.map((l) => (
                  <Row key={l.name} title={l.name} meta={`How to tell: ${l.tell}`} onPress={l.slug ? () => onOpen(`/reference/${encodeURIComponent(l.slug!)}`) : undefined} chevron={!!l.slug} />
                ))}
              </RowList>
            </Block>
          ) : null}
          {e.firstLine.length ? (
            <Block title="First-line treatment">
              <Points items={e.firstLine} />
              <T v="caption" tone="muted" style={{ marginTop: space[3] }}>
                For learning. Real treatment is decided by the treating clinician.
              </T>
            </Block>
          ) : null}
          {e.noteId ? <Button label="Read the full summary in Notes" icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => onOpen(`/notes/${encodeURIComponent(e.noteId!)}`)} testID="ref-note" /> : null}
        </>
      ) : e.kind === "medicine" ? (
        <>
          {e.mechanism ? (
            <Block title="How it works">
              <Rich text={e.mechanism} v="reading" />
            </Block>
          ) : null}
          {e.uses.length ? (
            <Block title="Main uses">
              <Points items={e.uses} />
            </Block>
          ) : null}
          {e.sideEffects.length ? (
            <Block title="Key side effects">
              <Points items={e.sideEffects} />
            </Block>
          ) : null}
          {e.monitoring.length ? (
            <Block title="Monitoring">
              <Points items={e.monitoring} />
            </Block>
          ) : null}
          <T v="caption" tone="muted">
            For learning, not a prescription. Doses, interactions and the full sources are on the medicine page.
          </T>
          <Button label="Open the full medicine page" icon={<ArrowRight size={20} color={c.onPrimary} />} onPress={() => onOpen(`/medicine/${encodeURIComponent(e.medId)}`)} testID="ref-medicine" />
        </>
      ) : (
        <>
          {e.clinical ? (
            <Block title="Clinically">
              <Rich text={e.clinical} v="reading" />
            </Block>
          ) : null}
          {e.why ? (
            <Block title="Why clinicians use this word">
              <Rich text={e.why} v="reading" />
            </Block>
          ) : null}
          {e.mixup ? (
            <Block title="Often mixed up with" alert>
              <Rich text={e.mixup} v="reading" />
            </Block>
          ) : null}
          {e.hook ? (
            <Block title="Memory hook">
              <Rich text={e.hook} v="reading" />
            </Block>
          ) : null}
          {e.sayings.length ? (
            <Block title="Patients may say">
              <Pills items={e.sayings.map((s) => ({ key: s, label: s }))} />
            </Block>
          ) : null}
          {e.related.length ? (
            <Block title="Related">
              <Pills items={e.related.map((s) => ({ key: s, label: labelOf(s) ?? s.replace(/-/g, " ") }))} onPress={(s) => onOpen(`/reference/${encodeURIComponent(s)}`)} />
            </Block>
          ) : null}
        </>
      )}
    </>
  );
}

export function ReferenceEntryScreen() {
  const { slug = "" } = useLocalSearchParams<{ slug: string }>();
  const q = useTerm(String(slug));
  const index = useTerms();
  const labelOf = React.useCallback((s: string) => index.data?.items.find((r) => r.slug === s)?.label ?? null, [index.data]);
  return (
    <Screen testID="reference-entry" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Stack.Screen options={{ title: "" }} />
      <Loaded q={q} what="this entry" skeleton={<RowsSkeleton rows={5} />}>
        {(e) =>
          e ? (
            <EntryBody e={e} labelOf={labelOf} onOpen={(p) => router.push(p)} />
          ) : (
            <EmptyState mood="missing" title="Not in the Quick reference" body="Search for it by another name." action={{ label: "Search", onPress: () => router.replace(`/reference?q=${encodeURIComponent(String(slug).replace(/-/g, " "))}`) }} />
          )
        }
      </Loaded>
    </Screen>
  );
}

/* ---------------------------------------------------------- word sheet */

/**
 * A glossary word tapped while reading: the short meaning in a sheet, so the
 * place in the text is kept. "Open in the Quick reference" for the rest.
 */
export function TermSheet({ word, onClose }: { word: string | null; onClose: () => void }) {
  const index = useTerms(word !== null);
  const hit = word && index.data ? findRef(index.data.items, word) : null;
  const entry = useTerm(hit?.slug ?? "");
  const open = (path: string) => {
    onClose();
    router.push(path);
  };
  return (
    <Sheet open={word !== null} onClose={onClose} title={hit?.label ?? word ?? ""} testID="term-sheet">
      {index.isError || entry.isError ? (
        <LoadError what="this word" error={index.isError ? index.error : entry.error} onRetry={() => void (index.isError ? index.refetch() : entry.refetch())} />
      ) : !index.data || (hit && !entry.data) ? (
        <View style={{ gap: space[3] }}>
          <Skeleton w="90%" h={18} />
          <Skeleton w="70%" h={18} />
        </View>
      ) : hit && entry.data ? (
        <Reveal style={{ gap: space[4] }}>
          <Rich text={entry.data.kind === "disorder" ? entry.data.core : entry.data.kind === "medicine" ? (entry.data.plain ?? entry.data.cls) : entry.data.means} v="reading" />
          {entry.data.kind === "term" && entry.data.clinical ? <Rich text={entry.data.clinical} tone="muted" /> : null}
          <Button kind="quiet" label="Open in the Quick reference" onPress={() => open(`/reference/${encodeURIComponent(hit.slug)}`)} testID="term-open" />
        </Reveal>
      ) : (
        <View style={{ gap: space[4] }}>
          <T tone="muted">This word is not in the Quick reference yet.</T>
          <Pressable accessibilityRole="button" onPress={() => open(`/reference?q=${encodeURIComponent(word ?? "")}`)} style={{ minHeight: layout.target, justifyContent: "center" }}>
            <T tone="link">Search the Quick reference</T>
          </Pressable>
        </View>
      )}
    </Sheet>
  );
}
