import Link from "next/link";
import { Fragment } from "react";
import { ArrowUp, Crown, Lock, ShoppingBag } from "lucide-react";
import type { BoardEntry, MyLeague } from "@/lib/leagues/board";
import { tierName, TIERS } from "@/lib/leagues/tiers";
import { BOARDS, type BoardKey } from "@/lib/standing/boards";
import { cn } from "@/lib/utils";
import { PageFrame, Row, RowList, Section, chipClass, chipRow, StatItem, StatRow } from "@/components/ds";
import { parseLook } from "@/lib/leagues/shop";
import { AliasFormV2 } from "./alias-form-v2";

/** League, Quiz, Overall: hop between the boards. */
export function BoardTabsV2({ active }: { active: BoardKey }) {
  return (
    <nav aria-label="Leaderboards" className={chipRow}>
      {(Object.keys(BOARDS) as BoardKey[]).map((k) => (
        <Link key={k} href={BOARDS[k].href} aria-current={k === active ? "page" : undefined} className={chipClass(k === active)}>
          {BOARDS[k].short}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Weekly league (new design). One purpose: where you stand this week. Your
 * points and place lead as plain numbers, your group is one ranked list with
 * your row tinted, and everything else (batch, platform, batch war, your
 * board name, the shop) follows as quiet sections.
 */
export function LeaderboardV2({ data }: { data: MyLeague }) {
  const relegates = data.tier > 1;
  const z = data.league.zone;
  const last = data.lastWeek;
  return (
    <PageFrame
      title={`${data.tierName} league`}
      lead={
        <>
          This week · <span className="type-num">{data.daysLeft}</span> {data.daysLeft === 1 ? "day" : "days"} left
        </>
      }
    >
      <div className="-mt-4 md:-mt-6">
        <BoardTabsV2 active="league" />
      </div>

      <section aria-labelledby="mine-h" className="flex min-w-0 flex-col gap-4">
        <h2 id="mine-h" className="flex items-center gap-1.5 type-caption text-muted-foreground">
          <Lock className="size-3.5" aria-hidden /> Only you see this
        </h2>
        <StatRow>
          <StatItem value={data.me.points} sub="pts" label="This week" />
          <StatItem value={data.league.myRank ?? "No place yet"} sub={data.league.myRank ? `of ${data.groupSize}` : undefined} label="Your place" />
        </StatRow>
        <p className={cn("max-w-[60ch] type-body font-semibold [overflow-wrap:anywhere]", z.kind === "drop" && "text-status-alert-fg")}>{z.text}</p>
        <p className="max-w-[60ch] type-small text-muted-foreground [overflow-wrap:anywhere]">
          {data.percentile.line}
          {last
            ? ` Last week: place ${last.rank} in ${tierName(last.tier)}, ${last.result === "promoted" ? `moved up to ${tierName(last.nextTier)}` : last.result === "relegated" ? `moved down to ${tierName(last.nextTier)}` : "stayed"}.`
            : ""}
        </p>
      </section>

      <Section id="group" title="Your group" action={data.groupSize > 1 ? <span className="text-muted-foreground type-num">{data.groupSize} players</span> : undefined}>
        {data.league.view.length ? (
          <ol className="flex min-w-0 flex-col border-y border-[var(--ds-hairline)]">
            {data.league.view.map((v, i) =>
              v.kind === "gap" ? (
                <li key={`gap${i}`} className="border-t border-[var(--ds-hairline)] py-2 pl-12 type-small text-muted-foreground type-num first:border-t-0">
                  {v.hidden} more
                </li>
              ) : (
                <Fragment key={v.entry!.key}>
                  <EntryRow e={v.entry!} avatar />
                  {data.league.cut > 0 && v.index === data.league.cut - 1 ? (
                    <li className="flex items-center gap-2 py-1.5 type-caption text-muted-foreground">
                      {data.tier >= 5 ? <Crown className="size-3.5 shrink-0" aria-hidden /> : <ArrowUp className="size-3.5 shrink-0" aria-hidden />}
                      <span className="shrink-0">{data.tier >= 5 ? "Top of Mind above this line" : "Move up above this line"}</span>
                      <span className="h-0 flex-1 border-t border-dashed border-[var(--ds-card-line)]" aria-hidden />
                    </li>
                  ) : null}
                </Fragment>
              ),
            )}
          </ol>
        ) : (
          <p className="border-y border-[var(--ds-hairline)] py-4 type-small text-muted-foreground">Earn points this week to join a league.</p>
        )}
        <p className="max-w-[60ch] type-small text-muted-foreground">
          {data.league.cut
            ? `Top ${data.league.cut} move up${relegates ? `, bottom ${data.league.cut} move down` : ""}.${relegates ? " A week with 0 points drops you a tier." : ""} `
            : "Your group fills up as more students play. "}
          Resets Monday 00:00 IST.
        </p>
      </Section>

      <Section id="tiers" title="Leagues">
        <ol aria-label="League tiers" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 type-small">
          {TIERS.map((t, i) => {
            const on = t.tier === data.tier;
            return (
              <li key={t.tier} aria-current={on ? "true" : undefined} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden className="h-px w-4 bg-[var(--ds-card-line)]" /> : null}
                <span className={cn(on ? "rounded-full bg-brand px-3 py-1 font-bold text-brand-foreground" : t.tier < data.tier ? "font-semibold text-foreground" : "text-muted-foreground")}>
                  {t.name}
                  {on ? <span className="sr-only"> (your league)</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      </Section>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-[var(--ds-section)] md:grid-cols-2 md:gap-12">
        {data.cohort ? (
          <BoardList id="batch" title={data.cohort.name} note={`Your batch, this week${data.cohort.total > 1 ? ` · ${data.cohort.total} students` : ""}`} entries={data.cohort.entries} />
        ) : (
          <Section id="batch" title="Your batch">
            <p className="border-y border-[var(--ds-hairline)] py-4 type-small text-muted-foreground">You are not in a batch yet, so there is no batch board.</p>
          </Section>
        )}
        <BoardList id="platform" title="Everyone" note={`All batches, this week${data.platform.total > 1 ? ` · ${data.platform.total} students` : ""}`} entries={data.platform.entries} />
      </div>

      <BatchWarV2 war={data.war} />

      <Section id="name" title="Your name">
        <AliasFormV2 alias={data.me.alias} fallback={data.me.shortName} />
      </Section>

      <Section id="more" title="More">
        <RowList>
          <Row href="/leaderboard/shop" icon={<ShoppingBag />} title="XP shop" meta="Streak repair, looks for your name" />
          <Row href={BOARDS.overall.href} icon={<Crown />} title={BOARDS.overall.label} meta={BOARDS.overall.explainer} />
        </RowList>
      </Section>
    </PageFrame>
  );
}

/** One ranked row: place, (avatar,) name with its earned title, points. Your own row is tinted and bold. */
function EntryRow({ e, avatar = false }: { e: BoardEntry; avatar?: boolean }) {
  const { frame, title: titleLook } = parseLook(e.look);
  return (
    <li
      aria-current={e.me ? "true" : undefined}
      className={cn("flex min-h-14 min-w-0 items-center gap-3 border-t border-[var(--ds-hairline)] py-2 first:border-t-0", e.me && "-mx-2 rounded-lg border-t-transparent bg-brand/10 px-2 dark:bg-primary/15 [&+li]:border-t-transparent")}
    >
      <span className={cn("w-7 shrink-0 text-right type-small type-num", e.me ? "font-bold text-foreground" : "text-muted-foreground")}>{e.rank}</span>
      {avatar ? (
        <span
          aria-hidden
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] bg-card type-small font-bold text-foreground",
            frame === "frame-blue" ? "border-brand ring-2 ring-brand" : frame === "frame-lime" ? "border-foreground ring-2 ring-primary" : frame === "frame-ink" ? "border-foreground outline-2 outline-offset-2 outline-foreground" : "border-[var(--ds-card-line)]",
          )}
        >
          {e.name.trim().charAt(0).toUpperCase() || "?"}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("type-body [overflow-wrap:anywhere]", e.me ? "font-bold" : "font-semibold")}>
          {e.name}
          {e.me ? " (you)" : ""}
        </span>
        {e.title ? (
          <span className={cn("type-caption [overflow-wrap:anywhere]", titleLook === "title-blue" || titleLook === "title-fill" ? "font-bold text-link" : "text-muted-foreground")}>{e.title}</span>
        ) : null}
      </span>
      <span className={cn("shrink-0 type-small type-num", e.me ? "font-bold" : "font-semibold")}>{e.points} pts</span>
    </li>
  );
}

function BoardList({ id, title, note, entries }: { id: string; title: string; note: string; entries: BoardEntry[] }) {
  return (
    <Section id={id} title={title}>
      <p className="-mt-2 type-small text-muted-foreground type-num">{note}</p>
      {entries.length ? (
        <ol className="flex min-w-0 flex-col border-y border-[var(--ds-hairline)]">
          {entries.map((e) => (
            <Fragment key={e.key}>
              {e.gapBefore ? (
                <li aria-hidden className="border-t border-[var(--ds-hairline)] py-1 pl-10 type-small text-muted-foreground">
                  …
                </li>
              ) : null}
              <EntryRow e={e} />
            </Fragment>
          ))}
        </ol>
      ) : (
        <p className="border-y border-[var(--ds-hairline)] py-4 type-small text-muted-foreground">Nobody has points yet this week.</p>
      )}
    </Section>
  );
}

function BatchWarV2({ war }: { war: MyLeague["war"] }) {
  if (war.entries.length < 2) return null;
  const max = Math.max(1, ...war.entries.map((w) => w.average));
  return (
    <Section id="war" title={`Batch war · ${war.month}`}>
      <p className="-mt-2 max-w-[60ch] type-small text-muted-foreground">Average points per active student this month. Showing up wins, not batch size.</p>
      <ol className="flex min-w-0 max-w-2xl flex-col gap-4">
        {war.entries.map((w, i) => (
          <li key={w.cohortId} className="flex min-w-0 flex-col gap-1.5">
            <div className="flex min-w-0 items-baseline justify-between gap-3">
              <span className="min-w-0 type-body font-semibold [overflow-wrap:anywhere]">
                {i === 0 && w.average > 0 ? <Crown className="mr-1 inline size-4 align-[-2px]" aria-label="Leading" /> : null}
                {w.name}
                {w.mine ? <span className="type-small font-medium text-muted-foreground"> · your batch</span> : null}
              </span>
              <span className="shrink-0 type-small text-muted-foreground type-num">
                <span className="font-bold text-foreground">{w.average}</span> avg · {w.active} of {w.members} active
              </span>
            </div>
            <span className="block h-1.5 overflow-hidden rounded-full bg-[var(--ds-hairline)]" aria-hidden>
              <span className={cn("block h-full rounded-full", w.mine ? "bg-brand dark:bg-primary" : "bg-foreground/50")} style={{ width: `${Math.round((w.average / max) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
