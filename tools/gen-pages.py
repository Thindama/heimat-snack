#!/usr/bin/env python3
"""Erzeugt alle Unterseiten im Stil der Startseite (Header/Footer aus index.html):
Säulen (starkregen, sturm, hagel), systeme, anwendungsgebiete, denkmalschutz, ueber-uns.

Aufruf: python3 tools/gen-pages.py
"""
import re, html as H
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
idx = open(f'{ROOT}/index.html', encoding='utf-8').read()
head = idx[:idx.index('<!--HEADER-->')]
header = re.search(r'<!--HEADER-->.*?<!--/HEADER-->', idx, re.S).group(0)
footer = re.search(r'<!--FOOTER-->.*?<!--/FOOTER-->', idx, re.S).group(0)
CHECK = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4L19 6"/></svg>'
SHIELD = '<svg class="s" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>'
WARN = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></svg>'

PAGES = {
 'starkregen.html': dict(
  title='Starkregenschutz · Regenschild', desc='Schutz vor Starkregen für Haus und Keller: Starkregen-Check, Rückstausicherung, Flutschotts, Lichtschachtabdeckungen, Notdienst. Regenschild in Hegau, Bodensee und Ostschweiz.',
  hero='rain-roof', kicker='Säule 1 von 3 · Starkregen', h1='Schutz vor Starkregen',
  intro='Starkregen kann jedes Haus treffen, auch fernab von Flüssen. Wasser dringt über Kellerfenster, Lichtschächte, Türen und die Kanalisation ein. Wir schließen jede dieser Lücken.',
  cta='Starkregen-Check anfragen', sys_h='Vom Dichtschott bis zur Flutwand', sys_anchor='starkregen', systems=['dammbalken','klappschott','hochwassertueren','dichtschott','kellerluken','rueckstau'],
  facts=[('25 l/m² in 1 h','Ab dieser Menge warnt der Deutsche Wetterdienst vor Unwetter durch heftigen Starkregen.'),('Rückstauebene','Sie liegt auf Höhe der Straßenoberkante. Jeder Abfluss darunter braucht eine Rückstausicherung.'),('3 Eintrittswege','Oberfläche, Kanalisation und Grundwasser – jeder Weg braucht eine eigene Maßnahme.')],
  pruefen_img='rain-ground', pruefen_h='Erst wissen, wo das Wasser hereinkommt', pruefen_p='Jedes Grundstück hat eigene Schwachstellen. Wir finden sie, bevor es regnet – mit Blick auf Gebäude, Grundstück und die Leitung unter der Straße.',
  pruefen=['Starkregen-Check von Gebäude und Grundstück','Kanal-TV-Inspektion der Hausleitung','Prüfung bestehender Rückstausicherungen','Prüfung und Reinigung von Dachrinnen und Fallrohren'],
  schuetzen_h='Jede Lücke bekommt ihre Maßnahme', schuetzen_p='Vom Dammbalken am Garagentor bis zur Hebeanlage mit Notstrom: Diese Systeme halten Wasser draußen – auch wenn Sie nicht zu Hause sind.',
  schuetzen=['Dammbalken und Flutschotts für Türen, Tore und Garagen','Wasserdichte Türen und Kellerfenster','Druckwasserdichte Lichtschächte und Lichtschachtabdeckungen','Schwellen und Barrieren an Eingängen und Einfahrten','Abdichtung von Hauseinführungen und Mauerwerk','Rückstausicherungen und Hebeanlagen','Notstrom für Pumpen und Hebeanlagen, damit sie auch bei Stromausfall laufen','Notüberläufe für Flachdächer','Drainage und Schutz gegen drückendes Grundwasser','Auftriebssicherung für Heizöltanks','Hochwassergerechter Kellerausbau: wasserfeste Materialien, höher gelegte Stromverteilung','Automatische Schutzsysteme, die bei steigendem Wasser selbst schließen','Tiefgaragen-Schutz für Wohnanlagen','Entwässerung auf dem Grundstück: Mulden, Versickerung, Zisternen','Wassermelder und Sensoren mit Alarm aufs Handy','Notfall-Sets für zu Hause'],
  notfall_img='flood-street', notfall_h='Wenn das Wasser schon da ist', notfall_p='Mobile Systeme schützen nur, wenn jemand sie rechtzeitig einsetzt. Deshalb übernehmen wir das auf Wunsch – und sind da, wenn es trotzdem passiert.',
  notfall=['Notdienst zum Abpumpen','Bautrocknung nach Wasserschaden','Einsatz-Service: Wir setzen Ihre mobilen Schutzsysteme bei Unwetterwarnung ein, wenn Sie nicht zu Hause sind','Einlagerung Ihrer mobilen Schutzsysteme, griffbereit für den Ernstfall','Vermietung von Pumpen und mobilen Barrieren'],
  cta_h='Das nächste Unwetter kommt bestimmt. Ihr Keller bleibt trocken.', cta_p='Schicken Sie uns Fotos von Keller, Lichtschächten und Eingängen. Sie erhalten in wenigen Minuten eine erste Einschätzung – kostenlos und unverbindlich.',
  related=[('sturm.html','Säule 2','Schutz vor Sturm','Dachsicherung, Windwächter, Baumpflege, Blitzschutz.'),('hagel.html','Säule 3','Schutz vor Hagel','Hagelfeste Bauteile, Automatik für Rollläden, Schutznetze.')]),
 'sturm.html': dict(
  title='Sturmschutz · Regenschild', desc='Schutz vor Sturm für Dach, Fassade und Grundstück: Sturm-Check per Drohne, Sturmklammern, Windwächter, Baumpflege, Blitzschutz. Regenschild in Hegau, Bodensee und Ostschweiz.',
  hero='lightning-house', kicker='Säule 2 von 3 · Sturm', h1='Schutz vor Sturm',
  intro='Sturm reißt Ziegel vom Dach, beschädigt Rollläden und wirft Bäume auf Häuser. Die meisten Schäden entstehen an Stellen, die vorher niemand geprüft hat.',
  cta='Sturm-Check anfragen', sys_h='Was das Dach festhält', sys_anchor='sturm', systems=['sturmklammern','windwaechter','zubehoer'],
  facts=[('75 km/h','Sturmböen, Windstärke 9: Ab hier lösen sich lose Ziegel und Anbauten.'),('118 km/h','Orkanböen, Windstärke 12: Ungesicherte Dächer und Bäume halten das nicht aus.'),('3 Angriffspunkte','Dach, Bäume und Anbauten – alle drei prüfen wir aus der Luft und vom Boden.')],
  pruefen_img='aerial-village', pruefen_h='Das Dach aus der Luft, das Grundstück vom Boden', pruefen_p='Lose Ziegel, verrostete Klammern, morsche Äste: Wir finden die Stellen, die beim nächsten Sturm nachgeben – ohne Gerüst und ohne Risiko.',
  pruefen=['Sturm-Check per Drohne: Dach, Fassade, Antennen, Solaranlage','Prüfung von Bäumen und losen Teilen rund ums Haus'],
  schuetzen_h='Alles, was der Wind packen kann, wird gesichert', schuetzen_p='Vom Dach bis zum Gartenhaus: Diese Maßnahmen halten Ihr Gebäude zusammen, wenn es draußen stürmt.',
  schuetzen=['Sturmklammern und Dachsicherung','Windfeste Rollläden und Außenjalousien','Windwächter, die Markisen und Raffstores bei Sturm automatisch einfahren','Baumpflege und Rückschnitt am Haus','Blitz- und Überspannungsschutz','Sichern von Gartenhäusern, Pergolen, Carports und losen Teilen auf dem Grundstück'],
  notfall_img='lightning-dark', notfall_h='Wenn der Sturm schon Schaden angerichtet hat', notfall_p='Ein offenes Dach darf keine Nacht offen bleiben. Wir sichern, dokumentieren und sorgen dafür, dass die Versicherung alles bekommt, was sie braucht.',
  notfall=['Notsicherung nach Sturmschaden mit Planen und Absperrung','Schadendokumentation für die Versicherung'],
  cta_h='Das nächste Unwetter kommt bestimmt. Ihr Dach bleibt, wo es ist.', cta_p='Schicken Sie uns Fotos von Dach, Bäumen und Anbauten. Sie erhalten in wenigen Minuten eine erste Einschätzung – kostenlos und unverbindlich.',
  related=[('starkregen.html','Säule 1','Schutz vor Starkregen','Rückstausicherung, Flutschotts, Lichtschachtabdeckungen, Notdienst.'),('hagel.html','Säule 3','Schutz vor Hagel','Hagelfeste Bauteile, Automatik für Rollläden, Schutznetze.')]),
 'hagel.html': dict(
  title='Hagelschutz · Regenschild', desc='Schutz vor Hagel für Dach, Dachfenster, Solaranlage und Fassade: Hagel-Check, Hagelwiderstandsklassen, Automatik für Rollläden, Hagelschutznetze. Regenschild in Hegau, Bodensee und Ostschweiz.',
  hero='hail-ground', kicker='Säule 3 von 3 · Hagel', h1='Schutz vor Hagel',
  intro='Hagel zerstört Dachfenster, Solarmodule, Rollläden und Fassaden in wenigen Minuten. Wie gut ein Bauteil standhält, hängt von seiner Hagelwiderstandsklasse ab – und genau die prüfen wir.',
  cta='Hagel-Check anfragen', sys_h='Hagelfest gebaut, automatisch geschützt', sys_anchor='hagel', systems=['hagelschutz','windwaechter','zubehoer'],
  facts=[('2 cm Korngröße','Ab hier entstehen Schäden an Dächern, Dachfenstern und Fahrzeugen.'),('HW 1 bis HW 5','Die Hagelwiderstandsklasse sagt, welche Korngröße ein Bauteil aushält – HW 3 steht für 3 cm.'),('Minuten','Länger dauert ein Hagelschlag selten. Schutz muss vorher eingebaut oder automatisch sein.')],
  pruefen_img='solar-roof', pruefen_h='Welche Bauteile Ihres Hauses halten welchen Hagel aus?', pruefen_p='Dachfenster, Lichtkuppeln und Solarmodule sind die empfindlichsten Teile am Haus. Wir prüfen ihre Widerstandsklasse und schauen uns die Flächen aus der Luft an.',
  pruefen=['Hagel-Check: Welche Bauteile Ihres Hauses halten welchen Hagel aus?','Drohnen-Check von Solaranlage, Dachfenstern und Lichtkuppeln'],
  schuetzen_h='Hagelfest bauen, automatisch reagieren', schuetzen_p='Wo Bauteile tauschbar sind, wählen wir hagelfeste Varianten. Wo nicht, sorgen Automatik und Netze dafür, dass die empfindlichen Flächen geschützt sind, bevor das erste Korn fällt.',
  schuetzen=['Hagelfeste Dachziegel, Fassaden und Dachfenster','Automatische Steuerung, die Rollläden und Storen bei Hagelwarnung hochfährt','Hagelschutznetze für Gewächshäuser, Wintergärten und empfindliche Flächen','Carports und Hagelschutz fürs Auto'],
  notfall_img='roof-tiles', notfall_h='Nach dem Hagel: dokumentieren und besser ersetzen', notfall_p='Ein Hagelschaden ist ärgerlich, aber auch die Gelegenheit, beschädigte Teile gleich hagelfest zu ersetzen – damit es beim nächsten Mal hält.',
  notfall=['Schadendokumentation nach Hagel für die Versicherung','Austausch beschädigter Bauteile durch hagelfeste Varianten'],
  cta_h='Das nächste Unwetter kommt bestimmt. Ihre Fenster und Module halten.', cta_p='Schicken Sie uns Fotos von Dach, Dachfenstern und Solaranlage. Sie erhalten in wenigen Minuten eine erste Einschätzung – kostenlos und unverbindlich.',
  related=[('starkregen.html','Säule 1','Schutz vor Starkregen','Rückstausicherung, Flutschotts, Lichtschachtabdeckungen, Notdienst.'),('sturm.html','Säule 2','Schutz vor Sturm','Dachsicherung, Windwächter, Baumpflege, Blitzschutz.')]),
}


