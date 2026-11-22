import type { UseQueryResult } from "@tanstack/react-query";
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { isClosed, reasonOf } from "@/api/errors";
import { Button, Label, RowList, RowsSkeleton, StillTrying, Stone, T } from "@/ds";
import { LoadSwap, RollingNumber, useFill } from "@/motion";
import { fonts, layout, space, useTheme, type Area } from "@/theme";

/**
 * Local parts for the Me area (docs/DESIGN.md, the Layers look). They are
 * built from the kit only; nothing here adds a colour, a radius or a spring.
 *
 *   Load        loading, error and content, with a quiet error (never a sticker)
 *   QuietError  "Could not load ..." on an outlined stone, with Try again
 *   Group       a quiet heading over one stone that holds rows
 *   IconPatch   an icon on a small area-wash patch
 *   Tile        a stone you tap as a whole, for a two-column shelf
 *   StatStone   one number with its label on a stone
 *   Avatar      initials on a round patch
 *   Rise        a bar that grows up from its base (podium, day bars)
 */

/** A failed load, said calmly: what failed, why, and one way forward. Never a picture. */
export function QuietError({ what = "this", error, onRetry }: { what?: string; error?: unknown; onRetry: () => void }) {
  return (
    <Stone quiet pad={space[5]} testID="load-error">
      <View accessibilityRole="alert" style={{ gap: space[1] }}>
        <T v="h2">{`Could not load ${what}`}</T>
        <T v="small" tone="muted">
          {reasonOf(error)}
        </T>
      </View>
      <Button kind="quiet" full={false} label="Try again" onPress={onRetry} style={{ marginTop: space[4] }} testID="load-retry" />
    </Stone>
  );
}

/** One calm stone for "not open", "offline", "nothing here". */
export function QuietNote({ title, body, action, testID }: { title: string; body?: string; action?: { label: string; onPress: () => void }; testID?: string }) {
  return (
    <Stone quiet pad={space[5]} testID={testID}>
      <View style={{ gap: space[1] }}>
        <T v="h2">{title}</T>
        {body ? (
          <T v="small" tone="muted">
            {body}
          </T>
        ) : null}
      </View>
      {action ? <Button kind="quiet" full={false} label={action.label} onPress={action.onPress} style={{ marginTop: space[4] }} /> : null}
    </Stone>
  );
}

/**
 * Loading, error and content for one server answer. Same timing as the kit's
 * `Loaded` (a skeleton only after 120ms, then at least 380ms, then the content
 * rises in), but a failure is a quiet stone, never a sticker.
 */
export function Load<D>({ q, skeleton, what, children }: { q: UseQueryResult<D>; skeleton?: React.ReactNode; what?: string; children: (data: D) => React.ReactNode }) {
  const waiting = q.data === undefined && !q.isError && q.fetchStatus === "paused";
  let body: React.ReactNode = null;
  if (q.data !== undefined) body = children(q.data);
  else if (waiting) body = <QuietNote testID="waiting-online" title="This opens when you are back online" body="Everything you opened before is saved on this phone." action={{ label: "Try now", onPress: () => void q.refetch() }} />;
  else if (q.isError) body = isClosed(q.error) ? <QuietNote testID="closed" title="Not open for your account" body="This part of VIBHA is not switched on for you yet." /> : <QuietError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  return (
    <LoadSwap
      ready={q.data !== undefined || q.isError || waiting}
      skeleton={
        <View style={{ gap: space[3] }}>
          {skeleton ?? <RowsSkeleton />}
          <StillTrying failed={q.failureCount > 0} />
        </View>
      }
    >
      {body}
    </LoadSwap>
  );
}

/** A quiet heading over one stone that holds rows (a settings group, a short list). */
export function Group({ title, action, children, still, testID, note }: { title?: string; action?: React.ReactNode; children?: React.ReactNode; /** No row motion. */ still?: boolean; testID?: string; /** One muted line under the stone. */ note?: string }) {
  return (
    <View testID={testID} style={{ gap: space[2] }}>
      {title ? <Label action={action}>{title}</Label> : null}
      <Stone pad={0} style={{ paddingHorizontal: space[4], paddingVertical: space[1] }}>
        <RowList bare still={still}>
          {children}
        </RowList>
      </Stone>
      {note ? (
        <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
          {note}
        </T>
      ) : null}
    </View>
  );
}

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

/** An icon on a small soft patch in one area's colour family. Never a whole card. */
export function IconPatch({ icon: Icon, area = "me", size = 40 }: { icon: IconType; area?: Area; size?: number }) {
  const c = useTheme();
  const a = c.areas[area];
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: size, height: size, borderRadius: Math.round(size * 0.36), backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
      <Icon size={Math.round(size * 0.5)} color={a.deep} strokeWidth={2} />
    </View>
  );
}

