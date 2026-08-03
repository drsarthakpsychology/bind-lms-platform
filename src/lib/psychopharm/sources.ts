/**
 * Source registry — every source id used in extraction, with the metadata the
 * students see and the reviewer needs. Mirrors the planned psych_sources rows.
 * Only named, verified textbooks + ICD/DSM are sources. No Tier-2 web material.
 */
export interface SourceMeta {
  id: string;
  title: string;
  authors: string;
  edition: string;
  year: number;
  publisher: string;
  type: "pharmacology" | "clinical_psychology" | "icd";
  authority_scope: string[];
  local_path?: string;
  is_preview?: boolean; // partial duplicate
}

export const SOURCES: Record<string, SourceMeta> = {
  maudsley_2021: {
    id: "maudsley_2021",
    title: "The Maudsley Prescribing Guidelines in Psychiatry",
    authors: "David M. Taylor, Thomas R. E. Barnes, Allan H. Young",
    edition: "14th",
    year: 2021,
    publisher: "Wiley",
    type: "pharmacology",
    authority_scope: ["mechanism", "dose_range", "dose_bands", "equivalence", "interactions", "side_effects"],
  },
  stahl_pg_7th: {
    id: "stahl_pg_7th",
    title: "Prescriber's Guide (Stahl's Essential Psychopharmacology)",
    authors: "Stephen M. Stahl",
    edition: "7th",
    year: 2021,
    publisher: "Cambridge University Press",
    type: "pharmacology",
    authority_scope: ["mechanism", "receptor_targets", "dose_bands", "half_life", "onset", "interactions", "side_effects", "special_populations"],
  },
  stahl_pg_older: {
    id: "stahl_pg_older",
    title: "Essential Psychopharmacology: The Prescriber's Guide",
    authors: "Stephen M. Stahl",
    edition: "3rd",
    year: 2004,
    publisher: "Cambridge University Press",
    type: "pharmacology",
    authority_scope: ["mechanism", "receptor_targets", "dose_range", "half_life", "side_effects"],
  },
  stahl_pg_preview: {
    id: "stahl_pg_preview",
    title: "Essential Psychopharmacology Prescriber's Guide (preview)",
    authors: "Stephen M. Stahl",
    edition: "~6th (partial preview)",
    year: 0,
    publisher: "Cambridge University Press",
    type: "pharmacology",
    authority_scope: ["mechanism", "dose_range", "side_effects"],
    is_preview: true,
  },
  stahl_essential_5th: {
    id: "stahl_essential_5th",
    title: "Stahl's Essential Psychopharmacology",
    authors: "Stephen M. Stahl",
    edition: "5th",
    year: 2021,
    publisher: "Cambridge University Press",
    type: "pharmacology",
    authority_scope: ["mechanism", "receptor_targets", "class", "learning_layer"],
  },
  kaplan_sadock: {
    id: "kaplan_sadock",
    title: "Kaplan and Sadock's Synopsis of Psychiatry",
    authors: "Robert Boland, Marcia Verduin, Pedro Ruiz",
    edition: "12th",
    year: 2021,
    publisher: "Wolters Kluwer",
    type: "pharmacology",
    authority_scope: ["mechanism", "dose_range", "interactions", "side_effects", "clinical_presentation"],
  },
  ahuja_psychiatry: {
    id: "ahuja_psychiatry",
    title: "A Short Textbook of Psychiatry",
    authors: "Niraj Ahuja",
    edition: "20th edition",
    year: 2010,
    publisher: "Jaypee Brothers Medical Publishers",
    type: "pharmacology",
    authority_scope: ["dose_range", "drug_class", "side_effects"], // Indian practice source
  },
  fish_psychopath: {
    id: "fish_psychopath",
    title: "Fish's Clinical Psychopathology — Signs and Symptoms in Psychiatry",
    authors: "Patricia Casey, Brendan Kelly",
    edition: "3rd",
    year: 2007,
    publisher: "RCPsych Publications",
    type: "clinical_psychology",
    authority_scope: ["presentation", "client_experience", "psychological_observation", "therapist_role"],
  },
  dsm5tr: {
    id: "dsm5tr",
    title: "Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision",
    authors: "American Psychiatric Association",
    edition: "DSM-5-TR",
    year: 2022,
    publisher: "American Psychiatric Association Publishing",
    type: "icd",
    authority_scope: ["condition_naming", "classification"],
  },
  fda_label: {
    id: "fda_label",
    title: "FDA Prescribing Information (DailyMed / Drugs@FDA)",
    authors: "US Food and Drug Administration",
    edition: "current label",
    year: 2025,
    publisher: "US FDA",
    type: "pharmacology",
    authority_scope: ["dose_range", "dose_bands", "interactions", "side_effects", "special_populations"],
  },
  icd11: {
    id: "icd11",
    title: "ICD-11 Reference Guide",
    authors: "World Health Organization",
    edition: "ICD-11",
    year: 2021,
    publisher: "WHO",
    type: "icd",
    authority_scope: ["condition_naming", "classification", "coding"],
  },
};

export function sourceTitle(id: string): string {
  return SOURCES[id]?.title ?? id;
}