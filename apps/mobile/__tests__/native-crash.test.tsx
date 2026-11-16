import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as rtlRender, screen } from "@testing-library/react-native";
import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as L from "@/api/adapt-learn";
import { keys } from "@/api/queries";
import { crumb, describeCrumb, screenName } from "@/lib/breadcrumb";
import { CrashScreen } from "@/lib/crash";
import { memoryStore } from "@/lib/storage";
import { isSafePath, safePath, safeSvgXml } from "@/lib/svg-safe";
import { NoteBody, NotesBody } from "@/screens/notes/notes";
import { FigureWidget } from "@/study/widgets/diagrams";
import { ThemeProvider } from "@/theme";

/**
 * The phone closed itself on the Notes section (a native crash the error page
 * cannot see). Cause: the first note's figures come from the website as SVG
 * with marker orient="auto-start-reverse" and pointer-events="visibleStroke";
 * react-native-svg's Android code throws a Java exception on both
 * (MarkerView Double.parseDouble, RenderableViewManager PointerEvents.valueOf).
 * Fixture: the live server's real answers for the notes list, the
 * Neuroscience note and two of its figures, as of 16 Nov 2026.
 */
const live = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/notes-live.json"), "utf8")) as {
  list: unknown;
  detail: unknown;
  figures: Record<string, { svg: { light: string; dark: string }; [k: string]: unknown }>;
};

const POINTER_OK = new Set(["auto", "none", "box-none", "box-only"]);

/** Every host element's props, the way they reach the native side. */
function hostProps(node: { props: Record<string, unknown>; children?: unknown[] } | null, out: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (!node || typeof node !== "object") return out;
  out.push(node.props ?? {});
  for (const ch of node.children ?? []) hostProps(ch as never, out);
  return out;
}

async function withData(ui: React.ReactElement, seed: (c: QueryClient) => void) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: Infinity } } });
  seed(client);
  return await rtlRender(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
      <QueryClientProvider client={client}>
        <ThemeProvider force="light">{ui}</ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>,
  );
}

describe("SVG that closes the app on Android", () => {
  it("the live figures really carry the crashing values (so this test means something)", () => {
    expect(live.figures.neuron!.svg.light).toContain('orient="auto-start-reverse"');
    expect(live.figures["brain-lateral"]!.svg.light).toContain('pointer-events="visibleStroke"');
  });

  it("safeSvgXml rewrites them", () => {
    for (const f of Object.values(live.figures)) {
      const s = safeSvgXml(f.svg.light);
      expect(s).not.toMatch(/orient="(?!auto"|-?\d)/);
      expect(s).not.toMatch(/pointer-events="(?!none"|auto"|box-none"|box-only")/);
      expect(s).toContain("<path");
    }
    expect(safeSvgXml('<path d="M0 NaN L1 1"/><text dominant-baseline="weird" font-style="slanted" x="NaN"/>')).toBe('<path d=""/><text x="0"/>');
    expect(safeSvgXml(undefined)).toBe("");
  });

  it("path guard matches what Android's parser refuses", () => {
    expect(isSafePath("M0 0 L10 10 Z M5 5 L6 6 Z")).toBe(true);
    expect(isSafePath("")).toBe(true);
    expect(isSafePath("L0 0")).toBe(false);
    expect(isSafePath("M0 0 LNaN 1")).toBe(false);
    expect(isSafePath("M0 0 Z 4 4")).toBe(false);
    expect(safePath(undefined)).toBe("");
  });

  it("a figure from the live server reaches the native side with no crashing prop", async () => {
    const { toJSON } = await withData(<FigureWidget d={{ id: "neuron" }} />, (c) => {
      c.setQueryData(keys.figure("neuron"), live.figures.neuron);
    });
    const props = hostProps(toJSON() as never);
    const orients = props.map((p) => p.orient).filter((v) => v !== undefined);
    expect(orients.length).toBeGreaterThan(0);
    for (const o of orients) expect(String(o) === "auto" || /^-?\d+(\.\d+)?$/.test(String(o))).toBe(true);
    for (const p of props) if (typeof p.pointerEvents === "string") expect(POINTER_OK.has(p.pointerEvents)).toBe(true);
    for (const p of props) if (typeof p.d === "string") expect(isSafePath(p.d)).toBe(true);
  });

  it("brain-lateral (pointer-events visibleStroke) reaches the native side safely", async () => {
    const { toJSON } = await withData(<FigureWidget d={{ id: "brain-lateral" }} />, (c) => {
      c.setQueryData(keys.figure("brain-lateral"), live.figures["brain-lateral"]);
    });
    for (const p of hostProps(toJSON() as never)) if (typeof p.pointerEvents === "string") expect(POINTER_OK.has(p.pointerEvents)).toBe(true);
  });

  it("a broken figure answer draws nothing instead of throwing", async () => {
    for (const bad of [{}, { svg: null, viewBox: null, labels: null }, { svg: { light: "<svg><path d='NaN'/></svg>" }, viewBox: "0 0 0 0", labels: [null] }]) {
      await withData(<FigureWidget d={{ id: "x" }} />, (c) => {
        c.setQueryData(keys.figure("x"), bad);
      });
      expect(screen.getByTestId("w-figure")).toBeTruthy();
    }
  });
});

