/* Wahlkampf im Wandel — Inhaltsdaten
 * Inline eingebunden (kein fetch), damit die Präsentation auch lokal
 * per file:// ohne Server läuft.
 *
 * Hinweis: Farbpaletten und Fonts sind Startwerte zum Iterieren.
 * Daten/Zitate vor der Präsentation final gegenchecken.
 */
window.WAHLKAMPF_DATA = {
  "meta": {
    "titel": "Wahlkampf im Wandel",
    "untertitel": "USA 1789 – heute",
    "hinweis": "Farbpaletten und Fonts sind Startwerte zum Iterieren, keine Vorgabe. Daten/Zitate vor der Präsentation final gegenchecken.",
    "sprache": "de"
  },
  "epochen": {
    "I": {
      "name": "Gründungszeit: Man bewirbt sich nicht",
      "zeitraum": "1789–1820er",
      "palette": ["#f2e8d5", "#c9b28a", "#6b4f2a", "#3a2a17"],
      "typo": "Serifen (z. B. EB Garamond / Playfair)",
      "flair": "Pergament-Textur, Federkiel, gedämpftes Kerzenlicht"
    },
    "II": {
      "name": "Massendemokratie & Branding",
      "zeitraum": "1820er–1850er",
      "palette": ["#e8dcc0", "#b23a2e", "#1f3a5f", "#d9a441"],
      "typo": "kräftige Slab-Serif / Woodtype",
      "flair": "Fahnen, Fackelzug-Glühen, Holzschnitt-Look"
    },
    "III": {
      "name": "Foto, Presse & Maschinen",
      "zeitraum": "1860–1890er",
      "palette": ["#d8cbb3", "#8a7a5c", "#4a3f30", "#2b241b"],
      "typo": "klassische Vintage-Serif",
      "flair": "Sepia-Fotografie, Vignette, Papierkorn"
    },
    "IV": {
      "name": "Radio",
      "zeitraum": "1920er–1940er",
      "palette": ["#101418", "#c8a24a", "#e6d9b8", "#5a4a2a"],
      "typo": "Art-Deco-Geometric (z. B. Poiret One)",
      "flair": "goldene Deco-Linien, Mikrofon, warmes Röhrenglühen"
    },
    "V": {
      "name": "Fernsehen",
      "zeitraum": "1950er–1970er",
      "palette": ["#1a1a1a", "#e8e8e8", "#8c8c8c", "#c0392b"],
      "typo": "Mid-Century-Sans (Futura-artig)",
      "flair": "Schwarzweiß, Scanlines, TV-Rauschen, Testbild-Akzent"
    },
    "VI": {
      "name": "Berater, Spin & Kabel-TV",
      "zeitraum": "1980er–1990er",
      "palette": ["#0b1e3f", "#e01e5a", "#f2c94c", "#1f1f2e"],
      "typo": "fette Sans mit News-Chyron",
      "flair": "VHS-Sättigung, Nachrichten-Bauchbinde, CRT-Glow"
    },
    "VII": {
      "name": "Internet 1.0",
      "zeitraum": "2000er",
      "palette": ["#eaf2fb", "#2d7ff9", "#0a2540", "#7fb3ff"],
      "typo": "frühe Web-Sans (Verdana-Vibe)",
      "flair": "Verlauf-Buttons, Glanz, Pixel-Cursor"
    },
    "VIII": {
      "name": "Social Media, Daten & Post-Truth",
      "zeitraum": "2010er–heute",
      "palette": ["#0d0d12", "#1da1f2", "#e0245e", "#00e5a8"],
      "typo": "moderne UI-Sans (Inter)",
      "flair": "Dark-Mode-Feed, Notification-Badges, Glitch/Neon"
    }
  },
  "stationen": [
    {
      "id": 1,
      "epoche": "I",
      "jahr": "1789",
      "titel": "Washington: »Man bewirbt sich nicht«",
      "text": "George Washington wird ohne Gegenkandidaten gewählt. Aktiv um Stimmen zu werben gilt als würdelos — die Devise lautet »stand, don't run«: Man stellt sich zur Verfügung, man kämpft nicht."
    },
    {
      "id": 2,
      "epoche": "I",
      "jahr": "1800",
      "titel": "Adams vs. Jefferson: Die Parteipresse schlägt zu",
      "text": "Der erste erbittert geführte Wahlkampf der USA — ausgetragen in Parteizeitungen und Schmähschriften, während die Kandidaten selbst schweigen. Trotz aller Härte geht die Macht erstmals friedlich von einer Partei zur anderen über."
    },
    {
      "id": 3,
      "epoche": "II",
      "jahr": "1828",
      "titel": "Jackson: Der erste moderne Wahlkampf",
      "text": "Mit dem fast allgemeinen Wahlrecht für weiße Männer entstehen Massenparteien, lokale Komitees und Kundgebungen — dazu gezielte persönliche Angriffe. Politik wird zur Massenbewegung."
    },
    {
      "id": 4,
      "epoche": "II",
      "jahr": "1840",
      "titel": "»Tippecanoe«: Marketing wird geboren",
      "text": "Die »Log Cabin«-Kampagne verkauft William Harrison als einfachen Mann aus der Blockhütte — obwohl er wohlhabend war. Mit Slogans, Liedern und Merchandise entsteht das politische Image."
    },
    {
      "id": 5,
      "epoche": "III",
      "jahr": "1860",
      "titel": "Lincoln & die Fotografie",
      "text": "Ein Porträt des Fotografen Mathew Brady und eine große Rede machen den wenig bekannten Lincoln national anschlussfähig — »Brady made me president«, soll er gesagt haben. Das Bild wird zum Wahlkampfmittel."
    },
    {
      "id": 6,
      "epoche": "III",
      "jahr": "1896",
      "titel": "McKinley vs. Bryan: Geld & Organisation",
      "text": "Berater Mark Hanna erfindet das moderne Fundraising und flutet das Land mit Millionen Flugblättern. McKinley empfängt Besucher von der Veranda, Bryan tourt mit dem Zug durchs Land — zwei Stile prallen aufeinander."
    },
    {
      "id": 7,
      "epoche": "IV",
      "jahr": "1920/24",
      "titel": "Radio betritt die Politik",
      "text": "Zum ersten Mal überträgt das Radio Wahlergebnisse und Parteitage. Politik erreicht die Menschen direkt im Wohnzimmer — nicht mehr nur gedruckt, sondern als Stimme."
    },
    {
      "id": 8,
      "epoche": "IV",
      "jahr": "1930er",
      "titel": "FDR & die Fireside Chats",
      "text": "Mit seinen »Fireside Chats« spricht Franklin D. Roosevelt die Bürger über das Radio persönlich und intim an. Die Stimme umgeht die Presse und wird zum direkten Draht zur Nation."
    },
    {
      "id": 9,
      "epoche": "V",
      "jahr": "1952",
      "titel": "Eisenhower: Der erste TV-Spot",
      "text": "Werbeprofis aus der Madison Avenue produzieren die ersten TV-Wahlspots (»Eisenhower Answers America«). Politik wird beworben wie ein Produkt — und Nixons »Checkers«-Rede rettet per Fernsehen seine Karriere."
    },
    {
      "id": 10,
      "epoche": "V",
      "jahr": "1960",
      "titel": "Kennedy vs. Nixon: Die erste TV-Debatte",
      "text": "Das erste im Fernsehen übertragene Präsidentschaftsduell. Der telegene Kennedy wirkt souverän, der schwitzende Nixon angeschlagen — plötzlich zählt das Bild mehr als das Argument."
    },
    {
      "id": 11,
      "epoche": "V",
      "jahr": "1964",
      "titel": "»Daisy«: Der Angst-Spot",
      "text": "Nur ein einziges Mal läuft der »Daisy«-Spot: ein Mädchen mit Blume, dann eine Atompilzexplosion. Angst wird zur Waffe — die emotionale Negativwerbung ist geboren."
    },
    {
      "id": 12,
      "epoche": "V",
      "jahr": "1968",
      "titel": "»The Selling of the President«",
      "text": "Nixons Kampagne inszeniert den Kandidaten mit Medienberatern wie ein Produkt. Ein Buchtitel bringt es auf den Punkt: »The Selling of the President«. Der Kandidat wird zur Marke."
    },
    {
      "id": 13,
      "epoche": "VI",
      "jahr": "1984",
      "titel": "Reagan: »Morning in America«",
      "text": "Warme Bilder, Optimismus und eiserne Message-Disziplin: Reagans Kampagne macht Fernsehen zur Bühne. Der »Great Communicator« verkauft ein Gefühl, kein Programm."
    },
    {
      "id": 14,
      "epoche": "VI",
      "jahr": "1988",
      "titel": "»Willie Horton«: Negativwerbung eskaliert",
      "text": "Angst-Spots über einen entflohenen Häftling prägen den Wahlkampf und bedienen rassistische Ressentiments. Ein unglückliches Panzerfoto von Gegenkandidat Dukakis besiegelt dessen Image-Debakel."
    },
    {
      "id": 15,
      "epoche": "VI",
      "jahr": "1992",
      "titel": "Clinton: »War Room« & Dauerwahlkampf",
      "text": "Clintons »War Room« kontert Angriffe in Echtzeit — »It's the economy, stupid«. Der Kandidat tritt bei MTV und Talkshows auf, und CNN etabliert den 24-Stunden-Nachrichtenzyklus."
    },
    {
      "id": 16,
      "epoche": "VII",
      "jahr": "2004",
      "titel": "Howard Dean: Das Netz mobilisiert",
      "text": "Dean sammelt Kleinspenden online und organisiert Anhänger über Meetup und Blogs. Das Netz mobilisiert die Basis — bis der »Dean Scream« zeigt, wie das Fernsehen einen Moment zerstören kann."
    },
    {
      "id": 17,
      "epoche": "VII",
      "jahr": "2008",
      "titel": "Obama: Die erste »Social-Media-Wahl«",
      "text": "Obama nutzt Facebook, YouTube und riesige E-Mail-Listen, bricht Rekorde bei Online-Kleinspenden und beginnt mit gezielter Wähleransprache. »Yes We Can« geht viral."
    },
    {
      "id": 18,
      "epoche": "VIII",
      "jahr": "2012",
      "titel": "Obama 2.0: Daten gewinnen Wahlen",
      "text": "Ein Team aus Datenwissenschaftlern modelliert das Wählerverhalten und testet jede E-Mail per A/B-Verfahren. Romneys heimlich gefilmtes »47%«-Video zeigt: Im Smartphone-Zeitalter wird alles aufgezeichnet."
    },
    {
      "id": 19,
      "epoche": "VIII",
      "jahr": "2016",
      "titel": "Trump: Twitter, Microtargeting & Cambridge Analytica",
      "text": "Trump nutzt Twitter als direkten Megafon-Kanal und dominiert die Gratis-Berichterstattung. Facebook-Microtargeting, der Cambridge-Analytica-Datenskandal, »Fake News« und Memes prägen die Wahl — »post-truth« wird zum Wort des Jahres. Der Populismus wird digital."
    },
    {
      "id": 20,
      "epoche": "VIII",
      "jahr": "2020",
      "titel": "Pandemie-Wahlkampf & Desinformation",
      "text": "Corona macht den Wahlkampf digital-first: virtuelle Events, gewaltige Online-Werbebudgets, TikTok als neue Bühne. Desinformation und die »Stop the Steal«-Erzählung vergiften das Vertrauen in die Wahl."
    },
    {
      "id": 21,
      "epoche": "VIII",
      "jahr": "2024",
      "titel": "KI betritt den Wahlkampf",
      "text": "Künstliche Intelligenz erreicht den Wahlkampf: Deepfakes, KI-Bilder und ein gefälschter Biden-Anruf (Robocall). Kampagnen laufen TikTok-nativ, über Influencer und Podcasts — die Öffentlichkeit zersplittert in getrennte Welten."
    }
  ],
  "fazit": {
    "titel": "Vom Überzeugen zum Mobilisieren — und zur Fragmentierung",
    "punkte": [
      "Massenansprache → Microtargeting: von »alle sehen dieselbe Botschaft« zu »jede*r sieht eine andere«.",
      "Gatekeeper → Direktkanal: Die Presse als Filter verschwindet, der Kandidat spricht ungefiltert — von FDRs Radio bis Trumps Twitter.",
      "Gemeinsame Fakten → Filterblasen: Social Media belohnt Emotion und Empörung und wirkt als Verstärker des Populismus."
    ],
    "frage": "Was macht das mit der Demokratie?"
  }
};
