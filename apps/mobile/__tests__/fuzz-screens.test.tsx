/**
 * Every screen, for every kind of account, drawn with the answers bent the
 * way a real server bends them: empty lists, every nullable field null,
 * optional fields left out, long Hindi and emoji text, huge counts, and the
 * error answers (server down, no internet, paused). None may throw.
 *
 * The answers come from the in-app mock server (which answers in the
 * server's shapes), passed through a bender.
 */
import { act, cleanup, screen } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import * as fs from "fs";
import * as path from "path";
import * as React from "react";

import type { RawResponse } from "@/api/client";
import { ApiFailure } from "@/api/errors";
import { mock } from "@/api/mock/server";
import { session } from "@/auth";
import { render } from "./utils";

type Bend = "none" | "empty" | "nulls" | "missing" | "long" | "huge" | "offline" | "error";
const bender: { mode: Bend; bent: number } = { mode: "none", bent: 0 };

jest.mock("@/api/mock/server", () => {
  const real = jest.requireActual("@/api/mock/server");
  return {
    ...real,
    mockTransport: async (req: { path: string; headers?: Record<string, string> }) => {
      const b = (globalThis as unknown as { __bend: (r: RawResponse, p: string) => RawResponse | Promise<RawResponse> }).__bend;
      // A bent answer is a different answer: never let a 304 hand back the plain copy the client holds.
      const headers = { ...(req.headers ?? {}) };
      delete headers["If-None-Match"];
      const res = await real.mockTransport({ ...req, headers });
      return b ? b(res, req.path) : res;
    },
  };
});

/*
 * What may be null or left out, read from the contract files: every object
 * type written in them, with each field's "can be null" and "can be left
 * out". An answer's object is matched to the smallest contract type that has
 * all its fields, and only that type's nullable fields are bent, so a screen
 * is never blamed for a null the server cannot send.
 */
type Shape = { props: Map<string, { nullable: boolean; optional: boolean }> };
function contractShapes(): Shape[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ts = require("typescript") as typeof import("typescript");
  const files = ["src/api/contract.ts", "src/admin/contract.ts", "src/practise/contract.ts", "src/api/extra.ts", "src/library/meds.ts"];
  const shapes: Shape[] = [];
  for (const f of files) {
    let text = "";
    try {
      text = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    } catch {
      continue;
    }
    const src = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true);
    const visit = (n: import("typescript").Node) => {
      if (ts.isTypeLiteralNode(n) || ts.isInterfaceDeclaration(n)) {
        const props = new Map<string, { nullable: boolean; optional: boolean }>();
        for (const m of n.members) {
          if (!ts.isPropertySignature(m) || !m.name) continue;
          const name = m.name.getText(src).replace(/^["']|["']$/g, "");
          const t = m.type;
          const nullable = !!t && ts.isUnionTypeNode(t) && t.types.some((x) => x.kind === ts.SyntaxKind.LiteralType && (x as import("typescript").LiteralTypeNode).literal.kind === ts.SyntaxKind.NullKeyword);
          props.set(name, { nullable, optional: !!m.questionToken });
        }
        if (props.size) shapes.push({ props });
      }
      ts.forEachChild(n, visit);
    };
    visit(src);
  }
  return shapes;
}
const SHAPES = contractShapes();
function shapeOf(o: Record<string, unknown>): Shape | null {
  const keys = Object.keys(o);
  if (keys.length < 2) return null;
  let best: Shape | null = null;
  for (const s of SHAPES) {
    if (keys.every((k) => s.props.has(k)) && (!best || s.props.size < best.props.size)) best = s;
  }
  return best;
}
const AUTH_PATHS = /^\/auth\//;
const TEXT_KEYS = /^(title|name|body|message|description|tagline|meta|label|text|summary|question|instructions|caption|about|lessonTitle|courseTitle|subtitle|excerpt|preview|note|reason|author|subject|line|hint|detail|status_text|cohort|cohortName|studentName|recipientName|paragraph|greeting|headline|blurb|prompt|why|answer|explanation)$/;
const COUNT_KEYS = /(count|total|points|xp|streak|unread|students|done|best|score|rank|hours|minutes|seconds|questions|size|views|votes|replies|attempts|watched|sizeBytes|duration)$/i;
const LONG = "अनन्या मेहता 🧠 मनोविज्ञान ".repeat(14) + "\u{1F469}\u{1F3FD}‍⚕️ end";

function walk(v: unknown, fn: (key: string, val: unknown, shape: Shape | null) => unknown): unknown {
  if (Array.isArray(v)) return v.map((x) => walk(x, fn));
  if (v && typeof v === "object") {
    const src = v as Record<string, unknown>;
    const shape = shapeOf(src);
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(src)) {
      const next = fn(k, x, shape);
      if (next === DROP) continue;
      o[k] = walk(next, fn);
    }
    return o;
  }
  return v;
}
const DROP = Symbol("drop");