describe("Notes with the live server's answers", () => {
  it("the whole list (41 notes, 9 weeks) renders", async () => {
    const d = L.noteListView(live.list);
    expect(d.notes.length).toBeGreaterThan(30);
    await withData(<NotesBody d={d} />, () => undefined);
    expect(screen.getByTestId("notes-next")).toBeTruthy();
  });

  it("the Neuroscience note renders with every figure in place", async () => {
    const n = L.noteView(live.detail);
    expect(n.figures.length).toBeGreaterThan(3);
    await withData(<NoteBody n={n} view="clinician" neighbours={{ prev: null, next: null }} />, (c) => {
      for (const [id, f] of Object.entries(live.figures)) c.setQueryData(keys.figure(id), f);
    });
    expect(screen.getAllByTestId("w-figure").length).toBe(n.figures.length);
  });

  it("a note made of nulls renders", async () => {
    const n = L.noteView({ id: "x", tldr: null, sections: [null, { title: null, points: [null, ["a"]] }], terms: [[null, null], ["a", "b"]], figures: [null, { id: "f" }] });
    await withData(<NoteBody n={n} view="student" neighbours={{ prev: null, next: null }} />, () => undefined);
    expect(screen.getByText("Practise clinical words")).toBeTruthy();
  });
});

describe("crash breadcrumb", () => {
  it("names screens in plain words", () => {
    expect(screenName("/notes/neuroscience")).toBe("Notes: neuroscience");
    expect(screenName("/(student)/learn")).toBe("Learn");
    expect(screenName("/")).toBe("Home");
  });

  it("a run that died in the foreground is reported next time; a normal stop is not", async () => {
    const kv = memoryStore();
    crumb.reset(kv);
    crumb.screen("/learn");
    crumb.action("Notes");
    crumb.screen("/notes");
    await Promise.resolve();
    crumb.reset(kv);
    expect(describeCrumb(await crumb.load())).toBe("Notes (after: Notes)");

    crumb.screen("/notes");
    crumb.foreground(false);
    await Promise.resolve();
    crumb.reset(kv);
    expect(await crumb.load()).toBeNull();
    crumb.reset();
  });

  it("the error page says where it happened", async () => {
    crumb.reset(memoryStore());
    crumb.screen("/notes/neuroscience");
    await rtlRender(<CrashScreen crash={{ message: "TypeError: x", detail: "", where: "render" }} onRetry={() => undefined} />);
    expect(screen.getByTestId("crash-where").props.children).toBe("It happened on: Notes: neuroscience");
    crumb.reset();
  });
});

describe("guards in the source", () => {
  const root = path.join(__dirname, "..");
  const files = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return e.name === "node_modules" ? [] : files(p);
      return /\.tsx?$/.test(e.name) && !/\.test\./.test(e.name) ? [p] : [];
    });
  const all = [...files(path.join(root, "src")), ...files(path.join(root, "app"))];

  it("every SvgXml gets its XML through safeSvgXml", () => {
    for (const f of all) {
      const s = fs.readFileSync(f, "utf8");
      if (/<SvgXml\b/.test(s)) expect([f, /safeSvgXml/.test(s)]).toEqual([f, true]);
    }
  });

  it("no layout animation inside a virtualized list item (Android removeView crash)", () => {
    for (const f of all) {
      const s = fs.readFileSync(f, "utf8");
      if (!/\b(FlatList|SectionList|FlashList|VirtualizedList)\b/.test(s)) continue;
      // renderItem bodies must not use entering / exiting / layout animations.
      for (const m of s.matchAll(/renderItem=\{([\s\S]*?)\}\s*\n/g)) expect([f, /\b(entering|exiting|layout)=/.test(m[1]!)]).toEqual([f, false]);
    }
  });

  it("no regex lookbehind (not in every Hermes)", () => {
    for (const f of all) expect([f, /\(\?<[=!]/.test(fs.readFileSync(f, "utf8"))]).toEqual([f, false]);
  });
});
