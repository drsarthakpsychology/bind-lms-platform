# Layout defect checker

`e2e/layout-defects.mjs` loads screens at several widths, light and dark, and lists text that overflows, is cut, overlaps, is under 12px, runs over 80 characters a line, controls under 44px on touch widths, and sideways page scroll.

Against a running site (`next dev --webpack`):

    node e2e/layout-defects.mjs --base http://localhost:3000 --pages /,/login,/waitlist --out /tmp/defects --md /tmp/defects/list.md

Against a fixture build (one page per `?page=NAME`, `&theme=dark`, sets `window.__ready`):

    node e2e/layout-defects.mjs --harness file:///path/index.html --pages home,reader --widths 320,360,390,412,768,1024,1440 --themes light,dark --out /tmp/defects --shots all

Join several runs into one list: `--reports a/report.json,b/report.json --md list.md`.

Mark something that is meant to look that way with `data-layout-ok` (or `data-layout-ok="overlap"` for one check). The gate for a redesigned screen is zero defects at all seven widths in both themes. The November 2026 baseline is in `LAYOUT_DEFECTS_2026_11.md`.
