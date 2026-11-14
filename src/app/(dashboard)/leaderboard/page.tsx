import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowDown, ArrowRight, ArrowUp, Crown, Lock, MoreVertical, ShieldAlert, ShoppingBag, Swords, Trophy, Users } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { loadMyLeague, type BoardEntry, type MyLeague } from "@/lib/leagues/board";
import { tierName, TIERS } from "@/lib/leagues/tiers";
import { BOARDS } from "@/lib/standing/boards";
import { BoardSwitch } from "@/components/standing/board-switch";
import { cn } from "@/lib/utils";
import { AliasForm } from "./alias-form";
import { Avatar, NameLine } from "./look";
import { leaveWithoutSession } from "@/lib/auth/session-redirect";

export const metadata: Metadata = { title: BOARDS.league.label };
export const dynamic = "force-dynamic";

/**
 * /leaderboard: the weekly league (plan §4.4). Hard and ranked, never
 * humiliating: your league shows the top 3 and the people around you, the
 * promotion line, and (privately) how far you are from safety. Cohort board
 * (real names), platform board (alias), private percentile and the monthly
 * batch war. No public list of the bottom places.
 */
export default async function LeaguePage() {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);
  const data = await loadMyLeague(session.profile.id);
  const relegates = data.tier > 1;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BoardSwitch active="league" />

      <header>
        <p className="text-eyebrow text-link">
          This week · {data.daysLeft} {data.daysLeft === 1 ? "day" : "days"} left
        </p>
        <h1 className="text-h1">{data.tierName} league</h1>
        <p className="mt-1 text-sm">
          {data.league.cut
            ? `Top ${data.league.cut} move up${relegates ? `, bottom ${data.league.cut} move down` : ""}. A week with 0 points drops you a tier${relegates ? "" : " (not from Neuron)"}.`
            : "Your group fills up as more students play."}
        </p>
        <p className="text-caption text-muted-foreground">Resets Monday 00:00 IST. Both batches play together.</p>
      </header>

      <TierLadder tier={data.tier} />

      <PrivateCard data={data} />

      <section aria-labelledby="league-h" className="rounded-xl border-2 border-foreground bg-card hard-shadow-sm">
        <h2 id="league-h" className="flex items-center gap-2 border-b-2 border-foreground px-4 py-3 font-bold">
          <Trophy className="size-4" aria-hidden /> Your group <span className="font-normal text-muted-foreground">· {data.groupSize} players</span>
        </h2>
        <ol className="divide-y-2 divide-foreground/10">
          {data.league.view.map((v, i) =>
            v.kind === "gap" ? (
              <li key={`gap${i}`} className="flex items-center gap-2 px-4 py-2 text-caption text-muted-foreground">
                <MoreVertical className="size-4" aria-hidden /> {v.hidden} more
              </li>
            ) : (
              <Fragment key={v.entry!.key}>
                <LeagueRowItem e={v.entry!} />
                {data.league.cut > 0 && v.index === data.league.cut - 1 ? <ZoneLine top={data.tier >= 5} /> : null}
              </Fragment>
            ),
          )}
          {!data.league.view.length ? <li className="px-4 py-6 text-sm text-muted-foreground">Earn points this week to join a league.</li> : null}
        </ol>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {data.cohort ? (
          <Board title={data.cohort.name} icon={<Users className="size-4" aria-hidden />} note="Your batch, this week. Real names." entries={data.cohort.entries} total={data.cohort.total} />
        ) : (
          <section className="rounded-xl border-2 border-foreground bg-card p-4 text-sm">You&apos;re not in a batch yet, so there&apos;s no cohort board.</section>
        )}
        <Board title="Platform" icon={<Trophy className="size-4" aria-hidden />} note="Everyone, this week. Names or chosen names." entries={data.platform.entries} total={data.platform.total} />
      </div>

      <BatchWar war={data.war} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="rounded-xl border-2 border-foreground bg-card p-4">
          <AliasForm alias={data.me.alias} fallback={data.me.shortName} />
        </section>
        <nav aria-label="More" className="grid gap-3">
          <CardLink href="/leaderboard/shop" icon={<ShoppingBag className="size-5" aria-hidden />} title="XP shop" text="Streak repair, looks for your name." />
          <CardLink href={BOARDS.overall.href} icon={<Crown className="size-5" aria-hidden />} title={BOARDS.overall.label} text={BOARDS.overall.explainer} />
        </nav>
      </div>
    </div>
  );
}

