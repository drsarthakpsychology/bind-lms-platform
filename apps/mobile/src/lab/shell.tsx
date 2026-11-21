import { router, Stack } from "expo-router";
import { ArrowLeft, ArrowRight, X } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlueField, FieldProgress, Layer, RoundButton, Screen, Stone, T, type ScreenProps } from "@/ds";
import { GrowIn, useStackMotion } from "@/motion";
import { fonts, layout, space, useLightStatusBar, useTheme, type Area } from "@/theme";

/**
 * Shared by the screens built in look B for the Lab, Casebook, Ethics, the
 * mock interview, the self-checks, the calm exercises and Search. These routes
 * are not listed in app/_layout.tsx (the foundation owns that file), so each
 * screen hides the stack header itself and draws its own back button on the
 * field. Nothing here talks to the server.
 */

/** Back to where you came from; a fresh link with nothing behind it lands on `home`. */
export function leave(home = "/practise"): void {
  if (router.canGoBack()) router.back();
  else router.replace(home);
}

/** Hides the stack header for a screen that draws its own. `play` rises from the bottom and has no edge swipe. */
export function OwnHeader({ kind = "push" }: { kind?: "push" | "play" | "overlay" }) {
  const m = useStackMotion();
  return <Stack.Screen options={{ headerShown: false, ...m[kind], ...(kind === "play" ? { gestureEnabled: false } : null) }} />;
}

/** The small bar on the field: a round back button, and at most one thing on the right. */
export function BackBar({ home, right, label = "Back" }: { home?: string; right?: React.ReactNode; label?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: Math.max(layout.gutter, insets.left), paddingRight: Math.max(layout.gutter, insets.right), paddingTop: space[1] }}>
      <RoundButton onField label={label} testID="back" onPress={() => leave(home)}>
        <ArrowLeft size={20} color={c.onField} />
      </RoundButton>
      {right}
    </View>
  );
}

/** A browse or reading screen in look B: the field with back and title, the layer under it. */
export function Page({ home, right, children, ...rest }: Omit<ScreenProps, "top" | "safeTop"> & { home?: string; right?: React.ReactNode }) {
  return (
    <>
      <OwnHeader />
      <Screen safeTop top={<BackBar home={home} right={right} />} gap={space[5]} {...rest}>
        {children}
      </Screen>
    </>
  );
}

/**
 * A focused task (a question set, an exercise): close and progress on the
 * field, the work on the layer, one button pinned at the bottom. Put a
 * `ResultSheet` in `over` and it rises over the button.
 */
export function PlayShell({ title, done, total, field, footer, over, children, onClose, testID, scroll = true }: { title?: string; done?: number; total?: number; field?: React.ReactNode; footer?: React.ReactNode; over?: React.ReactNode; children?: React.ReactNode; onClose?: () => void; testID?: string; scroll?: boolean }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  useLightStatusBar(true);
  return (
    <GrowIn style={{ backgroundColor: c.field }}>
      <OwnHeader kind="play" />
      <View testID={testID} style={{ flex: 1 }}>
        <BlueField>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <RoundButton onField label="Close" testID="close" onPress={onClose ?? (() => leave())}>
              <X size={20} color={c.onField} />
            </RoundButton>
            <View style={{ flex: 1 }}>{total ? <FieldProgress done={done ?? 0} total={total} /> : title ? <T v="bodyStrong" tone="onField" numberOfLines={1}>{title}</T> : null}</View>
          </View>
          {field}
        </BlueField>
        <Layer style={{ paddingHorizontal: 0, paddingTop: 0, gap: 0, overflow: "hidden" }}>
          {scroll ? (
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: layout.gutter, paddingTop: space[5], paddingBottom: space[6], gap: space[4], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
              {children}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, padding: layout.gutter, paddingTop: space[5], gap: space[4] }}>{children}</View>
          )}
          {footer ? (
            <View style={{ paddingHorizontal: layout.gutter, paddingTop: space[3], paddingBottom: insets.bottom + space[3], backgroundColor: c.bg }}>
              <View style={{ width: "100%", maxWidth: layout.readingWidth, alignSelf: "center", gap: space[2] }}>{footer}</View>
            </View>
          ) : null}
        </Layer>
        {over}
      </View>
    </GrowIn>
  );
}

export type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/** The hand-shaped icon patch in an area's quiet wash. */
export function IconPatch({ icon: Icon, area = "practise", size = 48 }: { icon: IconType; area?: Area; size?: number }) {
  const c = useTheme();
  const a = c.areas[area];
  const k = size / 48;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center", backgroundColor: a.wash, borderTopLeftRadius: 22 * k, borderTopRightRadius: 26 * k, borderBottomRightRadius: 23 * k, borderBottomLeftRadius: 25 * k }}>
      <Icon size={Math.round(22 * k)} color={a.deep} strokeWidth={1.9} />
    </View>
  );
}

/**
 * The entry card for one of these features: a stone that grows into the
 * screen it opens. Self-contained, so any hub can drop it in:
 *   <EntryCard testID="entry-lab" icon={FlaskConical} title="Psychology Lab" meta="12 experiments" href="/lab" />
 * `tall` is the half-width shelf (two side by side); the default is one wide row.
 */
export function EntryCard({ title, meta, icon, href, area = "practise", tall, testID }: { title: string; meta?: string; icon: IconType; href: string; area?: Area; tall?: boolean; testID?: string }) {
  const c = useTheme();
  return (
    <Stone testID={testID} accessibilityLabel={meta ? `${title}. ${meta}` : title} grow={() => router.push(href)} style={tall ? { flex: 1 } : undefined}>
      <View style={{ minHeight: tall ? 132 : 0, flexDirection: tall ? "column" : "row", alignItems: tall ? "flex-start" : "center", justifyContent: "space-between", gap: space[3] }}>
        <IconPatch icon={icon} area={area} />
        <View style={{ flex: tall ? undefined : 1, minWidth: 0, gap: 2 }}>
          <T style={{ fontFamily: fonts.h1, fontSize: 19, lineHeight: 23, letterSpacing: -0.2 }}>{title}</T>
          {meta ? (
            <T v="small" tone="muted" num>
              {meta}
            </T>
          ) : null}
        </View>
        {tall ? null : <ArrowRight size={18} color={c.muted} />}
      </View>
    </Stone>
  );
}

/** A small quiet tag ("Foundation", "6 min"). Words, never colour alone. */
export function Tag({ children, onField, onLayer }: { children: string; onField?: boolean; /** Sits straight on the layer, not on a stone. */ onLayer?: boolean }) {
  const c = useTheme();
  return (
    <View style={{ alignSelf: "flex-start", paddingHorizontal: space[2] + 2, paddingVertical: 3, borderRadius: 999, backgroundColor: onField ? c.fieldTint : onLayer ? c.card : c.bg }}>
      <T v="caption" tone={onField ? "onField" : "muted"}>
        {children}
      </T>
    </View>
  );
}
