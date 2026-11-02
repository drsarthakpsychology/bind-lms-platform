import * as React from "react";
import type { Block, BoxKind, ListItem } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich, splitTag } from "./rich";

/** How each box looks and what its label says. Palette: blue, lime, ink, white; red only for traps and safety. */
const BOX: Record<BoxKind, { label: string; cls: string; labelCls: string }> = {
  define: {
    label: "Definition · learn it word for word",
    cls: "border-2 border-foreground border-l-[10px] border-l-brand bg-card",
    labelCls: "text-link",
  },
  word: {
    label: "How to word it",
    cls: "border-2 border-foreground bg-primary text-primary-foreground",
    labelCls: "",
  },
  trap: {
    label: "Exam trap",
    cls: "border-2 border-status-alert-fg bg-status-alert-bg text-status-alert-fg",
    labelCls: "",
  },
  safety: {
    label: "Safety",
    cls: "border-2 border-status-alert-fg bg-status-alert-bg text-status-alert-fg",
    labelCls: "",
  },
  mnemonic: {
    label: "Memory hook",
    cls: "border-2 border-foreground bg-foreground text-background",
    labelCls: "text-primary",
  },
  example: {
    label: "Clinical example",
    cls: "border-2 border-foreground bg-card",
    labelCls: "text-link",
  },
  sounds: {
    label: "How it sounds in the room",
    cls: "border-2 border-foreground bg-brand text-brand-foreground",
    labelCls: "",
  },
  analogy: {
    label: "The picture that makes it stick",
    cls: "border-2 border-dashed border-foreground bg-card",
    labelCls: "text-link",
  },
  note: {
    label: "Note",
    cls: "border-2 border-foreground bg-muted",
    labelCls: "text-muted-foreground",
  },
};

function List({ items, ordered }: { items: ListItem[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "space-y-2 pl-5",
        ordered ? "list-decimal marker:font-semibold" : "list-disc marker:text-link",
      )}
    >
      {items.map((it, i) => (
        <li key={i} className="pl-1">
          <Rich text={it.text} />
          {it.children?.length ? (
            <div className="mt-1.5">
              <List items={it.children} ordered={false} />
            </div>
          ) : null}
        </li>
      ))}
    </Tag>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <>
      {/* Phones: one card per row, so nothing scrolls sideways. */}
      <div className="space-y-2 sm:hidden">
        {rows.map((r, i) => {
          // A leading "#" column becomes a number in front of the title.
          const numbered = head[0]?.trim() === "#";
          const from = numbered ? 2 : 1;
          return (
            <div
              key={i}
              className="rounded-2xl border-2 border-foreground bg-card p-3 text-[0.95rem] leading-snug"
            >
              <p className="font-semibold">
                {numbered ? <span className="mr-1.5 text-link tabular-nums">{r[0]}.</span> : null}
                <Rich text={(numbered ? r[1] : r[0]) ?? ""} />
              </p>
              <dl className="mt-1.5 space-y-1.5">
                {r.slice(from).map((c, j) => (
                  <div key={j}>
                    <dt className="text-xs font-semibold text-link">
                      <Rich text={head[j + from] ?? ""} />
                    </dt>
                    <dd>
                      <Rich text={c} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
      <WideTable head={head} rows={rows} />
    </>
  );
}

function WideTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="-mx-1 hidden overflow-x-auto rounded-2xl border-2 border-foreground bg-card sm:block">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.92rem] leading-snug">
        <thead>
          <tr className="bg-foreground text-background">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-3 py-2.5 align-bottom font-semibold">
                <Rich text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t-2 border-foreground/15 align-top odd:bg-background/60">
              {r.map((c, j) => (
                <td key={j} className={cn("px-3 py-2.5", j === 0 && "font-semibold")}>
                  <Rich text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Renders a section's blocks. `test` carries what the MCQ set needs to save a score. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-[1.7]">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h3": {
            const { text, tag } = splitTag(b.text);
            return (
              <h3
                key={i}
                className="flex flex-wrap items-center gap-2 pt-2 text-[1.3rem] leading-tight font-bold tracking-tight"
              >
                <Rich text={text} />
                {tag === "extra" ? (
                  <span className="rounded-full border-2 border-foreground px-2 py-0.5 text-[0.65rem] font-semibold uppercase">
                    Extra
                  </span>
                ) : null}
              </h3>
            );
          }
          case "p":
            return (
              <p key={i}>
                <Rich text={b.text} />
              </p>
            );
          case "ul":
            return <List key={i} items={b.items} />;
          case "ol":
            return <List key={i} items={b.items} ordered />;
          case "table":
            return <Table key={i} head={b.head} rows={b.rows} />;
          case "box": {
            const s = BOX[b.kind];
            return (
              <aside key={i} className={cn("rounded-2xl p-4 sm:p-5", s.cls)}>
                <p className={cn("text-xs font-semibold tracking-wide uppercase", s.labelCls)}>
                  {s.label}
                  {b.title ? (
                    <span className="tracking-normal normal-case"> · {b.title}</span>
                  ) : null}
                </p>
                <div className="mt-2 space-y-3 [&_ol]:pl-5 [&_ul]:pl-5">
                  <Blocks blocks={b.blocks} />
                </div>
              </aside>
            );
          }
          // Self-tests are taken out of the reading (see lib/study/chunk.ts).
          case "recall":
          case "viva":
          case "mcq":
            return null;
        }
      })}
    </div>
  );
}
