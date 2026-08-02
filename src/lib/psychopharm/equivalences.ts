/**
 * Published dose equivalences — Pass B (cross-cutting table extraction).
 *
 * ONLY published equivalence tables from the sources are stored here. These are
 * quoted verbatim with their source, context and caveat (Rule C2). We NEVER
 * compute, interpolate, or convert an equivalence. If a source gives no number,
 * no number appears.
 *
 * Sources:
 *   - Maudsley Prescribing Guidelines 2021, Table 1.2 (FGA equivalents), p35
 *   - Maudsley Prescribing Guidelines 2021, Table 1.3 (SGA equivalents), p36
 *   - Maudsley 2021 p463 benzodiazepine "diazepam-equivalent" doses
 */
export type PublishedEquivalence = {
  drug_a: string;
  drug_b: string;
  /** widget: e.g. drug_a X ≈ drug_b Y, quoted as in the table. */
  statement: string;
  /** exact source words (reviewer provenance). */
  quote: string;
  source_id: string;
  page_ref: string;
  context: string;
  caveat: string;
};

const CAVEAT =
  "A rough guide from the source, not a swap instruction. Only a prescriber decides this.";

/** Maudsley Table 1.2 — FGA equivalents (chlorpromazine-equivalent basis). */
const FGA_EQUIV: PublishedEquivalence[] = [
  {
    drug_a: "Chlorpromazine", drug_b: "Haloperidol",
    statement: "chlorpromazine 100 mg ≈ haloperidol 2 mg",
    quote: "Chlorpromazine 100mg/day; Haloperidol 2mg/day (1.5–5mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics (consensus mg/day).",
    caveat: CAVEAT,
  },
  {
    drug_a: "Chlorpromazine", drug_b: "Fluphenazine",
    statement: "chlorpromazine 100 mg ≈ fluphenazine 2 mg",
    quote: "Fluphenazine 2mg/day (1–5mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics.",
    caveat: CAVEAT,
  },
  {
    drug_a: "Chlorpromazine", drug_b: "Trifluoperazine",
    statement: "chlorpromazine 100 mg ≈ trifluoperazine 5 mg",
    quote: "Trifluoperazine 5mg/day (2.5–5mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics.",
    caveat: CAVEAT,
  },
  {
    drug_a: "Chlorpromazine", drug_b: "Sulpiride",
    statement: "chlorpromazine 100 mg ≈ sulpiride 200 mg",
    quote: "Sulpiride 200mg/day (133–300mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics.",
    caveat: CAVEAT,
  },
  {
    drug_a: "Chlorpromazine", drug_b: "Pimozide",
    statement: "chlorpromazine 100 mg ≈ pimozide 2 mg",
    quote: "Pimozide 2mg/day (1.33–2mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics.",
    caveat: CAVEAT,
  },
  {
    drug_a: "Chlorpromazine", drug_b: "Perphenazine",
    statement: "chlorpromazine 100 mg ≈ perphenazine 10 mg",
    quote: "Perphenazine 10mg/day (5–10mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics.",
    caveat: CAVEAT,
  },
  {
    drug_a: "Chlorpromazine", drug_b: "Zuclopenthixol",
    statement: "chlorpromazine 100 mg ≈ zuclopenthixol 25 mg",
    quote: "Zuclopenthixol 25mg/day (25–60mg/day)",
    source_id: "maudsley_2021", page_ref: "p35",
    context: "Table 1.2 Equivalent doses of first-generation antipsychotics.",
    caveat: CAVEAT,
  },
];

/** Maudsley Table 1.3 — SGA approximate equivalent oral doses (DAILY). */
export const SGA_EQUIV: PublishedEquivalence[] = [
  { drug_a: "Olanzapine", drug_b: "Risperidone",
    statement: "olanzapine 10 mg ≈ risperidone 4 mg",
    quote: "Olanzapine 10mg; Risperidone oral 4mg",
    source_id: "maudsley_2021", page_ref: "p36",
    context: "Second-generation antipsychotic ~equivalent daily oral doses (Table 1.3).",
    caveat: CAVEAT },
  { drug_a: "Aripiprazole", drug_b: "Quetiapine", statement: "aripiprazole 15 mg ≈ quetiapine 400 mg",
    quote: "Aripiprazole 15mg; Quetiapine 400mg", source_id: "maudsley_2021", page_ref: "p36",
    context: "SGA ~equivalent daily oral doses (Table 1.3).", caveat: CAVEAT },
  { drug_a: "Risperidone", drug_b: "Aripiprazole", statement: "risperidone 4 mg ≈ aripiprazole 15 mg",
    quote: "Risperidone oral 4mg; Aripiprazole 15mg", source_id: "maudsley_2021", page_ref: "p36",
    context: "SGA ~equivalent daily oral doses (Table 1.3).", caveat: CAVEAT },
];

/** Maudsley p463 — benzodiazepine "diazepam-equivalent" doses. */
export const BZD_EQUIV: PublishedEquivalence[] = [
  { drug_a: "Clonazepam", drug_b: "Diazepam", statement: "clonazepam 0.5 mg ≈ diazepam 10 mg",
    quote: "Diazepam-equivalent doses: Clonazepam 0.5mg, Diazepam 10mg", source_id: "maudsley_2021", page_ref: "p463",
    context: "Benzodiazepine diazepam-equivalent doses table.", caveat: CAVEAT },
  { drug_a: "Lorazepam", drug_b: "Diazepam", statement: "lorazepam 1 mg ≈ diazepam 10 mg",
    quote: "Diazepam-equivalent doses: Lorazepam 1mg, Diazepam 10mg", source_id: "maudsley_2021", page_ref: "p463",
    context: "Benzodiazepine diazepam-equivalent doses table.", caveat: CAVEAT },
];

export const ALL_EQUIVALENCES: PublishedEquivalence[] = [
  ...FGA_EQUIV, ...SGA_EQUIV, ...BZD_EQUIV,
];