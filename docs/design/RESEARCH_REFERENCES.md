# Design research references

> Part of the [Design Intelligence](DESIGN_INTELLIGENCE.md) section. Every
> design claim in VIBHA docs should trace to a row here. Added 2026-11-06.

## How sources are graded

| Tag | Meaning | How to use it |
|---|---|---|
| **Established** | Replicated experimental finding, or a formal standard | Treat as a constraint. |
| **Context-dependent** | Real effect, but its size or direction depends on the task, the user's expertise or the setting | Apply only after checking that VIBHA's situation matches. |
| **Hypothesis** | Plausible, with weak, indirect or practitioner-only evidence | Fine to try; verify with VIBHA users before making it a rule. |
| **Convention** | Design-system guidance or product practice, not an experimental result | Follow for consistency; don't present it as science. |

Source types, from strongest to weakest:
1. peer-reviewed papers and meta-analyses
2. W3C standards
3. official platform design systems
4. practitioner research (Nielsen Norman Group)
5. observations of real products

Products named below (Linear, Stripe, GitHub and so on) are **observations**,
not evidence that a pattern works.

**Link check (2026-11-06):** where a DOI couldn't be confirmed from the
research environment, the row links to the author's or a repository copy
instead. Remaining DOIs come from the publishers' standard records; if one
ever fails to resolve, replace it, never drop the citation silently.

## Attention, perception and neuroscience

