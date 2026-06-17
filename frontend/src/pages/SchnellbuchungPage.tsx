import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Zap, Users, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppState } from "@/lib/app-state"
import {
  getRaeumeByStandort,
  getStandort,
  HEUTE,
  istVerfuegbar,
} from "@/lib/mock-data"

// Für den Prototyp ein fixes "Jetzt"-Fenster (30 Min), damit Screenshots stabil sind.
const JETZT_START = "15:30"
const JETZT_ENDE = "16:00"

export function SchnellbuchungPage() {
  const navigate = useNavigate()
  const { standortId, addBuchung } = useAppState()
  const standort = getStandort(standortId)
  const [dauer, setDauer] = useState(30)

  const ende = dauer === 30 ? JETZT_ENDE : "16:30"
  const vorschlag = getRaeumeByStandort(standortId).find((r) =>
    istVerfuegbar(r, HEUTE, JETZT_START, ende),
  )

  function buchen() {
    if (!vorschlag) return
    addBuchung({
      raumId: vorschlag.id,
      standortId,
      datum: HEUTE,
      start: JETZT_START,
      ende,
      titel: "Schnellbuchung",
    })
    toast.success("Schnell gebucht", {
      description: `${vorschlag.name} · ${JETZT_START}–${ende}`,
    })
    navigate("/buchungen")
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Zap className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold">Schnellbuchung</h1>
          <p className="text-sm text-muted-foreground">
            Sofort einen freien Raum in {standort?.name}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {[30, 60].map((d) => (
          <Button
            key={d}
            variant={dauer === d ? "default" : "outline"}
            className="flex-1"
            onClick={() => setDauer(d)}
          >
            <Clock className="size-4" /> {d} Min
          </Button>
        ))}
      </div>

      {vorschlag ? (
        <Card className="border-primary ring-1 ring-primary">
          <CardContent className="flex flex-col gap-3 p-4">
            <Badge className="w-fit bg-primary">Nächster freier Raum</Badge>
            <div>
              <h2 className="text-lg font-semibold">{vorschlag.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="size-4" /> {vorschlag.kapazitaet}</span>
                <span className="flex items-center gap-1"><MapPin className="size-4" /> {vorschlag.etage} · {vorschlag.raumnummer}</span>
                <span className="flex items-center gap-1"><Clock className="size-4" /> {JETZT_START}–{ende}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {vorschlag.ausstattung.map((a) => (
                <Badge key={a} variant="secondary" className="font-normal">{a}</Badge>
              ))}
            </div>
            <Button size="lg" className="w-full" onClick={buchen}>
              Jetzt buchen · {JETZT_START}–{ende}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Aktuell ist in {standort?.name} kein Raum für dieses Zeitfenster frei.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
