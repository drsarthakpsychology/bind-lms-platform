import Link from "next/link";
import { FlaskConical, Trophy } from "lucide-react";
import { PageFrame, Row, RowList, Section } from "@/components/ds";
import { SOLO, WITH_OTHERS, type Game } from "@/components/learn/games-list";
import { BOARDS } from "@/lib/standing/boards";
import { HubNote } from "./hub-parts";

/**
 * /games (new design): the games as two short groups. A game is one thing you
 * tap, so each is a thin card: its mark, its name, one line. Nothing else on
 * the screen competes; the board and the Lab are two quiet rows at the end.
 */
function GameCard({ g }: { g: Game }) {
  const Icon = g.icon;
  return (
    <li className="min-w-0">
      <Link
        href={g.href}
        className="group/game flex h-full min-h-[4.5rem] min-w-0 items-center gap-4 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-card p-4 outline-none transition-[border-color,transform,translate,scale] duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] motion-reduce:active:scale-100"
      >
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--ds-tint)] text-foreground transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/game:bg-primary group-hover/game:text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="type-body font-bold [overflow-wrap:anywhere]">{g.title}</span>
          <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{g.text}</span>
        </span>
      </Link>
    </li>
  );
}

function Group({ id, title, games }: { id: string; title: string; games: Game[] }) {
  return (
    <Section id={id} title={title}>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => (
          <GameCard key={g.href} g={g} />
        ))}
      </ul>
    </Section>
  );
}

export function GamesHub({ showLab = false, newCases = null }: { showLab?: boolean; newCases?: string | null }) {
  return (
    <PageFrame title="Games" lead={newCases ? <HubNote label={newCases} /> : undefined}>
      <Group id="solo" title="Solo" games={SOLO} />
      <Group id="with-others" title="With others" games={WITH_OTHERS} />
      <Section id="more-games" title="More">
        <RowList>
          <Row href={BOARDS.quiz.href} icon={<Trophy />} title={BOARDS.quiz.label} />
          {showLab ? <Row href="/games/lab" icon={<FlaskConical />} title="Psychology Lab" /> : null}
        </RowList>
      </Section>
    </PageFrame>
  );
}
