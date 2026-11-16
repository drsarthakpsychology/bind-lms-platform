import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { PageFrame, Row, RowList, Section } from "@/components/ds";
import type { ShownTool } from "@/components/practice/practice-hub";
import { cn } from "@/lib/utils";
import { HubNote } from "./hub-parts";

/**
 * /practice (new design): clinical skills on real cases, as three short
 * groups. The four main skills are thin cards (each is one thing you open);
 * the smaller tools are rows. A tool that is coming soon is shown without a
 * link, so it never opens a dead end.
 */
const STATE_WORD: Record<string, string> = { in_progress: "In progress", done_today: "Done today", due: "Due" };

function stateWord(t: ShownTool): string | null {
  if (t.locked) return "Soon";
  return t.state?.state ? (STATE_WORD[t.state.state] ?? null) : null;
}

function SkillCard({ tool }: { tool: ShownTool }) {
  const Icon = tool.icon;
  const word = stateWord(tool);
  const body = (
    <>
      <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--ds-tint)] text-foreground transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/skill:bg-primary group-hover/skill:text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="type-body font-bold [overflow-wrap:anywhere]">{tool.title}</span>
        <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{tool.text}</span>
        {word ? <span className="mt-1 type-caption text-muted-foreground">{word}</span> : null}
      </span>
    </>
  );
  const base = "flex h-full min-h-[4.5rem] min-w-0 items-start gap-4 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-card p-4";
  return (
    <li className="min-w-0">
      {tool.locked ? (
        <div aria-disabled="true" className={cn(base, "opacity-70")}>
          {body}
        </div>
      ) : (
        <Link
          href={tool.href}
          className={cn(
            base,
            "group/skill outline-none transition-[border-color,transform,translate,scale] duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] motion-reduce:active:scale-100",
          )}
        >
          {body}
        </Link>
      )}
    </li>
  );
}

function ToolRows({ id, title, tools }: { id: string; title: string; tools: ShownTool[] }) {
  if (!tools.length) return null;
  return (
    <Section id={id} title={title}>
      <RowList>
        {tools.map((t) => {
          const Icon = t.icon;
          return <Row key={t.href} href={t.locked ? undefined : t.href} icon={<Icon />} title={t.title} meta={t.text} trailing={stateWord(t) ?? undefined} className={t.locked ? "opacity-70" : undefined} />;
        })}
      </RowList>
    </Section>
  );
}

export function PracticeHubV2({
  main,
  think,
  more,
  resume,
  newCases = null,
  record = { passport: false, record: false },
}: {
  main: ShownTool[];
  think: ShownTool[];
  more: ShownTool[];
  resume: { href: string; title: string } | null;
  newCases?: string | null;
  record?: { passport: boolean; record: boolean };
}) {
  const empty = !main.length && !think.length && !more.length;
  return (
    <PageFrame title="Practice" lead={newCases ? <HubNote label={newCases} /> : undefined}>
      {main.length ? (
        <Section id="main-skills" title="Main skills">
          {resume ? (
            <Link href={resume.href} className="-mt-1 inline-flex min-h-11 max-w-full items-center gap-2 self-start type-small font-semibold text-link underline-offset-4 hover:underline">
              <RotateCcw className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0 [overflow-wrap:anywhere]">Pick up where you left off: {resume.title}</span>
            </Link>
          ) : null}
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
            {main.map((t) => (
              <SkillCard key={t.href} tool={t} />
            ))}
          </ul>
        </Section>
      ) : null}
      <ToolRows id="think" title="Think like a clinician" tools={think} />
      <ToolRows id="more" title="More practice" tools={more} />
      {empty ? <p className="type-body text-muted-foreground">Nothing here yet. Your faculty will switch tools on soon.</p> : null}
      {record.passport || record.record ? (
        <Section id="your-record" title="Your record">
          <RowList>
            {record.passport ? <Row href="/passport" title="Skills Passport" /> : null}
            {record.record ? <Row href="/record" title="Supervision log and check-in" /> : null}
          </RowList>
        </Section>
      ) : null}
    </PageFrame>
  );
}
