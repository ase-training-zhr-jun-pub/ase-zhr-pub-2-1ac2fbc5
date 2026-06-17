import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/app-layout"
import { RaeumeFindenPage } from "@/pages/RaeumeFindenPage"
import { RaumDetailPage } from "@/pages/RaumDetailPage"
import { SchnellbuchungPage } from "@/pages/SchnellbuchungPage"
import { MeineBuchungenPage } from "@/pages/MeineBuchungenPage"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/raeume" replace />} />
        <Route path="/raeume" element={<RaeumeFindenPage />} />
        <Route path="/raeume/:roomId" element={<RaumDetailPage />} />
        <Route path="/schnellbuchung" element={<SchnellbuchungPage />} />
        <Route path="/buchungen" element={<MeineBuchungenPage />} />
        <Route path="*" element={<Navigate to="/raeume" replace />} />
      </Route>
    </Routes>
  )
}

export default App
