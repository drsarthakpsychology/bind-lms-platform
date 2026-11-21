import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Check, Flame, Lightbulb, Sparkles, Wrench } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import { useMe } from "@/api/queries";
import { Button, HoldButton, Label, RowsSkeleton, Screen, Sheet, StillTrying, Stone, T } from "@/ds";
import { IconPatch, QuietError, QuietNote } from "@/screens/me/parts";
import { haptic } from "@/lib/haptics";
import { Burst, Confetti, presets, RollingNumber, Stamp } from "@/motion";
import { fonts, layout, space, useTheme } from "@/theme";
import { moveError, play, useRead } from "./api";
import type { BuyResult, XpShop } from "./contract";
import { Stagger } from "./fx";

/**
 * The XP shop (the website's /leaderboard/shop): your XP, a few useful things
 * to spend it on, and name frames and titles to wear on the boards. Buying is
 * the website's buyItem (POST /play/league/buy), wearing its wearLook
 * (POST /play/league/wear); the server checks the balance and spends it.
 * A purchase lands with the balance rolling down, sparks and a stamp.
 */

type Look = XpShop["looks"][number];
type Item = XpShop["items"][number];
type Pending = { kind: "item"; item: Item } | { kind: "look"; look: Look };

const ICON: Record<string, typeof Wrench> = { streak_repair: Wrench, hints_3: Lightbulb, bonus_case: Sparkles };

/** A name drawn the way a look shows it on the boards. */
export function LookName({ name, frame, title, size = "body" }: { name: string; frame: string | null; title: string | null; size?: "body" | "h3" }) {
  const c = useTheme();
  const v = size === "h3" ? "h3" : "bodyStrong";
  const text = (
    <View style={title === "title-fill" ? { backgroundColor: c.primary, borderRadius: 6, paddingHorizontal: space[2] } : undefined}>
      <T v={v} style={{ color: title === "title-blue" ? c.link : title === "title-fill" ? c.onPrimary : c.ink }} numberOfLines={1}>
        {name}
      </T>
    </View>
  );
  if (!frame) return text;
  const color = frame === "frame-blue" ? c.accent : frame === "frame-lime" ? c.primary : c.ink;
  return (
    <View style={{ alignSelf: "flex-start", borderWidth: 2.5, borderColor: color, borderRadius: 10, padding: frame === "frame-ink" ? 2 : space[1] }}>
      {frame === "frame-ink" ? <View style={{ borderWidth: 1.5, borderColor: c.ink, borderRadius: 7, padding: space[1] }}>{text}</View> : text}
    </View>
  );
}

