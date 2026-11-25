# Kickloop

Modellunternehmen Kickloop: Online-Shop und zugehörige Übungen · Hermann-Scheer-Schule · © Dnk, Mrg

Statische Seiten auf Vercel. Jeder Push auf `main` wird automatisch veröffentlicht.

## Zwei Tabs (seit 20.11.2026)

Die Seite besteht aus zwei Welten, die in zwei Browser-Tabs laufen:

- **Tab 1 „Webseite“** = Shop und Mitarbeiter-Portal (`index.html`). Tab-Name `kickloop-webseite`, Symbol `assets/icon-webseite.svg`.
- **Tab 2 „Arbeitsbereich“** = Übersicht (`arbeitsbereich/`), Themenseiten (`lf2/`, `lf3/`), Übungsseiten (`uebungen/`) und die Einzel-Übungen in `index.html` (`/#quiz-…`, `/#pyramide`, `/#organigramm`, `/#popup`). Tab-Name `kickloop-arbeitsbereich`, Symbol `assets/icon-arbeitsbereich.svg`, grüner Kopf mit Rückweg.

Regeln für Links:

- Im Arbeitsbereich öffnet alles im selben Tab: **kein** `target="_blank"`. Einzige Ausnahme: der Excel-Kurs (siehe Tabelle).
- Schritte, die auf der Webseite spielen (Shop, Warenkorb, Einkauf …), bekommen `target="kickloop-webseite"` **ohne** `rel="noopener"` und das Schild `<span class="wo shop">` bzw. `<span class="wo portal">`.
- Von der Webseite in den Arbeitsbereich: `target="kickloop-arbeitsbereich"` (grüner Knopf oben rechts und in der Fußleiste).
- `assets/arbeitsbereich.js` vergibt die Tab-Namen, setzt die grüne Zeile (`assets/arbeitsbereich.css`) und wechselt den Tab. Jede neue Seite des Arbeitsbereichs bindet beide Dateien im Kopf ein.

## Grüne Zeile, Name, Fortschritt (seit 20.11.2026)

- **Grüne Zeile** oben auf jeder Seite. Im Arbeitsbereich: Rückweg, Namensschild, „Zur Webseite“. Auf der Webseite: laufende Aufgabe, Namensschild, „Arbeitsbereich“ (ersetzt dort den grünen Knopf `.abtop`).
- **Name einmal:** Das Namensschild öffnet den Dialog „Dein Name“. Gespeichert wird wie bisher unter `kickloop:me`. Steht ein Name da, entfallen die Namenskästen (`.me`) in Posteingang, Einkauf, Rechnungen, Warenkorb, Quiz und Organigramm; für Briefe bleibt die Anrede. „Nicht du?“ im Dialog löscht alles auf dem Gerät.
- **Themenseiten:** Das Skript baut jeden Schritt (`<a class="ucard">` in `<ol class="steps">`) zu einer Karte mit genau einem Knopf („Herunterladen“, „Starten“, „Zur Webseite“) und dem Häkchen „Erledigt“ um. Ohne Skript bleiben die Schritte normale Links. Arbeitsblätter werden mit dem Namen im Dateinamen gespeichert. Der Kasten `.finish` wird zur Abgabe-Karte; auf Seiten ohne Datei entfällt er.
- **Übersicht:** zeigt je Thema den Stand („3 von 6 Schritten erledigt“, „fertig“) und den nächsten Schritt. Der Stand liegt unter `kickloop:fortschritt` nur im Browser des Geräts.
- **Unterricht ist grün:** Namenskasten, Aufgabe (`.task`), Hilfen, „Prüfen“ und Speicher-Hinweis sind auch auf der Webseite grün. Beige und lila bleibt die Firma.

## Schriften und Lesbarkeit (seit 20.11.2026)