# ---------------------------------------------------------------------------
# Schutzsysteme (eigene, generische Beschreibungen – keine Herstellertexte)
# ---------------------------------------------------------------------------
PILLAR = {'r': ('tag-r', 'Starkregen'), 's': ('tag-s', 'Sturm'), 'h': ('tag-h', 'Hagel'), 'all': ('tag-all', 'Alle Unwetter')}
ICONS = {
 'dammbalken': '<path d="M3 20h18M4 16h16M4 12h16M4 8h16"/><path d="M4 6v14M20 6v14"/>',
 'paneel': '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M8 4v16"/>',
 'dicht': '<rect x="3" y="7" width="18" height="10" rx="2"/><rect x="7" y="10" width="10" height="4" rx="1"/>',
 'klar': '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 16l8-8M8 10l2-2"/>',
 'klapp': '<path d="M3 20h18"/><path d="M5 20V9l12-4v15"/><path d="M9 20v-9M13 20V9"/>',
 'tuer': '<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M15 12h.01M6 21h12"/><path d="M3 21h18"/>',
 'hub': '<rect x="3" y="10" width="18" height="10" rx="1"/><path d="M12 10V4M9 7l3-3 3 3"/>',
 'luke': '<rect x="3" y="12" width="18" height="6" rx="1"/><path d="M3 15h18M8 12V9h8v3"/>',
 'flut': '<path d="M3 20h18"/><path d="M6 20L10 6h4l4 14"/><path d="M8 14h8"/><path d="M3 11c1-1 2-1 3 0s2 1 3 0"/>',
 'tasche': '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2M3 13h18"/>',
 'rueck': '<path d="M3 12h7l2-4 2 8 2-4h5"/><circle cx="12" cy="12" r="9"/>',
 'pumpe': '<circle cx="12" cy="12" r="5"/><path d="M12 7V3M17 12h4M12 17v4M7 12H3M12 9a3 3 0 0 0-3 3"/>',
 'havarie': '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
 'sonder': '<path d="M4 20L20 4"/><path d="M4 20h6l10-10-6-6L4 14z"/><path d="M14 4l6 6"/>',
 'zubehoer': '<path d="M14.5 5.5a3.5 3.5 0 0 0-4.6 4.6L4 16v4h4l5.9-5.9a3.5 3.5 0 0 0 4.6-4.6l-2.3 2.3-2.1-2.1z"/>',
 'klammer': '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-5h6v5"/>',
 'wind': '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7a2 2 0 1 1-2 2"/>',
 'hagel': '<path d="M7 16a4 4 0 0 1-1-7.9A6 6 0 0 1 17.5 7 4.5 4.5 0 0 1 17 16"/><circle cx="8" cy="20" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="16" cy="20" r="1"/>',
}
SYSTEMS = [
 dict(id='dammbalken', icon='dammbalken', name='Dammbalken', p=['r'],
  desc='Aluminiumprofile, die in seitliche Führungsschienen gestapelt werden. In der Breite endlos, in der Höhe frei wählbar – das vielseitigste System für Türen, Tore und Einfahrten.',
  feat=['Leichte Ausführung: ohne Werkzeug von einer Person einsetzbar','Schwere Ausführung für Objektschutz und breite Öffnungen','UV-beständige Dichtungen, bei Beschädigung einzeln austauschbar','Schienen in, vor oder hinter der Laibung montierbar','Auf Wunsch in allen Eloxalfarben'],
  areas=['keller','haus','garage','areale','brand'], montage='Selbstmontage nach Einweisung möglich'),
 dict(id='alupaneele', icon='paneel', name='Aluminium-Paneele', p=['r'],
  desc='Einteilige Platten, die vor Fenster oder Tür in Rahmenprofile eingehängt und verspannt werden. Schnellste Lösung für kleinere Öffnungen bis etwa einen Meter Schutzhöhe.',
  feat=['Ein Bauteil, ein Handgriff','Geringes Gewicht, einfache Lagerung','Für Kellerfenster, Nebeneingänge und Terrassentüren'],
  areas=['keller','haus'], montage='Selbstmontage nach Einweisung möglich'),
 dict(id='dichtschott', icon='dicht', name='Dichtschotts', p=['r'],
  desc='Aluminiumrahmen mit umlaufender Dichtung für Kellerfenster, Lüftungsöffnungen und kleine Durchbrüche – die Stellen, über die das Wasser am häufigsten hereinkommt.',
  feat=['Für Lüftungsgitter, Kellerfenster, Rohrdurchführungen','Von innen oder außen montierbar','Sonderformen nach Aufmaß'],
  areas=['keller','sonder'], montage='Selbstmontage möglich'),
 dict(id='klarschott', icon='klar', name='Lichtdurchlässige Schotts', p=['r'],
  desc='Schutzplatten aus klarem Kunststoff für Schaufenster, Kellerfenster und Lichtschächte. Das Wasser bleibt draußen, das Tageslicht kommt weiter herein.',
  feat=['Bruchfest und UV-beständig','Ideal für Ladenlokale und Souterrain-Wohnungen','Auch als dauerhaft eingebaute Lösung'],
  areas=['keller','haus'], montage='Selbstmontage nach Einweisung möglich'),
 dict(id='klappschott', icon='klapp', name='Klappschotts', p=['r','all'],
  desc='Fest montierte Schotts, die im Boden liegen oder an der Wand ruhen und im Ernstfall in Sekunden hochgeklappt und verriegelt werden. Nichts muss aus dem Lager geholt werden.',
  feat=['Für Garagen, Tiefgaragen und Werkseinfahrten','Auch als Löschwasser- und Havariebarriere','Auf Wunsch mit automatischer Auslösung bei Wasserstand'],
  areas=['garage','areale','brand'], montage='Montage durch unsere Partnerbetriebe'),
 dict(id='hochwassertueren', icon='tuer', name='Hochwassertüren', p=['r'],
  desc='Dauerhaft eingebaute Türen, die wasserdicht schließen und im Alltag wie eine normale Tür funktionieren. Ein- oder zweiflügelig, für Haus-, Keller- und Garagentüren.',
  feat=['Kein Aufbau im Ernstfall nötig','Auf Wunsch selbstschließend bei steigendem Wasser','Geprüfte Dichtigkeit, versicherungstauglich'],
  areas=['keller','haus','garage'], montage='Montage durch Meisterbetrieb'),
 dict(id='hubschott', icon='hub', name='Schiebe- und Hubschotts', p=['r'],
  desc='Für große Öffnungen wie Hallentore, Tiefgaragen und Laderampen: Das Schott fährt aus dem Boden oder schiebt sich seitlich vor die Öffnung – manuell oder motorisch.',
  feat=['Schutzbreiten von mehreren Metern','Motorische Ausführung mit Notstrom','Anbindung an Unwetter-Alarm und Gebäudeleittechnik'],
  areas=['garage','areale'], montage='Montage durch unsere Partnerbetriebe'),
 dict(id='kellerluken', icon='luke', name='Druckwasserdichte Luken und Abdeckungen', p=['r'],
  desc='Abdeckungen für Lichtschächte, Kellerabgänge und Revisionsschächte, die auch bei drückendem Wasser dicht bleiben – begehbar oder befahrbar.',
  feat=['Für Lichtschächte, Kellertreppen, Schächte','Begehbar oder befahrbar','Mit Lüftungsfunktion lieferbar'],
  areas=['keller','sonder'], montage='Montage durch unsere Partnerbetriebe'),
 dict(id='flutwand', icon='flut', name='Mobile Flutwände', p=['r'],
  desc='Freistehende Barrieren, die sich durch den Wasserdruck selbst stabilisieren. In beliebiger Länge aufstellbar, ohne Verankerung im Boden – für Areale, Betriebsgelände und Straßen.',
  feat=['Schutzhöhen bis etwa 1,2 Meter','Wiederverwendbar, platzsparend zu lagern','Aufbau durch unseren Einsatz-Service oder Ihr Team'],
  areas=['areale','brand'], montage='Einsatz-Service oder Selbstaufbau nach Einweisung'),
 dict(id='notfallbarriere', icon='tasche', name='Notfall-Barriere in der Tasche', p=['r'],
  desc='Leichte Barriere für Eingänge, die in der Tragetasche am Objekt gelagert wird. In wenigen Minuten von einer Person aufgebaut, schützt bis etwa 50 Zentimeter Wasserhöhe.',
  feat=['Für Ladeneingänge, Haustüren, Nebeneingänge','Kein Werkzeug, keine Vorbereitung am Gebäude','Ideal für Mieter und Gewerbe ohne Umbau'],
  areas=['haus','garage','areale'], montage='Selbstaufbau'),
 dict(id='rueckstau', icon='rueck', name='Rückstausicherungen und Rückstauventile', p=['r'],
  desc='Wenn der Kanal voll ist, drückt das Wasser durch Bodenabläufe und Toiletten zurück ins Haus. Rückstausicherungen schließen diesen Weg – vom Einfamilienhaus bis zur großen Nennweite.',
  feat=['Für Misch- und Schmutzwasserleitungen','Für Bodenabläufe und Kellerentwässerung','Schließt auch Gerüche aus dem Kanal aus'],
  areas=['keller','sonder'], montage='Montage durch Sanitär-Fachbetrieb'),
 dict(id='sonderbauten', icon='sonder', name='Sonderbauten nach Maß', p=['r'],
  desc='Schräge Laibungen, Rundbögen, Natursteinfassaden oder denkmalgeschützte Öffnungen: Wo kein Standardsystem passt, fertigen wir nach Aufmaß.',
  feat=['Aufmaß vor Ort, Fertigung nach Zeichnung','Sonderfarben und unauffällige Profile','Abstimmung mit Denkmalbehörde möglich'],
  areas=['sonder','keller','haus'], montage='Montage durch unsere Partnerbetriebe'),
 dict(id='sturmklammern', icon='klammer', name='Sturmklammern und Dachsicherung', p=['s'],
  desc='Klammern, Haken und Verschraubungen halten Ziegel, Firste und Ortgänge auch bei Orkanböen. Nachrüstbar an bestehenden Dächern.',
  feat=['Nachrüstung ohne Neueindeckung','Für Ziegel, Betonstein und Blech','Prüfung per Drohne vorher und nachher'],
  areas=['haus','sonder'], montage='Montage durch Dachdecker-Partner'),
 dict(id='windwaechter', icon='wind', name='Windwächter und Rollladen-Automatik', p=['s','h'],
  desc='Sensoren fahren Markisen, Raffstores und Rollläden bei Sturm ein und bei Hagelwarnung herunter – auch wenn niemand zu Hause ist.',
  feat=['Wind- und Regensensoren am Haus','Anbindung an Unwetter-Alarm','Nachrüstbar für bestehende Antriebe'],
  areas=['haus'], montage='Montage durch Elektro-Partner'),
 dict(id='hagelschutz', icon='hagel', name='Hagelfeste Bauteile und Schutznetze', p=['h'],
  desc='Dachfenster, Lichtkuppeln, Solarmodule und Fassaden in geprüfter Hagelwiderstandsklasse. Wo Austausch nicht möglich ist, schützen Netze und Automatik.',
  feat=['Bauteile mit Hagelwiderstandsklasse HW 3 bis HW 5','Netze für Wintergärten und Gewächshäuser','Carports und Hagelschutz für Fahrzeuge'],
  areas=['haus','sonder'], montage='Montage durch unsere Partnerbetriebe'),
 dict(id='pumpen', icon='pumpe', name='Notfall-Pumpen-Set', p=['all'],
  desc='Flachsaugende Pumpen, die Wasser bis auf wenige Millimeter abpumpen – für vollgelaufene Keller, Tiefgaragen und Höfe. Mit Notstrom auch bei Stromausfall einsatzbereit.',
  feat=['Saugt bis auf wenige Millimeter ab','Öltaugliche Ausführung für Werkstätten','Vermietung oder Kauf, Einweisung inklusive'],
  areas=['keller','garage','areale','brand'], montage='Selbsteinsatz oder Notdienst'),
 dict(id='havarie', icon='havarie', name='Havarieschutz und Bindemittel', p=['all'],
  desc='Barrieren und Bindemittel halten Löschwasser, Öl und Chemikalien auf dem Gelände zurück. Für Lager, Produktion, Werkstätten und Biogasanlagen.',
  feat=['Rückhaltung an Hallentoren und Hofabläufen','Ölbindemittel für Unfälle und Leckagen','Notfallplan und Schulung für Hausmeister'],
  areas=['brand','areale'], montage='Beratung und Einsatzplanung'),
 dict(id='zubehoer', icon='zubehoer', name='Erweiterungen und Zubehör', p=['all'],
  desc='Alles, was den Schutz im Ernstfall tatsächlich funktionieren lässt: Alarm, Strom, Lagerung und der Plan, wer was tut.',
  feat=['Wassermelder mit Alarm aufs Handy','Notstrom für Pumpen und Antriebe','Wandhalterungen und Einsatzplan für mobile Systeme','Wartungsabo mit jährlichem Re-Check'],
  areas=['keller','haus','garage','areale','sonder','brand'], montage='Nach Bedarf'),
]
SYS = {s['id']: s for s in SYSTEMS}
AREAS = [
 dict(id='keller', name='Kellertüren und Kellerfenster', img='kellerfenster', p=['r'],
  lead='Der Keller ist der tiefste Punkt des Hauses – und meist der erste, der voll läuft.',
  text='Kellerfenster, Lichtschächte, Kellertüren und Bodenabläufe liegen unter der Rückstauebene. Bei Starkregen drückt das Wasser von außen gegen die Öffnungen und von unten aus dem Kanal. Wir sichern jede dieser Stellen einzeln und stimmen die Systeme aufeinander ab.',
  problems=['Lichtschächte laufen über und drücken auf das Kellerfenster','Kellertür am Außenabgang ohne Schwelle','Rückstau aus dem Kanal über Waschmaschinenanschluss und Bodenablauf'],
  sys=['dichtschott','alupaneele','klarschott','kellerluken','hochwassertueren','rueckstau','dammbalken']),
 dict(id='haus', name='Haustüren, Fenster und Terrasse', img='window-rain', p=['r','s','h'],
  lead='Bodentiefe Fenster und Terrassentüren sind schön – und bei Starkregen die schwächste Stelle im Erdgeschoss.',
  text='Eine Schwelle von wenigen Zentimetern reicht nicht, wenn die Straße zum Bach wird. Für Haus- und Terrassentüren gibt es Lösungen, die im Alltag unsichtbar bleiben: Profile in der Laibung, einhängbare Paneele oder dauerhaft dichte Türen. Markisen und Rollläden sichern wir gleich gegen Sturm und Hagel mit.',
  problems=['Terrassentür ohne ausreichende Schwelle','Haustür zur Straße hin tiefer als der Gehweg','Markise und Raffstores ohne Windwächter'],
  sys=['alupaneele','dammbalken','hochwassertueren','klarschott','notfallbarriere','windwaechter','hagelschutz']),
 dict(id='garage', name='Garagentor und Garageneinfahrt', img='garage', p=['r'],
  lead='Eine abfallende Einfahrt sammelt das Wasser der ganzen Straße – und das Garagentor hält es nicht auf.',
  text='Garagen und Tiefgaragen brauchen Systeme für große Breiten, die schnell einsatzbereit sind. Klappschotts liegen fertig montiert in der Einfahrt, Dammbalken lassen sich in Minuten stecken, Hubschotts fahren automatisch hoch. Für Wohnanlagen planen wir die Auslösung über den Unwetter-Alarm.',
  problems=['Einfahrt mit Gefälle zur Garage','Tiefgarage ohne Schutz an der Rampe','Niemand vor Ort, der mobile Systeme einsetzt'],
  sys=['klappschott','dammbalken','hubschott','hochwassertueren','notfallbarriere','pumpen']),
 dict(id='areale', name='Areale, Landschaftsbau und Betriebsgelände', img='flood-village', p=['r','all'],
  lead='Wo ein ganzes Gelände geschützt werden muss, zählt die Linie – nicht die einzelne Tür.',
  text='Für Betriebsgelände, Wohnanlagen, Hofflächen und Gemeinden planen wir Schutzlinien aus mobilen Flutwänden, Dammbalken und festen Elementen im Gelände. Das Konzept legt fest, wo das Wasser bleiben darf, und berücksichtigt Zufahrten, Rettungswege und die Entwässerung dahinter.',
  problems=['Wasser läuft über die gesamte Grundstücksbreite zu','Zufahrten müssen im Ernstfall befahrbar bleiben','Löschwasser oder Öl darf das Gelände nicht verlassen'],
  sys=['flutwand','dammbalken','klappschott','hubschott','havarie','pumpen']),
 dict(id='sonder', name='Sonderanfertigungen nach Maß', img='fachwerk-blau', p=['r','s','h'],
  lead='Rundbögen, schräge Laibungen, Naturstein, Denkmalschutz: Nicht jede Öffnung ist rechteckig.',
  text='Wo Standardsysteme nicht passen, nehmen wir Maß und lassen fertigen – mit Profilen in Fassadenfarbe, unauffälligen Schienen oder Lösungen, die von innen montiert werden. Besonders bei denkmalgeschützten Gebäuden stimmen wir die Ausführung vorher mit der Behörde ab.',
  problems=['Öffnung ist nicht rechtwinklig oder hat einen Bogen','Profile an der Fassade sind nicht erlaubt oder nicht gewünscht','Historische Fenster und Türen sollen erhalten bleiben'],
  sys=['sonderbauten','dichtschott','kellerluken','hochwassertueren','sturmklammern','hagelschutz']),
 dict(id='brand', name='Brandschutz und Havarie', img='house-night', p=['all'],
  lead='Löschwasser, Öl und Chemikalien müssen auf dem Gelände bleiben – im Notfall in Sekunden.',
  text='Für Lager, Produktion, Werkstätten und landwirtschaftliche Anlagen planen wir Rückhaltung, die im Ernstfall ohne langes Suchen funktioniert: Klappschotts an Hallentoren, Barrieren an Hofabläufen, Bindemittel griffbereit und ein Plan, wer was auslöst.',
  problems=['Löschwasser läuft über Hofabläufe in den Kanal','Öl- oder Chemikalienleckage im Lager','Keine Zuständigkeit im Notfall geregelt'],
  sys=['klappschott','dammbalken','flutwand','havarie','pumpen','zubehoer']),
]
AREA = {a['id']: a for a in AREAS}

