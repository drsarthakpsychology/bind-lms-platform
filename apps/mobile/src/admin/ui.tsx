/**
 * The admin side's own frame, on the Layers kit (docs/DESIGN.md, "Admin list"
 * and "Admin control screen"). The admin is a supervisory tool, so it is
 * calmer and denser than the student side: no blue field, a compact bar with
 * the title and who you are, stone panels of tight rows, numbers that line up.
 * No Jyo and no stickers anywhere here.
 *
 * Screen       the admin page: bar (back, title, role), view-only and test-mode strips
 * Panel        a stone that holds dense rows
 * Tile, Tiles  the numbers that matter, each one opens its list
 * Locked       a write control shown locked, with one line saying why (view-only admins)
 * EmptyState, LoadError, Loaded   the plain ones (no sticker)
 * MockNote     marks a screen whose numbers are sample data
 */
import type { UseQueryResult } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { ArrowLeft, Bell, FlaskConical, Inbox, Lock, Search } from "lucide-react-native";
import * as React from "react";
import { Switch, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiFailure, isClosed, reasonOf } from "@/api/errors";
import { useMe } from "@/api/queries";
import { Button, ComingSoon, RowList, RowsSkeleton, Screen as DsScreen, StillTrying, T, WaitingForInternet, type ScreenProps } from "@/ds";
import { haptic } from "@/lib/haptics";
import { LoadSwap, Press } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { useAdminRole, VIEW_ONLY_LINE } from "./role";
import { useTestMode } from "./test-mode";

/* ------------------------------------------------------------------ bar */

function BarButton({ label, onPress, children, dot, testID }: { label: string; onPress: () => void; children: React.ReactNode; dot?: boolean; testID?: string }) {
  const c = useTheme();
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} squish scale={0.9} hitSlop={4} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }} innerStyle={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.card, alignItems: "center", justifyContent: "center" }}>
      {children}
      {dot ? <View style={{ position: "absolute", top: 8, right: 8, width: 9, height: 9, borderRadius: 5, backgroundColor: c.lime, borderWidth: 1.5, borderColor: c.ink }} /> : null}
    </Press>
  );
}

/** Go back, or to admin Home when this screen was opened cold (a notification, a link). */
export function adminBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/admin/home");
}

/** Who you are, always in the bar: an ink pill for the Super Admin, a locked stone pill for view-only. */
export function RolePill() {
  const c = useTheme();
  const { viewOnly, roleLabel } = useAdminRole();
  if (!roleLabel) return null;
  return (
    <View testID="role-pill" accessible accessibilityLabel={viewOnly ? "View only access" : "Super Admin"} style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: space[2], paddingVertical: 3, backgroundColor: viewOnly ? c.card : c.ink }}>
      {viewOnly ? <Lock size={12} color={c.muted} strokeWidth={2.2} /> : null}
      <T v="caption" tone={viewOnly ? "muted" : "onInk"} maxFontSizeMultiplier={1.2}>
        {viewOnly ? "View only" : "Admin"}
      </T>
    </View>
  );
}

function Bar({ title, lead, tab, back, right }: { title?: string; lead?: string; tab?: boolean; back?: boolean; right?: React.ReactNode }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const unread = me.data?.unreadNotifications ?? 0;
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: c.bg }}>
      <View style={{ minHeight: 56, paddingLeft: Math.max(tab || !back ? layout.gutter : space[3], insets.left), paddingRight: Math.max(space[3], insets.right), paddingTop: space[1], flexDirection: "row", alignItems: "center", gap: space[2] }}>
        {!tab && back ? (
          <BarButton label="Back" onPress={adminBack} testID="admin-back">
            <ArrowLeft size={20} color={c.ink} />
          </BarButton>
        ) : null}
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            {title ? (
              <T v={tab ? "h1" : "h2"} numberOfLines={2} style={{ flexShrink: 1 }}>
                {title}
              </T>
            ) : null}
            {tab ? <RolePill /> : null}
          </View>
          {lead ? (
            <T v="small" tone="muted" num>
              {lead}
            </T>
          ) : null}
        </View>
        {right}
        {tab ? (
          <>
            <BarButton label="Search students, people and cohorts" onPress={() => router.push("/admin/search")} testID="top-search">
              <Search size={20} color={c.ink} />
            </BarButton>
            <BarButton label={unread ? `Notifications, ${unread} unread` : "Notifications"} onPress={() => router.push("/notifications")} dot={unread > 0} testID="top-bell">
              <Bell size={20} color={c.ink} />
            </BarButton>
          </>
        ) : null}
      </View>
      <Strips />
    </View>
  );
}

