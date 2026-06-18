import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Users, MapPin, Star, CheckCircle, XCircle, Loader2, Projector, PenLine, Video, Monitor, Phone, CheckCircle2, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/app-state"
import { ALLE_AUSSTATTUNG, findeAlternativeZeitfenster, getRaum, getStandort, getStundenRaster, HEUTE, istVerfuegbar, type AusstattungsMerkmal } from "@/lib/mock-data"
import { pruefeVerfuegbarkeit } from "@/lib/api"

const AUSSTATTUNG_ICONS: Record<AusstattungsMerkmal, React.ElementType> = {
  Beamer: Projector,
  Whiteboard: PenLine,
  "VC-Equipment": Video,
  Display: Monitor,
  Telefon: Phone,
}

export function RaumDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { istFavorit, toggleFavorit, setBuchungsEntwurf, buchungsEntwurf } = useAppState()
  const raum = roomId ? getRaum(roomId) : undefined

  const [datum, setDatum] = useState(HEUTE)
  const [start, setStart] = useState("09:00")
  const [ende, setEnde] = useState("10:00")
  const [backendVerfuegbar, setBackendVerfuegbar] = useState<boolean | null>(null)
  const [prueft, setPrueft] = useState(false)

  // Verfügbarkeit im Backend prüfen (CLVN-010)
  useEffect(() => {
    if (!raum) return
    setPrueft(true)
    setBackendVerfuegbar(null)
    const timer = setTimeout(() => {
      pruefeVerfuegbarkeit(raum.id, datum, start, ende)
        .then((v) => setBackendVerfuegbar(v))
        .finally(() => setPrueft(false))
    }, 300) // Debounce
    return () => clearTimeout(timer)
  }, [raum, datum, start, ende])

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
  const favorit = istFavorit(raum.id)
  const zeitfensterUngueltig = start >= ende
  // Kombination: mock-Belegung (statische Daten) UND Backend-Stand
  const mockVerfuegbar = istVerfuegbar(raum, datum, start, ende)
  const verfuegbar = !zeitfensterUngueltig && mockVerfuegbar && (backendVerfuegbar ?? true)
  const istAusgewaehlt =
    buchungsEntwurf?.raumId === raum.id &&
    buchungsEntwurf.datum === datum &&
    buchungsEntwurf.start === start &&
    buchungsEntwurf.ende === ende

  const alternativeZeitfenster = useMemo(
    () => (verfuegbar || prueft ? [] : findeAlternativeZeitfenster(raum, datum, start, ende)),
    [verfuegbar, prueft, raum, datum, start, ende],
  )

  function raumAuswaehlen() {
    setBuchungsEntwurf({
      raumId: raum!.id,
      standortId: raum!.standortId,
      datum,
      start,
      ende,
    })
    navigate("/buchung/bestaetigen")
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
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{raum.name}</h1>
          <p className="text-sm text-muted-foreground">Standort {standort?.name}</p>
          {istAusgewaehlt && (
            <span className="flex w-fit items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <CheckCircle className="size-3" /> Ausgewählt
            </span>
          )}
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

      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <p className="text-sm font-medium">Ausstattung</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {ALLE_AUSSTATTUNG.map((a) => {
              const vorhanden = raum.ausstattung.includes(a)
              const Icon = AUSSTATTUNG_ICONS[a]
              return (
                <div
                  key={a}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    vorhanden ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {vorhanden ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  ) : (
                    <CircleX className="size-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <Icon className="size-4 shrink-0" />
                  <span className={cn(!vorhanden && "line-through")}>{a}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verfügbarkeits-Timeline (Übersicht aus Mock-Daten) */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-4">
          <p className="text-sm font-medium">
            Verfügbarkeit · {datum.split("-").reverse().join(".")}
          </p>
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
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500/70" /> frei
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-muted-foreground/30" /> belegt
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Zeitfenster wählen */}
      <Card>
        <CardContent className="grid grid-cols-3 gap-2 p-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="d-datum">
              Datum
            </Label>
            <Input
              id="d-datum"
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="d-start">
              Von
            </Label>
            <Input
              id="d-start"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs" htmlFor="d-ende">
              Bis
            </Label>
            <Input
              id="d-ende"
              type="time"
              value={ende}
              onChange={(e) => setEnde(e.target.value)}
              className="h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Verfügbarkeitsstatus (CLVN-010) */}
      <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
        {prueft ? (
          <>
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Verfügbarkeit wird geprüft…</span>
          </>
        ) : verfuegbar ? (
          <>
            <CheckCircle className="size-4 text-emerald-500" />
            <span className="font-medium text-emerald-700">Verfügbar für diesen Zeitraum</span>
          </>
        ) : (
          <>
            <XCircle className="size-4 text-destructive" />
            <span className="font-medium text-destructive">Im gewählten Zeitfenster belegt</span>
          </>
        )}
      </div>

      {/* Alternative Zeitfenster (CLVN-012) */}
      {!verfuegbar && !prueft && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Alternative Zeitfenster</p>
          {alternativeZeitfenster.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {alternativeZeitfenster.map((alt) => (
                <Button
                  key={`${alt.start}-${alt.ende}`}
                  variant="outline"
                  size="sm"
                  onClick={() => { setStart(alt.start); setEnde(alt.ende) }}
                >
                  {alt.start}–{alt.ende}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Kein freies Zeitfenster am gewählten Tag verfügbar.
            </p>
          )}
        </div>
      )}

      {/* Raum auswählen (CLVN-016c) */}
      <Button
        size="lg"
        className="w-full"
        disabled={!verfuegbar || prueft || zeitfensterUngueltig}
        onClick={raumAuswaehlen}
      >
        Raum auswählen
      </Button>
    </div>
  )
}
