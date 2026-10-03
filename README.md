# Regenschild – Unwetterschutz für Gebäude

Website für Regenschild: Schutz vor Starkregen, Sturm und Hagel in Hegau, am Bodensee und in der Ostschweiz. Statische Seite in HTML, CSS und JavaScript – ohne Build-Tool, ohne Tracking.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero mit Regen-Animation, Faktenband, Risiko-Schnellcheck, drei Säulen, Ablauf, Leistungen, Warum Regenschild, Ansprechpartner, Zielgruppen-Tabs, FAQ, Anfrage-Formular |
| `starkregen.html` | Säule 1: Prüfen / Schützen / Im Notfall |
| `sturm.html` | Säule 2: Prüfen / Schützen / Im Notfall |
| `hagel.html` | Säule 3: Prüfen / Schützen / Im Notfall |
| `css/regenschild.css` | Design-System (Farben, Typografie, Layout, Animationen, Dark Mode) |
| `js/regenschild.js` | Regen/Hagel-Canvas, Wetterleuchten, Scroll-Reveal, Zähler, Schnellcheck, Tabs, FAQ, Anfrage-Text, WhatsApp-Link |
| `img/` | Fotos (Pexels-Lizenz, kommerziell nutzbar, keine Namensnennung nötig) |
| `tools/build-artifact.py` | Baut eine Version mit eingebettetem CSS/JS für die Veröffentlichung |

## Vor dem Livegang ausfüllen

Platzhalter sind gelb gestrichelt markiert (Klasse `ph`) und stehen in allen vier Seiten:

- `[Telefon]`, `[WhatsApp]`, `[E-Mail]`, `[Adresse]`
- `[Preis]` für den Vor-Ort-Check (FAQ auf der Startseite)
- `[Impressum]`, `[Datenschutz]` im Footer (Links auf eigene Seiten setzen)
- WhatsApp-Button: in `js/regenschild.js` die Nummer bei `KONTAKT.whatsapp` eintragen (international, ohne `+`), dann wird der Button „Per WhatsApp senden“ aktiv.

## Lokal ansehen

```
python3 -m http.server 8000
```

und `http://localhost:8000` öffnen.

## Hinweis

Der Ordner `assets/` sowie `css/style.css` und `js/script.js` stammen aus einem früheren Entwurf und werden nicht mehr verwendet; sie können gelöscht werden.