/** The two standing lines under the bar: view-only, and test mode. Each says what it means for what you do here. */
function Strips() {
  const c = useTheme();
  const { viewOnly } = useAdminRole();
  const test = useTestMode() === "admin";
  if (!viewOnly && !test) return null;
  return (
    <View style={{ paddingHorizontal: layout.gutter, paddingTop: space[2], gap: space[2] }}>
      {test ? (
        <Press testID="test-strip" accessibilityRole="button" accessibilityLabel="Test mode is on. Nothing you send reaches real students. Open test mode" onPress={() => router.push("/admin/test-mode")} innerStyle={{ flexDirection: "row", alignItems: "center", gap: space[2], borderRadius: 12, paddingHorizontal: space[3], minHeight: 36, backgroundColor: c.warnBg }}>
          <FlaskConical size={16} color={c.warnFg} />
          <T v="caption" style={{ color: c.warnFg, flex: 1 }}>
            Test mode is on. Nothing you send reaches real students.
          </T>
        </Press>
      ) : null}
      {viewOnly ? (
        <View testID="view-only-note" accessible accessibilityLabel="View only. You can see everything. Changes are locked." style={{ flexDirection: "row", alignItems: "center", gap: space[2], borderRadius: 12, paddingHorizontal: space[3], minHeight: 36, backgroundColor: c.card }}>
          <Lock size={16} color={c.muted} />
          <T v="caption" tone="muted" style={{ flex: 1 }}>
            View only. You can see everything. Changes are locked.
          </T>
        </View>
      ) : null}
    </View>
  );
}

export type AdminScreenProps = Omit<ScreenProps, "plain" | "field" | "top" | "area"> & {
  /** No back button (the screen is a tab, or it draws its own way out). Default: back is shown on screens that are not tabs. */
  back?: boolean;
  /** One or two round buttons at the right of the bar. */
  right?: React.ReactNode;
};

/**
 * Every admin screen sits in this. All layer, no field. The bar is pinned:
 * back, the title, the role; on a tab also search and the bell.
 */
export function Screen({ title, lead, tab, back = true, right, gap = space[5], children, ...rest }: AdminScreenProps) {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <DsScreen plain tab={tab} gap={gap} top={<Bar title={title} lead={lead} tab={tab} back={back} right={right} />} {...rest}>
        {children}
      </DsScreen>
    </>
  );
}

/** A round button for the bar's right side. */
export function BarAction({ label, onPress, icon: Icon, testID }: { label: string; onPress: () => void; icon: React.ComponentType<{ size?: number; color?: string }>; testID?: string }) {
  const c = useTheme();
  return (
    <BarButton label={label} onPress={onPress} testID={testID}>
      <Icon size={20} color={c.ink} />
    </BarButton>
  );
}

/* --------------------------------------------------------------- panels */

/** A stone that holds dense rows (or anything else). 18px corners: it is a small thing, and there are many on a screen. */
export function Panel({ children, rows, style, testID }: { children?: React.ReactNode; /** The children are Rows: hairlines between them. */ rows?: boolean; style?: StyleProp<ViewStyle>; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={[{ borderRadius: layout.radius, backgroundColor: c.card, paddingHorizontal: space[4], paddingVertical: rows ? space[1] : space[4] }, style]}>
      {rows ? <RowList bare>{children}</RowList> : children}
    </View>
  );
}

/** A quiet heading over a panel, with an optional count and one link. */
export function Head({ children, count, action }: { children: string; count?: number; action?: { label: string; onPress: () => void; testID?: string } }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: 24, paddingHorizontal: space[1] }}>
      <T v="label" tone="muted" accessibilityRole="header">
        {children}
      </T>
      {count ? (
        <T v="label" num>
          {count}
        </T>
      ) : null}
      <View style={{ flex: 1 }} />
      {action ? (
        <Press testID={action.testID} accessibilityRole="link" accessibilityLabel={action.label} onPress={action.onPress} hitSlop={12} style={{ minHeight: 24, justifyContent: "center" }}>
          <T v="small" tone="link">
            {action.label}
          </T>
        </Press>
      ) : null}
    </View>
  );
}

/** A group: its heading and what is under it, tight. */
export function Group({ title, count, action, children, testID }: { title: string; count?: number; action?: { label: string; onPress: () => void; testID?: string }; children?: React.ReactNode; testID?: string }) {
  return (
    <View testID={testID} style={{ gap: space[2] }}>
      <Head count={count} action={action}>
        {title}
      </Head>
      {children}
    </View>
  );
}

