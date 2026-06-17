import { useNavigate } from "react-router-dom"
import { ArrowLeft, Users, MapPin, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppState } from "@/lib/app-state"
import { getRaum, getStandort } from "@/lib/mock-data"

export function RaumauswahlBestaetigenPage() {
  const navigate = useNavigate()
  const { buchungsEntwurf } = useAppState()
  const raum = buchungsEntwurf ? getRaum(buchungsEntwurf.raumId) : undefined

  // Fallback: kein Buchungsentwurf (z. B. Reload/Direktaufruf) oder Raum nicht
  // gefunden. Der Entwurf lebt nur im Speicher (kein Persist, vgl. Prototyp-Scope).
  if (!buchungsEntwurf || !raum) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Keine Raumauswahl vorhanden. Bitte zuerst einen Konferenzraum und einen
          Zeitraum auswählen.
        </p>
        <Button variant="outline" onClick={() => navigate("/raeume")}>
          Zurück zur Suche
        </Button>
      </div>
    )
  }

  const standort = getStandort(raum.standortId)
  const datumLang = buchungsEntwurf.datum.split("-").reverse().join(".")

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Zurück
      </button>

      <div>
        <h1 className="text-xl font-semibold">Raumauswahl bestätigen</h1>
        <p className="text-sm text-muted-foreground">
          Prüfe deine Auswahl, bevor du die Buchungsdetails eingibst.
        </p>
      </div>

      {/* Gewählter Konferenzraum */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{raum.name}</h2>
            <p className="text-sm text-muted-foreground">Standort {standort?.name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-4" /> {raum.kapazitaet} Personen
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {raum.etage} · Raum {raum.raumnummer}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {raum.ausstattung.map((a) => (
              <Badge key={a} variant="secondary" className="font-normal">
                {a}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gewählter Zeitraum */}
      <Card>
        <CardContent className="flex items-center gap-2 p-4 text-sm">
          <CalendarClock className="size-4 text-muted-foreground" />
          <span className="font-medium">{datumLang}</span>
          <span className="text-muted-foreground">·</span>
          <span className="font-medium">
            {buchungsEntwurf.start}–{buchungsEntwurf.ende}
          </span>
        </CardContent>
      </Card>

      {/* Aktionen: Auswahl ändern (zurück zur Detailseite) oder bestätigen */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate(`/raeume/${raum.id}`)}
        >
          Auswahl ändern
        </Button>
        <Button
          size="lg"
          className="flex-1"
          // Anschlusspunkt für CLVN-017 (Buchungsnotiz) / CLVN-018 (Meetingtitel):
          // führt zum Buchungsdetails-Schritt, der dort umgesetzt wird.
          onClick={() => navigate("/buchung/details")}
        >
          Auswahl bestätigen
        </Button>
      </div>
    </div>
  )
}
