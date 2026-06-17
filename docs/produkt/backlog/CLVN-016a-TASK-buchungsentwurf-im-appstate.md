---
Ticket-ID: CLVN-016a
Type: Task
Story: CLVN-016
Epic: CLVN-015
Status: TODO
---
# Buchungsentwurf im AppState einführen

## Ziel

Ein seitenübergreifender **Buchungsentwurf** im AppState legt das Fundament für
den Bestätigungsschritt der Raumauswahl: Er hält den gewählten Konferenzraum samt
Standort und Zeitraum fest, während der INNOQ-Mitarbeiter von der Raumsuche zur
Bestätigung und weiter zur Eingabe der Buchungsdetails navigiert.

## Scope

- Typ `BuchungsEntwurf` in `frontend/src/lib/mock-data.ts` definieren – bewusst
  **ohne** Meetingtitel/Buchungsnotiz (diese gehören zu CLVN-017/CLVN-018):
  `{ raumId; standortId; datum; start; ende }`.
- `AppStateContext` in `frontend/src/lib/app-state.tsx` erweitern:
  - Feld `buchungsEntwurf: BuchungsEntwurf | null`
  - Setter zum Starten/Aktualisieren und zum Verwerfen des Entwurfs
  - saubere Einreihung in das bestehende `useMemo`-Muster (Memo-Dependencies ergänzen)
- Keine UI-Änderung, keine Verhaltensänderung an bestehenden Funktionen.

## Betroffene/neue Dateien

- `frontend/src/lib/mock-data.ts` (neuer Typ `BuchungsEntwurf`)
- `frontend/src/lib/app-state.tsx` (Interface, State, Setter, Memo-Deps)

## Abgedeckte Akzeptanzkriterien (CLVN-016)

Ermöglichendes Fundament für:
- „Ein verfügbarer Konferenzraum kann ausgewählt werden"
- „Die Auswahl kann vor der Bestätigung geändert werden"

## Definition of Done

- [ ] `BuchungsEntwurf` enthält Raum, Standort und Zeitraum, **nicht** Titel/Notiz
- [ ] `useAppState()` liefert `buchungsEntwurf` plus Setter/Reset
- [ ] Build & Typecheck grün; bestehende Funktionalität unverändert
- [ ] Wording folgt dem [Glossar](/docs/produkt/glossar.md)

## Abhängigkeiten

Keine – erster Subtask, Voraussetzung für CLVN-016b, CLVN-016c, CLVN-016d.

## Zugehörige Story

[CLVN-016 – Raumauswahl bestätigen](/docs/produkt/backlog/CLVN-016-STORY-raumauswahl-bestaetigen.md)
