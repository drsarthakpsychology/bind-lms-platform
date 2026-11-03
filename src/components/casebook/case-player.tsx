"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { shuffle } from "@/lib/lab/scoring";
import { orderScore } from "@/lib/casebook/validate";
import { URGENCY_LABEL, type CaseActivity, type Urgency } from "@/lib/casebook/types";
import { cn } from "@/lib/utils";
import { LabButton, Panel, RoundBar } from "@/components/lab/lab-ui";

type Done = (right: number, total: number, missed: string[]) => void;

/** Shared answer button: neutral → right (peach) / wrong (ink, struck) / faded. */
function Choice({ state, onClick, children, disabled }: { state: "idle" | "right" | "wrong" | "fade"; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "right" || state === "wrong" ? true : undefined}
      className={cn(
        "flex min-h-12 w-full items-center gap-2 rounded-xl border-2 border-foreground px-4 py-2 text-left font-semibold transition-transform",
        state === "idle" && "bg-card hover:-translate-y-0.5 active:translate-y-px",
        state === "right" && "bg-primary text-primary-foreground",
        state === "wrong" && "bg-foreground text-background",
        state === "fade" && "opacity-45",
      )}
    >
      {state === "right" && <Check className="size-4 shrink-0" aria-hidden />}
      {state === "wrong" && <X className="size-4 shrink-0" aria-hidden />}
      <span className="min-w-0">{children}</span>
    </button>
  );
}

function Feedback({ ok, children, onNext, last }: { ok: boolean; children: React.ReactNode; onNext: () => void; last: boolean }) {
  return (
    <div className="space-y-3" role="status">
      <p>
        <b>{ok ? "Right." : "Not quite."}</b> {children}
      </p>
      <LabButton onClick={onNext}>{last ? "See my score" : "Next"}</LabButton>
    </div>
  );
}

/**
 * One-question-at-a-time player for the item formats (spotter, differential,
 * triage, skill). The order is shuffled once when the student presses Start.
 */
function ItemRound<T extends { id: string }>({
  items,
  render,
  onDone,
}: {
  items: T[];
  render: (item: T, answer: (ok: boolean) => void, answered: boolean) => React.ReactNode;
  onDone: Done;
}) {
  const [order, setOrder] = React.useState<T[] | null>(null);
  const [i, setI] = React.useState(0);
  const [answered, setAnswered] = React.useState<boolean | null>(null);
  const [right, setRight] = React.useState(0);
  const [missed, setMissed] = React.useState<string[]>([]);

  if (!order)
    return (
      <LabButton onClick={() => setOrder(shuffle(items))}>
        Start · {items.length} questions
      </LabButton>
    );
  const item = order[i];
  const last = i + 1 >= order.length;
  return (
    <Panel className="space-y-4">
      <RoundBar at={i + 1} of={order.length} label="Question" />
      {render(
        item,
        (ok) => {
          if (answered !== null) return;
          setAnswered(ok);
          if (ok) setRight((n) => n + 1);
          else setMissed((m) => [...m, item.id]);
        },
        answered !== null,
      )}
      {answered !== null && (
        <LabButton
          onClick={() => {
            if (last) return onDone(right, order.length, missed);
            setI(i + 1);
            setAnswered(null);
          }}
        >
          {last ? "See my score" : "Next"}
        </LabButton>
      )}
    </Panel>
  );
}

function Mcq({ options, answer, explain, onAnswer }: { options: string[]; answer: number; explain: string; onAnswer: (ok: boolean) => void }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  return (
    <div className="space-y-3">
      <div className="grid gap-2" role="group" aria-label="Answers">
        {options.map((o, k) => (
          <Choice
            key={o}
            state={picked === null ? "idle" : k === answer ? "right" : k === picked ? "wrong" : "fade"}
            onClick={() => {
              if (picked !== null) return;
              setPicked(k);
              onAnswer(k === answer);
            }}
          >
            {o}
          </Choice>
        ))}
      </div>
      {picked !== null && (
        <p role="status">
          <b>{picked === answer ? "Right." : "Not quite."}</b> {explain}
        </p>
      )}
    </div>
  );
}