def tags(ps):
    return '<div class="tags">' + ''.join(f'<span class="tag {PILLAR[p][0]}">{PILLAR[p][1]}</span>' for p in ps) + '</div>'

def sys_card(s, compact=False):
    feats = '' if compact else '<ul>' + ''.join(f'<li>{f}</li>' for f in s['feat']) + '</ul>'
    areas = ', '.join(f'<a href="anwendungsgebiete.html#{a}">{AREA[a]["name"]}</a>' for a in s['areas'][:4])
    meta = f'<div class="sys-meta"><div><b>Geeignet für:</b> {areas}</div><div><b>Montage:</b> {s["montage"]}</div></div>' if not compact else f'<div class="sys-meta"><div><a href="systeme.html#{s["id"]}">Details zum System</a></div></div>'
    return (f'<article class="sys-card" id="{s["id"]}">{tags(s["p"])}<svg class="s" viewBox="0 0 24 24" aria-hidden="true">{ICONS[s["icon"]]}</svg>'
            f'<h3>{s["name"]}</h3><p>{s["desc"]}</p>{feats}{meta}</article>')

def page_shell(fn, title, desc, body):
    h = head.replace('<title>Regenschild Unwetterschutz</title>', f'<title>{title}</title>')
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{H.escape(desc)}">', h)
    out = h + header + '\n<main id="content">\n' + body + '\n</main>\n' + footer + '\n\n<script src="js/regenschild.js"></script>\n</body>\n</html>\n'
    open(f'{ROOT}/{fn}', 'w', encoding='utf-8').write(out)

