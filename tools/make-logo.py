"""Stellt das Regenschild-Logo frei und erzeugt Web-Varianten.

Aufruf: python3 tools/make-logo.py <logo.png>
Ergebnis in img/logo/: regenschild-logo.png (Header, ohne Claim),
regenschild-logo-full.png (mit Claim), regenschild-logo-white.png (für dunkle
Flächen), regenschild-mark.png (Symbol) und favicon.png.
"""
import sys
import numpy as np
from PIL import Image

src = Image.open(sys.argv[1]).convert("RGB")
a = np.asarray(src).astype(np.float32)

# Freistellen: Hintergrund ist nahezu weiß. Alpha aus dem Abstand zu Weiß,
# Farbe durch "Entmischen" mit Weiß zurückgewinnen.
dist = 255.0 - a.min(axis=2)
alpha = np.clip((dist - 6.0) / (255.0 - 6.0 - 60.0), 0.0, 1.0)
safe = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1.0 - alpha[..., None]) * 255.0) / safe, 0, 255)
rgba = np.dstack([rgb, alpha * 255.0]).astype(np.uint8)
full = Image.fromarray(rgba, "RGBA")


def crop(img, pad=8):
    box = img.getchannel("A").point(lambda v: 255 if v > 18 else 0).getbbox()
    l, t, r, b = box
    return img.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, img.width), min(b + pad, img.height)))


def save(img, name, height):
    w = round(img.width * height / img.height)
    img.resize((w, height), Image.LANCZOS).save("img/logo/" + name, optimize=True)
    print(name, (w, height))


def white(img):
    arr = np.asarray(img).copy()
    arr[..., :3] = 255
    return Image.fromarray(arr, "RGBA")


logo_full = crop(full)
# Header-Variante ohne Claim-Zeile (Claim liegt unter dem Schriftzug)
no_claim = np.asarray(full).copy()
no_claim[495:545, 500:1880, 3] = 0
logo = crop(Image.fromarray(no_claim, "RGBA"))
mark = crop(full.crop((110, 170, 430, 620)))

save(logo, "regenschild-logo.png", 120)
save(logo_full, "regenschild-logo-full.png", 200)
save(white(logo), "regenschild-logo-white.png", 120)
save(white(logo_full), "regenschild-logo-full-white.png", 200)
save(mark, "regenschild-mark.png", 160)
# Favicon: Symbol quadratisch
side = max(mark.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
sq.resize((64, 64), Image.LANCZOS).save("img/logo/favicon.png", optimize=True)
print("favicon.png (64, 64)")

# Favicon mit hellem, rundem Grund, damit es auch in dunklen Tabs sichtbar ist
fav = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
from PIL import ImageDraw
ImageDraw.Draw(fav).ellipse((0, 0, 127, 127), fill=(255, 255, 255, 255))
m = mark.copy(); m.thumbnail((92, 92), Image.LANCZOS)
fav.paste(m, ((128 - m.width) // 2, (128 - m.height) // 2), m)
fav.resize((64, 64), Image.LANCZOS).save("img/logo/favicon.png", optimize=True)
print("favicon.png mit Grund")
