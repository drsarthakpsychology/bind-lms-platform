import { BookOpen, Brain, Clock, DoorOpen, Gauge, GraduationCap, Hospital, Languages, Layers, LayoutGrid, ListChecks, MessagesSquare, Pill, Scale, ScanEye, Search, Shuffle, Sun, Swords, Target, Timer, TriangleAlert, Trophy, Wand2 } from "lucide-react-native";
import * as React from "react";

import type { Icon } from "./catalog";

const MAP: Record<Icon, typeof Timer> = {
  timer: Timer,
  grid: LayoutGrid,
  scan: ScanEye,
  hospital: Hospital,
  pill: Pill,
  swords: Swords,
  door: DoorOpen,
  layers: Layers,
  pair: Shuffle,
  sun: Sun,
  search: Search,
  chat: MessagesSquare,
  words: Languages,
  gauge: Gauge,
  scale: Scale,
  cap: GraduationCap,
  clock: Clock,
  wand: Wand2,
  alert: TriangleAlert,
  target: Target,
  brain: Brain,
  book: BookOpen,
  trophy: Trophy,
  list: ListChecks,
};

export function EntryIcon({ icon, size = 20, color }: { icon: Icon; size?: number; color: string }) {
  const C = MAP[icon];
  return <C size={size} color={color} />;
}