/** A stone tapped as a whole, for a two-column shelf: icon patch, name, one quiet line. It grows into the screen it opens. */
export function Tile({ title, meta, icon, area, open, badge, testID }: { title: string; meta?: string; icon: IconType; area?: Area; /** Pass the `router.push`. */ open: () => void; /** A small lime count (unread). */ badge?: number; testID?: string }) {
  const c = useTheme();
  return (
    <Stone grow={open} testID={testID} accessibilityLabel={[title, meta, badge ? `${badge} new` : null].filter(Boolean).join(". ")} style={{ flexBasis: "47%", flexGrow: 1 }}>
      <View style={{ gap: space[3], minHeight: 92 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <IconPatch icon={icon} area={area} />
          {badge ? (
            <View style={{ minWidth: 24, height: 24, borderRadius: 12, paddingHorizontal: 7, backgroundColor: c.lime, alignItems: "center", justifyContent: "center" }}>
              <T v="caption" num style={{ color: c.onLime, fontFamily: fonts.bold }}>
                {badge > 99 ? "99+" : badge}
              </T>
            </View>
          ) : null}
        </View>
        <View style={{ gap: 2 }}>
          <T v="bodyStrong" numberOfLines={1}>
            {title}
          </T>
          {meta ? (
            <T v="small" tone="muted" numberOfLines={2}>
              {meta}
            </T>
          ) : null}
        </View>
      </View>
    </Stone>
  );
}

/** One number with its label on a stone. A plain number rolls into place; anything else is shown as written. */
export function StatStone({ value, label, sub, testID }: { value: string; label: string; sub?: string | null; testID?: string }) {
  const frac = /^(\d+)\/(\d+)$/.exec(value);
  const plain = /^(\d{1,3}(?:,\d{3})*|\d+)(\D{0,3})$/.exec(value);
  return (
    <Stone testID={testID} style={{ flexBasis: "30%", flexGrow: 1 }} pad={space[3]}>
      <View accessible accessibilityLabel={`${label}: ${value}${sub ? `, ${sub}` : ""}`} style={{ gap: 2 }}>
        {frac ? (
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <RollingNumber v="h2" value={Number(frac[1])} />
            <T v="small" tone="muted" num style={{ paddingBottom: 2 }}>
              {` of ${frac[2]}`}
            </T>
          </View>
        ) : plain ? (
          <RollingNumber v="h2" value={Number((plain[1] ?? "0").replace(/,/g, ""))} suffix={plain[2] ?? ""} format={plain[1]?.includes(",") ? (n) => n.toLocaleString("en-IN") : undefined} />
        ) : (
          <T v="h2" num numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </T>
        )}
        <T v="caption" tone="muted">
          {label}
        </T>
        {sub ? (
          <T v="caption" tone="muted" style={{ fontFamily: fonts.medium }}>
            {sub}
          </T>
        ) : null}
      </View>
    </Stone>
  );
}

/** "Ananya Mehta" gives "AM". */
export function initials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
}

/** Initials on a round patch. On the field it is a soft see-through disc; on a layer an area wash. */
export function Avatar({ name, size = 56, onField }: { name: string | null | undefined; size?: number; onField?: boolean }) {
  const c = useTheme();
  const a = c.areas.me;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: onField ? c.fieldTint : a.wash, alignItems: "center", justifyContent: "center" }}>
      <T maxFontSizeMultiplier={1.1} style={{ fontFamily: fonts.display, fontSize: Math.round(size * 0.38), lineHeight: Math.round(size * 0.46), color: onField ? c.onField : a.deep }}>
        {initials(name) || "V"}
      </T>
    </View>
  );
}

/** A bar that grows up from its base on arrival (transform only), a little after the one before it. */
export function Rise({ h, i = 0, color, radius = 4, style, children }: { h: number; i?: number; color: string; radius?: number; style?: StyleProp<ViewStyle>; children?: React.ReactNode }) {
  const fill = useFill(100, 150 + i * 30);
  const grow = useAnimatedStyle(() => ({ transform: [{ scaleY: fill.value }] }));
  return <Animated.View style={[{ height: h, borderRadius: radius, backgroundColor: color, transformOrigin: "bottom" }, style, grow]}>{children}</Animated.View>;
}

/** A skeleton in the shape of a hub: one big stone, a row of three, then rows. */
export function HubSkeleton() {
  const c = useTheme();
  return (
    <View accessibilityRole="progressbar" accessibilityLabel="Loading" style={{ gap: space[4] }}>
      <View style={{ height: 132, borderRadius: layout.radiusLg, backgroundColor: c.skeleton }} />
      <View style={{ flexDirection: "row", gap: space[3] }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1, height: 76, borderRadius: layout.radiusLg, backgroundColor: c.skeleton }} />
        ))}
      </View>
      <RowsSkeleton rows={3} />
    </View>
  );
}