function TierLadder({ tier }: { tier: number }) {
  return (
    <ol aria-label="League tiers" className="grid grid-cols-5 gap-1.5">
      {TIERS.map((t) => {
        const on = t.tier === tier;
        return (
          <li key={t.tier} aria-current={on ? "true" : undefined} className={cn("rounded-md border-2 px-1 py-2 text-center", on ? "border-foreground bg-brand text-brand-foreground hard-shadow-xs" : t.tier < tier ? "border-foreground/40 bg-card" : "border-dashed border-foreground/40 bg-background text-muted-foreground")}>
            <span className="block font-mono text-caption">{t.tier}</span>
            <span className="block text-caption font-bold [overflow-wrap:anywhere] sm:text-sm">{t.name}</span>
            {on ? <span className="sr-only"> (your league)</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

function PrivateCard({ data }: { data: MyLeague }) {
  const z = data.league.zone;
  const ZoneIcon = z.kind === "drop" ? ShieldAlert : z.kind === "promote" || z.kind === "top" ? Crown : ArrowUp;
  const last = data.lastWeek;
  return (
    <section aria-labelledby="mine-h" className="rounded-xl border-2 border-foreground bg-card p-4">
      <h2 id="mine-h" className="flex items-center gap-1.5 text-caption font-bold text-muted-foreground">
        <Lock className="size-3.5" aria-hidden /> Only you see this
      </h2>
      <p className="mt-1 text-h3">{data.percentile.line}</p>
      <p className="text-caption text-muted-foreground">All students, all-time points.</p>
      <dl className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md bg-background px-3 py-2">
          <dt className="text-caption text-muted-foreground">This week</dt>
          <dd className="text-lg font-bold tabular-nums">{data.me.points} pts</dd>
        </div>
        <div className="rounded-md bg-background px-3 py-2">
          <dt className="text-caption text-muted-foreground">Your place</dt>
          <dd className="text-lg font-bold tabular-nums">{data.league.myRank ? `${data.league.myRank} of ${data.groupSize}` : "Not ranked yet"}</dd>
        </div>
        <div className={cn("rounded-md px-3 py-2", z.kind === "drop" ? "bg-status-alert-bg text-status-alert-fg" : "bg-background")}>
          <dt className="text-caption">{z.kind === "drop" ? "Drop zone" : z.kind === "promote" || z.kind === "top" ? "Promotion zone" : "Next"}</dt>
          <dd className="flex items-start gap-1.5 text-sm font-bold">
            <ZoneIcon className="mt-0.5 size-4 shrink-0" aria-hidden /> {z.text}
          </dd>
        </div>
      </dl>
      {last ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm">
          {last.result === "promoted" ? <ArrowUp className="size-4" aria-hidden /> : last.result === "relegated" ? <ArrowDown className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}
          Last week: place {last.rank} in {tierName(last.tier)}, {last.result === "promoted" ? `moved up to ${tierName(last.nextTier)}` : last.result === "relegated" ? `moved down to ${tierName(last.nextTier)}` : "stayed"}.
        </p>
      ) : null}
    </section>
  );
}

function Points({ e }: { e: BoardEntry }) {
  return <span className="shrink-0 text-right text-sm font-bold tabular-nums">{e.points} pts</span>;
}

function LeagueRowItem({ e }: { e: BoardEntry }) {
  return (
    <li className={cn("flex min-h-14 items-center gap-3 px-4 py-2", e.me && "bg-primary text-primary-foreground")} aria-current={e.me ? "true" : undefined}>
      <span className="w-7 shrink-0 text-right text-sm font-bold tabular-nums">{e.rank}</span>
      <Avatar name={e.name} look={e.look} me={e.me} />
      <NameLine name={e.name} title={e.title} look={e.look} me={e.me} onFill={e.me} />
      <Points e={e} />
    </li>
  );
}

/** The promotion line, drawn under the last place that moves up. */
function ZoneLine({ top }: { top: boolean }) {
  return (
    <li className="flex items-center gap-2 px-4 py-1.5 text-caption font-bold">
      {top ? <Crown className="size-3.5" aria-hidden /> : <ArrowUp className="size-3.5" aria-hidden />}
      {top ? "Top of Mind above this line" : "Move up above this line"}
      <span className="h-0 flex-1 border-t-2 border-dashed border-foreground" aria-hidden />
    </li>
  );
}

function Board({ title, icon, note, entries, total }: { title: string; icon: React.ReactNode; note: string; entries: BoardEntry[]; total: number }) {
  return (
    <section aria-label={`${title} board`} className="min-w-0 rounded-xl border-2 border-foreground bg-card">
      <header className="border-b-2 border-foreground px-4 py-3">
        <h2 className="flex items-center gap-2 font-bold">
          {icon} {title}
        </h2>
        <p className="text-caption text-muted-foreground">
          {note} Top 10 and you · {total} students
        </p>
      </header>
      <ol className="divide-y-2 divide-foreground/10">
        {entries.map((e) => (
          <li key={e.key}>
            {e.gapBefore ? (
              <span className="flex items-center gap-2 px-4 py-1.5 text-caption text-muted-foreground">
                <MoreVertical className="size-4" aria-hidden /> …
              </span>
            ) : null}
            <div className={cn("flex min-h-12 items-center gap-3 px-4 py-2", e.me && "bg-primary text-primary-foreground")} aria-current={e.me ? "true" : undefined}>
              <span className="w-7 shrink-0 text-right text-sm font-bold tabular-nums">{e.rank}</span>
              <NameLine name={e.name} title={e.title} look={e.look} me={e.me} onFill={e.me} />
              <Points e={e} />
            </div>
          </li>
        ))}
        {!entries.length ? <li className="px-4 py-6 text-sm text-muted-foreground">Nobody has points yet this week.</li> : null}
      </ol>
    </section>
  );
}

function BatchWar({ war }: { war: MyLeague["war"] }) {
  if (war.entries.length < 2) return null;
  const max = Math.max(1, ...war.entries.map((w) => w.average));
  return (
    <section aria-labelledby="war-h" className="rounded-xl border-2 border-foreground bg-card p-4">
      <h2 id="war-h" className="flex items-center gap-2 font-bold">
        <Swords className="size-4" aria-hidden /> Batch war · {war.month}
      </h2>
      <p className="text-caption text-muted-foreground">Average points per active student this month. Size doesn&apos;t win; everyone showing up does.</p>
      <ol className="mt-3 space-y-3">
        {war.entries.map((w, i) => (
          <li key={w.cohortId}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-bold">
                {i === 0 && w.average > 0 ? <Crown className="mr-1 inline size-4 align-[-2px]" aria-label="Leading" /> : null}
                {w.name}
                {w.mine ? <span className="ml-1.5 rounded-full border-2 border-foreground px-1.5 text-caption">Your batch</span> : null}
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="font-bold">{w.average}</span> avg · {w.active}/{w.members} active
              </span>
            </div>
            <span className="mt-1 block h-3 overflow-hidden rounded-full border-2 border-foreground bg-background" aria-hidden>
              <span className={cn("block h-full", w.mine ? "bg-brand" : "bg-foreground/70")} style={{ width: `${Math.round((w.average / max) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CardLink({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="group flex min-h-16 items-center gap-3 rounded-xl border-2 border-foreground bg-card p-4 transition-transform duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="text-sm text-muted-foreground">{text}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
