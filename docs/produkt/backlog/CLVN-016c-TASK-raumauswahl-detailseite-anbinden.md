---
Ticket-ID: CLVN-016c
Type: Task
Story: CLVN-016
Epic: CLVN-015
Status: TODO
---
# Raumauswahl auf der Detailseite an den Bestätigungsschritt anbinden

## Ziel

Von der Raumdetailseite aus kann ein verfügbarer Konferenzraum für ein gewähltes
Zeitfenster ausgewählt und der Buchungsentwurf an den Bestätigungsschritt
übergeben werden. Damit wird der Übergang von der Raumsuche in den Buchungsprozess
zu einem klaren, eigenen Schritt – statt wie bisher direkt in einem Dialog zu buchen.

## Scope

- In `frontend/src/pages/RaumDetailPage.tsx`:
  - Den bisherigen Inline-Buchungs-Dialog (Meetingtitel/Buchungsnotiz +
    direktes `addBuchung`) **entfernen** – diese Verantwortung zieht in
    CLVN-017/CLVN-018/CLVN-019 um.
  - Stattdessen eine Schaltfläche **„Auswahl bestätigen"**, die nur bei
    verfügbarem Zeitfenster aktiv ist, den `buchungsEntwurf`
    (raumId/standortId/datum/start/ende) setzt und nach `/buchung/bestaetigen`
    navigiert.
  - Visuelle Hervorhebung des aktuell gewählten Zeitfensters/Raums als „ausgewählt".
- **Guard:** Button zusätzlich bei ungültigem Zeitfenster (Von ≥ Bis) deaktivieren.
- **Wichtig:** `addBuchung` im AppState bleibt erhalten (wird von CLVN-019 und den
  Mock-Bestandsdaten weiter benötigt) – nur der Aufruf auf der Detailseite entfällt.

## Betroffene/neue Dateien

- `frontend/src/pages/RaumDetailPage.tsx`

## Abgedeckte Akzeptanzkriterien (CLVN-016)

- [x] Ein verfügbarer Konferenzraum kann durch Klick/Tap ausgewählt werden
- [x] Der ausgewählte Konferenzraum wird visuell hervorgehoben (Detailseite)
- Trägt zum Anstoß von „Bestätigungsschaltfläche / Weiterleitung" bei (mit CLVN-016b)

## Definition of Done

- [ ] Verfügbarer Raum lässt sich auswählen → Entwurf gesetzt → Navigation zur Bestätigungsseite
- [ ] Belegtes oder ungültiges Zeitfenster ist nicht auswählbar (Button deaktiviert)
- [ ] Kein Buchungs-Dialog und kein `addBuchung`-Aufruf mehr auf der Detailseite
- [ ] `addBuchung` im AppState weiterhin vorhanden
- [ ] Wording folgt dem [Glossar](/docs/produkt/glossar.md)

## Abhängigkeiten

Benötigt CLVN-016a (Buchungsentwurf) und CLVN-016b (Ziel-Route `/buchung/bestaetigen`).
Letzter Subtask in der Reihenfolge, da er die bestehende Hauptfunktion umbaut.

## Zugehörige Story

[CLVN-016 – Raumauswahl bestätigen](/docs/produkt/backlog/CLVN-016-STORY-raumauswahl-bestaetigen.md)
