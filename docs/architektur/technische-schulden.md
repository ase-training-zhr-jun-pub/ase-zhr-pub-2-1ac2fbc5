# Technische Schulden Calvin

Dieses Dokument erfasst bewusst eingegangene technische Schulden des Calvin-Systems. Jeder Eintrag benennt Ursache, Auswirkung und die Maßnahme zur Tilgung.

---

## Übersicht

| ID | Beschreibung | Priorität | Tilgung |
|----|-------------|-----------|---------|
| TS-001 | Fehlende Authentifizierung (Okta) | Kritisch – vor Produktionsbetrieb | Okta OAuth2/OIDC via Spring Security |
| TS-002 | Resource Service als Mock-Daten in der SPA | Hoch – vor Produktionsbetrieb | Eigenständiger Resource Service |
| TS-003 | Dateibasierte Datenbank (H2) statt Produktionsdatenbank | Mittel – vor hohem Nutzungsvolumen | Migration auf PostgreSQL |

---

## TS-001: Fehlende Authentifizierung (Okta)

**Ursache:** Okta-Integration wurde für den Prototypen bewusst zurückgestellt, um keine Abhängigkeit zu einem externen System einzugehen und die Entwicklung zu beschleunigen. Stattdessen kommt Basic Auth ohne Passwort zum Einsatz (vgl. [ADR-003](adrs/ADR-003-basic-auth-ohne-passwort-statt-okta.md)).

**Auswirkung:** Es findet keine echte Identitätsprüfung statt. Jeder Nutzer kann Buchungen unter beliebigen Namen anlegen oder einsehen. Das System ist nicht für den Produktionsbetrieb geeignet.

**Maßnahme:** Integration von Okta als OIDC-Provider via Spring Security OAuth2 Resource Server (`spring-security-oauth2-resource-server`, `okta-spring-boot-starter`). Der Booking Service ist bereits darauf ausgelegt, die Nutzeridentität aus dem Request-Header zu lesen — der Wechsel beschränkt sich auf den Austausch des Authentifizierungsfilters.

**Priorität:** Kritisch — muss vor Produktionsbetrieb abgeschlossen sein.

---

## TS-002: Resource Service als Mock-Daten in der SPA

**Ursache:** Standorte, Konferenzräume und Ausstattungsmerkmale sind als statische Mock-Daten in der SPA hinterlegt (`frontend/src/lib/mock-data.ts`). Ein eigenständiger Resource Service wurde für den Prototypen nicht implementiert (vgl. [ADR-002](adrs/ADR-002-resource-service-als-mock-daten-in-spa.md)).

**Auswirkung:** Ressourcendaten können nicht ohne Code-Deployment geändert werden. Es gibt kein Admin-Interface zur Verwaltung von Standorten und Räumen. Bei Raumumbau oder Standorterweiterung ist ein vollständiges Frontend-Deployment nötig.

**Maßnahme:** Eigenständiger Resource Service mit REST-API und Admin-Interface. Die Mock-Daten werden in die Datenbank des Resource Service migriert. Der Booking Service bleibt ID-basiert und ist von dieser Änderung nicht betroffen.

**Priorität:** Hoch — muss vor Produktionsbetrieb abgeschlossen sein.

---

## TS-003: Dateibasierte Datenbank (H2) statt Produktionsdatenbank

**Ursache:** H2 im file-mode wurde für den Prototypen gewählt, weil kein separater Datenbankserver nötig ist und das Setup vereinfacht wird (vgl. [ADR-001](adrs/ADR-001-technologie-stack-fuer-booking-service.md)).

**Auswirkung:** H2 ist nicht für hohes Buchungsvolumen ausgelegt. Backup- und Recovery-Prozesse sind eingeschränkt. Das Ops-Team hat weniger Werkzeuge zur Datenbanküberwachung als bei einer vollwertigen Datenbank.

**Maßnahme:** Migration auf PostgreSQL. Spring Data JPA abstrahiert die Datenbankschicht — der Wechsel erfordert lediglich eine neue Datasource-Konfiguration und eine Anpassung der Flyway/Liquibase-Migrations. Keine Änderung an der Buchungslogik.

**Priorität:** Mittel — evaluieren, sobald das Nutzungsvolumen steigt oder der Produktionsbetrieb vorbereitet wird.