| # | Source | Year | Tag | What it says, and why it matters for VIBHA |
|---|---|---|---|---|
| N1 | Itti & Koch, "Computational modelling of visual attention", *Nature Reviews Neuroscience* 2(3) — [PubMed 11256080](https://pubmed.ncbi.nlm.nih.gov/11256080/) | 2001 | Established | Attention is pulled bottom-up by local contrast (colour, intensity, orientation) and steered top-down by goals. The highest-contrast element on a screen wins the first look, so contrast must be spent on the thing that matters. |
| N2 | Treisman & Gelade, "A feature-integration theory of attention", *Cognitive Psychology* 12 — [doi:10.1016/0010-0285(80)90005-5](https://doi.org/10.1016/0010-0285(80)90005-5) | 1980 | Established | A single distinct feature (one red item) "pops out" without effort; finding a combination of features needs slow serial search. One distinct cue per status works; combinations of colour, size and position don't pop out. |
| N3 | Wolfe & Horowitz, "What attributes guide the deployment of visual attention and how do they do it?", *Nature Reviews Neuroscience* 5 — [doi:10.1038/nrn1411](https://doi.org/10.1038/nrn1411) | 2004 | Established | Colour, motion, orientation and size reliably guide attention. Many other properties don't. This is the shortlist of tools for drawing the eye. |
| N4 | Abrams & Christ, "Motion onset captures attention", *Psychological Science* 14 — [PubMed 12930472](https://pubmed.ncbi.nlm.nih.gov/12930472/) | 2003 | Established | Something starting to move captures attention involuntarily. Every animation spends the viewer's attention whether or not they want it to. |
| N5 | Simons & Levin, "Change blindness", *Trends in Cognitive Sciences* 1 — [doi:10.1016/S1364-6613(97)01080-2](https://doi.org/10.1016/S1364-6613(97)01080-2) | 1997 | Established | People miss large changes they aren't attending to. A number that silently updates (live counts, a saved row) often goes unnoticed. A changed value needs a brief, honest signal. |
| N6 | Rayner, "Eye movements in reading and information processing: 20 years of research", *Psychological Bulletin* 124 — [PubMed 9849112](https://pubmed.ncbi.nlm.nih.gov/9849112/) | 1998 | Established | Reading is a series of short fixations (about 200–250 ms) joined by jumps (saccades). People see detail only where they fixate. Labels and values must sit where the eye already lands, not far off to the side. |
| N7 | Wagemans et al., "A century of Gestalt psychology in visual perception I", *Psychological Bulletin* 138 — [PubMed 22845751](https://pubmed.ncbi.nlm.nih.gov/22845751/) | 2012 | Established | Proximity, similarity, common region (things inside one border) and connectedness decide what looks grouped. VIBHA's 2px borders are very strong "common region" cues, so a border nested in another border reads as a new group. |
| N8 | Schultz, Dayan & Montague, "A neural substrate of prediction and reward", *Science* 275 — [doi:10.1126/science.275.5306.1593](https://doi.org/10.1126/science.275.5306.1593) | 1997 | Established (neuroscience) / Hypothesis (UI use) | Dopamine neurons signal *unexpected* reward. Applying this to badges is an inference, not a tested UI result. VIBHA uses it only to avoid slot-machine mechanics. |
| N9 | Stothart, Mitchum & Yehnert, "The attentional cost of receiving a cell phone notification", *J. Exp. Psychology: HPP* 41 — [doi:10.1037/xhp0000100](https://doi.org/10.1037/xhp0000100) | 2015 | Established | A notification disrupts the task in hand even when it isn't opened. Every alert has a cost, so alerts are for things that need action. |

## Memory, load and decisions

| # | Source | Year | Tag | What it says, and why it matters for VIBHA |
|---|---|---|---|---|
| C1 | Cowan, "The magical number 4 in short-term memory", *Behavioral and Brain Sciences* 24 — [PubMed 11515286](https://pubmed.ncbi.nlm.nih.gov/11515286/) | 2001 | Established | Working memory holds about 4 chunks, not "7±2" (Miller 1956, [doi:10.1037/h0043158](https://doi.org/10.1037/h0043158)). Don't make an admin remember a name, a cohort and a message from step 1 while on step 3. Keep them visible. |
| C2 | Sweller, "Cognitive load during problem solving: effects on learning", *Cognitive Science* 12 — [doi:10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4) | 1988 | Established (learning) / Context-dependent (admin UI) | Load the interface adds ("extraneous load") competes with the task itself. Strongest for learners, so it matters most on student screens. For admins it supports removing anything that doesn't help the decision. |
| C3 | Hick, "On the rate of gain of information", *QJEP* 4 — [doi:10.1080/17470215208416600](https://doi.org/10.1080/17470215208416600); Hyman, *J. Exp. Psych.* 45 — [doi:10.1037/h0056940](https://doi.org/10.1037/h0056940) | 1952 / 1953 | Established (lab) / Context-dependent (menus) | Choice time grows with the log of the number of equally likely options. Practised users find menu items by memory and position, so the law matters most for new or rare choices. Don't use it to justify hiding everything. |
| C4 | Scheibehenne, Greifeneder & Todd, "Can there ever be too many options?", *Journal of Consumer Research* 37 — [doi:10.1086/651235](https://doi.org/10.1086/651235) | 2010 | Context-dependent | A meta-analysis of 63 conditions from 50 experiments found "a mean effect size of virtually zero but considerable variance between studies". The famous jam study (Iyengar & Lepper 2000, [doi:10.1037/0022-3514.79.6.995](https://doi.org/10.1037/0022-3514.79.6.995)) doesn't generalise on its own. |
| C5 | Chernev, Böckenholt & Goodman, "Choice overload: a conceptual review and meta-analysis", *J. Consumer Psychology* 25 — [doi:10.1016/j.jcps.2014.08.002](https://doi.org/10.1016/j.jcps.2014.08.002) | 2015 | Context-dependent | Overload appears when the options are complex, the task is hard, preferences are unclear or the goal is to pick quickly. Admin bulk-action menus and filter bars meet some of these conditions. |
| C6 | Fitts, "The information capacity of the human motor system", *J. Exp. Psych.* 47 — [doi:10.1037/h0055392](https://doi.org/10.1037/h0055392); MacKenzie, "Fitts' law as a research and design tool in HCI", *HCI* 7 — [doi:10.1207/s15327051hci0701_3](https://doi.org/10.1207/s15327051hci0701_3) | 1954 / 1992 | Established | Time to hit a target grows with distance and shrinks with size. Frequent actions should be big and near where the eye and hand already are, not in a far toolbar. |
| C7 | Shepard, "Recognition memory for words, sentences, and pictures", *JVLVB* 6 — [doi:10.1016/S0022-5371(67)80067-7](https://doi.org/10.1016/S0022-5371(67)80067-7) | 1967 | Established | Recognising is far easier than recalling. Search with suggestions, visible filters and recent items beat "type the exact roll number". |
| C8 | Pirolli & Card, "Information foraging", *Psychological Review* 106 — [doi:10.1037/0033-295X.106.4.643](https://doi.org/10.1037/0033-295X.106.4.643) | 1999 | Established | People follow "information scent": labels that predict what is behind them. "Review → Doubts & concerns" has weak scent for "answer a student's question". |
| C9 | Norman, *The Design of Everyday Things* (revised), Basic Books | 2013 | Convention (well-grounded) | Mental models, signifiers, feedback, mapping. If something looks like a button it must act like one, and vice versa. This is the basis for VIBHA's shape grammar. |

## Interruptions and notifications

| # | Source | Year | Tag | What it says, and why it matters for VIBHA |
|---|---|---|---|---|
| I1 | Mark, Gudith & Klocke, "The cost of interrupted work: more speed and stress", CHI — [author PDF](https://www.ics.uci.edu/~gmark/chi08-mark.pdf) | 2008 | Established | Interrupted people compensate by working faster, but at the cost of more stress, frustration and time pressure. Speed isn't proof an interruption was harmless. |
| I2 | Altmann & Trafton, "Memory for goals: an activation-based model", *Cognitive Science* 26 — [doi:10.1207/s15516709cog2601_2](https://doi.org/10.1207/s15516709cog2601_2) | 2002 | Established | Getting back into a task depends on cues that remind you of the goal. Drafts, "you were replying to Priya" banners and a preserved scroll position are resumption cues. |
| I3 | Monsell, "Task switching", *Trends in Cognitive Sciences* 7 — [doi:10.1016/S1364-6613(03)00028-7](https://doi.org/10.1016/S1364-6613(03)00028-7) | 2003 | Established | Switching tasks has a measurable cost. Letting an admin reply to a doubt *from where they are* avoids a full context switch. |
| I4 | Adamczyk & Bailey, "If not now, when? The effects of interruption at different moments within task execution", CHI — [doi:10.1145/985692.985715](https://doi.org/10.1145/985692.985715) | 2004 | Established | Interruptions hurt less at natural breakpoints, such as after a task finishes. Batch non-urgent notices; never pop one in the middle of typing. |
| I5 | Pielot, Church & de Oliveira, "An in-situ study of mobile phone notifications", MobileHCI — [author PDF](https://ic.unicamp.br/~oliveira/doc/MHCI2014_An-in-situ-study-of-mobile-phone-notifications.pdf) | 2014 | Established | People receive dozens of notifications a day and many feel obliged to respond. A notice competes with everything else on the phone. |

## Perceived speed, progress and motion

| # | Source | Year | Tag | What it says, and why it matters for VIBHA |
|---|---|---|---|---|
| P1 | Miller, "Response time in man-computer conversational transactions", AFIPS — [doi:10.1145/1476589.1476628](https://doi.org/10.1145/1476589.1476628); Card, Robertson & Mackinlay, "The information visualizer", CHI — [doi:10.1145/108844.108874](https://doi.org/10.1145/108844.108874) | 1968 / 1991 | Established (as rough thresholds) | About 0.1 s feels instant; about 1 s keeps the flow of thought; about 10 s is the limit of holding attention. These are approximations, not exact constants. |
| P2 | Nah, "A study on tolerable waiting time: how long are Web users willing to wait?", *Behaviour & IT* 23 — [dblp](https://dblp.org/rec/journals/behaviourIT/Nah04.html) | 2004 | Context-dependent | Without feedback, tolerance for a web wait was about 2 s. Feedback extends it. |
| P3 | Harrison, Amento, Kuznetsov & Bell, "Rethinking the progress bar", UIST — [project page](https://www.chrisharrison.net/index.php/Research/ProgressBars) | 2007 | Established | How progress moves (speeding up near the end vs stalling) changes how long the same wait *feels*. Honest progress shown in a good way feels faster; a stall feels slow. |
| P4 | Harrison, Yeo & Hudson, "Faster progress bars: manipulating perceived duration with visual augmentations", CHI — [project page](https://chrisharrison.net/index.php/Research/ProgressBars2) | 2010 | Established | Visual treatment (for example, a backwards-moving ribbing) makes bars feel faster *without lying about the value*. This is the line VIBHA keeps: decorate honestly, never fake the number. |
| P5 | Nielsen Norman Group, "Skeleton screens 101" — [nngroup.com/articles/skeleton-screens](https://www.nngroup.com/articles/skeleton-screens/) | accessed 2026-11-06 | Hypothesis (practitioner) | Skeletons are advised for short waits where the page layout is known. Peer-reviewed evidence is thin. The VIBHA Medicines skeleton hid a 22 s stall, which shows the failure mode. |
| P6 | Tversky, Morrison & Bétrancourt, "Animation: can it facilitate?", *IJHCS* 57 — [doi:10.1006/ijhc.2002.1017](https://doi.org/10.1006/ijhc.2002.1017) | 2002 | Established | In most studies animation added nothing over a good static graphic once content was equal. It helps when it shows a change that would otherwise be missed. |
| P7 | Heer & Robertson, "Animated transitions in statistical data graphics", IEEE TVCG 13 — [doi:10.1109/TVCG.2007.70539](https://doi.org/10.1109/TVCG.2007.70539) | 2007 | Established | Short, simple transitions help people track *what changed* between two states, for example when filtering a list. |

## Reading and type

| # | Source | Year | Tag | What it says, and why it matters for VIBHA |
|---|---|---|---|---|
| T1 | Legge & Bigelow, "Does print size matter for reading?", *Journal of Vision* 11(5) — [doi:10.1167/11.5.8](https://doi.org/10.1167/11.5.8) | 2011 | Established | Reading speed is flat above a "critical print size" and falls quickly below it. 16px body text on a laptop at normal distance is comfortably above it; 12px captions are near it. Captions are for metadata only. |
| T2 | Dyson, "How physical text layout affects reading from screen", *Behaviour & IT* 23 — [repository](https://centaur.reading.ac.uk/23344) | 2004 | Context-dependent | Longer lines can be *read* faster but are often *preferred* shorter, so the evidence is mixed. VIBHA's ≤75-character rule is a comfort convention, not a speed law. |

## Touch and devices

| # | Source | Year | Tag | What it says, and why it matters for VIBHA |
|---|---|---|---|---|
| D1 | Parhi, Karlson & Bederson, "Target size study for one-handed thumb use on small touchscreen devices", MobileHCI — [doi:10.1145/1152215.1152260](https://doi.org/10.1145/1152215.1152260) | 2006 | Established | Error rates level off at about 9.2 mm for single thumb taps and about 9.6 mm for taps in sequence, roughly 44–48 CSS px. |
| D2 | Birch, "Worldwide prevalence of red-green color deficiency", *JOSA A* 29 — [doi:10.1364/JOSAA.29.000313](https://doi.org/10.1364/JOSAA.29.000313) | 2012 | Established | Red–green deficiency affects a meaningful minority, mostly men, and rates vary by population. Red/green alone must never carry meaning. |

## Standards and design systems

| # | Source | Version / date | Tag | Used for |
|---|---|---|---|---|
| S1 | W3C, [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Recommendation, 5 Oct 2023 | Established (standard) | Requirements in use: **1.4.1** (not colour alone), **1.4.3** (4.5:1 text contrast), **1.4.10** (reflow at 320 px), **1.4.11** (3:1 for controls), **2.4.11** (focus not hidden), **2.5.8** (24×24 px minimum target), **3.3.7** (don't make people re-enter data in a multi-step flow), **4.1.3** (status messages announced). Recommended: **2.3.3** (motion from interactions can be disabled, AAA). |
| S2 | MDN, [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | living doc | Established (platform) | The OS-level "reduce motion" setting, which VIBHA already honours. |
| S3 | Apple, [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) | living doc | Convention | 44×44 pt minimum hit target; type hierarchy through weight; motion that has a purpose. |
| S4 | Google, [Material Design 3](https://m3.material.io/) | living doc | Convention | 48×48 dp touch targets; a shape scale as tokens; motion duration and easing tokens. |
| S5 | Shopify, [Polaris](https://polaris-react.shopify.com/) | living doc | Convention | Index tables with filters, saved views and bulk actions; badges = status, buttons = actions. |
| S6 | GitHub, [Primer](https://primer.style/) | living doc | Convention | Dense, keyboard-first product UI; command palette. |
| S7 | IBM, [Carbon](https://carbondesignsystem.com/) | living doc | Convention | "Productive" vs "expressive" motion; data-table patterns; tokens and governance. |
| S8 | Atlassian, [Design system](https://atlassian.design/) | living doc | Convention | Lozenges (status) vs buttons (actions); governance and contribution model. |
| S9 | W3C Design Tokens Community Group, [first stable spec 2025.10](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/) | 28 Oct 2025 | Convention (community standard) | A portable JSON format for tokens, if VIBHA ever needs tokens outside CSS. |
| S10 | web.dev, [Interaction to Next Paint](https://web.dev/articles/inp) | living doc | Established (platform metric) | "Good" responsiveness is INP ≤ 200 ms; LCP ≤ 2.5 s; CLS ≤ 0.1. |

## Usability testing

| # | Source | Year | Tag | Used for |
|---|---|---|---|---|
| U1 | Nielsen & Landauer, "A mathematical model of the finding of usability problems", INTERCHI — [doi:10.1145/169059.169166](https://doi.org/10.1145/169059.169166) | 1993 | Context-dependent | Small rounds (about 5 people) find most problems *in a simple, uniform product*. Later work (e.g. Faulkner 2003) shows the spread is wide, so VIBHA runs several small rounds, not one. |

## Not used, and why

- **"Users decide in 50 ms" / "7±2 items" / "the 3-click rule"**: popular
  but either misquoted or not supported for interface design. Don't cite them.
- **Specific weight-for-legibility numbers** (for example, "semibold reads 12 %
  faster"): no reliable peer-reviewed source was found. VIBHA's weight rules
  are tagged **Convention** for that reason.
