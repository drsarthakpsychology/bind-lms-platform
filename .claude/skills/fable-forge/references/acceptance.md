# Acceptance: see the real page

Define checks from the requested change and approved direction. First prove the served route maps to the intended source and revision; a screenshot of an old bundle or alternate page is misleading. A visual claim needs screenshots of that actual route at relevant states; source review alone cannot verify appearance. Record the route, revision or artifact, viewport, state, and what was inspected.

## Visual acceptance

Compare the rendered page with the approved pilot or selected reference at matching proportions. Inspect 360 and 390 phone widths, 768 tablet width, and 1440 desktop width where relevant. Check title line breaks, actual computed fonts and weights, image crop, visual hierarchy, colour/contrast, negative space, CTA visibility, and first-viewport identity. Inspect clipping inside components as well as document overflow. Check 200% zoom and one long-copy or awkward-data case. A full-page screenshot alone can hide interaction and clipping failures.

Any real browser capture works: a browser tool in your agent, Playwright, or a manual screenshot from the user. For example:

```bash
npx playwright screenshot --viewport-size=390,844 <url> phone-390.png
npx playwright screenshot --viewport-size=768,1024 <url> tablet-768.png
npx playwright screenshot --viewport-size=1440,900 <url> desktop-1440.png
```

A quick overflow check in the browser console: `document.documentElement.scrollWidth > document.documentElement.clientWidth` should be `false` at every width.

If a browser is unavailable, try one bounded alternative capture. If neither gives a real render, state visual acceptance as UNVERIFIED with the exact missing state. Do not substitute a checklist, code inspection, or self-score.

## Functional acceptance

Exercise the meaningful user path: navigation and primary action, links, forms or filters, keyboard focus, touch, reduced motion, and loading/error/empty states that exist on this surface. Verify the result or honest unavailable state. Console and network errors matter when they affect the tested path. An HTTP 200 and a unit test are supporting evidence, not proof the experience works.

For motion-led work, inspect entry, reading hold, transition, reversal/exit, and reduced-motion fallback. A still does not prove timing. For mobile, check touch targets, viewport fit, direct navigation, and that the concept survives the narrower composition.

## Media and performance

Give images dimensions or stable aspect ratios, responsive source sizes, and sensible loading priority: prioritize the actual first-viewport/LCP media, lazy load media below the fold, and provide a poster or static fallback for video and interactive scenes. Measure performance under the stated device and network conditions when the task makes a performance claim. Do not promise universal 60 fps, LCP under 2.5 seconds, or a fixed byte budget without measured evidence.

## Repair and handoff

Fix the concrete defect found, then retest the affected state. Stop after the relevant checks pass. If the same defect persists after two focused repair cycles, report the cause, evidence, and next decision; do not claim completion. Keep local build, asset approval, deployment, and live delivery separate. Report untested devices or states plainly.
