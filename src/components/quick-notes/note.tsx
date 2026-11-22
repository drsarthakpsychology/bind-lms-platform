import Link from "next/link";
import { AlertTriangle, ArrowRight, BookOpen, Dumbbell } from "lucide-react";
import { BackLink, PageFrame, Row, RowList, Section } from "@/components/ds";
import type { QuickNoteView, QuickSection, QuickTable } from "@/lib/quick-notes/view-types";
import { PinButton, RecordRecent } from "./pins";

function Bullets({ items, steps }: { items: string[]; steps?: boolean }) {
  const L = steps ? "ol" : "ul";
  return (
    <L className="flex min-w-0 flex-col gap-2 type-body">
      {items.map((t, i) => (
        <li key={i} className="flex min-w-0 gap-3">
          {steps ? <span className="w-5 shrink-0 type-num font-semibold text-muted-foreground">{i + 1}.</span> : <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />}
          <span className="min-w-0 [overflow-wrap:anywhere]">{t}</span>
        </li>
      ))}
    </L>
  );
}

/** A real table from 640px; on a phone each row becomes a small stacked block, so nothing scrolls sideways. */
function Table({ t }: { t: QuickTable }) {
  const first = t.head[0] ?? "";
  return (
    <>
      <div className="hidden min-w-0 overflow-hidden rounded-[var(--ds-radius)] border border-[var(--ds-hairline)] sm:block">
        <table className="w-full border-collapse type-small">
          <thead>
            <tr className="bg-[var(--ds-tint)] text-left">
              {t.head.map((h, i) => (
                <th key={i} scope="col" className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r, i) => (
              <tr key={i} className="border-t border-[var(--ds-hairline)] align-top">
                {r.map((c, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="px-3 py-2 text-left font-semibold">
                      {c}
                    </th>
                  ) : (
                    <td key={j} className="px-3 py-2">
                      {c}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] rounded-[var(--ds-radius)] bg-[var(--ds-tint)] px-4 sm:hidden">
        {t.rows.map((r, i) => (
          <li key={i} className="flex min-w-0 flex-col gap-1 py-3">
            <p className="type-body font-semibold [overflow-wrap:anywhere]">
              {first ? <span className="sr-only">{first}: </span> : null}
              {r[0]}
            </p>
            <dl className="flex min-w-0 flex-col gap-1">
              {r.slice(1).map((c, j) => (
                <div key={j} className="min-w-0">
                  <dt className="type-caption text-muted-foreground">{t.head[j + 1]}</dt>
                  <dd className="type-small [overflow-wrap:anywhere]">{c}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

function Pairs({ pairs }: { pairs: NonNullable<QuickSection["pairs"]> }) {
  return (
    <RowList>
      {pairs.map((p, i) => (
        <Row key={i} href={p.noteId ? `/study/notes/${p.noteId}` : undefined} title={p.label} meta={p.value || undefined} />
      ))}
    </RowList>
  );
}

function Body({ s }: { s: QuickSection }) {
  return (
    <>
      {s.bullets?.length ? <Bullets items={s.bullets} /> : null}
      {s.steps?.length ? <Bullets items={s.steps} steps /> : null}
      {s.table ? <Table t={s.table} /> : null}
      {s.pairs?.length ? <Pairs pairs={s.pairs} /> : null}
    </>
  );
}

/** One Quick Note, any type: tag, title and one line; facts strip; sections; one warm block; where to go next; source line. */
export function QuickNotePage({ v, owner }: { v: QuickNoteView; owner: string | null }) {
  return (
    <PageFrame width="reading">
      <RecordRecent owner={owner} itemKey={v.id} />
      <header className="flex min-w-0 flex-col gap-2">
        <BackLink href="/study/notes">Quick Notes</BackLink>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="type-small font-semibold text-muted-foreground">
              {v.typeLabel} · {v.topicLabel}
            </p>
            <h1 className="type-h1 [overflow-wrap:anywhere]">{v.title}</h1>
          </div>
          <PinButton owner={owner} itemKey={v.id} name={v.title} />
        </div>
        <p className="type-body text-muted-foreground">{v.oneLine}</p>
        {v.sections.length > 4 ? (
          <nav aria-label="On this page" className="flex min-w-0 flex-wrap gap-x-4 gap-y-1 pt-1 type-small">
            {v.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="font-semibold underline decoration-[var(--ds-card-line)] underline-offset-4 hover:decoration-foreground">
                {s.title}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      {v.facts.length ? (
        <dl data-testid="qn-facts" className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3">
          {v.facts.map((f, i) => (
            <div key={f.label} className={`min-w-0 rounded-[var(--ds-radius)] bg-[var(--ds-tint)] px-4 py-3 ${v.facts.length % 2 === 1 && i === v.facts.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}>
              <dt className="type-caption text-muted-foreground">{f.label}</dt>
              <dd className="type-small font-semibold [overflow-wrap:anywhere]">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {v.sections.map((s) => (
        <Section key={s.id} id={s.id} title={s.title} className="scroll-mt-24">
          <Body s={s} />
        </Section>
      ))}

      {v.alert ? (
        <section aria-labelledby="qn-alert" className="min-w-0 rounded-[var(--ds-radius)] border-[1.5px] border-[color-mix(in_oklab,var(--destructive)_45%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_7%,var(--card))] p-4">
          <h2 id="qn-alert" className="mb-2 flex items-center gap-2 type-h3">
            <AlertTriangle className="size-5 shrink-0" aria-hidden /> {v.alert.title}
          </h2>
          <Bullets items={v.alert.points} />
        </section>
      ) : null}

      {v.deeper.length ? (
        <Section title="Go deeper">
          <RowList>
            {v.deeper.map((l) => (
              <Row key={l.href} href={l.href} icon={<BookOpen />} title={l.label} meta={l.meta} />
            ))}
          </RowList>
        </Section>
      ) : null}
      {v.practise.length ? (
        <Section title="Practise this">
          <RowList>
            {v.practise.map((l) => (
              <Row key={l.href} href={l.href} icon={<Dumbbell />} title={l.label} meta={l.meta} />
            ))}
          </RowList>
        </Section>
      ) : null}

      <footer className="flex min-w-0 flex-col gap-2 border-t border-[var(--ds-hairline)] pt-4 type-small text-muted-foreground">
        {v.careLine ? <p>{v.careLine}</p> : null}
        {v.sourceLine ? <p data-testid="qn-source">{v.sourceLine}</p> : null}
        <Link href="/study/notes" className="inline-flex min-h-11 items-center gap-1 self-start font-semibold text-foreground">
          All Quick Notes <ArrowRight className="size-4" aria-hidden />
        </Link>
      </footer>
    </PageFrame>
  );
}
