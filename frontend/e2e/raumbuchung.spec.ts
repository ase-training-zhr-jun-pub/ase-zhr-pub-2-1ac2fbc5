import { test, expect } from "@playwright/test"

// ---------------------------------------------------------------------------
// Testdaten
// ---------------------------------------------------------------------------

const INITIAL_BUCHUNGEN = [
  {
    id: "b-1001",
    nutzerId: "alex-berger",
    raumId: "koeln-rhein",
    standortId: "koeln",
    datum: "2026-06-17",
    start: "09:00",
    ende: "10:00",
    titel: "Team-Sync",
    notiz: "Projektstatus & nächste Schritte",
    status: "anstehend",
  },
  {
    id: "b-1002",
    nutzerId: "alex-berger",
    raumId: "koeln-dom",
    standortId: "koeln",
    datum: "2026-06-25",
    start: "14:00",
    ende: "15:30",
    titel: "Kundenworkshop",
    notiz: "Externe Teilnehmer, VC vorbereiten",
    status: "anstehend",
  },
]

const NEW_BUCHUNG = {
  id: "b-e2e-001",
  nutzerId: "alex-berger",
  raumId: "berlin-panke",
  standortId: "berlin",
  datum: "2026-06-20",
  start: "09:00",
  ende: "10:00",
  titel: "E2E Test Meeting",
  status: "anstehend",
}

// Datum ohne Belegungseinträge in den Mock-Daten → beide Berlin-Räume verfügbar
const TEST_DATUM = "2026-06-20"

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

test("vollständiger Raumbuchungsprozess", async ({ page }) => {
  // Nach dem POST auf true gesetzt; GETs liefern erst dann die neue Buchung mit
  let buchungErstellt = false

  // --- API-Mocks -----------------------------------------------------------
  // Regex-Patterns fangen sowohl http://localhost:8080/api/... als auch
  // relative Pfade /api/... ab, unabhängig vom genauen Port.

  // GET /api/buchungen  →  erst 2, nach der Buchung 3 Einträge
  // POST /api/buchungen →  gibt die neue Buchung zurück
  // Hinweis: React StrictMode ruft useEffect in Entwicklung doppelt auf, daher
  // nicht einen Aufruf-Zähler nutzen, sondern das Flag nach dem POST setzen.
  await page.route(/\/api\/buchungen$/, async (route) => {
    const method = route.request().method()
    if (method === "GET") {
      const buchungen = buchungErstellt
        ? [...INITIAL_BUCHUNGEN, NEW_BUCHUNG]
        : INITIAL_BUCHUNGEN
      await route.fulfill({ json: buchungen })
    } else if (method === "POST") {
      buchungErstellt = true
      await route.fulfill({ status: 201, json: NEW_BUCHUNG })
    } else {
      await route.continue()
    }
  })

  // GET /api/verfuegbarkeit → Raum immer verfügbar (kein Backend nötig)
  await page.route(/\/api\/verfuegbarkeit/, async (route) => {
    await route.fulfill({ json: { verfuegbar: true } })
  })

  // GET /api/hello (BackendStatus-Chip im Header)
  await page.route(/\/api\/hello/, async (route) => {
    await route.fulfill({ body: "Backend OK", contentType: "text/plain" })
  })

  // =========================================================================
  // Schritt 1: Buchungsübersicht öffnen
  // =========================================================================
  await page.goto("/buchungen")
  await expect(page.getByRole("heading", { name: "Meine Buchungen" })).toBeVisible()

  // =========================================================================
  // Schritt 2: Bisherige Buchungen merken
  // =========================================================================
  // Tab "Anstehend" zeigt die Anzahl in Klammern
  await expect(page.getByText("Anstehend (2)")).toBeVisible()

  // =========================================================================
  // Schritt 3: Räume-Seite öffnen (Standort-Seite)
  // =========================================================================
  await page.getByRole("link", { name: "Räume" }).click()
  await expect(page.getByRole("heading", { name: "Räume finden" })).toBeVisible()

  // =========================================================================
  // Schritt 4: Standort auswählen (Berlin)
  // =========================================================================
  // SelectTrigger hat aria-label="Standort wählen"
  await page.getByLabel("Standort wählen").click()
  // SelectItems rendern mit role="option"
  await page.getByRole("option", { name: "Berlin" }).click()
  await expect(page.getByText("Standort Berlin")).toBeVisible()

  // =========================================================================
  // Schritt 5: Datum auswählen
  // =========================================================================
  await page.locator("#datum").fill(TEST_DATUM)

  // =========================================================================
  // Schritt 6: Raum auswählen (öffnet Raumdetail-Seite)
  // =========================================================================
  // Ersten verfügbaren Berlin-Raum ("Details & Buchen") klicken
  await page.getByRole("button", { name: "Details & Buchen" }).first().click()
  await page.waitForURL(/\/raeume\/berlin-/)

  // Datum auf der Detailseite setzen (Default ist HEUTE; wir wählen TEST_DATUM)
  await page.locator("#d-datum").fill(TEST_DATUM)

  // Auf Verfügbarkeitscheck warten (300 ms Debounce + gemockter API-Call)
  await expect(
    page.getByText("Verfügbar für diesen Zeitraum"),
  ).toBeVisible({ timeout: 5_000 })

  // =========================================================================
  // Schritt 7: Buchen – Raum auswählen → Raumauswahl bestätigen
  // =========================================================================
  await page.getByRole("button", { name: "Raum auswählen" }).click()
  await page.waitForURL("**/buchung/bestaetigen")
  await expect(
    page.getByRole("heading", { name: "Raumauswahl bestätigen" }),
  ).toBeVisible()

  // Auswahl bestätigen → Buchungsdetails
  await page.getByRole("button", { name: "Auswahl bestätigen" }).click()
  await page.waitForURL("**/buchung/details")
  await expect(
    page.getByRole("heading", { name: "Buchungsdetails" }),
  ).toBeVisible()

  // Meetingtitel eingeben
  await page.locator("#meetingtitel").fill("E2E Test Meeting")

  // Buchung absenden → Bestätigungsseite
  await page.getByRole("button", { name: "Buchung absenden" }).click()
  await page.waitForURL("**/buchung/bestaetigung")

  // =========================================================================
  // Schritt 8: Bestätigung prüfen
  // =========================================================================
  await expect(page.getByText("Buchung bestätigt")).toBeVisible()
  await expect(page.getByText("E2E Test Meeting")).toBeVisible()

  // =========================================================================
  // Schritt 9: Buchungsübersicht öffnen
  // =========================================================================
  await page.getByRole("button", { name: "Zu meinen Buchungen" }).click()
  await page.waitForURL("**/buchungen")

  // =========================================================================
  // Schritt 10: Neue Buchung verifizieren
  // =========================================================================
  // Anstehend-Tab zeigt jetzt 3 Buchungen
  await expect(page.getByText("Anstehend (3)")).toBeVisible()
  // Neue Buchung in der Liste
  await expect(page.getByText("E2E Test Meeting")).toBeVisible()
})
