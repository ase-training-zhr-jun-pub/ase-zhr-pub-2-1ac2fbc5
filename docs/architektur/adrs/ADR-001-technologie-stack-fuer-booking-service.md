# ADR-001: Technologie-Stack für den Calvin Booking Service

**Status:** Akzeptiert

---

## Kontext

Der Calvin Booking Service wird als eigenständiger Backend-Service implementiert (vgl. [ADR-001 arc42](../../arc42/adrs/ADR-001-frontend-prototyp-und-booking-service.md)). Er stellt eine REST-API bereit, auf die die Calvin SPA zugreift.

### Rahmenbedingungen (aus Interviews ermittelt)

| Dimension | Ergebnis |
|-----------|----------|
| **Teamsprachen** | Java und Kotlin |
| **Bevorzugte Sprache** | Java (intern empfohlen) |
| **Deployment** | Klassischer Prozess on-premise (kein Container-Orchestrator) |
| **Betrieb** | Separates Ops-Team |
| **Qualitätspriorität** | Schnelle Entwicklung vor robuster erster Iteration |
| **Datenbank** | Dateibasiert (SQLite oder H2, kein separater DB-Server) |
| **Authentifizierung** | Basic Auth ohne Passwort für Prototyp (→ [ADR-003](ADR-003-basic-auth-ohne-passwort-statt-okta.md)); Okta-Integration vor Produktionsbetrieb (→ [TS-001](../technische-schulden.md#ts-001-fehlende-authentifizierung-okta)) |

### Relevante Qualitätsanforderungen

| ID | Anforderung | Implikation |
|----|-------------|-------------|
| QS-1 | Doppelbuchungen ≤ 0,1 % | Transaktionen + Locking auf Datenbankebene zwingend |
| QS-2 | Suchantwort ≤ 500 ms bei 50 Nutzern | Kein Skalierungsproblem; Standard-Blocking-I/O ausreichend |
| QS-4 | Wiederherstellung ≤ 15 Min | Einfaches Deployment, wenig externe Abhängigkeiten |
| QS-5 | Neuer Standort in ≤ 2 Wochen | Bekannte Technologie; Ops-Team muss Prozess kennen |

---

## Betrachtete Alternativen

### Option A – Spring Boot (Kotlin)

Spring Boot ist das im INNOQ-Kontext bekannte Standard-Framework für JVM-basierte REST-Services. Kotlin reduziert Boilerplate gegenüber Java erheblich bei voller Interoperabilität.

| | |
|---|---|
| **H2 file-mode** | Per Dependency eingebunden, kein Setup; H2-Console erleichtert Debugging für Ops-Team |
| **Transaktionssicherheit** | JPA mit `@Transactional` + pessimistisches Locking (`SELECT FOR UPDATE`) — erprobtester Mechanismus gegen Doppelbuchungen (QS-1) |
| **Okta** | Spring Security OAuth2 Resource Server + Okta Spring Boot Starter: offiziell unterstützt, ausgereift |
| **Deployment** | Ausführbares JAR läuft direkt als klassischer Prozess; Actuator liefert Health-Endpoints für das Ops-Team |
| **Ops-Wissen** | Spring Boot ist das am weitesten verbreitete JVM-Framework; Ops-Team kennt wahrscheinlich den Umgang damit |
| **Nachteil** | Längere Startzeit (3–8 s) als Quarkus; bei manuellem Neustart nach Ausfall kein Problem, aber relevant bei häufigen Deployments |

---

### Option B – Quarkus (Java)

Quarkus ist ein modernes JVM-Framework mit Fokus auf schnellen Startzeiten und niedrigem Speicher-Footprint, optional mit native Compilation (GraalVM).

| | |
|---|---|
| **H2 / SQLite** | Hibernate ORM mit H2 oder SQLite möglich |
| **Transaktionssicherheit** | Hibernate-Transaktionen und Locking vorhanden — vergleichbar mit Spring JPA |
| **Okta** | Quarkus OIDC Extension unterstützt Okta; weniger Dokumentation als Spring Security |
| **Deployment** | Native Compilation ermöglicht sehr kurze Startzeiten (< 100 ms) — für klassischen Prozess ein Vorteil bei Neustarts |
| **Nachteil** | Im INNOQ-Team weniger bekannt als Spring Boot; Ops-Team muss Quarkus-spezifisches Wissen aufbauen. GraalVM-native Builds erhöhen Build-Komplexität deutlich |

---

### Option C – Node.js (TypeScript + Fastify + Prisma)

Node.js mit TypeScript ist das im Frontend bereits eingesetzte Ökosystem; Fastify ist ein performantes Web-Framework, Prisma ein typsicheres ORM.

| | |
|---|---|
| **SQLite** | Prisma unterstützt SQLite nativ |
| **Transaktionssicherheit** | Prisma-Transaktionen vorhanden, aber SQLite-Locking unter Last weniger erprobt als JPA; Risiko für QS-1 |
| **Okta** | `@okta/jwt-verifier` verfügbar, aber nicht so tief integriert wie Spring Security |
| **Deployment** | Node.js-Prozess läuft klassisch; kein JVM-Overhead |
| **Nachteil** | **Teamsprache ist Java/Kotlin** — Node.js ist für den Booking Service ein Technologiebruch. Das separate Ops-Team muss einen weiteren Runtime-Stack betreiben. Transaktionssicherheit (QS-1) schwerer abzusichern |

---

## Entscheidung

**Spring Boot mit Kotlin** wird als Technologie-Stack für den Calvin Booking Service gewählt.

### Begründung

**Schnelle Entwicklung durch Teamfit.** INNOQ-Entwickler kennen Java und Kotlin; Java ist intern empfohlen. Spring Boot ist das verbreitetste JVM-Framework im INNOQ-Umfeld — kein Einarbeiten in unbekannte Konzepte, kein Technologiebruch. Spring Initializr, Auto-Konfiguration und eine große Zahl fertiger Starter-Dependencies ermöglichen einen lauffähigen Service in wenigen Stunden. Node.js wäre für das Java/Kotlin-Team langsamer, weil die Runtime-Semantik und das Ökosystem neu erlernt werden müssten. FastAPI (Python) ist ähnlich schnell zu entwickeln, aber ebenfalls ein Technologiewechsel der das Team verlangsamt.

**Kotlin statt reinem Java beschleunigt die Entwicklung zusätzlich.** Data-Classes für Domain-Objekte (Konferenzraum, Buchung, Standort), Null-Safety und Extension Functions reduzieren Boilerplate deutlich gegenüber Java, ohne eine neue Runtime einzuführen.

**Transaktionssicherheit ohne Mehraufwand (QS-1).** JPA mit `@Transactional` und H2 ist in Spring Boot out of the box vorhanden — kein Konfigurationsaufwand. Doppelbuchungs-Prävention durch pessimistisches Locking ist eine Standardanwendung, für die fertige Beispiele und Dokumentation existieren.

**Das Ops-Team profitiert von Standardwerkzeugen.** Spring Boot Actuator (`/health`, `/metrics`) ist dem Ops-Team bekannt. Das ausführbare JAR läuft ohne Container-Infrastruktur als klassischer Prozess — exakt das geforderte Deployment-Modell. Die kurze Wiederherstellungszeit (QS-4, ≤ 15 Min) ist damit realistisch.

**Okta-Integration ist vorbereitet.** Spring Security OAuth2 Resource Server + Okta Spring Boot Starter ist die am besten dokumentierte und offiziell unterstützte Integrationsoption. Für den Prototypen wird stattdessen Basic Auth ohne Passwort eingesetzt (→ [ADR-003](ADR-003-basic-auth-ohne-passwort-statt-okta.md)); der Austausch des Authentifizierungsfilters bei der Okta-Einführung berührt die Buchungslogik nicht.

---

## Konsequenzen

**Positiv**
- Transaktionssicherheit für QS-1 ohne Eigenimplementierung (JPA `@Lock`)
- Bekanntes Ökosystem erleichtert Wartung durch wechselnde Entwickler (QS-5)
- Ops-Team kennt Spring Boot Actuator und JAR-Deployment
- Okta-Integration vorbereitet; Umstieg von Basic Auth erfordert nur Filter-Austausch (→ [TS-001](../technische-schulden.md#ts-001-fehlende-authentifizierung-okta))

**Negativ**
- Längere Startzeit (3–8 s) als Quarkus oder Node.js — bei klassischem Prozess-Deployment vertretbar
- JVM-Speicher-Footprint höher als Node.js — on-premise zu berücksichtigen

**Offen**
- H2 file-mode für Produktion evaluieren; bei steigender Nutzerzahl Migration auf PostgreSQL ohne Anwendungsänderung möglich (nur Datasource-Konfiguration)
- Kotlin-Kenntnisse im Team sicherstellen; Fallback auf Java jederzeit möglich
