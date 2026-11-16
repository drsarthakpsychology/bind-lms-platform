import { useQueryClient } from "@tanstack/react-query";
import { Check, Flame, Lightbulb, Sparkles, Wrench } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import { useMe } from "@/api/queries";
import { Button, EmptyState, LoadError, RowsSkeleton, Screen, Section, Sheet, T } from "@/ds";
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
  const [balance, setBalance] = React.useState<number | null>(null);
  const [owned, setOwned] = React.useState<Set<string>>(new Set());
  const [worn, setWorn] = React.useState<{ frame: string | null; title: string | null } | null>(null);
  const [bought, setBought] = React.useState<Set<string>>(new Set());
  const [pending, setPending] = React.useState<Pending | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fire, setFire] = React.useState(0);
  const [big, setBig] = React.useState(0);
  const [last, setLast] = React.useState<string | null>(null);
  const d = q.data;
  const first = (me.data?.name ?? "You").split(" ")[0] ?? "You";

  if (q.isError) return <Screen title="XP shop"><LoadError error={q.error} what="the shop" onRetry={() => void q.refetch()} /></Screen>;
  if (!d) {
    return (
      <Screen title="XP shop">
        <RowsSkeleton rows={6} />
      </Screen>
    );
  }
  const bal = balance ?? d.balance;
  const has = (l: Look) => l.owned || owned.has(l.id);
  const wearing = worn ?? { frame: d.looks.find((l) => l.kind === "frame" && l.worn)?.id ?? null, title: d.looks.find((l) => l.kind === "title" && l.worn)?.id ?? null };

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
    <Screen testID="shop" title="XP shop" lead={d.note} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Confetti fire={big} />
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: space[4], borderWidth: 2, borderColor: c.ink, borderRadius: layout.radius, padding: space[4], backgroundColor: c.card }}>
        <View>
          <T v="caption" tone="muted">
            YOUR XP
          </T>
          <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[1] }}>
            <RollingNumber value={bal} style={{ fontFamily: fonts.pixelDigits, fontSize: 48, lineHeight: 56, color: c.ink }} testID="shop-balance" />
            <View>
              <Burst fire={fire} reach={40} />
            </View>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[1] }}>
            <Flame size={18} color={d.streak.alive ? c.danger : c.muted} />
            <T v="bodyStrong" num>{`${d.streak.count} day${d.streak.count === 1 ? "" : "s"}`}</T>
          </View>
          <T v="caption" tone="muted">
            {d.streak.alive ? "STREAK" : "STREAK LOST"}
          </T>
        </View>
      </View>
      {!d.ready ? <EmptyState mood="soon" title="The shop opens soon" body="You can look around; buying switches on shortly." /> : null}
      {error && !pending ? (
        <T v="small" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}

      <Section title="Useful things">
        <Stagger gap={space[3]}>
          {d.items.map((it) => {
            const Icon = ICON[it.id] ?? Sparkles;
            const off = !d.ready || !it.ready;
            const done = bought.has(it.id);
            return (
              <View key={it.id} style={{ flexDirection: "row", gap: space[3], alignItems: "center", borderWidth: 1.5, borderColor: c.cardLine, borderRadius: layout.radius, padding: space[4] }} testID={`shop-item-${it.id}`}>
                <Icon size={24} color={c.ink} />
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                  <T v="bodyStrong">{it.label}</T>
                  <T v="small" tone="muted">
                    {it.id === "streak_repair" ? `${it.text} ${d.repair.text}` : it.text}
                  </T>
                </View>
                {done && last === it.id ? (
                  <Stamp fire={fire} rotate={-4}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: space[2], paddingVertical: 4, borderRadius: 8, borderWidth: 2, borderColor: c.ink, backgroundColor: c.primary }}>
                      <Check size={14} color={c.onPrimary} strokeWidth={3} />
                      <T v="caption" style={{ color: c.onPrimary }}>
                        BOUGHT
                      </T>
                    </View>
                  </Stamp>
                ) : (
                  <PriceButton cost={it.cost} disabled={off || (it.id === "streak_repair" && !d.repair.ok)} label={off ? "Coming soon" : undefined} onPress={() => { haptic.tap(); setError(null); setPending({ kind: "item", item: it }); }} testID={`shop-buy-${it.id}`} />
                )}
              </View>
            );
          })}
        </Stagger>
      </Section>

      <Section title="Name frames and titles">
        <T v="small" tone="muted">
          How your name shows on the boards.
        </T>
        <View style={{ gap: space[3] }}>
          {d.looks.map((l) => {
            const mine = has(l);
            const on = wearing[l.kind] === l.id;
            return (
              <Animated.View key={l.id} layout={reduce ? undefined : presets.layout()} style={{ gap: space[3], borderWidth: on ? 2 : 1.5, borderColor: on ? c.ink : c.cardLine, borderRadius: layout.radius, padding: space[4], backgroundColor: on ? c.card : "transparent" }} testID={`shop-look-${l.id}`}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3] }}>
                  <LookName name={first} frame={l.kind === "frame" ? l.id : wearing.frame} title={l.kind === "title" ? l.id : wearing.title} />
                  {mine ? (
                    <Button kind={on ? "quiet" : "primary"} full={false} label={on ? "Take off" : "Wear"} onPress={() => void wear(l, !on)} testID={`shop-wear-${l.id}`} />
                  ) : (
                    <PriceButton cost={l.cost} disabled={!d.ready} onPress={() => { haptic.tap(); setError(null); setPending({ kind: "look", look: l }); }} testID={`shop-buy-${l.id}`} />
                  )}
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
                  <T v="small" style={{ flex: 1 }}>
                    {l.label}
                  </T>
                  {on ? (
                    <T v="caption" tone="link">
                      WEARING
                    </T>
                  ) : mine ? (
                    <T v="caption" tone="muted">
                      YOURS
                    </T>
                  ) : null}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </Section>

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
            <Button label={`Spend ${cost} XP`} disabled={short > 0} busy={busy} onPress={() => void confirm()} testID="shop-spend" />
            <Button kind="text" label="Not now" onPress={() => setPending(null)} />
          </View>
        ) : null}
      </Sheet>
    </Screen>
  );
}

/** The price on a pill; it sinks when pressed. */
function PriceButton({ cost, onPress, disabled, label, testID }: { cost: number; onPress: () => void; disabled?: boolean; label?: string; testID?: string }) {
  const c = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label ?? `Buy for ${cost} XP`} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} testID={testID} style={({ pressed }) => ({ minHeight: layout.target, minWidth: 88, paddingHorizontal: space[3], alignItems: "center", justifyContent: "center", borderRadius: 24, borderWidth: 2, borderColor: disabled ? c.cardLine : c.ink, backgroundColor: disabled ? "transparent" : c.primary, opacity: disabled ? 0.6 : 1, transform: [{ scale: pressed ? 0.94 : 1 }] })}>
      <T style={{ fontFamily: label ? fonts.semibold : fonts.pixelDigits, fontSize: label ? 13 : 16, lineHeight: 20, color: disabled ? c.muted : c.onPrimary }}>{label ?? `${cost} XP`}</T>
    </Pressable>
  );
}
