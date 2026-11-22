import { BookOpenText, ClipboardCheck, FlaskConical, MessagesSquare, Scale, Wind } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Label } from "@/ds";
import { CASEBOOK } from "@/casebook/mock";
import { space } from "@/theme";
import { EXPERIMENTS } from "./mock";
import { EntryCard } from "./shell";

/**
 * Drop-in entry cards for the screens in this area. Each is self-contained
 * (a stone that grows into its screen) and needs no props:
 *
 *   import { PractiseExtras, WellbeingExtras } from "@/lab/entries";
 *   <PractiseExtras />     Practise tab: Casebook, Lab, Ethics, Mock interview
 *   <WellbeingExtras />    Practise tab (last group) or Today: Calm, Self-checks
 *
 * or one at a time: <LabEntry />, <CasebookEntry tall />, ...
 */
type P = { tall?: boolean };
export const LabEntry = ({ tall }: P) => <EntryCard tall={tall} testID="entry-lab" icon={FlaskConical} area="practise" title="Psychology Lab" meta={tall ? `${EXPERIMENTS.length} experiments` : `${EXPERIMENTS.length} experiments to run on yourself`} href="/lab" />;
export const CasebookEntry = ({ tall }: P) => <EntryCard tall={tall} testID="entry-casebook" icon={BookOpenText} area="practise" title="Casebook" meta={tall ? `${CASEBOOK.length} cases` : "Short cases to read and reason through"} href="/casebook" />;
export const EthicsEntry = ({ tall }: P) => <EntryCard tall={tall} testID="entry-ethics" icon={Scale} area="practise" title={tall ? "Ethics and law" : "Ethics, law and referral"} meta={tall ? "3 new each day" : "Decide first, then the law behind it"} href="/ethics" />;
export const InterviewEntry = ({ tall }: P) => <EntryCard tall={tall} testID="entry-interview" icon={MessagesSquare} area="practise" title="Mock interview" meta={tall ? "5 questions" : "Five questions, the way a panel asks them"} href="/interview" />;
export const CalmEntry = ({ tall }: P) => <EntryCard tall={tall} testID="entry-calm" icon={Wind} area="me" title="Calm" meta={tall ? "Breathe, ground" : "Breathing, grounding and more"} href="/calm" />;
export const SelfCheckEntry = ({ tall }: P) => <EntryCard tall={tall} testID="entry-selfcheck" icon={ClipboardCheck} area="me" title="Self-checks" meta={tall ? "6 short checks" : "Short questionnaires, scored on your phone"} href="/selfcheck" />;

/** For the Practise tab: two shelves side by side, then two wide rows. */
export function PractiseExtras({ label = "Read and reason" }: { label?: string | null }) {
  return (
    <View testID="practise-extras" style={{ gap: space[3] }}>
      {label ? <Label>{label}</Label> : null}
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <CasebookEntry tall />
        <LabEntry tall />
      </View>
      <EthicsEntry />
      <InterviewEntry />
    </View>
  );
}

/** Calm and the self-checks, side by side. */
export function WellbeingExtras({ label = "Take a breath" }: { label?: string | null }) {
  return (
    <View testID="wellbeing-extras" style={{ gap: space[3] }}>
      {label ? <Label>{label}</Label> : null}
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <CalmEntry tall />
        <SelfCheckEntry tall />
      </View>
    </View>
  );
}
