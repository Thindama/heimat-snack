#!/usr/bin/env python3
"""Baut eine Veröffentlichungs-Version der Seite in ein Zielverzeichnis.

- CSS und JS werden in jede Seite eingebettet (keine externen Stylesheets/Skripte nötig).
- index.html wird als Seitenfragment ohne <html>/<head>/<body> ausgegeben
  (für Hosts, die ein eigenes Dokumentgerüst um die Seite legen); die
  Unterseiten bleiben vollständige HTML-Dokumente.
- Nur die tatsächlich referenzierten Bilder werden kopiert.

Aufruf: python3 tools/build-artifact.py <zielordner>
"""
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'dist')
PAGES = ['index.html', 'starkregen.html', 'sturm.html', 'hagel.html', 'systeme.html', 'anwendungsgebiete.html', 'denkmalschutz.html', 'ueber-uns.html']

css = open(os.path.join(ROOT, 'css', 'regenschild.css'), encoding='utf-8').read()
js = open(os.path.join(ROOT, 'js', 'regenschild.js'), encoding='utf-8').read()

os.makedirs(os.path.join(OUT, 'img'), exist_ok=True)
used_images = set()

for page in PAGES:
    html = open(os.path.join(ROOT, page), encoding='utf-8').read()
    html = html.replace('<link rel="stylesheet" href="css/regenschild.css">', '<style>\n' + css + '\n</style>')
    html = html.replace('<script src="js/regenschild.js"></script>', '<script>\n' + js + '\n</script>')
    used_images.update(re.findall(r'img/((?:logo/)?[\w.-]+\.(?:webp|png))', html))
    if page == 'index.html':
        title = re.search(r'<title>(.*?)</title>', html, re.S).group(1)
        desc = re.search(r'<meta name="description" content="([^"]*)">', html).group(1)
        fonts = re.search(r'<link href="https://fonts\.googleapis\.com[^>]*>', html).group(0)
        style = re.search(r'<style>.*?</style>', html, re.S).group(0)
        body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
        html = '<title>%s</title>\n<meta name="description" content="%s">\n%s\n%s\n%s' % (title, desc, fonts, style, body.strip())
    open(os.path.join(OUT, page), 'w', encoding='utf-8').write(html)
    print('%-16s %6d KB' % (page, len(html.encode('utf-8')) // 1024))

for name in sorted(used_images):
    os.makedirs(os.path.dirname(os.path.join(OUT, 'img', name)), exist_ok=True)
    shutil.copy(os.path.join(ROOT, 'img', name), os.path.join(OUT, 'img', name))
print('%d Bilder kopiert nach %s' % (len(used_images), OUT))
