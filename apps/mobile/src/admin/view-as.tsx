import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { onSignedOut } from "@/auth";
import { T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { createStore } from "@/lib/store";
import { layout, space, useTheme } from "@/theme";

/**
 * "View as student": an admin opens the student tabs to see VIBHA the way
 * students see it (the website's setViewMode("student")). The app keeps the
 * admin signed in; a small bar above the tab bar leads back.
 */
export const viewAsStore = createStore<{ on: boolean }>({ on: false });
onSignedOut(() => viewAsStore.set({ on: false }));

export function startViewAs(): void {
  haptic.select();
  viewAsStore.set({ on: true });
  router.replace("/home");
}

export function stopViewAs(): void {
  haptic.select();
  viewAsStore.set({ on: false });
  router.replace("/admin/home");
}

export const useViewingAsStudent = () => viewAsStore.use((s) => s.on);

/** The bar shown over the student screens while an admin is looking. */
export function ViewAsBar({ visible }: { visible: boolean }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  if (!visible) return null;
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + 72, alignItems: "center", paddingHorizontal: layout.gutter }}>
      <Pressable
        testID="view-as-back"
        accessibilityRole="button"
        accessibilityLabel="Viewing as a student. Back to admin"
        onPress={stopViewAs}
        style={({ pressed }) => ({ minHeight: layout.target, flexDirection: "row", alignItems: "center", gap: space[2], borderRadius: 24, paddingHorizontal: space[4], backgroundColor: c.band, opacity: pressed ? 0.85 : 1 })}
      >
        <Eye size={18} color={c.onBand} />
        <T v="small" tone="onBand">
          Viewing as a student
        </T>
        <T v="small" style={{ color: c.dark ? c.brand : c.primary, textDecorationLine: "underline" }}>
          Back to admin
        </T>
      </Pressable>
    </View>
  );
}
