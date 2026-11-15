import { Award, BarChart3, Medal, Bell, BookOpen, ClipboardCheck, Gamepad2, Layers, MessageCircleQuestion, NotebookPen, Pill, Play, Route, Settings, Sparkles, Stethoscope, Sun, Target, Trophy, type LucideIcon } from "lucide-react";
import type { HubGroup } from "@/components/navigation/v2-config";
import { Row, RowList, Section } from "./index";

/** Icons for hub rows (server side; the client nav has its own map). */
export const HUB_ICONS: Record<string, LucideIcon> = {
  play: Play,
  bookOpen: BookOpen,
  notebook: NotebookPen,
  layers: Layers,
  sun: Sun,
  stethoscope: Stethoscope,
  gamepad: Gamepad2,
  target: Target,
  sparkles: Sparkles,
  clipboardCheck: ClipboardCheck,
  chart: BarChart3,
  route: Route,
  award: Award,
  medal: Medal,
  trophy: Trophy,
  doubt: MessageCircleQuestion,
  bell: Bell,
  settings: Settings,
  pill: Pill,
};

/** A hub screen's body: each group a heading over hairline rows. */
export function HubGroups({ groups }: { groups: HubGroup[] }) {
  return (
    <>
      {groups.map((g) => (
        <Section key={g.title} id={g.title.toLowerCase().replace(/\W+/g, "-")} title={g.title}>
          <RowList>
            {g.rows.map((r) => {
              const Icon = HUB_ICONS[r.icon] ?? BookOpen;
              return <Row key={r.href} href={r.href} icon={<Icon />} title={r.label} external={r.external} />;
            })}
          </RowList>
        </Section>
      ))}
    </>
  );
}