function bend(res: RawResponse, p: string): RawResponse | Promise<RawResponse> {
  const mode = bender.mode;
  if (mode === "none" || AUTH_PATHS.test(p)) return res;
  if (mode === "offline") return Promise.reject(new ApiFailure("network", "No internet. Check your connection and try again."));
  if (mode === "error") return { status: 500, json: { ok: false, error: { code: "server_error", message: "Something went wrong on our side." } } };
  const json = res.json as { ok?: boolean; data?: unknown } | null;
  if (!json || json.ok !== true) return res;
  const data = walk(json.data, (k, x, shape) => {
    const p = shape?.props.get(k);
    if (mode === "empty") return Array.isArray(x) ? [] : x;
    if (mode === "nulls" && p?.nullable && x !== null) {
      bender.bent += 1;
      return null;
    }
    if (mode === "missing" && p?.optional) {
      bender.bent += 1;
      return DROP;
    }
    if (mode === "long") return typeof x === "string" && TEXT_KEYS.test(k) ? LONG : x;
    if (mode === "huge") return typeof x === "number" && COUNT_KEYS.test(k) ? 987654321 : x;
    return x;
  });
  return { status: res.status, json: { ok: true, data } };
}
(globalThis as unknown as { __bend: typeof bend }).__bend = bend;

const params = useLocalSearchParams as jest.Mock;

type Shot = { file: string; params?: Record<string, string> };
const STUDENT: Shot[] = [
  { file: "(student)/home" },
  { file: "(student)/learn" },
  { file: "(student)/library" },
  { file: "(student)/me" },
  { file: "assignments" },
  { file: "certificate/[id]", params: { id: "VIBHA-C2-0123-M1" } },
  { file: "certificates" },
  { file: "course/[courseId]", params: { courseId: "course-1" } },
  { file: "doubt/[id]", params: { id: "d1" } },
  { file: "doubts/ask" },
  { file: "doubts/index" },
  { file: "help" },
  { file: "journey" },
  { file: "lecture/[lessonId]", params: { lessonId: "l5" } },
  { file: "lecture/[lessonId]", params: { lessonId: "l6", tab: "assignment" } },
  { file: "lectures" },
  { file: "map/index" },
  { file: "map/practice" },
  { file: "material/[id]", params: { id: "m1" } },
  { file: "notes/[id]", params: { id: "depression" } },
  { file: "notes/index" },
  { file: "notification/[id]", params: { id: "n1" } },
  { file: "notifications" },
  { file: "progress" },
  { file: "reference/[slug]", params: { slug: "anhedonia" } },
  { file: "reference/index" },
  { file: "saved" },
  { file: "search", params: { q: "dep" } },
  { file: "settings" },
  { file: "study/[moduleId]/[sectionId]", params: { moduleId: "m02", sectionId: "s1" } },
  { file: "study/[moduleId]/checkpoint/[n]", params: { moduleId: "m02", n: "1" } },
  { file: "study/[moduleId]/index", params: { moduleId: "m02" } },
  { file: "study/[moduleId]/test", params: { moduleId: "m01" } },
  { file: "study/index" },
  { file: "verify/[certificateId]", params: { certificateId: "VIBHA-C2-0123-M1" } },
  { file: "wall" },
  { file: "(student)/practise" },
  { file: "shop" },
  { file: "game/leaderboard" },
  { file: "case/library" },
  { file: "game/[id]", params: { id: "blitz" } },
  { file: "game/[id]", params: { id: "sort" } },
  { file: "game/[id]", params: { id: "mse" } },
  { file: "game/[id]", params: { id: "ward" } },
  { file: "game/[id]", params: { id: "rx" } },
  { file: "game/[id]", params: { id: "duel" } },
  { file: "game/[id]", params: { id: "escape" } },
  { file: "game/[id]", params: { id: "comorbid" } },
  { file: "game/[id]", params: { id: "team" } },
  { file: "game/[id]", params: { id: "nope" } },
  { file: "case/[id]", params: { id: "daily" } },
  { file: "case/[id]", params: { id: "detective" } },
  { file: "case/[id]", params: { id: "wwyd" } },
  { file: "case/[id]", params: { id: "two-minute" } },
  { file: "case/[id]", params: { id: "say-it" } },
  { file: "case/[id]", params: { id: "judgment" } },
  { file: "case/[id]", params: { id: "ethics" } },
  { file: "case/[id]", params: { id: "landmark" } },
  { file: "case/[id]", params: { id: "osce" } },
  { file: "case/[id]", params: { id: "mse-trainer" } },
  { file: "case/[id]", params: { id: "formulation" } },
  { file: "case/[id]", params: { id: "out-of-depth" } },
  { file: "case/[id]", params: { id: "weak-spots" } },
  { file: "case/[id]", params: { id: "nope" } },
  { file: "prep/index" },
  { file: "prep/[subject]", params: { subject: "statistics" } },
  { file: "prep/long" },
  { file: "prep/long", params: { subject: "statistics" } },
  { file: "prep/set", params: { subject: "statistics", topic: "descriptives" } },
  { file: "prep/mock/index" },
  { file: "prep/mock/[spec]", params: { spec: "practice-clinical" } },
  { file: "prep/mock/result/[id]", params: { id: "nope" } },
  { file: "medicine/[id]", params: { id: "escitalopram" } },
  { file: "medicine/compare", params: { a: "escitalopram", b: "sertraline" } },
];
const LECTURE: Shot[] = [{ file: "(lecture)/lo/home" }, { file: "(lecture)/lo/lectures" }, { file: "(lecture)/lo/doubts" }, { file: "(lecture)/lo/me" }, { file: "lecture/[lessonId]", params: { lessonId: "l5" } }, { file: "notifications" }, { file: "settings" }, { file: "certificates" }, { file: "search" }];
const ADMIN: Shot[] = [
  { file: "(admin)/(tabs)/admin/home" },
  { file: "(admin)/(tabs)/admin/students" },
  { file: "(admin)/admin/activity" },
  { file: "(admin)/admin/messages" },
  { file: "(admin)/(tabs)/admin/more" },
  { file: "(admin)/admin/alerts" },
  { file: "(admin)/admin/certificates/anyone" },
  { file: "(admin)/admin/certificates/index" },
  { file: "(admin)/admin/certificates/new" },
  { file: "(admin)/admin/cohort/[id]", params: { id: "c2" } },
  { file: "(admin)/admin/cohorts" },
  { file: "(admin)/admin/doubt/[id]", params: { id: "ad1" } },
  { file: "(admin)/admin/doubts" },
  { file: "(admin)/admin/form/[id]", params: { id: "f1" } },
  { file: "(admin)/admin/forms" },
  { file: "(admin)/admin/inbox" },
  { file: "(admin)/admin/people" },
  { file: "(admin)/admin/person/[key]", params: { key: "tanvi@example.com" } },
  { file: "(admin)/admin/review" },
  { file: "(admin)/admin/system" },
  { file: "(admin)/admin/thread/[id]", params: { id: "i1" } },
  { file: "student/[id]", params: { id: "u1" } },
  { file: "compose", params: { to: "u1" } },
  { file: "settings" },
];
const VISITOR: Shot[] = [{ file: "(visitor)/welcome" }, { file: "(visitor)/request" }, { file: "(visitor)/sign-in" }, { file: "setup", params: { token: "abcdef" } }, { file: "forgot-password" }, { file: "verify/[certificateId]", params: { certificateId: "VIBHA-C2-0123-M1" } }];

