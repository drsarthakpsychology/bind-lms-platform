# Responsive checklist — student side

What still needs a **visual check** after the 2026-11-06 mobile/tablet pass
(branch `agent/mobile`). The changes were made from a code audit: the app
could not run here (no `.env.local`, no Playwright browsers), so nothing
below has been seen on a screen yet.

Take screenshots at deviceScaleFactor 1, light and dark, at:
**360, 390, 768, 820, 1024, 1280×600, 1440**. Also try 320 (reflow) and
one real phone and one real iPad.

## How the shell now behaves

| Width | Navigation | Top bar |
|---|---|---|
| < 768 | Bottom tabs + "More" drawer | Scrolls away |
| 768–1023 | Icon rail (always slim); ☰ opens the full menu drawer | Sticky, 56 px |
| ≥ 1024 | Sidebar (full ≥ 1280 or by choice, rail below) | Sticky, 64 px if the screen is ≥ 720 px tall, else 56 px |

- `--nav-h` is 0 whenever no bottom tab bar is on screen.
- `tall:` / `short:` Tailwind variants split at 720 px height.
- `pointer-coarse:` raises shared buttons, top-bar icons, the avatar and rail cells to 44 px.

## Check on screen

### Shell (every page)
- [ ] 768 and 820: rail on the left, no bottom tabs, content not hidden under anything; ☰ opens the drawer; drawer closes on Escape and after picking a page.
- [ ] 768: rail labels readable (12 px on touch) and none clipped, including admin rail.
- [ ] 1280×600: top bar is 56 px; the sidebar fills exactly the space under it (no gap, no double scrollbar).
- [ ] 1024 on an iPad (touch): buttons and rail cells are 44 px; nothing appears only on hover.
- [ ] Android with gesture bar and iPhone with home indicator: bottom tabs, the study Back/Next bar and the lecture "Next" bar all clear the system bar.
- [ ] Long email in the account menu and the drawer: the middle is cut, the `@domain` stays.
- [ ] Admin on 768: admin rail items and section tabs still work; "Back to admin" switch visible from 640 up.

### Study reader (`/study/<module>/<section>`)
- [ ] 768/820: two columns (contents rail + text), app rail hidden on this page; text column wide enough to read (~45+ characters).
- [ ] 360/390: Back/Next bar at the bottom; Next is the wide right-hand button with "Part N of M"; last part says "End of this section".
- [ ] Reduced motion on: moving between parts jumps, doesn't glide.
- [ ] 320: "Module N" and "Section N of M" buttons fit on one row.
- [ ] Diagnosis builder: the counter bar sticks only on screens ≥ 720 px tall and wraps at 320.

### Lecture player (`/courses/<id>/lessons/<id>`)
- [ ] 360: Back-to-course link and "Lectures 2 of 9" fit on one row; long course names truncate in the Back link only.
- [ ] 360/768: the pinned Previous/Next bar sits flush on the safe area (it used to float 66 px up on this page).
- [ ] 1024+: up-next rail sits under the top bar, scrolls on its own.

### Pages
- [ ] Home: week carousel swipes at 360; "All lectures" link not cramped; WhatsApp button wraps at 320.
- [ ] Notifications: "Mark all read" fits beside the title at 320; two-line message previews.
- [ ] Doubts: the two field labels sit close to their fields; posting still works; filter chips scroll sideways at 320 without page overflow.
- [ ] Achievements: share buttons wrap cleanly; credential IDs wrap.
- [ ] Settings: profile card at 320 with a long email.
- [ ] Practice hub, Study home, module page, checkpoint: side margins are 16 px on phones (they were 32 px).
- [ ] iOS Safari: tapping any text field (doubts, notes, widgets' write-in answers, search) does not zoom the page.

## Known, not fixed here
- Settings "Email address" and "Role" rows look tappable (chevron) but do nothing.
- Lecture picker links lectures without a video to `#`.
- `ActivityFrame` (used by games) still adds its own side padding on phones; the games pages are owned elsewhere.
- Bottom tab labels are 11 px.