export type TileItem = { value: number; label: string; suffix?: string; onPress?: () => void; tone?: "plain" | "warn"; testID?: string };

/** One number that matters. It rolls in once and opens its list. */
export function Tile({ value, label, suffix, onPress, tone = "plain", testID }: TileItem) {
  const c = useTheme();
  const face: ViewStyle = { flex: 1, minHeight: 76, borderRadius: layout.radius, backgroundColor: tone === "warn" && value > 0 ? c.warnBg : c.card, paddingHorizontal: space[3], paddingVertical: space[3], justifyContent: "space-between" };
  const body = (
    <>
      {/* Still: admin numbers do not move (docs/DESIGN.md, motion rule 5). */}
      <T v="h2" num style={tone === "warn" && value > 0 ? { color: c.warnFg } : undefined}>
        {value.toLocaleString("en-IN")}
        {suffix ?? ""}
      </T>
      <T v="caption" tone="muted" style={tone === "warn" && value > 0 ? { color: c.warnFg } : undefined}>
        {label}
      </T>
    </>
  );
  if (!onPress)
    return (
      <View testID={testID} accessible accessibilityLabel={`${value}${suffix ?? ""} ${label}`} style={face}>
        {body}
      </View>
    );
  return (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={`${value}${suffix ?? ""} ${label}`} onPress={onPress} style={{ flex: 1 }} innerStyle={face}>
      {body}
    </Press>
  );
}

/** Tiles in rows of `per` (2 or 3). */
export function Tiles({ items, per = 3 }: { items: TileItem[]; per?: 2 | 3 }) {
  const lines: TileItem[][] = [];
  for (let i = 0; i < items.length; i += per) lines.push(items.slice(i, i + per));
  return (
    <View style={{ gap: space[2] }}>
      {lines.map((line, i) => (
        <View key={i} style={{ flexDirection: "row", gap: space[2] }}>
          {line.map((t) => (
            <Tile key={t.label} {...t} />
          ))}
          {line.length < per ? Array.from({ length: per - line.length }, (_, k) => <View key={k} style={{ flex: 1 }} />) : null}
        </View>
      ))}
    </View>
  );
}

/** A flat bar for a share (0 to 100) with its number at the right. Still: admin numbers do not move. */
export function ShareBar({ pct, label, tone = "plain" }: { pct: number; label?: string; tone?: "plain" | "warn" }) {
  const c = useTheme();
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label ?? `${p} percent`} accessibilityValue={{ min: 0, max: 100, now: p }} style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
      <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c.hairline, overflow: "hidden" }}>
        <View style={{ width: `${p}%`, height: "100%", borderRadius: 3, backgroundColor: tone === "warn" ? c.warn : c.ink }} />
      </View>
      <T v="caption" num style={{ minWidth: 36, textAlign: "right" }}>
        {p}%
      </T>
    </View>
  );
}

/* ---------------------------------------------------------- view only */

/** One line with a small lock: why a control cannot be used. */
export function LockLine({ children = VIEW_ONLY_LINE, testID }: { children?: string; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Lock size={13} color={c.faint} strokeWidth={2.2} />
      <T v="caption" tone="muted" style={{ flex: 1 }}>
        {children}
      </T>
    </View>
  );
}

/**
 * A write control as a view-only admin sees it: still on the screen, dimmed,
 * not pressable, with one line under it saying why. A Super Admin gets the
 * control unchanged.
 */
export function Locked({ children, reason = VIEW_ONLY_LINE, row, testID }: { children: React.ReactNode; reason?: string; /** The reason sits beside the control instead of under it (a small button in a line). */ row?: boolean; testID?: string }) {
  const { viewOnly } = useAdminRole();
  if (!viewOnly) return <>{children}</>;
  return (
    <View testID={testID ?? "locked"} style={row ? { width: "100%", flexDirection: "row", alignItems: "center", gap: space[3], flexWrap: "wrap" } : { gap: space[1] }}>
      <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ opacity: 0.45 }}>
        {children}
      </View>
      <View style={row ? { flex: 1, minWidth: 140 } : null}>
        <LockLine>{reason}</LockLine>
      </View>
    </View>
  );
}

