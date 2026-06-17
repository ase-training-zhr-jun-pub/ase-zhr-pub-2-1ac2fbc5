# CLAUDE.md – Calvin Booking Service (Backend)

Dieses Dokument gilt für die Arbeit im Verzeichnis `backend/`. Es beschreibt den
**Calvin Booking Service**: den REST-Backend-Service, der Buchungslogik,
Konfliktprüfung und Persistenz bereitstellt (vgl. arc42-Bausteinsicht).

> **Wording:** Halte dich an die fachlichen Begriffe aus dem
> [Glossar](../docs/produkt/glossar.md) (Ubiquitous Language).

## Domänen- & Architekturdokumentation

Nutze die Dokumentation **immer**, wenn dir Fachlichkeit oder eine
Architekturentscheidung unklar ist. Nicht raten – nachlesen.

| Thema | Datei |
|-------|-------|
| Architekturüberblick (arc42) | [`../docs/arc42/arc42.md`](../docs/arc42/arc42.md) |
| Architekturentscheidungen (ADRs) | [`../docs/architektur/adrs/`](../docs/architektur/adrs/) |
| → Tech-Stack-Entscheidung | [`ADR-001`](../docs/architektur/adrs/ADR-001-technologie-stack-fuer-booking-service.md) |
| → Auth (Basic Auth ohne Passwort) | [`ADR-003`](../docs/architektur/adrs/ADR-003-basic-auth-ohne-passwort-statt-okta.md) |
| Qualitätsanforderungen | [`../docs/architektur/qualitätsanforderungen.md`](../docs/architektur/qualitätsanforderungen.md) |
| Technische Schulden | [`../docs/architektur/technische-schulden.md`](../docs/architektur/technische-schulden.md) |
| Produkt/Domäne (Epics, Stories, Backlog) | [`../docs/produkt/`](../docs/produkt/) |
| Glossar (Ubiquitous Language) | [`../docs/produkt/glossar.md`](../docs/produkt/glossar.md) |

## Backend-Technologie

- **Sprache:** Kotlin 2.3.21 (JVM, Java-21-Toolchain)
- **Framework:** Spring Boot 4.1.0 (Spring MVC / `spring-boot-starter-webmvc`, Blocking I/O)
- **Build-Tool:** Gradle (Kotlin DSL), Wrapper-Version 9.5.1
- **JSON:** Jackson (`jackson-module-kotlin`)
- **Test:** JUnit 5 (`spring-boot-starter-webmvc-test`, `kotlin-test-junit5`)
- **Persistenz (geplant):** dateibasiert (SQLite/H2), mit Transaktionen + Locking
  gegen Doppelbuchungen – noch nicht implementiert (siehe ADR-001, QS-1)
- **JDK:** wird **nicht** automatisch bereitgestellt → siehe Bash-Commands

Begründung des Stacks: [ADR-001](../docs/architektur/adrs/ADR-001-technologie-stack-fuer-booking-service.md).

## Ordner-Struktur

```text
backend/
├── build.gradle.kts            # Build-Konfiguration & Dependencies
├── settings.gradle.kts         # rootProject.name = "booking-service"
├── gradlew / gradlew.bat       # Gradle Wrapper (immer hierüber bauen)
├── gradle/wrapper/             # Wrapper-Jar + Properties (Gradle-Version)
└── src/
    ├── main/
    │   ├── kotlin/io/innoq/calvin/   # Anwendungscode (package io.innoq.calvin)
    │   └── resources/
    │       └── application.properties
    └── test/
        └── kotlin/io/innoq/calvin/   # Tests (spiegelt main-Paketstruktur)
```

Nicht eingecheckt (per `.gitignore`): `build/`, `.gradle/`, IDE-Dateien.

## Backend-Architektur

**Aktueller Stand:** Minimal-Setup mit einem flachen Paket `io.innoq.calvin`
(nur `HelloController` + Application-Klasse). Eine geschichtete Struktur ist
**noch nicht** etabliert; es gibt bewusst noch keinen ADR, der einen
Architekturstil festschreibt.

**Konvention beim Ausbau (empfohlen, klassische Spring-Boot-Schichtung – Layered):**

```text
io.innoq.calvin
├── api/         # REST-Controller + DTOs (Request/Response)
├── domain/      # Domänenmodell + Geschäftslogik (Buchung, Konfliktprüfung)
├── service/     # Anwendungsfälle / Orchestrierung
└── persistence/ # Repositories, DB-Zugriff
```

Leitplanken: Controller dünn halten, Geschäftslogik nicht in Controllern; die
fachlichen Begriffe aus dem [Glossar](../docs/produkt/glossar.md) als Klassen-
und Methodennamen verwenden. Die API wird als **OpenAPI-Dokument im Backend**
gepflegt (vgl. arc42 §Schnittstelle) – aktuell noch nicht vorhanden.

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `src/main/kotlin/io/innoq/calvin/BookingServiceApplication.kt` | Spring-Boot-Einstiegspunkt (`main`) |
| `src/main/kotlin/io/innoq/calvin/HelloController.kt` | Beispiel-Endpoint `GET /api/hello` |
| `src/main/resources/application.properties` | Laufzeit-Konfiguration (`spring.application.name=booking-service`) |
| `build.gradle.kts` | Dependencies, Plugins, Java-Toolchain |
| `src/test/kotlin/io/innoq/calvin/BookingServiceApplicationTests.kt` | Context-Load-Smoke-Test |
| `../scripts/install-sdk.sh` | Installiert das benötigte JDK (Java 21) via SDKMAN |
| `../scripts/install-ktlint.sh` | Installiert die ktlint-CLI (Kotlin-Formatter) |
| `../.claude/settings.json` | Enthält u. a. den ktlint-Format-Hook (siehe unten) |