def hero(kicker, h1, text, img, btn1, href1, btn2, href2, extra=''):
    return f"""
<section class="hero" style="background-image: linear-gradient(90deg, rgb(8,25,39) 20%, rgba(7,22,36,.35) 80%), url('img/{img}.webp')">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-kicker">{kicker}</h1>
      <h2 class="hero-title">{h1}</h2>
      <p class="hero-text">{text}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="{href1}">{btn1}</a>
        <a class="btn btn-outline-white" href="{href2}">{btn2}</a>
      </div>{extra}
    </div>
  </div>
</section>
"""

CTA_END = """
<section class="cta-banner" id="kontakt">
  <div class="container">
    <h2 class="center light"><span class="accent">Welches System passt zu Ihrem Haus?</span> Das sagt Ihnen der KI-Check in zwei Minuten.</h2>
    <p class="center light">Adresse eingeben, ein paar Fragen beantworten, Fotos schicken. Sie erhalten eine erste Einschätzung mit Wetterdaten für Ihren Standort – kostenlos und unverbindlich.</p>
    <div class="center"><a class="btn btn-primary btn-lg" href="index.html#ki-check">KI-Check starten</a></div>
  </div>
</section>
"""

# ---- Systeme ----
def build_systeme():
    groups = [('starkregen', 'Säule 1 · Starkregen', 'Systeme gegen Wasser von oben, von der Straße und aus dem Kanal', [s for s in SYSTEMS if 'r' in s['p']]),
              ('sturm', 'Säule 2 · Sturm', 'Systeme, die Dach und Anbauten festhalten', [s for s in SYSTEMS if 's' in s['p']]),
              ('hagel', 'Säule 3 · Hagel', 'Bauteile und Automatik gegen Hagelschlag', [s for s in SYSTEMS if 'h' in s['p']]),
              ('alle', 'Für alle Unwetter', 'Pumpen, Havarieschutz und das Zubehör, das im Ernstfall entscheidet', [s for s in SYSTEMS if 'all' in s['p']])]
    secs = ''
    for i, (gid, title, sub, lst) in enumerate(groups):
        bg = ' style="background:var(--c-grey-1)"' if i % 2 else ''
        secs += f"""
<section class="section" id="{gid}"{bg}>
  <div class="container">
    <div class="section-head"><div><p class="kicker">{title}</p><h2>{sub}</h2></div><a class="btn btn-primary" href="index.html#ki-check">Passendes System finden</a></div>
    <div class="sys-grid">{''.join(sys_card(s) for s in lst)}</div>
  </div>
</section>"""
    body = hero('Schutzsysteme', 'Systeme für jede Öffnung und jedes Unwetter', 'Vom Dichtschott am Kellerfenster bis zur mobilen Flutwand für das Betriebsgelände: Jedes System ist einer Säule zugeordnet – Starkregen, Sturm oder Hagel. Welches zu Ihrem Haus passt, zeigt der KI-Check.', 'flood-street', 'KI-Check starten', 'index.html#ki-check', 'Anwendungsgebiete ansehen', 'anwendungsgebiete.html',
      '<div class="keyfacts"><div class="keyfact"><b>' + str(len([s for s in SYSTEMS if "r" in s["p"]])) + ' Systeme</b><span>gegen Starkregen und Hochwasser – mobil, fest eingebaut oder automatisch.</span></div><div class="keyfact"><b>Probeeinbau</b><span>Jedes System wird bei der Übergabe einmal komplett aufgebaut und erklärt.</span></div><div class="keyfact"><b>Wiederverwendbar</b><span>Alle mobilen Systeme sind für viele Einsätze gebaut und werden jährlich geprüft.</span></div></div>')
    body += """
<nav class="subnav" aria-label="Abschnitte">
  <div class="container"><a href="#starkregen">Starkregen</a><a href="#sturm">Sturm</a><a href="#hagel">Hagel</a><a href="#alle">Für alle Unwetter</a><a href="anwendungsgebiete.html">Anwendungsgebiete</a><a href="denkmalschutz.html">Denkmalschutz</a></div>
</nav>""" + secs + """
<section class="section intro">
  <div class="container two-col">
    <div class="col-media"><img class="phase-img" src="img/install-roof.webp" alt="" loading="lazy"></div>
    <div class="col-text">
      <p class="kicker">Montage und Probeeinbau</p>
      <h2>Jedes System wird einmal komplett aufgebaut, bevor Sie es brauchen</h2>
      <p>Bei der Übergabe bauen wir jedes System gemeinsam mit Ihnen auf, prüfen die Dichtigkeit und zeigen, wer im Ernstfall was tut. Einfache Systeme wie Dammbalken, Paneele und Dichtschotts können Sie nach dieser Einweisung selbst einsetzen. Fest eingebaute Systeme montieren unsere geprüften Partnerbetriebe.</p>
      <ul class="icon-list"><li>""" + CHECK + """Aufmaß vor Ort: lichte Breite, gewünschte Schutzhöhe, Zustand von Schwelle und Dämmung</li><li>""" + CHECK + """Probeeinbau mit Einweisung und schriftlicher Anleitung</li><li>""" + CHECK + """Wandhalterungen und Einsatzplan für die Lagerung</li><li>""" + CHECK + """Jährlicher Re-Check im Wartungsabo</li></ul>
      <p style="margin-top:24px"><a class="btn btn-primary" href="ueber-uns.html#beratung">Beratung und Preise</a></p>
    </div>
  </div>
</section>""" + CTA_END
    page_shell('systeme.html', 'Schutzsysteme · Regenschild', 'Dammbalken, Klappschotts, Hochwassertüren, Dichtschotts, mobile Flutwände, Rückstausicherungen, Sturmklammern und Hagelschutz: Alle Schutzsysteme von Regenschild, zugeordnet zu Starkregen, Sturm und Hagel.', body)