export function CasePlayer({ activity: a, onDone }: { activity: CaseActivity; onDone: Done }) {
  switch (a.format) {
    case "spotter": {
      const label = (id: string) => a.categories.find((c) => c.id === id)?.label ?? id;
      return (
        <ItemRound
          items={a.items}
          onDone={onDone}
          render={(item, answer) => {
            // Options = the answer + its classic confusions, in a stable per-item order.
            const opts = [item.answer, ...item.distractors].sort((x, y) => (x + item.id).localeCompare(y + item.id));
            return (
              <div className="space-y-4" key={item.id}>
                <blockquote className="rounded-xl border-2 border-foreground bg-background p-4 font-serif text-lg italic leading-relaxed">&ldquo;{item.quote}&rdquo;</blockquote>
                <p className="font-semibold">What is this?</p>
                <Mcq options={opts.map(label)} answer={opts.indexOf(item.answer)} explain={item.explain} onAnswer={answer} />
              </div>
            );
          }}
        />
      );
    }
    case "differential":
      return (
        <ItemRound
          items={a.items}
          onDone={onDone}
          render={(item, answer) => (
            <div className="space-y-4" key={item.id}>
              <p className="rounded-xl border-2 border-foreground bg-background p-4 leading-relaxed">{item.vignette}</p>
              <p className="font-semibold">{item.question ?? "Most likely?"}</p>
              <Mcq options={item.options} answer={item.answer} explain={item.explain} onAnswer={answer} />
            </div>
          )}
        />
      );
    case "triage": {
      const levels: Urgency[] = ["routine", "soon", "urgent"];
      return (
        <ItemRound
          items={a.items}
          onDone={onDone}
          render={(item, answer) => (
            <div className="space-y-4" key={item.id}>
              <p className="rounded-xl border-2 border-foreground bg-background p-4 leading-relaxed">{item.vignette}</p>
              <p className="font-semibold">What do you do?</p>
              <Mcq options={levels.map((l) => URGENCY_LABEL[l])} answer={levels.indexOf(item.answer)} explain={item.explain} onAnswer={answer} />
            </div>
          )}
        />
      );
    }
    case "skill":
      return (
        <ItemRound
          items={a.items}
          onDone={onDone}
          render={(item, answer) => <SkillQuestion key={item.id} item={item} onAnswer={answer} />}
        />
      );
    case "sort":
      return <SortRound activity={a} onDone={onDone} />;
    case "matching":
      return <MatchRound activity={a} onDone={onDone} />;
    case "branching":
      return <BranchRound activity={a} onDone={onDone} />;
    case "timeline":
      return <TimelineRound activity={a} onDone={onDone} />;
  }
}

