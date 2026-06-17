# ADR-003: Basic Auth ohne Passwort statt Okta für den Prototypen

**Status:** Akzeptiert

---

## Kontext

Calvin benötigt eine Nutzeridentität, damit Buchungen einem bestimmten Mitarbeiter zugeordnet werden können. In der Zielvision wird Okta als OIDC-Provider für INNOQ eingesetzt.

Für den Prototypen stellt Okta eine externe Abhängigkeit dar, die den Entwicklungs- und Testaufwand erheblich erhöht: Okta-Tenants müssen konfiguriert werden, Test-Nutzer angelegt und Token-Flows implementiert sein.

## Entscheidung

Für den Prototypen wird **Basic Auth ohne Passwort** eingesetzt: Der Client übermittelt im `Authorization`-Header lediglich einen Nutzernamen (Base64-kodiert, ohne Passwort). Der Booking Service liest den Nutzernamen aus dem Header und verwendet ihn zur Zuordnung von Buchungen.

Es findet **keine Passwortprüfung und keine Token-Validierung** statt.

Die Okta-Integration wird **vor dem Produktionsbetrieb nachgeliefert** (vgl. [Technische Schulden TS-001](../technische-schulden.md#ts-001-fehlende-authentifizierung-okta)).

## Begründung

- **Schnelle Entwicklung:** Keine Abhängigkeit zu einem Drittsystem (Okta-Tenant, OAuth2-Flow) im Prototyp-Stadium.
- **Flexible Testbarkeit:** Durch einfaches Ändern des Nutzernamens im Header kann das Team mit verschiedenen Nutzeridentitäten testen, ohne Accounts anlegen oder verwalten zu müssen.
- **Saubere Vorbereitung für Okta:** Der Booking Service ist von Anfang an so aufgebaut, dass die Nutzeridentität aus dem Request-Header kommt. Beim Umstieg auf Okta wird lediglich der Filter ausgetauscht, der den Header befüllt — die Buchungslogik bleibt unverändert.
- **Kein Sicherheitsrisiko im Prototyp:** Das System ist nicht öffentlich erreichbar und wird nur intern zu Testzwecken betrieben.

## Konsequenzen

**Positiv**
- Kein Okta-Tenant nötig; sofort lauffähig
- Einfache Simulation verschiedener Nutzer beim Testen

**Negativ / Technische Schulden**
- Keine echte Authentifizierung: jeder kann unter jedem Namen buchen
- Nicht für den Produktionsbetrieb geeignet

Siehe [Technische Schulden TS-001](../technische-schulden.md#ts-001-fehlende-authentifizierung-okta).