## Wichtige Bash-Commands

Alle Gradle-Befehle **immer über den Wrapper** (`./gradlew`) ausführen.

```bash
# JDK bereitstellen (einmalig – java ist im Container NICHT vorinstalliert):
../scripts/install-sdk.sh
source "$HOME/.sdkman/bin/sdkman-init.sh"   # java im aktuellen Terminal verfügbar machen

# ktlint bereitstellen (einmalig – wird vom Format-Hook benötigt, braucht java):
../scripts/install-ktlint.sh

# Kotlin manuell formatieren / prüfen:
ktlint -F 'src/**/*.kt'   # formatiert in-place (-F); ohne -F nur Lint-Check

# App starten (Standardport 8080):
./gradlew bootRun

# Tests ausführen:
./gradlew test

# Vollständiger Build inkl. Tests:
./gradlew build

# Ausführbares Fat-Jar bauen (-> build/libs/):
./gradlew bootJar

# Endpoint manuell prüfen:
curl -s http://localhost:8080/api/hello   # -> "Hello World!"

# Gradle-Daemon stoppen:
./gradlew --stop
```

Falls `./gradlew` mit *„JAVA_HOME is not set"* abbricht: JDK fehlt → obiges
Install-Skript laufen lassen bzw. `JAVA_HOME` setzen.

## Code-Formatierung (ktlint-Hook)

Der Kotlin-Code wird mit **ktlint** formatiert. Ein **PostToolUse-Hook** in
[`../.claude/settings.json`](../.claude/settings.json) formatiert jede `.kt`-Datei
unterhalb von `backend/` nach jedem **Write/Edit** automatisch (`ktlint -F`).

- **Reichweite:** nur `*.kt` unter `backend/` – Frontend/Docs bleiben unberührt.
- **Nicht blockierend:** Schlägt ktlint fehl oder fehlt es, läuft der Edit normal
  weiter (der Hook endet mit `|| true`). Das heißt aber auch: **fehlt ktlint,
  wird stillschweigend nicht formatiert** → einmalig `../scripts/install-ktlint.sh`
  ausführen.
- **Voraussetzung:** installiertes JDK (ktlint ist eine JVM-App) + `ktlint` im PATH.
- **Konsequenz beim Editieren:** Nach einem `Write`/`Edit` kann die Datei vom Hook
  verändert worden sein (z. B. Einzug, Leerzeilen). Vor einem darauf folgenden
  `Edit` ggf. neu einlesen, damit `old_string` noch passt.
- **Stil anpassen:** ktlint liest `.editorconfig`. Aktuell ist keine vorhanden →
  es gelten die ktlint-Defaults (4-Space-Einzug, eine Leerzeile max., keine
  Wildcard-Imports …).

## Run Configurations

- **Standardport:** 8080 (`server.port`, Default von Spring Boot).
- **In dieser Trainings-/Proxy-Umgebung ist 8080 häufig belegt** (Crucible/code-server
  antwortet dort mit `404 Not found.`). Dann startet die App mit
  *„Port 8080 was already in use"*. Abhilfe – auf anderem Port starten:

  ```bash
  ./gradlew bootRun --args='--server.port=8081'
  ```

- **Zugriff hinter dem Proxy:** Der Server lauscht auf `localhost`, im Browser
  wird er aber über den Proxy-Pfad aus `VSCODE_PROXY_URI` erreicht:
  `https://crucible.ch.innoq.io/t/<token>/s/<session>/proxy/<port>/api/hello`.
  Die nackte Proxy-Wurzel `/` liefert eine **Whitelabel Error Page (404)** – das
  ist erwartet, da nur `/api/hello` gemappt ist, **kein** Fehler.
- **IDE:** `BookingServiceApplication.main()` direkt ausführen (VS Code Spring/Kotlin-Extensions sind im Devcontainer vorhanden).

## Code Smells / Worauf zu achten ist

- **Roher `String` als Response** statt typisierter DTOs – beim Ausbau echte
  Request/Response-Objekte (Jackson) verwenden.
- **Geschäftslogik im Controller** vermeiden – siehe Schichtung oben.
- **Kein Endpoint-Test:** bisher nur `contextLoads()`. Neue Endpoints mit
  `@WebMvcTest` / MockMvc absichern.
- **Keine Persistenz / kein Locking** – sobald Buchungen gespeichert werden, ist
  Transaktions-/Sperrlogik gegen Doppelbuchungen Pflicht (QS-1, ADR-001).
- **Auth ist Prototyp-Stand:** Basic Auth ohne Passwort (ADR-003) – keine echte
  Sicherheit, vor Produktion ersetzen (siehe technische Schulden).
- **Englische vs. fachliche Namen:** Domänennamen aus dem
  [Glossar](../docs/produkt/glossar.md) übernehmen, nicht frei erfinden.
- **Build-Artefakte committen:** `build/` und `.gradle/` gehören **nicht** ins
  Repo (sind in `.gitignore`).

## Sonstiges

- **Commits:** Conventional Commits einhalten (z. B. `feat(backend): …`).
- Bekannte Einschränkungen/Schulden sind zentral in
  [`technische-schulden.md`](../docs/architektur/technische-schulden.md) gepflegt –
  bei neuen Workarounds dort ergänzen.
