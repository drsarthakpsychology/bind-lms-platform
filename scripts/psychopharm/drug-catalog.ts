/**
 * Candidate drug catalog for the locator index. Ordered roughly by how
 * commonly each is prescribed in Indian practice (per the addendum, extraction
 * is ordered by prescribing frequency — the reviewer queue sorts by this too).
 *
 * Each entry: generic name + known brand names / aliases. The locator scans
 * the text cache for all of these.
 */

export type DrugCatalogEntry = {
  generic: string;
  aliases: string[];
};

export const DRUG_CATALOG: DrugCatalogEntry[] = [
  // Antidepressants
  { generic: "Fluoxetine", aliases: ["Prozac", "Fludac"] },
  { generic: "Sertraline", aliases: ["Zoloft", "Serenata", "Asentra"] },
  { generic: "Escitalopram", aliases: ["Lexapro", "Nexito", "Cipralex"] },
  { generic: "Paroxetine", aliases: ["Paxil", "Seroxat", "Xet"] },
  { generic: "Citalopram", aliases: ["Celexa", "Cipramil"] },
  { generic: "Fluvoxamine", aliases: ["Luvox", "Uvox"] },
  { generic: "Venlafaxine", aliases: ["Effexor", "Veniz"] },
  { generic: "Desvenlafaxine", aliases: ["Pristiq"] },
  { generic: "Duloxetine", aliases: ["Cymbalta", "Duzela"] },
  { generic: "Mirtazapine", aliases: ["Remeron", "Mirtaz"] },
  { generic: "Bupropion", aliases: ["Wellbutrin", "Zyban", "Bupron"] },
  { generic: "Amitriptyline", aliases: ["Elavil", "Saroten", "Amiline"] },
  { generic: "Nortriptyline", aliases: ["Pamelor"] },
  { generic: "Imipramine", aliases: ["Tofranil"] },
  { generic: "Clomipramine", aliases: ["Anafranil"] },
  { generic: "Trazodone", aliases: ["Desyrel", "Trazonil"] },
  { generic: "Agomelatine", aliases: ["Valdoxan"] },
  { generic: "Vortioxetine", aliases: ["Trintellix", "Brintellix"] },
  // Anxiolytics / benzodiazepines
  { generic: "Diazepam", aliases: ["Valium", "Calmpose"] },
  { generic: "Clonazepam", aliases: ["Klonopin", "Rivotril", "Clonotril", "Epitril"] },
  { generic: "Lorazepam", aliases: ["Ativan", "Lorax"] },
  { generic: "Alprazolam", aliases: ["Xanax", "Alprax"] },
  { generic: "Oxazepam", aliases: ["Serax"] },
  { generic: "Chlordiazepoxide", aliases: ["Librium"] },
  { generic: "Nitrazepam", aliases: ["Mogadon"] },
  { generic: "Temazepam", aliases: ["Restoril"] },
  { generic: "Buspirone", aliases: ["Buspar"] },
  { generic: "Etizolam", aliases: ["Etizest"] },
  // Antipsychotics
  { generic: "Risperidone", aliases: ["Risperdal", "Sizodon", "Rispolept"] },
  { generic: "Olanzapine", aliases: ["Zyprexa", "Oleanz"] },
  { generic: "Quetiapine", aliases: ["Seroquel", "Seroquel XR"] },
  { generic: "Aripiprazole", aliases: ["Abilify", "Arip MT"] },
  { generic: "Haloperidol", aliases: ["Haldol", "Serenace"] },
  { generic: "Clozapine", aliases: ["Clozaril", "Leponex"] },
  { generic: "Amisulpride", aliases: ["Solian"] },
  { generic: "Ziprasidone", aliases: ["Geodon"] },
  { generic: "Paliperidone", aliases: ["Invega"] },
  { generic: "Lurasidone", aliases: ["Latuda"] },
  { generic: "Fluphenazine", aliases: ["Prolixin"] },
  { generic: "Trifluoperazine", aliases: ["Stelazine", "Neocalm"] },
  { generic: "Chlorpromazine", aliases: ["Largactil", "Thorazine"] },
  { generic: "Pimozide", aliases: ["Orap"] },
  { generic: "Sulpiride", aliases: ["Dogmatil"] },
  // Mood stabilizers / anticonvulsants
  { generic: "Lithium", aliases: ["Lithosun", "Lithobid"] },
  { generic: "Valproate", aliases: ["Valproic acid", "Depakote", "Valparin", "Divalproex"] },
  { generic: "Carbamazepine", aliases: ["Tegretol", "Mazepine"] },
  { generic: "Oxcarbazepine", aliases: ["Trileptal"] },
  { generic: "Lamotrigine", aliases: ["Lamictal", "Lametec"] },
  { generic: "Topiramate", aliases: ["Topamax"] },
  { generic: "Gabapentin", aliases: ["Neurontin"] },
  { generic: "Pregabalin", aliases: ["Lyrica"] },
  { generic: "Levetiracetam", aliases: ["Keppra"] },
  // ADHD
  { generic: "Methylphenidate", aliases: ["Ritalin", "Concerta", "Inspiral"] },
  { generic: "Atomoxetine", aliases: ["Strattera", "Axot"] },
  { generic: "Modafinil", aliases: ["Provigil"] },
  // Sedative-hypnotics
  { generic: "Zolpidem", aliases: ["Ambien", "Zolt"] },
  { generic: "Zopiclone", aliases: ["Imovane", "Zopiclone"] },
  { generic: "Eszopiclone", aliases: ["Lunesta"] },
  { generic: "Melatonin", aliases: [] },
  // Others
  { generic: "Phenelzine", aliases: ["Nardil"] },
  { generic: "Tranylcypromine", aliases: ["Parnate"] },
  { generic: "Moclobemide", aliases: ["Aurorix"] },
  { generic: "Naltrexone", aliases: ["Revia"] },
  { generic: "Acamprosate", aliases: ["Campral"] },
  { generic: "Disulfiram", aliases: ["Antabuse"] },
  { generic: "Donepezil", aliases: ["Aricept"] },
  { generic: "Rivastigmine", aliases: ["Exelon"] },
  { generic: "Memantine", aliases: ["Namenda"] },
  { generic: "Levodopa", aliases: ["Sinemet"] },
  { generic: "Propranolol", aliases: ["Inderal"] },
  { generic: "Prazosin", aliases: ["Minipress"] },
  { generic: "Cyproheptadine", aliases: ["Periactin"] },
  { generic: "Hydroxyzine", aliases: ["Atarax", "Vistaril"] },
  // Non-US / off-market agents — covered by Maudsley/Stahl/Kaplan/Ahuja (no FDA label).
  // Antidepressants (TCAs, MAOI-adjacent, non-US)
  { generic: "Dothiepin", aliases: ["Dosulepin", "Prothiaden"] },
  { generic: "Lofepramine", aliases: ["Gamanil"] },
  { generic: "Maprotiline", aliases: ["Ludiomil"] },
  { generic: "Mianserin", aliases: ["Tolvon"] },
  { generic: "Reboxetine", aliases: ["Edronax"] },
  { generic: "Tianeptine", aliases: ["Stablon", "Coaxil"] },
  { generic: "Amphetamine (D,L)", aliases: ["Adderall", "Mixed amphetamine salts", "Dexamphetamine"] },
  // Antipsychotics (typical + atypical, non-US)
  { generic: "Blonanserin", aliases: ["Lonasen"] },
  { generic: "Cyamemazine", aliases: ["Tercian"] },
  { generic: "Flupenthixol", aliases: ["Flupentixol", "Fluanxol"] },
  { generic: "Perospirone", aliases: ["Lullan"] },
  { generic: "Pipothiazine", aliases: ["Piportil"] },
  { generic: "Sertindole", aliases: ["Serdolect"] },
  { generic: "Zotepine", aliases: ["Nipolept", "Lodopin"] },
  { generic: "Zuclopenthixol", aliases: ["Zuclopentixol", "Clopixol"] },
  // Sedative-hypnotics / other non-US
  { generic: "Flunitrazepam", aliases: ["Rohypnol"] },
  { generic: "Loflazepate", aliases: ["Victan"] },
  // Combination / adjunct agents
  { generic: "Brexanolone", aliases: ["Zulresso"] },
  { generic: "Caprylidene", aliases: ["Axona"] },
  { generic: "Diphenhydramine", aliases: ["Benadryl"] },
  { generic: "Methylphenidate (D,L)", aliases: ["Ritalin", "Concerta"] },
  { generic: "Naltrexone/Bupropion", aliases: ["Contrave"] },
  { generic: "Phentermine/topiramate", aliases: ["Qsymia"] },
];
