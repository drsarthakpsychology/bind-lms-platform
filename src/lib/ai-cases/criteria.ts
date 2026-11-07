/**
 * The criteria checklist behind every AI case. For each diagnosis we can
 * generate, it says what the case text MUST show (so the right answer really
 * is supported) and, for each look-alike, the fact that rules it out (so the
 * look-alike really isn't supported).
 *
 * Checks are plain text rules over the clues and investigation results. A
 * symptom rule doesn't count when the sentence negates it ("no sleep
 * problems"); a rule-out rule is usually a negation itself, so it isn't
 * negation-checked. Thresholds follow DSM-5-TR (the same ones the Daily Case
 * game uses in src/lib/games/diagnoses.ts).
 */
import type { Chapter } from "./types";

export type Rule = {
  id: string;
  /** Plain words, shown to the generator and in rejection reasons. */
  label: string;
  /** Example wording the generator can use. */
  hint: string;
  any: RegExp[];
  /** False for rule-out facts that are negations by nature. Default true. */
  negatable?: boolean;
};

export type DxCriteria = {
  dx: string;
  name: string;
  chapter: Chapter;
  module: string;
  topic: string;
  /** Words that would give the answer away in clues, labels or the pointer. */
  leak: string[];
  /** At least one of these must be shown. */
  core?: string[];
  /** All of these must be shown. */
  all: string[];
  /** At least n of these must be shown (each by its own text). */
  minOf?: { n: number; ids: string[] };
  /** How long the illness has lasted, in days (inclusive). */
  duration?: { minDays: number; maxDays: number; label: string };
  /** Look-alikes the case must rule out, each by one rule. */
  lookAlikes: { dx: string; rule: string }[];
};

/* --------------------------------------------------------------- rules */

const r = (id: string, label: string, hint: string, any: RegExp[], negatable = true): Rule => ({ id, label, hint, any, negatable });