# ---- Anwendungsgebiete ----
def build_areas():
    secs = ''
    for i, a in enumerate(AREAS):
        links = ''.join(f'<a href="systeme.html#{s}">{SYS[s]["name"]}</a>' for s in a['sys'])
        probs = ''.join(f'<li><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></svg>{p}</li>' for p in a['problems'])
        flip = ' flip' if i % 2 else ''
        secs += f"""
<section class="area" id="{a['id']}">
  <div class="container two-col{flip}">
    <div class="col-media"><img class="phase-img" src="img/{a['img']}.webp" alt="" loading="lazy"></div>
    <div class="col-text">
      {tags(a['p'])}
      <h2>{a['name']}</h2>
      <p><strong>{a['lead']}</strong></p>
      <p>{a['text']}</p>
      <ul class="problems">{probs}</ul>
      <p class="kicker" style="margin:22px 0 0">Passende Systeme</p>
      <div class="sys-links">{links}</div>
      <a class="btn btn-primary" href="index.html#ki-check">Mein Haus prüfen</a>
    </div>
  </div>
</section>"""
    body = hero('Anwendungsgebiete', 'Wo das Wasser hereinkommt, entscheidet über das System', 'Keller, Haustür, Garage, Betriebsgelände oder Denkmal: Jede Öffnung hat ihre typischen Schwachstellen und ihre passenden Systeme. Hier sehen Sie, was wo funktioniert.', 'rain-ground', 'KI-Check starten', 'index.html#ki-check', 'Alle Systeme', 'systeme.html')
    body += '<nav class="subnav" aria-label="Abschnitte"><div class="container">' + ''.join(f'<a href="#{a["id"]}">{a["name"].split(",")[0].split(" und ")[0]}</a>' for a in AREAS) + '<a href="denkmalschutz.html">Denkmalschutz</a></div></nav><div class="areas">' + secs + '</div>' + CTA_END
    page_shell('anwendungsgebiete.html', 'Anwendungsgebiete · Regenschild', 'Unwetterschutz für Kellertüren und Kellerfenster, Haustüren und Terrassen, Garagentore, Betriebsgelände, Sonderanfertigungen sowie Brandschutz und Havarie – mit den passenden Systemen je Anwendungsgebiet.', body)

