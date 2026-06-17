// Zentrale Mock-Daten für den Calvin-Prototyp.
// Kein Backend — alle Daten hier gemockt. Begriffe folgen dem Glossar.

export type AusstattungsMerkmal =
  | "Beamer"
  | "Whiteboard"
  | "VC-Equipment"
  | "Display"
  | "Telefon"

export interface Standort {
  id: string
  name: string
  stadt: string
}

export interface Konferenzraum {
  id: string
  standortId: string
  name: string
  kapazitaet: number
  etage: string
  raumnummer: string
  ausstattung: AusstattungsMerkmal[]
  /** Belegte Zeitfenster je Datum (ISO) -> Liste von [start, ende] in "HH:MM" */
  belegung: Record<string, Array<{ start: string; ende: string; titel: string }>>
}

export interface Buchung {
  id: string
  raumId: string
  standortId: string
  datum: string // ISO yyyy-mm-dd
  start: string // HH:MM
  ende: string // HH:MM
  titel: string
  notiz?: string
  status: "anstehend" | "vergangen"
}

/**
 * Laufende Raumauswahl im Buchungsprozess: hält den gewählten Konferenzraum samt
 * Standort und Zeitraum fest, während der Mitarbeiter von der Suche über die
 * Bestätigung (CLVN-016) zur Eingabe der Buchungsdetails navigiert.
 * Bewusst ohne Meetingtitel/Buchungsnotiz – die gehören zu CLVN-017/CLVN-018.
 */
export interface BuchungsEntwurf {
  raumId: string
  standortId: string
  datum: string // ISO yyyy-mm-dd
  start: string // HH:MM
  ende: string // HH:MM
}

export interface KollegeImBuero {
  name: string
  initialen: string
  rolle: string
}

// --- Standorte: alle 8 INNOQ-Niederlassungen ---
export const STANDORTE: Standort[] = [
  { id: "monheim", name: "Monheim", stadt: "Monheim am Rhein" },
  { id: "berlin", name: "Berlin", stadt: "Berlin" },
  { id: "hamburg", name: "Hamburg", stadt: "Hamburg" },
  { id: "koeln", name: "Köln", stadt: "Köln" },
  { id: "muenchen", name: "München", stadt: "München" },
  { id: "zuerich", name: "Zürich", stadt: "Zürich" },
  { id: "baar", name: "Baar", stadt: "Baar" },
  { id: "offenbach", name: "Offenbach", stadt: "Offenbach am Main" },
]

export const HEUTE = "2026-06-17"
export const MORGEN = "2026-06-18"

// --- Konferenzräume (Schwerpunkt Köln, plus Beispiele an anderen Standorten) ---
export const RAEUME: Konferenzraum[] = [
  {
    id: "koeln-rhein",
    standortId: "koeln",
    name: "Rhein",
    kapazitaet: 8,
    etage: "2. OG",
    raumnummer: "2.14",
    ausstattung: ["Beamer", "VC-Equipment", "Whiteboard"],
    belegung: {
      [HEUTE]: [
        { start: "08:00", ende: "09:00", titel: "Daily" },
        { start: "11:00", ende: "12:00", titel: "1:1" },
        { start: "14:00", ende: "15:00", titel: "Review" },
      ],
    },
  },
  {
    id: "koeln-dom",
    standortId: "koeln",
    name: "Dom",
    kapazitaet: 6,
    etage: "1. OG",
    raumnummer: "1.05",
    ausstattung: ["Whiteboard", "Display"],
    belegung: {
      [HEUTE]: [{ start: "13:00", ende: "14:30", titel: "Workshop" }],
    },
  },
  {
    id: "koeln-ahr",
    standortId: "koeln",
    name: "Ahr",
    kapazitaet: 12,
    etage: "EG",
    raumnummer: "0.02",
    ausstattung: ["Beamer", "VC-Equipment", "Whiteboard", "Display"],
    belegung: {
      [HEUTE]: [{ start: "09:00", ende: "17:00", titel: "Kundenworkshop" }],
    },
  },
  {
    id: "koeln-eifel",
    standortId: "koeln",
    name: "Eifel",
    kapazitaet: 4,
    etage: "2. OG",
    raumnummer: "2.20",
    ausstattung: ["Display", "Telefon"],
    belegung: { [HEUTE]: [] },
  },
  {
    id: "koeln-box-1",
    standortId: "koeln",
    name: "Telefonbox 1",
    kapazitaet: 1,
    etage: "1. OG",
    raumnummer: "1.11",
    ausstattung: ["Telefon", "VC-Equipment"],
    belegung: {
      [HEUTE]: [{ start: "10:00", ende: "10:30", titel: "Remote-Call" }],
    },
  },
  // andere Standorte (für Standort-Wechsel)
  {
    id: "berlin-spree",
    standortId: "berlin",
    name: "Spree",
    kapazitaet: 10,
    etage: "3. OG",
    raumnummer: "3.01",
    ausstattung: ["Beamer", "VC-Equipment", "Whiteboard"],
    belegung: { [HEUTE]: [{ start: "10:00", ende: "11:00", titel: "Sync" }] },
  },
  {
    id: "berlin-panke",
    standortId: "berlin",
    name: "Panke",
    kapazitaet: 5,
    etage: "3. OG",
    raumnummer: "3.04",
    ausstattung: ["Whiteboard", "Display"],
    belegung: { [HEUTE]: [] },
  },
  {
    id: "hamburg-alster",
    standortId: "hamburg",
    name: "Alster",
    kapazitaet: 8,
    etage: "4. OG",
    raumnummer: "4.10",
    ausstattung: ["Beamer", "VC-Equipment"],
    belegung: { [HEUTE]: [] },
  },
  {
    id: "muenchen-isar",
    standortId: "muenchen",
    name: "Isar",
    kapazitaet: 14,
    etage: "EG",
    raumnummer: "0.07",
    ausstattung: ["Beamer", "VC-Equipment", "Whiteboard", "Display"],
    belegung: { [HEUTE]: [{ start: "09:00", ende: "10:00", titel: "Standup" }] },
  },
]