export const RULES: Record<string, Rule> = Object.fromEntries(
  [
    // Mood
    r("low-mood", "low or sad mood most of the day", "'feels low/empty/sad', 'cries most evenings'", [/\b(low|sad|down|empty|hopeless|tearful|miserable|udaas|gloomy)\b/i, /\bcr(y|ies|ied|ying)\b/i, /\bdepressed mood\b/i]),
    r("anhedonia", "loss of interest or pleasure", "'stopped enjoying', 'no interest in'", [/(no longer|stopped|lost|losing) (any )?(interest|enjoy|pleasure)/i, /no (interest|pleasure|joy)/i, /(doesn'?t|does not|can'?t|cannot) enjoy/i, /nothing (is |feels )?(fun|enjoyable)/i, /anhedoni/i]),
    r("sleep", "a sleep change", "'wakes at 4 a.m.', 'sleeps 12 hours'", [/\bsleep/i, /insomni/i, /\bwak(e|es|ing)\b/i, /hypersomni/i]),
    r("appetite", "appetite or weight change", "'has lost 4 kg', 'hardly eats'", [/appetite/i, /\bweight\b/i, /\b\d+ ?(kg|kilos?)\b/i, /(hardly|barely|not) eat/i, /eat(s|ing)? (less|more|very little)/i]),
    r("energy", "tiredness or low energy", "'no energy', 'tired all day'", [/energy/i, /\btired/i, /fatigue/i, /exhaust/i]),
    r("worth", "worthlessness or guilt", "'feels a burden', 'blames herself'", [/guilt/i, /worthless/i, /\bburden\b/i, /blam(e|es|ing) (him|her|them)sel/i, /\bfailure\b/i]),
    r("concentration", "poor concentration or indecision", "'can't focus on a page'", [/concentrat/i, /\bfocus/i, /indecis/i, /(can'?t|cannot|unable to) (decide|think)/i]),
    r("psychomotor", "slowed or restless movement", "'speaks and moves slowly'", [/\bslow(ed|ly)?\b/i, /psychomotor/i, /agitat/i, /restless/i, /pac(es|ing)\b/i]),
    r("death-thoughts", "thoughts of death", "'wishes she wouldn't wake up'", [/\bdeath\b/i, /\bdie\b/i, /suicid/i, /not (wake|be here|being here)/i, /end (it|(his|her|my|their) life)/i, /better off without/i]),
    r("hopeless", "hopelessness", "'nothing will change'", [/hopeless/i, /nothing will (change|get better)/i, /no future/i, /\bpointless\b/i]),
    r("no-highs", "no past highs (no hypomania or mania)", "'has never had a spell of feeling unusually high or needing little sleep'", [/(never|no|denies|without)\b.{0,60}\b(highs?|hypomani|mani[ac]|elat|euphori|wired|little sleep|less sleep)/i], false),
    r("normal-labs", "a medical cause checked and not found", "'thyroid, blood count and B12 are normal'", [/(thyroid|tsh|t4|blood (count|tests?|sugar)|b12|labs?|investigations?|hb|haemoglobin|hemoglobin|cbc|scan|ecg).{0,60}(normal|unremarkable|within (the )?(normal )?(range|limits)|negative)/i, /normal (thyroid|tsh|blood|labs?)/i], false),
    r("never-full", "never enough symptoms for a full episode", "'has never had five or more symptoms together'", [/never (had|met|reached|been).{0,60}(full|five|5|major|severe|episode)/i, /no (full|major|severe).{0,20}episode/i, /(not|never) enough symptoms/i], false),

    // Mania
    r("high-mood", "raised, expansive or irritable mood", "'on top of the world', 'snaps at everyone'", [/elat/i, /euphori/i, /on top of the world/i, /irritab/i, /expansive/i, /unusually (happy|cheerful|high)/i, /\bhigh\b/i]),
    r("more-energy", "more energy or activity", "'full of energy', 'started three new projects'", [/(full of|more|boundless|lots of|extra) energy/i, /(more|very|over) active/i, /(new|several|many|three|five) (projects|plans|businesses)/i, /(never|not) (feels? )?tired/i]),
    r("grandiose", "grandiose ideas", "'says he will be prime minister'", [/grand/i, /\bspecial (powers|mission)\b/i, /\bchosen\b/i, /\bgenius\b/i, /(will be|is going to be) (famous|rich|prime minister|a star|the best)/i, /\bpowers\b/i]),
    r("less-sleep", "needs little sleep", "'sleeps two hours and feels rested'", [/(little|no|two|three|2|3|few) hours?( of)? sleep/i, /sleep(s|ing)? (only )?(two|three|2|3|a few) hours/i, /(doesn'?t|didn'?t|does not) (need|feel the need)( to)? sleep/i, /without (any )?sleep/i, /no need (for|to) sleep/i]),
    r("pressured-speech", "fast, pressured talk", "'talks non-stop, hard to interrupt'", [/talk(s|ing)? (very )?(fast|non-?stop|rapidly|constantly|loudly)/i, /pressur/i, /(hard|difficult|impossible) to interrupt/i, /speech (is )?(rapid|fast)/i]),
    r("racing", "racing thoughts", "'jumps from topic to topic'", [/racing/i, /flight of ideas/i, /jump(s|ing)? from/i, /topic to topic/i]),
    r("distractible", "easily distracted", "'distracted by every sound'", [/distract/i]),
    r("risky", "risky spending or behaviour", "'spent his savings on a car'", [/\bspen[dt]/i, /\bloans?\b/i, /credit card/i, /\bbought\b/i, /reckless/i, /gambl/i, /savings/i]),
    r("severe-mania", "severe enough to need admission or wreck work", "'was admitted', 'lost his job'", [/admit/i, /hospital/i, /police/i, /lost (his|her|their) job/i, /\bfired\b/i, /suspend/i, /(could|can)( no longer|'?t|not) (work|function)/i], false),
    r("no-substance", "no drugs or alcohol to explain it", "'drug screen negative, does not drink'", [/(no|denies|never|without).{0,40}(alcohol|drugs?|substances?|cannabis|ganja|bhang|stimulant|meth|cocaine|amphetamine)/i, /(drug|urine|toxicology) (screen|test).{0,30}(negative|clear|normal)/i, /(does not|doesn'?t|never) (drink|use|smoke)/i], false),

    // Anxiety
    r("worry", "worry or tension most days", "'worries constantly', 'always tense'", [/worr/i, /anxious/i, /\btense\b/i, /on edge/i, /\bchinta\b/i, /\bfikar\b/i]),
    r("many-worries", "worry about many different things", "'worries about money, her son's health and work'", [/(work|job|health|money|finances?|family|children|kids?|son|daughter|exams?|future|husband|wife|parents?|bills).{0,80}(,| and ).{0,80}(work|job|health|money|finances?|family|children|kids?|son|daughter|exams?|future|husband|wife|parents?|bills|everything)/i, /everything/i, /many things/i, /all sorts of/i]),
    r("uncontrollable", "worry is hard to control", "'can't switch off the worry'", [/(can'?t|cannot|unable to) (stop|control|switch off|shut off)/i, /uncontrollab/i, /hard to (stop|control)/i, /difficult to (stop|control)/i]),
    r("tension", "muscle tension or aches", "'tight shoulders, headaches'", [/muscle/i, /tension/i, /\btight/i, /\baches?\b/i, /\bstiff/i, /headache/i]),
    r("irritable", "irritability", "'snaps at her children'", [/irritab/i, /snap(s|ping)?\b/i, /short-?tempered/i]),
    r("no-attacks", "no sudden panic attacks", "'has never had sudden attacks of fear'", [/(no|never|denies|without).{0,40}(sudden|discrete|panic).{0,20}(attacks?|episodes?|surges?)?/i], false),
    r("no-stressor", "no single trigger (long-standing)", "'can't name a trigger; she has always been a worrier'", [/no (clear|single|particular|specific|obvious) (trigger|stressor|cause|event)/i, /(can'?t|cannot) (name|point to|think of) (a|any) (trigger|reason|cause)/i, /(always|since (childhood|school|her teens|his teens|college))/i], false),
    r("realistic-worries", "worries are everyday concerns, no rituals", "'everyday worries, no checking or washing rituals'", [/(no|denies|without).{0,30}(rituals?|compulsions?|checking|washing|counting)/i, /everyday (worries|concerns|problems)/i, /(real|realistic|ordinary) (worries|problems|concerns)/i], false),

    // Panic
    r("sudden-attacks", "sudden, unexpected surges of fear", "'out of the blue, her heart started pounding'", [/(sudden|suddenly|out of the blue|without warning|unexpected|for no reason).{0,80}(attack|episode|surge|heart|pounding|breath|chok|fear|terror)/i, /(attack|episode|surge)s?.{0,60}(out of the blue|without warning|unexpected|no trigger|for no reason)/i]),
    r("palpitations", "pounding heart", "'heart pounding'", [/heart/i, /palpitat/i, /pounding/i, /pulse/i]),
    r("sweating", "sweating", "'drenched in sweat'", [/sweat/i]),
    r("trembling", "trembling or shaking", "'hands shaking'", [/trembl/i, /\bshak/i, /tremor/i]),
    r("breath", "short of breath or choking", "'can't get enough air'", [/breath/i, /suffocat/i, /chok/i, /enough air/i]),
    r("chest", "chest pain or tightness", "'tight chest'", [/chest/i]),
    r("nausea", "nausea or stomach upset", "'feels sick'", [/nause/i, /stomach/i, /vomit/i, /feels sick/i]),
    r("dizzy", "dizziness", "'feels faint'", [/dizz/i, /faint/i, /light-?headed/i]),
    r("unreal", "feeling unreal or detached", "'as if in a dream'", [/unreal/i, /detached/i, /outside (my|her|his|their) body/i, /in a dream/i]),
    r("fear-dying", "fear of dying or losing control", "'sure she was having a heart attack'", [/(going to|would|will|about to) die/i, /dying/i, /losing control/i, /going (mad|crazy)/i, /heart attack/i]),
    r("numbness", "numbness or tingling", "'tingling fingers'", [/numb/i, /tingl/i, /pins and needles/i]),
    r("peak-minutes", "peaks within minutes", "'peaks within ten minutes'", [/minutes/i, /\bpeak/i]),
    r("fear-next", "worry about the next attack or avoidance", "'scared of another attack, stopped taking the metro'", [/(worr|fear|afraid|scared|terrified|dread).{0,40}(another|next|more|further) (attack|episode)/i, /\bavoid/i, /stopped (going|taking|travelling|driving)/i]),
    r("calm-between", "calm between attacks", "'between attacks she is not a worrier'", [/(between attacks|otherwise|in between).{0,50}(calm|fine|relaxed|well|not (a )?worr)/i, /no (general|constant|everyday|other) worr/i], false),
    r("goes-out", "still goes out alone", "'still goes to work and the market alone'", [/(still|continues to) (go|goes|travel|travels|take|takes|drive|drives)/i, /attacks (happen|occur|come) (anywhere|at home|in bed|while (asleep|sleeping|watching))/i, /no avoidance/i], false),

    // OCD
    r("obsessions", "unwanted intrusive thoughts", "'unwanted thoughts that her hands are dirty keep coming back'", [/intrusive/i, /unwanted (thought|image|idea|urge)/i, /(keeps?|kept) (coming|popping)/i, /(can'?t|cannot) (get|stop|push).{0,30}(thought|image|idea)/i, /thoughts? (of|about|that).{0,40}(contamin|dirt|germ|harm|door|lock|gas|blasphem|sin|stab|push)/i]),
    r("compulsions", "repeated rituals", "'washes her hands 40 times a day'", [/(wash|clean|check|count|repeat|pray|arrang|order|touch|bath)(es|s|ing|ed)?.{0,40}(again|times|repeatedly|over and over|until|hours|\d+ times)/i, /ritual/i, /compulsi/i]),
    r("time-or-insight", "takes hours or she knows it's excessive", "'spends three hours a day; knows it makes no sense'", [/(more than|over|at least|about|around|nearly) (an? |one |two |three |four |\d+ )?hours?/i, /hours? (a|each|every) day/i, /(knows|realises|realizes|admits|says).{0,30}(senseless|excessive|silly|irrational|no sense|too much|pointless)/i]),
    r("ocd-impact", "distress or loss of time at work or study", "'late for college every day'", [/\blate\b/i, /distress/i, /exhaust/i, /miss(es|ed|ing)? /i, /(can'?t|cannot|unable to) (leave|finish|complete)/i]),
    r("not-realistic", "thoughts feel senseless, not real-life worries", "'the thoughts feel absurd to her, not like real problems'", [/(senseless|absurd|irrational|doesn'?t make sense|makes no sense|silly)/i, /(not|isn'?t|aren'?t) (about )?(real|everyday|ordinary|realistic)/i, /ritual/i], false),
    r("ego-dystonic", "hates the thoughts and wants them to stop", "'hates the thoughts and fights them'", [/(hates|dislikes|distressed by|tormented|wants? (them|it) to stop|wishes (he|she|they) could stop|fights? (the|these|them))/i, /ego-?dystonic/i, /distress/i], false),
    r("insight", "knows the thoughts come from her own mind", "'knows these are her own thoughts and they are excessive'", [/(knows|realises|realizes|recogni[sz]es|aware|admits).{0,50}(senseless|excessive|silly|irrational|no sense|own mind|own thoughts|not real|too much)/i, /insight (is )?(good|present|fair|intact)/i, /good insight/i], false),

    // Trauma and stress
    r("trauma", "a frightening, life-threatening event", "'survived a bus crash'", [/accident/i, /assault/i, /\battack(ed)?\b/i, /\brap(e|ed)\b/i, /abuse/i, /flood/i, /earthquake/i, /\briots?\b/i, /\bwar\b/i, /combat/i, /bomb/i, /violen/i, /\bfire\b/i, /robbe/i, /shoot/i, /crash/i, /tsunami/i, /cyclone/i, /witness/i, /\bstabb/i]),
    r("intrusion", "flashbacks or nightmares", "'nightmares of the crash, relives it'", [/flashback/i, /nightmare/i, /dreams? (of|about)/i, /reliv/i, /images? (of|keep)/i, /memor(y|ies).{0,20}(come|pop|force|intrude)/i]),
    r("avoidance", "avoids reminders", "'won't take the bus any more'", [/avoid/i, /(won'?t|will not|refuses? to) (go|drive|talk|take|travel|watch|walk)/i, /stays away/i]),
    r("neg-mood", "guilt, numbness or feeling cut off", "'feels numb and blames himself'", [/blam/i, /guilt/i, /shame/i, /\bnumb/i, /detached/i, /cut off/i, /(can'?t|cannot) (feel|enjoy)/i, /(no one|nowhere|no place) is safe/i, /world is dangerous/i]),
    r("arousal", "jumpy, on guard or poor sleep", "'jumps at every horn'", [/startl/i, /\bjump(s|y)?\b/i, /on guard/i, /hypervigil/i, /irritab/i, /\bsleep/i, /concentrat/i, /outbursts?/i]),
    r("stressor", "a clear life stressor before it began", "'since she moved to the hostel'", [/(after|since|following|when|ever since).{0,60}(lost|loss|divorce|separat|moved|transfer|job|exam|failed|break-?up|retire|diagnos|marriage|wedding|shift|relocat|hostel|business|promotion|redundan|laid off)/i]),
    r("adj-impact", "struggling to cope at work or study", "'missing lectures', 'can't cope'", [/(can'?t|cannot|unable to|stopped|missing|missed|hard to|struggl(es|ing) to).{0,30}(work|study|studies|college|cope|function|focus|classes|lectures)/i, /out of proportion/i, /more than (expected|others)/i]),
    r("not-other", "not enough symptoms for another disorder", "'sleep and appetite are normal; no thoughts of death'", [/(sleep|appetite).{0,30}(fine|normal|okay|ok|unchanged|good)/i, /(not|doesn'?t|does not) (meet|have) .{0,30}(enough|full|criteria)/i, /only (a few|some|two|three) (symptoms|of)/i, /no (thoughts of death|suicidal|psychotic)/i], false),
    r("not-traumatic", "the stressor was not life-threatening; no flashbacks", "'no flashbacks or nightmares'", [/(no|not a|wasn'?t|was not).{0,20}(life-threatening|trauma|threat to (life|safety))/i, /no (flashbacks|nightmares)/i, /(stressor|event) (was|is) not (life-threatening|traumatic)/i], false),

    // Psychosis
    r("delusions", "fixed false beliefs", "'convinced the neighbours are poisoning his food'", [/(believes?|convinced|sure|certain|insists).{0,60}(follow|watch|poison|control|plot|spy|conspir|chip|camera|\btv\b|radio|god|special|signals|messages|broadcast|reading (his|her|their) (mind|thoughts)|against (him|her|them))/i, /delusion/i, /persecut/i]),
    r("hallucinations", "hearing or seeing things others don't", "'hears two men commenting on him'", [/(hears?|hearing|heard) (voices?|people|someone|a man|a woman|men|women|whisper)/i, /\bvoices?\b/i, /(sees?|seeing|saw) (things|people|figures|shadows|insects|bugs)/i, /hallucinat/i]),
    r("disorganised", "muddled or hard-to-follow speech", "'answers drift off the point'", [/muddled/i, /disorgani[sz]ed/i, /incoherent/i, /derail/i, /loose/i, /tangential/i, /hard to follow/i, /makes no sense/i]),
    r("odd-behaviour", "odd behaviour or posture", "'laughs to himself'", [/catatoni/i, /postur/i, /mutism/i, /bizarre/i, /odd behaviou?r/i, /(laughs?|smil(es|ing)|mutter(s|ing)?|talk(s|ing)?) to (him|her|them)sel/i]),
    r("negative", "withdrawal or poor self-care", "'stopped bathing, stays in his room'", [/withdrawn/i, /stopped (bathing|washing|talking|meeting)/i, /\bflat\b/i, /blunted/i, /poverty of speech/i, /apath/i, /self-neglect/i, /no motivation/i, /poor self-care/i, /stays in (his|her|their) room/i]),
    r("decline", "a drop in work, study or self-care", "'dropped out of college'", [/dropped out/i, /stopped (work|going|attending|studies|college)/i, /lost (his|her|their) job/i, /\bfail(ed|ing)\b/i, /declin/i, /(can|could) no longer/i, /unable to (work|study)/i]),
    r("no-mood-episode", "no major mood episode", "'mood has stayed even; never depressed or high'", [/(no|never|without).{0,30}(major )?(mood|manic|depressive|depression) (episodes?|symptoms|change|spells?)/i, /mood (is|was|has been|remained|stayed) (mostly |largely )?(normal|euthymic|unremarkable|appropriate|stable|even)/i, /(never|not) (been )?(depressed|elated|high)/i], false),
    r("sudden-onset", "sudden onset", "'it began suddenly three days ago'", [/sudden/i, /abrupt/i, /within (a day|days|hours|\d+ days?)/i, /overnight/i, /(two|three|four|five|2|3|4|5) days ago/i]),
    r("clear-consciousness", "alert and oriented, attention intact", "'alert, knows the date and place'", [/orient(ed|ation)/i, /knows (the|what) (date|day|time|place)/i, /knows where/i, /attention (is )?(intact|normal|good)/i, /\balert\b/i, /conscious(ness)? (is )?(clear|normal)/i], false),

    // Alcohol withdrawal
    r("heavy-drinking", "long, heavy drinking", "'drinks a bottle of whisky daily for 15 years'", [/(drink|drank|drinking|alcohol|liquor|daru|whisk(e)?y|beer|rum|desi|arrack|toddy|quarter|pegs?|vodka).{0,80}(daily|every (day|night|morning)|years|heav|bottles?|litres?|morning|for \d+|since)/i]),
    r("stopped-drinking", "stopped or cut down recently", "'his last drink was two days ago'", [/(stopped|cut down|reduced|quit|gave up)/i, /last drink/i, /no (drink|alcohol) (for|since)/i, /(couldn'?t|could not) (get|buy) (a )?drink/i, /dry day/i, /(admitted|surgery|fasting).{0,40}(no|without) (drink|alcohol)/i]),
    r("autonomic", "sweating or fast pulse", "'pulse 118, sweating'", [/sweat/i, /pulse/i, /heart rate/i, /tachy/i, /blood pressure/i, /\bbp\b/i, /fever/i, /palpitat/i]),
    r("w-tremor", "hand tremor", "'hands shake'", [/trem/i, /\bshak/i]),
    r("w-insomnia", "can't sleep", "'hasn't slept'", [/sleep/i, /insomni/i]),
    r("w-nausea", "nausea or vomiting", "'vomited twice'", [/nause/i, /vomit/i]),
    r("w-hallucinations", "brief hallucinations", "'sees insects on the wall'", [/hallucinat/i, /(sees?|seeing|saw) (insects|bugs|things|spiders|animals)/i, /(hears?|hearing) (voices|things)/i, /crawl/i]),
    r("w-agitation", "agitation", "'restless, can't sit still'", [/agitat/i, /restless/i, /(can'?t|cannot) sit still/i]),
    r("w-anxiety", "anxiety", "'frightened and on edge'", [/anxi/i, /frighten/i, /nervous/i, /on edge/i, /fear/i]),
    r("w-seizure", "a fit", "'had a fit this morning'", [/seizure/i, /\bfits?\b/i, /convuls/i]),
    r("only-alcohol", "no opioid use", "'uses only alcohol, pupils normal'", [/(no|denies|never).{0,40}(opioid|heroin|smack|brown sugar|tramadol|codeine|pills|other drugs)/i, /only (alcohol|drinks)/i, /pupils (are )?(normal|equal|not dilated)/i], false),

    // Delirium
    r("inattention", "poor attention or confusion", "'drifts off mid-sentence, doesn't know the date'", [/attention/i, /distract/i, /(can'?t|cannot) (follow|focus|keep track)/i, /drowsy/i, /disorient/i, /confus/i, /(doesn'?t|does not) know (where|the date|what day|the day|the time)/i, /not orient/i]),
    r("acute-fluctuating", "came on fast and comes and goes", "'since the operation; worse at night'", [/sudden/i, /over (a|one|two|three|1|2|3) days?/i, /since (yesterday|last night|admission|the operation|surgery)/i, /fluctuat/i, /comes and goes/i, /worse (at|in the) (night|evening)/i, /(better|clearer) in the (morning|day)/i]),
    r("other-cognition", "memory or perception also disturbed", "'picks at things in the air'", [/memory/i, /forget/i, /recall/i, /(sees?|seeing) (things|insects|people)/i, /hallucinat/i, /picking at/i, /rambling/i, /incoherent/i]),
    r("medical-cause", "a medical cause", "'urine infection, sodium 124'", [/infection/i, /\buti\b/i, /urine/i, /fever/i, /pneumonia/i, /sodium/i, /hyponatr/i, /surgery|operation/i, /dehydrat/i, /glucose|sugar/i, /electrolyte/i, /white (cell|count)/i, /\bwbc\b/i, /culture/i]),
    r("recent-onset", "recent onset, not slow over years", "'was sharp until three days ago'", [/(was|had been) (sharp|well|fine|independent|normal).{0,40}(until|till|before)/i, /(no|never).{0,30}(memory|forgetful).{0,30}(before|until|previously)/i, /(sudden|over (a|two|three|1|2|3) days?)/i], false),
    r("attention-poor", "attention clearly impaired", "'can't count backwards from 20'", [/attention.{0,30}(poor|impaired|reduced)/i, /(can'?t|cannot|unable to) (count|spell|name the months|follow)/i, /drowsy/i, /disorient/i], false),

    // Eating
    r("low-weight", "restricted eating and low weight", "'BMI 15.8; skips meals'", [/\bbmi\b.{0,20}(1[0-7](\.\d)?|low)/i, /\bweigh(s|t)?\b.{0,30}(\d+ ?kg|very low|under)/i, /(skip|skips|skipping|restrict|barely eat|counting calories|only eats|eats (very )?little)/i]),
    r("fear-gain", "intense fear of gaining weight", "'terrified of putting on weight'", [/(fear|afraid|terrified|scared|panic|worr).{0,40}(gain|fat|weight|putting on)/i, /(doesn'?t|won'?t|refuses to|does not) (want to )?gain/i]),
    r("body-image", "sees herself as big despite low weight", "'says she looks fat'", [/(sees?|feels|thinks|says).{0,30}(fat|big|huge|heavy|chubby)/i, /body image/i, /(denies|minimi[sz]es) (how|the seriousness|being thin)/i]),
    r("no-binge", "no binges or purging", "'no binges, no vomiting'", [/(no|denies|never|without).{0,30}(binge|binging|bingeing|purg|vomit|laxative)/i, /(doesn'?t|does not|never) (binge|vomit|purge)/i], false),
  ].map((x) => [x.id, x]),
);

/* ---------------------------------------------------------- diagnoses */

/** Plain names for every diagnosis id the cases may mention. */
export const DX_NAMES: Record<string, string> = {
  mdd: "Major depressive disorder",
  pdd: "Persistent depressive disorder",
  "bipolar-1": "Bipolar I disorder",
  "bipolar-2": "Bipolar II disorder",
  cyclothymic: "Cyclothymic disorder",
  "depression-medical": "Depressive disorder due to another medical condition",
  gad: "Generalized anxiety disorder",
  panic: "Panic disorder",
  agoraphobia: "Agoraphobia",
  "social-anxiety": "Social anxiety disorder",
  ocd: "Obsessive-compulsive disorder",
  ocpd: "Obsessive-compulsive personality disorder",
  ptsd: "Posttraumatic stress disorder",
  "acute-stress": "Acute stress disorder",
  adjustment: "Adjustment disorder",
  schizophrenia: "Schizophrenia",
  schizophreniform: "Schizophreniform disorder",
  "brief-psychotic": "Brief psychotic disorder",
  schizoaffective: "Schizoaffective disorder",
  "substance-psychosis": "Substance/medication-induced psychotic disorder",
  "alcohol-withdrawal": "Alcohol withdrawal",
  "opioid-withdrawal": "Opioid withdrawal",
  delirium: "Delirium",
  alzheimers: "Major neurocognitive disorder due to Alzheimer's disease",
  anorexia: "Anorexia nervosa",
  bulimia: "Bulimia nervosa",
  arfid: "Avoidant/restrictive food intake disorder",
};

const DEPRESSION_SYMPTOMS = ["low-mood", "anhedonia", "sleep", "appetite", "energy", "worth", "concentration", "psychomotor", "death-thoughts"];

export const CRITERIA: DxCriteria[] = [
  {
    dx: "mdd", name: DX_NAMES.mdd, chapter: "depressive", module: "depression", topic: "depression",
    leak: ["major depressive", "major depression", "mdd", "clinical depression"],
    core: ["low-mood", "anhedonia"], all: [],
    minOf: { n: 5, ids: DEPRESSION_SYMPTOMS },
    duration: { minDays: 14, maxDays: 365, label: "at least 2 weeks (and under a year, so it isn't chronic)" },
    lookAlikes: [{ dx: "bipolar-2", rule: "no-highs" }, { dx: "depression-medical", rule: "normal-labs" }, { dx: "pdd", rule: "@duration" }],
  },
  {
    dx: "pdd", name: DX_NAMES.pdd, chapter: "depressive", module: "depression", topic: "depression",
    leak: ["persistent depressive", "dysthymi", "pdd"],
    all: ["low-mood"], minOf: { n: 2, ids: ["sleep", "appetite", "energy", "worth", "concentration", "hopeless"] },
    duration: { minDays: 730, maxDays: 365 * 40, label: "at least 2 years" },
    lookAlikes: [{ dx: "mdd", rule: "never-full" }, { dx: "cyclothymic", rule: "no-highs" }],
  },
  {
    dx: "bipolar-1", name: DX_NAMES["bipolar-1"], chapter: "bipolar", module: "bipolar", topic: "bipolar",
    leak: ["bipolar", "manic episode", "mania", "bpad", "manic depress"],
    all: ["high-mood", "more-energy"], minOf: { n: 3, ids: ["grandiose", "less-sleep", "pressured-speech", "racing", "distractible", "risky"] },
    duration: { minDays: 7, maxDays: 120, label: "at least 1 week" },
    lookAlikes: [{ dx: "bipolar-2", rule: "severe-mania" }, { dx: "substance-psychosis", rule: "no-substance" }],
  },
  {
    dx: "gad", name: DX_NAMES.gad, chapter: "anxiety", module: "anxiety", topic: "anxiety",
    leak: ["generalized anxiety", "generalised anxiety", "gad"],
    all: ["worry", "many-worries", "uncontrollable"], minOf: { n: 3, ids: ["psychomotor", "energy", "concentration", "irritable", "tension", "sleep"] },
    duration: { minDays: 180, maxDays: 365 * 40, label: "at least 6 months" },
    lookAlikes: [{ dx: "panic", rule: "no-attacks" }, { dx: "adjustment", rule: "no-stressor" }, { dx: "ocd", rule: "realistic-worries" }],
  },
  {
    dx: "panic", name: DX_NAMES.panic, chapter: "anxiety", module: "anxiety", topic: "anxiety",
    leak: ["panic disorder"],
    all: ["sudden-attacks", "peak-minutes", "fear-next"],
    minOf: { n: 4, ids: ["palpitations", "sweating", "trembling", "breath", "chest", "nausea", "dizzy", "unreal", "fear-dying", "numbness"] },
    duration: { minDays: 30, maxDays: 365 * 5, label: "worry about attacks for at least 1 month" },
    lookAlikes: [{ dx: "gad", rule: "calm-between" }, { dx: "agoraphobia", rule: "goes-out" }, { dx: "substance-psychosis", rule: "no-substance" }],
  },
  {
    dx: "ocd", name: DX_NAMES.ocd, chapter: "ocd", module: "ocd", topic: "ocd",
    leak: ["obsessive-compulsive", "obsessive compulsive", "ocd"],
    all: ["obsessions", "compulsions", "time-or-insight", "ocd-impact"],
    lookAlikes: [{ dx: "gad", rule: "not-realistic" }, { dx: "ocpd", rule: "ego-dystonic" }, { dx: "schizophrenia", rule: "insight" }],
  },
  {
    dx: "ptsd", name: DX_NAMES.ptsd, chapter: "trauma", module: "trauma", topic: "trauma",
    leak: ["posttraumatic", "post-traumatic", "ptsd"],
    all: ["trauma", "intrusion", "avoidance", "neg-mood", "arousal"],
    duration: { minDays: 31, maxDays: 365 * 10, label: "more than 1 month" },
    lookAlikes: [{ dx: "acute-stress", rule: "@duration" }, { dx: "adjustment", rule: "intrusion" }],
  },
  {
    dx: "adjustment", name: DX_NAMES.adjustment, chapter: "trauma", module: "trauma", topic: "trauma",
    leak: ["adjustment disorder"],
    all: ["stressor", "adj-impact", "not-other"],
    duration: { minDays: 7, maxDays: 180, label: "starting within 3 months of the stressor and under 6 months" },
    lookAlikes: [{ dx: "mdd", rule: "not-other" }, { dx: "ptsd", rule: "not-traumatic" }],
  },
  {
    dx: "schizophrenia", name: DX_NAMES.schizophrenia, chapter: "psychotic", module: "psychosis", topic: "psychosis",
    leak: ["schizophreni"],
    core: ["delusions", "hallucinations"], all: ["decline"], minOf: { n: 2, ids: ["delusions", "hallucinations", "disorganised", "odd-behaviour", "negative"] },
    duration: { minDays: 183, maxDays: 365 * 20, label: "at least 6 months" },
    lookAlikes: [{ dx: "schizophreniform", rule: "@duration" }, { dx: "substance-psychosis", rule: "no-substance" }, { dx: "schizoaffective", rule: "no-mood-episode" }],
  },
  {
    dx: "brief-psychotic", name: DX_NAMES["brief-psychotic"], chapter: "psychotic", module: "psychosis", topic: "psychosis",
    leak: ["brief psychotic", "brief reactive", "atpd"],
    core: ["delusions", "hallucinations", "disorganised"], all: ["sudden-onset"],
    duration: { minDays: 1, maxDays: 29, label: "at least 1 day and under 1 month" },
    lookAlikes: [{ dx: "schizophreniform", rule: "@duration" }, { dx: "substance-psychosis", rule: "no-substance" }, { dx: "delirium", rule: "clear-consciousness" }],
  },
  {
    dx: "alcohol-withdrawal", name: DX_NAMES["alcohol-withdrawal"], chapter: "substance", module: "substance", topic: "substance",
    leak: ["withdrawal", "delirium tremens", "ciwa"],
    all: ["heavy-drinking", "stopped-drinking"], minOf: { n: 2, ids: ["autonomic", "w-tremor", "w-insomnia", "w-nausea", "w-hallucinations", "w-agitation", "w-anxiety", "w-seizure"] },
    duration: { minDays: 0, maxDays: 10, label: "starting hours to a few days after the last drink" },
    lookAlikes: [{ dx: "opioid-withdrawal", rule: "only-alcohol" }, { dx: "delirium", rule: "clear-consciousness" }],
  },
  {
    dx: "delirium", name: DX_NAMES.delirium, chapter: "neurocognitive", module: "neurocognitive", topic: "neurocognitive",
    leak: ["delirium", "acute confusional"],
    all: ["inattention", "acute-fluctuating", "other-cognition", "medical-cause"],
    duration: { minDays: 0, maxDays: 14, label: "hours to days" },
    lookAlikes: [{ dx: "alzheimers", rule: "recent-onset" }, { dx: "brief-psychotic", rule: "attention-poor" }],
  },
  {
    dx: "anorexia", name: DX_NAMES.anorexia, chapter: "eating", module: "more-disorders", topic: "eating",
    leak: ["anorexi"],
    all: ["low-weight", "fear-gain", "body-image"],
    lookAlikes: [{ dx: "bulimia", rule: "no-binge" }, { dx: "arfid", rule: "fear-gain" }],
  },
];

export const CRITERIA_BY_DX: Record<string, DxCriteria> = Object.fromEntries(CRITERIA.map((c) => [c.dx, c]));

/** Diagnosis ids the generator can make, grouped by learner topic. */
export function dxForTopic(topic: string): string[] {
  return CRITERIA.filter((c) => c.topic === topic).map((c) => c.dx);
}

export const AI_TOPICS: { id: string; title: string }[] = [
  { id: "depression", title: "Depression" },
  { id: "bipolar", title: "Bipolar" },
  { id: "anxiety", title: "Anxiety" },
  { id: "ocd", title: "OCD" },
  { id: "trauma", title: "Trauma & stress" },
  { id: "psychosis", title: "Psychosis" },
  { id: "substance", title: "Alcohol & drugs" },
  { id: "neurocognitive", title: "Delirium & dementia" },
  { id: "eating", title: "Eating" },
];

/** Every rule a diagnosis uses (for the prompt). */
export function rulesFor(c: DxCriteria): Rule[] {
  const ids = new Set([...(c.core ?? []), ...c.all, ...(c.minOf?.ids ?? [])]);
  return [...ids].map((id) => RULES[id]).filter(Boolean);
}
