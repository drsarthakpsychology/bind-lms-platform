import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useMedicine } from "@/api/queries";
import { Loaded, RowsSkeleton, Screen, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Rich } from "@/study/rich";
import { layout, space, useTheme } from "@/theme";

/** A medicine page: editorial, with a section index in one row that jumps to each part. */
export function MedicineScreen() {
  const c = useTheme();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const q = useMedicine(String(id));
  const [focus, setFocus] = React.useState<string | null>(null);
  return (
    <Screen testID="medicine">
      <Loaded q={q} soon what="this medicine" skeleton={<RowsSkeleton rows={6} />}>
        {(m) => (
          <>
            <View style={{ gap: space[2] }}>
              <T v="small" tone="muted">
                {m.className}
              </T>
              <T v="h1">{m.name}</T>
              {m.brands.length ? (
                <T v="small" tone="muted">
                  Brands: {m.brands.join(", ")}
                </T>
              ) : null}
            </View>
            <Rich text={m.summary} v="reading" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space[2] }} accessibilityLabel="Sections of this page">
              {m.sections.map((s) => (
                <Pressable
                  key={s.id}
                  accessibilityRole="button"
                  onPress={() => {
                    haptic.select();
                    setFocus(focus === s.id ? null : s.id);
                  }}
                  style={{ minHeight: layout.target, justifyContent: "center" }}
                >
                  <View style={{ minHeight: 36, paddingHorizontal: space[4], justifyContent: "center", borderRadius: 18, borderWidth: 1.5, borderColor: focus === s.id ? c.ink : c.cardLine, backgroundColor: focus === s.id ? c.ink : "transparent" }}>
                    <T v="small" style={{ color: focus === s.id ? c.bg : c.ink }}>
                      {s.title}
                    </T>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            {m.sections
              .filter((s) => !focus || s.id === focus)
              .map((s) => (
                <View key={s.id} style={{ gap: space[3] }} testID={`med-section-${s.id}`}>
                  <T v="h3">{s.title}</T>
                  {s.points.map((p, i) => (
                    <View key={i} style={{ flexDirection: "row", gap: space[3] }}>
                      <T v="reading" tone="muted">
                        •
                      </T>
                      <Rich text={p} v="reading" style={{ flex: 1 }} />
                    </View>
                  ))}
                </View>
              ))}
          </>
        )}
      </Loaded>
    </Screen>
  );
}
