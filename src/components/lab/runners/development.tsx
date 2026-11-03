"use client";

import * as React from "react";
import { CONS_ITEMS, CONS_REASONS, CONS_STAGES, CONS_TASK_TEXT, CONS_TASKS, type ConsItem, type ConsTask } from "@/lib/lab/experiments2";
import { Bars, LabButton, Panel, RoundBar, type RunnerProps } from "../lab-ui";
import { Choice } from "./batch2-ui";

/* ------------------------------------------------------------------ */
/* Conservation tasks                                                  */
/* ------------------------------------------------------------------ */

type Pick = { stage: string | null; reason: string | null };

export function ConservationRunner({ onDone }: RunnerProps) {
  const [t, setT] = React.useState(0);
  const [after, setAfter] = React.useState(false);
  const [seen, setSeen] = React.useState(false);
  const [picks, setPicks] = React.useState<Record<string, Pick>>({});
  const task = CONS_TASKS[t];
  const text = CONS_TASK_TEXT[task];
  const items = CONS_ITEMS.filter((c) => c.task === task);
  const allDone = items.every((c) => picks[c.id]?.stage && picks[c.id]?.reason);

  function pick(id: string, k: keyof Pick, v: string) {
    setPicks((p) => {
      const cur = p[id] ?? { stage: null, reason: null };
      if (cur[k]) return p;
      return { ...p, [id]: { ...cur, [k]: v } };
    });
  }

  function next() {
    if (t + 1 >= CONS_TASKS.length) {
      const stage = CONS_ITEMS.filter((c) => picks[c.id]?.stage === c.stage).length;
      const reason = CONS_ITEMS.filter((c) => picks[c.id]?.reason === c.reason).length;
      const of = CONS_ITEMS.length;
      onDone({
        numbers: { stage, reason, of },
        verdict: `You placed ${stage} of ${of} children in the right stage and named ${reason} of ${of} kinds of reasoning. ${reason < stage ? "Naming the kind of reasoning is the harder part: listen for what the child says changed, or why nothing did." : "Notice that you judged the reasoning, not the age."}`,
        view: (
          <Bars
            ariaLabel="Your score"
            items={[
              { label: "Stage", value: stage, highlight: true },
              { label: "Reasoning", value: reason },
            ]}
          />
        ),
      });
      return;
    }
    setT(t + 1);
    setAfter(false);
    setSeen(false);
  }

  return (
    <Panel className="space-y-5">
      <RoundBar at={t + 1} of={CONS_TASKS.length} label="Task" />
      <h3 className="text-xl font-bold">{text.title}</h3>

      <figure className="space-y-2 rounded-xl border-2 border-foreground bg-background p-3">
        <TaskPicture task={task} after={after} />
        <figcaption className="text-sm" aria-live="polite">
          <b>{after ? "After:" : "Start:"}</b> {after ? text.after : text.before}
        </figcaption>
      </figure>
      <div className="flex flex-wrap items-center gap-3">
        <LabButton
          tone={after ? "plain" : "primary"}
          aria-pressed={after}
          onClick={() => {
            setAfter((a) => !a);
            setSeen(true);
          }}
        >
          {after ? "Show the start" : "Make the change"}
        </LabButton>
        {seen && (
          <p className="text-sm">
            The adult asks: <span className="font-serif italic">&ldquo;{text.ask}&rdquo;</span>
          </p>
        )}
      </div>

      {seen ? (
        <div className="space-y-4">
          {items.map((c) => (
            <ChildCard key={c.id} item={c} pick={picks[c.id] ?? { stage: null, reason: null }} onPick={(k, v) => pick(c.id, k, v)} />
          ))}
          {allDone && <LabButton onClick={next}>{t + 1 >= CONS_TASKS.length ? "See my result" : "Next task"}</LabButton>}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Make the change to hear what the children say.</p>
      )}
    </Panel>
  );
}

