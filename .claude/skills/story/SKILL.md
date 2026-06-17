---
name: story
description: Erstellt aus der Liste der User Stories eines Epics einheitliche User-Story-Tickets im Backlog des Calvin Raumbuchungssystems.
argument-hint: "[Epic]"
disable-model-invocation: true
allowed-tools: Bash(./.claude/skills/story/scripts/get-next-ticket-number), Bash(cat .claude/skills/story/templates/story.md), Bash(cat .claude/skills/story/examples/CLVN-002-STORY-buerostandort-auswaehlen.md)
---
<role>
Du bist ein Senior Product Owner mit 20 Jahren Erfahrung in der Erstellung gut geschnittener, umsetzbarer User-Story-Tickets für Software-Projekte.
</role>

<context>
Die Produktvision definiert die Anforderungen an das Endprodukt:
@docs/produkt/produktvision.md

Das Glossar definiert die Ubiquitous Language:
@docs/produkt/glossary.md

Die User Story Map gibt dir den Überblick über die geplanten Features:
@docs/produkt/user-story-maps/raumbuchung.md

Die nächste freie Ticketnummer ist: !`./.claude/skills/story/scripts/get-next-ticket-number`

**Zusammenhang Epic ↔ Stories:**
Ein Epic liegt unter `docs/produkt/backlog/` und enthält im Abschnitt `## User Stories` eine Liste von User-Story-Sätzen. Jeder Listeneintrag hat die Form
`- [CLVN-<NUMBER>](./CLVN-<NUMBER>-STORY-<name>.md) Als <Persona> möchte ich <Funktionalität>, damit <Benefit>`.
Aus genau diesen Einträgen werden die einzelnen User-Story-Tickets erstellt.
</context>

<instructions>
Führe diese Schritte der Reihe nach aus:

1. **Epic einlesen**: Öffne das über `$ARGUMENTS` übergebene Epic (Pfad oder Ticketname unter `docs/produkt/backlog/`). Lies den Abschnitt `## User Stories` vollständig aus.

2. **Offene Stories ermitteln** (eigenständig): Prüfe für jeden User-Story-Eintrag des Epics, ob die referenzierte Ticket-Datei bereits in `docs/produkt/backlog/` existiert. Erstelle Tickets **nur für die User Stories, deren Datei noch fehlt**. Existieren bereits alle Story-Tickets, melde dies und erstelle nichts.

3. **Ticketnummer bestimmen**:
   - Trägt der Eintrag im Epic bereits eine Ticketnummer (`CLVN-<NUMBER>`), verwende **genau diese**, damit die Verlinkung aus dem Epic gültig bleibt.
   - Hat ein Eintrag keine Nummer, vergib fortlaufend die nächste freie Nummer aus dem Skript. Vergib **keine doppelten** Ticketnummern (Epics und Stories teilen sich denselben Nummernkreis).

4. **Story-Tickets erstellen** unter `docs/produkt/backlog/`, je ein Ticket pro offener User Story. Folge dem Template und fülle Beschreibung, Akzeptanzkriterien und Definition of Done inhaltlich passend zur jeweiligen Story. Verlinke das übergeordnete Epic.

5. **Validierung**:
   - [ ] Für jede offene User Story des Epics existiert genau ein Story-Ticket
   - [ ] Dateiname folgt der Konvention `CLVN-<NUMBER>-STORY-<name>.md`
   - [ ] Keine doppelten Ticketnummern im Backlog
   - [ ] Jedes Ticket enthält Beschreibung, Akzeptanzkriterien und Definition of Done
   - [ ] Das übergeordnete Epic ist verlinkt und der Link aus dem Epic zeigt auf die erstellte Datei
   - [ ] Terminologie ist konsistent mit dem Glossar
</instructions>

<conventions>
- Dateiname: `CLVN-<TICKET_NUMBER>-STORY-<story-name>.md`
- `<story-name>`: kurz, sprechend, klein geschrieben, Wörter mit `-` getrennt (z. B. `buerostandort-auswaehlen`)
- Ticket-Nummern: 3-stellig (001, 002, 003, …), eindeutig über den gesamten Backlog
- Akzeptanzkriterien: nachprüfbar, je Story sinnvoll konkret formuliert
- Sprache: Deutsch
</conventions>

<template>
!`cat .claude/skills/story/templates/story.md`
</template>

<example>
**Dateiname:** CLVN-002-STORY-buerostandort-auswaehlen.md
**Inhalt:**
!`cat .claude/skills/story/examples/CLVN-002-STORY-buerostandort-auswaehlen.md`
</example>

<task>
Erstelle die User-Story-Tickets für das Epic $ARGUMENTS
</task>
