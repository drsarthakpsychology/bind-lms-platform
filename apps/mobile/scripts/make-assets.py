"""Draws the app icon, adaptive icon, splash and notification icon as SVG.
Text is converted to outlines from the bundled Archivo files, so no font needs
to be installed. Run: python3 scripts/make-assets.py && node scripts/make-assets.mjs
"""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import os

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "assets", "fonts")
OUT = os.path.join(HERE, "..", "assets", "brand")
BLUE, LIME, INK, WHITE = "#1d44d8", "#cdf24b", "#111111", "#ffffff"


def text_path(text, font_file, size, x, y, anchor="middle", tracking=0.0):
    font = TTFont(os.path.join(FONTS, font_file))
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    scale = size / font["head"].unitsPerEm
    widths = [hmtx[cmap[ord(c)]][0] * scale + tracking * size for c in text]
    total = sum(widths) - tracking * size
    cx = x - total / 2 if anchor == "middle" else x
    out = []
    for c, w in zip(text, widths):
        pen = SVGPathPen(gs)
        gs[cmap[ord(c)]].draw(TransformPen(pen, (scale, 0, 0, -scale, cx, y)))
        out.append(pen.getCommands())
        cx += w
    return " ".join(out), total


def mark(cx, cy, s, stroke=WHITE, pupil=LIME, ring=INK):
    """The VIBHA mark (a V whose opening holds a pupil), from the web's vibha-logo.tsx; 40-unit box."""
    k = s / 40.0
    ox, oy = cx - 20 * k, cy - 21 * k
    p = lambda x, y: f"{ox + x * k:.1f} {oy + y * k:.1f}"
    return (
        f'<path d="M{p(8, 8)} L{p(20, 34)} L{p(32, 8)}" fill="none" stroke="{stroke}" stroke-width="{5 * k:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<circle cx="{ox + 20 * k:.1f}" cy="{oy + 17 * k:.1f}" r="{5 * k:.1f}" fill="{pupil}" stroke="{ring}" stroke-width="{2 * k:.1f}"/>'
    )


def svg(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{rect}{body}</svg>'


def write(name, content):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(content)


def mono_mark(cx, cy, s, colour=WHITE):
    """One-colour mark for Android themed icons and the notification icon.
    Android uses only the shape (alpha), so the pupil is a solid dot with a
    clear gap cut around it, not a ring that would merge with the V."""
    k = s / 40.0
    ox, oy = cx - 20 * k, cy - 21 * k
    p = lambda x, y: f"{ox + x * k:.1f} {oy + y * k:.1f}"
    px, py = ox + 20 * k, oy + 17 * k
    return (
        f'<defs><mask id="gap"><rect width="100%" height="100%" fill="#fff"/>'
        f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{7 * k:.1f}" fill="#000"/></mask></defs>'
        f'<path mask="url(#gap)" d="M{p(8, 8)} L{p(20, 34)} L{p(32, 8)}" fill="none" stroke="{colour}" stroke-width="{5 * k:.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{5 * k:.1f}" fill="{colour}"/>'
    )


# App icon (iOS, Play listing, legacy Android): blue field, white V, lime pupil. No transparency (iOS rule).
write("icon.svg", svg(1024, 1024, mark(512, 512, 640), BLUE))
# Android adaptive icon, 108dp canvas: the launcher masks it to a circle/squircle of about 61%,
# so the mark stays inside the central 66% safe zone. Background is the solid blue.
write("adaptive-foreground.svg", svg(1024, 1024, mark(512, 512, 430)))
write("adaptive-background.svg", svg(1024, 1024, "", BLUE))
write("adaptive-monochrome.svg", svg(1024, 1024, mono_mark(512, 512, 430)))
# Notification icon: white on transparent (Android tints it).
write("notification.svg", svg(96, 96, mono_mark(48, 48, 84)))
# Splash: only the mark, on blue (light and dark alike). Android 12+ shows the splash image inside
# a circle two thirds of its size, so the mark is kept well inside that circle; no text (it would be cut).
write("splash.svg", svg(1024, 1024, mark(512, 512, 640)))
# Wordmark for in-app use and the store listing.
d, total = text_path("VIBHA", "Archivo-Wordmark.ttf", 200, 40, 200, anchor="start", tracking=-0.02)
write("wordmark.svg", svg(int(total) + 80, 260, f'<path d="{d}" fill="{INK}"/>'))
write("favicon.svg", svg(96, 96, mark(48, 48, 64), BLUE))
# Google Play feature graphic (1024 x 500): blue, the mark, the name in white, a lime underline.
name_d, name_w = text_path("Vibha Psychology", "Archivo-800.ttf", 72, 0, 0, anchor="start", tracking=-0.02)
mark_s = 200
gap = 36
mark_w = mark_s * 0.725  # the V's drawn width, caps included
x0 = (1024 - (mark_w + gap + name_w)) / 2
name_x = x0 + mark_w + gap
d_name, _ = text_path("Vibha Psychology", "Archivo-800.ttf", 72, name_x, 266, anchor="start", tracking=-0.02)
d_sub, _ = text_path("Psychology you can practise.", "Archivo-600.ttf", 30, name_x, 314, anchor="start")
write(
    "feature-graphic.svg",
    svg(
        1024,
        500,
        mark(x0 + mark_w / 2, 262, mark_s)
        + f'<path d="{d_name}" fill="{WHITE}"/>'
        + f'<path d="{d_sub}" fill="{LIME}"/>',
        BLUE,
    ),
)
print("svg written")