# ---- Denkmalschutz ----
def build_denkmal():
    body = hero('Denkmalschutz und Denkmalpflege', 'Unwetterschutz, den man am Denkmal nicht sieht', 'An denkmalgeschützten Gebäuden dürfen Profile, Schienen und Anbauten oft nicht dauerhaft an der Fassade bleiben. Wir planen Schutz, der unauffällig ist oder im Ernstfall von innen wirkt – abgestimmt mit der Denkmalbehörde.', 'denkmal-platz', 'Beratung anfragen', 'index.html#kontakt', 'Lösungen ansehen', '#loesungen')
    body += """
<section class="section intro" id="loesungen">
  <div class="container two-col">
    <div class="col-media"><img class="phase-img" src="img/fachwerk.webp" alt="" loading="lazy"></div>
    <div class="col-text">
      <p class="kicker">Starkregen am Denkmal</p>
      <h2>Schutz ohne sichtbare Profile</h2>
      <p>Für historische Türen, Fenster und Tore gibt es Lösungen, die das Erscheinungsbild nicht verändern: Führungsschienen in der Laibung in Fassadenfarbe, Dichtschotts hinter bestehenden Gittern, Schutz von innen oder Elemente, die nur im Ernstfall eingesetzt werden und keine Spuren hinterlassen.</p>
      <ul class="icon-list"><li>""" + CHECK + """Profile in Laibung und Fassadenfarbe, auf Wunsch demontierbar</li><li>""" + CHECK + """Dichtschotts und Luken hinter historischen Gittern und Fenstern</li><li>""" + CHECK + """Hochwassertüren in historischer Optik</li><li>""" + CHECK + """Rückstausicherung und Entwässerung als unsichtbarer Grundschutz</li><li>""" + CHECK + """Sonderbauten nach Maß für Bögen und Natursteinlaibungen</li></ul>
    </div>
  </div>
</section>
<section class="section" style="background:var(--c-grey-1)">
  <div class="container">
    <p class="kicker center">Drei Säulen, denkmalgerecht</p>
    <h2 class="center" style="margin-bottom:40px">Was wir an historischen Gebäuden schützen</h2>
    <div class="pillar-blocks">
      <div class="pillar-block"><h3>Starkregen</h3><ul><li>Unauffällige Schotts an Türen, Toren und Kellerfenstern</li><li>Schutz von innen, wo außen nichts angebracht werden darf</li><li>Rückstau und Grundwasser im Sanierungskonzept mitplanen</li></ul></div>
      <div class="pillar-block s"><h3>Sturm</h3><ul><li>Sturmklammern für historische Ziegel und Biberschwanz-Deckungen</li><li>Sicherung von Schornsteinen, Firsten und Ortgängen</li><li>Baumpflege im Umfeld geschützter Anlagen</li></ul></div>
      <div class="pillar-block h"><h3>Hagel</h3><ul><li>Hagelfeste Ziegel in der Form und Farbe des Bestands</li><li>Schutz für Dachfenster, Lichtkuppeln und Glasdächer</li><li>Schutznetze für Gewächshäuser und Orangerien</li></ul></div>
    </div>
  </div>
</section>
<section class="section intro">
  <div class="container two-col">
    <div class="col-text">
      <p class="kicker">So gehen wir vor</p>
      <h2>Erst die Behörde, dann das System</h2>
      <p>Der beste Zeitpunkt für Unwetterschutz am Denkmal ist die Sanierung: Dann lassen sich Schienen, Durchführungen und Entwässerung unsichtbar einplanen. Aber auch im Bestand finden wir Lösungen. Wir stimmen jede Maßnahme vorher mit der zuständigen Denkmalbehörde ab und liefern die Unterlagen dafür.</p>
      <ul class="icon-list"><li>""" + CHECK + """Bestandsaufnahme mit Fotos, Aufmaß und Drohnenflug</li><li>""" + CHECK + """Vorschlag mit Varianten: sichtbar, unauffällig, unsichtbar</li><li>""" + CHECK + """Abstimmung mit Denkmalbehörde und Architekt</li><li>""" + CHECK + """Hinweise auf Förderprogramme für Hochwasserschutz und Denkmalpflege</li><li>""" + CHECK + """Ausführung durch Partnerbetriebe mit Erfahrung im Denkmal</li></ul>
      <p style="margin-top:24px"><a class="btn btn-primary" href="index.html#kontakt">Beratung anfragen</a></p>
    </div>
    <div class="col-media"><img class="phase-img" src="img/fachwerk-blau.webp" alt="" loading="lazy"></div>
  </div>
</section>""" + CTA_END
    page_shell('denkmalschutz.html', 'Denkmalschutz · Regenschild', 'Unwetterschutz an denkmalgeschützten Gebäuden: unauffällige Schotts, Schutz von innen, denkmalgerechte Sturm- und Hagelsicherung, Abstimmung mit der Denkmalbehörde. Regenschild in Hegau, Bodensee und Ostschweiz.', body)

