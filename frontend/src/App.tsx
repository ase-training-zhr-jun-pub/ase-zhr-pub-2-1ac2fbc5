import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/app-layout"
import { RaeumeFindenPage } from "@/pages/RaeumeFindenPage"
import { RaumDetailPage } from "@/pages/RaumDetailPage"
import { RaumauswahlBestaetigenPage } from "@/pages/RaumauswahlBestaetigenPage"
import { SchnellbuchungPage } from "@/pages/SchnellbuchungPage"
import { MeineBuchungenPage } from "@/pages/MeineBuchungenPage"

// Platzhalter-Anschluss für den Buchungsdetails-Schritt. Ziel der Bestätigung aus
// CLVN-016b; mit Meetingtitel/Buchungsnotiz gefüllt in CLVN-018/CLVN-017.
function BuchungsdetailsPlatzhalter() {
  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      Buchungsdetails – wird in CLVN-017/CLVN-018 umgesetzt.
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/raeume" replace />} />
        <Route path="/raeume" element={<RaeumeFindenPage />} />
        <Route path="/raeume/:roomId" element={<RaumDetailPage />} />
        <Route path="/buchung/bestaetigen" element={<RaumauswahlBestaetigenPage />} />
        <Route path="/buchung/details" element={<BuchungsdetailsPlatzhalter />} />
        <Route path="/schnellbuchung" element={<SchnellbuchungPage />} />
        <Route path="/buchungen" element={<MeineBuchungenPage />} />
        <Route path="*" element={<Navigate to="/raeume" replace />} />
      </Route>
    </Routes>
  )
}

export default App
