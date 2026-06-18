---
Ticket-ID: CLVN-016d
Type: Task
Story: CLVN-016
Epic: CLVN-015
Status: DONE
---
# Visuelle Hervorhebung des ausgewählten Raums in der Ergebnisliste

## Ziel

Auch in der Raumliste der Suche ist erkennbar, welcher Konferenzraum aktuell für
die Buchung ausgewählt ist. So behält der INNOQ-Mitarbeiter den Überblick über
seine Auswahl, während er zwischen Suche und Bestätigung navigiert.

## Scope

- In `frontend/src/components/room-card.tsx` die Karte des Raums hervorheben,
  dessen `id` dem aktuellen `buchungsEntwurf.raumId` entspricht.
- Eigener, klar unterscheidbarer Hervorhebungs-Stil – **darf nicht** mit dem
  bestehenden „Beste Wahl"/`bestMatch`-Styling (`ring-primary`) verwechselt werden.
- Falls nötig Prop-Durchreichung in `frontend/src/pages/RaeumeFindenPage.tsx`.
- Rein additive UI-Änderung; ohne gesetzten Entwurf bleibt die Darstellung unverändert.

## Betroffene/neue Dateien

- `frontend/src/components/room-card.tsx`
- ggf. `frontend/src/pages/RaeumeFindenPage.tsx` (Prop-Durchreichung)

## Abgedeckte Akzeptanzkriterien (CLVN-016)

- [x] Der ausgewählte Konferenzraum wird visuell hervorgehoben (Listen-/Suchkontext)

## Definition of Done

- [ ] Bei gesetztem Entwurf hebt sich die zugehörige Raumkarte erkennbar ab
- [ ] Ohne Entwurf ist die Liste unverändert
- [ ] Hervorhebung kollidiert optisch nicht mit „Beste Wahl"
- [ ] `cn()` korrekt genutzt; Wording folgt dem [Glossar](/docs/produkt/glossar.md)

## Abhängigkeiten

Benötigt CLVN-016a (Buchungsentwurf). Unabhängig von CLVN-016b/c – nach CLVN-016a
parallel umsetzbar.

## Zugehörige Story

[CLVN-016 – Raumauswahl bestätigen](/docs/produkt/backlog/CLVN-016-STORY-raumauswahl-bestaetigen.md)