# ---- Über uns ----
def build_about():
    VAL = lambda icon, t, p: f'<div class="value-card"><svg class="s" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg><h3>{t}</h3><p>{p}</p></div>'
    values = VAL(ICONS['zubehoer'], 'Ein Ansprechpartner', 'Beratung, Verkauf, Montage und Wartung aus einer Hand. Sie koordinieren keine fünf Gewerke – wir tun das.') + \
             VAL('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>', 'Herstellerunabhängig', 'Wir verkaufen kein System, weil wir es auf Lager haben, sondern weil es zu Ihrer Öffnung und Ihrem Risiko passt.') + \
             VAL('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>', 'Vor dem Unwetter da', 'Unwetter-Alarm, Einsatz-Service und Wartungsabo sorgen dafür, dass der Schutz funktioniert, wenn es darauf ankommt.') + \
             VAL('<path d="M3 12h4l3-7 4 14 3-7h4"/>', 'Daten statt Bauchgefühl', 'Der KI-Check wertet Wetterdaten für Ihren Standort aus. Der Vor-Ort-Check prüft, was die Daten nicht sehen.') + \
             VAL('<path d="M4 20h16M6 20V9l6-5 6 5v11"/><path d="M10 20v-6h4v6"/>', 'Aus der Region', 'Hegau, Landkreis Konstanz, Bodensee und Ostschweiz: kurze Wege, schnelle Reaktion, bekannte Gegebenheiten.') + \
             VAL('<path d="M16 4h4v4M20 4l-7 7M8 20H4v-4M4 20l7-7"/>', 'Festpreis', 'Nach dem Vor-Ort-Check bekommen Sie ein Schutzkonzept mit Festpreis. Keine Überraschungen bei der Rechnung.')
    body = hero('Über uns', 'Regenschild schützt Häuser vor Regen, Sturm und Hagel', 'Wir beraten, liefern, montieren und warten Unwetterschutz für Hausbesitzer, Hausverwaltungen, Gewerbe und Gemeinden – in Hegau, am Bodensee und in der Ostschweiz.', 'lindau', 'Kostenlosen Erstcheck anfragen', 'index.html#kontakt', 'Beratung und Preise', '#beratung')
    body += """
<nav class="subnav" aria-label="Abschnitte">
  <div class="container"><a href="#wer">Wer wir sind</a><a href="#werte">Wofür wir stehen</a><a href="#beratung">Beratung und Preise</a><a href="#montage">Montage</a><a href="#region">Einsatzgebiet</a></div>
</nav>
<section class="section intro" id="wer">
  <div class="container two-col">
    <div class="col-text">
      <p class="kicker">Wer wir sind</p>
      <h2>Ein Unternehmen für alle drei Unwetter</h2>
      <p>Starkregen, Sturm und Hagel treffen dasselbe Haus – aber bisher kümmern sich fünf verschiedene Handwerker darum, wenn überhaupt. Regenschild ist entstanden, um das zu ändern: ein Check, ein Schutzkonzept, ein Ansprechpartner vom ersten Foto bis zur jährlichen Wartung.</p>
      <p>Wir arbeiten mit geprüften Meisterbetrieben aus der Region zusammen: Dachdecker, Metallbauer, Sanitär- und Elektrofachbetriebe führen aus, was einen Meisterbetrieb erfordert. Die Verantwortung für das Ergebnis bleibt bei uns.</p>
      <div class="person"><div class="avatar" aria-hidden="true">AT</div><div><b>Amandeep Thind</b><span>Geschäftsführer</span><p>Ihr Ansprechpartner vom Erstcheck bis zur Wartung. <span class="ph">[Kurzvorstellung: Ausbildung, Erfahrung, Motivation]</span></p></div></div>
    </div>
    <div class="col-media"><img class="phase-img" src="img/clouds-farmhouse.webp" alt="" loading="lazy"></div>
  </div>
</section>
<section class="section" id="werte" style="background:var(--c-grey-1)">
  <div class="container">
    <p class="kicker center">Wofür wir stehen</p>
    <h2 class="center" style="margin-bottom:40px">Sechs Gründe, warum Hausbesitzer Regenschild wählen</h2>
    <div class="values">""" + values + """</div>
  </div>
</section>
<section class="section" id="beratung">
  <div class="container two-col">
    <div class="col-text">
      <p class="kicker">Beratung und Preise</p>
      <h2>Transparent von Anfang an</h2>
      <p>Der Einstieg ist kostenlos. Für den Vor-Ort-Check zahlen Sie einen festen Betrag, der bei Auftrag vollständig verrechnet wird. Planungsbüros und Gemeinden erhalten Ingenieurleistungen nach Aufwand.</p>
      <table class="fee-table">
        <tr><th>KI-Erstcheck und Telefonberatung</th><td><b>kostenlos</b> – auf Grundlage Ihrer Fotos und des KI-Checks</td></tr>
        <tr><th>Vor-Ort-Check bis 1 Stunde Fahrzeit</th><td><b><span class="ph">[Preis]</span></b> – wird bei Auftrag vollständig verrechnet</td></tr>
        <tr><th>Vor-Ort-Check darüber hinaus</th><td><b><span class="ph">[Preis]</span></b> zuzüglich Fahrtkosten, Verrechnung bei Auftrag</td></tr>
        <tr><th>Schutzkonzept mit Festpreis</th><td><b>inklusive</b> im Vor-Ort-Check</td></tr>
        <tr><th>Planungsbüros, Architekten, Gemeinden</th><td>Beratung, Ausschreibungstexte, Kostenschätzung als Ingenieurleistung: <b><span class="ph">[Stundensatz]</span></b></td></tr>
        <tr><th>Wartungsabo</th><td><b><span class="ph">[Preis]</span> pro Jahr</b> – Re-Check, Wartungsnachweis, Unwetter-Alarm, Nach-Unwetter-Check</td></tr>
      </table>
      <p style="margin-top:24px"><a class="btn btn-primary" href="index.html#kontakt">Erstcheck anfragen</a></p>
    </div>
    <div class="col-media"><img class="phase-img" src="img/drone.webp" alt="" loading="lazy"></div>
  </div>
</section>
<section class="section intro" id="montage" style="background:var(--c-grey-1)">
  <div class="container two-col">
    <div class="col-media"><img class="phase-img" src="img/install-roof.webp" alt="" loading="lazy"></div>
    <div class="col-text">
      <p class="kicker">Montage und Probeeinbau</p>
      <h2>Übergabe heißt bei uns: einmal komplett aufbauen</h2>
      <p>Mobile Systeme schützen nur, wenn sie im Ernstfall schnell und richtig eingesetzt werden. Deshalb bauen wir jedes System bei der Übergabe mit Ihnen auf, prüfen die Dichtigkeit und üben den Einsatz. Sie bekommen eine schriftliche Anleitung und einen Einsatzplan für die Lagerung.</p>
      <ul class="icon-list"><li>""" + CHECK + """Einfache Systeme nach Einweisung in Selbstmontage: Dammbalken, Paneele, Dichtschotts</li><li>""" + CHECK + """Fest eingebaute Systeme durch geprüfte Partnerbetriebe</li><li>""" + CHECK + """Lieferung mit Anleitung auch außerhalb unseres Einsatzgebiets</li><li>""" + CHECK + """Einsatz-Service: Wir setzen Ihre Systeme bei Unwetterwarnung ein, wenn Sie nicht da sind</li></ul>
      <p class="kicker" style="margin-top:28px">Unsere Partnerbetriebe</p>
      <p><span class="ph">[Dachdecker-Partner]</span> · <span class="ph">[Metallbau-Partner]</span> · <span class="ph">[Sanitär-Partner]</span> · <span class="ph">[Elektro-Partner]</span></p>
    </div>
  </div>
</section>
<section class="section" id="region">
  <div class="container">
    <p class="kicker center">Einsatzgebiet</p>
    <h2 class="center" style="margin-bottom:30px">Hegau · Landkreis Konstanz · Bodensee · Ostschweiz</h2>
    <div class="grid-4 benefits-grid" style="margin-top:0">
      <div class="benefit"><h3>Hegau</h3><p>Singen · Engen · Stockach · Gottmadingen · Hilzingen</p></div>
      <div class="benefit"><h3>Landkreis Konstanz</h3><p>Konstanz · Radolfzell · Allensbach · Reichenau</p></div>
      <div class="benefit"><h3>Bodensee</h3><p>Überlingen · Meersburg · Friedrichshafen · Lindau</p></div>
      <div class="benefit"><h3>Ostschweiz</h3><p>Schaffhausen · Thurgau · St. Gallen · Kreuzlingen</p></div>
    </div>
    <p class="center" style="margin-top:30px">Andere Regionen auf Anfrage – mobile Systeme liefern wir mit Anleitung auch darüber hinaus.</p>
  </div>
</section>""" + CTA_END
    page_shell('ueber-uns.html', 'Über uns · Regenschild', 'Regenschild: Beratung, Verkauf, Montage und Wartung von Unwetterschutz aus einer Hand. Geschäftsführer Amandeep Thind. Beratung und Preise, Montage mit Probeeinbau, Einsatzgebiet Hegau, Bodensee und Ostschweiz.', body)

