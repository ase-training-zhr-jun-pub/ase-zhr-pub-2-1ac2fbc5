# Qualitätsanforderungen Calvin

Fünf priorisierte Qualitätsszenarien nach arc42.
Jedes Szenario folgt dem Schema: **Environment · Source · Event · Artifact · Response · Measure**.

---

## Qualitätsbaum

| Priorität | ID | Qualitätsmerkmal | Kurzbezeichnung |
|-----------|-----|-----------------|-----------------|
| 1 | QS-1 | Zuverlässigkeit | Keine Doppelbuchungen |
| 2 | QS-2 | Performance | Suchantwortzeit |
| 3 | QS-3 | Benutzbarkeit | Erlernbarkeit ohne Tech-Background |
| 4 | QS-4 | Verfügbarkeit | Ausfallzeit Bürobetrieb |
| 5 | QS-5 | Änderbarkeit | Neuen Standort ergänzen |

---

## Qualitätsszenarien

### QS-1: Keine Doppelbuchungen

| Attribut | Beschreibung |
|----------|-------------|
| **Environment** | Normalbetrieb, Bürozeiten, on-premise INNOQ-Infrastruktur, bis zu 50 gleichzeitige Nutzer |
| **Source** | Zwei INNOQ-Mitarbeiter an verschiedenen Geräten |
| **Event** | Beide senden innerhalb derselben Sekunde eine Buchungsanfrage für denselben Konferenzraum und denselben Zeitraum ab |
| **Artifact** | Booking Service – Buchungsendpunkt |
| **Response** | Die erste vollständig eingegangene Anfrage wird bestätigt; die zweite wird mit einer verständlichen Fehlermeldung abgelehnt („Raum ist nicht mehr verfügbar") |
| **Measure** | Doppelbuchungsrate ≤ 0,1 % aller gleichzeitigen Buchungsversuche; kein Konferenzraum ist für denselben Zeitraum doppelt vergeben |

**Begründung:** Doppelbuchungen sind zwar kein sicherheitskritisches Problem, aber ärgerlich und untergraben das Vertrauen in Calvin. Das System muss sein zentrales Versprechen – „der gebuchte Raum ist wirklich frei" – zuverlässig einhalten.

---

### QS-2: Schnelle Anzeige von Suchergebnissen

| Attribut | Beschreibung |
|----------|-------------|
| **Environment** | Bürozeiten, on-premise, bis zu 50 Mitarbeiter suchen gleichzeitig |
| **Source** | INNOQ-Mitarbeiter |
| **Event** | Mitarbeiter startet Suche nach verfügbaren Konferenzräumen an einem Standort für einen gewählten Zeitraum |
| **Artifact** | Booking Service – Suchanfrage / SPA – Ergebnisliste |
| **Response** | Die vollständige Ergebnisliste mit allen verfügbaren Konferenzräumen wird im Browser dargestellt |
| **Measure** | Antwortzeit ≤ 500 ms (vom Absenden der Anfrage bis zur vollständigen Darstellung) bei gleichzeitiger Last von 50 Nutzern |

**Begründung:** Die Suche ist der häufigste und zeitkritischste Schritt im Buchungsfluss. Lange Wartezeiten widersprechen der in der Produktvision versprochenen unkomplizierten, unbürokratischen Buchung.

---

### QS-3: Intuitive Bedienbarkeit ohne Tech-Background

| Attribut | Beschreibung |
|----------|-------------|
| **Environment** | Produktivsystem, Erstnutzung, kein technisches Vorwissen, keine Schulung erhalten |
| **Source** | Neuer INNOQ-Mitarbeiter aus Verwaltung oder Assistenz |
| **Event** | Mitarbeiter öffnet Calvin zum ersten Mal und möchte eigenständig einen Konferenzraum buchen |
| **Artifact** | Calvin SPA |
| **Response** | Mitarbeiter navigiert selbstständig durch die Oberfläche und schließt die Buchung erfolgreich ab |
| **Measure** | Buchung abgeschlossen in ≤ 5 Minuten und ≤ 20 Interaktionen; 90 % der neuen Mitarbeiter schaffen die erste Buchung ohne fremde Hilfe |

**Begründung:** Die Zielgruppe umfasst auch Mitarbeiter ohne Tech-Background. Calvin muss so selbsterklärend sein, dass keine Schulung nötig ist – sonst verfehlt es seinen Zweck als allgemeines INNOQ-Tool.

---

### QS-4: Kurze Wiederherstellungszeit bei Ausfall

| Attribut | Beschreibung |
|----------|-------------|
| **Environment** | Bürozeiten (8:00–18:00 Uhr, Werktage), on-premise; umständlicher manueller Fallback vorhanden |
| **Source** | Infrastruktur-Ereignis (z. B. Serverausfall, Deployment-Fehler) |
| **Event** | Calvin ist nicht erreichbar |
| **Artifact** | Calvin Gesamtsystem (SPA + Booking Service) |
| **Response** | Der Betrieb wird wiederhergestellt; während des Ausfalls steht der manuelle Fallback zur Verfügung |
| **Measure** | Verfügbarkeit ≥ 98 % während Bürozeiten; Wiederherstellung nach Ausfall innerhalb von 15 Minuten |

**Begründung:** Der vorhandene Fallback ist umständlich – längere Ausfälle stören den Büroalltag spürbar. 15 Minuten ist die Grenze, ab der die Beeinträchtigung für Mitarbeiter deutlich wahrnehmbar wird.

---

### QS-5: Neuen Standort mit überschaubarem Aufwand ergänzen

| Attribut | Beschreibung |
|----------|-------------|
| **Environment** | Geplante Änderung, Entwickler betreut Calvin als Nebenaufgabe neben anderen Projekten |
| **Source** | Entwickler im Calvin-Team |
| **Event** | INNOQ eröffnet einen neuen Bürostandort; Konferenzräume sollen in Calvin buchbar sein |
| **Artifact** | Booking Service + SPA (Standort- und Raumkonfiguration) |
| **Response** | Der neue Standort mit seinen Konferenzräumen ist vollständig in Calvin buchbar; bestehende Standorte und Buchungen sind nicht beeinträchtigt |
| **Measure** | Implementierung, Testing und Deployment innerhalb eines Release-Zyklus (≤ 2 Wochen), ohne Regression an bestehenden Funktionen |

**Begründung:** Standorterweiterungen sind seltene Ereignisse (alle paar Jahre), werden aber von Entwicklern betreut, die Calvin nur nebenbei pflegen. Das System muss so strukturiert sein, dass ein einzelner Entwickler die Änderung ohne tiefes Systemwissen sicher umsetzen kann.
