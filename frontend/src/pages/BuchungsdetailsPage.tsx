import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, CalendarClock, Loader2, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAppState } from "@/lib/app-state"
import { getRaum, getStandort } from "@/lib/mock-data"
import { erstelleBuchung, DoppelbuchungError } from "@/lib/api"

export function BuchungsdetailsPage() {
  const navigate = useNavigate()
  const { buchungsEntwurf, setBuchungsEntwurf, setLetzteBestaetigung } = useAppState()
  const raum = buchungsEntwurf ? getRaum(buchungsEntwurf.raumId) : undefined

  const [titel, setTitel] = useState("")
  const [notiz, setNotiz] = useState("")
  const [laden, setLaden] = useState(false)

  if (!buchungsEntwurf || !raum) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Keine Raumauswahl vorhanden. Bitte zuerst einen Konferenzraum auswählen.
        </p>
        <Button variant="outline" onClick={() => navigate("/raeume")}>
          Zurück zur Suche
        </Button>
      </div>
    )
  }

  const standort = getStandort(raum.standortId)
  const datumLang = buchungsEntwurf.datum.split("-").reverse().join(".")

  async function absenden() {
    if (!buchungsEntwurf) return
    setLaden(true)
    try {
      const buchung = await erstelleBuchung({
        raumId: buchungsEntwurf.raumId,
        standortId: buchungsEntwurf.standortId,
        datum: buchungsEntwurf.datum,
        start: buchungsEntwurf.start,
        ende: buchungsEntwurf.ende,
        titel: titel.trim(),
        notiz: notiz.trim() || undefined,
      })
      setLetzteBestaetigung(buchung)
      setBuchungsEntwurf(null)
      navigate("/buchung/bestaetigung")
    } catch (e) {
      if (e instanceof DoppelbuchungError) {
        toast.error("Raum bereits belegt", {
          description: "Jemand anderes hat diesen Zeitraum gerade gebucht. Bitte wähle einen anderen.",
        })
      } else {
        toast.error("Buchung fehlgeschlagen", {
          description: "Bitte versuche es erneut.",
        })
      }
    } finally {
      setLaden(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Zurück
      </button>

      <div>
        <h1 className="text-xl font-semibold">Buchungsdetails</h1>
        <p className="text-sm text-muted-foreground">Gib deinem Meeting einen Titel.</p>
      </div>

      {/* Zusammenfassung der Raumauswahl */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-4 text-sm">
          <div className="font-medium">{raum.name} · {standort?.name}</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" /> {raum.kapazitaet} Personen
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {raum.etage} · Raum {raum.raumnummer}
            </span>
            <span className="flex items-center gap-1">
              <CalendarClock className="size-3.5" /> {datumLang} · {buchungsEntwurf.start}–{buchungsEntwurf.ende}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {raum.ausstattung.map((a) => (
              <Badge key={a} variant="secondary" className="font-normal text-xs">
                {a}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meetingtitel (CLVN-018) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="meetingtitel">Meetingtitel *</Label>
        <Input
          id="meetingtitel"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          placeholder="z. B. Team-Sync"
          autoFocus
        />
      </div>

      {/* Buchungsnotiz (CLVN-017) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="buchungsnotiz">Buchungsnotiz (optional)</Label>
        <Input
          id="buchungsnotiz"
          value={notiz}
          onChange={(e) => setNotiz(e.target.value)}
          placeholder="z. B. VC vorbereiten, externe Teilnehmer"
        />
      </div>

      {/* Absenden (CLVN-019) */}
      <Button
        size="lg"
        className="w-full"
        disabled={!titel.trim() || laden}
        onClick={absenden}
      >
        {laden ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Wird gebucht…
          </>
        ) : (
          "Buchung absenden"
        )}
      </Button>
    </div>
  )
}
