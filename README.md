# Regenschild – Unwetterschutz für Gebäude

Website für Regenschild: Schutz vor Starkregen, Sturm und Hagel in Hegau, am Bodensee und in der Ostschweiz. Statische Seite in HTML, CSS und JavaScript – ohne Build-Tool, ohne Tracking.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero, Faktenband, 4 Kernvorteile, KI-Check als Schrittfolge, Ansprechpartner, drei Säulen, Leistungen, Pakete, Ablauf in 4 Schritten, Vergleich, Zielgruppen, Unwetter-Wissen, FAQ, Anfrage-Formular |
| `starkregen.html` | Säule 1: Kennzahlen, Prüfen / Schützen / Systeme / Im Notfall, weitere Säulen |
| `sturm.html` | Säule 2: Kennzahlen, Prüfen / Schützen / Systeme / Im Notfall, weitere Säulen |
| `hagel.html` | Säule 3: Kennzahlen, Prüfen / Schützen / Systeme / Im Notfall, weitere Säulen |
| `systeme.html` | Alle Schutzsysteme, gruppiert nach Säule (Starkregen, Sturm, Hagel, alle Unwetter), mit Anwendungsgebieten und Montagehinweis |
| `anwendungsgebiete.html` | Kellertüren und Kellerfenster, Haustüren und Terrasse, Garagentor, Areale und Betriebsgelände, Sonderanfertigungen, Brandschutz und Havarie |
| `denkmalschutz.html` | Unwetterschutz an denkmalgeschützten Gebäuden, alle drei Säulen |
| `ueber-uns.html` | Wer wir sind, Werte, Beratung und Preise, Montage und Probeeinbau, Einsatzgebiet |
| `tools/gen-pages.py` | Erzeugt alle Unterseiten aus Header und Footer der Startseite; Inhalte der Systeme und Anwendungsgebiete stehen dort als Daten |
| `css/regenschild.css` | Stylesheet (Inter/Roboto, Farben aus dem Logo: Sturmblau `#1f4f7a`, Sturm-Navy `#081927`, Regenblau `#7fc0ec`; Karten, mobile Navigation, Animationen) |
| `js/regenschild.js` | Mobile Navigation, Animationen, Zähler, Schnellcheck, FAQ-Akkordeon, Anfrage-Text, WhatsApp-Link, Unternavigation der Säulen |
| `img/` | Fotos (Pexels-Lizenz, kommerziell nutzbar, keine Namensnennung nötig) |
| `img/logo/` | Freigestelltes Logo: Header, Footer mit Claim, weiße Version für dunkle Flächen, Symbol, Favicon |
| `tools/make-logo.py` | Erzeugt die Logo-Varianten aus der Original-Datei neu |
| `tools/build-artifact.py` | Baut eine Version mit eingebettetem CSS/JS für die Veröffentlichung |

## KI-Check

Der Check auf der Startseite läuft als Schrittfolge: Adresse, Gebäudeart, Keller und Lage, Dach und Umgebung, Glas und Technik, bisherige Schäden, Wetteranalyse, Ergebnis. Er läuft komplett im Browser ohne eigenen Server:

- Adresssuche über Photon (OpenStreetMap-Daten), Ersatz Nominatim
- Wetterarchiv der letzten zehn Jahre (Niederschlag, Sturmböen) und Höhenmodell über Open-Meteo
- Ergebnis: drei Risikobalken, Wetterkennzahlen, vergangene Ereignisse, Empfehlungen, passende Systeme; Übernahme in das Anfrageformular
- Ohne Adresse rechnet der Check nur mit den Antworten. Es werden keine Daten gespeichert.

Die Dienste sind kostenlos nutzbar; bei hohem Aufkommen sollten eigene Schlüssel oder ein eigener Server dazwischen geschaltet werden.

## Animationen

- Hero: Regen, schräger Sturmregen oder Hagel je nach Seite, gelegentliches Wetterleuchten, Parallax-Hintergrund, gestaffelter Einstieg
- Überschriften bauen sich Wort für Wort auf, Akzentwörter mit Lichtglanz
- Karten gleiten, kippen oder zoomen gestaffelt herein, Lichtschein folgt der Maus
- Bilder öffnen sich mit Wisch-Effekt und Zoom, ausgewählte Bilder mit Parallax
- Icons zeichnen sich Strich für Strich, die Ablauf-Linie wächst mit
- Header schrumpft beim Scrollen, Fortschrittsbalken oben, Glanz auf Buttons
- Bei der Systemeinstellung „Bewegung reduzieren“ ist alles abgeschaltet

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
