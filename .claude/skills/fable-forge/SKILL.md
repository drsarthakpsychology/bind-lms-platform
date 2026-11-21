---
name: fable-forge
description: Design, build, revise, or review a website, landing page, product UI, dashboard, or web component with subject-led art direction, honest content, responsive behaviour, and real render evidence. Use when the user asks to design or redesign a page, fix how a page looks or behaves, carry an approved design direction into code, or check whether a page looks generic or AI-made. Works for a bounded visual fix, an approved-direction build, or a new direction pilot.
license: Apache-2.0. See LICENSE.txt and NOTICE.
---

# Fable Forge

One practical design entrypoint for web work. Begin with the current brief and the actual surface. The user's latest scope and approved direction govern. This skill grants no authority to publish, deploy, send, spend, change accounts, or invent business claims. Follow the project's own instructions for tools, permissions, and review.

## How to start

1. **Read before you design.** Open the brief and the relevant route, components, tokens, copy, and assets. If the page is running, look at it in a browser first.
2. **Pick the work mode** from the three below and say which one you chose.
3. **Write the page's job** in three or four lines: visitor, what they need, the one primary action, and the proof the page can honestly show.
4. **Write a short direction note** (see "Direct the design") before touching layout code on anything larger than a bounded fix.
5. **Build, then look.** Screenshot the real route at phone and desktop widths, run the main interaction, and fix what you see.
6. **Report** with the format in "Review and stop".

If you have no browser tool, one command is enough for a first render check:

```bash
npx playwright screenshot --viewport-size=390,844 http://localhost:3000 phone.png
npx playwright screenshot --viewport-size=1440,900 http://localhost:3000 desktop.png
```

## Choose the work mode from context

- **Bounded fix:** A working page has a specific visual or functional defect. Preserve its approved identity, content hierarchy, and stack. Inspect the failing state, change only what resolves it, and verify the same state.
- **Approved-direction build:** A direction or pilot has already been accepted. Carry it into the real route with the named anchors and constraints. Do not ask again for known decisions; pause only for an answer that materially changes the result.
- **New direction or material redesign:** Establish the audience, page job, primary action, proof, and must-keep elements. Make one concrete representative pilot at desktop and phone size, with meaningful content and one working interaction where relevant. Present it for direction review before expanding to more pages, unless the user explicitly handed you the creative decisions. Approval of a pilot does not authorise public release.

A sparse brief may need a stated working assumption. Ask only for missing facts that change meaning, correctness, scope, or authority. There is no mandatory mode question, fixed number of references, or fixed number of variants.

## Establish the page's job

1. Read the existing brief, named sources, and relevant route, components, tokens, copy, and assets. Inspect live or rendered state where available. Keep the review bounded to the requested surface; do not trawl unrelated project history.
2. State who the visitor is, what they need to understand or do, the page's one primary action, and the evidence the page can actually show. Distinguish a client marketing page, product interface, portfolio, or exploratory demo only where that changes priorities.
3. Preserve the original assets and their rights status. Reuse licensed or owned material when appropriate. Treat third-party references as observations, not permission to copy code, imagery, identity, wording, or distinctive trade dress.
4. Do not create fictional numbers, founding years, customer logos, reviews, performance figures, working product states, prices, or guarantees for a real site. Label synthetic concepts and demos as such. Make controls and claims match what actually works.

## Direct the design

Start from the subject's real content and world: materials, language, audience, and task. Write a short direction that explains what the visitor sees and does. Give it one memorable idea, which may be typography, composition, imagery, an interaction, or deliberate stillness. A static typographic page can be the strongest choice.

A direction note can be this small:

```text
Page job:   <visitor> needs to <task>; primary action is <action>; proof is <real evidence>.
Idea:       <the one memorable thing, drawn from the subject>
Anchors:    headline shape, media (or none), colour roles, type roles, first action
Keep:       <existing assets, copy or brand rules that must survive>
Not doing:  <tempting ideas left out, and why>
```

Specify only the tokens needed to build coherently: colour roles, type roles, spacing rhythm, layout behaviour, media treatment, and motion if justified. Choose fonts for fit and readability; one or two families can work. Do not ban a colour, font, card, grid, serif, uppercase label, or effect merely because it appears in a pattern detector. Do not mandate imagery, grain, one italic word, all-caps kickers, dramatic asymmetry, three elevations, or a signature animation.

For a reference-led job, observe a real route and state before borrowing a principle. Take useful behaviour and state relationships, then transform them through this project's content and visual system. See [reference-and-components.md](references/reference-and-components.md). For composition, type, and material judgements see [design-dna.md](references/design-dna.md). Load [motion.md](references/motion.md) only when motion or interactive behaviour matters. These are selective references, not a required reading sequence.

Use [template-tells.md](references/template-tells.md) to review generic habits against an actual concept or rendered page. Keep its 30-item list exactly as written: more than five observed patterns prompts a deliberate review, never a quality score or automatic rejection. The additional tells stay qualitative. Fix weak hierarchy, empty copy, fabricated proof, and decorative interaction at their cause. Preserve an exception the brief supports.

## Build the real surface

Use the current application's stack, route, navigation, component system, and deployment setup. Make surgical changes for a fix. Do not build a second standalone app to display a production page, replace the stack without cause, or flatten semantic controls into artwork.

For a new direction, build the first viewport and one complete relevant interaction before expanding. Keep the intended headline silhouette and line breaks, image crop or absence of imagery, negative space, type, hierarchy, and main action at desktop and phone sizes. Compare the render at matching proportions with the approved pilot or reference. If a key ingredient cannot be reproduced, show the revised composition before expanding scope.

Make navigation direct and copy useful. Action labels say what happens. Links, filters, forms, and demos must lead to real behaviour or an honest unavailable state. Use semantic HTML, visible focus, keyboard and touch paths, adequate contrast and target size, and reduced-motion behaviour. Check loading, empty, error, disabled, and success states only where the surface has them. Test awkward long copy and data.

If motion is warranted, lock a clear static composition first. Choose a medium suited to the behaviour: CSS/DOM for ordinary UI, Canvas/WebGL for continuous input-reactive fields, video for fixed cinematic footage, and true geometry only for inspectable 3D. Keep meaningful content and controls live in the DOM. Do not fake a 3D environment from a single image or make navigation depend on animation.

## Review and stop

Use real screenshots of the actual route for visual acceptance. Compare phone and desktop at 360/390, 768, and 1440 widths as relevant; inspect component clipping, 200% zoom, title wraps, computed font, media crop, contrast, and the primary action. Review visual fidelity and functionality separately. See [acceptance.md](references/acceptance.md).

Fix specific observed failures. Allow at most two focused repair cycles for a repeated defect unless the task sets a stricter limit. Stop when the relevant checks pass; do not add ornament to meet a pass count. If the browser is unavailable, try one bounded fallback, then mark visual acceptance unverified and state what evidence is missing. A checklist, HTTP response, unit test, or self-awarded score does not substitute for seeing the page.

End with a short report:

```text
Artifact:    <route or file, and commit/version>
Mode:        bounded fix | approved-direction build | new direction pilot
Seen:        <widths and states actually screenshotted>
Exercised:   <interactions and paths actually tested, with result>
Tells:       <count from template-tells, with locations, if reviewed>
Open:        <what was not checked or still fails>
Next:        <the next step the user needs to approve, if any>
```

Ask for an independent review when the project's rules or the risk call for one. Local acceptance, asset approval, deployment, and live verification are separate steps; passing one does not prove the next.
