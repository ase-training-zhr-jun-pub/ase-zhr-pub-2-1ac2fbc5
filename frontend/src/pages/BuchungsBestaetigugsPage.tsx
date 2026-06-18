import { useNavigate } from "react-router-dom"
import { CheckCircle, CalendarClock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/lib/app-state"
import { getRaum, getStandort } from "@/lib/mock-data"

export function BuchungsBestaetigugsPage() {
  const navigate = useNavigate()
  const { letzteBestaetigung } = useAppState()

  if (!letzteBestaetigung) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">Keine Buchungsbestätigung vorhanden.</p>
        <Button variant="outline" onClick={() => navigate("/buchungen")}>
          Zu meinen Buchungen
        </Button>
      </div>
    )
  }

  const raum = getRaum(letzteBestaetigung.raumId)
  const standort = getStandort(letzteBestaetigung.standortId)
  const datumLang = letzteBestaetigung.datum.split("-").reverse().join(".")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <CheckCircle className="size-12 text-emerald-500" />
        <h1 className="text-xl font-semibold">Buchung bestätigt</h1>
        <p className="text-sm text-muted-foreground">
          Dein Konferenzraum ist reserviert.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Konferenzraum
            </p>
            <p className="mt-0.5 text-lg font-semibold">{raum?.name ?? letzteBestaetigung.raumId}</p>
            <p className="text-sm text-muted-foreground">Standort {standort?.name ?? letzteBestaetigung.standortId}</p>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4 text-muted-foreground" />
              <span className="font-medium">{datumLang}</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-medium">{letzteBestaetigung.start}–{letzteBestaetigung.ende}</span>
            </span>
            {raum && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" /> {raum.etage} · Raum {raum.raumnummer}
              </span>
            )}
            {raum && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-4" /> bis {raum.kapazitaet} Personen
              </span>
            )}
          </div>

          {raum && (
            <div className="flex flex-wrap gap-1">
              {raum.ausstattung.map((a) => (
                <Badge key={a} variant="secondary" className="font-normal text-xs">
                  {a}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Meetingtitel</p>
            <p className="mt-0.5 font-medium">{letzteBestaetigung.titel}</p>
          </div>

          {letzteBestaetigung.notiz && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Buchungsnotiz</p>
              <p className="mt-0.5 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                {letzteBestaetigung.notiz}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button size="lg" className="w-full" onClick={() => navigate("/buchungen")}>
        Zu meinen Buchungen
      </Button>
    </div>
  )
}
