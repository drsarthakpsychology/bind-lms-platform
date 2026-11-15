// @ts-nocheck
/* eslint-disable */
/* The website's Comorbid rules (src/lib/games-sims/comorbid/game.ts), bundled for the mock server only: the real app asks the server (comorbid.state). Generated with esbuild; do not edit. */
// src/lib/learn/model/picker.ts
var CORE_BAND = [0.7, 0.85];
var TARGET = (CORE_BAND[0] + CORE_BAND[1]) / 2;
function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// src/lib/games-sims/common.ts
function shuffle(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

// src/lib/games-sims/comorbid/cards.ts
var SYMPTOMS = [
  { id: "lowmood", label: "Low mood most of the day", line: "Sad, empty or hopeless, nearly every day." },
  { id: "anhedonia", label: "Loss of interest or pleasure", line: "Nothing feels enjoyable any more." },
  { id: "sleep", label: "Sleep problems", line: "Too little or too much sleep." },
  { id: "appetite", label: "Appetite or weight change", line: "Eating much less or much more than usual." },
  { id: "fatigue", label: "Tiredness, low energy", line: "Worn out without doing much." },
  { id: "guilt", label: "Worthlessness or guilt", line: "Feeling useless, or blaming yourself out of proportion." },
  { id: "concentration", label: "Poor concentration", line: "Can't focus or make decisions." },
  { id: "psychomotor", label: "Slowed down or agitated", line: "Others can see the slowing or the restlessness." },
  { id: "death", label: "Thoughts of death or suicide", line: "Recurring thoughts of dying or ending life." },
  { id: "elevated", label: "Elevated or irritable mood", line: "Unusually high, expansive or irritable, with more energy." },
  { id: "grandiose", label: "Grandiosity", line: "Inflated self-esteem: special powers, great plans." },
  { id: "lesssleep", label: "Little need for sleep", line: "Rested after three hours and not tired." },
  { id: "pressured", label: "Pressured speech", line: "Talks fast and can't be interrupted." },
  { id: "racing", label: "Racing thoughts", line: "Ideas jump faster than speech can follow." },
  { id: "distract", label: "Easily distracted", line: "Attention pulled away by small things." },
  { id: "goal", label: "Many new projects", line: "A burst of goal-directed activity." },
  { id: "risky", label: "Risky spending or sex", line: "Pleasure-seeking with painful consequences." },
  { id: "worry", label: "Hard-to-control worry about many things", line: "Worries jump from health to money to family." },
  { id: "restless", label: "Restless, on edge", line: "Keyed up, can't settle." },
  { id: "tension", label: "Muscle tension", line: "Tight shoulders, jaw, aching neck." },
  { id: "irritable", label: "Irritability", line: "Snapping at people over small things." },
  { id: "panicattack", label: "Unexpected panic attacks", line: "Sudden surges of fear, out of the blue." },
  { id: "palpitations", label: "Racing heart", line: "A pounding or fast heartbeat." },
  { id: "breathless", label: "Short of breath", line: "Feels like choking or smothering." },
  { id: "dying", label: "Fear of dying or losing control", line: "Sure something terrible is happening now." },
  { id: "worrynext", label: "Dread of the next attack", line: "Constant worry about when it will strike again." },
  { id: "delusions", label: "Delusions", line: "Fixed false beliefs, held despite evidence." },
  { id: "hallucinations", label: "Hallucinations", line: "Hearing or seeing things others don't." },
  { id: "disorganised", label: "Disorganised speech", line: "Speech that loses its links." },
  { id: "negative", label: "Negative symptoms", line: "Flat feelings, little speech, no drive." },
  { id: "decline", label: "Decline in work or self-care", line: "Can't keep up study, work or hygiene." },
  { id: "trauma", label: "Exposure to a trauma", line: "Faced death, serious injury or sexual violence." },
  { id: "flashbacks", label: "Flashbacks or nightmares", line: "The event comes back as if happening again." },
  { id: "avoid", label: "Avoiding reminders", line: "Keeps away from places, people, talk of it." },
  { id: "numb", label: "Negative beliefs and numbness", line: "'The world is dangerous', 'I'm to blame', feeling cut off." },
  { id: "startle", label: "Jumpy, always on guard", line: "Startles easily, scans for danger." },
  { id: "obsessions", label: "Obsessions", line: "Unwanted, intrusive thoughts or urges that cause distress." },
  { id: "compulsions", label: "Compulsions", line: "Repeated acts or mental rituals done to reduce the distress." },
  { id: "timeloss", label: "Rituals eat up time", line: "Takes up a lot of the day or gets in the way." },
  { id: "fearjudged", label: "Fear of being judged", line: "Dreads being watched, embarrassed or found wanting by others." },
  { id: "avoidsocial", label: "Avoids social situations", line: "Skips meetings, parties, phone calls or speaking in class." },
  { id: "blushing", label: "Blushing or shaking in company", line: "Face goes red, voice shakes when people look." },
  { id: "dreadahead", label: "Dread for days beforehand", line: "Rehearses and worries long before the event." },
  { id: "inattention", label: "Inattention", line: "Careless mistakes, loses things, doesn't seem to listen." },
  { id: "hyperactive", label: "Fidgety, can't stay seated", line: "Squirms, leaves the seat, always on the go." },
  { id: "impulsive", label: "Can't wait a turn", line: "Blurts out answers, interrupts, grabs." },
  { id: "childonset", label: "Began before age 12", line: "Several signs were there in primary school." },
  { id: "twosettings", label: "Seen at home and at school", line: "Parents and teachers both see it." },
  { id: "stopdrink", label: "Stopped heavy drinking", line: "Cut down or stopped after long, heavy use." },
  { id: "tremor", label: "Shaking hands", line: "A fine tremor of the hands." },
  { id: "sweating", label: "Sweating", line: "Drenched in sweat without heat or effort." },
  { id: "nausea", label: "Nausea or vomiting", line: "Feels sick, may throw up." },
  { id: "seizure", label: "A fit", line: "A generalised seizure." },
  { id: "stopopioid", label: "Stopped opioids", line: "Cut down or stopped heroin, morphine or tramadol after regular use." },
  { id: "aches", label: "Muscle aches", line: "Aching legs and back." },
  { id: "runnynose", label: "Runny nose and watery eyes", line: "Streaming eyes and nose with no cold." },
  { id: "yawning", label: "Yawning", line: "Yawns again and again." },
  { id: "gut", label: "Diarrhoea and cramps", line: "Loose stools with tummy cramps." },
  { id: "attention", label: "Can't hold attention", line: "Drifts off mid-sentence, unaware of the room." },
  { id: "fluctuates", label: "Came on fast, comes and goes", line: "Began over hours to days and changes through the day." },
  { id: "disoriented", label: "Disoriented", line: "Unsure of the day, the place or the people." },
  { id: "memoryloss", label: "Memory decline", line: "Forgets recent talks and repeats questions." },
  { id: "wordfinding", label: "Word-finding trouble", line: "Can't find the names of everyday things." },
  { id: "gettinglost", label: "Gets lost in familiar places", line: "Lost on the way home from the market." },
  { id: "independence", label: "Needs help with daily tasks", line: "Can no longer manage money, medicines or cooking alone." },
  { id: "lowesteem", label: "Low self-esteem", line: "Has long seen themselves as not good enough." },
  { id: "hopeless", label: "Hopelessness", line: "Expects nothing to get better." },
  { id: "longcourse", label: "Low for two years or more", line: "Down on most days for years, never well for long." }
];
var DIAGNOSES = [
  { id: "mdd", name: "Major depressive episode", short: "Depression", core: ["lowmood", "anhedonia"], symptoms: ["lowmood", "anhedonia", "sleep", "appetite", "fatigue", "guilt", "concentration", "psychomotor", "death"], need: 5, topic: "depression", rule: "5 symptoms, one of them low mood or loss of interest." },
  { id: "mania", name: "Manic episode", short: "Mania", core: ["elevated"], symptoms: ["elevated", "grandiose", "lesssleep", "pressured", "racing", "distract", "goal", "risky"], need: 4, topic: "bipolar", rule: "Elevated or irritable mood plus 3 more." },
  { id: "gad", name: "Generalised anxiety disorder", short: "GAD", core: ["worry"], symptoms: ["worry", "restless", "fatigue", "concentration", "irritable", "tension", "sleep"], need: 4, topic: "anxiety", rule: "Hard-to-control worry plus 3 of the six body and mind symptoms." },
  { id: "panic", name: "Panic disorder", short: "Panic", core: ["panicattack"], symptoms: ["panicattack", "palpitations", "breathless", "dying", "worrynext", "sweating", "tremor", "nausea"], need: 4, topic: "anxiety", rule: "Unexpected attacks plus 3 more, including the dread of the next one or its symptoms." },
  { id: "scz", name: "Schizophrenia", short: "Schizophrenia", core: ["delusions", "hallucinations", "disorganised"], symptoms: ["delusions", "hallucinations", "disorganised", "negative", "decline"], need: 3, topic: "psychosis", rule: "3 cards, at least one of delusions, hallucinations or disorganised speech." },
  { id: "ptsd", name: "Post-traumatic stress disorder", short: "PTSD", core: ["trauma"], symptoms: ["trauma", "flashbacks", "avoid", "numb", "startle", "sleep", "irritable", "concentration"], need: 5, topic: "trauma", rule: "The trauma itself plus 4 more." },
  { id: "ocd", name: "Obsessive-compulsive disorder", short: "OCD", core: ["obsessions", "compulsions"], must: ["timeloss"], symptoms: ["obsessions", "compulsions", "timeloss"], need: 2, topic: "ocd", rule: "Obsessions or compulsions, plus rituals that eat up time." },
  { id: "social", name: "Social anxiety disorder", short: "Social anxiety", core: ["fearjudged"], symptoms: ["fearjudged", "avoidsocial", "blushing", "dreadahead", "palpitations"], need: 3, topic: "anxiety", rule: "Fear of being judged plus 2 more: avoidance, dread beforehand or body signs in company." },
  { id: "adhd", name: "Attention-deficit/hyperactivity disorder", short: "ADHD", core: ["inattention", "hyperactive"], must: ["childonset", "twosettings"], symptoms: ["inattention", "hyperactive", "impulsive", "distract", "childonset", "twosettings"], need: 4, topic: "child", rule: "Inattention or hyperactivity, plus one more sign, starting before 12 and seen in two settings." },
  { id: "alcwd", name: "Alcohol withdrawal", short: "Alcohol withdrawal", core: ["stopdrink"], symptoms: ["stopdrink", "tremor", "sweating", "sleep", "nausea", "restless", "hallucinations", "seizure"], need: 3, topic: "substance", rule: "Stopping heavy drinking plus 2 signs, such as a tremor, sweating, poor sleep or nausea." },
  { id: "opwd", name: "Opioid withdrawal", short: "Opioid withdrawal", core: ["stopopioid"], symptoms: ["stopopioid", "lowmood", "nausea", "aches", "runnynose", "sweating", "gut", "yawning", "sleep"], need: 4, topic: "substance", rule: "Stopping or cutting opioids plus 3 signs, such as aches, a runny nose, nausea or yawning." },
  { id: "delir", name: "Delirium", short: "Delirium", core: ["attention"], must: ["fluctuates"], symptoms: ["attention", "fluctuates", "disoriented", "hallucinations", "sleep", "psychomotor"], need: 3, topic: "neurocognitive", rule: "Disturbed attention that came on fast and fluctuates, plus one more change in thinking or perception." },
  { id: "dementia", name: "Major neurocognitive disorder (dementia)", short: "Dementia", core: ["memoryloss", "wordfinding", "gettinglost"], must: ["independence"], symptoms: ["memoryloss", "wordfinding", "gettinglost", "independence", "concentration"], need: 3, topic: "neurocognitive", rule: "A clear decline in memory, language or finding the way, bad enough to need help with daily life, plus one more." },
  { id: "pdd", name: "Persistent depressive disorder", short: "PDD", core: ["lowmood"], must: ["longcourse"], symptoms: ["lowmood", "longcourse", "appetite", "sleep", "fatigue", "lowesteem", "concentration", "hopeless"], need: 4, topic: "depression", rule: "Low mood on most days for two years, plus 2 more." }
];
var RULEOUTS = [
  { id: "hyperthyroid", label: "Overactive thyroid", line: "Too much thyroid hormone brings anxiety, a racing heart, weight loss and poor sleep.", against: ["gad", "panic", "mania"] },
  { id: "hypothyroid", label: "Underactive thyroid", line: "Low thyroid hormone brings low mood, tiredness, weight gain and slowing.", against: ["mdd", "pdd"] },
  { id: "stimulants", label: "Stimulant or cannabis use", line: "Cannabis, amphetamines and cocaine can cause psychosis, mania or panic.", against: ["scz", "mania", "panic", "gad"] },
  { id: "steroids", label: "High-dose steroid medicine", line: "Steroids like prednisolone can bring on mania, depression or psychosis.", against: ["mania", "mdd", "scz"] },
  { id: "pastmania", label: "A past manic episode", line: "Depression in someone who has had mania is bipolar depression, not a depressive disorder.", against: ["mdd", "pdd"] },
  { id: "moodonly", label: "Psychosis only during mood episodes", line: "If the psychosis only ever comes with severe mood episodes, think of a mood disorder with psychotic features.", against: ["scz"] },
  { id: "delirium", label: "Clouded consciousness (delirium)", line: "Hallucinations in a confused, drowsy person point to delirium and a medical cause.", against: ["scz"] },
  { id: "headinjury", label: "A head injury explains it", line: "Concussion can cause poor concentration, irritability and sleep problems.", against: ["ptsd"] },
  { id: "tics", label: "They are tics, not compulsions", line: "Tics are sudden urges to move without an obsession behind them.", against: ["ocd"] },
  { id: "hypoglycaemia", label: "Low blood sugar spells", line: "Sweating, shaking and a pounding heart when sugar drops can look like panic.", against: ["panic"] },
  { id: "caffeine", label: "Too much caffeine", line: "Many cups of coffee or energy drinks bring jitteriness, worry and poor sleep.", against: ["gad", "panic"] },
  { id: "bdd", label: "Fear centres on one body flaw", line: "If the dread is about a feature they think looks ugly, think of body dysmorphic disorder.", against: ["social"] },
  { id: "paranoid", label: "Avoids people from a fixed belief of harm", line: "Keeping away because others are plotting is psychosis, not social anxiety.", against: ["social"] },
  { id: "sensory", label: "Poor hearing or eyesight", line: "A child who can't hear the teacher or see the board looks inattentive.", against: ["adhd"] },
  { id: "sleepdebt", label: "Too little sleep", line: "Snoring, late screens or a crowded room at night can cause poor focus and restlessness in a child.", against: ["adhd"] },
  { id: "sedwd", label: "Stopped sleeping pills suddenly", line: "Benzodiazepine withdrawal brings tremor, sweating, poor sleep and fits, much like alcohol withdrawal.", against: ["alcwd", "gad"] },
  { id: "gastro", label: "A stomach infection", line: "Food poisoning brings nausea, cramps, aches and diarrhoea.", against: ["opwd"] },
  { id: "flu", label: "A viral fever", line: "Flu brings aches, a runny nose, sweats and poor sleep.", against: ["opwd"] },
  { id: "slowdecline", label: "A slow decline over years", line: "Memory loss that crept in over years, with steady attention and a clear mind, points to dementia, not delirium.", against: ["delir"] },
  { id: "depmemory", label: "Depression explains the forgetting", line: "Low mood can slow thinking and memory; it lifts when the depression is treated.", against: ["dementia"] },
  { id: "b12", label: "Low vitamin B12 or thyroid", line: "Treatable lacks of B12 or thyroid hormone can cause memory loss and slowing.", against: ["dementia"] }
];
var CLEAR = { id: "normaltest", label: "Tests come back normal", line: "History, examination and tests clear the rule-out against you." };
var dxById = (id) => DIAGNOSES.find((x) => x.id === id);

// src/lib/games-sims/comorbid/game.ts
var RULES = [
  "Build your diagnosis: play symptom cards that belong to it, with at least one core card.",
  "Block your rival: play a rule-out that could explain their picture. A normal test clears it.",
  "A card that doesn't fit bounces and you lose the turn. First complete, unblocked diagnosis wins."
];
var HAND = 5;
var MAX_MOVES = 60;
var rngFor = (seed, tag) => makeRng(hashString(`${seed}:${tag}`));
function newGame(s) {
  const rng = rngFor(s.seed, "deal");
  const dealt = shuffle(DIAGNOSES, rng);
  const wanted = s.prefer ? dealt.findIndex((d) => d.id === s.prefer) : -1;
  if (wanted > 0) dealt.unshift(...dealt.splice(wanted, 1));
  const [a, ...rest] = dealt;
  const b = rest.find((d) => Math.abs(d.need - a.need) <= 1) ?? rest[0];
  let n = 0;
  const card = (kind, id) => ({ uid: `c${n++}`, kind, id });
  const cards = [];
  for (const dx of [a, b]) {
    for (const sym of dx.symptoms) cards.push(card("sym", sym));
    for (const c of dx.core) cards.push(card("sym", c));
    for (const m of dx.must ?? []) cards.push(card("sym", m));
    const rules = RULEOUTS.filter((r) => r.against.includes(dx.id));
    for (const r of shuffle(rules, rng).slice(0, 2)) cards.push(card("rule", r.id));
  }
  const mine = /* @__PURE__ */ new Set([...a.symptoms, ...b.symptoms]);
  for (const sym of shuffle(
    SYMPTOMS.filter((x) => !mine.has(x.id)),
    rng
  ).slice(0, 8))
    cards.push(card("sym", sym.id));
  for (const r of shuffle(
    RULEOUTS.filter((x) => !x.against.includes(a.id) && !x.against.includes(b.id)),
    rng
  ).slice(0, 2))
    cards.push(card("rule", r.id));
  for (let i = 0; i < 3; i++) cards.push(card("clear", CLEAR.id));
  const deck = shuffle(cards, rng);
  const seat = (i, dx) => ({ name: s.names[i], dx: dx.id, hand: deck.splice(0, HAND), built: [], blocked: null, bot: i === 1 && s.mode === "bot" ? s.level : null });
  const seats = [seat(0, a), seat(1, b)];
  return { seed: s.seed, seats, deck, turn: 0, moves: 0, log: [], winner: null };
}
function check(g, seat, c) {
  const me = g.seats[seat];
  const rival = g.seats[seat === 0 ? 1 : 0];
  const dx = dxById(me.dx);
  if (c.kind === "sym") {
    const s = SYMPTOMS.find((x) => x.id === c.id);
    if (!dx.symptoms.includes(c.id)) return { ok: false, reason: `${s.label} isn't one of the ${dx.short} cards.` };
    if (me.built.includes(c.id)) return { ok: false, reason: `${s.label} is already on your ${dx.short}.` };
    return { ok: true, reason: `${s.label} counts towards ${dx.short}.` };
  }
  if (c.kind === "rule") {
    const r = RULEOUTS.find((x) => x.id === c.id);
    const rdx = dxById(rival.dx);
    if (rival.blocked) return { ok: false, reason: `Their ${rdx.short} is already blocked.` };
    if (!r.against.includes(rdx.id)) return { ok: false, reason: `${r.label} doesn't explain ${rdx.short}.` };
    return { ok: true, reason: `${r.label} could explain their ${rdx.short}. ${r.line}` };
  }
  if (!me.blocked) return { ok: false, reason: "Nothing to clear: you aren't blocked." };
  return { ok: true, reason: "Tests are normal. The rule-out is cleared." };
}
function progress(seat) {
  const dx = dxById(seat.dx);
  const core = dx.core.some((c) => seat.built.includes(c));
  const must = (dx.must ?? []).every((c) => seat.built.includes(c));
  const have = seat.built.length;
  return { have, need: dx.need, core, must, complete: have >= dx.need && core && must };
}
var wins = (s) => progress(s).complete && !s.blocked;
function apply(g, mv) {
  if (g.winner !== null) return g;
  const t = g.turn;
  const me = g.seats[t];
  const c = me.hand.find((x) => x.uid === mv.uid);
  if (!c) return g;
  const seats = g.seats.map((s) => ({ ...s, hand: [...s.hand], built: [...s.built] }));
  const deck = [...g.deck];
  const hand = seats[t].hand.filter((x) => x.uid !== c.uid);
  let ev;
  if (mv.action === "swap") {
    ev = { seat: t, card: c, action: "swap", ok: true, reason: "Swapped for a new card." };
  } else {
    const r = check(g, t, c);
    ev = { seat: t, card: c, action: "play", ...r };
    if (r.ok) {
      if (c.kind === "sym") seats[t].built.push(c.id);
      else if (c.kind === "rule") seats[t === 0 ? 1 : 0].blocked = c.id;
      else seats[t].blocked = null;
    }
  }
  if (deck.length && ev.ok) hand.push(deck.shift());
  seats[t].hand = hand;
  const moves = g.moves + 1;
  let winner = wins(seats[t]) ? t : wins(seats[t === 0 ? 1 : 0]) ? t === 0 ? 1 : 0 : null;
  if (winner === null && (moves >= MAX_MOVES || !deck.length && !seats[0].hand.length && !seats[1].hand.length)) {
    const p0 = progress(seats[0]).have / progress(seats[0]).need;
    const p1 = progress(seats[1]).have / progress(seats[1]).need;
    winner = p0 === p1 ? "draw" : p0 > p1 ? 0 : 1;
  }
  let turn = t === 0 ? 1 : 0;
  if (!seats[turn].hand.length) {
    if (deck.length) seats[turn].hand = [deck.shift()];
    else if (seats[t].hand.length) turn = t;
  }
  return { ...g, seats, deck, turn, moves, log: [...g.log, ev].slice(-40), winner };
}
function botMove(g) {
  const t = g.turn;
  const me = g.seats[t];
  const bot = me.bot ?? 3;
  if (!me.hand.length) return null;
  const rng = rngFor(g.seed, `bot:${g.moves}`);
  const slip = bot === 1 ? 0.5 : bot === 2 ? 0.2 : 0;
  if (rng() < slip) {
    const c = me.hand[Math.floor(rng() * me.hand.length)];
    return { uid: c.uid, action: "play" };
  }
  const valid = me.hand.filter((c) => check(g, t, c).ok);
  const rival = g.seats[t === 0 ? 1 : 0];
  const rp = progress(rival);
  const mp = progress(me);
  const dx = dxById(me.dx);
  const pick = (f) => valid.find(f);
  const order = [];
  if (mp.complete) order.push(pick((c) => c.kind === "clear"));
  if (rp.have >= rp.need - (bot === 3 ? 2 : 1)) order.push(pick((c) => c.kind === "rule"));
  if (!mp.core) order.push(pick((c) => c.kind === "sym" && dx.core.includes(c.id)));
  order.push(pick((c) => c.kind === "sym" && (dx.must ?? []).includes(c.id)));
  order.push(pick((c) => c.kind === "sym"));
  order.push(pick((c) => c.kind === "clear"));
  order.push(pick((c) => c.kind === "rule"));
  const best = order.find(Boolean);
  if (best) return { uid: best.uid, action: "play" };
  const junk = me.hand.find((c) => c.kind === "sym" && !dx.symptoms.includes(c.id) || c.kind === "rule" && !RULEOUTS.find((r) => r.id === c.id).against.includes(rival.dx)) ?? me.hand[0];
  return { uid: junk.uid, action: "swap" };
}
function runBots(g) {
  let cur = g;
  for (let i = 0; i < MAX_MOVES && cur.winner === null && cur.seats[cur.turn].bot; i++) {
    const mv = botMove(cur);
    if (!mv) break;
    cur = apply(cur, mv);
  }
  return cur;
}
function replay(s, human) {
  let g = runBots(newGame(s));
  const plays = [];
  for (const mv of human) {
    if (g.winner !== null) break;
    const t = g.turn;
    const next = apply(g, mv);
    if (next === g) break;
    const ev = next.log[next.log.length - 1];
    if (ev.action === "play") plays.push({ seat: t, ev, dx: g.seats[t].dx, rivalDx: g.seats[t === 0 ? 1 : 0].dx });
    g = runBots(next);
  }
  return { game: g, plays };
}
export {
  RULES,
  newGame,
  replay
};
