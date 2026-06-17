---
Ticket-ID: CLVN-016
Type: Story
Epic: CLVN-015
Status: TODO
---
# Raumauswahl bestätigen

## User Story

Als INNOQ-Mitarbeiter möchte ich meine Raumauswahl bestätigen, damit ich den für mich passenden Konferenzraum reservieren kann.

## Beschreibung

Nachdem ein INNOQ-Mitarbeiter einen verfügbaren Konferenzraum für sein Meeting oder seinen Workshop gefunden hat, möchte er diesen Raum verbindlich auswählen. Die Bestätigung der Raumauswahl ist der erste Schritt im Buchungsprozess und führt den Mitarbeiter zur weiteren Eingabe von Buchungsdetails wie Meetingtitel und optionaler Buchungsnotiz.

Diese User Story ist zentral für das Epic "Raum buchen", da sie den Übergang von der Raumsuche zur eigentlichen Buchung darstellt. Der Mitarbeiter erhält durch die Bestätigung eine visuelle Rückmeldung, dass sein gewünschter Raum für den Buchungsvorgang ausgewählt wurde.

## Akzeptanzkriterien

- [ ] Ein verfügbarer Konferenzraum kann durch Klick/Tap ausgewählt werden
- [ ] Der ausgewählte Konferenzraum wird visuell hervorgehoben
- [ ] Die Raumdetails (Name, Standort, Ausstattung, Kapazität) werden bei der Auswahl angezeigt
- [ ] Der gewählte Zeitraum wird bei der Auswahl angezeigt
- [ ] Eine Bestätigungsschaltfläche ermöglicht das Fortfahren zum nächsten Buchungsschritt
- [ ] Die Auswahl kann vor der Bestätigung geändert werden
- [ ] Nach Bestätigung wird der Mitarbeiter zur Eingabe weiterer Buchungsdetails weitergeleitet

## Subtasks

Die Story ist in folgende reviewbare Code-Einheiten zerlegt (Umsetzung als Frontend-Prototyp, Ansatz: dedizierter Bestätigungs-Screen + Buchungsentwurf im AppState):

- [CLVN-016a](/docs/produkt/backlog/CLVN-016a-TASK-buchungsentwurf-im-appstate.md) Buchungsentwurf im AppState einführen
- [CLVN-016b](/docs/produkt/backlog/CLVN-016b-TASK-bestaetigungsseite-raumauswahl.md) Bestätigungsseite „Raumauswahl bestätigen" mit Routing
- [CLVN-016c](/docs/produkt/backlog/CLVN-016c-TASK-raumauswahl-detailseite-anbinden.md) Raumauswahl auf der Detailseite an den Bestätigungsschritt anbinden
- [CLVN-016d](/docs/produkt/backlog/CLVN-016d-TASK-auswahl-hervorhebung-raumliste.md) Visuelle Hervorhebung des ausgewählten Raums in der Ergebnisliste

Reihenfolge: 016a → (016b, 016d parallel möglich) → 016c.

## Betroffene Persona

[INNOQ-Mitarbeiter](/docs/produkt/personas/innoq-mitarbeiter.md)

## Zugehöriges Epic

[CLVN-015 - Raum buchen](/docs/produkt/backlog/CLVN-015-EPIC-raum-buchen.md)
