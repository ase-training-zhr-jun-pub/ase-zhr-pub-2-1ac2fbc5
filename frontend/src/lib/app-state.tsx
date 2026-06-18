/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { AKTUELLER_NUTZER, type BuchungsEntwurf } from "@/lib/mock-data"
import type { BuchungDto } from "@/lib/api"

interface AppState {
  standortId: string
  setStandortId: (id: string) => void
  favoriten: Set<string>
  toggleFavorit: (raumId: string) => void
  istFavorit: (raumId: string) => boolean
  /** Laufende Raumauswahl im Buchungsprozess (CLVN-016); null = kein Entwurf. */
  buchungsEntwurf: BuchungsEntwurf | null
  /** Entwurf starten/aktualisieren oder mit null verwerfen. */
  setBuchungsEntwurf: (entwurf: BuchungsEntwurf | null) => void
  /** Zuletzt bestätigte Buchung für die Bestätigungsseite (CLVN-020). */
  letzteBestaetigung: BuchungDto | null
  setLetzteBestaetigung: (b: BuchungDto | null) => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [standortId, setStandortId] = useState(AKTUELLER_NUTZER.heimatStandortId)
  const [favoriten, setFavoriten] = useState<Set<string>>(
    () => new Set(["koeln-rhein"]),
  )
  const [buchungsEntwurf, setBuchungsEntwurf] = useState<BuchungsEntwurf | null>(null)
  const [letzteBestaetigung, setLetzteBestaetigung] = useState<BuchungDto | null>(null)

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
      buchungsEntwurf,
      setBuchungsEntwurf,
      letzteBestaetigung,
      setLetzteBestaetigung,
    }),
    [standortId, favoriten, buchungsEntwurf, letzteBestaetigung],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState muss innerhalb von AppStateProvider verwendet werden")
  return ctx
}
