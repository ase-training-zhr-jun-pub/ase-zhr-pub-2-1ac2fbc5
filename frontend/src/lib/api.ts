const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080"
const NUTZER_ID = "alex-berger"

function authHeader(): HeadersInit {
  return { Authorization: `Basic ${btoa(`${NUTZER_ID}:`)}` }
}

export interface BuchungDto {
  id: string
  nutzerId: string
  raumId: string
  standortId: string
  datum: string
  start: string
  ende: string
  titel: string
  notiz?: string
  status: "anstehend" | "vergangen"
}

export interface NeueBuchungDto {
  raumId: string
  standortId: string
  datum: string
  start: string
  ende: string
  titel: string
  notiz?: string
}

export class DoppelbuchungError extends Error {
  constructor() {
    super("Der Konferenzraum ist für diesen Zeitraum bereits belegt.")
  }
}

export async function getMeineBuchungen(): Promise<BuchungDto[]> {
  const res = await fetch(`${API_BASE}/api/buchungen`, { headers: authHeader() })
  if (!res.ok) throw new Error("Fehler beim Laden der Buchungen")
  return res.json()
}

export async function erstelleBuchung(dto: NeueBuchungDto): Promise<BuchungDto> {
  const res = await fetch(`${API_BASE}/api/buchungen`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (res.status === 409) throw new DoppelbuchungError()
  if (!res.ok) throw new Error("Fehler beim Erstellen der Buchung")
  return res.json()
}

export async function aendereBuchung(id: string, dto: NeueBuchungDto): Promise<BuchungDto> {
  const res = await fetch(`${API_BASE}/api/buchungen/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (res.status === 409) throw new DoppelbuchungError()
  if (!res.ok) throw new Error("Fehler beim Ändern der Buchung")
  return res.json()
}

export async function storniereBuchungApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/buchungen/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  })
  if (!res.ok) throw new Error("Fehler beim Stornieren der Buchung")
}

export async function pruefeVerfuegbarkeit(
  raumId: string,
  datum: string,
  start: string,
  ende: string,
): Promise<boolean> {
  try {
    const params = new URLSearchParams({ raumId, datum, start, ende })
    const res = await fetch(`${API_BASE}/api/verfuegbarkeit?${params}`)
    if (!res.ok) return true // im Fehlerfall optimistisch verfügbar anzeigen
    const data: { verfuegbar: boolean } = await res.json()
    return data.verfuegbar
  } catch {
    return true
  }
}
