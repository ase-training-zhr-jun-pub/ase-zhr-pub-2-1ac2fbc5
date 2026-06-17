---
Ticket-ID: CLVN-016b
Type: Task
Story: CLVN-016
Epic: CLVN-015
Status: DONE
---
# Bestätigungsseite „Raumauswahl bestätigen" mit Routing

## Ziel

Ein dedizierter Bestätigungs-Screen zeigt dem INNOQ-Mitarbeiter den gewählten
Konferenzraum und Zeitraum als eigenständigen Schritt im Buchungsprozess und
ermöglicht das Bestätigen oder Ändern der Auswahl, bevor er zur Eingabe weiterer
Buchungsdetails weitergeleitet wird.

## Scope

- Neue Seite `frontend/src/pages/RaumauswahlBestaetigenPage.tsx` unter der Route
  `/buchung/bestaetigen` (in `frontend/src/App.tsx` registrieren).
- Liest den `buchungsEntwurf` aus dem AppState (CLVN-016a) und zeigt:
  - Raumdetails: Name, Standort, Ausstattung, Kapazität
  - gewählter Zeitraum: Datum, Von–Bis
- Aktionen:
  - **„Auswahl bestätigen"** → navigiert zum Folgeschritt (Buchungsdetails).
    Anschlusspunkt für CLVN-017/CLVN-018; in diesem Ticket als klar markiertes
    Navigationsziel/Platzhalter umgesetzt.
  - **„Auswahl ändern"** → zurück zur Raumdetailseite.
- **Fallback bei leerem Entwurf** (z. B. Reload/Direktaufruf): Hinweis + „Zurück
  zur Suche", analog dem bestehenden „Raum nicht gefunden"-Muster in
  `RaumDetailPage`.
- Wiederverwendung vorhandener Card-/Badge-Muster, `cn()`, Datumsformatierung wie
  im Bestand (`split("-").reverse().join(".")`).

## Betroffene/neue Dateien

- `frontend/src/pages/RaumauswahlBestaetigenPage.tsx` (neu)
- `frontend/src/App.tsx` (neue Route)

## Abgedeckte Akzeptanzkriterien (CLVN-016)

- [x] Die Raumdetails (Name, Standort, Ausstattung, Kapazität) werden bei der Auswahl angezeigt
- [x] Der gewählte Zeitraum wird bei der Auswahl angezeigt
- [x] Eine Bestätigungsschaltfläche ermöglicht das Fortfahren zum nächsten Buchungsschritt
- [x] Die Auswahl kann vor der Bestätigung geändert werden
- [x] Nach Bestätigung wird der Mitarbeiter zur Eingabe weiterer Buchungsdetails weitergeleitet

## Definition of Done

- [x] Mit gesetztem Entwurf zeigt die Seite alle Raumdetails + Zeitraum
- [x] „Auswahl bestätigen" navigiert zum Folgeschritt; „Auswahl ändern" geht zurück
- [x] Ohne Entwurf greift der Fallback (Hinweis + Zurück zur Suche)
- [x] Route `/buchung/bestaetigen` ist direkt ansteuerbar (Build/Typecheck/Lint grün)
- [x] Wording folgt dem [Glossar](/docs/produkt/glossar.md)

> Hinweis: Der vollständige Klick-Durchlauf (Suche → Detail → Bestätigung mit
> gesetztem Entwurf) wird erst nach CLVN-016c möglich, da dort der Entwurf über die
> UI gesetzt wird. Der Folgeschritt `/buchung/details` ist ein Platzhalter
> (Anschluss CLVN-017/018).

## Abhängigkeiten

Benötigt CLVN-016a (Buchungsentwurf im AppState).

## Zugehörige Story

[CLVN-016 – Raumauswahl bestätigen](/docs/produkt/backlog/CLVN-016-STORY-raumauswahl-bestaetigen.md)
