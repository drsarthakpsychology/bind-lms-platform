"use client";

import * as React from "react";
import { Check, Flame, Frame, Lightbulb, Lock, Sparkles, Type, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState } from "@/lib/learn/store";
import { LOOKS, parseLook, SHOP, SHOP_READY, type LookId } from "@/lib/leagues/shop";
import { cn } from "@/lib/utils";
import { buyItem, wearLook } from "../actions";
import { Avatar, NameLine } from "../look";

type Props = {
  ready: boolean;
  balance: number;
  streak: { count: number; alive: boolean };
  repair: { ok: boolean; text: string };
  owned: LookId[];
  look: string | null;
  serverState: LearnState | null;
  save: (s: LearnState) => Promise<unknown>;
};

export function ShopClient(p: Props) {
  const [balance, setBalance] = React.useState(p.balance);
  const [owned, setOwned] = React.useState<LookId[]>(p.owned);
  const [look, setLook] = React.useState(p.look);
  const [repair, setRepair] = React.useState(p.repair);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = React.useTransition();
  const worn = parseLook(look);

  function buy(item: string, label: string) {
    start(async () => {
      // A lost connection must not throw the page to the error screen. Nothing was bought.
      const r: Awaited<ReturnType<typeof buyItem>> = await buyItem(item).catch(() => ({ error: "Not bought: the connection dropped. Your XP is unchanged. Try again." }));
      if (r.error) {
        setMsg({ ok: false, text: r.error });
        return;
      }
      if (typeof r.balance === "number") setBalance(r.balance);
      if (r.look !== undefined) setLook(r.look);
      if (item.startsWith("look:")) setOwned((o) => [...o, item.slice(5) as LookId]);
      if (r.lastDay) {
        // Keep this tab's copy in step, so its next save doesn't undo the repair.
        initLearnStore(p.serverState, p.save);
        const cur = getLearnState();
        if (cur) setLearnState({ ...cur, streak: { ...cur.streak, lastDay: r.lastDay } });
        setRepair({ ok: false, text: "Repaired. Study today to carry it on." });
      }
      setMsg({ ok: true, text: `Bought: ${label}.` });
    });
  }

  function wear(kind: "frame" | "title", id: LookId | null) {
    start(async () => {
      const r: Awaited<ReturnType<typeof wearLook>> = await wearLook(kind, id).catch(() => ({ error: "That did not go through. Check your connection and try again." }));
      if (r.error) setMsg({ ok: false, text: r.error });
      else {
        setLook(r.look ?? null);
        setMsg({ ok: true, text: id ? `Now wearing: ${LOOKS[id].label}.` : "Taken off." });
      }
    });
  }

  if (!p.ready) return <p className="rounded-xl border-2 border-foreground bg-card p-4 text-sm">The shop isn&apos;t open yet. Please check back soon.</p>;

  return (
    <div className="space-y-6">
      <section aria-label="Your XP" className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-card p-4 hard-shadow-sm">
        <span>
          <span className="block text-caption text-muted-foreground">You can spend</span>
          <span className="text-h2 tabular-nums">{balance} XP</span>
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold">
          <Flame className="size-4" aria-hidden /> {p.streak.alive ? `${p.streak.count}-day streak` : "No live streak"}
        </span>
      </section>

      <p aria-live="polite" className={cn("min-h-5 text-sm", msg && !msg.ok && "text-status-alert-fg")}>
        {msg ? (
          <span className="inline-flex items-center gap-1.5">
            {msg.ok ? <Check className="size-4" aria-hidden /> : null}
            {msg.text}
          </span>
        ) : null}
      </p>

      <section aria-labelledby="help-h" className="space-y-3">
        <h2 id="help-h" className="text-h3">Help</h2>
        <Item icon={<Wrench className="size-5" aria-hidden />} title={SHOP.streak_repair.label} text={repair.ok ? repair.text : `${SHOP.streak_repair.text} ${repair.text}`} cost={SHOP.streak_repair.cost} balance={balance} disabled={!repair.ok || pending} onBuy={() => buy("streak_repair", SHOP.streak_repair.label)} />
        <Item icon={<Lightbulb className="size-5" aria-hidden />} title={SHOP.hints_3.label} text={SHOP.hints_3.text} cost={SHOP.hints_3.cost} balance={balance} soon={!SHOP_READY.hints_3} disabled={pending} onBuy={() => buy("hints_3", SHOP.hints_3.label)} />
        <Item icon={<Sparkles className="size-5" aria-hidden />} title={SHOP.bonus_case.label} text={SHOP.bonus_case.text} cost={SHOP.bonus_case.cost} balance={balance} soon={!SHOP_READY.bonus_case} disabled={pending} onBuy={() => buy("bonus_case", SHOP.bonus_case.label)} />
      </section>

      <section aria-labelledby="looks-h" className="space-y-3">
        <h2 id="looks-h" className="text-h3">Looks</h2>
        <div className="flex items-center gap-3 rounded-xl border-2 border-foreground bg-card p-4">
          <Avatar name="You" look={look} />
          <NameLine name="How you look on the boards" title="Your title shows here" look={look} />
        </div>
        {(Object.keys(LOOKS) as LookId[]).map((id) => {
          const l = LOOKS[id];
          const has = owned.includes(id);
          const on = worn[l.kind] === id;
          return has ? (
            <div key={id} className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-foreground bg-card p-4">
              {l.kind === "frame" ? <Frame className="size-5" aria-hidden /> : <Type className="size-5" aria-hidden />}
              <span className="min-w-0 flex-1 font-bold">
                {l.label}
                <span className="ml-2 rounded-full border-2 border-foreground px-1.5 text-caption">Owned</span>
              </span>
              <Button size="lg" variant="outline" className="rounded-md" disabled={pending} onClick={() => wear(l.kind, on ? null : id)}>
                {on ? "Take off" : "Wear"}
              </Button>
            </div>
          ) : (
            <Item key={id} icon={l.kind === "frame" ? <Frame className="size-5" aria-hidden /> : <Type className="size-5" aria-hidden />} title={l.label} text={l.kind === "frame" ? "A frame round your initial." : "A style for your earned title."} cost={l.cost} balance={balance} disabled={pending} onBuy={() => buy(`look:${id}`, l.label)} />
          );
        })}
      </section>
    </div>
  );
}

function Item({ icon, title, text, cost, balance, disabled, soon = false, onBuy }: { icon: React.ReactNode; title: string; text: string; cost: number; balance: number; disabled: boolean; soon?: boolean; onBuy: () => void }) {
  const short = balance < cost;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-foreground bg-card p-4">
      {icon}
      <span className="min-w-0 flex-1 basis-48">
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-muted-foreground">{text}</span>
      </span>
      {soon ? (
        <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-foreground px-2 py-0.5 text-caption font-bold">
          <Lock className="size-3" aria-hidden /> Coming soon
        </span>
      ) : (
        <Button size="lg" className="rounded-md" disabled={disabled || short} onClick={onBuy} aria-label={`Buy ${title} for ${cost} XP`}>
          {short ? `${cost} XP · need ${cost - balance} more` : `Buy · ${cost} XP`}
        </Button>
      )}
    </div>
  );
}
