"""Строит theme.css из доминирующего цвета аватарки."""
import colorsys
import sys

from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else "img/avatar.jpg"
OUT = sys.argv[2] if len(sys.argv) > 2 else "theme.css"


def hsl_hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return tuple(round(c * 255) for c in (r, g, b))


def hexs(rgb):
    return "#%02x%02x%02x" % rgb


img = Image.open(SRC).convert("RGB").resize((96, 96))
pal = img.quantize(colors=10)
colors = pal.getcolors()  # [(count, index)]
palette = pal.getpalette()

best, best_score = None, -1
for count, idx in colors:
    r, g, b = palette[idx * 3: idx * 3 + 3]
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    if v < 0.25 or s < 0.15:  # пропускаем почти чёрный, белый и серый
        continue
    score = count * (0.3 + s) * v
    if score > best_score:
        best, best_score = h, score

# если на аватарке нет цветных пятен, берём холодный синий
hue = best if best is not None else 0.6

night = hsl_hex(hue, 0.45, 0.08)
deep = hsl_hex(hue, 0.40, 0.16)
frost = hsl_hex(hue, 0.35, 0.94)
mist = hsl_hex(hue, 0.20, 0.66)
lamp = hsl_hex(hue, 0.85, 0.72)  # светлый акцент, читается на тёмном фоне

css = f""":root {{
    --night: {hexs(night)};
    --deep: {hexs(deep)};
    --frost: {hexs(frost)};
    --mist: {hexs(mist)};
    --lamp: {hexs(lamp)};
    --lamp-rgb: {lamp[0]}, {lamp[1]}, {lamp[2]};
}}
"""
open(OUT, "w", encoding="utf-8").write(css)
print(css)
