# ADR-002: Resource Service als Mock-Daten in der SPA

**Status:** Akzeptiert

---

## Kontext

Calvin benötigt Stammdaten zu Standorten, Konferenzräumen und Ausstattungen, damit der Booking Service Buchungen entgegennehmen kann. Diese Daten könnten in einem eigenständigen Resource Service verwaltet werden oder als statische Daten in der SPA hinterlegt sein.

Der Booking Service benötigt keine eigene Kenntnis der Ressourcen — er speichert und verwaltet Buchungen anhand der IDs, die die SPA übergibt.

## Entscheidung

Für den Prototypen wird **kein eigenständiger Resource Service** implementiert. Standorte, Konferenzräume und Ausstattungsmerkmale werden als **statische Mock-Daten in der SPA** hinterlegt (`frontend/src/lib/mock-data.ts`).

Der Booking Service arbeitet ausschließlich mit den **IDs** aus diesen Mock-Daten. Er hat kein eigenes Wissen über Namen, Kapazitäten oder Ausstattungen der Ressourcen.

## Begründung

- **Schnelle Entwicklung:** Kein weiterer Service muss implementiert und betrieben werden. Ressourcendaten können direkt im Frontend-Code gepflegt werden.
- **Keine Dateninkonsistenz im Prototyp:** Da Mock-Daten und SPA gemeinsam deployt werden, gibt es keine Synchronisationsprobleme zwischen Resource Service und SPA.
- **Ausreichend für Prototyp-Zweck:** Im Prototyp ändern sich Standorte und Räume nicht. Ein Admin-Interface zur Ressourcenverwaltung ist kein Ziel des aktuellen Iterationsschritts.
- **Saubere Schnittstelle zum Booking Service:** Der Booking Service ist von Anfang an ID-basiert designed — das erleichtert die spätere Integration eines echten Resource Service, ohne die Buchungslogik zu ändern.

## Konsequenzen

**Positiv**
- Kein zusätzlicher Service im Betrieb
- Keine Netzwerkkommunikation für Ressourcendaten → schnellere Ladezeiten in der SPA
- Einfaches Hinzufügen von Testdaten direkt im Code

**Negativ / Technische Schulden**
- Standorte und Räume können nicht ohne Code-Deployment geändert werden
- Kein Admin-Interface für Ressourcenverwaltung
- Mock-Daten müssen beim späteren Resource Service migriert werden

Siehe [Technische Schulden TS-002](../technische-schulden.md#ts-002-resource-service-als-mock-daten-in-der-spa).