for fn, d in PAGES.items():
    h = head.replace('<title>Regenschild Unwetterschutz</title>', f'<title>{d["title"]}</title>')
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{H.escape(d["desc"])}">', h)
    facts = ''.join(f'<div class="keyfact"><b>{a}</b><span>{b}</span></div>' for a, b in d['facts'])
    pruefen = ''.join(f'<li>{CHECK}{x}</li>' for x in d['pruefen'])
    schuetzen = ''.join(f'<div class="service-card measure-card">{SHIELD}<span>{x}</span></div>' for x in d['schuetzen'])
    notfall = ''.join(f'<li>{CHECK}{x}</li>' for x in d['notfall'])
    syscards = ''.join(sys_card(SYS[s], compact=True) for s in d['systems'])
    related = ''.join(f'<article class="post-card"><div class="post-body"><div class="post-cats">{k}</div><h3><a href="{href}">{t}</a></h3><p>{p}</p></div></article>' for href, k, t, p in d['related'])
    related += '<article class="post-card"><div class="post-body"><div class="post-cats">Für alle Unwetter</div><h3><a href="index.html#leistungen">Check, Alarm, Wartung</a></h3><p>Drohnen-Inspektion, Unwetter-Alarm, Wartungsabo, Schadenservice.</p></div></article>'
    body = f'''
<main id="content">

<section class="hero" style="background-image: linear-gradient(90deg, rgb(8,25,39) 20%, rgba(7,22,36,.35) 80%), url('img/{d['hero']}.webp')">
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-kicker">{d['kicker']}</h1>
      <h2 class="hero-title">{d['h1']}</h2>
      <p class="hero-text">{d['intro']}</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="index.html#kontakt">{d['cta']}</a>
        <a class="btn btn-outline-white" href="#schuetzen">Maßnahmen ansehen</a>
      </div>
      <div class="keyfacts">{facts}</div>
    </div>
  </div>
</section>

<nav class="subnav" aria-label="Abschnitte">
  <div class="container"><a href="#pruefen">Prüfen</a><a href="#schuetzen">Schützen</a><a href="#systeme">Systeme</a><a href="#notfall">Im Notfall</a><a href="#weitere">Weitere Säulen</a></div>
</nav>

<section class="section intro" id="pruefen">
  <div class="container two-col">
    <div class="col-media"><img class="phase-img" src="img/{d['pruefen_img']}.webp" alt="" loading="lazy"></div>
    <div class="col-text">
      <p class="kicker">1 · Prüfen</p>
      <h2>{d['pruefen_h']}</h2>
      <p>{d['pruefen_p']}</p>
      <ul class="icon-list">{pruefen}</ul>
      <p style="margin-top:24px"><a class="btn btn-primary" href="index.html#kontakt">{d['cta']}</a></p>
    </div>
  </div>
</section>

<section class="section services" id="schuetzen" style="background:var(--c-grey-1);padding-bottom:120px">
  <div class="container narrow">
    <p class="kicker">2 · Schützen</p>
    <h2>{d['schuetzen_h']}</h2>
    <p style="max-width:720px;margin-bottom:40px">{d['schuetzen_p']}</p>
    <div class="grid-3 services-grid">{schuetzen}</div>
  </div>
</section>

<section class="section" id="systeme" style="background:#fff">
  <div class="container">
    <div class="section-head"><div><p class="kicker">Schutzsysteme für diese Säule</p><h2>{d['sys_h']}</h2></div><a class="btn btn-primary" href="systeme.html#{d['sys_anchor']}">Alle Systeme ansehen</a></div>
    <div class="sys-grid">{syscards}</div>
  </div>
</section>

<section class="section intro" id="notfall">
  <div class="container two-col">
    <div class="col-text">
      <p class="kicker">3 · Im Notfall</p>
      <h2>{d['notfall_h']}</h2>
      <p>{d['notfall_p']}</p>
      <div class="emergency">
        <h3>{WARN}Notfall-Leistungen</h3>
        <ul class="icon-list">{notfall}</ul>
      </div>
    </div>
    <div class="col-media"><img class="phase-img" src="img/{d['notfall_img']}.webp" alt="" loading="lazy"></div>
  </div>
</section>

<section class="section glossary" id="weitere" style="background:var(--c-grey-1)">
  <div class="container">
    <h2 class="center">Ein Schutzkonzept deckt alle drei Unwetter ab</h2>
    <div class="grid-3 glossary-grid">{related}</div>
  </div>
</section>

<section class="cta-banner" id="kontakt">
  <div class="container">
    <h2 class="center light"><span class="accent">Das nächste Unwetter</span> kommt bestimmt. {d['cta_h'].split('. ',1)[1]}</h2>
    <p class="center light">{d['cta_p']}</p>
    <div class="center"><a class="btn btn-primary btn-lg" href="index.html#kontakt">Jetzt Haus kostenlos prüfen lassen</a></div>
  </div>
</section>

</main>
'''
    out = h + header + body + '\n' + footer + '\n\n<script src="js/regenschild.js"></script>\n</body>\n</html>\n'
    open(f'{ROOT}/{fn}', 'w', encoding='utf-8').write(out)
    print(fn, len(out) // 1024, 'KB')

build_systeme()
build_areas()
build_denkmal()
build_about()
print('Seiten erzeugt:', ', '.join(list(PAGES) + ['systeme.html', 'anwendungsgebiete.html', 'denkmalschutz.html', 'ueber-uns.html']))
