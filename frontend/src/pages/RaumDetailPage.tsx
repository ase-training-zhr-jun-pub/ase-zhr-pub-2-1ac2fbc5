import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, Users, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"
import {
  getRaum,
  getStandort,
  getStundenRaster,
  HEUTE,
  istVerfuegbar,
} from "@/lib/mock-data"

export function RaumDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { addBuchung, istFavorit, toggleFavorit } = useAppState()
  const raum = roomId ? getRaum(roomId) : undefined

  const [datum, setDatum] = useState(HEUTE)
  const [start, setStart] = useState("09:00")
  const [ende, setEnde] = useState("10:00")
  const [titel, setTitel] = useState("")
  const [notiz, setNotiz] = useState("")
  const [dialogOffen, setDialogOffen] = useState(false)

  if (!raum) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">Raum nicht gefunden.</p>
        <Button variant="outline" onClick={() => navigate("/raeume")}>
          Zurück zur Suche
        </Button>
      </div>
    )
  }

  const standort = getStandort(raum.standortId)
  const raster = getStundenRaster(raum, datum)
  const verfuegbar = istVerfuegbar(raum, datum, start, ende)
  const favorit = istFavorit(raum.id)

  function buchen() {
    if (!raum) return
    const neu = addBuchung({
      raumId: raum.id,
      standortId: raum.standortId,
      datum,
      start,
      ende,
      titel: titel.trim() || "Raumbuchung",
      notiz: notiz.trim() || undefined,
    })
    setDialogOffen(false)
    toast.success("Raum gebucht", {
      description: `${raum.name} · ${datum.split("-").reverse().join(".")} · ${start}–${ende}`,
    })
    navigate("/buchungen", { state: { highlight: neu.id } })
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Zurück
      </button>

      {/* Visual */}
      <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-3xl font-bold text-primary/40">
        {raum.name}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{raum.name}</h1>
          <p className="text-sm text-muted-foreground">Standort {standort?.name}</p>
        </div>
        <button
          onClick={() => toggleFavorit(raum.id)}
          aria-label="Favorit umschalten"
          className="text-muted-foreground hover:text-primary"
        >
          <Star className={cn("size-6", favorit && "fill-primary text-primary")} />
        </button>
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
          <Badge key={a} variant="secondary" className="font-normal">{a}</Badge>
        ))}
      </div>

      {/* Verfügbarkeits-Timeline */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <p className="text-sm font-medium">Verfügbarkeit · {datum.split("-").reverse().join(".")}</p>
          <div className="flex gap-0.5">
            {raster.map((slot) => (
              <div key={slot.stunde} className="flex flex-1 flex-col items-center gap-1">
                <div
                  title={slot.belegt ? slot.titel : "frei"}
                  className={cn(
                    "h-8 w-full rounded-sm",
                    slot.belegt ? "bg-muted-foreground/30" : "bg-emerald-500/70",
                  )}
                />
                <span className="text-[9px] text-muted-foreground">{slot.stunde}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500/70" /> frei</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-muted-foreground/30" /> belegt</span>
          </div>
        </CardContent>
      </Card>

      {/* Zeitfenster wählen */}
      <Card>
        <CardContent className="grid grid-cols-3 gap-2 p-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="d-datum">Datum</Label>
            <Input id="d-datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className="h-9" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="d-start">Von</Label>
            <Input id="d-start" type="time" value={start} onChange={(e) => setStart(e.target.value)} className="h-9" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="d-ende">Bis</Label>
            <Input id="d-ende" type="time" value={ende} onChange={(e) => setEnde(e.target.value)} className="h-9" />
          </div>
        </CardContent>
      </Card>

      {/* Buchen */}
      <Dialog open={dialogOffen} onOpenChange={setDialogOffen}>
        <DialogTrigger
          render={<Button size="lg" disabled={!verfuegbar} className="w-full" />}
        >
          {verfuegbar ? "Raum buchen" : "Im gewählten Zeitfenster belegt"}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buchung bestätigen</DialogTitle>
            <DialogDescription>
              {raum.name} · {standort?.name} · {datum.split("-").reverse().join(".")} · {start}–{ende}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="titel">Meetingtitel</Label>
              <Input id="titel" value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="z. B. Team-Sync" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="notiz">Buchungsnotiz (optional)</Label>
              <Input id="notiz" value={notiz} onChange={(e) => setNotiz(e.target.value)} placeholder="z. B. VC vorbereiten" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOffen(false)}>Abbrechen</Button>
            <Button onClick={buchen}>Verbindlich buchen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
