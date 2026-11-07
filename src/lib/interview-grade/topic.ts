/**
 * Which learner topic a simulated patient belongs to, for the student model
 * skills "<topic>:apply" and "<topic>:risk". Read from the case's own words;
 * "interview-mse" when nothing matches.
 */
const MAP: [RegExp, string][] = [
  [/\b(bipolar|mani[ac]|hypomani)/i, "bipolar"],
  [/\b(schizo|psychos|psychotic|delusion|hallucinat|voices)/i, "psychosis"],
  [/\b(alcohol|substance|cannabis|opioid|heroin|withdrawal|drinking|ganja|bhang)/i, "substance"],
  [/\b(dementia|delirium|neurocognitive|memory loss|confusion)/i, "neurocognitive"],
  [/\b(ocd|obsess|compuls)/i, "ocd"],
  [/\b(ptsd|trauma|assault|accident|grief|bereave|adjustment)/i, "trauma"],
  [/\b(panic|anxiety|anxious|phobi|worr)/i, "anxiety"],
  [/\b(depress|low mood|dysthymi)/i, "depression"],
  [/\b(personality|borderline|antisocial)/i, "personality"],
  [/\b(child|adolescen|teen|school refus|adhd|autis)/i, "child"],
  [/\b(suicid|self-harm|overdose)/i, "suicide"],
];

export function topicForCase(text: string): string {
  for (const [re, topic] of MAP) if (re.test(text)) return topic;
  return "interview-mse";
}