function ChildCard({ item, pick, onPick }: { item: ConsItem; pick: Pick; onPick: (k: keyof Pick, v: string) => void }) {
  const both = pick.stage && pick.reason;
  return (
    <article className="space-y-3 rounded-xl border-2 border-foreground bg-card p-3 sm:p-4" aria-label={`${item.child}, age ${item.age}`}>
      <p>
        <span className="font-bold">
          {item.child}, {item.age}:
        </span>{" "}
        <span className="font-serif text-lg italic">&ldquo;{item.says}&rdquo;</span>
      </p>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Stage</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {CONS_STAGES.map((s) => (
            <Choice key={s} picked={pick.stage === s} correct={s === item.stage} revealed={!!pick.stage} onClick={() => onPick("stage", s)}>
              {s}
            </Choice>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Kind of reasoning</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CONS_REASONS.map((s) => (
            <Choice key={s} picked={pick.reason === s} correct={s === item.reason} revealed={!!pick.reason} onClick={() => onPick("reason", s)}>
              {s}
            </Choice>
          ))}
        </div>
      </fieldset>
      {both && (
        <p className="text-sm" role="status">
          <b>{pick.stage === item.stage && pick.reason === item.reason ? "Right." : `${item.stage}, ${item.reason.toLowerCase()}.`}</b> {item.why}
        </p>
      )}
    </article>
  );
}

/* Simple line drawings of each task. Ink outlines, peach fill for the material. */
function TaskPicture({ task, after }: { task: ConsTask; after: boolean }) {
  const label = `${CONS_TASK_TEXT[task].title} task, ${after ? "after the change" : "at the start"}`;
  return (
    <svg viewBox="0 0 320 160" className="mx-auto h-auto w-full max-w-sm text-foreground" role="img" aria-label={label}>
      {task === "liquid" && <Liquid after={after} />}
      {task === "number" && <Coins after={after} />}
      {task === "length" && <Sticks after={after} />}
      {task === "mass" && <Clay after={after} />}
    </svg>
  );
}

const ink = { stroke: "currentColor", strokeWidth: 3, fill: "none" } as const;
const stuff = { fill: "var(--primary)", stroke: "currentColor", strokeWidth: 2 } as const;

function Glass({ x, w, h, juice }: { x: number; w: number; h: number; juice: number }) {
  const base = 145;
  return (
    <g>
      <rect x={x} y={base - juice} width={w} height={juice} {...stuff} />
      <path d={`M ${x} ${base - h} L ${x} ${base} L ${x + w} ${base} L ${x + w} ${base - h}`} {...ink} />
    </g>
  );
}

function Liquid({ after }: { after: boolean }) {
  // Same area of juice: 70 x 50 = 3500 = 32 x ~109.
  return (
    <g>
      <Glass x={60} w={70} h={80} juice={50} />
      {after ? <Glass x={200} w={32} h={130} juice={109} /> : <Glass x={190} w={70} h={80} juice={50} />}
    </g>
  );
}

function Coins({ after }: { after: boolean }) {
  const top = Array.from({ length: 6 }, (_, k) => 70 + k * 36);
  const bottom = Array.from({ length: 6 }, (_, k) => (after ? 25 + k * 54 : 70 + k * 36));
  return (
    <g>
      {top.map((x) => (
        <circle key={`t${x}`} cx={x} cy={50} r={12} {...stuff} />
      ))}
      {bottom.map((x) => (
        <circle key={`b${x}`} cx={x} cy={115} r={12} {...stuff} />
      ))}
    </g>
  );
}

function Sticks({ after }: { after: boolean }) {
  const len = 180;
  return (
    <g>
      <rect x={70} y={45} width={len} height={14} rx={3} {...stuff} />
      <rect x={after ? 110 : 70} y={100} width={len} height={14} rx={3} {...stuff} />
    </g>
  );
}

function Clay({ after }: { after: boolean }) {
  return (
    <g>
      <circle cx={95} cy={95} r={38} {...stuff} />
      {after ? <rect x={170} y={80} width={130} height={30} rx={15} {...stuff} /> : <circle cx={225} cy={95} r={38} {...stuff} />}
    </g>
  );
}
