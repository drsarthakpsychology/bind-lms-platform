// MOCK DATA: design phase only. See docs/DESIGN.md, To connect.
//
// "By how they work" on the Medicines list. The app has no hook for this yet.
// The server already has it: GET /library/reference answers `byMechanism`
// (src/lib/app-api/library.ts, from mechanismIndex() in
// src/lib/psychopharm/store.ts). These groups were copied from the targets of
// the sample medicines the app's own mock server serves (website data in
// src/lib/meds/mechanisms.ts); nothing here was written fresh. Replace with
// the server's groups when it is connected.

export type MechanismGroup = {
  /** What the medicine acts on, and how. */
  tag: string;
  /** One plain line under the tag. */
  plain: string;
  meds: { id: string; qualifier?: string }[];
};

export const MECHANISM_GROUPS: MechanismGroup[] = [
  { tag: "Serotonin pump (SERT)", plain: "Reuptake inhibition", meds: [{ id: "escitalopram" }, { id: "sertraline" }, { id: "fluoxetine" }, { id: "venlafaxine" }] },
  { tag: "Noradrenaline pump (NET)", plain: "Reuptake inhibition", meds: [{ id: "venlafaxine", qualifier: "Rising with dose" }, { id: "methylphenidate" }] },
  { tag: "Dopamine pump (DAT)", plain: "Reuptake inhibition", meds: [{ id: "methylphenidate" }, { id: "sertraline", qualifier: "Weak, at higher doses" }] },
  { tag: "Dopamine D2", plain: "Antagonist", meds: [{ id: "olanzapine" }, { id: "risperidone" }, { id: "clozapine", qualifier: "Weak, fast-off" }] },
  { tag: "Dopamine D2 and D3", plain: "Partial agonist", meds: [{ id: "aripiprazole" }] },
  { tag: "Serotonin 5-HT2A", plain: "Antagonist", meds: [{ id: "olanzapine" }, { id: "risperidone" }, { id: "aripiprazole" }, { id: "clozapine" }, { id: "mirtazapine" }] },
  { tag: "GABA-A receptor (benzodiazepine site)", plain: "Positive allosteric modulator", meds: [{ id: "clonazepam" }, { id: "zolpidem", qualifier: "Alpha1-preferring" }] },
  { tag: "Voltage-gated sodium channels", plain: "Block", meds: [{ id: "valproate" }, { id: "lamotrigine" }] },
  { tag: "Histamine H1", plain: "Antagonist", meds: [{ id: "mirtazapine" }, { id: "olanzapine" }, { id: "clozapine" }] },
  { tag: "Muscarinic M1 to M3", plain: "Antagonist", meds: [{ id: "trihexyphenidyl" }, { id: "olanzapine" }, { id: "clozapine" }] },
  { tag: "Alpha-2 adrenergic", plain: "Antagonist", meds: [{ id: "mirtazapine" }] },
  { tag: "Beta-1 and beta-2 adrenergic", plain: "Antagonist", meds: [{ id: "propranolol" }] },
  { tag: "Acetylcholinesterase", plain: "Reversible inhibition", meds: [{ id: "donepezil" }] },
  { tag: "Inositol monophosphatase and GSK-3 beta", plain: "Inhibition", meds: [{ id: "lithium" }] },
];