// --- Meine Buchungen (Persona Alex Berger) ---
export const MEINE_BUCHUNGEN: Buchung[] = [
  {
    id: "b-1001",
    raumId: "koeln-rhein",
    standortId: "koeln",
    datum: HEUTE,
    start: "09:00",
    ende: "10:00",
    titel: "Team-Sync",
    notiz: "Projektstatus & nächste Schritte",
    status: "anstehend",
  },
  {
    id: "b-1002",
    raumId: "koeln-dom",
    standortId: "koeln",
    datum: "2026-06-25",
    start: "14:00",
    ende: "15:30",
    titel: "Kundenworkshop",
    notiz: "Externe Teilnehmer, VC vorbereiten",
    status: "anstehend",
  },
  {
    id: "b-0999",
    raumId: "koeln-eifel",
    standortId: "koeln",
    datum: "2026-06-04",
    start: "11:00",
    ende: "12:00",
    titel: "1:1 mit Lead",
    status: "vergangen",
  },
]

// --- "Wer ist im Büro?" je Standort & Datum ---
export const KOLLEGEN_IM_BUERO: Record<string, KollegeImBuero[]> = {
  koeln: [
    { name: "Mara Klein", initialen: "MK", rolle: "Consultant" },
    { name: "Jonas Weber", initialen: "JW", rolle: "Senior Consultant" },
    { name: "Lea Hoffmann", initialen: "LH", rolle: "Designerin" },
    { name: "Tim Bauer", initialen: "TB", rolle: "Developer" },
  ],
  berlin: [
    { name: "Sophie Richter", initialen: "SR", rolle: "Architektin" },
    { name: "Paul Schäfer", initialen: "PS", rolle: "Consultant" },
  ],
  hamburg: [{ name: "Nora Lang", initialen: "NL", rolle: "Consultant" }],
  muenchen: [
    { name: "Ben Fischer", initialen: "BF", rolle: "Developer" },
    { name: "Emma Wolf", initialen: "EW", rolle: "Consultant" },
  ],
}

// Aktueller Nutzer (Persona)
export const AKTUELLER_NUTZER = {
  name: "Alex Berger",
  initialen: "AB",
  rolle: "Senior Consultant",
  heimatStandortId: "koeln",
}

export const ALLE_AUSSTATTUNG: AusstattungsMerkmal[] = [
  "Beamer",
  "Whiteboard",
  "VC-Equipment",
  "Display",
  "Telefon",
]

// --- Hilfsfunktionen ---

export function getStandort(id: string): Standort | undefined {
  return STANDORTE.find((s) => s.id === id)
}

export function getRaum(id: string): Konferenzraum | undefined {
  return RAEUME.find((r) => r.id === id)
}

export function getRaeumeByStandort(standortId: string): Konferenzraum[] {
  return RAEUME.filter((r) => r.standortId === standortId)
}

/** Minuten seit Mitternacht aus "HH:MM" */
function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

/** Prüft, ob ein Raum im gewünschten Zeitfenster verfügbar ist (CLVN-010/011). */
export function istVerfuegbar(
  raum: Konferenzraum,
  datum: string,
  start: string,
  ende: string,
): boolean {
  const slots = raum.belegung[datum] ?? []
  const s = toMin(start)
  const e = toMin(ende)
  return !slots.some((b) => s < toMin(b.ende) && e > toMin(b.start))
}

/** Stundenraster 8–18 Uhr mit Belegt-Markierung für die Timeline. */
export function getStundenRaster(
  raum: Konferenzraum,
  datum: string,
): Array<{ stunde: number; belegt: boolean; titel?: string }> {
  const slots = raum.belegung[datum] ?? []
  const raster = []
  for (let h = 8; h < 18; h++) {
    const slotStart = h * 60
    const slotEnde = (h + 1) * 60
    const treffer = slots.find(
      (b) => slotStart < toMin(b.ende) && slotEnde > toMin(b.start),
    )
    raster.push({ stunde: h, belegt: !!treffer, titel: treffer?.titel })
  }
  return raster
}

/**
 * Smart-Raumempfehlung "Best Match" (Extra-Feature):
 * bewertet Räume nach Verfügbarkeit, passender Kapazität und Ausstattungs-Treffer.
 */
export function getBestMatch(
  standortId: string,
  datum: string,
  start: string,
  ende: string,
  teilnehmer: number,
  gewuenschteAusstattung: AusstattungsMerkmal[],
): Konferenzraum | undefined {
  const kandidaten = getRaeumeByStandort(standortId)
    .filter((r) => istVerfuegbar(r, datum, start, ende))
    .filter((r) => r.kapazitaet >= teilnehmer)
    .filter((r) =>
      gewuenschteAusstattung.every((a) => r.ausstattung.includes(a)),
    )
  if (kandidaten.length === 0) return undefined
  // bestes Match = kleinste passende Kapazität (wenig Verschnitt)
  return kandidaten.sort((a, b) => a.kapazitaet - b.kapazitaet)[0]
}
