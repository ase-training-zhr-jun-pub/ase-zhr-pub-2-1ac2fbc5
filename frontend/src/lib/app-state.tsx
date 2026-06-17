/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  AKTUELLER_NUTZER,
  MEINE_BUCHUNGEN,
  type Buchung,
  type BuchungsEntwurf,
} from "@/lib/mock-data"

interface AppState {
  standortId: string
  setStandortId: (id: string) => void
  favoriten: Set<string>
  toggleFavorit: (raumId: string) => void
  istFavorit: (raumId: string) => boolean
  buchungen: Buchung[]
  addBuchung: (b: Omit<Buchung, "id" | "status">) => Buchung
  storniereBuchung: (id: string) => void
  /** Laufende Raumauswahl im Buchungsprozess (CLVN-016); null = kein Entwurf. */
  buchungsEntwurf: BuchungsEntwurf | null
  /** Entwurf starten/aktualisieren oder mit null verwerfen. */
  setBuchungsEntwurf: (entwurf: BuchungsEntwurf | null) => void
}

const AppStateContext = createContext<AppState | null>(null)

let buchungsZaehler = 2000

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [standortId, setStandortId] = useState(AKTUELLER_NUTZER.heimatStandortId)
  const [favoriten, setFavoriten] = useState<Set<string>>(
    () => new Set(["koeln-rhein"]),
  )
  const [buchungen, setBuchungen] = useState<Buchung[]>(MEINE_BUCHUNGEN)
  const [buchungsEntwurf, setBuchungsEntwurf] = useState<BuchungsEntwurf | null>(null)

  const value = useMemo<AppState>(
    () => ({
      standortId,
      setStandortId,
      favoriten,
      toggleFavorit: (raumId) =>
        setFavoriten((prev) => {
          const next = new Set(prev)
          if (next.has(raumId)) next.delete(raumId)
          else next.add(raumId)
          return next
        }),
      istFavorit: (raumId) => favoriten.has(raumId),
      buchungen,
      addBuchung: (b) => {
        const neu: Buchung = { ...b, id: `b-${buchungsZaehler++}`, status: "anstehend" }
        setBuchungen((prev) => [neu, ...prev])
        return neu
      },
      storniereBuchung: (id) =>
        setBuchungen((prev) => prev.filter((b) => b.id !== id)),
      buchungsEntwurf,
      setBuchungsEntwurf,
    }),
    [standortId, favoriten, buchungen, buchungsEntwurf],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState muss innerhalb von AppStateProvider verwendet werden")
  return ctx
}
