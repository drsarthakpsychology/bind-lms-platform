import { router } from "expo-router";
import { Search } from "lucide-react-native";
import * as React from "react";
import { TextInput, View } from "react-native";

import { useMedicines } from "@/api/queries";
import { Chips, EmptyState, Loaded, Row, RowList, RowsSkeleton, Screen, T } from "@/ds";
import { TabTop } from "@/nav/top";
import { layout, space, type as scale, useTheme } from "@/theme";

/**
 * Library: the medicine library. Search first, one row of class chips,
 * then every medicine as a row (name, class and key dose). All visible;
 * nothing is cut.
 */
export function LibraryScreen() {
  const c = useTheme();
  const [q, setQ] = React.useState("");
  const [cls, setCls] = React.useState("all");
  const query = useMedicines(q.trim(), cls === "all" ? "" : cls);
  const classes = query.data?.classes ?? [];
  return (
    <Screen tab top={<TabTop />} title="Medicines" testID="library" gap={space[5]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.primary, borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, paddingHorizontal: space[4] }}>
        <Search size={18} color={c.muted} />
        <TextInput testID="library-search" value={q} onChangeText={setQ} placeholder="Search by name or brand" placeholderTextColor={c.muted} accessibilityLabel="Search medicines" autoCorrect={false} autoCapitalize="none" returnKeyType="search" maxFontSizeMultiplier={1.4} style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]} />
      </View>
      {classes.length ? <Chips label="Class" options={[{ id: "all", name: "All" }, ...classes.map((x) => ({ id: x, name: x }))]} value={cls} onChange={setCls} /> : null}
      <Loaded q={query} soon what="the medicine library" skeleton={<RowsSkeleton rows={8} />}>
        {(d) =>
          d.items.length ? (
            <>
              <T v="small" tone="muted" num>
                {d.items.length} medicine{d.items.length === 1 ? "" : "s"}
              </T>
              <RowList>
                {d.items.map((m) => (
                  <Row key={m.id} testID={`med-${m.id}`} title={m.name} meta={`${m.className} · ${m.keyDose}`} onPress={() => router.push(`/medicine/${encodeURIComponent(m.id)}`)} />
                ))}
              </RowList>
            </>
          ) : (
            <EmptyState mood="puzzled" title="No medicine by that name" body="Check the spelling, or try the brand name." testID="library-empty" />
          )
        }
      </Loaded>
    </Screen>
  );
}