- Alle Schriften liegen lokal in `assets/fonts/` und werden über `assets/schriften.css` eingebunden. Es wird nichts mehr von Google geladen. Neue Seiten binden nur `<link rel="stylesheet" href="/assets/schriften.css">` ein.
- Die Schriften sind dieselben wie vorher: Archivo für Überschriften und Knöpfe, Hubballi als Leseschrift, IBM Plex Mono für Zahlen und Kennungen, Barlow Condensed in zwei Übungsseiten, Lexend im Wissens-Check. Eine neue Leseschrift war am 20.11.2026 kurz eingebaut und wurde auf Wunsch zurückgenommen.
- Regeln: kein Text unter 12 px, Sätze und Hinweise mindestens 14 px, Hinweisfarbe mit Kontrast über 4,5 : 1, am Handy jedes Bedienelement mindestens 44 px hoch.

## Handy (seit 20.11.2026)

- Kopf der Webseite in einer Zeile (Logo, „Interne Zahlen“, Einkaufswagen), Unterzeile entfällt.
- Schritt-Reiter und Unterreiter als eine Zeile zum Wischen. „Prüfen“ und „Speichern“ (`.bar2`, `.aktionen`) bleiben am unteren Rand stehen.
- Angebotsvergleich: Umschalter „Angebot A/B/C“ und „Brief/Kalkulation“ (`.mwahl`), darunter die Vergleichszeile (`.mvergleich`). Am PC unverändert.
- Katalog: Filter als Zeilen zum Wischen (`.tree.chips`), Artikel in zwei Spalten.

## Inhalt