export function ShopScreen() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const qc = useQueryClient();
  const q = useRead<XpShop>("/leaderboards/shop");
  const me = useMe();
  const [balance, setBalanceAt] = React.useState<{ v: number; at: number } | null>(null);
  const [owned, setOwned] = React.useState<Set<string>>(new Set());
  const [worn, setWornAt] = React.useState<{ v: { frame: string | null; title: string | null }; at: number } | null>(null);
  const setBalance = (v: number) => setBalanceAt({ v, at: q.dataUpdatedAt });
  const setWorn = (v: { frame: string | null; title: string | null }) => setWornAt({ v, at: q.dataUpdatedAt });
  const [bought, setBought] = React.useState<Set<string>>(new Set());
  const [pending, setPending] = React.useState<Pending | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fire, setFire] = React.useState(0);
  const [big, setBig] = React.useState(0);
  const [last, setLast] = React.useState<string | null>(null);
  const d = q.data;
  const first = (me.data?.name ?? "You").split(" ")[0] ?? "You";

  if (q.isError && q.data === undefined) return <Screen title="XP shop"><QuietError error={q.error} what="the shop" onRetry={() => void q.refetch()} /></Screen>;
  if (!d) {
    return (
      <Screen title="XP shop">
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={6} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      </Screen>
    );
  }
  // What the phone set after a buy or a wear holds only until the server's
  // next answer (pull to refresh, the refetch after a buy): that answer wins.
  const bal = balance && balance.at === q.dataUpdatedAt ? balance.v : d.balance;
  const has = (l: Look) => l.owned || owned.has(l.id);
  const wearing = (worn && worn.at === q.dataUpdatedAt ? worn.v : null) ?? { frame: d.looks.find((l) => l.kind === "frame" && l.worn)?.id ?? null, title: d.looks.find((l) => l.kind === "title" && l.worn)?.id ?? null };

  const confirm = async () => {
    if (!pending || busy) return;
    setBusy(true);
    setError(null);
    const id = pending.kind === "item" ? pending.item.id : `look:${pending.look.id}`;
    try {
      const r = await play<BuyResult>("league", "buy", id);
      if (r.error) {
        setError(r.error);
        haptic.warn();
        return;
      }
      haptic.success();
      if (typeof r.balance === "number") setBalance(r.balance);
      if (pending.kind === "look") {
        const look = pending.look;
        setOwned((s) => new Set(s).add(look.id));
        setWorn({ ...wearing, [look.kind]: look.id });
        setBig((n) => n + 1);
      } else {
        const item = pending.item;
        setBought((s) => new Set(s).add(item.id));
      }
      setLast(pending.kind === "item" ? pending.item.id : pending.look.id);
      setFire((n) => n + 1);
      setPending(null);
      void qc.invalidateQueries({ queryKey: ["practise", "read", "/leaderboards/league"] });
    } catch (e) {
      setError(moveError(e));
    } finally {
      setBusy(false);
    }
  };
  const wear = async (l: Look, on: boolean) => {
    haptic.select();
    const before = wearing;
    setWorn({ ...wearing, [l.kind]: on ? l.id : null });
    const r = await play<{ error: string | null }>("league", "wear", l.kind, on ? l.id : null).catch(() => ({ error: "Couldn't change it. Try again." }));
    if (r.error) {
      setWorn(before);
      setError(r.error);
    }
  };

  const cost = pending ? (pending.kind === "item" ? pending.item.cost : pending.look.cost) : 0;
  const short = cost - bal;
  return (
    <Screen
      testID="shop"
      title="XP shop"
      lead={d.note}
      gap={space[5]}
      onRefresh={() => void q.refetch()}
      refreshing={q.isRefetching}
      field={
        <View accessible accessibilityLabel={`Your XP: ${bal}. ${d.streak.count > 0 ? `${d.streak.count} day streak${d.streak.alive ? "" : ", lost"}` : "No streak yet"}`} style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: space[4], backgroundColor: c.fieldTint, borderRadius: 22, paddingVertical: space[3], paddingHorizontal: space[4] }}>
          <View>
            <T v="caption" tone="onFieldMuted">
              Your XP
            </T>
            <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[1] }}>
              <RollingNumber value={bal} style={{ fontFamily: fonts.big, fontSize: 40, lineHeight: 44, color: c.onField }} format={(n) => n.toLocaleString("en-IN")} testID="shop-balance" />
              <View>
                <Burst fire={fire} reach={40} />
              </View>
            </View>
          </View>
          <View style={{ alignItems: "flex-end", gap: 2, paddingBottom: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[1] }}>
              <Flame size={18} color={d.streak.alive ? c.lime : c.onFieldMuted} />
              <T v="bodyStrong" tone="onField" num>
                {d.streak.count > 0 ? `${d.streak.count} day${d.streak.count === 1 ? "" : "s"}` : "Start today"}
              </T>
            </View>
            <T v="caption" tone="onFieldMuted">
              {d.streak.alive || d.streak.count <= 0 ? "Streak" : "Streak lost"}
            </T>
          </View>
        </View>
      }
    >
      <Stack.Screen options={{ title: "" }} />
      <Confetti fire={big} />
      {!d.ready ? <QuietNote testID="shop-soon" title="The shop opens soon" body="You can look around; buying switches on shortly." /> : null}
      {error && !pending ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}

      <View style={{ gap: space[3] }}>
        <Label>Useful things</Label>
        <Stagger gap={space[3]}>
          {d.items.map((it) => {
            const Icon = ICON[it.id] ?? Sparkles;
            const off = !d.ready || !it.ready;
            const done = bought.has(it.id);
            return (
              <View key={it.id} style={{ flexDirection: "row", gap: space[3], alignItems: "center", backgroundColor: c.card, borderRadius: layout.radiusLg, padding: space[4] }} testID={`shop-item-${it.id}`}>
                <IconPatch icon={Icon} area="home" />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <T v="bodyStrong">{it.label}</T>
                  <T v="small" tone="muted">
                    {it.id === "streak_repair" ? `${it.text} ${d.repair.text}` : it.text}
                  </T>
                </View>
                {done && last === it.id ? (
                  <Stamp fire={fire} rotate={-4}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: space[3], paddingVertical: 6, borderRadius: 999, backgroundColor: c.lime }}>
                      <Check size={14} color={c.onLime} strokeWidth={3} />
                      <T v="caption" style={{ color: c.onLime }}>
                        Bought
                      </T>
                    </View>
                  </Stamp>
                ) : (
                  <PriceButton cost={it.cost} disabled={off || (it.id === "streak_repair" && !d.repair.ok)} label={off ? "Coming soon" : undefined} onPress={() => { setError(null); setPending({ kind: "item", item: it }); }} testID={`shop-buy-${it.id}`} />
                )}
              </View>
            );
          })}
        </Stagger>
      </View>

      <View style={{ gap: space[3] }}>
        <Label>Name frames and titles</Label>
        <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
          How your name shows on the boards.
        </T>
        <View style={{ gap: space[3] }}>
          {d.looks.map((l) => {
            const mine = has(l);
            const on = wearing[l.kind] === l.id;
            return (
              <Animated.View key={l.id} layout={reduce ? undefined : presets.layout()} style={{ gap: space[3], borderWidth: 1.5, borderColor: on ? c.ink : c.card, borderRadius: layout.radiusLg, padding: space[4], backgroundColor: on ? "transparent" : c.card }} testID={`shop-look-${l.id}`}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }}>
                  <LookName name={first} frame={l.kind === "frame" ? l.id : wearing.frame} title={l.kind === "title" ? l.id : wearing.title} />
                  {mine ? (
                    <Button kind={on ? "quiet" : "ink"} small full={false} label={on ? "Take off" : "Wear"} onPress={() => void wear(l, !on)} testID={`shop-wear-${l.id}`} />
                  ) : (
                    <PriceButton cost={l.cost} disabled={!d.ready} onPress={() => { setError(null); setPending({ kind: "look", look: l }); }} testID={`shop-buy-${l.id}`} />
                  )}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
                  <T v="small" style={{ flex: 1 }}>
                    {l.label}
                  </T>
                  {on ? (
                    <T v="caption" tone="link">
                      Wearing
                    </T>
                  ) : mine ? (
                    <T v="caption" tone="muted">
                      Yours
                    </T>
                  ) : null}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Sheet open={!!pending} onClose={() => !busy && setPending(null)} title={pending ? `${pending.kind === "item" ? pending.item.label : pending.look.label}` : undefined} testID="shop-confirm">
        {pending ? (
          <View style={{ gap: space[4] }}>
            {pending.kind === "look" ? <LookName name={first} frame={pending.look.kind === "frame" ? pending.look.id : wearing.frame} title={pending.look.kind === "title" ? pending.look.id : wearing.title} size="h3" /> : <T>{pending.item.text}</T>}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <T v="small" tone="muted" num>{`Costs ${cost} XP`}</T>
              <T v="small" tone={short > 0 ? "danger" : "muted"} num>
                {short > 0 ? `You need ${short} more XP` : `Leaves ${bal - cost} XP`}
              </T>
            </View>
            {error ? (
              <T v="small" tone="danger" accessibilityLiveRegion="polite">
                {error}
              </T>
            ) : null}
            <HoldButton label={busy ? "Spending" : `Hold to spend ${cost} XP`} tapLabel={`Spend ${cost} XP`} disabled={short > 0 || busy} onConfirm={() => void confirm()} testID="shop-spend" />
            <T v="caption" tone="muted" center>
              Press and hold for one second. Letting go early cancels.
            </T>
            <Button kind="text" label="Not now" onPress={() => setPending(null)} />
          </View>
        ) : null}
      </Sheet>
    </Screen>
  );
}

/** The price on an ink pill; it sinks when pressed. The one lime thing is the hold to spend. */
function PriceButton({ cost, onPress, disabled, label, testID }: { cost: number; onPress: () => void; disabled?: boolean; label?: string; testID?: string }) {
  const c = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label ?? `Buy for ${cost} XP`} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} testID={testID} style={({ pressed }) => ({ minHeight: layout.target, minWidth: 84, paddingHorizontal: space[3], alignItems: "center", justifyContent: "center", borderRadius: 24, backgroundColor: disabled ? c.tint : c.ink, transform: [{ scale: pressed ? 0.94 : 1 }] })}>
      <T v="small" num style={{ fontFamily: fonts.bold, color: disabled ? c.muted : c.bg }}>
        {label ?? `${cost} XP`}
      </T>
    </Pressable>
  );
}