function SkillQuestion({ item, onAnswer }: { item: Extract<CaseActivity, { format: "skill" }>["items"][number]; onAnswer: (ok: boolean) => void }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const tone = { best: "Best", ok: "Okay", poor: "Avoid" } as const;
  return (
    <div className="space-y-4">
      <blockquote className="rounded-xl border-2 border-foreground bg-background p-4 font-serif text-lg italic leading-relaxed">{item.prompt}</blockquote>
      <p className="font-semibold">Your reply?</p>
      <div className="grid gap-2">
        {item.responses.map((r, k) => (
          <div key={r.text} className="space-y-1">
            <Choice
              state={picked === null ? "idle" : r.grade === "best" ? "right" : k === picked ? "wrong" : "fade"}
              onClick={() => {
                if (picked !== null) return;
                setPicked(k);
                onAnswer(r.grade === "best");
              }}
            >
              {r.text}
            </Choice>
            {picked !== null && (
              <p className="pl-2 text-sm">
                <b>{tone[r.grade]}:</b> {r.why}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SortRound({ activity: a, onDone }: { activity: Extract<CaseActivity, { format: "sort" }>; onDone: Done }) {
  const [items, setItems] = React.useState<typeof a.items | null>(null);
  const [placed, setPlaced] = React.useState<Record<string, string>>({});
  const [checked, setChecked] = React.useState(false);
  if (!items) return <LabButton onClick={() => setItems(shuffle(a.items))}>Start · {a.items.length} items</LabButton>;
  const allPlaced = items.every((i) => placed[i.id]);
  const right = items.filter((i) => placed[i.id] === i.category).length;
  return (
    <Panel className="space-y-4">
      <p className="font-semibold">Put each one in its group.</p>
      <ul className="space-y-3">
        {items.map((it) => {
          const ok = placed[it.id] === it.category;
          return (
            <li key={it.id} className={cn("rounded-xl border-2 border-foreground p-3", checked && (ok ? "bg-primary/25" : "bg-foreground/10"))}>
              <p className="font-semibold">{it.text}</p>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={`Group for: ${it.text}`}>
                {a.categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={placed[it.id] === c.id}
                    disabled={checked}
                    onClick={() => setPlaced((p) => ({ ...p, [it.id]: c.id }))}
                    className={cn("min-h-10 rounded-full border-2 border-foreground px-3 py-1 text-sm font-bold", placed[it.id] === c.id ? "bg-foreground text-background" : "bg-card")}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {checked && (
                <p className="mt-2 text-sm">
                  <b>{ok ? "Right." : `It belongs in: ${a.categories.find((c) => c.id === it.category)?.label}.`}</b> {it.explain}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {!checked ? (
        <LabButton disabled={!allPlaced} onClick={() => setChecked(true)}>
          Check
        </LabButton>
      ) : (
        <LabButton onClick={() => onDone(right, items.length, items.filter((i) => placed[i.id] !== i.category).map((i) => i.id))}>See my score</LabButton>
      )}
    </Panel>
  );
}

function MatchRound({ activity: a, onDone }: { activity: Extract<CaseActivity, { format: "matching" }>; onDone: Done }) {
  const [rights, setRights] = React.useState<string[] | null>(null);
  const [pick, setPick] = React.useState<Record<string, string>>({});
  const [checked, setChecked] = React.useState(false);
  if (!rights) return <LabButton onClick={() => setRights(shuffle(a.pairs.map((p) => p.right)))}>Start · {a.pairs.length} pairs</LabButton>;
  const right = a.pairs.filter((p) => pick[p.id] === p.right).length;
  return (
    <Panel className="space-y-4">
      <p className="font-semibold">Match each one.</p>
      <ul className="space-y-3">
        {a.pairs.map((p) => {
          const ok = pick[p.id] === p.right;
          return (
            <li key={p.id} className="grid gap-2 rounded-xl border-2 border-foreground p-3 sm:grid-cols-2 sm:items-center">
              <label htmlFor={`m-${p.id}`} className="font-semibold">
                {p.left}
              </label>
              <select
                id={`m-${p.id}`}
                value={pick[p.id] ?? ""}
                disabled={checked}
                onChange={(e) => setPick((x) => ({ ...x, [p.id]: e.target.value }))}
                className={cn("min-h-11 w-full rounded-md border-2 border-foreground bg-background px-2", checked && (ok ? "bg-primary text-primary-foreground" : "line-through"))}
              >
                <option value="">Choose…</option>
                {rights.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {checked && !ok && <p className="text-sm sm:col-span-2">Answer: {p.right}</p>}
            </li>
          );
        })}
      </ul>
      {!checked ? (
        <LabButton disabled={a.pairs.some((p) => !pick[p.id])} onClick={() => setChecked(true)}>
          Check
        </LabButton>
      ) : (
        <LabButton onClick={() => onDone(right, a.pairs.length, a.pairs.filter((p) => pick[p.id] !== p.right).map((p) => p.id))}>See my score</LabButton>
      )}
    </Panel>
  );
}

function BranchRound({ activity: a, onDone }: { activity: Extract<CaseActivity, { format: "branching" }>; onDone: Done }) {
  const [at, setAt] = React.useState(a.start);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [path, setPath] = React.useState<{ node: string; good: boolean }[]>([]);
  const node = a.nodes.find((n) => n.id === at)!;
  const choice = picked !== null ? node.choices[picked] : null;
  return (
    <Panel className="space-y-4">
      <p className="text-sm font-semibold tabular-nums text-muted-foreground">Step {path.length + 1}</p>
      <p className="rounded-xl border-2 border-foreground bg-background p-4 text-lg leading-relaxed">{node.text}</p>
      <div className="grid gap-2">
        {node.choices.map((c, k) => (
          <Choice
            key={c.text}
            state={picked === null ? "idle" : k === picked ? (c.good ? "right" : "wrong") : "fade"}
            onClick={() => {
              if (picked !== null) return;
              setPicked(k);
              setPath((p) => [...p, { node: node.id, good: c.good }]);
            }}
          >
            {c.text}
          </Choice>
        ))}
      </div>
      {choice && (
        <Feedback
          ok={choice.good}
          last={choice.next === null}
          onNext={() => {
            if (choice.next === null) {
              const good = path.filter((s) => s.good).length;
              return onDone(good, path.length, path.filter((s) => !s.good).map((s) => s.node));
            }
            setAt(choice.next);
            setPicked(null);
          }}
        >
          {choice.feedback}
        </Feedback>
      )}
    </Panel>
  );
}

function TimelineRound({ activity: a, onDone }: { activity: Extract<CaseActivity, { format: "timeline" }>; onDone: Done }) {
  const [order, setOrder] = React.useState<typeof a.events | null>(null);
  const [checked, setChecked] = React.useState(false);
  if (!order) return <LabButton onClick={() => setOrder(shuffle(a.events))}>Start · {a.events.length} events</LabButton>;
  const move = (k: number, d: -1 | 1) => {
    const next = [...order];
    [next[k], next[k + d]] = [next[k + d], next[k]];
    setOrder(next);
  };
  const correct = a.events.map((e) => e.id);
  const score = orderScore(correct, order.map((e) => e.id));
  return (
    <Panel className="space-y-4">
      <p className="font-semibold">Earliest at the top. Use the arrows.</p>
      <ol className="space-y-2">
        {order.map((e, k) => {
          const inPlace = correct[k] === e.id;
          return (
            <li key={e.id} className={cn("flex items-center gap-2 rounded-xl border-2 border-foreground p-2", checked && (inPlace ? "bg-primary text-primary-foreground" : "bg-card"))}>
              <span className="w-6 shrink-0 text-center font-mono font-bold">{k + 1}</span>
              <span className="min-w-0 flex-1">
                {checked && <span className="block font-mono text-xs font-bold">{e.when}</span>}
                {e.text}
              </span>
              {!checked && (
                <span className="flex shrink-0 gap-1">
                  <button type="button" aria-label={`Move up: ${e.text}`} disabled={k === 0} onClick={() => move(k, -1)} className="grid size-11 place-items-center rounded-md border-2 border-foreground bg-background disabled:opacity-30">
                    <ArrowUp className="size-4" aria-hidden />
                  </button>
                  <button type="button" aria-label={`Move down: ${e.text}`} disabled={k === order.length - 1} onClick={() => move(k, 1)} className="grid size-11 place-items-center rounded-md border-2 border-foreground bg-background disabled:opacity-30">
                    <ArrowDown className="size-4" aria-hidden />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!checked ? (
        <LabButton onClick={() => setChecked(true)}>Check order</LabButton>
      ) : (
        <div className="space-y-2" role="status">
          <p>
            {score} of {order.length - 1} neighbours in the right order.
          </p>
          <LabButton onClick={() => onDone(score, order.length - 1, [])}>See my score</LabButton>
        </div>
      )}
    </Panel>
  );
}