| Pfad | Inhalt |
|---|---|
| `index.html` | Online-Shop / Mitarbeiter-Portal (Quelle: „00 Online-Shop Kickloop.html“). Fußleiste mit `/#impressum`, `/#kontakt`, `/#faq` und dem grünen Link zum Arbeitsbereich (`.abfoot`). Alte Links `/#arbeitsbereich` und `/#uebungsraum` leiten auf `/arbeitsbereich/` weiter. Eigene Links: `/#organigramm`, `/#quiz-kickloop`, `/#pyramide`, `/#popup`, `/#quiz-pyramide`, `/#quiz-sortiment`, `/#quiz-angebot`, `/#einkauf`. Grüner Knopf „Arbeitsbereich ↗“ auch oben rechts im Kopf (`.abtop`), öffnet den Arbeitsbereich im zweiten Tab. Das Logo führt zur Startseite. Startseite seit 20.11.2026 mit zwei Knöpfen im Kopfbild („Zum Katalog“, „Zur Werkstatt“) und dem Abschnitt „Kundenstimmen“: Der Wortlaut der vier Stimmen stammt aus Arbeitsblatt 2 „Der Marketingmix bei Kickloop“ (Zusatz für Schnelle) und darf nur zusammen mit dem Blatt geändert werden. Im Kopf stehen Beschreibung und Vorschau für geteilte Links (`og:`-Angaben, Bild `assets/teilen.png`). Die Einzel-Übungen zeigen statt Logo und Reitern den grünen Kopf des Arbeitsbereichs (`body.solo`). Warenkorb als Einkaufswagen oben rechts im Kopf (`.carttop`, kein Reiter) `/#warenkorb` (seit 20.11.2026: Online bezahlen zu Zahlungsformen Stunde 2 in drei Schritten: frei einkaufen und begründen · 6 Kundenfälle · im Online-Service Bestellungen freigeben; Ergebnis als eine Word-Datei). Reiter seit 20.11.2026 in zwei Gruppen (`.tgroup`): „Shop“ (Start, Über uns, Katalog) und „Mitarbeiter-Portal“ (`.tgportal`: Posteingang, Einkauf, Rechnungen, lila hinterlegt, mit Abteilung unter dem Namen). Namen der Reiter und der Ordner im Posteingang sowie der Platz des Schalters „Interne Zahlen“ (oben rechts) bleiben, weil Arbeitsblätter sie wörtlich nennen. |
| `arbeitsbereich/index.html` | Übersicht des Arbeitsbereichs: alle Themen von LF 2 und LF 3 als nummerierte Kacheln (bis 20.11.2026 ein Reiter in `index.html`). Kurze Adresse: `/arbeitsbereich`. Oben „So geht es“ in drei Schritten und der Knopf „Mit Thema 1 starten“; er zeigt „Weiter bei: …“, sobald ein Thema geöffnet wurde. Themen ohne Inhalt („kommt bald“) sind keine Links (`.usoon`); sobald eine Themenseite Inhalt hat, die Kachel wieder als Link schreiben. |
| `lf2/*.html` | LF 2: Unterseiten des Arbeitsbereichs (Kennenlernen, Organigramm, Sortiment, Marketing, Verkaufsgespräch, Zahlungsmittel, Pop-up-Store, Girokonto, Klausurtraining). Aufbau seit 20.11.2026: „So gehst du vor“ als Schritt-Folge (`<ol class="steps">`, Nummern zählt das CSS), Hilfe/Zusatz/Material ohne Nummer in `<div class="sx">`, am Ende der Kasten „Zum Schluss“ (`.finish`). Ändert sich eine Themenseite, auch die Angabe unter der Kachel im Arbeitsbereich (`arbeitsbereich/index.html`, `.tmeta`) anpassen. |
| `404.html` | Fehlerseite für Adressen, die es nicht gibt, mit Wegen zum Arbeitsbereich und zur Webseite |
| `lf2/dateien/` | LF 2: digitale Arbeitsblätter (ausfüllbare PDF aus „6 Digital“) zum Herunterladen, ohne Lösungen |
| `lf3/*.html` | LF 3: Unterseiten (Bezugsquellen und Anfrage, Angebotsvergleich, Bestellung, Kaufvertrag, Klausurtraining) |
| `lf3/kaufvertrag.html` | LF 3 Kaufvertrag (seit 20.11.2026): Nr. 1 „Willenserklärungen“ (seit 21.11.2026, nach Vorlage Maekelnburg 12-2021, alle PDF ausfüllbar und ohne Lösungen) in drei Schritten: (1) Gruppenarbeit `Kickloop_Willenserklaerungen.pdf` (1 Seite, Übersicht „Abgabe einer Willenserklärung“: mündlich, schriftlich, schlüssige Handlung) mit den Infotexten 1–3 als Material (`Kickloop_Willenserklaerungen_Text1_Handeln.pdf`, `Text2_Muendlich.pdf`, `Text3_Schriftlich.pdf`, je Text + Wortliste; den Text „ausdrückliche Erklärung“ gibt es seit 21.11.2026 nicht mehr, der Begriff kommt in den Materialien nicht vor); (2) danach `Kickloop_Ein-_und_zweiseitige_Rechtsgeschaefte.pdf` (Arbeitsblatt 1.1, Übersicht „Handelnde Personen“) mit Infotext 4 (`…Text4_Ein-_und_zweiseitig.pdf`); (3) Online-Übung `uebungen/lf3-willenserklaerungen.html` (Ergebnis als PDF) und darunter mit Marker „Optional“ `Kickloop_Optional_Schweigen_als_Willenserklaerung.pdf` (2 Seiten). Audio/QR-Codes der Vorlage entfallen. Piktogramme überall gleich: Mund mit Sprechblase = mündlich, Notizzettel = schriftlich, Zahnräder = schlüssige Handlung, Personen mit Pfeilen = ein-/zweiseitig, Gesicht mit Reißverschluss = Schweigen. Quelle `build/*.py` nicht im Repo. Danach Nr. 2 „Kaufvertrag“ als Platzhalter („kommt bald“), Nr. 3 Arbeitsblatt „Kaufvertragsstörungen“ (`lf3/dateien/Kickloop_Kaufvertragsstoerungen.pdf`, ausfüllbar, Quelle `build.py` nicht im Repo) mit dem Posteingang-Ordner „Reklamationen“ und den FAQ als Material. |
| Posteingang „Reklamationen“ | Stand 20.11.2026. Ordner `rek` (Link `/#reklamationen`; alte Links `/#widerruf` und `/#bewertungen` führen auch dorthin). 12 Fälle in dieser Reihenfolge: 101–105 (aus LF 2, 103 = Google-Bewertung mit Anrede per Vorname, `bew: true`) und 201–203, 205–208 (LF 3; Fall 204 gestrichen). Alle mit Entscheidung (Worum geht es? · Anspruch ja/nein · passende FAQ-Frage) und Antwort mit Prüfung und Word-Datei. Kein Anspruch: 103, 105, 202, 203, 205, 208. Die Reihenfolge entspricht der Tabelle in Aufgabe 4 des Arbeitsblatts „Kaufvertragsstörungen“. Einen Ordner für Bewertungen gibt es nicht mehr. Die Fälle stützen sich auf die FAQ (`#v-faq`, jede Frage mit `id="faq-…"`). Wer eine FAQ-Antwort ändert, prüft die Fälle mit. Stand unter `kickloop:wid`. |
| `lf3/dateien/` | LF 3: Arbeitsblätter (PDF) und Vorlage Anfrage (Word) zum Herunterladen, ohne Lösungen |
| `assets/` | Logo, gemeinsames CSS der Unterseiten (`unterseite.css`), grüner Kopf und Tab-Wechsel des Arbeitsbereichs (`arbeitsbereich.js`, `arbeitsbereich.css`), Tab-Symbole (`icon-*.svg`), Vorschaubild für geteilte Links (`teilen.png`, 1200 × 630 px) |
| `uebungen/lf2-klassenarbeitstraining.html` | LF 2: Fit für die Klassenarbeit – Organigramm, Produktpyramide, Sortiment, Kaufmotive, Verkaufsgespräch |
| `lf2/verkaufsgespraech.html` | LF 2 Verkaufsgespräch (seit 24.11.2026 mit Inhalt, Ordner 08 und 09 des Materials): (1) `Kickloop_Kaufmotive_Einstieg.pdf` (Einstieg „Meine letzten fünf Käufe“, eigenes Blatt), (2) `Kickloop_Kaufmotive.pdf` (Arbeitsblatt 4 mit Infotext 4), (3) `Kickloop_Verkaufsgespraech.pdf` (Arbeitsblatt 5: Material 5 und 6, Teil B), (4) Online-Übung „Phasen-Puzzle“. Auf Papier bleibt Teil A von Arbeitsblatt 5 ein Schnipselbogen zum Ausschneiden; digital ersetzt ihn das Phasen-Puzzle. Die PDF nennt die Übung über den Link-Namen „Phasen-Puzzle“ – die Kachel muss genau so heißen. |
| `lf2/zahlungsmittel.html` | LF 2 Zahlungsmittel: seit 24.11.2026 beginnt die Seite mit `Kickloop_Bezahlen_im_Laden.pdf` (Arbeitsblatt 1, Stunde 1) und `Kickloop_Leitfaden_Notizblatt.pdf`. Das Notizblatt begleitet alle Stunden der Reihe (einmal laden, in IServ speichern, weiterschreiben); daraus entsteht das Handlungsprodukt, der Leitfaden „Bezahlen bei Kickloop“ für neue Praktikantinnen, Praktikanten und Auszubildende. Die Arbeitsblätter nennen es „Leitfaden-Notizblatt“ – den Namen nicht ändern. |
| `uebungen/lf2-phasen-puzzle.html` | LF 2: Phasen-Puzzle (digitale Fassung von Arbeitsblatt 5, Teil A): acht Beschreibungen einer Phase zuordnen, Phasen ordnen, Zeilen in Material 5 notieren (eine Zeile mehr oder weniger zählt als richtig). Jede Aufgabe öffnet sich erst, wenn die vorige stimmt; richtige Schnipsel bleiben liegen, falsche gehen zurück in die Auswahl. Am Ende Leitfaden als PDF (MiniPdf wie in der Übung Willenserklärungen). Stand im Browser unter `kickloop:phasen-puzzle`. Die Mitschrift (32 feste Zeilen) muss mit `Kickloop_Verkaufsgespraech.pdf` und dem Word-Blatt übereinstimmen. |
| `uebungen/lf2-sortiment-training.html` | LF 2: Sortiment-Training (Wiederholung Sortiment). Antworten bleiben im Browser gespeichert. |
| `uebungen/lf2-wissens-check-zahlungen.html` | LF 2: Wissens-Check Zahlungen, Stunde 1 bis 4 (`#stunde-1` … `#stunde-4`). Bis 20.11.2026 lag er als Artefakt auf claude.ai. |
| `uebungen/lf2-klausurtraining-marketing.html` | LF 2: Klausurtraining Marketing |
| `uebungen/lf3-willenserklaerungen.html` | LF 3: Übung Willenserklärungen (3 Aufgaben aus Blatt 2 der Vorlage: WE ja/nein und Art, ein-/zweiseitig, Testament mit Musterlösung). Antworten bleiben im Browser (`kickloop:willenserklaerungen`), Ergebnis als PDF (MiniPdf aus `index.html`). |
| `uebungen/lf2-marktforschung-quiz.html` | LF 2: Quiz Marktforschung – Zielgruppe des Loop Lite. Antworten bleiben im Browser gespeichert. |
| `uebungen/lf3-bezugsquellen-anfrage.html` | LF 3: Übungen Bezugsquellen und Anfrage |
| `uebungen/lf3-trainingsraum-bezugsquellen.html` | LF 3: Trainingsraum Bezugsquellen und Anfrage |
| `uebungen/lf3-angebotsvergleich.html` | LF 3: Übungen Angebotsvergleich |
| `uebungen/lf3-excel-kalkulation.html` | LF 3: Methodische Vertiefung „Excelkalkulation“ (seit 25.11.2026), Kachel hinter dem Quiz auf `lf3/angebotsvergleich.html`. Interaktiver Kurs in 11 Schritten: Vorlage `lf3/dateien/Kickloop_Vorlage_Kalkulationsschema.xlsx` laden, Eingabezellen erkennen, dann die sechs Formeln (B6, C7, B8, C9, B10, B12) in einem Excel-Ausschnitt eintippen und prüfen lassen, Kopieren auf Spalte D und F, Testfälle mit der echten Datei, Zusatz `MIN`. Die Prüfung rechnet jede Formel mit vier Testwertsätzen nach, gibt Hinweise zu typischen Fehlern und lässt jede richtige Schreibweise gelten. **Öffnet in einem neuen Tab** (`target="_blank"`) und nimmt dem Arbeitsbereich-Tab den Namen nicht weg: `data-tab="eigen"` im Skript-Tag, Rückweg über `data-zurueck`. Stand im Browser unter `kickloop:excel-kalkulation`. Die Vorlage hat auf Blatt 1 noch die Überschrift „Qualitativer Angebotsvergleich“ (Original, nicht geändert). Lösungsdatei bewusst nicht im Repo. |

Links zum Teilen: `https://kickloop.vercel.app/uebungen/<datei>.html`

## Suchmaschinen (seit 20.11.2026)

Die Seite soll in Suchmaschinen nicht auftauchen: Kickloop ist ein Modellunternehmen, nennt aber echte Marken mit Preisen. `vercel.json` schickt deshalb für jede Datei die Kopfzeile `X-Robots-Tag: noindex` (gilt auch für PDF und Bilder). Bewusst gibt es **keine** `robots.txt` mit Sperre: Suchmaschinen müssen die Seiten abrufen dürfen, um das „noindex“ zu sehen. Wer den Link hat, erreicht die Seite wie immer.

Nicht im Repository (bewusst): Lehrkraft-Material (Lösungen, Stundenverläufe, Übersicht für Lehrkräfte), weil alles hier öffentlich erreichbar ist.
