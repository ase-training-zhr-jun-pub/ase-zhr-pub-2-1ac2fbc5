# Epics: Raumbuchung

Diese Epics sind aus der [User Story Map](../user-story-maps/raumbuchung.md) und der
[User Journey](../user-journeys/raumbuchung.md) für die **Raumbuchung** abgeleitet.
Jede Backbone-Aktivität der Story Map entspricht einem Epic. Die Begriffe folgen dem
[Glossar](../glossar.md).

Die Scope-Angaben (**MVP** / **Future**) sind direkt aus der User Story Map übernommen.

---

## Epic 1: Bedarf identifizieren

**Als** INNOQ-Mitarbeiter **möchte ich** meinen Bedarf für einen Konferenzraum
erkennen und konkretisieren, **damit** ich gezielt nach einem passenden Raum suchen kann.

- Wert: Ausgangspunkt der Journey – schafft Klarheit über Zeitfenster und Teilnehmerzahl.
- Umfang: vollständig **Future** (keine MVP-Stories).

**Future**
- Kalender öffnen und Termine einsehen
- Bedarf für Raum erkennen
- Zeitfenster für Meeting festlegen
- Anzahl der Teilnehmer bestimmen

---

## Epic 2: Räume finden

**Als** INNOQ-Mitarbeiter **möchte ich** verfügbare Konferenzräume an einem Standort
finden, **damit** ich einen zu meinem Anlass passenden Raum auswählen kann.

- Wert: Realisiert **Multi-Standort** und **Wahlfreiheit** – Räume über alle 8 Standorte hinweg.

**MVP**
- Bürostandort auswählen
- Verfügbare Räume am Standort anzeigen
- Raumdetails einsehen

**Future**
- Räume nach Raumgröße (Kapazität) filtern
- Räume nach Ausstattung filtern

---

## Epic 3: Auswahl treffen

**Als** INNOQ-Mitarbeiter **möchte ich** für einen gewählten Zeitraum die
Verfügbarkeit eines Konferenzraums prüfen und ihn mit meinen Anforderungen abgleichen,
**damit** ich sicher den richtigen Raum auswähle und Doppelbuchungen vermeide.

- Wert: Kern der **Verfügbarkeitsanzeige** – gibt die Sicherheit, dass der Raum frei ist.

**MVP**
- Gewünschtes Datum auswählen
- Start- und Endzeit festlegen
- Verfügbarkeit für Zeitraum prüfen
- Belegte Zeitfenster erkennen
- Raumausstattung mit Anforderungen abgleichen
- Raumgröße (Kapazität) mit Teilnehmerzahl abgleichen

**Future**
- Alternative Zeitfenster anzeigen

---

## Epic 4: Raum buchen

**Als** INNOQ-Mitarbeiter **möchte ich** meine Raumbuchung verbindlich absenden und
eine Bestätigung erhalten, **damit** der Konferenzraum für meinen Zeitraum reserviert
und durch Blockierung vor Doppelbuchung geschützt ist.

- Wert: Schließt die zentrale **Raumbuchung** ab und erzeugt die Buchungsbestätigung.

**MVP**
- Raumauswahl bestätigen
- Raumbuchung absenden
- Buchungsbestätigung erhalten

**Future**
- Buchungsnotiz hinzufügen
- Meetingtitel eingeben

---

## Epic 5: Buchungen verwalten

**Als** INNOQ-Mitarbeiter **möchte ich** meine eigenen Raumbuchungen einsehen und
verwalten, **damit** ich jederzeit Transparenz über meine Buchungen habe und sie bei
Bedarf anpassen kann.

- Wert: Liefert die **Buchungsübersicht** und schafft Transparenz über eigene Buchungen.

**MVP**
- Seite "Meine Buchungen" aufrufen
- Übersicht aller eigenen Raumbuchungen sehen

**Future**
- Einzelne Raumbuchung im Detail ansehen
- Raumbuchung exportieren/teilen
- Raumbuchung stornieren
- Raumbuchung ändern/verschieben
