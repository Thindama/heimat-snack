# Regenschild – Unwetterschutz für Gebäude

Website für Regenschild: Schutz vor Starkregen, Sturm und Hagel in Hegau, am Bodensee und in der Ostschweiz. Statische Seite in HTML, CSS und JavaScript – ohne Build-Tool, ohne Tracking.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero, Faktenband, 4 Kernvorteile, Ansprechpartner, drei Säulen, Leistungen, Pakete, Ablauf in 4 Schritten, Vergleich, Risiko-Schnellcheck, Zielgruppen, Unwetter-Wissen, FAQ, Anfrage-Formular |
| `starkregen.html` | Säule 1: Kennzahlen, Prüfen / Schützen / Im Notfall, weitere Säulen |
| `sturm.html` | Säule 2: Kennzahlen, Prüfen / Schützen / Im Notfall, weitere Säulen |
| `hagel.html` | Säule 3: Kennzahlen, Prüfen / Schützen / Im Notfall, weitere Säulen |
| `css/regenschild.css` | Stylesheet (Inter/Roboto, Petrol `#09716d`, Akzent Regenblau `#3cc3d6`, dunkle Bänder, Karten, Scroll-Reveal, mobile Navigation) |
| `js/regenschild.js` | Mobile Navigation, Faktenband, Scroll-Reveal, Zähler, Schnellcheck, FAQ-Akkordeon, Anfrage-Text, WhatsApp-Link, Unternavigation der Säulen |
| `img/` | Fotos (Pexels-Lizenz, kommerziell nutzbar, keine Namensnennung nötig) |
| `tools/build-artifact.py` | Baut eine Version mit eingebettetem CSS/JS für die Veröffentlichung |

## Vor dem Livegang ausfüllen

Platzhalter sind gelb gestrichelt markiert (Klasse `ph`) und stehen in allen vier Seiten:

- `[Telefon]`, `[WhatsApp]`, `[E-Mail]`, `[Adresse]`
- `[Preis]` für Vor-Ort-Check und Wartungsabo (Pakete und FAQ auf der Startseite)
- `[Impressum]`, `[Datenschutz]` im Footer (Links auf eigene Seiten setzen)
- WhatsApp-Button: in `js/regenschild.js` die Nummer bei `KONTAKT.whatsapp` eintragen (international, ohne `+`), dann wird der Button „Per WhatsApp senden“ aktiv.

## Lokal ansehen

```
python3 -m http.server 8000
```

und `http://localhost:8000` öffnen.

## Hinweis

Der Ordner `assets/` sowie `css/style.css` und `js/script.js` stammen aus einem früheren Entwurf und werden nicht mehr verwendet; sie können gelöscht werden.
