"""Draws the app icon, adaptive icon, splash, notification icon and favicon as SVG.
The logo is the VIBHA wordmark, the same one the website uses (src/components/brand/vibha-logo.tsx):
"VIBHA" in the wide black Archivo cut, and "SCHOOL OF PSYCHOLOGY" in the pixel face where there is room.
Text is converted to outlines from the bundled font files, so no font needs to be installed.
Run: python3 apps/mobile/scripts/make-assets.py && node apps/mobile/scripts/make-assets.mjs
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import os

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "assets", "fonts")
OUT = os.path.join(HERE, "..", "assets", "brand")
# BLUE matches app.config.ts; LIME is the website's --primary.
BLUE, LIME, INK, WHITE = "#1d44d8", "#cdf24b", "#111111", "#ffffff"
WORD = "Archivo-Wordmark.ttf"
PIX = "Silkscreen.ttf"
TRACK = -0.02  # the website draws VIBHA with tracking-tight


def text_path(text, font_file, size, x, y, anchor="middle", tracking=0.0):
    """Outline of `text` with its baseline at y. Returns (path, advance width, ink box)."""
    font = TTFont(os.path.join(FONTS, font_file))
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    scale = size / font["head"].unitsPerEm
    widths = [hmtx[cmap[ord(c)]][0] * scale + tracking * size for c in text]
    total = sum(widths) - tracking * size
    cx = x - total / 2 if anchor == "middle" else x
    out = []
    box = BoundsPen(gs)
    for c, w in zip(text, widths):
        t = (scale, 0, 0, -scale, cx, y)
        pen = SVGPathPen(gs)
        gs[cmap[ord(c)]].draw(TransformPen(pen, t))
        gs[cmap[ord(c)]].draw(TransformPen(box, t))
        out.append(pen.getCommands())
        cx += w
    return " ".join(out), total, box.bounds


def vibha(cx, cy, width, fill):
    """The word VIBHA, its ink box centred on (cx, cy) and `width` wide."""
    _, _, (x0, y0, x1, y1) = text_path("VIBHA", WORD, 1000, 0, 0, anchor="start", tracking=TRACK)
    s = width / (x1 - x0)
    # Ink box at size 1000 is (x0..x1, y0..y1) with y0 = -cap height; place it centred.
    x = cx - (x0 + (x1 - x0) / 2) * s
    y = cy - (y0 + (y1 - y0) / 2) * s
    d, _, box = text_path("VIBHA", WORD, 1000 * s, x, y, anchor="start", tracking=TRACK)
    return f'<path d="{d}" fill="{fill}"/>', box


def lockup(cx, cy, width, word=LIME, sub=WHITE, sub_opacity=0.85):
    """VIBHA over SCHOOL OF PSYCHOLOGY, as on the website. The school line is as wide as the word."""
    _, _, (wx0, wy0, wx1, wy1) = text_path("VIBHA", WORD, 1000, 0, 0, anchor="start", tracking=TRACK)
    word_h = (wy1 - wy0) * width / (wx1 - wx0)
    line = "SCHOOL OF PSYCHOLOGY"
    _, _, (sx0, sy0, sx1, sy1) = text_path(line, PIX, 1000, 0, 0, anchor="start", tracking=0.06)
    ss = width / (sx1 - sx0)
    sub_h = (sy1 - sy0) * ss
    gap = word_h * 0.22
    top = cy - (word_h + gap + sub_h) / 2
    w_svg, _ = vibha(cx, top + word_h / 2, width, word)
    sub_y = top + word_h + gap + sub_h  # baseline of the school line
    d, _, _ = text_path(line, PIX, 1000 * ss, cx - (sx0 + (sx1 - sx0) / 2) * ss, sub_y, anchor="start", tracking=0.06)
    return w_svg + f'<path d="{d}" fill="{sub}" fill-opacity="{sub_opacity}"/>'


def svg(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{rect}{body}</svg>'


def write(name, content):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(content)


# App icon (iOS, Play listing, older Android): blue field, lime VIBHA, as the website shows it on blue.
# No transparency (iOS rule). 80% wide keeps clear of the rounded corners.
write("icon.svg", svg(1024, 1024, vibha(512, 512, 800, LIME)[0], BLUE))
# Android adaptive icon, 108dp canvas: launchers cut it to a circle or squircle and only the
# central 66dp circle (61% of the canvas, 626 px) is always shown. VIBHA is 590 px wide, so its
# corners sit inside that circle. Background is the solid blue.
write("adaptive-foreground.svg", svg(1024, 1024, vibha(512, 512, 590, LIME)[0]))
write("adaptive-background.svg", svg(1024, 1024, "", BLUE))
# Themed icon (Android 13+): only the shape is used, the launcher picks the colour.
write("adaptive-monochrome.svg", svg(1024, 1024, vibha(512, 512, 590, WHITE)[0]))
# Notification icon: white on transparent (Android tints it). Full width so it reads at 24dp.
write("notification.svg", svg(96, 96, vibha(48, 48, 92, WHITE)[0]))
# Splash: the full wordmark on blue, light and dark alike. Android 12+ shows the splash image
# inside a circle two thirds of its size, so the lockup stays inside a 660 px circle.
write("splash.svg", svg(1024, 1024, lockup(512, 512, 600)))
# Wordmark for in-app use and the store listing.
d, total, _ = text_path("VIBHA", WORD, 200, 40, 200, anchor="start", tracking=TRACK)
write("wordmark.svg", svg(int(total) + 80, 260, f'<path d="{d}" fill="{INK}"/>'))
write("favicon.svg", svg(96, 96, vibha(48, 48, 84, LIME)[0], BLUE))
# Google Play feature graphic (1024 x 500): blue, the wordmark lockup, a lime line under it.
d_sub, sub_w, _ = text_path("Psychology you can practise.", "Archivo-600.ttf", 34, 512, 400, anchor="middle")
write("feature-graphic.svg", svg(1024, 500, lockup(512, 220, 620) + f'<path d="{d_sub}" fill="{LIME}"/>', BLUE))
print("svg written")
