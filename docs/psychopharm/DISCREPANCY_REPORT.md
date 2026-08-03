# Discrepancy Report — psychopharm

Every book-vs-Tier-1 (or book-vs-book) mismatch that is logged and escalated,
never silently resolved (Rule 8).

| Drug | Field | Source A | Source B | Discrepancy | Action |
|---|---|---|---|---|---|
| Clonazepam | dose_range (panic) | Stahl PG 7th p514: 0.5–2 mg/day | Maudsley 2021 p136: 0.5–3 mg/day | partial overlap | store union, never average; reviewer decides |

No Tier-1 web cross-check has run yet (see WEB_ACCESS_LOG). Future book-vs-web
mismatches go here: the book value wins for publication, the discrepancy is
surfaced, and the book value is displayed until adjudicated (Rule 8).

## Mechanism-index single-member groups (Task 32)

Groups that survived `normaliseReceptorTag()` with exactly one drug. Most are
genuinely distinct receptors (one drug is the only member), but a few may be
normalisation misses — logged for Dr. Sarthak's review rather than silently
merged.

| Tag | Drug | Notes |
|---|---|---|
| alpha-2 | Mirtazapine | unique |
| Beta-1 and beta-2 adrenergic | Propranolol | unique |
| DA/NE release | Lisdexamfetamine | unique |
| DAT | Modafinil | unique |
| DAT + NET | Methylphenidate | maybe unify with "NET + DAT" (Bupropion)? |
| GABAA (alpha-1 subunit) positive | Zolpidem | unique |
| GABAA positive | Eszopiclone | unique |
| Glutamate (NMDA) modulation | Acamprosate | unique |
| H1 | Cyproheptadine | maybe unify with "H1 histamine" (Hydroxyzine)? |
| H1 histamine | Hydroxyzine | see H1 |
| MT1/MT2 melatonin receptors | Melatonin | unique |
| Mu-opioid receptor | Naltrexone | unique |
| Muscarinic (M1) | Benztropine | unique |
| NET | Atomoxetine | unique |
| NET + DAT | Bupropion | see DAT + NET |
| NMDA glutamate receptor | Memantine | unique |
| SERT + NET | Desvenlafaxine | unique |
| SERT inhibition; sigma-1 | Fluvoxamine | unique |
| SV2A | Levetiracetam | unique |
| Voltage-gated sodium channels | Topiramate | unique |