/** A generator reply that passes every rule for an Indian, level-2 MDD case. Test data only. */
export const GOOD_MDD = {
  place: "Indore · district hospital OPD",
  clues: [
    "Meena, 41, a school teacher, comes with her husband. She says she feels low and empty most of the day.",
    "For the last six weeks she has stopped enjoying her garden and her evening serials.",
    "She wakes at 4 a.m. and cannot get back to sleep. She has lost 4 kg because she hardly eats.",
    "She feels tired all day and says she is a burden to her family.",
    "She cannot focus on a page long enough to correct her students' notebooks.",
    "She has never had a spell of feeling unusually high or needing little sleep.",
  ],
  investigations: [
    { kind: "mse", label: "Mood and affect", result: "Says her mood is 'very down'. Affect is sad and restricted; she is tearful at times." },
    { kind: "collateral", label: "Ask her husband", result: "He says she was cheerful and active until two months ago and has never had a period of being overexcited." },
    { kind: "lab", label: "Blood tests", result: "Thyroid, blood count and B12 are all normal." },
  ],
  differentials: [
    { dx: "bipolar-2", whyNot: "She has never had a spell of raised mood or little need for sleep, so there is no past hypomania." },
    { dx: "depression-medical", whyNot: "Her thyroid, blood count and B12 are normal, so no medical cause explains the mood." },
    { dx: "pdd", whyNot: "It has lasted six weeks, far short of the two years needed for the persistent type." },
  ],
  pointer: "Count the symptoms present together, and check how long they have lasted.",
  overview:
    "This picture needs five or more of the nine symptoms on most days for at least two weeks, with low mood or loss of interest among them. Meena has low mood, loss of interest, early waking, weight loss, tiredness, feeling a burden and poor focus. A normal thyroid and blood count rule out a medical cause, and no past highs rule out the bipolar spectrum.",
  duration: { value: 6, unit: "weeks" },
};
