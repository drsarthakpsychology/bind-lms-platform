# Motion: choose the job and medium

Read only when a surface needs motion. First make the static state complete and legible. Motion earns its place by showing a state change, explaining a mechanism, guiding attention once, or expressing an approved concept. Frequent actions should feel immediate. A still page is valid.

## Route by behavior

| Need | Likely medium | Check |
| --- | --- | --- |
| Open, close, selection, feedback | CSS/DOM or existing UI library | Can a person interrupt or reverse it? |
| A few elements share scroll progress | Scroll state and DOM | Is direct navigation still available? |
| Many particles or glyphs react to input | Canvas/WebGL | Is essential text still in the DOM? |
| Light/shallow relief reacts on an image | CSS or mapped still, only if justified | Is this truly better than a static image? |
| Fixed camera or subject motion | Video with poster | Is footage owned/licensed and loading bounded? |
| Inspectable spatial object | Real 3D geometry | Is rotation/depth necessary to the task? |

Use one coherent movement language. A major cinematic or interactive treatment rarely needs decorative scroll reveals layered over it. A single still plate is not a navigable 3D world. Use the existing motion system when there is one; do not introduce GSAP, Lenis, WebGL, or paid media solely for prestige.

## Build useful transitions

Start with the state relationship, then choose duration, easing, and distance. Common working values are quick UI transitions around 150–250 ms, modest 4–12 px movement, and an ease-out curve. These are starting points, not mandatory values or guarantees. Keep frequent UI actions fast, with open/close asymmetry only when it improves perceived response. Avoid delayed close, distracting repeated entrance effects, and `transition: all`.

For drawers, accordions, tabs, and modals, preserve focus, escape behavior, scroll position, and keyboard state. Allow interruption. Animate transform/opacity when practical; measure layout motion when the behavior genuinely needs it. Prevent first-paint jumps. Keep a stable poster or final state when video, Canvas, or WebGL cannot run.

Respect `prefers-reduced-motion`: essential content and controls must remain available without movement. Pause continuous work when hidden and bound device/GPU load to the actual target. Test touch as well as pointer where an interaction invites manipulation.

Review entry, reading hold, interaction, reversal, and exit. Use a recording or live browser when timing matters. A still screenshot does not verify motion, and an attractive animation does not verify a usable control.
