/**
 * The placement quiz: 18 one-tap questions across every topic, so the map
 * starts from a real picture instead of all "Not started".
 * - One question per topic, plus a second one for the biggest topics.
 * - Multiple-choice questions (true/false only for a topic that has no other kind).
 * - Each topic's answers give a starting ability (theta) for that topic's
 *   skills; nothing already practised is overwritten.
 * Pure functions only.
 */
import { estimateTheta } from "./elo";
import { BANK, TOPICS, bankItem, gradeChoice, topicById, type BankItem, type Choice } from "./topics";

export const PLACEMENT_SIZE = 18;
/** Topics that get a second question, in this order, until the quiz is full. */
const SECOND_ROUND = ["depression", "bipolar", "psychosis", "anxiety", "antidepressants", "interview-mse"];

export type PlacementAnswer = { item: string; choice: Choice };
export type TopicLevel = "strong" | "okay" | "weak";
export type PlacementTopic = { topic: string; title: string; right: number; total: number; theta: number; level: TopicLevel };
export type PlacementResult = { version: 1; answered: number; right: number; topics: PlacementTopic[] };

/** Multiple-choice questions for a topic; true/false only if it has none. */
function mcqsOf(topic: string): BankItem[] {
  const mine = BANK.filter((b) => b.topic === topic);
  const mcq = mine.filter((b) => b.item.kind === "mcq");
  return mcq.length ? mcq : mine;
}

/** The fixed question list (same for everyone, so results compare fairly). */
export function placementItems(size = PLACEMENT_SIZE): BankItem[] {
  const out: BankItem[] = [];
  for (const t of TOPICS) {
    const first = mcqsOf(t.id)[0];
    if (first) out.push(first);
  }
  for (const id of SECOND_ROUND) {
    if (out.length >= size) break;
    const have = new Set(out.map((b) => b.item.id));
    const firstSkill = out.find((b) => b.topic === id)?.skill;
    const pool = mcqsOf(id).filter((b) => !have.has(b.item.id));
    const next = pool.find((b) => b.skill !== firstSkill) ?? pool[0];
    if (next) out.push(next);
  }
  // Mix topics so it never feels like a block of one subject.
  const half = Math.ceil(out.length / 2);
  const mixed: BankItem[] = [];
  for (let i = 0; i < half; i++) {
    mixed.push(out[i]);
    if (out[i + half]) mixed.push(out[i + half]);
  }
  return mixed.slice(0, size);
}

export function levelOf(theta: number): TopicLevel {
  if (theta >= 0.5) return "strong";
  if (theta <= -0.5) return "weak";
  return "okay";
}

/**
 * Grade the answers (on the server, from the content itself) and estimate a
 * starting ability per topic. `difficulty` gives known question difficulties.
 */
export function scorePlacement(answers: PlacementAnswer[], difficulty: (item: string) => number = () => 0): PlacementResult {
  const allowed = new Set(placementItems().map((b) => b.item.id));
  const seen = new Set<string>();
  const byTopic = new Map<string, { b: number; outcome: number }[]>();
  let right = 0;
  for (const a of answers) {
    if (!allowed.has(a.item) || seen.has(a.item)) continue;
    seen.add(a.item);
    const b = bankItem(a.item);
    if (!b) continue;
    const ok = gradeChoice(b.item, a.choice).ok;
    if (ok) right++;
    byTopic.set(b.topic, [...(byTopic.get(b.topic) ?? []), { b: difficulty(a.item), outcome: ok ? 1 : 0 }]);
  }
  const topics: PlacementTopic[] = [...byTopic.entries()].map(([topic, list]) => {
    const theta = estimateTheta(list);
    return { topic, title: topicById(topic)?.title ?? topic, right: list.filter((x) => x.outcome === 1).length, total: list.length, theta, level: levelOf(theta) };
  });
  topics.sort((x, y) => y.theta - x.theta || x.title.localeCompare(y.title));
  return { version: 1, answered: seen.size, right, topics };
}

export function strengths(r: PlacementResult): PlacementTopic[] {
  return r.topics.filter((t) => t.level === "strong");
}

export function weaknesses(r: PlacementResult): PlacementTopic[] {
  return r.topics.filter((t) => t.level === "weak").reverse();
}
