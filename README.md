# Wahlkampf im Wandel — USA 1789 – heute

Interaktive Scrollytelling-Präsentation zur Geschichte des US-Wahlkampfs für den
Themenbereich **Gesellschaft & Kultur im Wandel**. Die Seite führt durch
**8 Medienepochen** und **21 Stationen** — von George Washingtons »stand, don't
run« bis zu Deepfakes und KI im Wahlkampf 2024.

## Idee

Jede Epoche bekommt ihr **eigenes visuelles Gewand** — Farbpalette, Typografie
und „Flair" (Texturen, Scanlines, Deco-Linien, Neon …). Beim Scrollen wandelt
sich der Look mit dem jeweiligen Leitmedium: Pergament → Woodtype → Sepia →
Art-Deco-Radio → Schwarzweiß-TV → News-Chyron → Web 1.0 → Dark-Mode-Feed.

Am Ende steht das **Fazit** (vom Überzeugen zum Mobilisieren zur
Fragmentierung) mit der Leitfrage: *Was macht das mit der Demokratie?*

## Öffnen

Einfach `index.html` im Browser öffnen — kein Build, kein Server nötig.
Die Inhalte liegen in `data.js` und werden clientseitig gerendert, damit die
Präsentation auch lokal (`file://`) und offline läuft.

Für die Online-Version (z. B. GitHub Pages) werden die Epochen-Fonts von Google
Fonts geladen; ohne Netz greifen automatisch System-Schriften als Fallback.

## Bedienung

- **Scrollen** oder **Pfeiltasten ↑ ↓** — von Station zu Station springen
- **Zeitleiste links** — Punkte anklicken, um direkt zu einer Station zu springen
- **Anzeige oben rechts** zeigt die aktuelle Epoche; der Balken oben den Fortschritt

## Dateien

| Datei         | Inhalt                                                        |
|---------------|--------------------------------------------------------------|
| `index.html`  | Einstiegspunkt, Font-Einbindung, Grundgerüst                 |
| `data.js`     | Alle Inhalte (Meta, 8 Epochen, 21 Stationen, Fazit)          |
| `styles.css`  | Basis-Layout + Themes und Flair-Overlays je Epoche           |
| `app.js`      | Baut die Präsentation aus den Daten und steuert das Scrollen |

## Inhalte anpassen

Texte, Jahre, Titel und Farbpaletten stehen in `data.js` und lassen sich dort
direkt bearbeiten — neue Stationen einfach als weiteres Objekt im Array
`stationen` ergänzen (mit passendem `epoche`-Schlüssel).

> **Hinweis:** Farbpaletten und Fonts sind Startwerte zum Iterieren, keine
> Vorgabe. Daten/Zitate vor der Präsentation final gegenchecken.