async function settle() {
  for (let i = 0; i < 6; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}

async function as(email: string | null) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  if (session.store.get().phase === "loading") await session.boot();
  if (email) {
    await session.signIn(email, "pw");
    await session.choosePin("2580");
  }
}

const ROLES: [string, string | null, Shot[]][] = [
  ["student", "ananya@example.com", STUDENT],
  ["lecture-only", "lectures@example.com", LECTURE],
  ["admin", "admin@example.com", ADMIN],
  ["view-only admin", "viewadmin@example.com", ADMIN],
  ["visitor", null, VISITOR],
];
const BENDS: Bend[] = ["none", "empty", "nulls", "missing", "long", "huge", "offline", "error"];

jest.setTimeout(120_000);

describe.each(ROLES)("%s", (_role, email, shots) => {
  beforeAll(async () => {
    bender.mode = "none";
    mock.reset();
    await as(email);
  });
  afterEach(async () => {
    bender.mode = "none";
    await cleanup();
  });

  for (const b of BENDS) {
    it(`every screen draws with ${b} answers`, async () => {
      const failures: string[] = [];
      let drew = 0;
      let bent = 0;
      for (const s of shots) {
        bender.mode = b;
        params.mockReturnValue(s.params ?? {});
        const errors: string[] = [];
        const spy = jest.spyOn(console, "error").mockImplementation((...a: unknown[]) => {
          const t = a.map((x) => (x instanceof Error ? `${x.name}: ${x.message}\n${x.stack?.split("\n").slice(1, 4).join("\n")}` : String(x))).join(" ");
          if (/Error|threw|Cannot read|undefined is not|is not a function|not iterable/.test(t) && !/act\(|wrapped in act|not wrapped/.test(t)) errors.push(t.slice(0, 600));
        });
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const Screen = require(`../app/${s.file}`).default as React.ComponentType;
          await render(<Screen />);
          await settle();
          if (screen.queryAllByText(/./).length > 2) drew += 1;
          if (b === "long" && screen.queryAllByText(/अनन्या/).length) bent += 1;
        } catch (e) {
          errors.push(e instanceof Error ? `${e.name}: ${e.message}\n${e.stack?.split("\n").slice(1, 5).join("\n")}` : String(e));
        } finally {
          spy.mockRestore();
          await cleanup();
        }
        if (errors.length) failures.push(`${s.file} ${JSON.stringify(s.params ?? {})}: ${errors[0]}`);
      }
      bender.mode = "none";
      expect(failures).toEqual([]);
      expect(drew).toBeGreaterThan(shots.length / 2);
      if (b === "long" && email) expect(bent).toBeGreaterThan(0);
      if (b === "nulls" && email) expect(bender.bent).toBeGreaterThan(20);
      bender.bent = 0;
    });
  }
});