/** A switch line for a control screen. View-only admins see the switch where it stands, locked. */
export function ControlSwitch({ title, meta, value, onChange, testID }: { title: string; meta?: string; value: boolean; onChange: (next: boolean) => void; testID?: string }) {
  const c = useTheme();
  const { viewOnly } = useAdminRole();
  return (
    <Press
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityHint={viewOnly ? VIEW_ONLY_LINE : meta}
      accessibilityState={{ checked: value, disabled: viewOnly }}
      scale={1}
      onPress={() => {
        if (viewOnly) return haptic.warn();
        haptic.select();
        onChange(!value);
      }}
      innerStyle={{ minHeight: layout.row, paddingVertical: space[2], flexDirection: "row", alignItems: "center", gap: space[3] }}
    >
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <T v="bodyStrong">{title}</T>
        {meta ? (
          <T v="small" tone="muted">
            {meta}
          </T>
        ) : null}
      </View>
      {viewOnly ? <Lock size={14} color={c.faint} /> : null}
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={{ opacity: viewOnly ? 0.5 : 1 }}>
        <Switch value={value} disabled={viewOnly} trackColor={{ false: c.fieldLine, true: c.switchOn }} thumbColor={value ? c.switchThumb : c.raised} ios_backgroundColor={c.fieldLine} {...({ activeThumbColor: c.switchThumb, activeTrackColor: c.switchOn } as object)} />
      </View>
    </Press>
  );
}

/* ------------------------------------------------- empty, error, loading */

/** Nothing here: a small plain mark, one line, at most one action. No sticker and no Jyo on the admin side. */
export function EmptyState({ title, body, action, testID }: { title: string; body?: string; action?: { label: string; onPress: () => void; primary?: boolean }; /** Accepted so older calls still compile; the admin side draws no mood picture. */ mood?: string; testID?: string }) {
  const c = useTheme();
  return (
    <View testID={testID} style={{ borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.card, padding: space[4], gap: space[2], alignItems: "flex-start" }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.card, alignItems: "center", justifyContent: "center" }}>
        <Inbox size={18} color={c.muted} />
      </View>
      <T v="h3">{title}</T>
      {body ? (
        <T v="small" tone="muted" style={{ maxWidth: 420 }}>
          {body}
        </T>
      ) : null}
      {action ? <Button small full={false} kind={action.primary ? "primary" : "quiet"} label={action.label} onPress={action.onPress} style={{ marginTop: space[1] }} /> : null}
    </View>
  );
}

/** The usual "could not load", plain. */
export function LoadError({ onRetry, what = "this", error }: { onRetry: () => void; what?: string; error?: unknown }) {
  return <EmptyState title={`Could not load ${what}`} body={reasonOf(error)} action={{ label: "Try again", onPress: onRetry }} testID="load-error" />;
}

/** The kit's Loaded, with the admin's plain empty and error states. */
export function PlainLoaded<D>({ q, skeleton, what, soon, children }: { q: UseQueryResult<D>; skeleton?: React.ReactNode; what?: string; soon?: boolean | string; children: (data: D) => React.ReactNode }) {
  let body: React.ReactNode = null;
  const waiting = q.data === undefined && !q.isError && q.fetchStatus === "paused";
  if (q.data !== undefined) body = children(q.data);
  else if (waiting) body = <WaitingForInternet onRetry={() => void q.refetch()} />;
  else if (q.isError) {
    if (isClosed(q.error)) body = <EmptyState title="Not open for your account" body="This part of VIBHA is not switched on for you yet." testID="closed" />;
    else if (soon && q.error instanceof ApiFailure && q.error.code === "not_found") body = <ComingSoon web={typeof soon === "string" ? soon : undefined} />;
    else body = <LoadError what={what} error={q.error} onRetry={() => void q.refetch()} />;
  }
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

/**
 * A screen built on sample data shows its skeleton for a moment and then the
 * content, the same way a real read does, so the loading state is designed too.
 */
export function useSample<D>(data: D): { data: D | undefined; ready: boolean } {
  const [ready, setReady] = React.useState(process.env.NODE_ENV === "test");
  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), 260);
    return () => clearTimeout(t);
  }, []);
  return { data: ready ? data : undefined, ready };
}

/** Says plainly that a screen shows sample data until it is connected (docs/CONNECT-badmin.md). */
export function MockNote({ what = "This screen" }: { what?: string }) {
  return (
    <View testID="mock-note" style={{ paddingTop: space[2] }}>
      <T v="caption" tone="muted" center>
        {what} shows sample data. It is not connected to the live site yet.
      </T>
    </View>
  );
}
