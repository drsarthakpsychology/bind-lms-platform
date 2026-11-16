import { ChevronDown } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

import type { Block, BoxKind, ListItem } from "@/api/contract";
import { T } from "@/ds/text";
import { haptic } from "@/lib/haptics";
import { presets } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { Rich } from "./rich";
import { WidgetView, type WidgetContext } from "./widgets";

/**
 * Study content, drawn natively from the contract's blocks (never HTML).
 * The same labels and the same "call-outs without boxes" rules as the
 * website's new reader (src/components/study/blocks.tsx).
 */

export const BOX: Record<BoxKind, { label: string; look: "rule" | "brand" | "tint" | "alert" }> = {
  define: { label: "Definition", look: "brand" },
  word: { label: "How to word it", look: "brand" },
  trap: { label: "Exam trap", look: "alert" },
  safety: { label: "Safety", look: "alert" },
  mnemonic: { label: "Memory hook", look: "tint" },
  example: { label: "Clinical example", look: "rule" },
  sounds: { label: "How it sounds in the room", look: "tint" },
  analogy: { label: "Picture it", look: "rule" },
  note: { label: "Note", look: "rule" },
};

/** "The two core symptoms [core]" -> title and tag. */
export function splitTag(text: string): { text: string; tag: "core" | "extra" | null } {
  const m = /\s*\[(core|extra)\]\s*$/.exec(text);
  return m ? { text: text.slice(0, m.index), tag: m[1] as "core" | "extra" } : { text, tag: null };
}

function Items({ items, ordered, depth = 0 }: { items: ListItem[]; ordered: boolean; depth?: number }) {
  return (
    <View style={{ gap: space[2], paddingLeft: depth ? space[5] : 0 }}>
      {items.map((it, i) => (
        <View key={i} style={{ gap: space[2] }}>
          <View style={{ flexDirection: "row", gap: space[3] }}>
            <T v="reading" tone="muted" style={{ minWidth: ordered ? 22 : 12 }}>
              {ordered ? `${i + 1}.` : "•"}
            </T>
            <Rich text={it.text} v="reading" style={{ flex: 1 }} />
          </View>
          {it.children?.length ? <Items items={it.children} ordered={false} depth={depth + 1} /> : null}
        </View>
      ))}
    </View>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  const c = useTheme();
  const col = 168;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Table, scroll sideways for more" contentContainerStyle={{ paddingRight: space[4] }}>
      <View accessibilityRole="list">
        <View style={{ flexDirection: "row", borderBottomWidth: 1.5, borderColor: c.ink }}>
          {head.map((h, i) => (
            <View key={i} style={{ width: col, paddingVertical: space[2], paddingRight: space[3] }}>
              <Rich text={h} v="small" style={{ fontFamily: "Archivo-700" }} />
            </View>
          ))}
        </View>
        {rows.map((r, i) => (
          <View key={i} style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: c.hairline }}>
            {r.map((cell, j) => (
              <View key={j} style={{ width: col, paddingVertical: space[3], paddingRight: space[3] }}>
                <Rich text={cell} v="small" tone={j === 0 ? "ink" : "muted"} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Box({ kind, title, blocks, ctx }: { kind: BoxKind; title?: string; blocks: Block[]; ctx: BlockContext }) {
  const c = useTheme();
  const b = BOX[kind] ?? BOX.note;
  const frame =
    b.look === "alert"
      ? { backgroundColor: c.alertBg, borderRadius: layout.radius, padding: space[4] }
      : b.look === "tint"
        ? { backgroundColor: c.tint, borderRadius: layout.radius, padding: space[4] }
        : { borderLeftWidth: 2, borderColor: b.look === "brand" ? c.link : c.cardLine, paddingLeft: space[4] };
  return (
    <View testID={`box-${kind}`} style={[frame, { gap: space[2] }]}>
      <T v="caption" style={{ color: b.look === "alert" ? c.alertFg : b.look === "brand" ? c.link : c.muted }}>
        {b.label.toUpperCase()}
        {title ? ` · ` : ""}
        {title ? <Rich text={title} v="caption" style={{ color: b.look === "alert" ? c.alertFg : b.look === "brand" ? c.link : c.muted }} /> : null}
      </T>
      <Blocks blocks={blocks} ctx={ctx} tone={b.look === "alert" ? "alert" : undefined} />
    </View>
  );
}

function Qa({ q, blocks, ctx }: { q: string; blocks: Block[]; ctx: BlockContext }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => {
          haptic.select();
          setOpen((o) => !o);
        }}
        style={{ minHeight: layout.row, flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[3] }}
      >
        <Rich text={q} v="bodyStrong" style={{ flex: 1 }} />
        <ChevronDown size={20} color={c.muted} style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }} />
      </Pressable>
      {open ? (
        <Animated.View entering={reduce ? undefined : presets.fadeState()} style={{ paddingBottom: space[4] }}>
          <Blocks blocks={blocks} ctx={ctx} />
        </Animated.View>
      ) : null}
    </View>
  );
}

export type BlockContext = WidgetContext & { view: "student" | "clinician" };

/** A list of blocks, with the reading rhythm: 16px between parts, more around widgets. */
export function Blocks({ blocks, ctx, tone }: { blocks: Block[]; ctx: BlockContext; tone?: "alert" }) {
  return (
    <View style={{ gap: space[4] }}>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} ctx={ctx} tone={tone} index={i} />
      ))}
    </View>
  );
}

function BlockView({ b, ctx, tone, index }: { b: Block; ctx: BlockContext; tone?: "alert"; index: number }) {
  switch (b.t) {
    case "h3": {
      const { text, tag } = splitTag(b.text);
      return (
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[2], flexWrap: "wrap", paddingTop: index ? space[3] : 0 }}>
          <Rich text={text} v="h3" />
          {tag ? (
            <T v="caption" tone={tag === "core" ? "link" : "muted"}>
              {tag === "core" ? "CORE" : "EXTRA"}
            </T>
          ) : null}
        </View>
      );
    }
    case "p":
      return <Rich text={b.text} v="reading" tone={tone} />;
    case "ul":
    case "ol":
      return <Items items={b.items} ordered={b.t === "ol"} />;
    case "table":
      return <Table head={b.head} rows={b.rows} />;
    case "box":
      return <Box kind={b.kind} title={b.title} blocks={b.blocks} ctx={ctx} />;
    case "view":
      return b.view === ctx.view ? <Blocks blocks={b.blocks} ctx={ctx} /> : null;
    case "qa":
      return <Qa q={b.q} blocks={b.blocks} ctx={ctx} />;
    case "widget":
      return (
        <View style={{ marginVertical: space[3] }}>
          <WidgetView block={b} ctx={ctx} />
        </View>
      );
    default:
      // recall, viva and mcq are lifted out of chunks by the server.
      return null;
  }
}
